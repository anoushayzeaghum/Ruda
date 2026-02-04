import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderButtons from "./HeaderButtons";
import {
  Settings,
  Layers,
  Power,
  FolderKanban,
  CalendarClock,
  Briefcase,
  BarChart3,
  ActivitySquare,
  Route,
  Home,
  Menu,
  X,
} from "lucide-react";
import "./DashboardHeader.css";

const DashboardHeader = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🔹 Navigation tabs (extracted from dropdown)
  const navTabs = [
    {
      name: "Ongoing Projects",
      path: "/ongoing-projects",
      icon: <FolderKanban size={18} />,
    },
    {
      name: "Timeline",
      path: "/hierarchical-gantt",
      icon: <CalendarClock size={18} />,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <Briefcase size={18} />,
    },
    { name: "Summary", path: "/overall-summary", icon: <BarChart3 size={18} /> },
    {
      name: "Progress Update",
      path: "/progress-update",
      icon: <ActivitySquare size={18} />,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "#1e3a5f",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "relative",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {/* Left: Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <img
          src="/Rudafirm.png"
          alt="RUDA Logo"
          style={{
            height: "45px",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Center: Navigation Tabs (Desktop Only) */}
      {!isMobile && (
        <div className="nav-tabs-desktop">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <div
                key={tab.name}
                onClick={() => (window.location.href = tab.path)}
                className={`nav-tab ${isActive ? 'nav-tab-active' : ''}`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Right: Actions & Menu Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <HeaderButtons />

        {isMobile && (
          <div
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <div
                key={tab.name}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = tab.path;
                }}
                className={`mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
