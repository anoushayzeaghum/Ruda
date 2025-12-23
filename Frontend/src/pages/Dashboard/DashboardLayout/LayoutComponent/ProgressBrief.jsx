import React from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProgressBrief = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/portfolio")}
      style={{
        borderRadius: "12px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        color: "#fff",
      }}
    >
      {/* Header */}
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
          PROJECT PORTFOLIO
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

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          paddingBottom: "10px",
        }}
      >
        {/* 2️⃣ Total Development Budget */}
        <div
          style={{
            flex: 1,
            textAlign: "left",
            borderRight: "1px solid rgba(255,255,255,0.05)",
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
            Total Development Budget
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 400 }}>
            PKR 1.66 Trillion
          </div>
        </div>

        {/* 3️⃣ Overall Duration */}
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
            Overall Duration
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 400 }}>15 Years</div>
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
            width: "65%",
            height: "100%",
            background: "#00c46a",
            borderRadius: "4px",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>

      {/* Footer Text */}
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
          <strong>150 </strong>Active Projects Under Execution
        </span>
      </div>
    </div>
  );
};

export default ProgressBrief;
