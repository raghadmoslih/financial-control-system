const API_URL = "/api";

export async function getProjects() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
}

export async function addProject(project) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  const data = await response.json();

  console.log("Add project response:", data);

  return {
    ok: response.ok,
    data: data,
  };
}

export async function getProjectById(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
}

export async function updateProject(id, project) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    data: data,
  };
}

export async function deleteProject(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/items/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}