import Routes from "./routes";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const isPublicRoute = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Routes />
      </Box>
      {!isPublicRoute && <Footer />}
    </Box>
  );
};

export default App;
