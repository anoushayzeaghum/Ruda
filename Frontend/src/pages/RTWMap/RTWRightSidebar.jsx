import React from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Collapse,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import LayersIcon from "@mui/icons-material/Layers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import * as turf from "@turf/turf";

const RTWRightSidebar = ({
  showToggle,
  setShowToggle,
  selectedCategory,
  setSelectedCategory,
  projectVisibility,
  setProjectVisibility,
  layerVisibility,
  setLayerVisibility,
  mapRef,
  toggleLayer,
  recalculateAreaStats,
  allAvailableFeaturesRef,
  projectFeatures,
  setShowChart, // Add this prop
}) => {
  const handleProjectClick = (projectName) => {
    const matchingFeature = projectFeatures.find(
      (f) => f.properties?.name?.trim() === projectName.trim()
    );

    if (matchingFeature && mapRef.current) {
      const bbox = turf.bbox(matchingFeature);
      mapRef.current.fitBounds(bbox, {
        padding: 50,
        duration: 1000,
      });
    }
  };

  const handleProjectToggle = (name, visible) => {
    const id = name.replace(/\s+/g, "-").toLowerCase();
    setProjectVisibility((prev) => ({ ...prev, [name]: visible }));
    recalculateAreaStats();

    ["fill", "line"].forEach((type) => {
      const layerId = `project-${id}-${type}`;
      if (mapRef.current.getLayer(layerId)) {
        mapRef.current.setLayoutProperty(
          layerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });

    if (visible) {
      const matchingGreen = allAvailableFeaturesRef.current.filter(
        (f) => f.properties?.name?.trim() === name.trim()
      );

      const greenLayerSource = mapRef.current.getSource("rtw2-public");
      if (greenLayerSource && matchingGreen.length > 0) {
        greenLayerSource.setData({
          type: "FeatureCollection",
          features: matchingGreen,
        });

        ["fill", "line"].forEach((type) => {
          const layerId = `rtw2-${type}`;
          if (mapRef.current.getLayer(layerId)) {
            mapRef.current.setLayoutProperty(layerId, "visibility", "visible");
          }
        });
      }

      // Open left sidebar when data is filtered/shown
      setShowChart(true);
      handleProjectClick(name);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    if (value === "Show All") {
      const allVisible = {};
      Object.keys(projectVisibility).forEach((name) => {
        allVisible[name] = true;
        const id = name.replace(/\s+/g, "-").toLowerCase();
        ["fill", "line"].forEach((type) => {
          const layerId = `project-${id}-${type}`;
          if (mapRef.current.getLayer(layerId)) {
            mapRef.current.setLayoutProperty(layerId, "visibility", "visible");
          }
        });
      });
      setProjectVisibility(allVisible);
      setShowChart(true); // Open left sidebar
    } else if (value === "Clear All" || value === "Select Category") {
      const allHidden = {};
      Object.keys(projectVisibility).forEach((name) => {
        allHidden[name] = false;
        const id = name.replace(/\s+/g, "-").toLowerCase();
        ["fill", "line"].forEach((type) => {
          const layerId = `project-${id}-${type}`;
          if (mapRef.current.getLayer(layerId)) {
            mapRef.current.setLayoutProperty(layerId, "visibility", "none");
          }
        });
      });
      setProjectVisibility(allHidden);
      recalculateAreaStats(); // Clear project layers
    }
  };

  const handleToggleAll = () => {
    const filteredNames =
      selectedCategory === "Show All"
        ? Object.keys(projectVisibility)
        : Object.keys(projectVisibility).filter((name) => {
            if (selectedCategory === "Projects") {
              return (
                name.startsWith("RTW P-") ||
                name === "Rakh Jhoke Left-P" ||
                name === "Rakh Jhoke Right-P"
              );
            }
            if (selectedCategory === "Packages") {
              return (
                name.includes("Package") ||
                name === "Rakh Jhoke Left" ||
                name === "Rakh Jhoke Right"
              );
            }
            return (
              !name.startsWith("RTW P-") &&
              !name.includes("Package") &&
              name !== "Rakh Jhoke Left-P" &&
              name !== "Rakh Jhoke Right-P" &&
              name !== "Rakh Jhoke Left" &&
              name !== "Rakh Jhoke Right"
            );
          });

    const show = filteredNames.some((name) => !projectVisibility[name]);
    const updatedVisibility = { ...projectVisibility };

    filteredNames.forEach((name) => {
      updatedVisibility[name] = show;
      const id = name.replace(/\s+/g, "-").toLowerCase();
      ["fill", "line"].forEach((type) => {
        const layerId = `project-${id}-${type}`;
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(
            layerId,
            "visibility",
            show ? "visible" : "none"
          );
        }
      });
    });

    setProjectVisibility(updatedVisibility);
    recalculateAreaStats();

    if (show) {
      setShowChart(true); // Open left sidebar when showing layers
    }
  };

  const handleAvailableLandToggle = (isChecked) => {
    const newVisibility = { ...layerVisibility, available: isChecked };
    setLayerVisibility(newVisibility);

    if (isChecked) {
      recalculateAreaStats();
      setShowChart(true); // Open left sidebar when showing available land
    } else {
      ["fill", "line"].forEach((type) => {
        const layerId = `rtw2-${type}`;
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(layerId, "visibility", "none");
        }
      });
    }
  };

  return (
    <>
      {/*-------------------  Mobile Toggle Button -------------------- */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1100,
          display: { xs: "flex", md: "none" },
        }}
      >
        <Button
          startIcon={<LayersIcon />}
          onClick={() => setShowToggle(true)}
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
          Layers
        </Button>
      </Box>

      {/*-------------------- Desktop Toggle Button ------------------- */}
      {/* <Box
        sx={{
          position: "absolute",
          top: 30,
          right: showToggle ? 30 : 20,
          zIndex: 1100,
          display: { xs: "none", md: "flex" },
          transition: "right 0.3s ease",
        }}
      >
        <IconButton
          onClick={() => setShowToggle(!showToggle)}
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
          {showToggle ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box> */}

      {/*--------------------  Layer Control Panel -------------------- */}
      <Collapse in={showToggle} orientation="horizontal">
        <Card
          elevation={0}
          sx={{
            display: { xs: showToggle ? "block" : "none", md: "block" },
            position: "absolute",
            top: { xs: 16, md: 20 },
            right: { xs: 16, md: 20 },
            width: { xs: "calc(100vw - 32px)", sm: 280, md: 280 },
            maxWidth: { xs: "none", md: 250 },
            maxHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 220px)" },
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
              p: 2,
              pb: 1,
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
              Layer Controls
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowToggle(false)}
              sx={{
                color: "rgba(255,255,255,0.7)",
                display: { xs: "flex", md: "none" },
                "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>

          {/*--------------------  Scrollable Content -------------------- */}
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
            {/*--------------------  Category Filter -------------------- */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  mb: 1.5,
                  fontSize: "0.85rem",
                }}
              >
                Filter by Category
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 2,
                    fontSize: "0.85rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.7)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        "& .MuiMenuItem-root": {
                          color: "white",
                          fontSize: "0.85rem",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                          "&.Mui-selected": {
                            bgcolor: "rgba(255,255,255,0.2)",
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="Select Category">Select Category</MenuItem>
                  <MenuItem value="Phases">Phases</MenuItem>
                  <MenuItem value="Packages">Packages</MenuItem>
                  <MenuItem value="Projects">Projects</MenuItem>
                  <MenuItem value="Show All">Show All</MenuItem>
                  <MenuItem value="Clear All">Clear All</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Toggle All Button */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LayersIcon />}
              onClick={handleToggleAll}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                bgcolor: "rgba(255,255,255,0.05)",
                mb: 1,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 400,
                fontSize: "0.75rem",
                justifyContent: "flex-start",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Toggle All {selectedCategory}
            </Button>

            {/* Available Land Toggle */}
            <Box
              sx={{
                color: "white",
                p: 0,
                borderRadius: 2,
                bgcolor: layerVisibility.available
                  ? "rgba(74, 222, 128, 0.1)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${
                  layerVisibility.available
                    ? "rgba(74, 222, 128, 0.3)"
                    : "rgba(255,255,255,0.3)"
                }`,
                mb: 2.5,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={layerVisibility.available}
                    onChange={(e) =>
                      handleAvailableLandToggle(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#4ade80",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { bgcolor: "#4ade80" },
                      "& .MuiSwitch-switchBase": {
                        color: layerVisibility.available
                          ? "#4ade80"
                          : "rgba(255,255,255,0.5)",
                      },
                      "& .MuiSwitch-track": {
                        bgcolor: layerVisibility.available
                          ? "#4ade80"
                          : "rgba(255,255,255,0.2)",
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "left", gap: 1 }}>
                    {/* <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "#4ade80",
                        opacity: layerVisibility.available ? 1 : 0.3,
                      }}
                    /> */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: layerVisibility.available
                          ? "#4ade80"
                          : "rgba(255, 255, 255, 0.811)",
                        fontWeight: layerVisibility.available ? 500 : 400,
                        fontSize: "0.85rem",
                      }}
                    >
                      Available Land
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: "100%" }}
              />
            </Box>

            {/* Project List */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  mb: 1,
                  fontSize: "0.85rem",
                }}
              >
                Project Layers
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                {(() => {
                  const allNames = Object.keys(projectVisibility).filter(
                    (name) => {
                      if (selectedCategory === "Projects") {
                        return (
                          name.startsWith("RTW P-") ||
                          name === "Rakh Jhoke Left-P" ||
                          name === "Rakh Jhoke Right-P"
                        );
                      }
                      if (selectedCategory === "Packages") {
                        return (
                          name.includes("Package") ||
                          name === "Rakh Jhoke Left" ||
                          name === "Rakh Jhoke Right"
                        );
                      }
                      return (
                        !name.startsWith("RTW P-") &&
                        !name.includes("Package") &&
                        name !== "Rakh Jhoke Left-P" &&
                        name !== "Rakh Jhoke Right-P" &&
                        name !== "Rakh Jhoke Left" &&
                        name !== "Rakh Jhoke Right"
                      );
                    }
                  );

                  const specialEndItems =
                    selectedCategory === "Projects"
                      ? ["Rakh Jhoke Left-P", "Rakh Jhoke Right-P"]
                      : selectedCategory === "Packages"
                      ? ["Rakh Jhoke Left", "Rakh Jhoke Right"]
                      : [];

                  const regularItems = allNames.filter(
                    (name) => !specialEndItems.includes(name)
                  );
                  const sorted = [...regularItems.sort(), ...specialEndItems];

                  return sorted.map((name, idx) => {
                    const id = name.replace(/\s+/g, "-").toLowerCase();
                    const isVisible = projectVisibility[name];

                    return (
                      <Box
                        key={idx}
                        sx={{
                          pt: 0.5, // padding-top
                          pb: 0.5, // padding-bottom
                          pl: 1, // padding-left
                          pr: 1, // padding-right
                          borderRadius: 2,
                          bgcolor: isVisible
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(255,255,255,0.05)",
                          border: `1px solid ${
                            isVisible
                              ? "rgba(255, 255, 255, 0.359)"
                              : "rgba(255,255,255,0.1)"
                          }`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: isVisible
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(255,255,255,0.1)",
                            borderColor: isVisible
                              ? "rgba(239, 68, 68, 0.4)"
                              : "rgba(255,255,255,0.2)",
                          },
                        }}
                        onClick={() => handleProjectToggle(name, !isVisible)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: "#ef4444",
                              opacity: isVisible ? 1 : 0.3,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: isVisible
                                ? "#ef4444"
                                : "rgba(255,255,255,0.7)",
                              fontWeight: isVisible ? 500 : 400,
                              fontSize: "0.8rem",
                            }}
                          >
                            {name}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          sx={{
                            color: isVisible
                              ? "#ef4444"
                              : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {isVisible ? (
                            <VisibilityIcon fontSize="small" />
                          ) : (
                            <VisibilityOffIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    );
                  });
                })()}
              </Box>
            </Box>
          </Box>
        </Card>
      </Collapse>
    </>
  );
};

export default RTWRightSidebar;
