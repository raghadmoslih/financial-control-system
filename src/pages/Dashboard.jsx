import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";
import { getTimesheets } from "../services/timesheetService";
import { getExpenses } from "../services/expenseService";

import "../styles/dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");

    navigate("/");
  }

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  async function loadDashboard() {
    try {
      const projectsResult =
        await getProjects();

      const timesheetsResult =
        await getTimesheets();

      const expensesResult =
        await getExpenses();

      // =========================
      // LOAD EMPLOYEES
      // =========================

      const token =
        localStorage.getItem("access_token");

      const employeesResponse =
        await fetch(
          "/api/items/employees?fields=id,name,email,job_title",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const employeesResult =
        await employeesResponse.json();

      console.log(
        "PROJECTS:",
        projectsResult
      );

      console.log(
        "TIMESHEETS:",
        timesheetsResult
      );

      console.log(
        "EXPENSES:",
        expensesResult
      );

      console.log(
        "EMPLOYEES:",
        employeesResult
      );

      setProjects(
        projectsResult.data || []
      );

      setTimesheets(
        timesheetsResult.data || []
      );

      setExpenses(
        expensesResult.data || []
      );

      if (employeesResult.errors) {
        console.error(
          "EMPLOYEES ERROR:",
          employeesResult.errors
        );

        setEmployees([]);
      } else {
        setEmployees(
          employeesResult.data || []
        );
      }

    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );
    }
  }

  // =========================
  // TOTAL HOURS
  // =========================

  const totalHours =
    timesheets.reduce(
      (total, timesheet) =>
        total +
        Number(
          timesheet.hours || 0
        ),
      0
    );

  // =========================
  // HOURLY RATES
  // Based on 8 working hours/day
  // =========================

  const hourlyRates = {
    Analyst: 1000 / 8,
    Consultant: 1700 / 8,
    "Senior Consultant": 2400 / 8,
  };

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue =
    timesheets.reduce(
      (total, timesheet) => {

        const hours =
          Number(
            timesheet.hours || 0
          );

        const jobTitle =
          timesheet.employee?.job_title;

        const hourlyRate =
          hourlyRates[jobTitle] || 0;

        return (
          total +
          hours * hourlyRate
        );
      },
      0
    );

  // =========================
  // LABOR COST
  // =========================

  const laborCost =
    totalRevenue * 0.5;

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  // =========================
  // TOTAL PROFIT
  // =========================

  const totalProfit =
    totalRevenue -
    laborCost -
    totalExpenses;

  // =========================
  // RECENT DATA
  // =========================

  const recentTimesheets =
    [...timesheets]
      .slice(-5)
      .reverse();

  const recentExpenses =
    [...expenses]
      .slice(-5)
      .reverse();

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">

        <div className="dashboard-header-content">

          <div>

            <p className="dashboard-brand">
              FC
            </p>

            <h1>
              Manager Dashboard
            </h1>

            <p className="dashboard-welcome">
              Welcome Manager
            </p>

          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          MANAGEMENT
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Management
            </h2>

            <p>
              Manage projects, timesheets,
              expenses and financial reports.
            </p>

          </div>

        </div>


        <div className="management-grid">

          <Link
            to="/projects"
            className="management-card"
          >

            <div className="management-icon">
              P
            </div>

            <div>

              <h3>
                Projects
              </h3>

              <p>
                Manage projects
              </p>

            </div>

          </Link>


          <Link
            to="/timesheets"
            className="management-card"
          >

            <div className="management-icon">
              T
            </div>

            <div>

              <h3>
                Timesheets
              </h3>

              <p>
                View employee work
              </p>

            </div>

          </Link>


          <Link
            to="/expenses"
            className="management-card"
          >

            <div className="management-icon">
              E
            </div>

            <div>

              <h3>
                Expenses
              </h3>

              <p>
                Manage expenses
              </p>

            </div>

          </Link>


          <Link
            to="/reports"
            className="management-card"
          >

            <div className="management-icon">
              R
            </div>

            <div>

              <h3>
                Reports
              </h3>

              <p>
                Financial reports
              </p>

            </div>

          </Link>

        </div>

      </section>


      {/* =========================
          FINANCIAL SUMMARY
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Financial Summary
            </h2>

            <p>
              Overall financial performance
            </p>

          </div>

        </div>


        <div className="summary-grid">

          <div className="summary-card">

            <span className="summary-label">
              Total Projects
            </span>

            <strong className="summary-value">
              {projects.length}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Total Employees
            </span>

            <strong className="summary-value">
              {employees.length}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Total Timesheet Hours
            </span>

            <strong className="summary-value">
              {totalHours}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Total Revenue
            </span>

            <strong className="summary-value">
              {totalRevenue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Labor Cost
            </span>

            <strong className="summary-value">
              {laborCost.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Total Expenses
            </span>

            <strong className="summary-value">
              {totalExpenses.toLocaleString()} SAR
            </strong>

          </div>


          <div className="summary-card profit-card">

            <span className="summary-label">
              Total Profit
            </span>

            <strong className="summary-value">
              {totalProfit.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          EMPLOYEES
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header section-header-row">

          <div>

            <h2>
              Employees
            </h2>

            <p>
              Overview of all employees
            </p>

          </div>

        </div>


        <div className="table-container">

          {employees.length === 0 ? (

            <div className="empty-state">
              No employees found.
            </div>

          ) : (

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Job Title
                  </th>

                </tr>

              </thead>


              <tbody>

                {employees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                    >

                      <td>
                        {employee.name || "-"}
                      </td>

                      <td>
                        {employee.email || "-"}
                      </td>

                      <td>
                        {employee.job_title || "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* =========================
          PROJECTS
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header section-header-row">

          <div>

            <h2>
              Projects
            </h2>

            <p>
              Overview of all projects
            </p>

          </div>

          <Link
            to="/projects"
            className="view-all"
          >
            View All
          </Link>

        </div>


        <div className="table-container">

          {projects.length === 0 ? (

            <div className="empty-state">
              No projects found.
            </div>

          ) : (

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Project
                  </th>

                  <th>
                    Client
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {projects
                  .slice(0, 5)
                  .map(
                    (project) => (

                      <tr
                        key={project.id}
                      >

                        <td>
                          {project.project_name || "-"}
                        </td>

                        <td>
                          {project.client_name || "-"}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              project.status?.toLowerCase()
                            }`}
                          >
                            {project.status || "-"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* =========================
          RECENT TIMESHEETS
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header section-header-row">

          <div>

            <h2>
              Recent Timesheets
            </h2>

            <p>
              Latest employee work records
            </p>

          </div>

          <Link
            to="/timesheets"
            className="view-all"
          >
            View All
          </Link>

        </div>


        <div className="table-container">

          {recentTimesheets.length === 0 ? (

            <div className="empty-state">
              No timesheets found.
            </div>

          ) : (

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Hours
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentTimesheets.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      <td>
                        {item.employee?.name || "-"}
                      </td>

                      <td>
                        {item.project?.project_name || "-"}
                      </td>

                      <td>
                        {item.work_date
                          ? item.work_date.split("T")[0]
                          : "-"}
                      </td>

                      <td>
                        {Number(
                          item.hours || 0
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* =========================
          RECENT EXPENSES
      ========================= */}

      <section className="dashboard-section">

        <div className="section-header section-header-row">

          <div>

            <h2>
              Recent Expenses
            </h2>

            <p>
              Latest project expenses
            </p>

          </div>

          <Link
            to="/expenses"
            className="view-all"
          >
            View All
          </Link>

        </div>


        <div className="table-container">

          {recentExpenses.length === 0 ? (

            <div className="empty-state">
              No expenses found.
            </div>

          ) : (

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Description
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentExpenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                    >

                      <td>
                        {expense.employee?.name || "-"}
                      </td>

                      <td>
                        {expense.project?.project_name || "-"}
                      </td>

                      <td className="amount-cell">

                        {Number(
                          expense.amount || 0
                        ).toLocaleString()}{" "}

                        SAR

                      </td>

                      <td>

                        {expense.expense_date
                          ? expense.expense_date.split("T")[0]
                          : "-"}

                      </td>

                      <td>
                        {expense.description || "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
