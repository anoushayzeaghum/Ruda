import React, { useState, useRef, useEffect } from "react";
import { Settings, Layers, Power, Home } from "lucide-react";

const HeaderButtons = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

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

  // 🔹 Layer options (same as before)
  const layerOptions = [
    {
      name: "Ongoing Projects",
      onClick: () => (window.location.href = "/ongoing-projects"),
    },
    {
      name: "Timeline",
      onClick: () => (window.location.href = "/hierarchical-gantt"),
    },
    {
      name: "Portfolio",
      onClick: () => (window.location.href = "/portfolio"),
    },
    {
      name: "Summary",
      onClick: () => (window.location.href = "/overall-summary"),
    },
    {
      name: "Progress Update",
      onClick: () => (window.location.href = "/progress-update"),
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
      <Home
        size={22}
        color="white"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease, color 0.2s ease",
        }}
        title="Home"
        onClick={() => (window.location.href = "/")}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />

      <div style={{ position: "relative" }} ref={menuRef}>
        <Layers
          size={22}
          style={{ cursor: "pointer" }}
          title="Layers"
          onClick={() => setShowMenu((prev) => !prev)}
        />

        {/* 🔹 Dropdown Menu */}
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "30px",
              right: 0,
              backgroundColor: "#17193b",
              borderRadius: "8px",
              boxShadow: "0 0px 4px 4px #2d327139",
              padding: "8px 0",
              zIndex: 10000,
              backdropFilter: "blur(8px)",
              minWidth: "180px",
            }}
          >
            {layerOptions.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  item.onClick();
                  setShowMenu(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 16px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <Settings size={22} style={{ cursor: "pointer" }} title="Settings" /> */}

      <Power
        size={22}
        color="white"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease, color 0.2s ease",
        }}
        title="Logout"
        onClick={handleLogout}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </div>
  );
};

export default HeaderButtons;
