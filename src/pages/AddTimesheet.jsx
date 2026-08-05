import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { addTimesheet } from "../services/timesheetService";
import { useNavigate } from "react-router-dom";

function Timesheets() {
    const [projects, setProjects] = useState([]);
 const [project, setProject] = useState("");
const [workDate, setWorkDate] = useState("");
const [days, setDays] = useState("");
const navigate = useNavigate();
useEffect(() => {
  loadProjects();
}, []);

async function loadProjects() {
  const result = await getProjects();
  setProjects(result.data);
}

const handleSubmit = async (e) => {
  e.preventDefault();

  await addTimesheet({
    project: project,
    employee: 1,
    work_date: workDate,
    days: Number(days),
  });

navigate("/timesheets");};

  return (
    <div>
      <h1>Timesheets</h1>

<form onSubmit={handleSubmit}>
            <div>
          <label>Project</label>
          <br />
        <select
  value={project}
  onChange={(e) => setProject(e.target.value)}
>
  <option value="">Select Project</option>

  {projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.project_name}
    </option>
  ))}
</select>
        </div>

        <br />

        <div>
          <label>Date</label>
          <br />
         <input
  type="date"
  value={workDate}
  onChange={(e) => setWorkDate(e.target.value)}
/>
        </div>

        <br />

        <div>
          <label>Days</label>
          <br />
   <input
  type="number"
  value={days}
  onChange={(e) => setDays(e.target.value)}
/>
        </div>

        <br />

       

        <button type="submit">
          Save Timesheet
        </button>
      </form>
    </div>
  );
}

export default Timesheets;