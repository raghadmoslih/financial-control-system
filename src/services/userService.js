const API_URL = "/api";

// =========================
// Get Users
// =========================
export async function getUsers() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/users?fields=id,first_name,last_name,email,role.id,role.name`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}


// =========================
// Update User
// =========================
export async function updateUser(id, user) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  return await response.json();
}


// =========================
// Delete User
// =========================
export async function deleteUser(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/users/${id}`,
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
// Add User
// =========================
export async function addUser(user) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  return await response.json();
}