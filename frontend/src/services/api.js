import { auth } from "../firebase";

const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const currentUser = auth.currentUser;

  let token = null;

  if (currentUser) {
    token = await currentUser.getIdToken();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API Error ${response.status}: ${errorText}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function get(endpoint) {
  return apiRequest(endpoint, {
    method: "GET",
  });
}

export async function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put(endpoint, data) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function del(endpoint) {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}

export default apiRequest;