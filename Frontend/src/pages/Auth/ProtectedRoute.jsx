import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Instant authentication check - no loading screen
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, immediately render children
  // Token validation will happen during API calls when needed
  return children;
};

export default ProtectedRoute;
