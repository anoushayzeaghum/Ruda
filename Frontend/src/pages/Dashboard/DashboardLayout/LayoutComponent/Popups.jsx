import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";

const Popups = ({
    features = [],
    showPhasePopups = false,
    showPackagePopups = false,
    showProjectPopups = false,
    selectedPhases = [],
    selectedPackages = [],
    selectedProjects = [],
}) => {
    const popupsRef = useRef([]);

    // Helper function to normalize phase names (consistent with Sidebar)
    const normalize = (str) =>
        (str || "")
            .toLowerCase()
            .replace(/ruda\s+/i, "")
            .trim();

    useEffect(() => {
        const map = window.__DASHBOARD_MAP__ || null;

        if (popupsRef.current?.length) {
            popupsRef.current.forEach((p) => p.remove());
            popupsRef.current = [];
        }
        if (!map) return;

        const bboxCenter = (feature) => {
            try {
                const b = bbox(feature);
                return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
            } catch {
                return null;
            }
        };

        const toShow = [];

        // --- PHASE POPUPS ---
        if (showPhasePopups && selectedPhases.length > 0) {
            const groups = new Map();
            features.forEach((f) => {
                const props = f.properties || {};
                const phaseName = props.ruda_phase || props.phase || null;
                if (!phaseName) return;

                // Only include if this phase is "ON" in the layer filter
                const isPhaseActive = selectedPhases.some(
                    (sel) => normalize(sel) === normalize(phaseName)
                );
                if (!isPhaseActive) return;

                const area =
                    typeof props.__areaSqKm === "number"
                        ? props.__areaSqKm
                        : parseFloat(props.area_sqkm || props.area || 0) || 0;

                if (!groups.has(phaseName)) groups.set(phaseName, { features: [], area: 0 });
                groups.get(phaseName).features.push(f);
                groups.get(phaseName).area += area;
            });

            groups.forEach((g, title) => {
                try {
                    const b = bbox({ type: "FeatureCollection", features: g.features });
                    const center = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
                    toShow.push({
                        feature: { properties: { centroid: center } },
                        label: "phase",
                        title,
                        area: g.area,
                    });
                } catch (e) { }
            });
        }

        // --- PACKAGE POPUPS ---
        if (showPackagePopups && selectedPackages.length > 0) {
            const groups = new Map();
            features.forEach((f) => {
                const props = f.properties || {};
                const pkgName = props.rtw_pkg || props.package || null;
                if (!pkgName) return;

                // Only include if this package is "ON" in the layer filter
                if (!selectedPackages.includes(pkgName)) return;

                const phase = props.ruda_phase || props.phase || null;
                const area =
                    typeof props.__areaSqKm === "number"
                        ? props.__areaSqKm
                        : parseFloat(props.area_sqkm || props.area || 0) || 0;

                if (!groups.has(pkgName))
                    groups.set(pkgName, { features: [], area: 0, phase: phase });
                groups.get(pkgName).features.push(f);
                groups.get(pkgName).area += area;
            });

            groups.forEach((g, title) => {
                try {
                    const b = bbox({ type: "FeatureCollection", features: g.features });
                    const center = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
                    toShow.push({
                        feature: { properties: { centroid: center } },
                        label: "package",
                        title,
                        phase: g.phase,
                        area: g.area,
                    });
                } catch (e) { }
            });
        }

        // --- PROJECT POPUPS ---
        if (showProjectPopups && selectedProjects.length > 0) {
            features.forEach((f) => {
                const props = f.properties || {};
                const projectName = props.name || "Unnamed";

                // Only include if this project is "ON" in the layer filter
                if (!selectedProjects.includes(projectName)) return;

                const phase = props.ruda_phase || props.phase || null;
                const area =
                    typeof props.__areaSqKm === "number"
                        ? props.__areaSqKm
                        : parseFloat(props.area_sqkm || props.area || 0) || 0;

                // Project check logic (has category and name/package)
                if (
                    (props.rtw_pkg || props.package) &&
                    (props.category || props.rtw_category)
                ) {
                    toShow.push({
                        feature: f,
                        label: "project",
                        title: projectName,
                        phase,
                        area,
                    });
                }
            });
        }

        const seen = new Set();
        const unique = toShow.filter((item) => {
            const f = item.feature || {};
            const geom = f.geometry;
            let coordKey = null;
            if (f.properties && Array.isArray(f.properties.centroid)) {
                coordKey = `${f.properties.centroid[0].toFixed(6)}_${f.properties.centroid[1].toFixed(6)}`;
            } else if (geom && geom.type === "Point") {
                coordKey = `${geom.coordinates[0].toFixed(6)}_${geom.coordinates[1].toFixed(6)}`;
            } else {
                try {
                    coordKey = JSON.stringify(bbox(f));
                } catch (e) {
                    coordKey = item.title;
                }
            }

            const key = `${item.label}::${item.title}::${coordKey}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        unique.forEach((item) => {
            try {
                const f = item.feature;
                let lngLat = null;
                if (f?.geometry && f.geometry.type === "Point")
                    lngLat = f.geometry.coordinates;
                else lngLat = f.properties?.centroid || bboxCenter(f);
                if (!lngLat) return;

                const htmlParts = [];
                if (item.label === "phase") {
                    htmlParts.push(`<div style="font-weight:600;color:#1e3a5f">${item.title}</div>`);
                    htmlParts.push(`<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`);
                } else if (item.label === "package") {
                    htmlParts.push(`<div style="font-weight:600;color:#1e3a5f">${item.title}</div>`);
                    htmlParts.push(`<div>Phase: ${item.phase || "-"}</div>`);
                    htmlParts.push(`<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`);
                } else if (item.label === "project") {
                    htmlParts.push(`<div style="font-weight:600;color:#1e3a5f">${item.title}</div>`);
                    htmlParts.push(`<div>Phase: ${item.phase || "-"}</div>`);
                    htmlParts.push(`<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`);
                }

                const popupHtml = `
          <div style="font: 11px/1.3 'Inter', sans-serif; padding: 4px 8px; min-width: 100px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.12); color: #2c3e50;">
            ${htmlParts.join("")}
          </div>`;

                const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 3 })
                    .setLngLat(lngLat)
                    .setHTML(popupHtml)
                    .addTo(map);
                popupsRef.current.push(popup);
            } catch (err) { }
        });

        return () => {
            if (popupsRef.current?.length) {
                popupsRef.current.forEach((p) => p.remove());
                popupsRef.current = [];
            }
        };
    }, [features, showPhasePopups, showPackagePopups, showProjectPopups, selectedPhases, selectedPackages, selectedProjects]);

    return null;
};

export default Popups;
