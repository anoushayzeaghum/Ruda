import React from "react";
import { MapPin, Settings, Search, ChevronDown, ChevronUp } from "lucide-react";

const RudaStatistics = ({ isCollapsed = false, setIsCollapsed = () => {} }) => {
  const stats = [
    {
      title: "Priority Projects",
      desc: "Progress of Priority Projects",
      color: "#2196f3",
      progress: 20,
    },
    {
      title: "Ongoing Projects",
      desc: "Progress of Ongoing Projects",
      color: "#f44336",
      progress: 70,
    },
    {
      title: "Completed Projects",
      desc: "Progress  of PCompleted Projects",
      color: "#4caf50",
      progress: 10,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        color: "#fff",
        padding: "16px",
        fontFamily: '"Open Sans", sans-serif',
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
      }}
    >
      {/* 🔹 Header with Collapse/Expand Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isCollapsed ? "0" : "8px",
          paddingBottom: isCollapsed ? "0" : "8px",
          borderBottom: isCollapsed ? "none" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3
          style={{ fontSize: "1.2rem", margin: 0, fontWeight: "400" }}
        >
          Ruda{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>Statistics</span>
        </h3>
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
          title={isCollapsed ? "Expand Statistics" : "Collapse Statistics"}
        >
          {isCollapsed ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronUp size={18} />
          )}
        </div>
      </div>

      {/* 🔹 Content - only show when not collapsed */}
      {!isCollapsed && (
        <>
          <div style={{ marginTop: "8px" }}>
            <p style={{ marginBottom: "10px" }}>Status: Live</p>

            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                margin: 0,
              }}
            >
              <MapPin size={16} />
              Ruda, Lahore, Pakistan
            </p>
          </div>

          {/* 🔹 Progress Stats */}
          <div style={{ marginTop: "4px" }}>
            {stats.map((item) => (
              <div
                key={item.title}
                style={{
                  marginBottom: "5px",
                  borderRadius: "8px",
                  padding: "10px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div>
                    <h6
                      style={{
                        marginBottom: "4px",
                        fontSize: "0.95rem",
                        fontWeight: "300",
                        color: "#fff",
                      }}
                    >
                      {item.title}
                    </h6>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#bbb" }}>
                      {item.desc}
                    </p>
                  </div>
                  <span
                    style={{
                      background: "#303563",
                      borderRadius: "6px",
                      padding: "6px 6px",
                      fontSize: "0.75rem",
                      height: "35px",
                    }}
                  >
                    {item.progress}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "#2a2a2a",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.progress}%`,
                      height: "100%",
                      background: item.color,
                      transition: "width 0.4s ease",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Bottom Info */}
          <div style={{ marginTop: "8px" }}>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                margin: "2px 0",
              }}
            >
              <Settings size={16} />
              150 Projects in progress
            </p>

            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#17193b",
                borderRadius: "4px",
                padding: "6px 12px",
                width: "90%",
                maxWidth: "400px",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                marginTop: "20px",
              }}
            >
              <Search size={18} color="#fff" style={{ marginRight: "8px" }} />
              <input
                type="text"
                placeholder="Search Project"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.9rem",
                }}
              />
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default RudaStatistics;
