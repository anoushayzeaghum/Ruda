import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../Dashboard/DashboardHeader/DashboardHeader";
import { 
  FileText, 
  CheckCircle2, 
  DraftingCompass, 
  FileCheck, 
  Construction, 
  Award 
} from "lucide-react";

const POINTS_GEOJSON_URL = "/geojson/points.geojson";

const CATEGORIES = [
  { 
    key: 1, 
    name: "PC-1(preperation)", 
    color: "#bdbdbd",
    icon: FileText,
    bgGradient: "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)"
  },
  { 
    key: 2, 
    name: "PC-1 Approved", 
    color: "#616161",
    icon: CheckCircle2,
    bgGradient: "linear-gradient(135deg, #757575 0%, #616161 100%)"
  },
  { 
    key: 3, 
    name: "Detailed Design(TS)", 
    color: "#90caf9",
    icon: DraftingCompass,
    bgGradient: "linear-gradient(135deg, #a5d6f7 0%, #90caf9 100%)"
  },
  { 
    key: 4, 
    name: "Tender", 
    color: "#ba68c8",
    icon: FileCheck,
    bgGradient: "linear-gradient(135deg, #ce93d8 0%, #ba68c8 100%)"
  },
  { 
    key: 5, 
    name: "Construction", 
    color: "#81c784",
    icon: Construction,
    bgGradient: "linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)"
  },
  { 
    key: 6, 
    name: "Handover/Completed", 
    color: "#fff176",
    icon: Award,
    bgGradient: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)"
  },
];

function getFixedCategory(idx) {
  // Assign categories in round-robin order
  return CATEGORIES[idx % CATEGORIES.length];
}

const ProjectMilestone = ({ embedded = false }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const initialCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = 0;
    return acc;
  }, {});

  const [categoryCounts, setCategoryCounts] = useState(initialCounts);

  // Inject custom popup styles once
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('milestone-popup-styles')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'milestone-popup-styles';
      styleSheet.type = "text/css";
      styleSheet.innerText = `
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Handle category click - navigate to hierarchical-gantt for completed projects
  const handleCategoryClick = (categoryKey) => {
    if (categoryKey === 6) {
      // Handover/Completed category
      navigate("/hierarchical-gantt?filter=completed");
    }
  };
  
  useEffect(() => {
    let map;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // Prevent re-initialization

    map = L.map(mapRef.current, { zoomControl: false }).setView(
      [31.47, 74.28],
      10.5
    );
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    fetch(POINTS_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        const counts = { ...initialCounts };
        (data.features || []).forEach((feature, idx) => {
          const coords = feature.geometry?.coordinates;
          if (!coords) return;
          // Assign a fixed category for each point
          const cat = getFixedCategory(idx);
          counts[cat.key]++;
          // Stylish small circle marker
          const marker = L.circleMarker([coords[1], coords[0]], {
            radius: 7,
            color: "#222",
            fillColor: cat.color,
            fillOpacity: 1,
            weight: 2,
            opacity: 0.85,
            dashArray: "2,2",
          });
          // Enhanced styled popup
          marker.bindPopup(
            `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width:220px; padding:0; border-radius:12px; background:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.15); overflow:hidden;">
              <div style="background:${cat.color}; padding:12px 16px; color:${cat.key === 6 ? '#333' : '#fff'};">
                <div style="font-size:16px; font-weight:700; display:flex; align-items:center; gap:8px;">
                  <span style="font-size:18px;">${cat.name}</span>
                </div>
              </div>
              <div style="padding:16px; background:#f8f9fa;">
                <div style="display:flex; flex-direction:column; gap:10px;">
                  <div style="display:flex; align-items:center; gap:8px; padding:8px; background:white; border-radius:6px; border-left:3px solid ${cat.color};">
                    <span style="font-size:12px; font-weight:600; color:#666; min-width:70px;">Longitude:</span>
                    <span style="font-size:13px; font-weight:600; color:#1e3a5f; font-family:'Courier New', monospace;">${coords[0].toFixed(6)}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px; padding:8px; background:white; border-radius:6px; border-left:3px solid ${cat.color};">
                    <span style="font-size:12px; font-weight:600; color:#666; min-width:70px;">Latitude:</span>
                    <span style="font-size:13px; font-weight:600; color:#1e3a5f; font-family:'Courier New', monospace;">${coords[1].toFixed(6)}</span>
                  </div>
                </div>
              </div>
            </div>`,
            {
              className: 'custom-popup',
              maxWidth: 250
            }
          );
          marker.addTo(map);
        });
        setCategoryCounts(counts);
      })
      .catch((err) => {
        console.error("Failed to load points.geojson", err);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: 0, position: "relative", minHeight: embedded ? "100%" : "100vh", width: "100%", height: "100%" }}>
      {!embedded && <DashboardHeader />}
      
      {/* Category summary bar overlay */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: embedded ? "8px 12px" : "12px 16px",
          background: embedded ? "transparent" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: embedded ? "none" : "blur(10px)",
          position: "absolute",
          top: embedded ? "8px" : "60px",
          left: 0,
          zIndex: 1000,
          boxShadow: embedded ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
          pointerEvents: "none",
          gap: embedded ? "8px" : "12px",
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isClickable = cat.key === 6;
          return (
            <div
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              onMouseEnter={(e) => {
                if (isClickable) {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (isClickable) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }
              }}
              style={{
                background: cat.bgGradient,
                color: cat.key === 6 ? "#333" : "#fff",
                minWidth: embedded ? "120px" : "160px",
                margin: "0",
                borderRadius: embedded ? "8px" : "12px",
                padding: embedded ? "10px 12px" : "14px 16px",
                textAlign: "center",
                fontWeight: 500,
                boxShadow: embedded ? "0 2px 8px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.15)",
                pointerEvents: "auto",
                cursor: isClickable ? "pointer" : "default",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: `2px solid ${cat.color}`,
                position: "relative",
                overflow: "hidden",
              }}
              title={
                isClickable
                  ? "Click to view completed projects in Hierarchical Gantt"
                  : ""
              }
            >
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              }} />
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "8px",
                marginBottom: embedded ? "4px" : "6px"
              }}>
                <IconComponent size={embedded ? 16 : 20} style={{ 
                  filter: cat.key === 6 ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                }} />
              </div>
              <div style={{ fontSize: embedded ? 20 : 24, fontWeight: 700, lineHeight: 1.2, marginBottom: embedded ? "2px" : "4px" }}>
                {categoryCounts[cat.key] || 0}
              </div>
              <div style={{ fontSize: embedded ? 10 : 12, fontWeight: 500, opacity: 0.95, lineHeight: 1.3 }}>
                {cat.name}
              </div>
            </div>
          );
        })}
      </div>
      {/* Map container */}
      <div
        ref={mapRef}
        style={{ 
          width: "100%", 
          height: embedded ? "100%" : "calc(100vh - 60px)", 
          marginTop: embedded ? "0" : "60px", 
          borderRadius: 0 
        }}
      />
    </div>
  );
};

export default ProjectMilestone;
