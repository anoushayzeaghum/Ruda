import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import DashboardMap from "./DashboardLayout/LayoutComponent/DashboardMap";
import RudaStatistics from "./DashboardLayout/LayoutComponent/RudaStatistics";
import Popups from "./DashboardLayout/LayoutComponent/Popups";
import SelectedFiltersChips from "./SelectedFiltersChips";
import { ChevronRight } from "lucide-react";
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
  // Ruda Statistics toggle display of the right-side card
  const [showRudaStatistics, setShowRudaStatistics] = useState(false);
  // Proposed Roads toggle state
  const [showProposedRoads, setShowProposedRoads] = useState(false);

  // Ruda Statistics collapse state
  const [isRudaStatisticsCollapsed, setIsRudaStatisticsCollapsed] = useState(false);
  // Proposed Roads collapse state
  const [isProposedRoadsCollapsed, setIsProposedRoadsCollapsed] = useState(false);

  // New wrapper functions to ensure mutual exclusivity
  const handleRudaStatisticsCollapse = (val) => {
    setIsRudaStatisticsCollapsed(val);
    if (!val) { // if expanding
      setIsProposedRoadsCollapsed(true);
    }
  };

  const handleProposedRoadsCollapse = (val) => {
    setIsProposedRoadsCollapsed(val);
    if (!val) { // if expanding
      setIsRudaStatisticsCollapsed(true);
    }
  };
  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth <= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Load the same dataset relative to MainMap logic
    const API_URL = "https://ruda-planning.onrender.com/api/all";
    axios
      .get(API_URL)
      .then((res) => {
        const feats = res.data.features || [];
        setFeatures(feats);

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
      <DashboardHeader />

      <div style={{ position: "relative", width: "100%", height: isMobile ? "60vh" : "93vh" }}>
        {/* Only show Active Filters if no other side panels are obstructing */}
        {!showRudaStatistics && !showProposedRoads && (
          <SelectedFiltersChips
            selectedPhases={selectedPhases}
            setSelectedPhases={setSelectedPhases}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
          />
        )}

        <DashboardMap
          features={features}
          colorMap={colorMap}
          selectedNames={[
            ...selectedPhases,
            ...selectedPackages,
            ...selectedProjects,
          ]}
        />

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
          selectedPhases={selectedPhases}
          selectedPackages={selectedPackages}
          selectedProjects={selectedProjects}
        />

        <ProposedRoadsLayer
          visible={showProposedRoads}
          isCollapsed={isProposedRoadsCollapsed}
          setIsCollapsed={handleProposedRoadsCollapse}
        />

        {isSidebarCollapsed && (
          <div
            onClick={() => setIsSidebarCollapsed(false)}
            style={{
              position: "absolute",
              left: 8,
              top: 18,
              zIndex: 1201,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              backgroundColor: "#1e3a5f",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1e3a5f";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
            title="Expand Sidebar"
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              Layer Controls
            </span>
            <ChevronRight size={20} color="#ffffff" />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: isSidebarCollapsed ? (isMobile ? -300 : -272) : (isMobile ? 0 : 8),
            top: isMobile ? 0 : 18,
            zIndex: 1200,
            width: isMobile ? "100%" : 280,
            height: isMobile ? "100%" : "92%",
            overflow: "auto",
            background: "#1e3a5f",
            borderRadius: isMobile ? 0 : 12,
            transition: "left 0.3s ease",
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
            // Proposed Roads toggle
            showProposedRoads={showProposedRoads}
            setShowProposedRoads={setShowProposedRoads}
            // Sidebar collapse
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
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
              top: 80,
              zIndex: 1200,
              width: 280,
              height: isRudaStatisticsCollapsed ? "auto" : 360,
              minHeight: isRudaStatisticsCollapsed ? "60px" : "360px",
              background: "#1e3a5f",
              borderRadius: 12,
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <RudaStatistics
              isCollapsed={isRudaStatisticsCollapsed}
              setIsCollapsed={handleRudaStatisticsCollapse}
            />
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
