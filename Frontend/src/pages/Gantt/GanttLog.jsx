import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Refresh,
  Search,
  ArrowBack,
  History,
  Create,
  Edit,
  Delete,
  ExpandMore,
  Timeline,
  Assessment,
  Storage,
} from "@mui/icons-material";

// Styles similar to PortfolioLog.jsx
const rudaLogStyles = `
  .ruda-log-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    padding: 24px;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  .ruda-log-content {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    min-height: calc(100vh - 200px);
    padding: 24px;
  }

  .ruda-log-paper {
    background: white !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
  }

  .ruda-log-table-header {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
    font-weight: bold !important;
    color: #1e293b !important;
    border-bottom: 2px solid #cbd5e1 !important;
  }

  .ruda-log-button-primary {
    background: linear-gradient(135deg, #1e3a5fd4 0%, #2c4b6b94 100%) !important;
    border: none !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    transition: all 0.3s ease !important;
  }

  .ruda-log-button-primary:hover {
    background: linear-gradient(135deg, #1e3a5f88 0%, #2c4c6b6f 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
  }

  .ruda-log-chip-create {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    color: white !important;
    font-weight: 600 !important;
  }

  .ruda-log-chip-update {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    color: white !important;
    font-weight: 600 !important;
  }

  .ruda-log-chip-delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
    color: white !important;
    font-weight: 600 !important;
  }

  .ruda-log-stats-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    border: 1px solid rgba(59, 130, 246, 0.1) !important;
     min-width: 110px !important;
    height: 90px !important;
  }

  .ruda-log-nav-tabs {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    border-radius: 12px 12px 0 0 !important;
    padding: 8px 16px !important;
  }

  .ruda-log-nav-tab {
    min-height: 48px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    border-radius: 8px !important;
    margin: 0 4px !important;
    transition: all 0.3s ease !important;
  }

  .ruda-log-nav-tab.Mui-selected {
    background: linear-gradient(135deg, #2d394a 0%, #2c4a6b 100%) !important;
    color: white !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = rudaLogStyles;
  document.head.appendChild(styleSheet);
}

const API_URL = "https://ruda-planning.onrender.com/api/ganttlog";

export default function GanttLog({ onBack, activeTab, onTabChange }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (log) =>
        `${log.gantt_item_name ?? ""}`.toLowerCase().includes(q) ||
        `${log.action ?? ""}`.toLowerCase().includes(q) ||
        `${log.field_name ?? ""}`.toLowerCase().includes(q) ||
        `${log.changed_by ?? ""}`.toLowerCase().includes(q) ||
        `${log.gantt_item_id}`.includes(q)
    );
  }, [logs, search]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  async function loadLogs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}?limit=1000`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
      } else {
        throw new Error(json.error || "Failed to load logs");
      }
    } catch (e) {
      setError("Failed to load gantt logs: " + e.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const json = await res.json();
      if (json.success) {
        setStats(json.data || []);
      }
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  }

  function getActionIcon(action) {
    switch (action) {
      case "CREATE":
        return <Create fontSize="small" />;
      case "UPDATE":
        return <Edit fontSize="small" />;
      case "DELETE":
        return <Delete fontSize="small" />;
      default:
        return <History fontSize="small" />;
    }
  }

  function getActionChip(action) {
    const className = `ruda-log-chip-${action.toLowerCase()}`;
    return (
      <Chip
        icon={getActionIcon(action)}
        label={action}
        size="small"
        className={className}
      />
    );
  }

  function formatValue(value) {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Header */}
      <div className="ruda-log-header">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={onBack}
              sx={{
                color: "white",
                background: "rgba(255,255,255,0.1)",
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              <ArrowBack />
            </IconButton>
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
              <Timeline />
              ACTIVITY LOGS
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadLogs}
            className="ruda-log-button-primary"
            sx={{
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            Refresh Logs
          </Button>
        </Box>

        {/* Navigation Tabs */}
        <Box className="ruda-log-nav-tabs" sx={{ mt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Assessment />
                  Portfolio
                </Box>
              }
              value="portfolio"
              className="ruda-log-nav-tab"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Timeline />
                  Gantt
                </Box>
              }
              value="gantt"
              className="ruda-log-nav-tab"
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Storage />
                  RTW CRUD
                </Box>
              }
              value="crud"
              className="ruda-log-nav-tab"
            />
          </Tabs>
        </Box>
      </div>

      <div className="ruda-log-content">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={0} className="ruda-log-paper" sx={{ p: 3 }}>
          {/* Search + Stats in same row */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Left: Search + log count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                placeholder="Search gantt logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <Typography variant="body2" color="text.secondary">
                {filtered.length} log{filtered.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>

            {/* Right: Stats cards */}
            {stats && stats.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card className="ruda-log-stats-card" sx={{ minWidth: 120 }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Logs
                    </Typography>
                    <Typography variant="h5">
                      {stats.reduce(
                        (sum, stat) => sum + parseInt(stat.daily_count || 0),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>

                <Card className="ruda-log-stats-card" sx={{ minWidth: 120 }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Creates
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {stats.reduce(
                        (sum, stat) => sum + parseInt(stat.creates || 0),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>

                <Card className="ruda-log-stats-card" sx={{ minWidth: 120 }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Updates
                    </Typography>
                    <Typography variant="h5" color="warning.main">
                      {stats.reduce(
                        (sum, stat) => sum + parseInt(stat.updates || 0),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>

                <Card className="ruda-log-stats-card" sx={{ minWidth: 120 }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Deletes
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {stats.reduce(
                        (sum, stat) => sum + parseInt(stat.deletes || 0),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>

          {/* Logs Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="ruda-log-table-header">
                        Date/Time
                      </TableCell>
                      <TableCell className="ruda-log-table-header">
                        Gantt Item
                      </TableCell>
                      <TableCell className="ruda-log-table-header">
                        Action
                      </TableCell>
                      <TableCell className="ruda-log-table-header">
                        Field
                      </TableCell>
                      <TableCell className="ruda-log-table-header">
                        Changes
                      </TableCell>
                      <TableCell className="ruda-log-table-header">
                        Changed By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(log.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {log.gantt_item_name || "Unknown Item"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {log.gantt_item_id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getActionChip(log.action)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {log.field_name || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {log.action === "CREATE" ? (
                            <Typography variant="body2" color="success.main">
                              Gantt item created
                            </Typography>
                          ) : log.action === "DELETE" ? (
                            <Typography variant="body2" color="error.main">
                              Gantt item deleted
                            </Typography>
                          ) : (
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="body2">
                                  View Changes
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Old Value:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontFamily: "monospace",
                                        background: "#f5f5f5",
                                        p: 1,
                                        borderRadius: 1,
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {formatValue(log.old_value)}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      New Value:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontFamily: "monospace",
                                        background: "#f5f5f5",
                                        p: 1,
                                        borderRadius: 1,
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {formatValue(log.new_value)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.changed_by}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </Paper>
      </div>
    </Box>
  );
}
