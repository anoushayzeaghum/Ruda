import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import DashboardMap from "./DashboardLayout/LayoutComponent/DashboardMap";
import RudaStatistics from "./DashboardLayout/LayoutComponent/RudaStatistics";
import Popups from "./DashboardLayout/LayoutComponent/Popups";
import * as turf from "@turf/turf";
import ProposedRoadsLayer from "../Summary/ProposedRoadsLayer";
import "./Dashboard.css";

const Dashboard = () => {
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  }
  const [features, setFeatures] = useState([]);
  const [colorMap, setColorMap] = useState({});

  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [openLayers, setOpenLayers] = useState(true);
  // Popup toggles for dashboard
  const [showPhasePopups, setShowPhasePopups] = useState(false);
  const [showPackagePopups, setShowPackagePopups] = useState(false);
  const [showProjectPopups, setShowProjectPopups] = useState(false);
  // toggle display of the right-side RudaStatistics card on the dashboard map
  const [showRudaStatistics, setShowRudaStatistics] = useState(false);

  useEffect(() => {
    // Load the same dataset MainMap uses so dropdowns match
    const API_URL = "https://ruda-planning.onrender.com/api/all";
    axios
      .get(API_URL)
      .then((res) => {
        const feats = res.data.features || [];
        setFeatures(feats);

        // Build initial color map similar to MainMapPage
        const names = [
          ...new Set(feats.map((f) => f.properties?.name).filter(Boolean)),
        ];

        const layerNames = [
          "Charhar Bhag",
          "CB Enclave",
          "Access Roads",
          "M Toll Plaze",
          "Jhoke",
        ];

        setColorMap((prev) => {
          const newMap = { ...prev };
          [...names, ...layerNames].forEach((name) => {
            if (!newMap[name]) newMap[name] = getRandomColor();
          });
          return newMap;
        });
      })
      .catch((err) => console.error("Dashboard: failed to load features", err));
  }, []);

  const handleColorChange = (name, color) =>
    setColorMap((m) => ({ ...m, [name]: color }));

  return (
    <div
      className="dashboard-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Full-width header on top */}
      <DashboardHeader />

      {/* Top: map with overlayed sidebar (left) and statistics (right) */}
      <div style={{ position: "relative", width: "100%", height: "93vh" }}>
        <DashboardMap
          features={features}
          colorMap={colorMap}
          selectedNames={[
            ...selectedPhases,
            ...selectedPackages,
            ...selectedProjects,
          ]}
        />

        {/* Popups for dashboard map (Phase / Package / Project popups) */}
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

        {/* Proposed roads legend & layer manager (works with dashboard map instance) */}
        <ProposedRoadsLayer />

        {/* Overlayed sidebar on the left of the map */}
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 18,
            zIndex: 1200,
            width: 280,
            height: "92%",
            overflow: "auto",
            background: "rgb(30 33 65)",
            borderRadius: 12,
          }}
        >
          <DashboardSidebar
            features={features}
            colorMap={colorMap}
            onColorChange={handleColorChange}
            openLayers={openLayers}
            setOpenLayers={setOpenLayers}
            selectedPhases={selectedPhases}
            setSelectedPhases={setSelectedPhases}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            // popup toggles
            showPhasePopups={showPhasePopups}
            setShowPhasePopups={setShowPhasePopups}
            showPackagePopups={showPackagePopups}
            setShowPackagePopups={setShowPackagePopups}
            showProjectPopups={showProjectPopups}
            setShowProjectPopups={setShowProjectPopups}
            // Ruda Statistics toggle
            showRudaStatistics={showRudaStatistics}
            setShowRudaStatistics={setShowRudaStatistics}
            // ensure sidebar uses full area of this wrapper
            containerStyle={{ width: "100%", height: "100%", padding: 12 }}
          />
        </div>

        {/* Overlayed statistics on the right of the map (toggleable) */}
        {showRudaStatistics && (
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 290,
              zIndex: 1200,
              width: 280,
              height: 360,
              background: "rgb(30 33 65)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <RudaStatistics />
          </div>
        )}
      </div>

      {/* Bottom: dashboard layout (only bottom cards) */}
      <div style={{ width: "100%" }}>
        <DashboardLayout
          features={features}
          colorMap={colorMap}
          selectedPhases={selectedPhases}
          setSelectedPhases={setSelectedPhases}
          selectedPackages={selectedPackages}
          setSelectedPackages={setSelectedPackages}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          onColorChange={handleColorChange}
          showPhasePopups={showPhasePopups}
          showPackagePopups={showPackagePopups}
          showProjectPopups={showProjectPopups}
          showTop={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
