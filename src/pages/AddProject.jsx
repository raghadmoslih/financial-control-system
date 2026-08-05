import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProject } from "../services/projectService";


function AddProject() {
    const navigate = useNavigate();

const [projectName, setProjectName] = useState("");
const [clientName, setClientName] = useState("");
const [status, setStatus] = useState("Active");

const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await addProject({
    project_name: projectName,
    client_name: clientName,
    status: status,
  });

  console.log(result);

  navigate("/projects");
};

  return (
    <div>
      <h1>Add New Project</h1>

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

        <button type="submit">Save Project</button>
      </form>
    </div>
  );
}

export default AddProject;