import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Dashboard.css"; // 👈 we'll use this for hiding scrollbar

const OngoingProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const LOGOS = [
    "/Rudafirm.png",
    "/NLC-logo.jpg",
    "/Nespakfirm.png",
    "/Habibfirm.png",
  ];

  // Reuse same logo selection logic as in OngoingProjects.jsx
  const pickLogoForProject = (name, serialNumberHint = 0) => {
    const n = (name || "").toLowerCase();
    if (n.includes("nlc")) return "/NLC-logo.jpg";
    if (n.includes("nespak")) return "/Nespak.jpg";
    if (n.includes("habib") || n.includes("hcs")) return "/Habib.jpg";
    const idx = Math.abs((serialNumberHint + n.length) % LOGOS.length);
    return LOGOS[idx];
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/Sheet.json");
        const json = await res.json();
        const sheet = json.workbook?.sheets?.[0];

        if (!sheet?.rows) throw new Error("Invalid data");

        const ongoingProjects = [];
        let serial = 1;

        sheet.rows.forEach((row) => {
          const projectName =
            row["Project Amount Breakdown \nDevelopment Works"];
          const status = row["Ongoing / Completed"];
          if (status === "Ongoing" && projectName) {
            ongoingProjects.push({
              id: serial++,
              projectName,
              logoUrl: pickLogoForProject(projectName, serial),
            });
          }
        });

        setProjects(ongoingProjects.slice(0, 8)); // show top few
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="widget" style={styles.widgetContainer}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading ongoing projects...
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
          ONGOING PROJECTS
        </h6>
      </div>

      {/* Project List */}
      <div style={styles.listContainer} className="no-scrollbar">
        {projects.map((p) => (
          <button
            key={p.id}
            className="list-group-item text-left"
            style={styles.projectButton}
            onClick={() => navigate("/ongoing-projects")}
          >
            <span style={styles.thumb}>
              <img
                src={p.logoUrl}
                alt={p.projectName}
                style={styles.logo}
                loading="lazy"
              />
              <i style={styles.statusDot} />
            </span>
            <div>
              <h6 style={styles.projectName}>{p.projectName}</h6>
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
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            setProjects((prev) =>
              prev.filter((p) => p.projectName.toLowerCase().includes(q))
            );
          }}
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
    width: "380px", // 👈 fixed width (won’t change)
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
    alignItems: "center",
    border: "none",
    padding: "10px 14px",
    textAlign: "left",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.2s",
  },
  thumb: {
    position: "relative",
    marginRight: "12px",
  },
  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  statusDot: {
    position: "absolute",
    bottom: "4px",
    right: "4px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#28a745",
    border: "2px solid #1a1e3a",
  },
  projectName: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#ccc",
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

export default OngoingProjectsTable;
