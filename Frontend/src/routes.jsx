import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardRTWExact from "./pages/RTWMap/DashboardRTW";
import RTWMap from "./pages/RTWMap/RTWMap";
import Portfolio from "./pages/Portfolio/Portfolio";
import RUDADevelopmentPlan from "./pages/Gantt/RUDADevelopmentPlan";
import PhaseTwoGanttChart from "./pages/Gantt/PhaseTwoGanttChart";
import PCrud from "./pages/Portfolio/PCrud";
import HierarchicalDataComponent from "./pages/Gantt/HierarchicalDataComponent";
import ProjectMilestone from "./pages/Summary/ProjectMilestone";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import OngoingProjects from "./pages/Summary/OngoingProjects";
import OverallSummary from "./pages/Summary/OverallSummary";
import ProgressUpdate from "./pages/Summary/ProgressUpdate";
import Dashboard from "./pages/Dashboard/Dashboard";
import GeoDataManager from "./pages/CRUD/GeoDataManager";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <RTWMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crud"
        element={
          <ProtectedRoute>
            <GeoDataManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details/:name"
        element={
          <ProtectedRoute>
            <DashboardRTWExact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gantt"
        element={
          <ProtectedRoute>
            <RUDADevelopmentPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/phase2-gantt"
        element={
          <ProtectedRoute>
            <PhaseTwoGanttChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio-crud"
        element={
          <ProtectedRoute>
            <PCrud />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hierarchical-gantt"
        element={
          <ProtectedRoute>
            <HierarchicalDataComponent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/milestones"
        element={
          <ProtectedRoute>
            <ProjectMilestone />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ongoing-projects"
        element={
          <ProtectedRoute>
            <OngoingProjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/overall-summary"
        element={
          <ProtectedRoute>
            <OverallSummary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress-update"
        element={
          <ProtectedRoute>
            <ProgressUpdate />
          </ProtectedRoute>
        }
      />

      {/* Redirect to login for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
