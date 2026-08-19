import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";

import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";

import Timesheets from "./pages/Timesheets";
import AddTimesheet from "./pages/AddTimesheet";
import EditTimesheet from "./pages/EditTimesheet";

import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

import ProtectedRoute from "./components/ProtectedRoute";
import ProjectFinancial from "./pages/ProjectFinancial";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* =========================
            ADMINISTRATOR
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["Administrator"]}
            >
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* =========================
            MANAGER DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["Manager"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            REPORTS
        ========================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={["Administrator", "Manager"]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROJECT FINANCIAL PROFILE
        ========================= */}

        <Route
          path="/project-financial/:id"
          element={
            <ProtectedRoute
              allowedRoles={["Administrator", "Manager"]}
            >
              <ProjectFinancial />
            </ProtectedRoute>
          }
        />

        {/* =========================
            EMPLOYEE
        ========================= */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={["Employee"]}
            >
              <Employee />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROJECTS
        ========================= */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
              ]}
            >
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-project"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
              ]}
            >
              <AddProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-project/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
              ]}
            >
              <EditProject />
            </ProtectedRoute>
          }
        />

        {/* =========================
            TIMESHEETS
        ========================= */}

        <Route
          path="/timesheets"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <Timesheets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-timesheet"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <AddTimesheet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-timesheet/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <EditTimesheet />
            </ProtectedRoute>
          }
        />

        {/* =========================
            EXPENSES
        ========================= */}

        <Route
          path="/expenses"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-expense"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <AddExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-expense/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Manager",
                "Employee",
              ]}
            >
              <EditExpense />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;