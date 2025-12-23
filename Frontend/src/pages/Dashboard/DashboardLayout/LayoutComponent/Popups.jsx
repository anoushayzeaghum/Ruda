import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";

const Popups = ({
  features = [],
  showPhasePopups = false,
  showPackagePopups = false,
  showProjectPopups = false,
}) => {
  const popupsRef = useRef([]);

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
    let showMode = null;
    if (showProjectPopups) showMode = "project";
    else if (showPackagePopups) showMode = "package";
    else if (showPhasePopups) showMode = "phase";

    // Grouped popups for phase/package: produce one popup per title (centroid of all matching features)
    if (showMode === "phase") {
      const groups = new Map();
      features.forEach((f) => {
        const props = f.properties || {};
        const phase = props.ruda_phase || props.phase || null;
        const area =
          typeof props.__areaSqKm === "number"
            ? props.__areaSqKm
            : parseFloat(props.area_sqkm || props.area || 0) || 0;
        if (!phase) return;
        if (!groups.has(phase)) groups.set(phase, { features: [], area: 0 });
        groups.get(phase).features.push(f);
        groups.get(phase).area += area;
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
        } catch (e) {
          // ignore grouping errors
        }
      });
    } else if (showMode === "package") {
      const groups = new Map();
      features.forEach((f) => {
        const props = f.properties || {};
        const pkg = props.rtw_pkg || props.package || null;
        const phase = props.ruda_phase || props.phase || null;
        const area =
          typeof props.__areaSqKm === "number"
            ? props.__areaSqKm
            : parseFloat(props.area_sqkm || props.area || 0) || 0;
        if (!pkg) return;
        if (!groups.has(pkg))
          groups.set(pkg, { features: [], area: 0, phase: phase });
        groups.get(pkg).features.push(f);
        groups.get(pkg).area += area;
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
        } catch (e) {
          // ignore errors
        }
      });
    } else if (showMode === "project") {
      // Only show individual project popups when the Projects filter is explicitly selected
      features.forEach((f) => {
        const props = f.properties || {};
        const name = props.name || "Unnamed";
        const phase = props.ruda_phase || props.phase || null;
        const pkg = props.rtw_pkg || props.package || null;
        const area =
          typeof props.__areaSqKm === "number"
            ? props.__areaSqKm
            : parseFloat(props.area_sqkm || props.area || 0) || 0;

        if (
          (props.rtw_pkg || props.package) &&
          (props.category || props.rtw_category)
        ) {
          toShow.push({
            feature: f,
            label: "project",
            title: name,
            phase,
            area,
          });
        }
      });
    } else {
      // none selected -> show nothing
    }

    const seen = new Set();
    const unique = toShow.filter((item) => {
      const f = item.feature || {};
      const geom = f.geometry;
      let coordKey = null;
      if (f.properties && Array.isArray(f.properties.centroid)) {
        coordKey = `${f.properties.centroid[0].toFixed(
          6
        )}_${f.properties.centroid[1].toFixed(6)}`;
      } else if (geom && geom.type === "Point") {
        coordKey = `${geom.coordinates[0].toFixed(
          6
        )}_${geom.coordinates[1].toFixed(6)}`;
      } else {
        try {
          coordKey = JSON.stringify(bbox(f));
        } catch (e) {
          // fallback to title so grouping still dedupes
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
          htmlParts.push(
            `<div style="font-weight:600;color:#1976d2">${item.title}</div>`
          );
          htmlParts.push(
            `<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`
          );
        } else if (item.label === "package") {
          htmlParts.push(
            `<div style="font-weight:600;color:#1976d2">${item.title}</div>`
          );
          htmlParts.push(`<div>Phase: ${item.phase || "-"}</div>`);
          htmlParts.push(
            `<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`
          );
        } else if (item.label === "project") {
          htmlParts.push(
            `<div style="font-weight:600;color:#1976d2">${item.title}</div>`
          );
          htmlParts.push(`<div>Phase: ${item.phase || "-"}</div>`);
          htmlParts.push(
            `<div>Area: ${item.area ? item.area.toFixed(2) : "N/A"} sq.km</div>`
          );
        }

        const popupHtml = `
          <div style="font:10px/1.2 'Segoe UI',sans-serif;padding:-5px -5px;min-width:90px;background:#fff;border-radius:4px;color:#000">
            ${htmlParts.join("")}
          </div>`;

        const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 3 })
          .setLngLat(lngLat)
          .setHTML(popupHtml)
          .addTo(map);
        popupsRef.current.push(popup);
      } catch (err) {
        // ignore individual popup errors
      }
    });

    return () => {
      if (popupsRef.current?.length) {
        popupsRef.current.forEach((p) => p.remove());
        popupsRef.current = [];
      }
    };
  }, [features, showPhasePopups, showPackagePopups, showProjectPopups]);

  return null;
};

export default Popups;
