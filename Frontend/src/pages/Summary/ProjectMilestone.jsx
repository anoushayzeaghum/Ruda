import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const POINTS_GEOJSON_URL = "/geojson/points.geojson";

const CATEGORIES = [
  { key: 1, name: "PC-1(preperation)", color: "#bdbdbd" },
  { key: 2, name: "PC-1 Approved", color: "#616161" },
  { key: 3, name: "Detailed Design(TS)", color: "#90caf9" },
  { key: 4, name: "Tender", color: "#ba68c8" },
  { key: 5, name: "Construction", color: "#81c784" },
  { key: 6, name: "Handover/Completed", color: "#fff176" },
];

function getFixedCategory(idx) {
  // Assign categories in round-robin order
  return CATEGORIES[idx % CATEGORIES.length];
}

const ProjectMilestone = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const initialCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = 0;
    return acc;
  }, {});

  const [categoryCounts, setCategoryCounts] = useState(initialCounts);

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
          // Custom styled popup (no milestone)
          marker.bindPopup(
            `<div style="font-family: 'Segoe UI', Arial, sans-serif; min-width:180px; padding:10px; border-radius:10px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <div style="font-size:15px; font-weight:600; color:${
                cat.color
              }; margin-bottom:6px;">${cat.name}</div>
              <div style="font-size:12px; color:#555; margin-bottom:2px;">
                <span style="font-weight:500;">Longitude:</span> ${coords[0].toFixed(
                  6
                )}<br/>
                <span style="font-weight:500;">Latitude:</span> ${coords[1].toFixed(
                  6
                )}
              </div>
            </div>`
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
    <div style={{ padding: 0, position: "relative" }}>
      {/* Category summary bar overlay */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "8px 0 4px 0",
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "none",
          pointerEvents: "none",
        }}
      >
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            style={{
              background: cat.color,
              color: cat.key === 6 ? "#333" : "#fff",
              minWidth: 140,
              maxWidth: 130,
              margin: "0 4px",
              borderRadius: 6,
              padding: "8px 10px 6px 10px",
              textAlign: "center",
              fontWeight: 500,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              pointerEvents: "auto",
              opacity: 0.95,
              cursor: cat.key === 6 ? "pointer" : "default",
              transition: "all 0.2s ease-in-out",
              "&:hover":
                cat.key === 6
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }
                  : {},
            }}
            onClick={() => handleCategoryClick(cat.key)}
            title={
              cat.key === 6
                ? "Click to view completed projects in Hierarchical Gantt"
                : ""
            }
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {categoryCounts[cat.key] || 0}
            </div>
            <div style={{ fontSize: 13 }}>{cat.name}</div>
          </div>
        ))}
      </div>
      {/* Map container */}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100vh", borderRadius: 0 }}
      />
    </div>
  );
};

export default ProjectMilestone;
