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
} from "lucide-react";
import "./Portfolio.css";
import styles from "./styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ProjectMilestone from "../Summary/ProjectMilestone";
import priorityData from "./portfolioPriorityData.json";

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
            background: `conic-gradient(${color} ${p * 3.6}deg, #e5e7eb ${
              p * 3.6
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
    <div style={styles.sustainabilityItem}>
      <div style={{ ...styles.sustainabilityIcon, backgroundColor: color }}>
        <Icon size={16} color="white" />
      </div>
      <div style={styles.sustainabilityText}>
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

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
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
        {
          name: "River Training",
          value: 22,
          color: "#2196f3",
        },
        {
          name: "Barrage & Dam",
          value: 22,
          color: "#f55098",
        },
        {
          name: "Infrastructure",
          value: 30,
          color: "#336819",
        },
        {
          name: "SWM & WWTP",
          value: 26,
          color: "#ff9800",
        },
      ]
    : [
        {
          name: "River Training",
          value: 15,
          color: "#2196f3",
        },
        {
          name: "Barrage & Dam",
          value: 20,
          color: "#f55098",
        },
        {
          name: "Infrastructure",
          value: 40,
          color: "#336819",
        },
        {
          name: "SWM & WWTP",
          value: 25,
          color: "#ff9800",
        },
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

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 16,
        }}
      >
        <div
          onClick={handleDownloadPDF}
          title="Print"
          style={{ cursor: "pointer", padding: 6 }}
        >
          <Printer size={22} style={{ color: "#333" }} />
        </div>

        <h1
          style={{ ...styles.title, margin: 0, textAlign: "center", flex: 1 }}
        >
          {src.title || row.title || "RUDA DEVELOPMENT PORTFOLIO"}
        </h1>

        <div style={{ display: "flex", gap: "8px" }}>
          <div
            onClick={() => (window.location.href = "/")}
            title="Home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
              borderRadius: 6,
              background: "#2196f3",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Home
          </div>
          <div
            onClick={() => setUsePriority(!usePriority)}
            title="Priority"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
              borderRadius: 6,
              background: usePriority ? "#10b981" : "#e93131",
              color: usePriority ? "#fff" : "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
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
              // Optional: trigger a resize event for full map view if needed
              window.dispatchEvent(new Event("resize"));
            }, 300);
          }}
          title="Click to view full Project Milestones map"
        >
          {/* <h2 style={styles.cardTitle}>PROJECT MILESTONE</h2> */}
          <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
            <ProjectMilestone />
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
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>DEVELOPMENT COMPONENTS</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={developmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="48%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  onClick={(data) => {
                    // Navigate to hierarchical-gantt with specific category and priority filter
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

                    // Add priority filter if priority mode is active
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
                      fill={entry.color}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                    color: "unset",
                    fontSize: "13px",
                  }}
                  iconSize={12}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KEY METRICS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>KEY METRICS</h2>
          <div style={styles.metricsGrid}>
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
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>DEVELOPMENT TIMELINES</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row", // horizontal
              alignItems: "center", // vertical alignment
              justifyContent: "center", // 👈 center horizontally
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
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>FINANCIAL OVERVIEW</h2>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis axisLine={false} tick={false} domain={[0, "auto"]} />
                <Tooltip formatter={(value) => fmtPKR(value)} />
                <Bar dataKey="value">
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
        <div style={styles.card}>
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
              >
                {expendB.toFixed(2)} B
              </div>
            </div>
          </div>
        </div>

        {/* YEAR-WISE EXPENDITURE */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Year-wise Expenditure</h2>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expenditureData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs. ${num(value)}B`} />
                <Bar dataKey="amount" fill="#3b82f6">
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) => `Rs. ${num(value)}B`}
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
        <div style={styles.card}>
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
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>SUSTAINABILITY HIGHLIGHTS</h2>
          <div
            style={
              isMobile
                ? { display: "flex", flexDirection: "column", gap: "12px" }
                : styles.sustainabilityContainer
            }
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
