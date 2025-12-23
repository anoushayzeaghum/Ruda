import { useEffect, useMemo, useState } from "react";
// import LogManager from "../LogManager";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Refresh,
  Search,
  ExpandMore,
  Save,
  Cancel,
  History,
} from "@mui/icons-material";

// RUDA Theme Styles
const rudaStyles = `
  .ruda-portfolio-container {
    width: 100%;
    height: 100vh;
    font-family: Arial, sans-serif;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .ruda-portfolio-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    padding: 16px 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-bottom: 3px solid #4caf50;
  }

  .ruda-portfolio-content {
    flex: 1;
    overflow: auto;
    padding: 0px;
  }

  .ruda-portfolio-paper {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 0px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 1px solid #e0e0e0;
  }

  .ruda-portfolio-table-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
  }

  .ruda-portfolio-table-cell {
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .ruda-portfolio-table-row:hover {
    background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .ruda-portfolio-button-primary {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
  }

  .ruda-portfolio-button-primary:hover {
    background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  .ruda-portfolio-section-header {
    background: linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%);
    border-left: 4px solid #1976d2;
    padding: 8px 16px;
    margin: 12px 0 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .ruda-portfolio-dialog {
    border-radius: 16px;
  }

  .ruda-portfolio-dialog-title {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    margin: 0;
    padding: 20px 24px;
  }

  .ruda-portfolio-dialog-content {
    padding: 16px 24px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }

  .ruda-portfolio-text-field {
    margin-bottom: 8px;
  }

  .ruda-portfolio-text-field .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .ruda-portfolio-text-field .MuiOutlinedInput-root:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .ruda-portfolio-text-field .MuiOutlinedInput-root.Mui-focused {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }

  .ruda-portfolio-action-button {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .ruda-portfolio-action-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .ruda-portfolio-loading {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ruda-portfolio-accordion {
    border-radius: 8px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
    margin-bottom: 8px !important;
  }

  .ruda-portfolio-accordion-summary {
    background: linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%) !important;
    border-radius: 8px !important;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = rudaStyles;
  document.head.appendChild(styleSheet);
}

const API_URL = "https://ruda-planning.onrender.com/api/portfoliocrud";

const numberKeys = new Set([
  "dev_residential_pct",
  "dev_commercial_pct",
  "dev_industrial_pct",
  "dev_mixed_use_pct",
  "dev_institutional_pct",
  "exp_fy22_23_b",
  "exp_fy23_24_b",
  "exp_fy24_25_b",
  "exp_fy25_26_b",
  "exp_fy26_27_b",
  "financial_total_budget",
  "financial_utilized_budget",
  "financial_remaining_budget",
  "metric_total_development_budget_pkr",
  "metric_overall_duration_years",
  "metric_total_area_acres",
  "metric_total_projects",
  "progress_planned_pct",
  "progress_actual_pct",
  "timeline_elapsed_years",
  "timeline_remaining_years",
  "budget_planned_till_date_b",
  "budget_certified_till_date_b",
  "budget_expenditure_till_date_b",
  "sustainability_river_channelization_km",
  "sustainability_barrages_count",
  "sustainability_afforestation_acres",
]);

const colorKeys = new Set([
  "dev_residential_color",
  "dev_commercial_color",
  "dev_industrial_color",
  "dev_mixed_use_color",
  "dev_institutional_color",
  "financial_total_budget_color",
  "financial_utilized_budget_color",
  "financial_remaining_budget_color",
]);

const fieldGroups = [
  {
    title: "General",
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "master_plan_image_url",
        label: "Master Plan Image URL",
        type: "text",
      },
    ],
  },
  {
    title: "Development Components",
    fields: [
      {
        key: "dev_residential",
        label: "Residential %",
        type: "number_with_color",
        numberKey: "dev_residential_pct",
        colorKey: "dev_residential_color",
      },
      {
        key: "dev_commercial",
        label: "Commercial %",
        type: "number_with_color",
        numberKey: "dev_commercial_pct",
        colorKey: "dev_commercial_color",
      },
      {
        key: "dev_industrial",
        label: "Industrial %",
        type: "number_with_color",
        numberKey: "dev_industrial_pct",
        colorKey: "dev_industrial_color",
      },
      {
        key: "dev_mixed_use",
        label: "Mixed Use %",
        type: "number_with_color",
        numberKey: "dev_mixed_use_pct",
        colorKey: "dev_mixed_use_color",
      },
      {
        key: "dev_institutional",
        label: "Institutional %",
        type: "number_with_color",
        numberKey: "dev_institutional_pct",
        colorKey: "dev_institutional_color",
      },
    ],
  },
  {
    title: "Year-wise Expenditure (B)",
    fields: [
      { key: "exp_fy22_23_b", label: "FY22-23", type: "number" },
      { key: "exp_fy23_24_b", label: "FY23-24", type: "number" },
      { key: "exp_fy24_25_b", label: "FY24-25", type: "number" },
      { key: "exp_fy25_26_b", label: "FY25-26", type: "number" },
      { key: "exp_fy26_27_b", label: "FY26-27", type: "number" },
    ],
  },
  {
    title: "Financial Overview (PKR)",
    fields: [
      {
        key: "financial_total_budget_combined",
        label: "Total Budget",
        type: "number_with_color",
        numberKey: "financial_total_budget",
        colorKey: "financial_total_budget_color",
      },
      {
        key: "financial_utilized_budget_combined",
        label: "Utilized Budget",
        type: "number_with_color",
        numberKey: "financial_utilized_budget",
        colorKey: "financial_utilized_budget_color",
      },
      {
        key: "financial_remaining_budget_combined",
        label: "Remaining Budget",
        type: "number_with_color",
        numberKey: "financial_remaining_budget",
        colorKey: "financial_remaining_budget_color",
      },
    ],
  },
  {
    title: "Key Metrics",
    fields: [
      {
        key: "metric_total_development_budget_pkr",
        label: "Total Development Budget (PKR)",
        type: "number",
      },
      {
        key: "metric_overall_duration_years",
        label: "Overall Duration (Years)",
        type: "number",
      },
      {
        key: "metric_total_area_acres",
        label: "Total Area (Acres)",
        type: "number",
      },
      { key: "metric_total_projects", label: "Total Projects", type: "number" },
    ],
  },
  {
    title: "Progress (%)",
    fields: [
      { key: "progress_planned_pct", label: "Planned %", type: "number" },
      { key: "progress_actual_pct", label: "Actual %", type: "number" },
    ],
  },
  {
    title: "Timeline",
    fields: [
      { key: "timeline_start_label", label: "Start Label", type: "text" },
      { key: "timeline_mid_label", label: "Mid Label", type: "text" },
      { key: "timeline_end_label", label: "End Label", type: "text" },
      { key: "timeline_elapsed_years", label: "Elapsed Years", type: "number" },
      {
        key: "timeline_remaining_years",
        label: "Remaining Years",
        type: "number",
      },
    ],
  },
  {
    title: "FY24-25 Budget Status (B)",
    fields: [
      {
        key: "budget_planned_till_date_b",
        label: "Planned Till Date",
        type: "number",
      },
      {
        key: "budget_certified_till_date_b",
        label: "Certified Till Date",
        type: "number",
      },
      {
        key: "budget_expenditure_till_date_b",
        label: "Expenditure Till Date",
        type: "number",
      },
    ],
  },
  {
    title: "Sustainability",
    fields: [
      {
        key: "sustainability_river_channelization_km",
        label: "River Channelization (KM)",
        type: "number",
      },
      {
        key: "sustainability_barrages_count",
        label: "Barrages",
        type: "number",
      },
      {
        key: "sustainability_swm_text",
        label: "Solid Waste Management",
        type: "text",
      },
      {
        key: "sustainability_afforestation_acres",
        label: "Afforestation (Acres)",
        type: "number",
      },
      {
        key: "sustainability_trunk_infrastructure_text",
        label: "Trunk Infrastructure",
        type: "text",
      },
      {
        key: "sustainability_dry_utilities_text",
        label: "Dry Utilities",
        type: "text",
      },
    ],
  },
];

function coercePayload(p) {
  const out = { ...p };
  Object.keys(out).forEach((k) => {
    if (numberKeys.has(k)) {
      out[k] =
        out[k] === "" || out[k] === null || out[k] === undefined
          ? null
          : Number(out[k]);
    }
  });
  return out;
}

export default function PortfolioAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });
  const [showLog, setShowLog] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        `${r.title ?? ""}`.toLowerCase().includes(q) || `${r.id}`.includes(q)
    );
  }, [rows, search]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setRows(Array.isArray(json) ? json : []);
    } catch (e) {
      setToast({ open: true, type: "error", msg: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }

  function onAdd() {
    setMode("create");
    setSelectedId(null);
    const empty = {};
    fieldGroups.forEach((g) =>
      g.fields.forEach((f) => {
        empty[f.key] = colorKeys.has(f.key) ? "#3b82f6" : "";
      })
    );
    empty.title = "RUDA DEVELOPMENT PORTFOLIO";
    setForm(empty);
    setOpen(true);
  }

  function onEdit(row) {
    setMode("edit");
    setSelectedId(row.id);
    const copy = { ...row };
    Object.keys(copy).forEach((k) => {
      if (copy[k] === null || copy[k] === undefined) copy[k] = "";
    });
    setForm(copy);
    setOpen(true);
  }

  async function onDelete(row) {
    if (!confirm(`Delete record #${row.id}?`)) return;
    try {
      const res = await fetch(`${API_URL}/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ open: true, type: "success", msg: "Deleted" });
      await load();
    } catch {
      setToast({ open: true, type: "error", msg: "Delete failed" });
    }
  }

  async function onSave() {
    const payload = coercePayload(form);
    try {
      const res = await fetch(
        mode === "create" ? API_URL : `${API_URL}/${selectedId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error();
      setToast({
        open: true,
        type: "success",
        msg: mode === "create" ? "Created" : "Updated",
      });
      setOpen(false);
      await load();
    } catch {
      setToast({ open: true, type: "error", msg: "Save failed" });
    }
  }

  // Custom component for number field with color picker
  function NumberWithColorField({ def }) {
    const numberValue = form[def.numberKey] ?? "";
    const colorValue = form[def.colorKey] ?? "#4caf50";

    const handleNumberChange = (e) => {
      setForm((s) => ({ ...s, [def.numberKey]: e.target.value }));
    };

    const handleColorChange = (e) => {
      setForm((s) => ({ ...s, [def.colorKey]: e.target.value }));
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <TextField
          size="small"
          fullWidth
          label={def.label}
          type="number"
          value={numberValue}
          onChange={handleNumberChange}
          slotProps={{
            input: { step: "any" },
          }}
          className="ruda-portfolio-text-field"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#1e3a5f",
              fontWeight: "500",
            },
          }}
        />
        <Box
          onClick={() =>
            document.getElementById(`color-picker-${def.key}`).click()
          }
          sx={{
            width: 40,
            height: 40,
            backgroundColor: colorValue,
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              borderColor: "#1976d2",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
            minWidth: 40,
            flexShrink: 0,
          }}
        />
        <input
          id={`color-picker-${def.key}`}
          type="color"
          value={colorValue}
          onChange={handleColorChange}
          style={{ display: "none" }}
        />
      </Box>
    );
  }

  function Field({ def }) {
    // Handle the new combined number with color field type
    if (def.type === "number_with_color") {
      return <NumberWithColorField def={def} />;
    }

    const v = form[def.key] ?? "";
    const common = {
      size: "small",
      fullWidth: true,
      value: v,
      onChange: (e) => setForm((s) => ({ ...s, [def.key]: e.target.value })),
      className: "ruda-portfolio-text-field",
      sx: {
        mb: 1,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
          "&.Mui-focused": {
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#1e3a5f",
          fontWeight: "500",
        },
      },
    };
    if (def.type === "number") {
      return (
        <TextField
          {...common}
          label={def.label}
          type="number"
          slotProps={{
            input: { step: "any" },
          }}
        />
      );
    }
    if (def.type === "color") {
      return (
        <TextField
          {...common}
          label={def.label}
          type="color"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{
            ...common.sx,
            "& input": { height: 40, padding: 0 },
          }}
        />
      );
    }
    return <TextField {...common} label={def.label} />;
  }

  if (loading) {
    return (
      <div className="ruda-portfolio-loading">
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            sx={{
              color: "#4caf50",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#1e3a5f",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Loading Portfolio Data...
          </Typography>
        </Box>
      </div>
    );
  }

  // Show log component if requested
  if (showLog) {
    return <LogManager onBack={() => setShowLog(false)} />;
  }

  return (
    <div className="ruda-portfolio-container">
      <div className="ruda-portfolio-header">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            PORTFOLIO DATA MANAGER
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<History />}
              onClick={() => setShowLog(true)}
              className="ruda-portfolio-button-primary"
              sx={{
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "14px",
                background:
                  "linear-gradient(135deg, #6b6b6b 0%, #898989 100%) !important",
              }}
            >
              View Log
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              className="ruda-portfolio-button-primary"
              sx={{
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "14px",
              }}
            >
              Add New Portfolio
            </Button>
          </Box>
        </Box>
      </div>
      <div className="ruda-portfolio-content">
        <Paper elevation={0} className="ruda-portfolio-paper" sx={{ p: 3 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              placeholder="Search by title or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ruda-portfolio-text-field"
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Tooltip title="Refresh">
              <IconButton
                onClick={load}
                className="ruda-portfolio-action-button"
                sx={{
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer sx={{ maxHeight: "75vh", overflow: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 80,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 200,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    TITLE
                  </TableCell>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 150,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    PLANNED FY24-25 (B)
                  </TableCell>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 150,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    CERTIFIED (B)
                  </TableCell>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 150,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    EXPENDITURE (B)
                  </TableCell>
                  <TableCell
                    className="ruda-portfolio-table-header"
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 140,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((r) => (
                  <TableRow
                    key={r.id}
                    hover
                    className="ruda-portfolio-table-row"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell
                      className="ruda-portfolio-table-cell"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#2c3e50",
                      }}
                    >
                      {r.id}
                    </TableCell>
                    <TableCell
                      className="ruda-portfolio-table-cell"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#2c3e50",
                        maxWidth: 200,
                      }}
                    >
                      {r.title}
                    </TableCell>
                    <TableCell
                      className="ruda-portfolio-table-cell"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#2c3e50",
                      }}
                    >
                      {r.budget_planned_till_date_b}
                    </TableCell>
                    <TableCell
                      className="ruda-portfolio-table-cell"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#2c3e50",
                      }}
                    >
                      {r.budget_certified_till_date_b}
                    </TableCell>
                    <TableCell
                      className="ruda-portfolio-table-cell"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#2c3e50",
                      }}
                    >
                      {r.budget_expenditure_till_date_b}
                    </TableCell>
                    <TableCell
                      align="right"
                      className="ruda-portfolio-table-cell"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Tooltip title="Edit Portfolio">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(r)}
                            className="ruda-portfolio-action-button"
                            sx={{
                              color: "#4caf50",
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                              },
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Portfolio">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(r)}
                            className="ruda-portfolio-action-button"
                            sx={{
                              color: "#f44336",
                              "&:hover": {
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!paged.length && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#666",
                        py: 4,
                      }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: "1px solid #e0e0e0",
              "& .MuiTablePagination-toolbar": {
                color: "#1e3a5f",
                fontWeight: "500",
              },
            }}
          />
        </Paper>

        {/* CRUD Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
          className="ruda-portfolio-dialog"
          slotProps={{
            paper: {
              sx: {
                maxHeight: "90vh",
                borderRadius: "16px",
                overflow: "hidden",
              },
            },
          }}
        >
          <DialogTitle
            className="ruda-portfolio-dialog-title"
            sx={{
              background: "linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%)",
              color: "white",
              margin: 0,
              padding: "20px 24px",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {mode === "create"
              ? "Add New Portfolio"
              : `Edit Portfolio #${selectedId}`}
          </DialogTitle>
          <DialogContent
            className="ruda-portfolio-dialog-content"
            sx={{
              padding: "24px",
              background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
            }}
            dividers
          >
            <Stack spacing={2}>
              {fieldGroups.map((group, gi) => (
                <Accordion
                  key={gi}
                  defaultExpanded={gi <= 1}
                  className="ruda-portfolio-accordion"
                  sx={{
                    borderRadius: "8px !important",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08) !important",
                    marginBottom: "8px !important",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className="ruda-portfolio-accordion-summary"
                    sx={{
                      background:
                        "linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%) !important",
                      borderRadius: "8px !important",
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      sx={{
                        color: "#1e3a5f",
                        fontSize: "16px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {group.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: "16px 24px" }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {group.fields.map((f) => (
                        <Box
                          key={f.key}
                          sx={{ flex: "1 1 260px", minWidth: 240 }}
                        >
                          <Field def={f} />
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px", background: "#f8f9fa" }}>
            <Button
              startIcon={<Cancel />}
              onClick={() => setOpen(false)}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onSave}
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={toast.open}
          autoHideDuration={2500}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            severity={toast.type}
            sx={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {toast.msg}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
