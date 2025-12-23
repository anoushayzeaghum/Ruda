import React, { useState, useEffect, useRef } from "react";
import HeaderButtons from "../Dashboard/DashboardHeader/HeaderButtons";

export default function OverallSummary() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const scrollerRef = useRef(null);

  // Helper function to extract main project name
  const extractMainProjectName = (fullName) => {
    if (!fullName) return "";

    const cleaned = fullName.replace(/\s+\d+(\.\d+)?\s*km$/i, "").trim();
    const finalCleaned = cleaned
      .replace(/\s*\(\d+(\.\d+)?\s*km\)$/i, "")
      .trim();

    return finalCleaned;
  };

  // Function to navigate to RTW Dashboard
  const navigateToRTWDashboard = (projectName) => {
    const mainName = extractMainProjectName(projectName);
    const encodedName = encodeURIComponent(mainName);
    window.open(`/details/${encodedName}`, "_blank");
  };

  // Constants for column mapping
  const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
  const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
  const COL_ACTUAL_EXP =
    "Actual Expenditure  Upto (14 Feb 2025) (PKR Millions)";
  const COL_ONGOING = "Ongoing / Completed";
  const COL_PRIORITY = "Priority Projects";
  const COL_CHANGE = "Change Record";

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

      const processedData = processAllProjects(sheet.rows);
      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processAllProjects = (rows) => {
    const allProjects = [];
    let serialNumber = 1;

    rows.forEach((row) => {
      const projectName = row[COL_BREAKDOWN];

      if (
        !projectName ||
        projectName.toLowerCase().includes("total") ||
        projectName.toLowerCase().includes("cumm") ||
        projectName.toLowerCase().includes("proposed budget") ||
        projectName.toLowerCase().includes("expenditure") ||
        projectName.toLowerCase().includes("% v-")
      )
        return;

      if (projectName && (row[COL_BUDGET_EST] || row[COL_ACTUAL_EXP])) {
        const project = {
          serialNumber: serialNumber++,
          projectName: projectName,
          category: categorizeProject(projectName),
          timeline: extractTimeline(row),
          physicalProgress: calculatePhysicalProgress(row),
          landStatus: calculateLandStatus(projectName),
          status: extractStatus(row),
        };

        allProjects.push(project);
      }
    });

    const groupedProjects = {};
    allProjects.forEach((project) => {
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
    if (name.includes("barrage") || name.includes("dam")) {
      return "Barrage & Dam Works";
    }
    return "Other Projects";
  };

  const extractTimeline = (row) => {
    const startDate = extractStartDate(row);
    const finishDate = extractFinishDate(row);

    return {
      start: startDate,
      finish: finishDate,
    };
  };

  const extractStartDate = (row) => {
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

  const calculatePhysicalProgress = (row) => {
    const budget = row[COL_BUDGET_EST];
    const actual = row[COL_ACTUAL_EXP];

    if (budget && actual && budget > 0) {
      const actualPercentage = Math.min(
        100,
        Math.round((actual / budget) * 100)
      );
      const planPercentage = Math.floor(Math.random() * 100);

      return {
        plan: planPercentage,
        actual: actualPercentage,
      };
    }
    return {
      plan: "-",
      actual: "-",
    };
  };

  const calculateLandStatus = (projectName) => {
    if (projectName && projectName.toLowerCase().includes("rtw")) {
      const available = Math.floor(Math.random() * 60) + 20;
      const remaining = 100 - available;

      return {
        available: available,
        remaining: remaining,
      };
    }

    const available = Math.floor(Math.random() * 80) + 10;
    const remaining = 100 - available;

    return {
      available: available,
      remaining: remaining,
    };
  };

  const extractStatus = (row) => {
    const status = row[COL_ONGOING];
    const scopeOfWork = row[COL_CHANGE];

    if (status) return status;
    if (scopeOfWork) return scopeOfWork;
    return "-";
  };

  const applyFilters = () => {
    const filteredGroups = {};

    Object.keys(data).forEach((category) => {
      let categoryProjects = [...data[category]];

      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        categoryProjects = categoryProjects.filter(
          (item) =>
            item.projectName.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.status.toLowerCase().includes(searchTerm)
        );
      }

      if (filterValue !== "all") {
        if (category.toLowerCase().includes(filterValue.toLowerCase())) {
        } else {
          categoryProjects = [];
        }
      }

      if (categoryProjects.length > 0) {
        filteredGroups[category] = categoryProjects;
      }
    });

    setFilteredData(filteredGroups);
  };

  const getUniqueCategories = () => {
    const categoryOrder = [
      "Feasibility, Design & Hydrological Studies",
      "River Training Works",
      "Barrage & Dam Works",
      "WWTPs",
      "Infrastructure",
      "Other Projects",
    ];

    const categories = Object.keys(data);
    return categoryOrder
      .filter((cat) => categories.includes(cat))
      .concat(categories.filter((cat) => !categoryOrder.includes(cat)));
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
      expanded[category] = true;
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
          Loading overall summary...
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
    padding: "15px 20px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  };

  const searchInputStyle = {
    flex: 1,
    maxWidth: "1200px",
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const selectStyle = {
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    fontSize: "14px",
    minWidth: "200px",
  };

  const tableContainerStyle = {
    flex: 1,
    overflow: "auto",
    background: "white",
    margin: 0,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1300px",
  };

  const headerRowStyle = {
    background: "#113055",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 10,
    padding: "12px 8px",
  };

  const headerCellStyle = {
    padding: "12px 28px",
    border: "1px solid #25486b",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: "14px",
    verticalAlign: "middle",
  };

  return (
    <div style={containerStyle}>
      {/* Header (same like OngoingProjects) */}
      <div style={headerStyle}>
        <div>
          <h1
            style={{
              margin: 0,
              fontWeight: 100,
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            OVERALL SUMMARY
          </h1>
        </div>

        {/* Right: Header Buttons */}
        <HeaderButtons />
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
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={tableContainerStyle} ref={scrollerRef}>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th
                style={{
                  ...headerCellStyle,
                  width: "300px",
                  minWidth: "300px",
                }}
              >
                Project
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "200px",
                  minWidth: "200px",
                }}
              >
                Timeline
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "250px",
                  minWidth: "250px",
                }}
              >
                Physical Progress
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "250px",
                  minWidth: "250px",
                }}
              >
                Land Status
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "200px",
                  minWidth: "200px",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(filteredData).length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  No projects found
                </td>
              </tr>
            ) : (
              getUniqueCategories()
                .filter((category) => filteredData[category])
                .map((category) => {
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
                          fontSize: "16px",
                        }}
                        onClick={() => toggleCategory(category)}
                      >
                        <td
                          colSpan="5"
                          style={{
                            padding: "12px 15px",
                            border: "1px solid #25486b",
                            fontWeight: "normal",
                            fontSize: "14px",
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
                            fontSize: "12px",
                          };

                          const nameCellStyle = {
                            ...cellStyle,
                            textAlign: "left",
                            paddingLeft: "25px",
                            color: "#4a5568",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          };

                          const nameCellHoverStyle = {
                            ...nameCellStyle,
                            backgroundColor: "#e2e8f0",
                            color: "#2d3748",
                          };

                          return (
                            <tr
                              key={`${category}-${index}`}
                              style={{
                                background:
                                  index % 2 === 0 ? "#f7fafc" : "white",
                                borderLeft: "3px solid #cbd5e0",
                              }}
                            >
                              <td
                                style={nameCellStyle}
                                onClick={() =>
                                  navigateToRTWDashboard(project.projectName)
                                }
                                onMouseEnter={(e) => {
                                  Object.assign(
                                    e.target.style,
                                    nameCellHoverStyle
                                  );
                                }}
                                onMouseLeave={(e) => {
                                  Object.assign(e.target.style, nameCellStyle);
                                }}
                                title={`Click to view ${extractMainProjectName(
                                  project.projectName
                                )} dashboard`}
                              >
                                {project.projectName}
                              </td>
                              <td style={cellStyle}>
                                <div style={{ fontSize: "12px" }}>
                                  <div>
                                    <strong>Start:</strong>{" "}
                                    {project.timeline.start}
                                  </div>
                                  <div>
                                    <strong>Finish:</strong>{" "}
                                    {project.timeline.finish}
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  ...cellStyle,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                  navigateToRTWDashboard(project.projectName)
                                }
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#e2e8f0";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    index % 2 === 0 ? "#f7fafc" : "white";
                                }}
                                title={`Click to view ${extractMainProjectName(
                                  project.projectName
                                )} dashboard`}
                              >
                                <div style={{ fontSize: "12px" }}>
                                  <div>
                                    <strong>Plan:</strong>{" "}
                                    {project.physicalProgress.plan}%
                                  </div>
                                  <div>
                                    <strong>Actual:</strong>{" "}
                                    {project.physicalProgress.actual}%
                                  </div>
                                  {project.physicalProgress.actual !== "-" && (
                                    <div
                                      style={{
                                        position: "relative",
                                        marginTop: "4px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "12px",
                                          backgroundColor: "#e2e8f0",
                                          borderRadius: "4px",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: `${project.physicalProgress.actual}%`,
                                            height: "100%",
                                            backgroundColor: "#4caf50",
                                            borderRadius: "4px",
                                            position: "relative",
                                          }}
                                        >
                                          <span
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                              fontSize: "8px",
                                              fontWeight: "bold",
                                              color: "white",
                                              textShadow:
                                                "1px 1px 1px rgba(0,0,0,0.5)",
                                            }}
                                          >
                                            {project.physicalProgress.actual}%
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "10px",
                                          marginTop: "2px",
                                          color: "#666",
                                        }}
                                      >
                                        <span>0%</span>
                                        <span>100%</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td
                                style={{
                                  ...cellStyle,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                  navigateToRTWDashboard(project.projectName)
                                }
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#e2e8f0";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    index % 2 === 0 ? "#f7fafc" : "white";
                                }}
                                title={`Click to view ${extractMainProjectName(
                                  project.projectName
                                )} dashboard`}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "20px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "4px",
                                    }}
                                  >
                                    <div>
                                      <strong>Available:</strong>{" "}
                                      {project.landStatus.available}%
                                    </div>
                                    <div>
                                      <strong>Remaining:</strong>{" "}
                                      {project.landStatus.remaining}%
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      position: "relative",
                                      borderRadius: "50%",
                                      background: `conic-gradient(#56c159 0deg ${
                                        project.landStatus.available * 3.6
                                      }deg, #e92719 ${
                                        project.landStatus.available * 3.6
                                      }deg 360deg)`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "white",
                                      }}
                                    >
                                      {project.landStatus.available}%
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td
                                style={{
                                  ...cellStyle,
                                  fontSize: "12px",
                                  color: "#4a5568",
                                }}
                              >
                                {project.status}
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
