import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const baseStyles = {
  Light: "mapbox://styles/mapbox/light-v11",
  Dark: "mapbox://styles/mapbox/dark-v11",
  Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  Streets: "mapbox://styles/mapbox/streets-v12",
  Outdoors: "mapbox://styles/mapbox/outdoors-v12",
};

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const DashboardMap = ({
  features = [],
  colorMap = {},
  selectedNames = [],
  center = [74.3587, 31.5204],
  zoom = 11,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [baseStyleKey, setBaseStyleKey] = useState("Streets");

  // initialize map once with transparent (empty) style
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: baseStyles[baseStyleKey],
      center,
      zoom,
      attributionControl: false,
    });

    // expose for other components (Popups) to access the instance
    window.__DASHBOARD_MAP__ = mapRef.current;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        if (window.__DASHBOARD_MAP__ === mapRef.current)
          delete window.__DASHBOARD_MAP__;
      }
    };
  }, []);

  // Handle basemap style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    map.once("style.load", () => {
      map.setCenter(center);
      map.setZoom(zoom);
    });

    map.setStyle(baseStyles[baseStyleKey]);
  }, [baseStyleKey]);

  // Proposed roads state: listen for toggle event and fetch on first show
  const proposedRef = useRef({ data: null, visible: false });

  // Ruda boundaries (Lahore, Sheikhupura, RTW)
  const boundaryRef = useRef({
    selection: null, // last selection from sidebar
    lahore: { data: null },
    sheikhupura: { data: null },
    rtw: { data: null },
  });

  useEffect(() => {
    const onToggle = async () => {
      const map = mapRef.current;
      proposedRef.current.visible = !proposedRef.current.visible;

      if (!proposedRef.current.data) {
        try {
          const res = await fetch(
            "https://ruda-planning.onrender.com/api/purposed_ruda_road_network"
          );
          const data = await res.json();
          proposedRef.current.data = data;
        } catch (err) {
          console.error("Failed to load proposed roads:", err);
          return;
        }
      }

      if (!map) return;

      // ensure source exists
      if (!map.getSource("proposed-roads")) {
        map.addSource("proposed-roads", {
          type: "geojson",
          data: proposedRef.current.data,
        });

        map.addLayer({
          id: "proposed-roads-line",
          type: "line",
          source: "proposed-roads",
          layout: {
            visibility: proposedRef.current.visible ? "visible" : "none",
          },
          paint: {
            "line-color": [
              "match",
              ["get", "layer"],
              "300' CL",
              "#ff0000",
              "300' ROW",
              "#00bcd4",
              "bridge",
              "#9c27b0",
              "Primary Roads (300'-Wide)",
              "#2196f3",
              "Secondary Road (200'-Wide)",
              "#4caf50",
              "Tertiary Roads",
              "#ff9800",
              "Tertiary Roads (80'-Wide)",
              "#ff5722",
              "Uti Walk Cycle",
              "#8bc34a",
              "#888888",
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              1,
              14,
              3,
              16,
              6,
            ],
            "line-cap": "round",
            "line-join": "round",
          },
        });

        // click popup similar to ProposedRoadsLayer
        map.on("click", "proposed-roads-line", (e) => {
          const feature = e.features && e.features[0];
          const layerName = feature?.properties?.layer || "Proposed Road";
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${layerName}</strong>`)
            .addTo(map);
        });

        map.on(
          "mouseenter",
          "proposed-roads-line",
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          "proposed-roads-line",
          () => (map.getCanvas().style.cursor = "")
        );
      } else {
        map.setLayoutProperty(
          "proposed-roads-line",
          "visibility",
          proposedRef.current.visible ? "visible" : "none"
        );
      }
    };

    window.addEventListener("toggleProposedRoads", onToggle);
    return () => window.removeEventListener("toggleProposedRoads", onToggle);
  }, []);

  // Ruda Boundaries layers (Lahore, Sheikhupura, RTW)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Fetch each boundary GeoJSON only once
    const fetchOnce = async (key, url) => {
      const bucket = boundaryRef.current[key];
      if (!bucket.data) {
        const res = await fetch(url);
        const data = await res.json();
        bucket.data = data;
      }
      return boundaryRef.current[key].data;
    };

    // Create / update source + FILL + LINE layers
    const ensureSourceAndLayers = async (key, url, fillColor) => {
      const map = mapRef.current;
      if (!map) return;

      const data = await fetchOnce(key, url);
      const sourceId = `${key}-boundary`;
      const fillId = `${key}-boundary-fill`;
      const lineId = `${key}-boundary-line`;

      // Source
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data,
        });
      } else {
        map.getSource(sourceId).setData(data);
      }

      const beforeId = map.getLayer("ruda-dashboard-fill")
        ? "ruda-dashboard-fill"
        : undefined;

      // FILL layer
      if (!map.getLayer(fillId)) {
        map.addLayer(
          {
            id: fillId,
            type: "fill",
            source: sourceId,
            layout: {
              visibility: "none",
            },
            paint: {
              "fill-color": fillColor,
              "fill-opacity": 0.25,
            },
          },
          beforeId
        );
      }

      // OUTLINE layer
      if (!map.getLayer(lineId)) {
        map.addLayer(
          {
            id: lineId,
            type: "line",
            source: sourceId,
            layout: {
              visibility: "none",
            },
            paint: {
              "line-color": fillColor,
              "line-width": 1.5,
            },
          },
          beforeId
        );
      }

      return { fillId, lineId };
    };

    const applyState = async (state) => {
      if (!state) return;
      const map = mapRef.current;
      if (!map) return;

      const {
        lahore,
        sheikhupura,
        rtw,
        order = ["lahore", "sheikhupura", "rtw"],
      } = state;

      // Ensure layers exist for the ones we want visible
      if (lahore) {
        await ensureSourceAndLayers(
          "lahore",
          "/geojson/Lahore.geojson",
          "#284a28"
        );
      }
      if (sheikhupura) {
        await ensureSourceAndLayers(
          "sheikhupura",
          "/geojson/Sheikhupura.geojson",
          "#ba0000"
        );
      }
      if (rtw) {
        await ensureSourceAndLayers("rtw", "/geojson/River.geojson", "#122460");
      }

      // Toggle visibility according to selection
      const flags = { lahore, sheikhupura, rtw };
      ["lahore", "sheikhupura", "rtw"].forEach((key) => {
        const visible = flags[key];
        const fillId = `${key}-boundary-fill`;
        const lineId = `${key}-boundary-line`;
        if (map.getLayer(fillId)) {
          map.setLayoutProperty(
            fillId,
            "visibility",
            visible ? "visible" : "none"
          );
        }
        if (map.getLayer(lineId)) {
          map.setLayoutProperty(
            lineId,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      });

      // Enforce ordering: Lahore & Sheikhupura below RTW,
      // and ALL boundaries below the Layer Filters (ruda-dashboard-fill)
      const beforeId = map.getLayer("ruda-dashboard-fill")
        ? "ruda-dashboard-fill"
        : undefined;

      if (beforeId) {
        (order || ["lahore", "sheikhupura", "rtw"]).forEach((key) => {
          if (!flags[key]) return;
          const fillId = `${key}-boundary-fill`;
          const lineId = `${key}-boundary-line`;
          if (map.getLayer(fillId)) {
            map.moveLayer(fillId, beforeId);
          }
          if (map.getLayer(lineId)) {
            map.moveLayer(lineId, beforeId);
          }
        });
      }

      // 🔹 Zoom to selected boundaries
      const visibleKeys = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k);

      if (visibleKeys.length) {
        const allCoords = [];

        visibleKeys.forEach((key) => {
          const bucket = boundaryRef.current[key];
          const data = bucket?.data;
          if (!data) return;

          const feats =
            data.type === "FeatureCollection" ? data.features : [data];

          feats.forEach((feat) => {
            allCoords.push(...getCoordinatesFlat(feat.geometry));
          });
        });

        if (allCoords.length) {
          const lons = allCoords.map((c) => c[0]);
          const lats = allCoords.map((c) => c[1]);
          const minLon = Math.min(...lons);
          const maxLon = Math.max(...lons);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          map.fitBounds([minLon, minLat, maxLon, maxLat], {
            padding: 40,
            duration: 500,
          });
        }
      }
    };

    // Handle events coming from DashboardSidebar
    const onBoundaryChange = (e) => {
      const detail = e.detail || {};
      boundaryRef.current.selection = detail; // remember last choice
      applyState(detail);
    };

    window.addEventListener("rudaBoundariesChange", onBoundaryChange);

    // Re-apply current boundaries after a basemap style change
    const reapplyOnStyleLoad = () => {
      if (boundaryRef.current.selection) {
        applyState(boundaryRef.current.selection);
      }
    };

    map.on("style.load", reapplyOnStyleLoad);

    return () => {
      window.removeEventListener("rudaBoundariesChange", onBoundaryChange);
      map.off("style.load", reapplyOnStyleLoad);
    };
  }, []);

  // update source & layers when features or colorMap change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filtered = (features || []).filter((f) => {
      if (!selectedNames || selectedNames.length === 0) return false;
      return selectedNames.includes(f.properties?.name);
    });

    // Enrich features with normalized popup title and precomputed area (sq.km)
    const enriched = (filtered || []).map((feat) => {
      const props = feat.properties || {};
      const title =
        props.ruda_phase || props.name || props.Name || props.map_name || "";
      let areaSqKm = null;
      try {
        if (feat && feat.geometry) {
          areaSqKm = turf.area(feat) / 1000000; // convert m^2 to km^2
        }
      } catch (err) {
        areaSqKm = null;
      }

      const landAvailable =
        props.land_available_pct ??
        props.land_available_km ??
        props.land_available ??
        props.land_available_pct ??
        null;
      const physicalPct =
        props.physical_actual_pct ??
        props.physical_actual ??
        props.physical_pct ??
        null;

      return {
        ...feat,
        properties: {
          ...props,
          __popupTitle: title,
          __areaSqKm: areaSqKm,
          __name: props.name || props.Name || props.map_name || title,
          __landAvailablePct: landAvailable,
          __physicalPct: physicalPct,
          __phase: props.ruda_phase || props.phase || null,
          __package: props.rtw_pkg || props.package || null,
          __category: props.category || props.rtw_category || null,
        },
      };
    });

    const geojson = {
      type: "FeatureCollection",
      features: enriched,
    };

    const upsert = () => {
      try {
        // add or update source
        if (map.getSource("ruda-dashboard")) {
          map.getSource("ruda-dashboard").setData(geojson);
        } else {
          map.addSource("ruda-dashboard", { type: "geojson", data: geojson });

          // fill
          if (!map.getLayer("ruda-dashboard-fill")) {
            map.addLayer({
              id: "ruda-dashboard-fill",
              type: "fill",
              source: "ruda-dashboard",
              paint: {
                "fill-color": buildFillExpression(filtered, colorMap),
                "fill-opacity": 0.6,
              },
            });
            // click behavior: show detailed popup with links and metrics (similar to MainMap MapView)
            map.on("click", "ruda-dashboard-fill", (e) => {
              const feature = e.features && e.features[0];
              if (!feature) return;
              const props = feature.properties || {};
              const name =
                props.__name || props.name || props.__popupTitle || "Unnamed";
              const area =
                parseFloat(
                  props.__areaSqKm ?? props.area_sqkm ?? props.area ?? 0
                ) || 0;
              const landPct =
                props.__landAvailablePct ??
                props.land_available_pct ??
                props.land_available_km ??
                0;
              const physPct =
                props.__physicalPct ??
                props.physical_actual_pct ??
                props.physical_actual ??
                0;

              // 🔹 NEW: better project / package / phase detection
              const isProject = !!props.__category && !!props.__name;
              const isPackage = !!props.__package && !props.__category;

              let selectedParam;
              if (isProject) {
                selectedParam = name;
              } else if (isPackage) {
                selectedParam = props.__package || name;
              } else {
                selectedParam = props.__phase || name;
              }

              const popupHTML = `
  <div style="font-family: 'Segoe UI', sans-serif; min-width:180px; ">
    <h3 style="margin:0 0 8px; font-size:12px; color:#606162;">${name}</h3>
    <div style="font-size:12px; margin-bottom:8px;color:#606162;">
      <strong>Area:</strong> ${area.toFixed(2)} sq.km
    </div>

    <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; margin-bottom:8px;">
      <a href="/map?selected=${encodeURIComponent(
        selectedParam
      )}" target="_blank" rel="noopener noreferrer"
        style="text-decoration:none; display:block;">
        <div style="
          background:#17193b;
          color:#fff;
          border-radius:6px;
          padding:4px;
          text-align:center;
          font-weight:400;
          border:none;
          font-size:12px;
        ">
          Land Available — ${landPct || 0}%
        </div>
      </a>

      <a href="/phase2-gantt?selected=${encodeURIComponent(
        selectedParam
      )}" target="_blank"
        style="text-decoration:none; display:block;">
        <div style="
          background:#17193b;
          color:#fff;
          border-radius:6px;
          padding:4px;
          text-align:center;
          font-weight:400;
          border:none;
          font-size:12px;
        ">
          Physical Progress — ${physPct || 0}%
        </div>
      </a>

      <a href="/details/${encodeURIComponent(selectedParam)}" target="_blank"
        style="text-decoration:none; display:block;">
        <div style="
          background:#17193b;
          color:#fff;
          border-radius:6px;
          padding:4px;
          text-align:center;
          font-weight:400;
          border:none;
          font-size:12px;
        ">
         View Details
        </div>
      </a>
    </div>
  </div>
`;
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(popupHTML)
                .addTo(map);
            });
          }

          // outline
          if (!map.getLayer("ruda-dashboard-outline")) {
            map.addLayer({
              id: "ruda-dashboard-outline",
              type: "line",
              source: "ruda-dashboard",
              paint: { "line-color": "#000", "line-width": 1 },
            });
          }
        }

        // update paint expression when colors change
        if (map.getLayer("ruda-dashboard-fill")) {
          map.setPaintProperty(
            "ruda-dashboard-fill",
            "fill-color",
            buildFillExpression(filtered, colorMap)
          );
        }

        // fit to data if we have features
        if (filtered.length > 0) {
          const coords = filtered
            .flatMap((f) => getCoordinatesFlat(f.geometry))
            .filter(Boolean);
          if (coords.length > 0) {
            const lons = coords.map((c) => c[0]);
            const lats = coords.map((c) => c[1]);
            const minLon = Math.min(...lons);
            const maxLon = Math.max(...lons);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            map.fitBounds([minLon, minLat, maxLon, maxLat], {
              padding: 40,
              duration: 500,
            });
          }
        }
      } catch (err) {
        // ignore transient errors (e.g., style not ready)
        // but do not throw — we'll retry when style loads
        // console.debug('upsert error', err);
      }
    };

    // Ensure style is fully loaded before adding sources/layers
    // Prefer map.isStyleLoaded if available, otherwise fall back to waiting for 'load'
    try {
      const styleLoaded =
        typeof map.isStyleLoaded === "function" ? map.isStyleLoaded() : false;
      if (styleLoaded) {
        upsert();
      } else {
        map.once("load", upsert);
      }
    } catch (e) {
      // As a fallback
      map.once("load", upsert);
    }
  }, [features, colorMap, selectedNames]);

  // Hover popup for ruda-dashboard-fill — single reusable popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const popupRef = { current: null };
    const hoveredIdRef = { current: null };

    const onMove = (e) => {
      // only proceed if layer + source exist
      if (
        !map.getSource("ruda-dashboard") ||
        !map.getLayer("ruda-dashboard-fill")
      )
        return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["ruda-dashboard-fill"],
      });

      if (!features || features.length === 0) {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = "";
        return;
      }

      const f = features[0];
      // Identify layer type (Project / Package / Phase)
      const layerId = f.layer?.id?.toLowerCase() || "";
      let typeLabel = "Feature";
      if (layerId.includes("project")) typeLabel = "Project";
      else if (layerId.includes("package")) typeLabel = "Package";
      else if (layerId.includes("phase")) typeLabel = "Phase";

      // Get title and area
      const title =
        f.properties?.__popupTitle ||
        f.properties?.ruda_phase ||
        f.properties?.name ||
        "Unnamed Feature";

      const areaVal = f.properties?.__areaSqKm;
      const areaText =
        typeof areaVal === "number"
          ? `Area: ${areaVal.toFixed(2)} sq.km`
          : "Area: N/A";

      const id = title;
      if (hoveredIdRef.current === id && popupRef.current) {
        popupRef.current.setLngLat(e.lngLat);
        return;
      }

      hoveredIdRef.current = id;
      const html = `
        <div style="font-size: 11px; color: #242121; padding: 2px 2px; border-radius: 4px;">
            <div style="opacity:0.5;">${typeLabel}</div>
            <div>${title}</div>
            <div style="margin-top:2px;">${areaText}</div>
        </div>`;

      if (!popupRef.current)
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

      popupRef.current.setLngLat(e.lngLat).setHTML(html).addTo(map);
      map.getCanvas().style.cursor = "pointer";
    };

    const onLeave = () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      hoveredIdRef.current = null;
      map.getCanvas().style.cursor = "";
    };

    map.on("mousemove", onMove);
    map.on("mouseleave", "ruda-dashboard-fill", onLeave);

    return () => {
      map.off("mousemove", onMove);
      map.off("mouseleave", "ruda-dashboard-fill", onLeave);
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Basemap dropdown */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          background: "#fff",
          p: 1,
          borderRadius: 1,
          boxShadow: 2,
          minWidth: 120,
        }}
      >
        <FormControl size="small" fullWidth>
          <InputLabel>Basemap</InputLabel>
          <Select
            label="Basemap"
            value={baseStyleKey}
            onChange={(e) => setBaseStyleKey(e.target.value)}
          >
            {Object.keys(baseStyles).map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Map container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "transparent",
        }}
      />
    </div>
  );
};

const buildFillExpression = (features, colorMap) => {
  const pairs = (features || [])
    .filter((f) => !!f.properties?.name)
    .map((f) => [f.properties.name, colorMap[f.properties.name] || "#cccccc"]);
  const unique = Array.from(new Map(pairs).entries()).flat();
  return unique.length >= 2
    ? ["match", ["get", "name"], ...unique, "#cccccc"]
    : "#cccccc";
};

const getCoordinatesFlat = (geometry) => {
  if (!geometry) return [];
  const { type, coordinates } = geometry;
  if (type === "Point") return [coordinates];
  if (type === "MultiPoint" || type === "LineString") return coordinates;
  if (type === "MultiLineString" || type === "Polygon")
    return coordinates.flat();
  if (type === "MultiPolygon") return coordinates.flat(2);
  return [];
};

export default DashboardMap;
