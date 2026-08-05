import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTimesheets } from "../services/timesheetService";
function Timesheets() {
    const [timesheets, setTimesheets] = useState([]);

useEffect(() => {
  loadTimesheets();
}, []);

async function loadTimesheets() {
  const result = await getTimesheets();
  setTimesheets(result.data);
}

 return (
  <div>
    <h1>Timesheets</h1>

    <Link to="/add-timesheet">
      <button>Add Timesheet</button>
    </Link>

    <br />
    <br />

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Project</th>
          <th>Date</th>
          <th>Days</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {timesheets.map((timesheet) => (
          <tr key={timesheet.id}>
            <td>{timesheet.project?.project_name}</td>
            <td>{timesheet.work_date}</td>
            <td>{timesheet.days}</td>
            <td>
  <button>Edit</button>
  <button>Delete</button>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default Timesheets;