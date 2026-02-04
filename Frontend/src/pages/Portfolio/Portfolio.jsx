import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import {
  Clock,
  MapPin,
  Building,
  Droplets,
  Recycle,
  Printer,
  Trees,
  Lightbulb,
  Route,
  Waves,
  TrendingUp,
  Star,
} from "lucide-react";
import "./Portfolio.css";
import styles from "./styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ProjectMilestone from "../Summary/ProjectMilestone";
import priorityData from "./portfolioPriorityData.json";
import DashboardHeader from "../Dashboard/DashboardHeader/DashboardHeader";

const API_URL = "https://ruda-planning.onrender.com/api/portfoliocrud/";

// Safe number helpers
const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v));
const pctClamp = (v) => Math.max(0, Math.min(100, num(v)));
const fmtPKR = (v) => {
  const n = num(v);
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  return n.toLocaleString();
};

const formatDuration = (years) => {
  const n = num(years);
  if (n === 0) return "0 Years";
  if (n < 1) return `${Math.round(n * 12)} Months`;
  return `${n} Years`;
};

const Portfolio = () => {
  const [row, setRow] = useState(null);
  const [usePriority, setUsePriority] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // API returns an array from GET /
        setRow(Array.isArray(json) ? json[0] : json);
      } catch (e) {
        console.error(e);
        setErr("Failed to load data from portfolio API");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const MetricCard = ({ icon: Icon, title, value }) => (
    <div
      style={{ ...styles.metricCard, cursor: "pointer" }}
      onClick={() => {
        window.location.href = "/hierarchical-gantt";
      }}
      title="Click to view Hierarchical Gantt"
    >
      <div style={styles.metricIcon}>
        <Icon size={20} />
      </div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricTitle}>{title}</div>
    </div>
  );

  const ProgressCard = ({ title, percentage, color }) => {
    const p = pctClamp(percentage);
    return (
      <div style={styles.progressCard}>
        <div
          style={{
            ...styles.progressCircle,
            background: `conic-gradient(${color} ${p * 3.6}deg, #e5e7eb ${p * 3.6
              }deg)`,
          }}
        >
          <div style={styles.progressInner}>
            <span style={{ ...styles.progressText, color }}>{p}%</span>
          </div>
        </div>
        <div style={styles.progressLabel}>{title}</div>
      </div>
    );
  };

  const SustainabilityItem = ({ icon: Icon, title, subtitle, color }) => (
    <div style={styles.sustainabilityItem} className="portfolio-sustainability-item">
      <div style={{ ...styles.sustainabilityIcon, backgroundColor: color }}>
        <Icon size={16} color="white" />
      </div>
      <div style={styles.sustainabilityText} className="portfolio-sustainability-text">
        <div style={styles.sustainabilityTitle}>{title}</div>
        <div style={styles.sustainabilitySubtitle}>{subtitle}</div>
      </div>
    </div>
  );

  const handleDownloadPDF = async () => {
    const input = document.body;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: document.body.scrollWidth,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    }
    pdf.save("RUDA_Portfolio.pdf");
  };

  // Responsive flag
  const useMobileView = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return isMobile;
  };
  const isMobile = useMobileView();

  if (loading) return <div style={{ padding: 16 }}></div>;
  if (err || !row) return <div style={{ padding: 16 }}>{err || "No data"}</div>;

  // Select source: live row or priorityData when toggle is ON
  const src = usePriority
    ? {
      ...priorityData,
      financial_total_budget: priorityData.financial_total_budget,
    }
    : row;

  // Map DB values -> chart structures safely
  const developmentData = usePriority
    ? [
      { name: "River Training", value: 22, color: "#2196f3" },
      { name: "Barrage & Dam", value: 22, color: "#f55098" },
      { name: "Infrastructure", value: 30, color: "#336819" },
      { name: "SWM & WWTP", value: 26, color: "#ff9800" },
    ]
    : [
      { name: "River Training", value: 15, color: "#2196f3" },
      { name: "Barrage & Dam", value: 20, color: "#f55098" },
      { name: "Infrastructure", value: 40, color: "#336819" },
      { name: "SWM & WWTP", value: 25, color: "#ff9800" },
    ];

  // Use priority file's yearly expenditure if priority is ON, otherwise use row
  const expenditureData = usePriority
    ? (priorityData.expenditure_yearly || []).map((d) => ({
      year: d.year,
      amount: num(d.amount_b),
    }))
    : [
      { year: "FY22-23", amount: num(row.exp_fy22_23_b) },
      { year: "FY23-24", amount: num(row.exp_fy23_24_b) },
      { year: "FY24-25", amount: num(row.exp_fy24_25_b) },
      { year: "FY25-26", amount: num(row.exp_fy25_26_b) },
      { year: "FY26-27", amount: num(row.exp_fy26_27_b) },
    ];

  const totalSpent = expenditureData
    .reduce((s, i) => s + num(i.amount), 0)
    .toFixed(1);

  const financialData = [
    {
      name: "Total Budget",
      value: num(src.financial_total_budget || src.financial_total_budget),
      color: src.financial_total_budget_color || "#3b82f6",
    },
    {
      name: "Utilized Budget",
      value: num(src.financial_utilized_budget),
      color: src.financial_utilized_budget_color || "#10b981",
    },
    {
      name: "Remaining Budget",
      value: num(src.financial_remaining_budget),
      color: src.financial_remaining_budget_color || "#f59e0b",
    },
  ];

  // Bar widths (px) based on billons * factor
  const widthFactor = 15; // tweak if you want longer bars
  const plannedB = num(
    src.budget_planned_till_date_b || row.budget_planned_till_date_b
  );
  const certifiedB = num(
    src.budget_certified_till_date_b || row.budget_certified_till_date_b
  );
  const expendB = num(
    src.budget_expenditure_till_date_b || row.budget_expenditure_till_date_b
  );

  // ✅ Header style EXACTLY like OngoingProjects.jsx
  const headerStyle = {
    background:
      "radial-gradient(farthest-side ellipse at 20% 0, #333867 40%, #23274b)",
    color: "white",
    padding: "15px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  };

  // ✅ Buttons to sit with HeaderButtons group (no screen-size/layout changes)
  const smallHeaderBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    userSelect: "none",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  };

  const priorityBtnStyle = {
    ...smallHeaderBtnStyle,
    background: usePriority
      ? "rgba(21, 194, 38, 0.468)"
      : "rgba(204, 33, 33, 0.719)",
    border: usePriority
      ? "1px solid rgba(21, 194, 38, 0.468)"
      : "1px solid rgba(204, 33, 33, 0.719)",
  };

  return (
    <div style={styles.container} className="portfolio-container">
      <DashboardHeader />

      {/* Page Title & Actions Row */}
      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          borderBottom: "1px solid #eee",
          position: "relative",
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
          {src.title || row.title || "RUDA DEVELOPMENT PORTFOLIO"}
        </h2>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          position: "absolute",
          right: "20px",
        }}>
          <Printer
            size={22}
            color="#1e3a5f"
            style={{
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            title="Print"
            onClick={handleDownloadPDF}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <div
            onClick={() => setUsePriority(!usePriority)}
            title="Priority"
            style={{
              ...priorityBtnStyle,
              border: usePriority ? "none" : "1px solid #1e3a5f",
              color: usePriority ? "#fff" : "#1e3a5f",
              background: usePriority ? "#2c712e" : "transparent",
            }}
          >
            <Star size={16} />
            Priority
          </div>
        </div>
      </div>

      {/* First Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : {
              display: "flex",
              flexDirection: "row",
              gap: 16,
              marginBottom: 24,
            }
        }
      >
        {/* RAVI CITY MASTER PLAN */}
        <div style={{ ...styles.card, flex: 0.5 }}>
          <h2 style={styles.cardTitle}>RAVI CITY MASTER PLAN</h2>
          <div style={styles.masterPlan}>
            <img
              src={row.master_plan_image_url || "Img.png"}
              alt="Master Plan"
              style={styles.img}
            />
          </div>
        </div>

        {/* PROJECT MILESTONE MAP */}
        <div
          style={{ ...styles.card, flex: 1, cursor: "pointer" }}
          onClick={() => {
            window.location.href = "/milestones";
            setTimeout(() => {
              window.dispatchEvent(new Event("resize"));
            }, 300);
          }}
          title="Click to view full Project Milestones map"
        >
          <div style={{ width: "100%", height: "400px", overflow: "hidden", position: "relative" }}>
            <ProjectMilestone embedded={true} />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.secondRow
        }
      >
        {/* DEVELOPMENT COMPONENTS */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>DEVELOPMENT COMPONENTS</h2>
          <div style={{ width: "100%", height: 300, padding: "10px 0" }}>
            <ResponsiveContainer>
              <PieChart>
                <defs>
                  {developmentData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`}>
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={developmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="48%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  onClick={(data) => {
                    const categoryName = data.name;
                    let searchQuery = "";

                    if (categoryName === "River Training") {
                      searchQuery = "River Training";
                    } else if (categoryName === "SWM & WWTP") {
                      searchQuery = "SWM";
                    } else if (categoryName === "Barrage & Dam") {
                      searchQuery = "Barrage";
                    } else if (categoryName === "Infrastructure") {
                      searchQuery = "Infrastructure";
                    }

                    const priorityParam = usePriority ? "&filter=priority" : "";
                    const searchParam = searchQuery
                      ? `&search=${encodeURIComponent(searchQuery)}`
                      : "";

                    window.location.href = `/hierarchical-gantt?expand=all${priorityParam}${searchParam}`;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {developmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index})`}
                      style={{ 
                        cursor: "pointer",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                        transition: "all 0.3s ease"
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    color: "unset",
                    fontSize: "13px",
                  }}
                  iconSize={14}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KEY METRICS */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>KEY METRICS</h2>
          <div style={styles.metricsGrid} className="portfolio-metrics-grid">
            <MetricCard
              icon={TrendingUp}
              title="Total Development Budget"
              value={`PKR ${fmtPKR(
                src.metric_total_development_budget_pkr ||
                src.financial_total_budget
              )}`}
            />
            <MetricCard
              icon={Clock}
              title="Overall Duration"
              value={`${num(src.metric_overall_duration_years)} Years`}
            />
            <MetricCard
              icon={MapPin}
              title="Total Area"
              value={`${num(
                src.metric_total_area_acres
              ).toLocaleString()} Acres`}
            />
            <MetricCard
              icon={Building}
              title="Total Projects"
              value={`${num(src.metric_total_projects)}`}
            />
          </div>
        </div>

        {/* DEVELOPMENT TIMELINES */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>DEVELOPMENT TIMELINES</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "20px 0",
            }}
          >
            <ProgressCard
              title="Planned"
              percentage={num(src.progress_planned_pct)}
              color="#2196f3"
            />
            <ProgressCard
              title="Actual"
              percentage={num(src.progress_actual_pct)}
              color="#4caf50"
            />
          </div>

          <div style={styles.timelineContainer}>
            <div style={styles.timelineDuration}>
              <span style={styles.durationLabel}>DURATION</span>
              <div style={styles.durationChips}>
                <span style={{ ...styles.chip, ...styles.chipGreen }}>
                  {formatDuration(src.timeline_elapsed_years)}
                </span>
                <span style={{ ...styles.chip, ...styles.chipBlue }}>
                  {formatDuration(src.timeline_remaining_years)}
                </span>
              </div>
            </div>

            <div style={styles.timelineYears}>
              <span>
                {usePriority
                  ? src.timeline_start_label
                  : row.timeline_start_label || ""}
              </span>
              <span>
                {usePriority
                  ? src.timeline_mid_label
                  : row.timeline_mid_label || ""}
              </span>
              <span>
                {usePriority
                  ? src.timeline_end_label
                  : row.timeline_end_label || ""}
              </span>
            </div>

            <div style={styles.timelineBar}>
              <div style={styles.timelineElapsed} />
              <div style={styles.timelineRemaining} />
            </div>

            <div style={styles.timelineLegend}>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#10b981" }}
                />
                <span style={styles.legendText}>TIME ELAPSED</span>
              </div>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#3b82f6" }}
                />
                <span style={styles.legendText}>REMAINING TIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.thirdRow
        }
      >
        {/* FINANCIAL OVERVIEW */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>FINANCIAL OVERVIEW</h2>
          <div style={styles.chartContainer} className="portfolio-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {financialData.map((entry, index) => (
                    <linearGradient key={`barGradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#4a5568", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e0" }}
                />
                <YAxis 
                  axisLine={false} 
                  tick={false} 
                  domain={[0, "auto"]}
                />
                <Tooltip 
                  formatter={(value) => fmtPKR(value)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                >
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.customLegend}>
            {financialData.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: item.color }}
                />
                <span style={styles.legendText}>{fmtPKR(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FY24-25 BUDGET STATUS */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>FY24-25 BUDGET STATUS</h2>
          <div style={styles.budgetContainer}>
            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>Planned Till Date FY24-25</div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#003366",
                  width: `${Math.max(
                    10,
                    Math.round(plannedB * widthFactor)
                  )}px`,
                }}
                className="portfolio-budget-bar-3d"
              >
                {plannedB.toFixed(2)} B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Certified Amount Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#2e7d32",
                  width: `${Math.max(
                    10,
                    Math.round(certifiedB * widthFactor)
                  )}px`,
                }}
                className="portfolio-budget-bar-3d"
              >
                {certifiedB.toFixed(2)} B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Expenditure Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#a84320",
                  width: `${Math.max(10, Math.round(expendB * widthFactor))}px`,
                }}
                className="portfolio-budget-bar-3d"
              >
                {expendB.toFixed(2)} B
              </div>
            </div>
          </div>
        </div>

        {/* YEAR-WISE EXPENDITURE */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>Year-wise Expenditure</h2>
          <div style={styles.chartContainer} className="portfolio-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expenditureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: "#4a5568", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e0" }}
                />
                <YAxis 
                  tick={{ fill: "#4a5568", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e0" }}
                />
                <Tooltip 
                  formatter={(value) => `Rs. ${num(value)}B`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#expenditureGradient)"
                  radius={[8, 8, 0, 0]}
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                >
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) => `Rs. ${num(value)}B`}
                    style={{ fill: "#1e3a5f", fontSize: 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: "8px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Total Spent: Rs. {totalSpent}B
          </div>
        </div>
      </div>

      {/* Fourth Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.fourthRow
        }
      >
        {/* KEY ACHIEVEMENTS */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>KEY ACHIEVEMENTS</h2>
          <div style={styles.achievementsContainer}>
            <div style={styles.achievementsContent}>
              <TrendingUp
                size={32}
                style={{ margin: "0 auto 8px", display: "block" }}
              />
              <span>
                Key achievements and milestones will be displayed here
              </span>
            </div>
          </div>
        </div>

        {/* SUSTAINABILITY HIGHLIGHTS */}
        <div style={styles.card} className="portfolio-card">
          <h2 style={styles.cardTitle}>SUSTAINABILITY HIGHLIGHTS</h2>
          <div
            style={
              isMobile
                ? { display: "flex", flexDirection: "column", gap: "12px" }
                : styles.sustainabilityContainer
            }
            className="portfolio-sustainability-container"
          >
            <SustainabilityItem
              icon={Droplets}
              title="RIVER CHANNELIZATION"
              subtitle={`${num(row.sustainability_river_channelization_km)} KM`}
              color="#2196f3"
            />
            <SustainabilityItem
              icon={Waves}
              title="BARRAGES"
              subtitle={`${num(row.sustainability_barrages_count)}`}
              color="#f55098"
            />
            <SustainabilityItem
              icon={Recycle}
              title="SOLID WASTE MANAGEMENT"
              subtitle={`${row.sustainability_swm_text || ""}`}
              color="#df6f12"
            />
            <SustainabilityItem
              icon={Trees}
              title="AFFORESTATION"
              subtitle={`${num(
                row.sustainability_afforestation_acres
              ).toLocaleString()} Acres`}
              color="#4caf50"
            />
            <SustainabilityItem
              icon={Route}
              title="Trunk Infrastructure"
              subtitle={`${row.sustainability_trunk_infrastructure_text || ""}`}
              color="#336819"
            />
            <SustainabilityItem
              icon={Lightbulb}
              title="DRY UTILITIES"
              subtitle={`${row.sustainability_dry_utilities_text || ""}`}
              color="#ffc107"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
