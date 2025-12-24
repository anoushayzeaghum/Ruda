import React, { useMemo } from "react";
import {
  Home,
  Layers,
  Settings,
  ChevronDown,
  ChevronUp,
  Route,
  MapPin,
  Landmark,
  LayoutDashboard,
  Map, // ⬅️ NEW: icon for Ruda Boundaries
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

// Helper function to normalize phase names (removes "Ruda " prefix)
const normalize = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/ruda\s+/i, "")
    .trim();

const DashboardSidebar = ({
  features = [],
  colorMap = {},
  onColorChange,
  openLayers = true,
  setOpenLayers = undefined,
  selectedPhases = [],
  setSelectedPhases = () => {},
  selectedPackages = [],
  setSelectedPackages = () => {},
  selectedCategories = [],
  setSelectedCategories = () => {},
  selectedProjects = [],
  setSelectedProjects = () => {},
  // popup toggles
  showPhasePopups = false,
  setShowPhasePopups = undefined,
  showPackagePopups = false,
  setShowPackagePopups = undefined,
  showProjectPopups = false,
  setShowProjectPopups = undefined,
  // control right-side RudaStatistics overlay in Dashboard
  showRudaStatistics = false,
  setShowRudaStatistics = undefined,
  // optional style to override the root container (useful for overlaying on map)
  containerStyle = undefined,
}) => {
  // Manage open/closed state for Layer Filters; prefer parent-controlled if provided
  const [localOpen, setLocalOpen] = React.useState(true);
  const isOpen = typeof setOpenLayers === "function" ? openLayers : localOpen;
  const setOpen =
    typeof setOpenLayers === "function" ? setOpenLayers : setLocalOpen;

  // 🔹 LOCAL STATE: Ruda Boundaries dropdown
  const [selectedBoundary, setSelectedBoundary] = React.useState("");

  const handleBoundaryChange = (event) => {
    const value = event.target.value;
    setSelectedBoundary(value);

    // Build detail object for the map to consume
    const detail = {
      lahore: false,
      sheikhupura: false,
      rtw: false,
      // explicit order to help with zIndex logic in the map
      order: ["lahore", "sheikhupura", "rtw"],
    };

    if (value === "lahore") {
      detail.lahore = true;
    } else if (value === "sheikhupura") {
      detail.sheikhupura = true;
    } else if (value === "rtw") {
      detail.rtw = true;
    } else if (value === "all") {
      detail.lahore = true;
      detail.sheikhupura = true;
      detail.rtw = true;
    }

    // Fire a global event so the map can react
    window.dispatchEvent(
      new CustomEvent("rudaBoundariesChange", {
        detail,
      })
    );
  };

  // 🔹 Derived dropdown options
  const phaseOptions = useMemo(() => {
    const setValues = new Set();
    // collect from properties.name that start with 'phase'
    features.forEach((f) => {
      const name = f.properties?.name;
      if (
        name &&
        typeof name === "string" &&
        name.toLowerCase().startsWith("phase")
      ) {
        setValues.add(name);
      }
    });
    return Array.from(setValues).sort((a, b) => {
      // Custom sort to maintain proper phase order
      const order = [
        "Phase 1",
        "Phase 2A",
        "Phase 2B",
        "Phase 3",
        "Phase 1 Extension",
      ];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [features]);

  const packageOptions = useMemo(
    () =>
      [
        ...new Set(
          features
            .filter(
              (f) =>
                f.properties?.name?.startsWith("RTW Package") &&
                f.properties?.ruda_phase &&
                selectedPhases.some(
                  (phase) =>
                    normalize(f.properties.ruda_phase) === normalize(phase)
                )
            )
            .map((f) => f.properties.name)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [features, selectedPhases]
  );

  const categoryOptions = useMemo(() => {
    const categories = new Set();
    features
      .filter(
        (f) =>
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg)
      )
      .forEach((f) => {
        if (f.properties?.category) {
          categories.add(f.properties.category);
        }
      });
    return Array.from(categories);
  }, [features, selectedPackages]);

  const projectOptions = useMemo(() => {
    return features
      .filter(
        (f) =>
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg) &&
          selectedCategories.includes(f.properties?.category)
      )
      .map((f) => f.properties.name);
  }, [features, selectedPackages, selectedCategories]);

  const renderDropdown = (label, value, setValue, options) => {
    const isAllSelected = options.length > 0 && value.length === options.length;

    const handleChange = (event) => {
      const selected = event.target.value;

      if (selected.includes("ALL")) {
        setValue(isAllSelected ? [] : options);
      } else {
        setValue(selected);
      }

      // 🔹 Auto-close dropdown by blurring the active element
      const active = event.target.ownerDocument?.activeElement;
      if (active && typeof active.blur === "function") {
        active.blur();
      }
    };

    return (
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel sx={{ color: "#bbb", top: "-8px", fontSize: "0.9rem" }}>
          {label}
        </InputLabel>
        <Select
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(", ")}
          sx={{
            color: "#fff",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "6px",
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            height: "38px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            paddingRight: "30px",
            ".MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "0 !important",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                backgroundColor: "#1e1e1e",
                color: "#fff",
                fontSize: "0.5rem",
                "& .MuiMenuItem-root": {
                  fontSize: "0.5rem",
                },
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#333",
                  borderRadius: "4px",
                },
              },
            },
          }}
        >
          <MenuItem value="ALL">
            <Checkbox
              checked={isAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
              sx={{ color: "#aaa", "&.Mui-checked": { color: "#2196f3" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              <Checkbox
                checked={value.includes(opt)}
                sx={{ color: "#fff", "&.Mui-checked": { color: "#2196f3" } }}
              />
              <ListItemText primary={opt} />
              <input
                type="color"
                value={colorMap[opt] || "#fff"}
                onChange={(e) => onColorChange?.(opt, e.target.value)}
                style={{
                  marginLeft: 10,
                  width: 22,
                  height: 22,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const rootStyle = {
    width: "17%",
    height: "100vh",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
    fontFamily: '"Open Sans", sans-serif',
    overflowY: "auto",
    msOverflowStyle: "none", // IE / Edge
    scrollbarWidth: "none", // Firefox
  };

  return (
    <div style={{ ...rootStyle, ...(containerStyle || {}) }}>
      {/* 🔹 Navigation + Filters + New Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        {/* 🔹 NEW: Ruda Boundaries dropdown */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s",
              color: "#fff",
              fontSize: "0.9rem",
              marginTop: "2px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Map size={16} /> Ruda Boundaries
            </div>
          </div>

          <div
            style={{
              paddingLeft: "10px",
              marginTop: "6px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel
                sx={{ color: "#bbb", top: "-3px", fontSize: "0.8rem" }}
              >
                Ruda Boundaries
              </InputLabel>
              <Select
                value={selectedBoundary}
                label="Ruda Boundaries"
                onChange={handleBoundaryChange}
                sx={{
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  "& .MuiSvgIcon-root": { color: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                  paddingRight: "30px",
                  ".MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    padding: "0 !important",
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="lahore">Lahore</MenuItem>
                <MenuItem value="sheikhupura">Sheikhupura</MenuItem>
                <MenuItem value="rtw">RTW</MenuItem>
                <MenuItem value="all">Show all</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* 🔹 Separator line */}
        <div
          style={{
            height: "1px",
            background: "rgba(255, 255, 255, 0.144)",
            margin: "0px 0",
            borderRadius: "10px",
          }}
        />

        {/* Layer Filters Section */}
        <div>
          <div
            onClick={() => setOpen(!isOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s",
              color: "#fff",
              fontSize: "0.9rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} /> Layer Filters
            </div>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Dropdowns appear only when open */}
          {isOpen && (
            <div
              style={{
                paddingLeft: "10px",
                marginTop: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                transition: "0.3s",
                fontSize: "0.9rem",
              }}
            >
              {renderDropdown(
                "Phases",
                selectedPhases,
                setSelectedPhases,
                phaseOptions
              )}
              {renderDropdown(
                "Packages",
                selectedPackages,
                setSelectedPackages,
                packageOptions
              )}
              {renderDropdown(
                "Categories",
                selectedCategories,
                setSelectedCategories,
                categoryOptions
              )}
              {renderDropdown(
                "Projects",
                selectedProjects,
                setSelectedProjects,
                projectOptions
              )}
            </div>
          )}
        </div>

        {/* New Buttons Section */}
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.9rem",
          }}
        >
          {/* 🔹 Separator line */}
          <div
            style={{
              height: "0.5px",
              background: "rgba(255, 255, 255, 0.144)",
              margin: "0px 0",
              borderRadius: "1px",
              marginTop: "10px",
            }}
          />
          {/* 🔹 Project Filters dropdown (new collapsible section) */}
          {(() => {
            const [openFilters, setOpenFilters] = React.useState(false);
            return (
              <div style={{ marginTop: 5 }}>
                {/* Header with same style as Layer Filters */}
                <div
                  onClick={() => setOpenFilters(!openFilters)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "0.2s",
                    color: "#fff",
                    fontSize: "0.9rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={16} /> Project Filters
                  </div>
                  {openFilters ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {/* Inner checkboxes appear when open */}
                {openFilters && (
                  <div
                    style={{
                      paddingLeft: "10px",
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "11px",
                      transition: "0.3s",
                      fontSize: "0.9rem",
                    }}
                  >
                    {/* ✅ Phases */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showPhasePopups}
                        onChange={(e) => setShowPhasePopups?.(e.target.checked)}
                      />
                      Phases
                    </label>

                    {/* ✅ Packages */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showPackagePopups}
                        onChange={(e) =>
                          setShowPackagePopups?.(e.target.checked)
                        }
                      />
                      Packages
                    </label>

                    {/* ✅ Projects */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showProjectPopups}
                        onChange={(e) =>
                          setShowProjectPopups?.(e.target.checked)
                        }
                      />
                      Projects
                    </label>
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Ruda Statistics toggle (above Proposed Roads) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
                background: showRudaStatistics
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
              }}
              onClick={() => setShowRudaStatistics?.(!showRudaStatistics)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Settings size={18} /> Ruda Statistics
            </div>

            {/* 🔹 Proposed Roads (separate line now) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onClick={() =>
                window.dispatchEvent(new CustomEvent("toggleProposedRoads"))
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Route size={18} /> Proposed Roads
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
