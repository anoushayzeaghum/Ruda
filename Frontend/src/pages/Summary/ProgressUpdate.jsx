import React, { useState, useEffect } from "react";
import DashboardHeader from "../Dashboard/DashboardHeader/DashboardHeader";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";

const TypewriterText = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <>{displayedText}</>;
};

const ProgressUpdate = () => {
  const [selectedFY, setSelectedFY] = useState("24-25");
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fyOptions = [
    "24-25",
    "25-26",
    "26-27",
    "27-28",
    "28-29",
    "29-30",
    "30-31",
    "31-32",
    "32-33",
    "33-34",
    "34-35",
    "35-36",
  ];

  useEffect(() => {
    fetch("/Sheet.json")
      .then((response) => response.json())
      .then((data) => {
        setSheetData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading sheet data:", error);
        setLoading(false);
      });
  }, []);

  const calculateValues = () => {
    if (!sheetData || !sheetData.workbook?.sheets?.[0]?.rows) {
      return {
        devBudget: 15.96,
        plan: 12.94,
        certified: 6.85,
        paid: 6.11,
        planPercent: 81,
        actualPercent: 42,
        performanceEfficiency: 51,
      };
    }

    const rows = sheetData.workbook.sheets[0].rows;
    const fyColumn = `FY ${selectedFY}`;
    const proposedBudgetRow = rows.find(
      (row) =>
        row["Project Amount Breakdown \nDevelopment Works"] ===
        "Proposed Budget"
    );

    let devBudget = 0;
    if (proposedBudgetRow && proposedBudgetRow[fyColumn]) {
      devBudget = proposedBudgetRow[fyColumn] / 1000;
    }

    if (selectedFY === "24-25") {
      const plan = 12.94;
      const certified = 6.85;
      const paid = 6.11;
      const planPercent = devBudget > 0 ? (plan / devBudget) * 100 : 81;
      const actualPercent = devBudget > 0 ? (certified / devBudget) * 100 : 42;
      const performanceEfficiency =
        planPercent > 0 ? (actualPercent / planPercent) * 100 : 51;

      return {
        devBudget,
        plan,
        certified,
        paid,
        planPercent: Math.round(planPercent),
        actualPercent: Math.round(actualPercent),
        performanceEfficiency: Math.round(performanceEfficiency),
      };
    } else {
      return {
        devBudget,
        plan: 0,
        certified: 0,
        paid: 0,
        planPercent: 0,
        actualPercent: 0,
        performanceEfficiency: 0,
      };
    }
  };

  const values = calculateValues();

  const getBoxColor = (value, type) => {
    if (type === "green") return "#8CB971"; // Certified/Paid
    if (type === "orange") return "#F4A261"; // Plan %
    if (type === "blue") return "#2F80ED"; // Budget/Plan
    return "#D9D9D9"; // Actual %
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "0px",
      }}
    >
      <DashboardHeader />

      {/* Page Title & Filter Row */}
      <Box
        sx={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fdfdfd",
          borderBottom: "1px solid #eee",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            color: "#1e3a5f",
            textAlign: "center",
          }}
        >
          PROGRESS UPDATE – CFY ONGOING WORKS
        </Typography>

        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          position: "absolute",
          right: "20px",
        }}>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel
              shrink
              sx={{
                color: "#1e3a5f",
                fontSize: "16px",
              }}
            >
              FY
            </InputLabel>

            <Select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              size="small"
              sx={{
                height: "40px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1e3a5f",
                },
                "& .MuiSvgIcon-root": {
                  color: "#1e3a5f",
                },
              }}
            >
              {fyOptions.map((fy) => (
                <MenuItem key={fy} value={fy}>
                  {fy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gridTemplateRows: { xs: "auto", md: "1fr 1fr" },
          gap: "15px",
          marginTop: "20px",
          marginBottom: "20px",
          marginLeft: { xs: "10px", sm: "20px" },
          marginRight: { xs: "10px", sm: "20px" },
          height: { xs: "auto", md: "calc(100vh - 220px)" },
        }}
      >
        {/* DEV BUDGET */}
        <Box
          sx={{
            gridColumn: "1 / 2",
            gridRow: "1 / 3",
            backgroundColor: "#123959",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontSize: { xs: "20px", sm: "28px" }, fontWeight: "normal" }}
          >
            DEV. BUDGET
          </Typography>
          <Typography
            variant="body2"
            sx={{
              marginBottom: "10px",
              fontSize: { xs: "18px", sm: "24px" },
              fontWeight: "normal",
            }}
          >
            FY {selectedFY}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: "normal", fontSize: { xs: "2.5rem", sm: "3.75rem" } }}>
            <TypewriterText text={`${values.devBudget.toFixed(2)} B`} />
          </Typography>
        </Box>

        {/* TOP ROW (Plan, Certified, Paid) */}
        <Box
          sx={{
            gridColumn: { xs: "1 / 2", md: "2 / 3" },
            gridRow: "1 / 2",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: "15px",
          }}
        >
          {/* PLAN */}
          <Box
            sx={{
              backgroundColor: "#123959",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "28px", fontWeight: "normal" }}
            >
              PLAN
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "24px", fontWeight: "normal" }}
            >
              TILL DATE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "normal" }}>
              <TypewriterText text={`${values.plan.toFixed(2)} B`} />
            </Typography>
          </Box>

          {/* CERTIFIED */}
          <Box
            sx={{
              backgroundColor: "#2c712e",
              color: "#ffffffe8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: { xs: "20px", sm: "28px" }, fontWeight: "normal" }}
            >
              CERTIFIED
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "18px", sm: "24px" }, fontWeight: "normal" }}
            >
              TILL DATE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "normal", fontSize: { xs: "2.5rem", sm: "3.75rem" } }}>
              <TypewriterText text={`${values.certified.toFixed(2)} B`} />
            </Typography>
          </Box>

          {/* PAID */}
          <Box
            sx={{
              backgroundColor: "#2c712e",
              color: "#ffffffe8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "28px", fontWeight: "normal" }}
            >
              PAID
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "24px", fontWeight: "normal" }}
            >
              TILL DATE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "normal" }}>
              <TypewriterText text={`${values.paid.toFixed(2)} B`} />
            </Typography>
          </Box>
        </Box>

        {/* BOTTOM ROW (Plan %, Actual %) */}
        <Box
          sx={{
            gridColumn: { xs: "1 / 2", md: "2 / 3" },
            gridRow: "2 / 3",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "15px",
          }}
        >
          {/* PLAN % */}
          <Box
            sx={{
              backgroundColor: "#ef9e25",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "28px", fontWeight: "normal" }}
            >
              PLAN %
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "24px", fontWeight: "normal" }}
            >
              TILL DATE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "normal" }}>
              <TypewriterText text={`${values.planPercent}%`} />
            </Typography>
          </Box>

          {/* ACTUAL % */}
          <Box
            sx={{
              backgroundColor: "#ef9e25",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "28px", fontWeight: "normal" }}
            >
              ACTUAL %
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "24px",
                marginBottom: "10px",
                fontWeight: "normal",
              }}
            >
              TILL DATE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "normal" }}>
              <TypewriterText text={`${values.actualPercent}%`} />
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Legend and Performance Efficiency */}
      <Box
        sx={{
          marginBottom: "20px",
          marginLeft: { xs: "10px", sm: "20px" },
          marginRight: { xs: "10px", sm: "20px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: 2,
        }}
      >
        {/* Legend - Three rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {/* Green Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Box
              sx={{
                width: "60px",
                height: "20px",
                backgroundColor: "#2c712e",
                borderRadius: "4px",
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", fontWeight: "500" }}
            >
              90% to 100%
            </Typography>
          </Box>

          {/* Orange Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Box
              sx={{
                width: "60px",
                height: "20px",
                backgroundColor: "#ef9e25",
                borderRadius: "4px",
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", fontWeight: "500" }}
            >
              75% to 89%
            </Typography>
          </Box>

          {/* Blue Legend */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Box
              sx={{
                width: "60px",
                height: "20px",
                backgroundColor: "#123959",
                borderRadius: "4px",
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", fontWeight: "500" }}
            >
              Below 75%
            </Typography>
          </Box>
        </Box>

        {/* Performance Efficiency */}
        <Paper
          sx={{
            backgroundColor: "#000",
            color: "white",
            padding: "10px 10px",
            textAlign: "center",
            width: "100%",
            maxWidth: { xs: "100%", md: "700px" },
            minHeight: "80px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "normal", fontSize: { xs: "18px", sm: "28px" } }}
          >
            PERFORMANCE EFFICIENCY:{" "}
            <Box
              component="span"
              sx={{ fontSize: { xs: "30px", sm: "45px" }, fontWeight: "normal" }}
            >
              <TypewriterText
                text={`${(
                  (values.actualPercent / values.planPercent) *
                  100
                ).toFixed(0)}%`}
              />
            </Box>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProgressUpdate;
