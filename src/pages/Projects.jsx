import { useEffect, useState } from "react";
import { getProjects, deleteProject } from "../services/projectService";
import { Link } from "react-router-dom"; 


function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const result = await getProjects();
    setProjects(result.data);
  }

  async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmDelete) return;

  await deleteProject(id);

  loadProjects();
}

  return (
    <div>
      <h1>Projects Management</h1>

<Link to="/add-project">
  <button>Add Project</button>
</Link>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.project_name}</td>
              <td>{project.client_name}</td>
              <td>{project.status}</td>

              <td>
               <Link to={`/edit-project/${project.id}`}>
  <button>Edit</button>
</Link>
              <button onClick={() => handleDelete(project.id)}>
  Delete
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;