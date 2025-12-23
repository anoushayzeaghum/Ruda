import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../dashboard.css";

const PriorityProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/Sheet.json");
        const json = await res.json();
        const sheet = json.workbook?.sheets?.[0];

        if (!sheet?.rows) throw new Error("Invalid data");

        const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
        const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
        const COL_BUDGET_REV0 = "Budget Estimates \nRev-0\n(PKR Millions)";
        const COL_PRIORITY = "Priority Projects";

        const get = (obj, key, fallbacks = []) => {
          if (!obj) return undefined;
          if (key in obj) return obj[key];
          const k = Object.keys(obj).find(
            (kk) => kk.trim().toLowerCase() === key.trim().toLowerCase()
          );
          if (k) return obj[k];
          for (const fb of fallbacks) if (fb in obj) return obj[fb];
          return undefined;
        };

        const toNum = (v) => {
          if (v === null || v === undefined || v === "" || v === "-")
            return null;
          const n = Number(String(v).toString().replace(/,/g, ""));
          return Number.isFinite(n) ? n : null;
        };

        const priorityProjects = [];
        let serial = 1;

        for (const row of sheet.rows) {
          const name = String(get(row, COL_BREAKDOWN) ?? "").trim();
          if (!name) continue;

          const priorityVal = get(row, COL_PRIORITY);
          const isPriority =
            (typeof priorityVal === "string" &&
              String(priorityVal).trim().toUpperCase() === "YES") ||
            Number(priorityVal) === 1;

          if (!isPriority) continue;

          const rawBudget =
            get(row, COL_BUDGET_EST) ??
            get(row, COL_BUDGET_REV0) ??
            get(row, "Budget Estimates \nRev-0\n(PKR Millions)") ??
            get(row, "Project Cost (PKR Million)");
          const budgetNum = toNum(rawBudget);

          priorityProjects.push({
            id: serial++,
            projectName: name,
            budget: budgetNum ? `PKR ${budgetNum.toLocaleString()} M` : "-",
            checked: false,
          });
        }

        setProjects(priorityProjects);
        setFiltered(priorityProjects);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(
      projects.filter((p) => p.projectName.toLowerCase().includes(query))
    );
  };

  const toggleCheckbox = (id) => {
    setFiltered((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  if (loading) {
    return (
      <div className="widget" style={styles.widgetContainer}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading priority projects...
        </div>
      </div>
    );
  }

  return (
    <div className="widget" style={styles.widgetContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h6
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            margin: 0,
            letterSpacing: "0.5px",
            color: "#ffffff",
          }}
        >
          PRIORITY PROJECTS
        </h6>
      </div>

      {/* Project List */}
      <div style={styles.listContainer} className="no-scrollbar">
        {filtered.map((p) => (
          <button
            key={p.id}
            className="list-group-item text-left"
            style={styles.projectButton}
            onClick={() => navigate("/hierarchical-gantt")}
          >
            <div style={styles.projectRow}>
              {/* Checkbox */}
              <div
                style={styles.checkbox}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheckbox(p.id);
                }}
              >
                {p.checked && <div style={styles.tick}></div>}
              </div>

              {/* Project Info */}
              <div style={styles.projectInfo}>
                <h6 style={styles.projectName}>{p.projectName}</h6>
                <p style={styles.projectBudget}>{p.budget}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Search */}
      <footer style={styles.footer}>
        <input
          type="search"
          placeholder="Search"
          style={styles.searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </footer>
    </div>
  );
};

// ---------- STYLES ----------
const styles = {
  widgetContainer: {
    borderRadius: "8px",
    overflow: "hidden",
    color: "white",
    width: "380px",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "340px",
    overflowY: "scroll",
  },
  projectButton: {
    background: "transparent",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    border: "none",
    padding: "10px 14px",
    textAlign: "left",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.2s",
  },
  projectRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "8px 0",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    border: "2px solid white",
    borderRadius: "4px",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  tick: {
    width: "8px",
    height: "8px",
    backgroundColor: "white",
    clipPath: "polygon(14% 44%, 0 65%, 50% 100%, 100% 22%, 80% 0%, 43% 62%)",
  },
  projectInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: "1.3",
  },
  projectName: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#ccc",
  },
  projectBudget: {
    margin: 0,
    fontSize: "0.75rem",
    opacity: 0.7,
  },
  footer: {
    padding: "10px 12px",
  },
  searchInput: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  },
};

export default PriorityProjectsTable;
