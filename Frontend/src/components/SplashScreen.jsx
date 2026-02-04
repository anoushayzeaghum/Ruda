import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SplashScreen = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show splash screen on route change
    setIsVisible(true);
    setIsAnimating(true);

    // Hide after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Fade out duration
    }, 800); // Show duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.95; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          opacity: isAnimating ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
            height: "300px",
          }}
        >
          {/* Circular Lines - Outer Green */}
          <svg
            width="300"
            height="300"
            style={{
              position: "absolute",
              animation: "rotate 4s linear infinite",
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#4cb849"
              strokeWidth="3"
              strokeDasharray="15 8"
              opacity="0.7"
            />
          </svg>

          {/* Circular Lines - Middle Dark Blue */}
          <svg
            width="300"
            height="300"
            style={{
              position: "absolute",
              animation: "rotateReverse 3.5s linear infinite",
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="2.5"
              strokeDasharray="12 6"
              opacity="0.8"
            />
          </svg>

          {/* Circular Lines - Inner Green */}
          <svg
            width="300"
            height="300"
            style={{
              position: "absolute",
              animation: "rotate 3s linear infinite",
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="100"
              fill="none"
              stroke="#4cb849"
              strokeWidth="2"
              strokeDasharray="10 5"
              opacity="0.85"
            />
          </svg>

          {/* Circular Lines - Innermost Dark Blue */}
          <svg
            width="300"
            height="300"
            style={{
              position: "absolute",
              animation: "rotateReverse 2.5s linear infinite",
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="80"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.9"
            />
          </svg>

          {/* Logo */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <img
              src="/Rudafirm.png"
              alt="RUDA Logo"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;

