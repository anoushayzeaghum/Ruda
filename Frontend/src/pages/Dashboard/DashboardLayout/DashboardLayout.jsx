import React, { useEffect, useMemo, useState } from "react";
import DashboardMap from "./LayoutComponent/DashboardMap";
import * as turf from "@turf/turf";
import Popups from "./LayoutComponent/Popups";
import RudaStatistics from "./LayoutComponent/RudaStatistics";
import AvailableLandTable from "./LayoutComponent/AvailableLandTable";
import FinancialProgress from "./LayoutComponent/FinancialProgress";
import FirmsTable from "./LayoutComponent/FirmsTable";
import ProgressBrief from "./LayoutComponent/ProgressBrief";
import PriorityProjectsTable from "./LayoutComponent/PriorityProjectsTable";
import OngoingProjectsTable from "./LayoutComponent/OngoingProjectsTable";
// list of geojson files to load (relative to public/geojson)
const layerFiles = [
  "Access Road.geojson",
  "CB Enclave.geojson",
  "Charhar Bhag_28-9-2022_2.geojson",
  "Development at Jhoke 158 acres.geojson",
  "M2 Toll Plaza.geojson",
  "River.geojson",
];

function mergeFeatures(list) {
  return list.reduce((acc, g) => {
    if (g && g.type === "FeatureCollection" && Array.isArray(g.features)) {
      acc.push(...g.features);
    }
    return acc;
  }, []);
}
const DashboardLayout = ({
  // optional props from parent (Dashboard.jsx) — if provided, they will be used
  features: propsFeatures,
  setFeatures: propsSetFeatures,
  colorMap: propsColorMap,
  setColorMap: propsSetColorMap,
  selectedPhases: propsSelectedPhases,
  setSelectedPhases: propsSetSelectedPhases,
  selectedPackages: propsSelectedPackages,
  setSelectedPackages: propsSetSelectedPackages,
  selectedCategories: propsSelectedCategories,
  setSelectedCategories: propsSetSelectedCategories,
  selectedProjects: propsSelectedProjects,
  setSelectedProjects: propsSetSelectedProjects,
  onColorChange: propsOnColorChange,
  showPhasePopups,
  showPackagePopups,
  showProjectPopups,
  // showTop: whether to render the top Map + Statistics section. Default true.
  showTop = true,
}) => {
  const [localFeatures, setLocalFeatures] = useState([]);
  const [localColorMap, setLocalColorMap] = useState({});

  const [localSelectedPhases, setLocalSelectedPhases] = useState([]);
  const [localSelectedPackages, setLocalSelectedPackages] = useState([]);
  const [localSelectedCategories, setLocalSelectedCategories] = useState([]);
  const [localSelectedProjects, setLocalSelectedProjects] = useState([]);

  const features = propsFeatures !== undefined ? propsFeatures : localFeatures;
  const setFeatures =
    propsSetFeatures !== undefined ? propsSetFeatures : setLocalFeatures;

  const colorMap = propsColorMap !== undefined ? propsColorMap : localColorMap;
  const setColorMap =
    propsSetColorMap !== undefined ? propsSetColorMap : setLocalColorMap;

  const selectedPhases =
    propsSelectedPhases !== undefined
      ? propsSelectedPhases
      : localSelectedPhases;
  const setSelectedPhases =
    propsSetSelectedPhases !== undefined
      ? propsSetSelectedPhases
      : setLocalSelectedPhases;

  const selectedPackages =
    propsSelectedPackages !== undefined
      ? propsSelectedPackages
      : localSelectedPackages;
  const setSelectedPackages =
    propsSetSelectedPackages !== undefined
      ? propsSetSelectedPackages
      : setLocalSelectedPackages;

  const selectedCategories =
    propsSelectedCategories !== undefined
      ? propsSelectedCategories
      : localSelectedCategories;
  const setSelectedCategories =
    propsSetSelectedCategories !== undefined
      ? propsSetSelectedCategories
      : setLocalSelectedCategories;

  const selectedProjects =
    propsSelectedProjects !== undefined
      ? propsSelectedProjects
      : localSelectedProjects;
  const setSelectedProjects =
    propsSetSelectedProjects !== undefined
      ? propsSetSelectedProjects
      : setLocalSelectedProjects;

  // load geojson files only when parent did not provide features
  useEffect(() => {
    if (propsFeatures !== undefined) return;
    const base = "/geojson/";
    Promise.all(
      layerFiles.map((fn) =>
        fetch(base + encodeURIComponent(fn))
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((data) => {
      const merged = mergeFeatures(data.filter(Boolean));
      setFeatures(merged);
    });
  }, [propsFeatures]);

  const handleColorChange = (name, color) => {
    if (propsOnColorChange) return propsOnColorChange(name, color);
    setColorMap((m) => ({ ...m, [name]: color }));
  };

  const selectedNames = useMemo(() => {
    return [...selectedPhases, ...selectedPackages, ...selectedProjects];
  }, [selectedPhases, selectedPackages, selectedProjects]);
  return (
    <div
      style={{
        width: "100%",
        // height: "calc(100vh - 60px)",
        background: "transparent",
        overflowY: "auto", // allow vertical scrolling to reach bottom tables without changing sizes
      }}
    >
      {/* Top Section: Map + Stats (can be hidden by prop `showTop`) */}
      {showTop && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr", // Map takes more space
            gap: "20px",
            marginBottom: "20px",
            height: "93vh",
          }}
        >
          {/* Left: Map Card */}
          <div
            style={{
              // background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              // border: "1px solid rgba(255,255,255,0.1)",
              padding: "10px",
              height: "100%",
            }}
          >
            <DashboardMap
              features={features}
              colorMap={colorMap}
              selectedNames={selectedNames}
            />
          </div>

          {/* Popups for dashboard map (invisible component that manages mapbox popups) */}
          <Popups
            features={(features || []).map((f) => ({
              ...f,
              properties: {
                ...f.properties,
                __areaSqKm: (() => {
                  try {
                    if (f && f.geometry) return turf.area(f) / 1000000;
                  } catch (e) {
                    return null;
                  }
                  return null;
                })(),
              },
            }))}
            showPhasePopups={showPhasePopups}
            showPackagePopups={showPackagePopups}
            showProjectPopups={showProjectPopups}
          />

          {/* Right: Statistics Card */}
          <div
            style={{
              background: "rgb(30 33 65)",
              borderRadius: "12px",
              // border: "1px solid rgba(255,255,255,0.1)",
              padding: "20px",
              height: "400px",
              overflow: "auto",
              marginTop: "120px",
              marginRight: "20px",
            }}
          >
            <RudaStatistics />
          </div>
        </div>
      )}

      {/* 🔹 Bottom Section: 6 Boxes (2 Rows × 3 Columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, auto)",
          gap: "20px",
          // height: "90vh",
          marginRight: "40px",
          marginBottom: "30px",
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <FinancialProgress />
        </div>

        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <FirmsTable />
        </div>

        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <ProgressBrief />
        </div>

        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <PriorityProjectsTable />
        </div>

        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <OngoingProjectsTable />
        </div>
        <div
          style={{
            background: "rgb(30 33 65)",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <AvailableLandTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
