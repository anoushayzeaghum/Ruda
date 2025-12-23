import React from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Divider,
  Chip,
  Collapse,
} from "@mui/material";
import * as turf from "@turf/turf";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CancelIcon from "@mui/icons-material/Cancel";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const COLORS = ["#37eb79", "#ef4444"];

const RTWLeftSidebar = ({
  areaStats,
  showChart,
  setShowChart,
  projectFeatures,
  projectVisibility,
  allAvailableFeaturesRef,
  mapRef,
}) => {
  // Remove auto-open effect since it's now handled in parent
  // useEffect(() => {
  //   if (areaStats && !showChart) {
  //     setShowChart(true);
  //   }
  // }, [areaStats, showChart, setShowChart]);

  const chartData = areaStats
    ? [
        { name: "Available", value: areaStats.available },
        { name: "Unavailable", value: areaStats.unavailable },
      ]
    : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "rgba(0,0,0,0.9)",
            p: 1.5,
            borderRadius: 1,
            border: "1px solid #333",
          }}
        >
          <Typography variant="body2" sx={{ color: "white" }}>
            {`${payload[0].name}: ${payload[0].value.toFixed(2)} acres`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const totalArea = (areaStats?.available || 0) + (areaStats?.unavailable || 0);
  const availablePercent =
    totalArea > 0
      ? (((areaStats?.available || 0) / totalArea) * 100).toFixed(1)
      : 0;
  const unavailablePercent =
    totalArea > 0
      ? (((areaStats?.unavailable || 0) / totalArea) * 100).toFixed(1)
      : 0;

  return (
    <>
      {/*------------------- Mobile Toggle Button -------------------*/}
      {/* <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1100,
          display: { xs: "flex", md: "none" },
        }}
      >
        <Button
          startIcon={<BarChartIcon />}
          onClick={() => setShowChart(true)}
          sx={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            textTransform: "none",
            fontSize: "0.875rem",
            px: 3,
            py: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          Analytics
        </Button>
      </Box> */}

      {/*------------------- Desktop Toggle Button ------------------ */}
      {/* <Box
        sx={{
          position: "absolute",
          top: 30,
          left: showChart ? 290 : 20,
          zIndex: 1100,
          display: { xs: "none", md: "flex" },
          transition: "left 0.3s ease",
        }}
      >
        <IconButton
          onClick={() => setShowChart(!showChart)}
          sx={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            width: 40,
            height: 40,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {showChart ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box> */}

      {/*-------------------------- Chart Panel ---------------------- */}
      {areaStats && (
        <Collapse in={showChart} orientation="horizontal">
          <Card
            elevation={0}
            sx={{
              display: { xs: showChart ? "block" : "none", md: "block" },
              position: "absolute",
              top: { xs: 16, md: 20 },
              left: { xs: 16, md: 20 },
              width: { xs: "calc(100vw - 32px)", sm: 320, md: 320 },
              maxWidth: { xs: "none", md: 320 },
              maxHeight: {
                xs: "calc(100vh - 120px)",
                md: "calc(100vh - 40px)",
              },
              zIndex: 1000,
              borderRadius: 3,
              bgcolor: "#000000",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2.5,
                pb: 2,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Land Area Distribution
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowChart(false)}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  display: { xs: "flex", md: "none" },
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>

            {/*------------------------ Scrollable Content ---------------------*/}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2.5,
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {/*-------------------- Chart with Percentages ------------------- */}
              <Box
                sx={{ display: "flex", alignItems: "center", mt: -2, mb: 0 }}
              >
                <Box sx={{ height: 160, width: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: "#37eb79",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#37eb79", fontSize: "0.85rem" }}
                    >
                      Available: {availablePercent}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: "#ef4444",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#ef4444", fontSize: "0.85rem" }}
                    >
                      Unavailable: {unavailablePercent}%
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ------------------------ Stats Cards --------------------------*/}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(218, 218, 218, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      mb: 0,
                      fontSize: "0.75rem",
                    }}
                  >
                    Total Project Area
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 400,
                      fontSize: "1.1rem",
                    }}
                  >
                    {areaStats?.projectArea?.toFixed(2) || "0.00"} Acres
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid #37eb79",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgb(255, 255, 255)",
                      mb: 0,
                      fontSize: "0.75rem",
                    }}
                  >
                    Available Area
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#37eb79",
                      fontWeight: 400,
                      fontSize: "1.1rem",
                    }}
                  >
                    {areaStats?.availableArea?.toFixed(2) || "0.00"} Acres
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid #ef4444",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgb(255, 255, 255)",
                      mb: 0,
                      fontSize: "0.75rem",
                    }}
                  >
                    Unavailable Area
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ef4444",
                      fontWeight: 400,
                      fontSize: "1.1rem",
                    }}
                  >
                    {(
                      (areaStats?.projectArea || 0) -
                      (areaStats?.availableArea || 0)
                    ).toFixed(2)}{" "}
                    Acres
                  </Typography>
                </Box>
              </Box>

              {/*---------------------- Available Polygons -----------------------*/}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 1.5,
                    fontSize: "0.95rem",
                  }}
                >
                  Available Polygons
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {(() => {
                    const visibleRedNames = projectFeatures
                      .filter((f) => projectVisibility[f.properties.name])
                      .map((f) => f.properties.name.trim());

                    const matchingGreen =
                      allAvailableFeaturesRef.current.filter((f) =>
                        visibleRedNames.includes(f.properties?.name?.trim())
                      );

                    return matchingGreen
                      .map((f) => {
                        const name = f.properties?.name || "Unnamed";
                        const area = turf.area(f) / 4046.8564224;
                        return { name, area };
                      })
                      .sort((a, b) => b.area - a.area)
                      .map((p, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "rgba(74, 222, 128, 0.05)",
                            border: "1px solid rgba(74, 222, 128, 0.221)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#37eb79",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "#ffffff", fontSize: "0.8rem" }}
                            >
                              {p.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${p.area.toFixed(2)} acres`}
                            size="small"
                            sx={{
                              bgcolor: "rgba(74, 222, 128, 0.2)",
                              color: "#37eb79",
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        </Box>
                      ));
                  })()}
                </Box>
              </Box>
            </Box>
          </Card>
        </Collapse>
      )}
    </>
  );
};

export default RTWLeftSidebar;
