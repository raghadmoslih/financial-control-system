import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getProjects,
  deleteProject,
} from "../services/projectService";

import "../styles/projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const role = localStorage.getItem("user_role");

  useEffect(() => {
    loadProjects();
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
  // LOAD PROJECTS
  // =========================

  async function loadProjects() {
    try {
      const result = await getProjects();

      console.log("PROJECTS:", result);

      setProjects(result.data || []);
    } catch (error) {
      console.error(
        "LOAD PROJECTS ERROR:",
        error
      );
    }
  }

  // =========================
  // DELETE PROJECT
  // =========================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteProject(id);

      console.log(
        "DELETE PROJECT RESULT:",
        result
      );

      if (result.errors || result.ok === false) {
        alert(
          result.errors?.[0]?.message ||
            "Failed to delete project."
        );
        return;
      }

      loadProjects();

    } catch (error) {
      console.error(
        "DELETE PROJECT ERROR:",
        error
      );

      alert(
        "Failed to delete project."
      );
    }
  }

  return (
    <div className="projects-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="projects-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={goBackToDashboard}
          >
            ← Back to Dashboard
          </button>

          <h1>
            Projects Management
          </h1>

          <p>
            Manage and monitor all company projects.
          </p>

        </div>

        <Link
          to="/add-project"
          className="primary-button"
        >
          + Add Project
        </Link>

      </div>


      {/* =========================
          PROJECTS SUMMARY
      ========================= */}

      <div className="projects-summary">

        <div className="project-stat-card">

          <span>
            Total Projects
          </span>

          <strong>
            {projects.length}
          </strong>

        </div>


        <div className="project-stat-card">

          <span>
            Active Projects
          </span>

          <strong>
            {
              projects.filter(
                (project) =>
                  project.status === "Active"
              ).length
            }
          </strong>

        </div>


        <div className="project-stat-card">

          <span>
            Completed Projects
          </span>

          <strong>
            {
              projects.filter(
                (project) =>
                  project.status === "Completed"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* =========================
          PROJECTS TABLE
      ========================= */}

      <div className="projects-table-container">

        {projects.length === 0 ? (

          <div className="projects-empty">
            No projects found.
          </div>

        ) : (

          <table className="projects-table">

            <thead>

              <tr>

                <th>
                  Project
                </th>

                <th>
                  Client
                </th>

                <th>
                  Start Date
                </th>

                <th>
                  End Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {projects.map((project) => (

                <tr key={project.id}>

                  <td className="project-name">
                    {project.project_name || "-"}
                  </td>


                  <td>
                    {project.client_name || "-"}
                  </td>


                  <td>
                    {project.start_date || "-"}
                  </td>


                  <td>
                    {project.end_date || "-"}
                  </td>


                  <td>

                    <span
                      className={`project-status ${
                        project.status?.toLowerCase()
                      }`}
                    >
                      {project.status || "-"}
                    </span>

                  </td>


                  <td>

                    <div className="project-actions">

                      <Link
                        to={`/edit-project/${project.id}`}
                        className="edit-button"
                      >
                        Edit
                      </Link>


                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(project.id)
                        }
                      >
                        Delete
                      </button>


                      <Link
                        to={`/project-financial/${project.id}`}
                        className="financial-button"
                      >
                        Financial
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Projects;