import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#1e3a5f",
        color: "#ffffff",
        mt: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 0",
        gap: "12px",
        boxShadow: "0 -1px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        component="img"
        src="/Rudafirm.png"
        alt="Ruda Firm Logo"
        sx={{
          height: "24px",
          width: "auto",
        }}
      />
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 400,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        RAVI URBAN DEVELOPMENT AUTHORITY
      </Typography>
    </Box>
  );
};

export default Footer;
