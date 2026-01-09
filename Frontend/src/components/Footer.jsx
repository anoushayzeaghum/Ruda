import React from "react";
import { Box } from "@mui/material";

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
        padding: { xs: "20px", md: "40px" },
      }}
    >
      <Box
        component="img"
        src="/Rudafirm.png"
        alt="Ruda Firm Logo"
        sx={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: { xs: "60px", md: "100px" },
        }}
      />
    </Box>
  );
};

export default Footer;

