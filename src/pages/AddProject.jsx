import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProject } from "../services/projectService";
import "../styles/projects.css";

function AddProject() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  // =========================
  // START DATE
  // =========================

  function handleStartDateChange(e) {
    const selectedDate = e.target.value;

    setStartDate(selectedDate);

    // إذا كان تاريخ النهاية موجود
    // وأصبح قبل تاريخ البداية الجديدة
    if (
      endDate &&
      selectedDate &&
      endDate < selectedDate
    ) {
      setEndDate("");
    }
  }

  // =========================
  // END DATE
  // =========================

  function handleEndDateChange(e) {
    const selectedDate = e.target.value;

    // منع تاريخ النهاية من أن يكون
    // قبل تاريخ البداية
    if (
      startDate &&
      selectedDate < startDate
    ) {
      alert(
        "End date cannot be before the start date."
      );

      return;
    }

    setEndDate(selectedDate);
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    // =========================
    // DATE VALIDATION
    // =========================

    if (!startDate || !endDate) {
      alert(
        "Please select both start date and end date."
      );

      return;
    }

    // End date cannot be before start date
    if (endDate < startDate) {
      alert(
        "End date cannot be before the start date."
      );

      return;
    }

    // =========================
    // ADD PROJECT
    // =========================

    const result = await addProject({
      project_name: projectName,
      client_name: clientName,
      start_date: startDate,
      end_date: endDate,
      status: status,
    });

    // =========================
    // ERROR HANDLING
    // =========================

    if (!result.ok) {
      const errorCode =
        result.data?.errors?.[0]?.extensions?.code;

      if (errorCode === "RECORD_NOT_UNIQUE") {
        alert(
          "Project name is already in use."
        );
      } else {
        console.log(
          "Project error:",
          result.data
        );

        alert(
          "Failed to add project."
        );
      }

      return;
    }

    // =========================
    // SUCCESS
    // =========================

    navigate("/projects");
  }

  return (
    <div className="add-project-page">

      <div className="add-project-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="add-project-header">

          <div className="add-project-icon">
            +
          </div>

          <div>

            <h1>
              Add New Project
            </h1>

            <p>
              Create a new project and add its information.
            </p>

          </div>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              PROJECT NAME
          ========================= */}

          <div className="form-group">

            <label>
              Project Name
            </label>

            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* =========================
              CLIENT NAME
          ========================= */}

          <div className="form-group">

            <label>
              Client Name
            </label>

            <input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) =>
                setClientName(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* =========================
              DATES
          ========================= */}

          <div className="form-row">

            {/* START DATE */}

            <div className="form-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={
                  handleStartDateChange
                }
                required
              />

            </div>


            {/* END DATE */}

            <div className="form-group">

              <label>
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={
                  handleEndDateChange
                }
                required
              />

            </div>

          </div>


          {/* =========================
              STATUS
          ========================= */}

          <div className="form-group">

            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/projects")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              Save Project
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProject;
