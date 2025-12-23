import React from "react";
import { ArrowUp } from "lucide-react";

const FinancialProgress = () => {
  return (
    <div
      onClick={() => (window.location.href = "/progress-update")}
      style={{
        borderRadius: "12px",
        padding: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <div>
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
            FINANCIAL PROGRESS
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
          {/* 1️⃣ Amount of Work Done */}
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
              Amount of Work Done
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              PKR 927 Million
            </div>
          </div>

          {/* 2️⃣ Amount Paid */}
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
              Amount Paid
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>
              PKR 740 Million
            </div>
          </div>

          {/* 3️⃣ Time Elapsed */}
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
              Time Elapsed
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 400 }}>10 Months</div>
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
              width: "79%",
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
            <strong>79%</strong> of Amount Certified and Paid
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialProgress;
