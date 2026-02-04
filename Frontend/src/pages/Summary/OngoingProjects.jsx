import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../Dashboard/DashboardHeader/DashboardHeader";

export default function OngoingProjects() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const scrollerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Constants for column mapping
  const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
  const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
  const COL_ACTUAL_EXP =
    "Actual Expenditure  Upto (14 Feb 2025) (PKR Millions)";
  const COL_ONGOING = "Ongoing / Completed";
  const COL_PRIORITY = "Priority Projects";
  const COL_CHANGE = "Change Record";

  // Simple logo set from public/ assets
  const LOGOS = ["/Ruda.jpg", "/NLC-logo.jpg", "/Nespak.jpg", "/Habib.jpg"];

  // Pick a logo for a given project. If we can detect a contractor keyword, use it; otherwise pick a stable pseudo-random logo.
  const pickLogoForProject = (name, serialNumberHint = 0) => {
    const n = (name || "").toLowerCase();
    if (n.includes("nlc")) return "/NLC-logo.jpg";
    if (n.includes("nespak")) return "/Nespak.jpg";
    if (n.includes("habib") || n.includes("hcs")) return "/Habib.jpg";
    // Stable pseudo-random choice based on serial number and name length
    const idx = Math.abs((serialNumberHint + n.length) % LOGOS.length);
    return LOGOS[idx];
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, query, filterValue]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      initializeExpandedCategories();
    }
  }, [data]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/Sheet.json");
      if (!response.ok) throw new Error("Failed to load data");

      const jsonData = await response.json();
      const sheet = jsonData.workbook?.sheets?.[0];

      if (!sheet?.rows) throw new Error("Invalid data structure");

      // Process and filter ongoing projects
      const processedData = processOngoingProjects(sheet.rows);
      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processOngoingProjects = (rows) => {
    const ongoingProjects = [];
    let serialNumber = 1;

    rows.forEach((row) => {
      const projectName = row[COL_BREAKDOWN];
      const status = row[COL_ONGOING];

      // Skip if no project name
      if (!projectName) return;

      // Check if this is an ongoing project
      if (status === "Ongoing") {
        const project = {
          serialNumber: serialNumber++,
          projectName: projectName,
          category: categorizeProject(projectName),
          startDate: extractStartDate(row),
          finishDate: extractFinishDate(row),
          valueOfContract: formatValue(row[COL_BUDGET_EST]),
          physicalPlan: calculatePhysicalPlan(),
          physicalActual: calculatePhysicalActual(row),
          paymentsCertified: formatValue(row[COL_ACTUAL_EXP]),
          remarks: row[COL_CHANGE] || "-",
          logoUrl: "", // filled below
        };

        project.logoUrl = pickLogoForProject(
          project.projectName,
          project.serialNumber
        );
        ongoingProjects.push(project);
      }
    });

    // Group projects by category
    const groupedProjects = {};
    ongoingProjects.forEach((project) => {
      if (!groupedProjects[project.category]) {
        groupedProjects[project.category] = [];
      }
      groupedProjects[project.category].push(project);
    });

    return groupedProjects;
  };

  const categorizeProject = (projectName) => {
    const name = projectName.toLowerCase();

    if (name.includes("rtw") || name.includes("river training")) {
      return "River Training Works";
    }
    if (
      name.includes("feasibility") &&
      (name.includes("design") || name.includes("hydrological"))
    ) {
      return "Feasibility, Design & Hydrological Studies";
    }
    if (
      name.includes("feasibility") &&
      (name.includes("survey") || name.includes("design"))
    ) {
      return "Feasibility, Design & Surveys";
    }
    if (
      name.includes("wwtp") ||
      name.includes("waste water") ||
      name.includes("treatment plant")
    ) {
      return "WWTPs";
    }
    if (
      name.includes("infra") ||
      name.includes("road") ||
      name.includes("bridge") ||
      name.includes("utilities") ||
      name.includes("development")
    ) {
      return "Infrastructure";
    }
    return "Other Projects";
  };

  const extractStartDate = (row) => {
    // Extract start date from FY columns - find first non-null/non-zero value
    const fyColumns = [
      "FY 20-21",
      "FY 21-22",
      "FY 22-23",
      "FY 23-24",
      "FY 24-25",
      "FY 25-26",
    ];

    for (const fy of fyColumns) {
      if (row[fy] && row[fy] > 0) {
        return convertFYToDate(fy, true);
      }
    }
    return "-";
  };

  const extractFinishDate = (row) => {
    // Extract finish date from FY columns - find last non-null/non-zero value
    const fyColumns = [
      "FY 35-36",
      "FY 34-35",
      "FY 33-34",
      "FY 32-33",
      "FY 31-32",
      "FY 30-31",
      "FY 29-30",
      "FY 28-29",
      "FY 27-28",
      "FY 26-27",
      "FY 25-26",
      "FY 24-25",
    ];

    for (const fy of fyColumns) {
      if (row[fy] && row[fy] > 0) {
        return convertFYToDate(fy, false);
      }
    }
    return "-";
  };

  const convertFYToDate = (fy, isStart) => {
    const yearMatch = fy.match(/FY (\d{2})-(\d{2})/);
    if (!yearMatch) return "-";

    const startYear = 2000 + parseInt(yearMatch[1]);
    const endYear = 2000 + parseInt(yearMatch[2]);

    if (isStart) {
      return `01-Jul-${startYear}`;
    } else {
      return `30-Jun-${endYear}`;
    }
  };

  const calculatePhysicalPlan = () => {
    // This would need actual plan data - for now return placeholder
    return Math.floor(Math.random() * 100) + "%";
  };

  const calculatePhysicalActual = (row) => {
    const budget = row[COL_BUDGET_EST];
    const actual = row[COL_ACTUAL_EXP];

    if (budget && actual && budget > 0) {
      const percentage = Math.min(100, Math.round((actual / budget) * 100));
      return percentage + "%";
    }
    return "-";
  };

  const formatValue = (value) => {
    if (!value || value === 0) return "-";
    if (typeof value === "number") {
      return (value / 1000).toFixed(2); // Convert to billions and format
    }
    return "-";
  };

  const applyFilters = () => {
    const filteredGroups = {};

    Object.keys(data).forEach((category) => {
      let categoryProjects = [...data[category]];

      // Apply search filter
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        categoryProjects = categoryProjects.filter(
          (item) =>
            item.projectName.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.remarks.toLowerCase().includes(searchTerm)
        );
      }

      // Apply dropdown filter
      if (filterValue !== "all") {
        if (category.toLowerCase().includes(filterValue.toLowerCase())) {
          // Keep all projects in this category
        } else {
          categoryProjects = []; // Filter out this entire category
        }
      }

      // Only include categories that have projects after filtering
      if (categoryProjects.length > 0) {
        filteredGroups[category] = categoryProjects;
      }
    });

    setFilteredData(filteredGroups);
  };

  const getUniqueCategories = () => {
    return Object.keys(data).sort();
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const initializeExpandedCategories = () => {
    const categories = Object.keys(data);
    const expanded = {};
    categories.forEach((category) => {
      expanded[category] = true; // All categories expanded by default
    });
    setExpandedCategories(expanded);
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    background: "#f5f5f5",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontSize: "16px",
            background: "white",
            margin: "20px",
            borderRadius: "8px",
          }}
        >
          Loading ongoing projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontSize: "16px",
            background: "white",
            margin: "20px",
            borderRadius: "8px",
            color: "#dc2626",
          }}
        >
          Error: {error}
        </div>
      </div>
    );
  }

  const headerStyle = {
    background:
      "radial-gradient(farthest-side ellipse at 20% 0, #333867 40%, #23274b)",
    color: "white",
    padding: "15px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const controlsStyle = {
    background: "white",
    padding: isMobile ? "10px" : "15px 20px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "15px",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "center",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
  };

  const searchInputStyle = {
    width: isMobile ? "100%" : "300px",
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const filterButtonStyle = (isActive) => ({
    padding: "8px 16px",
    border: "1px solid #cbd5e0",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: isActive ? 600 : 500,
    cursor: "pointer",
    backgroundColor: isActive ? "#1e3a5f" : "white",
    color: isActive ? "white" : "#1e3a5f",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  });

  const tableContainerStyle = {
    flex: 1,
    overflow: "auto",
    background: "white",
    margin: 0,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1400px",
  };

  const headerRowStyle = {
    background: "#113055",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  const headerCellStyle = {
    padding: "12px 8px",
    border: "1px solid #204871",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "12px",
    verticalAlign: "middle",
  };

  return (
    <div style={containerStyle}>
      <DashboardHeader />

      {/* Page TitleRow */}
      <div
        style={{
          padding: "15px 20px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#1e3a5f",
            textAlign: "center",
          }}
        >
          ONGOING DEVELOPMENT PROJECTS
        </h2>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={searchInputStyle}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setFilterValue("all")}
            style={filterButtonStyle(filterValue === "all")}
            onMouseEnter={(e) => {
              if (filterValue !== "all") {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
              }
            }}
            onMouseLeave={(e) => {
              if (filterValue !== "all") {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            All Categories
          </button>
          {getUniqueCategories().map((category) => (
            <button
              key={category}
              onClick={() => setFilterValue(category)}
              style={filterButtonStyle(filterValue === category)}
              onMouseEnter={(e) => {
                if (filterValue !== category) {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseLeave={(e) => {
                if (filterValue !== category) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={tableContainerStyle} ref={scrollerRef}>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th
                style={{ ...headerCellStyle, width: "80px", minWidth: "80px" }}
              >
                Sr No.
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "300px",
                  minWidth: "300px",
                }}
              >
                Project Name
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Start Date
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Finish Date
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "150px",
                  minWidth: "150px",
                }}
              >
                Value of Contract
                <br />
                (in millions)
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Physical Plan %
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Physical Actual %
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "150px",
                  minWidth: "150px",
                }}
              >
                Payments Certified
                <br />
                (in millions)
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "200px",
                  minWidth: "200px",
                }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(filteredData).length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  No ongoing projects found
                </td>
              </tr>
            ) : (
              Object.keys(filteredData).map((category) => {
                const isExpanded = expandedCategories[category];
                const projects = filteredData[category];

                return (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr
                      style={{
                        background: "#2d3748",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      onClick={() => toggleCategory(category)}
                    >
                      <td
                        colSpan="9"
                        style={{
                          padding: "12px 15px",
                          border: "1px solid #357abd",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ marginRight: "10px" }}>
                          {isExpanded ? "▼" : "▶"}
                        </span>
                        {category} ({projects.length} projects)
                      </td>
                    </tr>

                    {/* Project Rows - Only show if expanded */}
                    {isExpanded &&
                      projects.map((project, index) => {
                        const cellStyle = {
                          padding: "10px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "500",
                        };

                        const nameCellStyle = {
                          ...cellStyle,
                          textAlign: "left",
                          paddingLeft: "25px", // Indent sub-projects
                          color: "#4a5568",
                        };

                        return (
                          <tr
                            key={`${category}-${index}`}
                            style={{
                              background: index % 2 === 0 ? "#f7fafc" : "white",
                              borderLeft: "3px solid #cbd5e0",
                            }}
                          >
                            <td style={cellStyle}>{project.serialNumber}</td>
                            <td style={nameCellStyle}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "8px",
                                }}
                              >
                                <span style={{ flex: 1 }}>
                                  {project.projectName}
                                </span>
                                {project.logoUrl && (
                                  <img
                                    src={project.logoUrl}
                                    alt="project logo"
                                    style={{
                                      width: 48,
                                      height: 48,
                                      objectFit: "contain",
                                      borderRadius: 3,
                                    }}
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            </td>
                            <td style={cellStyle}>{project.startDate}</td>
                            <td style={cellStyle}>{project.finishDate}</td>
                            <td style={cellStyle}>{project.valueOfContract}</td>
                            <td style={cellStyle}>{project.physicalPlan}</td>
                            <td style={cellStyle}>{project.physicalActual}</td>
                            <td style={cellStyle}>
                              {project.paymentsCertified}
                            </td>
                            <td
                              style={{
                                ...cellStyle,
                                fontSize: "11px",
                                color: "#4a5568",
                              }}
                            >
                              {project.remarks}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
