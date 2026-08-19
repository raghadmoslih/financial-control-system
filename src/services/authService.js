const API_URL = "/api";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/users/me?fields=*,role.*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return data;
}