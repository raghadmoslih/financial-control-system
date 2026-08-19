import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getProjectById,
  updateProject,
} from "../services/projectService";

import "../styles/projects.css";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      const result = await getProjectById(id);

      console.log("PROJECT:", result);

      if (!result.data) {
        alert("Project not found.");
        navigate("/projects");
        return;
      }

      setProjectName(result.data.project_name || "");
      setClientName(result.data.client_name || "");

      setStartDate(
        result.data.start_date
          ? result.data.start_date.split("T")[0]
          : ""
      );

      setEndDate(
        result.data.end_date
          ? result.data.end_date.split("T")[0]
          : ""
      );

      setStatus(result.data.status || "Active");

    } catch (error) {
      console.error("LOAD PROJECT ERROR:", error);
      alert("Failed to load project.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // =========================
    // PROJECT NAME
    // =========================

    if (projectName.trim() === "") {
      alert("Project name is required.");
      return;
    }

    // =========================
    // CLIENT NAME
    // =========================

    if (clientName.trim() === "") {
      alert("Client name is required.");
      return;
    }

    // =========================
    // DATES
    // =========================

    if (!startDate || !endDate) {
      alert("Start date and end date are required.");
      return;
    }

    // End date cannot be before start date
    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      const result = await updateProject(id, {
        project_name: projectName.trim(),
        client_name: clientName.trim(),
        start_date: startDate,
        end_date: endDate,
        status: status,
      });

      console.log("UPDATE PROJECT:", result);

      if (!result.ok) {
        const errorCode =
          result.data?.errors?.[0]?.extensions?.code;

        if (errorCode === "RECORD_NOT_UNIQUE") {
          alert("Project name is already in use.");
        } else {
          console.error(
            "UPDATE PROJECT ERROR:",
            result.data
          );

          alert("Failed to update project.");
        }

        return;
      }

      navigate("/projects");

    } catch (error) {
      console.error("UPDATE PROJECT ERROR:", error);
      alert("Failed to update project.");
    }
  }

  return (
    <div className="add-project-page">

      <div className="add-project-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="add-project-header">

          <div className="add-project-icon">
            ✎
          </div>

          <div>

            <h1>
              Edit Project
            </h1>

            <p>
              Update the project information.
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
                setProjectName(e.target.value)
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
                setClientName(e.target.value)
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
                onChange={(e) => {
                  const newStartDate =
                    e.target.value;

                  setStartDate(newStartDate);

                  // If existing end date is
                  // before the new start date,
                  // clear it.
                  if (
                    endDate &&
                    newStartDate > endDate
                  ) {
                    setEndDate("");
                  }
                }}
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
                onChange={(e) =>
                  setEndDate(e.target.value)
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
                setStatus(e.target.value)
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
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProject;
