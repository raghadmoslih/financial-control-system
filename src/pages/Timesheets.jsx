import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getTimesheets,
  deleteTimesheet,
  getEmployeeByEmail,
} from "../services/timesheetService";

import "../styles/timesheets.css";

function Timesheets() {
  const [timesheets, setTimesheets] = useState([]);

  const navigate = useNavigate();

  const role = localStorage.getItem("user_role");
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    loadTimesheets();
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
  // LOAD TIMESHEETS
  // =========================

  async function loadTimesheets() {
    try {
      if (role === "Employee") {
        const employeeResult =
          await getEmployeeByEmail(email);

        const employee =
          employeeResult.data?.[0];

        if (!employee) {
          alert("Employee record not found.");
          return;
        }

        const result =
          await getTimesheets(employee.id);

        setTimesheets(result.data || []);
      } else {
        const result =
          await getTimesheets();

        setTimesheets(result.data || []);
      }
    } catch (error) {
      console.error(
        "ERROR LOADING TIMESHEETS:",
        error
      );
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this timesheet?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const result =
        await deleteTimesheet(id);

      if (
        result?.errors ||
        result?.ok === false
      ) {
        alert(
          result?.errors?.[0]?.message ||
            "Failed to delete timesheet."
        );

        return;
      }

      await loadTimesheets();

    } catch (error) {
      console.error(
        "DELETE TIMESHEET ERROR:",
        error
      );

      alert(
        "Failed to delete timesheet."
      );
    }
  }

  // =========================
  // TOTAL HOURS
  // =========================

  const totalHours =
    timesheets.reduce(
      (total, item) =>
        total +
        Number(item.hours || 0),
      0
    );

  return (
    <div className="timesheets-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="timesheets-header">

        <div className="timesheets-header-content">

          <button
            type="button"
            className="back-button"
            onClick={
              goBackToDashboard
            }
          >
            ← Back to Dashboard
          </button>

          <h1>
            {role === "Employee"
              ? "My Timesheets"
              : "Timesheets Management"}
          </h1>

          <p>
            {role === "Employee"
              ? "View and manage your work records."
              : "Monitor employee work records and registered hours."}
          </p>

        </div>

        <Link
          to="/add-timesheet"
          className="primary-button"
        >
          + Add Timesheet
        </Link>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="timesheets-summary">

        <div className="timesheet-stat-card">

          <span>
            Total Records
          </span>

          <strong>
            {timesheets.length}
          </strong>

        </div>


        <div className="timesheet-stat-card">

          <span>
            Total Hours
          </span>

          <strong>
            {totalHours}
          </strong>

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="timesheets-table-container">

        {timesheets.length === 0 ? (

          <div className="timesheets-empty">
            No timesheets found.
          </div>

        ) : (

          <table className="timesheets-table">

            <thead>

              <tr>

                {role !== "Employee" && (
                  <th>
                    Employee
                  </th>
                )}

                <th>
                  Project
                </th>

                <th>
                  Date
                </th>

                <th>
                  Hours
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {timesheets.map(
                (timesheet) => (

                  <tr
                    key={
                      timesheet.id
                    }
                  >

                    {role !== "Employee" && (
                      <td className="employee-name">
                        {
                          timesheet.employee?.name ||
                          "-"
                        }
                      </td>
                    )}


                    <td className="project-name">
                      {
                        timesheet.project?.project_name ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        timesheet.work_date ||
                        "-"
                      }
                    </td>


                    <td className="days-cell">
                      {
                        timesheet.hours ||
                        0
                      }
                    </td>

<td>

  <div className="timesheet-actions">

    <Link
      to={`/edit-timesheet/${timesheet.id}`}
      className="edit-button"
    >
      Edit
    </Link>

    {(role === "Manager" ||
  role === "Administrator") && (
  <button
    type="button"
    className="delete-button"
    onClick={() =>
      handleDelete(timesheet.id)
    }
  >
    Delete
  </button>
)}

  </div>

</td>
     </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Timesheets;
