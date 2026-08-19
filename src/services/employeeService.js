const API_URL = "/api";

// =========================
// Get Employees
// =========================
export async function getEmployees() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/employees?fields=id,name,email,job_title`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}

// =========================
// Add Employee
// =========================
export async function addEmployee(employee) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/employees`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    }
  );

  return await response.json();
}

// =========================
// Update Employee
// =========================
export async function updateEmployee(id, employee) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/employees/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    }
  );

  return await response.json();
}

// =========================
// Delete Employee
// =========================
export async function deleteEmployee(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/employees/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}