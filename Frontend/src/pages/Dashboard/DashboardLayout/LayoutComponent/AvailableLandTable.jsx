import React from "react";
import { ArrowUp } from "lucide-react";
import RTWMap from "../../../RTWMap/RTWMap";
import { useNavigate } from "react-router-dom";

const AvailableLandTable = () => {
  const navigate = useNavigate();

  // 🔹 When clicking mini map → open full RTWMap page
  const handleMapClick = () => {
    navigate("/map"); // navigate to main map page
  };

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "10px",
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h6
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              margin: 0,
              letterSpacing: "0.5px",
              color: "#ffffff",
            }}
          >
            LAND AREA DISTRIBUTION
          </h6>
          <span
            style={{
              color: "#888",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            ⚙️
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "10px",
          }}
        >
          {/* 1️⃣ Total Project Area */}
          <div
            style={{
              flex: 1,
              textAlign: "left",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Total Project Area
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              114,357.35 Acres
            </div>
          </div>

          {/* 2️⃣ Available Area */}
          <div
            style={{
              flex: 1,
              textAlign: "left",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              padding: "0 10px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Available Area
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              52,116.64 Acres
            </div>
          </div>

          {/* 3️⃣ Unavailable Area */}
          <div
            style={{
              flex: 1,
              textAlign: "left",
              paddingLeft: "10px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Unavailable Area
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              62,240.71 Acres
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            marginTop: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "45.5%",
              height: "100%",
              background: "#00c46a",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              background: "#1e537f",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            <ArrowUp size={14} color="#fff" />
          </div>
          <span>
            <strong>45.5%</strong> of Land is available
          </span>
        </div>
      </div>

      {/* 🔹 Embedded Mini Map */}
      <div
        onClick={handleMapClick}
        style={{
          marginTop: "16px",
          borderRadius: "10px",
          overflow: "hidden",
          height: "250px", // smaller height for dashboard
          width: "100%",
          maxWidth: "100%",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Overlay for click effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            background: "transparent",
          }}
        ></div>

        {/* Mini version of RTWMap - pass embedded flag and defaultFilter 'Show All' */}
        <div style={{ height: "100%", width: "100%" }}>
          <RTWMap isEmbedded={true} defaultFilter="Show All" />
        </div>
      </div>
    </div>
  );
};

export default AvailableLandTable;
