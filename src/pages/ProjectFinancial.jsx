
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../styles/projectFinancial.css";

const API_URL = "/api";

function ProjectFinancial() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  async function loadProjectData() {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =========================
      // PROJECT
      // =========================

      const projectResponse = await fetch(
        `${API_URL}/items/projects/${id}`,
        {
          headers,
        }
      );

      const projectResult =
        await projectResponse.json();

      if (projectResult.errors) {
        console.error(projectResult.errors);
        return;
      }

      setProject(projectResult.data);

      // =========================
      // TIMESHEETS
      // =========================

      const timesheetsResponse =
        await fetch(
          `${API_URL}/items/timesheets?filter[project][_eq]=${id}&fields=*,employee.id,employee.name,employee.job_title,project.id,project.project_name`,
          {
            headers,
          }
        );

      const timesheetsResult =
        await timesheetsResponse.json();

      if (timesheetsResult.errors) {
        console.error(
          timesheetsResult.errors
        );
      } else {
        setTimesheets(
          timesheetsResult.data || []
        );
      }

      // =========================
      // EXPENSES
      // =========================

      const expensesResponse =
        await fetch(
          `${API_URL}/items/expenses?filter[project][_eq]=${id}&fields=*,employee.id,employee.name,employee.job_title,project.id,project.project_name`,
          {
            headers,
          }
        );

      const expensesResult =
        await expensesResponse.json();

      if (expensesResult.errors) {
        console.error(
          expensesResult.errors
        );
      } else {
        setExpenses(
          expensesResult.data || []
        );
      }

    } catch (error) {
      console.error(
        "LOAD PROJECT FINANCIAL ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // EMPLOYEE DAILY RATES
  // =========================

  const rates = {
    Analyst: 1000,
    Consultant: 1700,
    "Senior Consultant": 2400,
  };

  // =========================
  // WORKING HOURS PER DAY
  // =========================

  const HOURS_PER_DAY = 8;

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue =
    timesheets.reduce(
      (total, timesheet) => {

        const hours =
          Number(timesheet.hours) || 0;

        const jobTitle =
          timesheet.employee?.job_title;

        const dailyRate =
          rates[jobTitle] || 0;

        // Convert hours to days
        const workedDays =
          hours / HOURS_PER_DAY;

        const revenue =
          workedDays * dailyRate;

        return total + revenue;
      },
      0
    );

  // =========================
  // HR COST
  // =========================

  const hrCost =
    totalRevenue * 0.5;

  // =========================
  // OPERATIONAL EXPENSES
  // =========================

  const operationalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        (Number(expense.amount) || 0),
      0
    );

  // =========================
  // TOTAL COST
  // =========================

  const totalCost =
    hrCost +
    operationalExpenses;

  // =========================
  // PROFIT
  // =========================

  const profit =
    totalRevenue -
    totalCost;

  // =========================
  // PROFIT MARGIN
  // =========================

  const profitMargin =
    totalRevenue > 0
      ? (profit / totalRevenue) * 100
      : 0;

  // =========================
  // FINANCIAL STATUS
  // =========================

  let financialStatus = "";
  let financialStatusClass = "";

  if (profit > 0) {
    financialStatus = "Profitable";
    financialStatusClass =
      "status-profitable";
  } else if (profit < 0) {
    financialStatus = "Loss";
    financialStatusClass =
      "status-loss";
  } else {
    financialStatus =
      "Break-even";
    financialStatusClass =
      "status-break-even";
  }

  // =========================
  // PRINT
  // =========================

  function handlePrint() {
    window.print();
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="financial-page">

        <div className="financial-loading">

          <h2>
            Loading project financial profile...
          </h2>

        </div>

      </div>
    );
  }

  // =========================
  // PROJECT NOT FOUND
  // =========================

  if (!project) {
    return (
      <div className="financial-page">

        <div className="financial-not-found">

          <h2>
            Project not found.
          </h2>

          <Link to="/projects">

            <button className="secondary-button">
              ← Back to Projects
            </button>

          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="financial-page">

      {/* =========================
          TOP ACTIONS
      ========================= */}

      <div className="financial-actions no-print">

        <Link to="/projects">

          <button className="secondary-button">
            ← Back to Projects
          </button>

        </Link>

        <button
          className="primary-button"
          onClick={handlePrint}
        >
          🖨 Print Report
        </button>

      </div>


      {/* =========================
          PROJECT HEADER
      ========================= */}

      <div className="financial-header">

        <div>

          <p className="financial-label">
            Project Financial Profile
          </p>

          <h1>
            {project.project_name}
          </h1>

          <p className="financial-client">
            Client:{" "}
            <strong>
              {project.client_name}
            </strong>
          </p>

        </div>

        <div
          className={`project-status ${
            project.status === "Completed"
              ? "status-completed"
              : "status-active"
          }`}
        >
          {project.status}
        </div>

      </div>


      {/* =========================
          FINANCIAL SUMMARY
      ========================= */}

      <div className="financial-section">

        <div className="section-title">

          <h2>
            Financial Summary
          </h2>

          <p>
            Overview of the project's
            financial performance
          </p>

        </div>


        <div className="financial-summary-grid">

          {/* REVENUE */}

          <div className="financial-card">

            <span className="card-label">
              Total Revenue
            </span>

            <span className="card-value">
              {totalRevenue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </span>

          </div>


          {/* HR COST */}

          <div className="financial-card">

            <span className="card-label">
              HR Cost
            </span>

            <span className="card-value">
              {hrCost.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </span>

          </div>


          {/* EXPENSES */}

          <div className="financial-card">

            <span className="card-label">
              Operational Expenses
            </span>

            <span className="card-value">
              {operationalExpenses.toLocaleString()}
              {" "}SAR
            </span>

          </div>


          {/* TOTAL COST */}

          <div className="financial-card">

            <span className="card-label">
              Total Cost
            </span>

            <span className="card-value">
              {totalCost.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </span>

          </div>


          {/* PROFIT */}

          <div
            className={`financial-card ${
              profit >= 0
                ? "profit-card"
                : "loss-card"
            }`}
          >

            <span className="card-label">
              Profit
            </span>

            <span className="card-value">
              {profit.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </span>

          </div>


          {/* PROFIT MARGIN */}

          <div className="financial-card">

            <span className="card-label">
              Profit Margin
            </span>

            <span className="card-value">
              {profitMargin.toFixed(2)}%
            </span>

          </div>

        </div>


        {/* FINANCIAL STATUS */}

        <div className="financial-status-box">

          <span>
            Financial Status
          </span>

          <strong
            className={
              financialStatusClass
            }
          >
            {financialStatus}
          </strong>

        </div>

      </div>


      {/* =========================
          TIMESHEETS
      ========================= */}

      <div className="financial-section">

        <div className="section-title">

          <h2>
            Timesheets
          </h2>

          <p>
            Employee work hours and generated revenue
          </p>

        </div>


        {timesheets.length === 0 ? (

          <div className="empty-state">
            No timesheets found for this project.
          </div>

        ) : (

          <div className="table-container">

            <table className="financial-table">

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Job Title
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Hours
                  </th>

                  <th>
                    Daily Rate
                  </th>

                  <th>
                    Revenue
                  </th>

                </tr>

              </thead>

              <tbody>

                {timesheets.map(
                  (timesheet) => {

                    const jobTitle =
                      timesheet.employee
                        ?.job_title;

                    const dailyRate =
                      rates[jobTitle] || 0;

                    const hours =
                      Number(
                        timesheet.hours
                      ) || 0;

                    const workedDays =
                      hours /
                      HOURS_PER_DAY;

                    const revenue =
                      workedDays *
                      dailyRate;

                    return (
                      <tr
                        key={timesheet.id}
                      >

                        <td>
                          {timesheet
                            .employee
                            ?.name || "-"}
                        </td>

                        <td>
                          {jobTitle || "-"}
                        </td>

                        <td>
                          {timesheet.work_date ||
                            "-"}
                        </td>

                        <td>
                          {hours}
                        </td>

                        <td>
                          {dailyRate.toLocaleString()}
                          {" "}SAR
                        </td>

                        <td className="revenue-cell">
                          {revenue.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {" "}SAR
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =========================
          EXPENSES
      ========================= */}

      <div className="financial-section">

        <div className="section-title">

          <h2>
            Expenses
          </h2>

          <p>
            Operational expenses recorded
            for this project
          </p>

        </div>


        {expenses.length === 0 ? (

          <div className="empty-state">
            No expenses found for this project.
          </div>

        ) : (

          <div className="table-container">

            <table className="financial-table">

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                    >

                      <td>
                        {expense
                          .employee
                          ?.name || "-"}
                      </td>

                      <td>
                        {expense
                          .description || "-"}
                      </td>

                      <td>
                        {expense
                          .expense_date
                          ? expense.expense_date
                              .split("T")[0]
                          : "-"}
                      </td>

                      <td className="expense-cell">

                        {(
                          Number(
                            expense.amount
                          ) || 0
                        ).toLocaleString()}

                        {" "}SAR

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default ProjectFinancial;
