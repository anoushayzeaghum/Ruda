const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "0px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2px",
    color: "#333",
  },
  row: {
    display: "grid",
    gap: "16px",
    marginBottom: "24px",
  },
  firstRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "stretch", // ✅ Forces child cards to same height
  },

  secondRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  thirdRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  fourthRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },
  card: {
    backgroundColor: "white",
    padding: "12px", // reduced padding
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // or 'center' if you want centered layout
    height: "auto", // let it shrink-wrap
    minHeight: "auto", // override fixed sizing if any
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    textAlign: "center",
    backgroundColor: "#333",
    color: "white",
    padding: "8px",
    borderRadius: "4px",
    textOverflow: "ellipsis" /* Handle text overflow */,
    whiteSpace: "nowrap" /* Prevent text from wrapping */,
    overflow: "hidden" /* Hide overflowing text */,
  },

  masterPlan: {
    height: "292px" /* Set the height of the master plan container */,
    backgroundColor: "#e5e7eb" /* Background color if image is not loaded */,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden" /* Prevent image from overflowing */,
    position: "relative" /* Positioning context for absolute positioning */,
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "fill", // ✅ Ensures it fills entire container box
    borderRadius: "8px",
    display: "block", // ✅ Prevents extra spacing or collapse
  },

  chartContainer: {
    display: "flex",
    justifyContent: "flex-start", // Align chart to the left
    alignItems: "center",
    width: "100%", // Full width of the container
    height: "300px", // Adjust the height of the chart as necessary
    marginLeft: "-30px", // Shift the chart slightly to the left
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    height:
      "auto" /* Ensure the height is flexible and adjusts to the content */,
    overflow: "hidden" /* Prevent content overflow */,
  },
  metricCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 6px rgba(0.1, 0.1, 0.1, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%" /* Make the card flexible and adjust height */,
    maxHeight: "150px" /* Set a max height to avoid overflow */,
    overflow: "hidden" /* Hide content that overflows */,
    textAlign: "center" /* Center text horizontally */,
  },
  metricIcon: {
    backgroundColor: "rgb(33, 150, 243)",
    color: "white",
    padding: "8px",
    borderRadius: "50%",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "rgb(33, 150, 243)",
    marginBottom: "4px",
    overflow: "hidden" /* Prevent text overflow */,
    textOverflow: "ellipsis" /* Add ellipsis if the text is too long */,
    whiteSpace: "nowrap" /* Prevent wrapping text */,
  },
  metricTitle: {
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "center",
  },
  timelineContainer: {
    padding: "16px",
  },
  timelineDuration: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "12px",
  },
  durationLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },
  durationChips: {
    display: "flex",
    gap: "8px",
  },
  chip: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "white",
  },
  chipGreen: {
    backgroundColor: "#10b981",
  },
  chipBlue: {
    backgroundColor: "#3b82f6",
  },
  timelineYears: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "8px",
  },
  timelineBar: {
    display: "flex",
    gap: "4px",
    marginBottom: "12px",
    overflow: "hidden" /* Prevent content from overflowing */,
  },

  timelineElapsed: {
    backgroundColor: "#10b981",
    height: "16px",
    flex: 1,
    borderRadius: "4px",
  },
  timelineRemaining: {
    backgroundColor: "#3b82f6",
    height: "16px",
    flex: 2.5,
    borderRadius: "4px",
  },
  timelineLegend: {
    display: "flex",
    justifyContent: "center" /* Center the legend items horizontally */,
    gap: "16px",
    alignItems: "center" /* Center items vertically */,
    marginTop: "12px" /* Space between legend and other content */,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "2px",
  },
  legendText: {
    fontSize: "12px",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row" /* Arrange progress cards horizontally */,
    justifyContent: "center" /* Center progress cards horizontally */,
    alignItems: "center" /* Center progress cards vertically */,
    height: "auto" /* Allow height to adjust based on content */,
    gap: "16px" /* Space between progress cards */,
    overflow: "hidden" /* Prevent overflow */,
  },

  progressCard: {
    backgroundColor: "white",
    padding: "0px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center" /* Center the contents horizontally */,
    justifyContent: "center" /* Ensure that content is centered vertically */,
    height: "fit-content" /* Adjust height to fit content */,
    maxWidth:
      "200px" /* Set max width to ensure cards don’t stretch too wide */,
    overflow: "hidden" /* Prevent content overflow */,
    textAlign: "center" /* Center text horizontally */,
  },
  progressCircle: {
    width: "90px" /* Set width */,
    height: "90px" /* Set height */,
    borderRadius: "50%",
    border: "4px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px" /* Add some space between the circle and text */,
    position: "relative" /* Positioning context for inner circle */,
    margin: "0 auto" /* Center the circle horizontally */,
  },
  progressInner: {
    backgroundColor: "white",
    width: "70px" /* Adjust width */,
    height: "70px" /* Adjust height */,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  progressText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#374151",
    overflow: "hidden" /* Prevent text from overflowing */,
    textOverflow: "ellipsis" /* Add ellipsis for long labels */,
    whiteSpace: "nowrap" /* Prevent wrapping text */,
  },

  financialGrid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "auto" /* Allow the height to adjust based on content */,
    gap: "16px",
    overflow: "hidden" /* Prevent content overflow */,
  },
  financialItem: {
    textAlign: "center",
    maxHeight: "100px" /* Limit the height of financial items */,
    overflow: "hidden" /* Prevent content from overflowing */,
  },
  financialValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "4px",
    textOverflow: "ellipsis" /* Add ellipsis if value is too long */,
    overflow: "hidden" /* Prevent overflow */,
    whiteSpace: "nowrap" /* Prevent text from wrapping */,
  },
  financialLabel: {
    fontSize: "12px",
    color: "#6b7280",
    overflow: "hidden" /* Prevent content overflow */,
    textOverflow: "ellipsis" /* Add ellipsis for long labels */,
    whiteSpace: "nowrap" /* Prevent wrapping text */,
  },

  budgetContainer: {
    marginTop: "35px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "auto" /* Adjust based on content */,
    gap: "16px",
    overflow: "hidden",
    padding: "0px" /* Prevent overflow */,
  },
  budgetItem: {
    marginBottom: "10px", // reduced space between rows
    textAlign: "left",
  },

  budgetLabel: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "4px",
  },

  budgetBar3D: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "13px",
    padding: "0 12px",
    boxShadow: "4px 4px 0 rgba(0,0,0,0.2)", // 👈 3D effect
    borderRadius: "3px",
    maxWidth: "300px",
    width: "fit-content", // shrink to content unless explicitly set
  },

  budgetBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflow: "hidden" /* Prevent overflow */,
  },
  budgetProgress: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    height: "12px",
    overflow: "hidden" /* Prevent overflow */,
  },
  budgetFill: {
    height: "12px",
    borderRadius: "9999px",
    overflow: "hidden" /* Prevent overflow */,
  },
  budgetValue: {
    fontSize: "12px",
  },

  expenditureContainer: {
    height: "128px",
  },
  expenditureLabel: {
    textAlign: "center",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  achievementsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "128px",
  },
  achievementsContent: {
    textAlign: "center",
    color: "#6b7280",
  },

  sustainabilityContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    padding: "16px",
  },

  sustainabilityItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center", // Ensures icon and text align vertically
    gap: "12px",
    width: "100%", // Ensures full width alignment
    padding: "4px 8px",
  },

  sustainabilityIcon: {
    width: "40px",
    height: "40px",
    minWidth: "40px", // ✅ Keeps icon column fixed
    borderRadius: "50%",
    backgroundColor: "#2196f3",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0, // Prevent icon from shrinking
  },

  sustainabilityText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // ✅ Left-aligns text
    justifyContent: "center",
    textAlign: "left", // ✅ Ensures internal text is left-aligned
  },

  sustainabilityTitle: {
    fontWeight: 600,
    fontSize: "13px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  sustainabilitySubtitle: {
    fontSize: "11px",
    color: "#6b7280",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  customLegend: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "4px",
    marginTop: "8px",
  },
  legendEntry: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "4px",
  },

  "@media (max-width: 768px)": {
    container: {
      padding: "8px",
    },

    firstRow: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    },

    secondRow: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    },

    thirdRow: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    },

    fourthRow: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    },

    card: {
      padding: "12px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: "auto",
      textAlign: "center",
    },

    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "12px",
      width: "100%",
    },

    progressContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
      width: "100%",
    },

    sustainabilityContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "12px",
      padding: "8px",
      width: "100%",
    },

    sustainabilityItem: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "8px",
      width: "100%",
    },

    sustainabilityText: {
      alignItems: "center",
    },

    chartContainer: {
      width: "100%",
      height: "240px",
    },

    customLegend: {
      justifyContent: "center",
      gap: "12px",
    },

    budgetContainer: {
      gap: "12px",
      width: "100%",
    },

    budgetBar3D: {
      width: "100%",
      textAlign: "center",
      justifyContent: "center",
    },

    achievementsContainer: {
      height: "auto",
      padding: "12px",
      justifyContent: "center",
    },
  },
};

export default styles;
