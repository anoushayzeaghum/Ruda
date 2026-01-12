import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

const DashboardHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 🔹 Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🔹 Layer options (with icons)
  const layerOptions = [
    {
      name: "Ongoing Projects",
      icon: <FolderKanban size={16} />,
      onClick: () => (window.location.href = "/ongoing-projects"),
    },
    {
      name: "Timeline",
      icon: <CalendarClock size={16} />,
      onClick: () => (window.location.href = "/hierarchical-gantt"),
    },
    {
      name: "Portfolio",
      icon: <Briefcase size={16} />,
      onClick: () => (window.location.href = "/portfolio"),
    },
    {
      name: "Summary",
      icon: <BarChart3 size={16} />,
      onClick: () => (window.location.href = "/overall-summary"),
    },
    {
      name: "Progress Update",
      icon: <ActivitySquare size={16} />,
      onClick: () => (window.location.href = "/progress-update"),
    },
    {
      name: "Proposed Roads",
      icon: <Route size={16} />,
      onClick: () =>
        window.dispatchEvent(new CustomEvent("toggleProposedRoads")),
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
          src="/RUDA LOGO.png"
          alt="RUDA Logo"
          style={{
            height: "45px",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Center: Title */}
      <p
        style={{
          margin: 0,
          fontWeight: 100,
          fontSize: "1.5rem",
          color: "#fff",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        RAVI URBAN DEVELOPMENT AUTHORITY
      </p>

      {/* Right: Header Buttons */}
      <HeaderButtons />
    </div>
  );
};

export default DashboardHeader;
