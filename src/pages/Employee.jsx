
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getTimesheets,
  getEmployeeByEmail,
} from "../services/timesheetService";

import { getExpenses } from "../services/expenseService";

import "../styles/employee.css";
import "../styles/dashboard.css";

function Employee() {
  const [employee, setEmployee] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const email = localStorage.getItem("user_email");

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
      // =========================
      // GET CURRENT EMPLOYEE
      // =========================

      const employeeResult =
        await getEmployeeByEmail(email);

      const currentEmployee =
        employeeResult.data?.[0];

      if (!currentEmployee) {
        console.error("Employee not found");
        return;
      }

      setEmployee(currentEmployee);

      // =========================
      // GET MY TIMESHEETS
      // =========================

      const timesheetsResult =
        await getTimesheets(currentEmployee.id);

      setTimesheets(
        timesheetsResult.data || []
      );

      // =========================
      // GET MY EXPENSES
      // =========================

      const expensesResult =
        await getExpenses();

      const myExpenses =
        (expensesResult.data || []).filter(
          (expense) =>
            String(expense.employee?.id) ===
            String(currentEmployee.id)
        );

      setExpenses(myExpenses);

    } catch (error) {
      console.error(
        "EMPLOYEE DASHBOARD ERROR:",
        error
      );
    }
  }

  // =========================
  // MY PROJECTS
  // =========================

  const myProjects = [];

  timesheets.forEach((timesheet) => {
    const project = timesheet.project;

    if (!project?.id) {
      return;
    }

    const alreadyExists =
      myProjects.some(
        (item) =>
          String(item.id) ===
          String(project.id)
      );

    if (!alreadyExists) {
      myProjects.push(project);
    }
  });

  // =========================
  // TOTAL DAYS
  // =========================

  const totalHours = timesheets.reduce(
  (total, item) =>
    total + Number(item.hours || 0),
  0
);

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = expenses.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  return (
    <div className="dashboard-page employee-page">

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
              Employee Dashboard
            </h1>

            <p className="dashboard-welcome">
              Welcome
              {employee?.name
                ? `, ${employee.name}`
                : ""}
              !
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
          MY SUMMARY
      ========================= */}

      <section className="employee-section">

        <div className="section-header">

          <div>

            <h2>
              My Summary
            </h2>

            <p>
              Overview of your work records
            </p>

          </div>

        </div>


        <div className="employee-summary-grid">

          <div className="employee-summary-card">

            <span className="summary-label">
              My Projects
            </span>

            <strong className="summary-value">
              {myProjects.length}
            </strong>

          </div>


          <div className="employee-summary-card">

            <span className="summary-label">
              Timesheets
            </span>

            <strong className="summary-value">
              {timesheets.length}
            </strong>

          </div>


          <div className="employee-summary-card">

           <span className="summary-label">
  Total Hours
</span>

<strong className="summary-value">
  {totalHours}
</strong>

          </div>


          <div className="employee-summary-card">

            <span className="summary-label">
              Total Expenses
            </span>

            <strong className="summary-value">
              {totalExpenses.toLocaleString()} SAR
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          MY PROJECTS
      ========================= */}

      <section className="employee-section">

        <div className="section-header">

          <div>

            <h2>
              My Projects
            </h2>

            <p>
              Projects assigned to you
            </p>

          </div>

        </div>


        <div className="employee-table-container">

          {myProjects.length === 0 ? (

            <p className="empty-message">
              No projects found.
            </p>

          ) : (

            <table className="employee-table">

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

                {myProjects.map((project) => (

                  <tr key={project.id}>

                    <td>
                      {project.project_name ||
                        "Unknown Project"}
                    </td>

                    <td>
                      {project.client_name ||
                        "-"}
                    </td>

                    <td>

                      <span
                        className={
                          project.status === "Completed"
                            ? "status-badge completed"
                            : "status-badge active"
                        }
                      >
                        {project.status || "-"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* =========================
          TIMESHEETS
      ========================= */}

      <section className="employee-section">

        <div className="section-header">

          <div>

            <h2>
              Timesheets
            </h2>

            <p>
              Your submitted work records
            </p>

          </div>

        </div>


        <div className="employee-table-container">

          {timesheets.length === 0 ? (

            <p className="empty-message">
              No timesheets found.
            </p>

          ) : (

            <table className="employee-table">

              <thead>

                <tr>

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

                {timesheets.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.project?.project_name ||
                        "Unknown Project"}
                    </td>

                    <td>
                      {item.work_date || "-"}
                    </td>

                  <td>
  {item.hours || 0}
</td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>


        <div className="employee-action">

          <Link to="/timesheets">

            <button className="secondary-button">
              View My Timesheets
            </button>

          </Link>


          <Link to="/add-timesheet">

            <button className="primary-button">
              + Add Timesheet
            </button>

          </Link>

        </div>

      </section>


      {/* =========================
          EXPENSES
      ========================= */}

      <section className="employee-section">

        <div className="section-header">

          <div>

            <h2>
              Expenses
            </h2>

            <p>
              Your submitted project expenses
            </p>

          </div>

        </div>


        <div className="employee-table-container">

          {expenses.length === 0 ? (

            <p className="empty-message">
              No expenses found.
            </p>

          ) : (

            <table className="employee-table">

              <thead>

                <tr>

                  <th>
                    Project
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Description
                  </th>

                </tr>

              </thead>


              <tbody>

                {expenses.map((expense) => (

                  <tr key={expense.id}>

                    <td>
                      {expense.project?.project_name ||
                        "Unknown Project"}
                    </td>

                    <td>
                      {expense.expense_date
                        ? expense.expense_date.split("T")[0]
                        : "-"}
                    </td>

                    <td>
                      {Number(
                        expense.amount || 0
                      ).toLocaleString()}{" "}
                      SAR
                    </td>

                    <td>
                      {expense.description || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>


        <div className="employee-action">

          <Link to="/expenses">

            <button className="secondary-button">
              View My Expenses
            </button>

          </Link>


          <Link to="/add-expense">

            <button className="primary-button">
              + Add Expense
            </button>

          </Link>

        </div>

      </section>

    </div>
  );
}

export default Employee;

