import React from "react";
import { Plus } from "lucide-react";

const FirmsTable = () => {
  return (
    <div>
      <div
        style={{
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        {/* Header */}
        <h6
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: "#ffffff",
          }}
        >
          FIRMS AFFILIATED
        </h6>

        {/* 3 Firms Logos */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          {/* RUDA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/Rudafirm.png"
              alt="Ruda Logo"
              className="auth-header-logo"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                marginBottom: "4px",
                display: "block",
              }}
            />
          </div>

          {/* Nespak */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/Nespakfirm.png"
              alt="Nespak Logo"
              className="auth-header-logo"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                marginBottom: "4px",
                display: "block",
              }}
            />
          </div>

          {/* Habib */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/Habibfirm.png"
              alt="Habib Logo"
              className="auth-header-logo"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                marginBottom: "4px",
                display: "block",
              }}
            />
          </div>

          {/* NLC */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/NLC-logo.jpg"
              alt="NLC Logo"
              className="auth-header-logo"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                marginBottom: "4px",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Divider Line */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.15)",
            margin: "14px 0",
          }}
        ></div>

        {/* Footer Text */}
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "#aaa",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: "#1e537f",
              borderRadius: "50%",
              padding: "3px 6px",
              marginRight: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={12} color="#fff" />
          </span>
          <span style={{ color: "#fff" }}>All rights reserved</span>
        </p>
      </div>
    </div>
  );
};

export default FirmsTable;
