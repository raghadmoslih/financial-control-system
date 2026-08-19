import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProjects } from "../services/projectService";

import {
  getTimesheet,
  updateTimesheet,
  getEmployeeByEmail,
} from "../services/timesheetService";

import "../styles/timesheets.css";

function EditTimesheet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [hours, setHours] = useState("");

  const [role, setRole] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // =========================
  // TODAY
  // =========================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const currentRole =
        localStorage.getItem("user_role");

      setRole(currentRole);

      // =========================
      // GET PROJECTS
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
        const projectData =
          projectResult.data || [];

        setProjects(projectData);

        // =========================
        // GET TIMESHEET
        // =========================

        const timesheetResult =
          await getTimesheet(id);

        console.log(
          "TIMESHEET:",
          timesheetResult
        );

        if (
          timesheetResult.errors ||
          !timesheetResult.data
        ) {
          alert("Timesheet not found.");
          navigate("/timesheets");
          return;
        }

        const timesheet =
          timesheetResult.data;

        // =========================
        // EXISTING PROJECT
        // =========================

        const existingProjectId =
          timesheet.project?.id;

        setProject(
          existingProjectId || ""
        );

        const foundProject =
          projectData.find(
            (item) =>
              String(item.id) ===
              String(existingProjectId)
          );

        setSelectedProject(
          foundProject || null
        );

        // =========================
        // EXISTING WORK DATE
        // =========================

        setWorkDate(
          timesheet.work_date
            ? timesheet.work_date.split("T")[0]
            : ""
        );

        // =========================
        // EXISTING HOURS
        // =========================

        setHours(
          timesheet.hours ?? ""
        );

        // =========================
        // GET EMPLOYEES
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

          const response =
            await fetch(
              "/api/items/employees?fields=id,name,email,job_title",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
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

            setEmployee(
              timesheet.employee?.id || ""
            );
          }
        }
      }

    } catch (error) {
      console.error(
        "LOAD TIMESHEET ERROR:",
        error
      );

      alert(
        "Failed to load timesheet."
      );
    }
  }

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
  // PROJECT CHANGE
  // =========================

  function handleProjectChange(e) {
    const projectId =
      e.target.value;

    setProject(projectId);

    // Reset work date when project changes
    setWorkDate("");

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
  // PROJECT DATES
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
    // PROJECT VALIDATION
    // =========================

    if (!selectedProject) {
      alert(
        "Please select a project."
      );

      return;
    }

    // =========================
    // PROJECT DATE VALIDATION
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
    // FUTURE PROJECT
    // =========================

    if (projectStart > today) {
      alert(
        "You cannot add or update a timesheet for a project that has not started yet."
      );

      return;
    }

    // =========================
    // WORK DATE VALIDATION
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
        "You cannot add or update a timesheet for a future date."
      );

      return;
    }

    // =========================
    // HOURS VALIDATION
    // =========================

    if (hours === "") {
      alert(
        "Please enter the number of hours worked."
      );

      return;
    }

    const numberOfHours =
      Number(hours);

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

    // =========================
    // EMPLOYEE
    // =========================

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
      // UPDATE TIMESHEET
      // =========================

      const result =
        await updateTimesheet(
          id,
          {
            project:
              Number(project),

            employee:
              employeeId,

            work_date:
              workDate,

            hours:
              numberOfHours,
          }
        );

      console.log(
        "UPDATE TIMESHEET RESULT:",
        result
      );

      // =========================
      // API ERROR
      // =========================

      if (result.errors) {
        alert(
          result.errors[0]?.message ||
            "Failed to update timesheet."
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Timesheet updated successfully."
      );

      navigate(
        "/timesheets"
      );

    } catch (error) {
      console.error(
        "UPDATE TIMESHEET ERROR:",
        error
      );

      alert(
        "Failed to update timesheet."
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
            ✎
          </div>

          <div>

            <h1>
              Edit Timesheet
            </h1>

            <p>
              Update the timesheet information.
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

          {(role === "Manager" ||
            role === "Administrator") && (

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
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditTimesheet;
