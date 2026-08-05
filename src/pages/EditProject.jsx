import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import {getProjectById,updateProject } from "../services/projectService";
import { useNavigate } from "react-router-dom";
function EditProject() {
  const { id } = useParams();
const [projectName, setProjectName] = useState("");
const [clientName, setClientName] = useState("");
const [status, setStatus] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    const result = await getProjectById(id);

setProjectName(result.data.project_name);
setClientName(result.data.client_name);
setStatus(result.data.status);  }

const handleSubmit = async (e) => {
  e.preventDefault();

  await updateProject(id, {
    project_name: projectName,
    client_name: clientName,
    status: status,
  });

  navigate("/projects");
};

  
   return (
  <div>
    <h1>Edit Project</h1>

    <form onSubmit={handleSubmit}>
      <div>
        <label>Project Name</label>
        <br />
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Client Name</label>
        <br />
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Status</label>
        <br />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <br />

      <button type="submit">
        Save Changes
      </button>
    </form>
  </div>
);
  
}

export default EditProject;