import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import MachineDetails from "./pages/MachineDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Reports from "./pages/Reports";
import DailyReport from "./pages/Dailyreport";
import NewMachine from "./pages/NewMachine";
import AssignTask from "./pages/AssignTask";
import AdminApproval from "./pages/Adminapprovel";
import Settings from "./pages/Settings";
import TeamReport from "./pages/Team";
import Calendar from "./pages/Calendar";
import DailyMachineLogPage from "./pages/DailyMachineLog";
import BreakdownLogPage from "./pages/BreakdownLog";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

// Role-based default redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuthStore();
  
  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/machines" replace />;
  }
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleBasedRedirect />} />

          {/* Admin only routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="assign-task"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AssignTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-approval"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-report"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeamReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Shared routes - both admin and user */}
          <Route path="machines" element={<Machines />} />
          <Route path="machines/new" element={<NewMachine />} />
          <Route path="machines/:id" element={<MachineDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetails />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="daily-machine-log" element={<DailyMachineLogPage />} />
          <Route path="breakdown-log" element={<BreakdownLogPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;