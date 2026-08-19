const API_URL = "/api";

// Add Timesheet
export async function addTimesheet(timesheet) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/timesheets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(timesheet),
    }
  );

  return await response.json();
}


// Get Employee by Email
export async function getEmployeeByEmail(email) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/employees?filter[email][_eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}


// Get Timesheets
export async function getTimesheets(employeeId = null) {
  const token = localStorage.getItem("access_token");

  let url =
    `${API_URL}/items/timesheets` +
    `?fields=*,employee.id,employee.name,employee.email,employee.job_title,project.id,project.project_name,project.client_name,project.status`;

  if (employeeId) {
    url += `&filter[employee][_eq]=${employeeId}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}


// Delete Timesheet
export async function deleteTimesheet(id) {
  const token = localStorage.getItem("access_token");

  return await fetch(
    `${API_URL}/items/timesheets/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


// Get One Timesheet
export async function getTimesheet(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/timesheets/${id}?fields=*,employee.id,employee.name,employee.email,employee.job_title,project.id,project.project_name,project.client_name,project.status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}


// Update Timesheet
export async function updateTimesheet(id, timesheet) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/timesheets/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(timesheet),
    }
  );

  return await response.json();
}