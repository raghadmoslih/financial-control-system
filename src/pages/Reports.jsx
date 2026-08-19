import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Reports.css";

const API_URL = "/api";

function Reports() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const role = localStorage.getItem("user_role");

  useEffect(() => {
    loadReportData();
  }, []);

  // =========================
  // BACK TO DASHBOARD
  // =========================

  function goBackToDashboard() {
    if (role === "Administrator") {
      navigate("/admin");
    } else if (role === "Manager") {
      navigate("/dashboard");
    } else if (role === "Employee") {
      navigate("/employee");
    } else {
      navigate("/");
    }
  }

  // =========================
  // LOAD REPORT DATA
  // =========================

  async function loadReportData() {
    try {
      const token =
        localStorage.getItem("access_token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =========================
      // PROJECTS
      // =========================

      const projectsResponse =
        await fetch(
          `${API_URL}/items/projects`,
          { headers }
        );

      const projectsResult =
        await projectsResponse.json();

      if (projectsResult.errors) {
        console.error(
          "PROJECTS ERROR:",
          projectsResult.errors
        );
      } else {
        setProjects(
          projectsResult.data || []
        );
      }

      // =========================
      // EMPLOYEES
      // =========================

      const employeesResponse =
        await fetch(
          `${API_URL}/items/employees`,
          { headers }
        );

      const employeesResult =
        await employeesResponse.json();

      if (employeesResult.errors) {
        console.error(
          "EMPLOYEES ERROR:",
          employeesResult.errors
        );
      } else {
        setEmployees(
          employeesResult.data || []
        );
      }

      // =========================
      // TIMESHEETS
      // =========================

      const timesheetsResponse =
        await fetch(
          `${API_URL}/items/timesheets?fields=*,employee.id,employee.name,employee.job_title,project.id,project.project_name`,
          { headers }
        );

      const timesheetsResult =
        await timesheetsResponse.json();

      if (timesheetsResult.errors) {
        console.error(
          "TIMESHEETS ERROR:",
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
          `${API_URL}/items/expenses?fields=*,employee.id,employee.name,project.id,project.project_name`,
          { headers }
        );

      const expensesResult =
        await expensesResponse.json();

      if (expensesResult.errors) {
        console.error(
          "EXPENSES ERROR:",
          expensesResult.errors
        );
      } else {
        setExpenses(
          expensesResult.data || []
        );
      }

    } catch (error) {
      console.error(
        "LOAD REPORT DATA ERROR:",
        error
      );
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
  // HOURLY RATES
  // =========================

  const hourlyRates = {
    Analyst: 1000 / 8,
    Consultant: 1700 / 8,
    "Senior Consultant": 2400 / 8,
  };

  // =========================
  // TOTAL REVENUE
  // =========================

  let totalRevenue = 0;

  timesheets.forEach((timesheet) => {
    const jobTitle =
      timesheet.employee?.job_title;

    const hourlyRate =
      hourlyRates[jobTitle] || 0;

    const hours =
      Number(timesheet.hours) || 0;

    totalRevenue +=
      hours * hourlyRate;
  });

  // =========================
  // HR COST
  // =========================

  const totalHRCost =
    totalRevenue * 0.5;

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses =
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
    totalHRCost + totalExpenses;

  // =========================
  // TOTAL PROFIT
  // =========================

  const totalProfit =
    totalRevenue - totalCost;

  // =========================
  // TOTAL PROFIT MARGIN
  // =========================

  const totalProfitMargin =
    totalRevenue > 0
      ? (totalProfit / totalRevenue) * 100
      : 0;

  // =========================
  // PROJECT REPORTS
  // =========================

  const projectReports =
    projects.map((project) => {

      const projectTimesheets =
        timesheets.filter(
          (timesheet) =>
            String(
              timesheet.project?.id
            ) === String(project.id)
        );

      const projectExpenses =
        expenses.filter(
          (expense) =>
            String(
              expense.project?.id
            ) === String(project.id)
        );

      // =========================
      // PROJECT REVENUE
      // =========================

      let revenue = 0;

      projectTimesheets.forEach(
        (timesheet) => {

          const jobTitle =
            timesheet.employee?.job_title;

          const hourlyRate =
            hourlyRates[jobTitle] || 0;

          const hours =
            Number(timesheet.hours) || 0;

          revenue +=
            hours * hourlyRate;
        }
      );

      // =========================
      // PROJECT HR COST
      // =========================

      const hrCost =
        revenue * 0.5;

      // =========================
      // PROJECT EXPENSES
      // =========================

      const operationalExpenses =
        projectExpenses.reduce(
          (total, expense) =>
            total +
            (Number(expense.amount) || 0),
          0
        );

      // =========================
      // PROJECT TOTAL COST
      // =========================

      const cost =
        hrCost + operationalExpenses;

      // =========================
      // PROJECT PROFIT
      // =========================

      const profit =
        revenue - cost;

      // =========================
      // PROFIT MARGIN
      // =========================

      const margin =
        revenue > 0
          ? (profit / revenue) * 100
          : 0;

      return {
        id: project.id,
        name: project.project_name,
        revenue,
        cost,
        profit,
        margin,
        projectStatus: project.status,
      };
    });

  // =========================
  // MOST PROFITABLE PROJECT
  // =========================

  const mostProfitableProject =
    projectReports.length > 0
      ? projectReports.reduce(
          (best, project) =>
            project.profit > best.profit
              ? project
              : best
        )
      : null;

  return (
    <div className="reports-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="reports-header">

        <div>

          <button
            type="button"
            className="back-button no-print"
            onClick={goBackToDashboard}
          >
            ← Back to Dashboard
          </button>

          <h1>
            Reports
          </h1>

          <p>
            Financial and operational overview
          </p>

        </div>

        <button
          type="button"
          className="print-button"
          onClick={() => window.print()}
        >
          🖨️ Print Report
        </button>

      </div>


      {/* =========================
          OVERVIEW
      ========================= */}

      <section className="reports-section">

        <div className="section-title">

          <h2>
            Overview
          </h2>

          <p>
            Overall system activity
          </p>

        </div>


        <div className="overview-grid">

          <div className="report-card">
            <span>
              Projects
            </span>

            <strong>
              {projects.length}
            </strong>
          </div>


          <div className="report-card">
            <span>
              Employees
            </span>

            <strong>
              {employees.length}
            </strong>
          </div>


          <div className="report-card">
            <span>
              Timesheets
            </span>

            <strong>
              {timesheets.length}
            </strong>
          </div>


          <div className="report-card">
            <span>
              Expenses
            </span>

            <strong>
              {expenses.length}
            </strong>
          </div>

        </div>

      </section>


      {/* =========================
          FINANCIAL OVERVIEW
      ========================= */}

      <section className="reports-section">

        <div className="section-title">

          <h2>
            Financial Overview
          </h2>

          <p>
            Overall financial performance
          </p>

        </div>


        <div className="financial-grid">

          <div className="financial-card revenue-card">

            <span>
              Total Revenue
            </span>

            <strong>
              {totalRevenue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="financial-card">

            <span>
              Total HR Cost
            </span>

            <strong>
              {totalHRCost.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="financial-card">

            <span>
              Total Expenses
            </span>

            <strong>
              {totalExpenses.toLocaleString()} SAR
            </strong>

          </div>


          <div className="financial-card">

            <span>
              Total Cost
            </span>

            <strong>
              {totalCost.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="financial-card profit-card">

            <span>
              Total Profit
            </span>

            <strong>
              {totalProfit.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              SAR
            </strong>

          </div>


          <div className="financial-card">

            <span>
              Profit Margin
            </span>

            <strong>
              {totalProfitMargin.toFixed(2)}%
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          PROJECT PERFORMANCE
      ========================= */}

      <section className="reports-section">

        <div className="section-title">

          <h2>
            Project Performance
          </h2>

          <p>
            Financial performance by project
          </p>

        </div>


        <div className="table-container">

          {projectReports.length === 0 ? (

            <p className="empty-message">
              No projects found.
            </p>

          ) : (

            <table className="reports-table">

              <thead>

                <tr>

                  <th>
                    Project
                  </th>

                  <th>
                    Revenue
                  </th>

                  <th>
                    Cost
                  </th>

                  <th>
                    Profit
                  </th>

                  <th>
                    Profit Margin
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {projectReports.map(
                  (project) => {

                    let financialStatus;
                    let statusClass;

                    if (
                      project.profit > 0
                    ) {

                      financialStatus =
                        "Profitable";

                      statusClass =
                        "status-profitable";

                    } else if (
                      project.profit < 0
                    ) {

                      financialStatus =
                        "Loss";

                      statusClass =
                        "status-loss";

                    } else {

                      financialStatus =
                        "Break-even";

                      statusClass =
                        "status-break-even";
                    }

                    return (

                      <tr
                        key={project.id}
                      >

                        <td className="project-name">
                          {project.name || "-"}
                        </td>


                        <td>
                          {project.revenue.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          SAR
                        </td>


                        <td>
                          {project.cost.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          SAR
                        </td>


                        <td className="profit-value">
                          {project.profit.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          SAR
                        </td>


                        <td>
                          {project.margin.toFixed(2)}%
                        </td>


                        <td>

                          <span
                            className={`financial-status ${statusClass}`}
                          >
                            {financialStatus}
                          </span>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* =========================
          MOST PROFITABLE PROJECT
      ========================= */}

      <section className="reports-section">

        <div className="section-title">

          <h2>
            Most Profitable Project
          </h2>

          <p>
            Project with the highest profit
          </p>

        </div>


        {mostProfitableProject ? (

          <div className="best-project-card">

            <div className="best-project-icon">
              ★
            </div>


            <div className="best-project-info">

              <span>
                Best Performing Project
              </span>

              <h3>
                {mostProfitableProject.name}
              </h3>

            </div>


            <div className="best-project-stats">

              <div>

                <span>
                  Profit
                </span>

                <strong>
                  {mostProfitableProject.profit.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  SAR
                </strong>

              </div>


              <div>

                <span>
                  Margin
                </span>

                <strong>
                  {mostProfitableProject.margin.toFixed(2)}%
                </strong>

              </div>

            </div>

          </div>

        ) : (

          <p className="empty-message">
            No project data available.
          </p>

        )}

      </section>

    </div>
  );
}

export default Reports;
