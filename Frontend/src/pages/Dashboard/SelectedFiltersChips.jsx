import React, { useState } from "react";
import { Box, Chip } from "@mui/material";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const SelectedFiltersChips = ({
  selectedPhases = [],
  setSelectedPhases,
  selectedPackages = [],
  setSelectedPackages,
  selectedCategories = [],
  setSelectedCategories,
  selectedProjects = [],
  setSelectedProjects,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const groupedSelected = {
    Phases: selectedPhases.map((item) => ({ value: item, setter: setSelectedPhases })),
    Packages: selectedPackages.map((item) => ({ value: item, setter: setSelectedPackages })),
    Categories: selectedCategories.map((item) => ({ value: item, setter: setSelectedCategories })),
    Projects: selectedProjects.map((item) => ({ value: item, setter: setSelectedProjects })),
  };

  const totalCount = Object.values(groupedSelected).reduce((sum, arr) => sum + arr.length, 0);

  if (totalCount === 0) return null;

  const handleRemove = (value, setter) => {
    setter((prev) => prev.filter((item) => item !== value));
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 80,
        right: 20,
        zIndex: 1100,
        width: "320px",
        maxHeight: "calc(100vh - 500px)",
        backgroundColor: "#1e3a5f",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        overflow: "hidden",
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
          },
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              minWidth: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            {totalCount}
          </Box>
          <Box
            component="span"
            sx={{
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Active Filters
          </Box>
        </Box>
        {isExpanded ? (
          <ChevronUp size={18} color="#ffffff" />
        ) : (
          <ChevronDown size={18} color="#ffffff" />
        )}
      </Box>

      {/* Content */}
      {isExpanded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "12px 16px",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          {Object.entries(groupedSelected).map(([type, items], index) => {
            if (items.length === 0) return null;
            return (
              <Box key={type}>
                {/* Separator line before each section (except first) */}
                {index > 0 && (
                  <Box
                    sx={{
                      height: "1px",
                      background: "rgba(255, 255, 255, 0.1)",
                      margin: "12px 0",
                      borderRadius: "1px",
                    }}
                  />
                )}

                {/* Section Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    padding: "4px 0",
                  }}
                >
                  <Box
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {type}
                  </Box>
                  <Box
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.75rem",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {items.length}
                  </Box>
                </Box>

                {/* Chips */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    marginBottom: "4px",
                  }}
                >
                  {items.map((item, itemIndex) => (
                    <Chip
                      key={`${type}-${item.value}-${itemIndex}`}
                      label={item.value}
                      onDelete={() => handleRemove(item.value, item.setter)}
                      deleteIcon={<X size={14} />}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.15)",
                        fontSize: "0.75rem",
                        height: "26px",
                        marginBottom: "4px",
                        "& .MuiChip-label": {
                          padding: "0 8px",
                          fontWeight: 400,
                        },
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "14px",
                          marginRight: "4px",
                          "&:hover": {
                            color: "#ffffff",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.12)",
                          borderColor: "rgba(255,255,255,0.25)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default SelectedFiltersChips;

