import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardRTWExact from "./components/DashboardRTWExact";
import RTWMap from "./components/MainMap/RTWMap";
import GeoDataManager from "./components/MainMap/CRUD/GeoDataManager";
import Portfolio from "./components/MainMap/Portfolio/Portfolio";
import RUDADevelopmentPlan from "./components/MainMap/Gantt/RUDADevelopmentPlan";
import PhaseTwoGanttChart from "./components/MainMap/Gantt/PhaseTwoGanttChart";
import PCrud from "./components/MainMap/Portfolio/PCrud";
import HierarchicalDataComponent from "./components/MainMap/Gantt/HierarchicalDataComponent";
import ProjectMilestone from "./components/MainMap/ProjectMilestone";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import OngoingProjects from "./components/MainMap/OngoingProjects";
import OverallSummary from "./components/MainMap/OverallSummary";
import ProgressUpdate from "./components/MainMap/ProgressUpdate";
import Dashboard from "./components/Dashboard/Dashboard";

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
