
import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import {
  addTimesheet,
  getEmployeeByEmail,
} from "../services/timesheetService";
import { useNavigate } from "react-router-dom";

import "../styles/timesheets.css";

function AddTimesheet() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [hours, setHours] = useState("");

  const [role, setRole] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();

  // =========================
  // TODAY
  // =========================

  const today =
    new Date().toISOString().split("T")[0];

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // BACK TO DASHBOARD
  // =========================

  function goBackToDashboard() {
    const currentRole =
      localStorage.getItem("user_role");

    if (currentRole === "Administrator") {
      navigate("/admin");
    } else if (currentRole === "Manager") {
      navigate("/dashboard");
    } else if (currentRole === "Employee") {
      navigate("/employee");
    } else {
      navigate("/");
    }
  }

  // =========================
  // LOAD PROJECTS + EMPLOYEES
  // =========================

  async function loadData() {
    try {
      const currentRole =
        localStorage.getItem("user_role");

      setRole(currentRole);

      // =========================
      // LOAD PROJECTS
      // =========================

      const projectResult =
        await getProjects();

      console.log(
        "PROJECTS:",
        projectResult
      );

      if (projectResult.errors) {
        console.error(
          "PROJECT ERROR:",
          projectResult.errors
        );
      } else {
        setProjects(
          projectResult.data || []
        );
      }

      // =========================
      // LOAD EMPLOYEES
      // MANAGER + ADMINISTRATOR
      // =========================

      if (
        currentRole === "Manager" ||
        currentRole === "Administrator"
      ) {
        const token =
          localStorage.getItem(
            "access_token"
          );

        const response = await fetch(
          "/api/items/employees?fields=id,name,email,job_title",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const employeeResult =
          await response.json();

        console.log(
          "EMPLOYEES:",
          employeeResult
        );

        if (employeeResult.errors) {
          console.error(
            "EMPLOYEE ERROR:",
            employeeResult.errors
          );
        } else {
          setEmployees(
            employeeResult.data || []
          );
        }
      }

    } catch (error) {
      console.error(
        "LOAD TIMESHEET DATA ERROR:",
        error
      );

      alert(
        "Failed to load timesheet data."
      );
    }
  }

  // =========================
  // PROJECT CHANGE
  // =========================

  function handleProjectChange(e) {
    const projectId =
      e.target.value;

    setProject(projectId);
    setWorkDate("");
    setHours("");

    const foundProject =
      projects.find(
        (item) =>
          String(item.id) ===
          String(projectId)
      );

    setSelectedProject(
      foundProject || null
    );
  }

  // =========================
  // DATE FORMAT
  // =========================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return date.split("T")[0];
  }

  // =========================
  // PROJECT DATE LIMITS
  // =========================

  const projectStart =
    selectedProject
      ? formatDate(
          selectedProject.start_date
        )
      : "";

  const projectEnd =
    selectedProject
      ? formatDate(
          selectedProject.end_date
        )
      : "";

  // =========================
  // MAX WORK DATE
  // =========================

  const maxWorkDate =
    projectEnd &&
    projectEnd < today
      ? projectEnd
      : today;

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    // =========================
    // PROJECT
    // =========================

    if (!selectedProject) {
      alert(
        "Please select a project."
      );

      return;
    }

    // =========================
    // PROJECT DATES
    // =========================

    if (
      !projectStart ||
      !projectEnd
    ) {
      alert(
        "This project does not have valid start and end dates."
      );

      return;
    }

    if (
      projectEnd < projectStart
    ) {
      alert(
        "Project end date cannot be before the start date."
      );

      return;
    }

    // =========================
    // PROJECT HAS NOT STARTED
    // =========================

    if (
      projectStart > today
    ) {
      alert(
        "You cannot add a timesheet to a project that has not started yet."
      );

      return;
    }

    // =========================
    // WORK DATE
    // =========================

    if (!workDate) {
      alert(
        "Please select a work date."
      );

      return;
    }

    if (
      workDate < projectStart
    ) {
      alert(
        "Work date cannot be before the project start date."
      );

      return;
    }

    if (
      workDate > projectEnd
    ) {
      alert(
        "Work date cannot be after the project end date."
      );

      return;
    }

    if (
      workDate > today
    ) {
      alert(
        "You cannot add a timesheet for a future date."
      );

      return;
    }

    // =========================
    // HOURS VALIDATION
    // =========================

    const numberOfHours =
      Number(hours);

    if (!hours) {
      alert(
        "Please enter the number of hours worked."
      );

      return;
    }

    if (
      !Number.isInteger(
        numberOfHours
      )
    ) {
      alert(
        "Hours must be a whole number."
      );

      return;
    }

    if (
      numberOfHours < 1 ||
      numberOfHours > 8
    ) {
      alert(
        "Working hours must be between 1 and 8 hours per day."
      );

      return;
    }

    try {
      let employeeId;

      // =========================
      // MANAGER + ADMINISTRATOR
      // =========================

      if (
        role === "Manager" ||
        role === "Administrator"
      ) {
        employeeId =
          Number(employee);

        if (!employeeId) {
          alert(
            "Please select an employee."
          );

          return;
        }
      }

      // =========================
      // EMPLOYEE
      // =========================

      else if (
        role === "Employee"
      ) {
        const email =
          localStorage.getItem(
            "user_email"
          );

        if (!email) {
          alert(
            "Employee email was not found."
          );

          return;
        }

        const employeeResult =
          await getEmployeeByEmail(
            email
          );

        const currentEmployee =
          employeeResult.data?.[0];

        if (!currentEmployee) {
          alert(
            "Employee record not found."
          );

          return;
        }

        employeeId =
          currentEmployee.id;
      }

      // =========================
      // ADD TIMESHEET
      // =========================

      const result =
        await addTimesheet({
          project: Number(project),
          employee: employeeId,
          work_date: workDate,
          hours: numberOfHours,
        });

      console.log(
        "ADD TIMESHEET RESULT:",
        result
      );

      // =========================
      // API ERROR
      // =========================

      if (result.errors) {
        alert(
          result.errors[0]?.message ||
            "Failed to add timesheet."
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Timesheet added successfully."
      );

      navigate("/timesheets");

    } catch (error) {
      console.error(
        "ADD TIMESHEET ERROR:",
        error
      );

      alert(
        "Failed to add timesheet."
      );
    }
  }

  return (
    <div className="timesheet-page">

      <div className="timesheet-card">

        {/* =========================
            BACK TO DASHBOARD
        ========================= */}

        <button
          type="button"
          className="back-button"
          onClick={
            goBackToDashboard
          }
        >
          ← Back to Dashboard
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div className="timesheet-header">

          <div className="timesheet-icon">
            +
          </div>

          <div>

            <h1>
              Add Timesheet
            </h1>

            <p>
              Record working hours
              for a project.
            </p>

          </div>

        </div>

        {/* =========================
            FORM
        ========================= */}

        <form
          className="timesheet-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* =========================
              EMPLOYEE
          ========================= */}

          {(
            role === "Manager" ||
            role === "Administrator"
          ) && (

            <div className="form-group">

              <label>
                Employee
              </label>

              <select
                value={employee}
                onChange={(e) =>
                  setEmployee(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map(
                  (emp) => (

                    <option
                      key={emp.id}
                      value={emp.id}
                    >
                      {emp.name} -{" "}
                      {emp.job_title}
                    </option>

                  )
                )}

              </select>

            </div>

          )}

          {/* =========================
              PROJECT
          ========================= */}

          <div className="form-group">

            <label>
              Project
            </label>

            <select
              value={project}
              onChange={
                handleProjectChange
              }
              required
            >

              <option value="">
                Select Project
              </option>

              {projects.map(
                (projectItem) => (

                  <option
                    key={
                      projectItem.id
                    }
                    value={
                      projectItem.id
                    }
                  >
                    {
                      projectItem.project_name
                    }
                  </option>

                )
              )}

            </select>

            {/* =========================
                PROJECT PERIOD
            ========================= */}

            {selectedProject && (

              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  opacity: 0.7,
                }}
              >

                Available period:{" "}

                <strong>
                  {projectStart}
                </strong>

                {" – "}

                <strong>
                  {projectEnd}
                </strong>

              </small>

            )}

          </div>

          {/* =========================
              WORK DATE
          ========================= */}

          <div className="form-group">

            <label>
              Work Date
            </label>

            <input
              type="date"
              value={workDate}
              onChange={(e) =>
                setWorkDate(
                  e.target.value
                )
              }
              min={
                projectStart ||
                undefined
              }
              max={
                selectedProject
                  ? maxWorkDate
                  : today
              }
              required
              disabled={
                !selectedProject ||
                projectStart > today
              }
            />

            {!selectedProject && (

              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  opacity: 0.7,
                }}
              >
                Select a project first.
              </small>

            )}

            {selectedProject &&
              projectStart > today && (

              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  opacity: 0.7,
                }}
              >
                This project has not
                started yet.
              </small>

            )}

          </div>

          {/* =========================
              HOURS
          ========================= */}

          <div className="form-group">

            <label>
              Hours Worked
            </label>

            <input
              type="number"
              min="1"
              max="8"
              step="1"
              placeholder="Enter hours worked"
              value={hours}
              onChange={(e) =>
                setHours(
                  e.target.value
                )
              }
              required
            />

            <small
              style={{
                display: "block",
                marginTop: "8px",
                opacity: 0.7,
              }}
            >
              Enter the number of
              hours worked (1–8).
            </small>

          </div>

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(
                  "/timesheets"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={
                !selectedProject ||
                projectStart > today
              }
            >
              Save Timesheet
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTimesheet;
