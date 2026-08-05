const API_URL = "http://localhost:8055";

export async function getExpenses() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/items/expenses?fields=*,project.project_name`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return data;
}

export async function addExpense(expense) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });

  const data = await response.json();

  return data;
}