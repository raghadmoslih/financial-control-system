const API_URL = "/api";

// =========================
// Get Expenses
// =========================

export async function getExpenses(employeeId = null) {
  const token = localStorage.getItem("access_token");

  let url =
    `${API_URL}/items/expenses` +
    `?fields=*,employee.id,employee.name,employee.email,employee.job_title,project.id,project.project_name`;

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


// =========================
// Get Employee by Email
// =========================

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


// =========================
// Add Expense
// =========================

export async function addExpense(expense) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    }
  );

  return await response.json();
}


// =========================
// Delete Expense
// =========================

export async function deleteExpense(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/expenses/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}


// =========================
// Get One Expense
// =========================

export async function getExpense(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/expenses/${id}?fields=*,employee.id,employee.name,employee.email,employee.job_title,project.id,project.project_name`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}


// =========================
// Update Expense
// =========================

export async function updateExpense(id, expense) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/expenses/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    }
  );

  return await response.json();
}