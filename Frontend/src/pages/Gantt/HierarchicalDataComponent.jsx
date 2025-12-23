import React, { useEffect, useMemo, useState, useRef } from "react";
import HeaderButtons from "../Dashboard/DashboardHeader/HeaderButtons";
/**
 * RUDA Development Plan – Timeline (Updated Design)
 * Matches the design from the provided image
 */
// Milestone columns (from HierarchicalDataComponent1.jsx)
const MILESTONE_COLS = [
  "PC-I Preparation",
  "PC-I Approval (DDC, RDWP, Board)",
  "Admin Approval",
  "Technical Sanction (TS)",
  "Tender Advert",
  "Bid Receipt",
  "Technical evaluation",
  "Financial evaluation",
  "Letter of Acceptance (LOA)",
  "Contract Award",
  "Commencement of Work",
];

export default function RUDAPlanTimeline({
  jsonPath = "/Sheet.json",
  sheetName = "R.Dev Plan (v3.2 Actual udpate)",
}) {
  // ----- CONSTANTS (column ids from your standardized JSON) -----
  const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
  const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
  const COL_BUDGET_REV0 = "Budget Estimates \nRev-0\n(PKR Millions)";
  const COL_ONGOING = "Ongoing / Completed";
  const COL_PRIORITY = "Priority Projects";
  const COL_RUDA = "RAVI URBAN DEVELOPMENT AUTHORITY (RUDA)";
  const COL_SECTION = "Section";
  const COL_SN = "Sn.";

  // ----- State -----
  const [raw, setRaw] = useState(null);
  const [activeSheetName, setActiveSheetName] = useState(sheetName);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expanded, setExpanded] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [query, setQuery] = useState("");
  const [showPriority, setShowPriority] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOngoing, setShowOngoing] = useState(false);

  // Initialize filters from URL query params (e.g. ?filter=ongoing)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const f = (params.get("filter") || "").trim().toLowerCase();
      const searchParam = params.get("search");

      if (f === "ongoing") {
        setShowOngoing(true);
        setShowPriority(false);
        setShowCompleted(false);
      } else if (f === "completed") {
        setShowCompleted(true);
        setShowPriority(false);
        setShowOngoing(false);
      } else if (f === "priority") {
        setShowPriority(true);
        setShowCompleted(false);
        setShowOngoing(false);
      }

      if (searchParam) setQuery(searchParam);
    } catch (e) {
      // ignore malformed URL params
    }
  }, []);

  const scrollerRef = useRef(null);

  // ----- Data load -----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(jsonPath);
        if (!r.ok) throw new Error("Failed to fetch JSON");
        const j = await r.json();
        if (!alive) return;
        setRaw(j);
        setErr("");
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [jsonPath]);

  // ----- Sheet list -----
  const sheets = useMemo(() => raw?.workbook?.sheets ?? [], [raw]);

  useEffect(() => {
    if (!sheets.length) return;
    if (
      !sheets.find(
        (s) => String(s.name).trim() === String(activeSheetName).trim()
      )
    ) {
      setActiveSheetName(sheets[0].name);
    }
  }, [sheets, activeSheetName]);

  const rows = useMemo(() => {
    const s = sheets.find(
      (x) => String(x.name).trim() === String(activeSheetName).trim()
    );
    return s?.rows ?? [];
  }, [sheets, activeSheetName]);

  // ----- Helpers -----
  const get = (obj, key, fallbacks = []) => {
    if (key in obj) return obj[key];
    const k = Object.keys(obj).find(
      (kk) => kk.trim().toLowerCase() === key.trim().toLowerCase()
    );
    if (k) return obj[k];
    for (const fb of fallbacks) {
      if (fb in obj) return obj[fb];
    }
    return undefined;
  };

  const toNum = (v) => {
    if (v === null || v === undefined || v === "" || v === "-") return null;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const fmt = (n) =>
    n === null || n === undefined || Number.isNaN(n) ? "-" : n.toLocaleString();

  const isPhaseRow = (r) => {
    const rawPhase = get(r, COL_RUDA, [COL_SECTION]);
    const v = String(rawPhase ?? "")
      .trim()
      .toUpperCase();
    return v.startsWith("PHASE");
  };

  const isCategoryRow = (r) => {
    const sn = get(r, COL_SN, ["Unnamed: 1"]);
    const name = get(r, COL_BREAKDOWN, [
      "Project Amount Breakdown  Development Works",
      "Unnamed: 2",
    ]);
    return !!name && !!sn && /^[A-Z]$/.test(String(sn).trim());
  };

  const isItemRow = (r) => {
    const sn = get(r, COL_SN, ["Unnamed: 1"]);
    const name = get(r, COL_BREAKDOWN, [
      "Project Amount Breakdown  Development Works",
      "Unnamed: 2",
    ]);
    return !!name && !sn && !isPhaseRow(r);
  };

  // Collect FY columns dynamically
  const FY_COLS = useMemo(() => {
    const set = new Set();
    for (const r of rows) {
      Object.keys(r).forEach((k) => {
        if (/^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k)) set.add(k);
      });
    }

    const mostFYRow = rows.reduce(
      (best, r) => {
        const c = Object.keys(r).filter((k) =>
          /^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k)
        ).length;
        return c > best.count ? { row: r, count: c } : best;
      },
      { row: null, count: 0 }
    ).row;

    if (!mostFYRow) return Array.from(set);

    const ordered = Object.keys(mostFYRow).filter(
      (k) => /^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k) && set.has(k)
    );
    for (const k of set) if (!ordered.includes(k)) ordered.push(k);
    return ordered;
  }, [rows]);

  const getFYValue = (row, fyCol) => {
    const value = get(row, fyCol);
    if (value === null || value === undefined || value === "" || value === "-")
      return null;
    return value;
  };

  // ----- Build hierarchy -----
  const hierarchy = useMemo(() => {
    const phases = [];
    let curP = null;
    let curC = null;

    for (const r of rows) {
      if (isPhaseRow(r)) {
        const title = String(get(r, COL_RUDA, [COL_SECTION]) ?? "").trim();
        const amt =
          toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curP = { title, amount: amt, raw: r, cats: [] };
        phases.push(curP);
        curC = null;
        continue;
      }
      if (!curP) continue;

      if (isCategoryRow(r)) {
        const name = String(
          get(r, COL_BREAKDOWN, [
            "Project Amount Breakdown  Development Works",
            "Unnamed: 2",
          ]) ?? ""
        ).trim();
        const amt =
          toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curC = { name, amount: amt, raw: r, items: [] };
        curP.cats.push(curC);
        continue;
      }

      if (isItemRow(r) && curC) {
        const name = String(
          get(r, COL_BREAKDOWN, [
            "Project Amount Breakdown  Development Works",
            "Unnamed: 2",
          ]) ?? ""
        ).trim();
        const amt =
          toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curC.items.push({ name, amount: amt, raw: r });
      }
    }
    return phases;
  }, [rows]);

  // Filter by search and priority/completed/ongoing
  const filteredHierarchy = useMemo(() => {
    let filtered = hierarchy;

    const upper = (v) =>
      String(v || "")
        .trim()
        .toUpperCase();

    if (showPriority) {
      filtered = filtered
        .map((phase) => {
          const cats = phase.cats
            .map((cat) => {
              const items = cat.items.filter(
                (item) => upper(item.raw[COL_PRIORITY]) === "YES"
              );
              const isCatPriority = upper(cat.raw[COL_PRIORITY]) === "YES";
              if (isCatPriority || items.length > 0) return { ...cat, items };
              return null;
            })
            .filter(Boolean);

          const isPhasePriority = upper(phase.raw[COL_PRIORITY]) === "YES";
          if (isPhasePriority || cats.length > 0) return { ...phase, cats };
          return null;
        })
        .filter(Boolean);
    }

    if (showCompleted) {
      filtered = filtered
        .map((phase) => {
          const cats = phase.cats
            .map((cat) => {
              const items = cat.items.filter(
                (item) => upper(item.raw[COL_ONGOING]) === "COMPLETED"
              );
              const isCatCompleted =
                upper(cat.raw[COL_ONGOING]) === "COMPLETED";
              if (isCatCompleted || items.length > 0) return { ...cat, items };
              return null;
            })
            .filter(Boolean);

          const isPhaseCompleted =
            upper(phase.raw[COL_ONGOING]) === "COMPLETED";
          if (isPhaseCompleted || cats.length > 0) return { ...phase, cats };
          return null;
        })
        .filter(Boolean);
    }

    if (showOngoing) {
      filtered = filtered
        .map((phase) => {
          const cats = phase.cats
            .map((cat) => {
              const items = cat.items.filter(
                (item) => upper(item.raw[COL_ONGOING]) === "ONGOING"
              );
              const isCatOngoing = upper(cat.raw[COL_ONGOING]) === "ONGOING";
              if (isCatOngoing || items.length > 0) return { ...cat, items };
              return null;
            })
            .filter(Boolean);

          const isPhaseOngoing = upper(phase.raw[COL_ONGOING]) === "ONGOING";
          if (isPhaseOngoing || cats.length > 0) return { ...phase, cats };
          return null;
        })
        .filter(Boolean);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered
        .map((p) => {
          const pHit = p.title.toLowerCase().includes(q);
          const cats = p.cats
            .map((c) => {
              const cHit = c.name.toLowerCase().includes(q);
              const its = c.items.filter((it) =>
                it.name.toLowerCase().includes(q)
              );
              if (cHit && its.length === 0) return { ...c, items: c.items };
              if (!cHit && its.length === 0) return null;
              return { ...c, items: its };
            })
            .filter(Boolean);

          if (pHit && cats.length === 0) return p;
          if (pHit || cats.length > 0) return { ...p, cats };
          return null;
        })
        .filter(Boolean);
    }

    return filtered;
  }, [hierarchy, query, showPriority, showCompleted, showOngoing]);

  // Auto-expand phases when URL parameter is set
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const expandParam = params.get("expand");

    if (expandParam === "all" && filteredHierarchy.length > 0) {
      const newExpanded = {};
      const newExpandedCategories = {};

      filteredHierarchy.forEach((phase, phaseIdx) => {
        newExpanded[phaseIdx] = true;
        phase.cats.forEach((_, catIdx) => {
          const categoryKey = `${phaseIdx}-${catIdx}`;
          newExpandedCategories[categoryKey] = true;
        });
      });

      setExpanded(newExpanded);
      setExpandedCategories(newExpandedCategories);
    }
  }, [filteredHierarchy]);

  // ---- UI helpers (no functionality changes) ----
  const setExclusiveFilter = (key) => {
    if (key === "priority") {
      setShowPriority((v) => !v);
      setShowCompleted(false);
      setShowOngoing(false);
      return;
    }
    if (key === "completed") {
      setShowCompleted((v) => !v);
      setShowPriority(false);
      setShowOngoing(false);
      return;
    }
    if (key === "ongoing") {
      setShowOngoing((v) => !v);
      setShowPriority(false);
      setShowCompleted(false);
      return;
    }
  };

  const filterButtons = [
    {
      key: "priority",
      label: "PRIORITY",
      active: showPriority,
      onClick: () => setExclusiveFilter("priority"),
    },
    {
      key: "completed",
      label: "COMPLETED",
      active: showCompleted,
      onClick: () => setExclusiveFilter("completed"),
    },
    {
      key: "ongoing",
      label: "ONGOING",
      active: showOngoing,
      onClick: () => setExclusiveFilter("ongoing"),
    },
  ];

  if (loading) return <div className="ruda-loading">Loading...</div>;
  if (err) return <div className="ruda-error">Error: {err}</div>;

  return (
    <div className="ruda-container">
      {/* Header (same as OngoingProjects) */}
      <div className="ruda-header">
        <div>
          <h1>RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        </div>
        <HeaderButtons />
      </div>

      {/* Controls */}
      <div className="ruda-controls">
        <select
          value={activeSheetName}
          onChange={(e) => {
            setActiveSheetName(e.target.value);
            setExpanded({});
          }}
          className="sheet-select"
        >
          {sheets.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Search centered with better left/right padding */}
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search phases / packages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Right buttons */}
        <div className="header-right">
          <div className="filter-group" role="group" aria-label="Filters">
            {filterButtons.map((b) => (
              <button
                key={b.key}
                className={`chip-btn ${b.key}${b.active ? " active" : ""}`}
                onClick={b.onClick}
                type="button"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container" ref={scrollerRef}>
        <table className="ruda-table">
          <thead>
            <tr className="header-row">
              <th
                style={{ width: "365px", minWidth: "365px" }}
                className="col-phases"
              >
                PHASES / PACKAGES
              </th>
              <th
                style={{ width: "100px", minWidth: "100px" }}
                className="col-amount"
              >
                Amount
                <br />
                (PKR, M)
              </th>
              <th
                style={{ width: "100px", minWidth: "100px" }}
                className="col-budget-rev0"
              >
                Budget Estimates
                <br />
                Rev-0
                <br />
                (PKR Millions)
              </th>
              <th
                style={{ width: "100px", minWidth: "100px" }}
                className="col-budget-est"
              >
                Budget Estimates
                <br />
                (PKR Millions)
              </th>
              <th
                style={{ width: "100px", minWidth: "100px" }}
                className="col-ongoing"
              >
                Ongoing /<br />
                Completed
              </th>
              <th
                style={{ width: "100px", minWidth: "100px" }}
                className="col-priority"
              >
                Priority
                <br />
                Projects
              </th>
              {FY_COLS.map((fy) => (
                <th key={fy} className="col-fy">
                  {fy}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredHierarchy.map((phase, idx) => {
              const isExpanded = expanded[idx];

              return (
                <React.Fragment key={phase.title}>
                  {/* Phase Row */}
                  <tr
                    className="phase-row"
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [idx]: !isExpanded }))
                    }
                  >
                    <td className="phase-name">
                      <span
                        className={`expand-icon ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▲
                      </span>
                      <strong>{phase.title}</strong>
                    </td>
                    <td className="amount">{fmt(phase.amount)}</td>
                    <td>{fmt(toNum(get(phase.raw, COL_BUDGET_REV0)))}</td>
                    <td>{fmt(toNum(get(phase.raw, COL_BUDGET_EST)))}</td>
                    <td>{get(phase.raw, COL_ONGOING) || "-"}</td>
                    <td>{get(phase.raw, COL_PRIORITY) || "-"}</td>
                    {FY_COLS.map((fy) => {
                      const value = getFYValue(phase.raw, fy);
                      return (
                        <td key={fy} className="fy-cell">
                          {value !== null ? fmt(toNum(value)) : "-"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category and Item Rows */}
                  {isExpanded &&
                    phase.cats.map((category, catIdx) => {
                      const categoryKey = `${idx}-${catIdx}`;
                      const isCategoryExpanded =
                        expandedCategories[categoryKey];

                      return (
                        <React.Fragment key={category.name}>
                          {/* Category Row */}
                          <tr
                            className="category-row"
                            onClick={() =>
                              setExpandedCategories((prev) => ({
                                ...prev,
                                [categoryKey]: !isCategoryExpanded,
                              }))
                            }
                          >
                            <td className="item-name category-name">
                              <span className="category-indent"></span>
                              <span
                                className={`expand-icon ${
                                  isCategoryExpanded ? "expanded" : ""
                                }`}
                              >
                                ▲
                              </span>
                              {category.name}
                            </td>
                            <td className="amount">{fmt(category.amount)}</td>
                            <td>
                              {fmt(toNum(get(category.raw, COL_BUDGET_REV0)))}
                            </td>
                            <td>
                              {fmt(toNum(get(category.raw, COL_BUDGET_EST)))}
                            </td>
                            <td>{get(category.raw, COL_ONGOING) || "-"}</td>
                            <td>{get(category.raw, COL_PRIORITY) || "-"}</td>
                            {FY_COLS.map((fy) => {
                              const value = getFYValue(category.raw, fy);
                              return (
                                <td key={fy} className="fy-cell">
                                  {value !== null ? fmt(toNum(value)) : "-"}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Sub-item Rows with milestone rows */}
                          {isCategoryExpanded &&
                            category.items.map((item, itemIdx) => {
                              const itemKey = `${category.name}-${item.name}-${itemIdx}`;
                              const isMilestoneExpanded =
                                expandedCategories[itemKey];

                              return (
                                <React.Fragment key={item.name}>
                                  <tr
                                    className="item-row"
                                    onClick={() =>
                                      setExpandedCategories((prev) => ({
                                        ...prev,
                                        [itemKey]: !isMilestoneExpanded,
                                      }))
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <td className="item-name sub-item">
                                      <span className="sub-item-indent"></span>
                                      <span
                                        className={`expand-icon${
                                          isMilestoneExpanded ? " expanded" : ""
                                        }`}
                                      >
                                        &nbsp;&nbsp; ▲ &nbsp;
                                      </span>
                                      {item.name}
                                    </td>
                                    <td className="amount">
                                      {fmt(item.amount)}
                                    </td>
                                    <td>
                                      {fmt(
                                        toNum(get(item.raw, COL_BUDGET_REV0))
                                      )}
                                    </td>
                                    <td>
                                      {fmt(
                                        toNum(get(item.raw, COL_BUDGET_EST))
                                      )}
                                    </td>
                                    <td>{get(item.raw, COL_ONGOING) || "-"}</td>
                                    <td>
                                      {get(item.raw, COL_PRIORITY) || "-"}
                                    </td>
                                    {FY_COLS.map((fy) => {
                                      const value = getFYValue(item.raw, fy);
                                      return (
                                        <td key={fy} className="fy-cell">
                                          {value !== null
                                            ? fmt(toNum(value))
                                            : "-"}
                                        </td>
                                      );
                                    })}
                                  </tr>

                                  {isMilestoneExpanded &&
                                    MILESTONE_COLS.map((milestone) => (
                                      <React.Fragment
                                        key={item.name + milestone}
                                      >
                                        <tr className="milestone-row">
                                          <td className="item-name milestone-name">
                                            <span className="sub-item-indent"></span>
                                            <span className="milestone-indent"></span>{" "}
                                            <span
                                              style={{
                                                color: "darkblue",
                                                marginLeft: "20px",
                                                marginRight: "6px",
                                              }}
                                            >
                                              ●
                                            </span>
                                            {milestone}
                                          </td>

                                          <td className="amount">-</td>
                                          <td className="amount">-</td>
                                          <td className="amount">-</td>
                                          <td className="amount">-</td>
                                          <td className="amount">-</td>
                                          {FY_COLS.map((fy) => (
                                            <td key={fy} className="fy-cell">
                                              -
                                            </td>
                                          ))}
                                        </tr>
                                        <tr className="milestone-separator">
                                          <td
                                            colSpan={6 + FY_COLS.length}
                                            style={{ padding: 0 }}
                                          >
                                            <div
                                              style={{
                                                borderBottom:
                                                  "1px solid #e2e8f0",
                                                margin: "0 0 0 60px",
                                              }}
                                            ></div>
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                </React.Fragment>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .ruda-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          padding: 0;
          margin: 0;
          background: #fff;
        }

        /* Header same as OngoingProjects */
        .ruda-header {
          background: radial-gradient(farthest-side ellipse at 20% 0, #333867 40%, #23274b);
          color: white;
          padding: 15px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .ruda-header h1 {
          margin: 0;
          font-weight: 100;
          font-size: 1.5rem;
          color: #fff;
          text-transform: uppercase;
        }

        /* Controls row */
        .ruda-controls {
          background: #e2e8f0;
          padding: 12px 24px; /* more left/right padding */
          display: flex;
          gap: 14px;
          align-items: center;
          border-bottom: 1px solid #d7dee9;
        }

        .sheet-select {
          padding: 8px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          font-size: 14px;
          min-width: 240px;
          background: white;
          outline: none;
        }

        /* Search centered with better visibility */
        .search-wrap {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 20px; /* left/right padding around search */
        }
        .search-input {
          width: 100%;
          max-width: 900px;
          padding: 10px 14px;
          border: 1px solid #cbd5e0;
          border-radius: 10px;
          font-size: 14px;
          background: white;
          outline: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .search-input:focus {
          border-color: rgba(51,56,103,0.6);
          box-shadow: 0 0 0 3px rgba(51,56,103,0.15);
        }

        /* Right-side buttons */
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .filter-group {
          display: inline-flex;
          gap: 8px;
          padding: 6px;
          border-radius: 12px;
          
          backdrop-filter: blur(4px);
        }

        /* Professional chips */
        .chip-btn {
          appearance: none;
          border: 1px solid transparent;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.3px;
          transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          color: white;
          user-select: none;
          white-space: nowrap;
        }
        .chip-btn:hover { transform: translateY(-1px); }
        .chip-btn:active { transform: translateY(0px); }

        .chip-btn.priority { background: #ef4444; }
        .chip-btn.priority.active {
          background: #dc2626;
          border-color: #991b1b;
          box-shadow: 0 6px 16px rgba(220,38,38,0.22);
        }

        .chip-btn.completed { background: #22c55e; }
        .chip-btn.completed.active {
          background: #16a34a;
          border-color: #15803d;
          box-shadow: 0 6px 16px rgba(22,163,74,0.22);
        }

        .chip-btn.ongoing { background: #f97316; }
        .chip-btn.ongoing.active {
          background: #ea580c;
          border-color: #c2410c;
          box-shadow: 0 6px 16px rgba(234,88,12,0.22);
        }

        .chip-btn.home {
          background: #4a90e2;
          border-color: rgba(0,0,0,0.05);
        }
        .chip-btn.home:hover { box-shadow: 0 6px 16px rgba(74,144,226,0.22); }

        /* Table */
        .table-container {
          overflow: auto;
          background: white;
          max-height: calc(100vh - 120px);
        }

        .ruda-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .header-row {
          background: #2c5282;
          color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-row th {
          padding: 10px 8px;
          border: 1px solid #357abd;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          vertical-align: middle;
          min-width: 80px;
        }

        .col-phases {
          min-width: 250px;
          text-align: left !important;
        }
        .col-amount { min-width: 90px; }
        .col-budget-rev0, .col-budget-est { min-width: 100px; }
        .col-ongoing, .col-priority { min-width: 80px; }
        .col-fy {
          min-width: 120px;
          padding: 8px !important;
          text-align: center;
          font-weight: bold;
        }

        .phase-row {
          background: #2d3748;
          color: white;
          cursor: pointer;
        }
        .phase-row:hover { background: #4a5568; }
        .phase-row td {
          padding: 12px 8px;
          border: 1px solid #4a5568;
          font-weight: bold;
        }

        .phase-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .expand-icon {
          font-size: 10px;
          transition: transform 0.2s;
        }
        .expand-icon.expanded { transform: rotate(180deg); }

        .category-row { background: #f7fafc; cursor: pointer; }
        .category-row:hover { background: #edf2f7; }
        .category-row td { padding: 10px 8px; border: 1px solid #e2e8f0; }

        .category-name { display: flex; align-items: center; gap: 8px; }
        .category-indent { width: 20px; }
        .sub-item-indent { width: 40px; display: inline-block; }

        .item-row { background: white; }
        .item-row td { padding: 8px 8px; border: 1px solid #e2e8f0; }

        .item-name { text-align: left; font-weight: 500; }
        .sub-item { padding-left: 20px; color: #4a5568; }

        .amount { text-align: center; font-weight: 500; }
        .fy-cell { padding: 8px !important; text-align: center; font-weight: 500; }

        .ruda-loading, .ruda-error {
          padding: 40px;
          text-align: center;
          font-size: 16px;
          background: white;
          margin: 20px;
          border-radius: 8px;
        }
        .ruda-error { color: #dc2626; }

        .col-milestone {
          min-width: 120px;
          padding: 8px !important;
          text-align: center;
          font-weight: bold;
          background: #f3f4f6;
        }
        .milestone-cell {
          text-align: center;
          color: #888;
          font-style: italic;
          background: #f9fafb;
        }
        .milestone-row .milestone-name {
          color: #2c5282;
          font-size: 12px;
          font-style: italic;
        }
        .milestone-row td {
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 8px 8px;
          background: #f9fafb;
        }
        .milestone-separator td {
          background: #f9fafb;
          height: 2px;
          padding: 0;
          border: none;
        }
        .milestone-indent {
          width: 20px;
          display: inline-block;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .ruda-table { font-size: 11px; }
          .header-row th { padding: 8px 6px; font-size: 10px; }
          .sheet-select { min-width: 200px; }
        }

        @media (max-width: 900px) {
          .ruda-controls { flex-direction: column; align-items: stretch; }
          .search-wrap { justify-content: stretch; padding: 0; }
          .search-input { max-width: 100%; }
          .header-right { justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}
