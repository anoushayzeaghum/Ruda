import React from "react";
import { Box, Typography } from "@mui/material";

const RTWProjectList = ({
  showToggle,
  selectedCategory,
  projectVisibility,
  setProjectVisibility,
  mapRef,
  recalculateAreaStats,
  allAvailableFeaturesRef,
}) => {
  if (!showToggle) return null;

  const getFilteredNames = () => {
    return Object.keys(projectVisibility).filter((name) => {
      if (selectedCategory === "Phases") return name.includes("Phase");
      if (selectedCategory === "Packages") return name.includes("Package");
      if (selectedCategory === "Projects")
        return name.includes("RTW P") || name === "11";
      return true;
    });
  };

  const handleProjectToggle = (name, visible) => {
    const id = name.replace(/\s+/g, "-").toLowerCase();
    setProjectVisibility((prev) => ({ ...prev, [name]: visible }));

    // Toggle red project layer
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

    // Recalculate stats which will handle green layer visibility based on Available Land toggle
    setTimeout(() => {
      recalculateAreaStats();
    }, 100);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 280,
        maxHeight: 300,
        overflowY: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: 2,
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {selectedCategory} List
      </Typography>

      {getFilteredNames()
        .sort()
        .map((name, idx) => {
          const id = name.replace(/\s+/g, "-").toLowerCase();
          return (
            <Box key={idx} sx={{ mt: 1 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={projectVisibility[name]}
                  onChange={(e) => handleProjectToggle(name, e.target.checked)}
                />
                <span style={{ fontSize: "0.9rem" }}>{name}</span>
              </label>
            </Box>
          );
        })}
    </Box>
  );
};

export default RTWProjectList;
