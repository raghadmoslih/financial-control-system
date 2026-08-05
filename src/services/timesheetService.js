const API_URL = "http://localhost:8055";

export async function addTimesheet(timesheet) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/timesheets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(timesheet),
  });

  const data = await response.json();

  return data;
}

export async function getTimesheets() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/timesheets?fields=*,project.project_name`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
}