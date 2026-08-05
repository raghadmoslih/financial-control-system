import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { Link } from "react-router-dom";

function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const result = await getProjects();
    console.log(result);

    setProjects(result.data);
  }

  return (
    <div>
      <h1>Manager Dashboard</h1>
      
<Link to="/projects">
  <button>Manage Projects</button>
</Link> 
 
       <Link to="/timesheets">
  <button>Timesheets</button>
</Link>
  
       <Link to="/expenses">
  <button>Expenses</button>
</Link>
      <h2>Projects</h2>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.project_name}
          </li>
        ))}
  
      </ul>
    </div>
  );
}

export default Dashboard;