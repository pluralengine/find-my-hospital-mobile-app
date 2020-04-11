export const BASE_API_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.BASE_API_URL;

export const ENDPOINTS = {
  HOSPITALS: `${BASE_API_URL}/hospitals`,
  USERS: `${BASE_API_URL}/users`,
  LOGIN: `${BASE_API_URL}/login`,
};

export async function getHospitals() {
  return fetch(ENDPOINTS.HOSPITALS, {
    method: "GET",
    headers: await getRequestsHeaders(),
  }).then((data) => data.json());
}

export async function createUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    hospitalId: user.hospitalId,
  };

  return fetch(ENDPOINTS.USERS, {
    method: "POST",
    headers: await getRequestsHeaders(),
    body: JSON.stringify(payload),
  }).then((data) => data.json());
}

export async function login(user, password) {
  const payload = {
    email: user,
    password: password,
  };
  const fetchOptions = {
    method: "POST",
    headers: await getRequestsHeaders(),
    body: JSON.stringify(payload),
  };

  return fetch(ENDPOINTS.LOGIN, fetchOptions).then((data) => {
    return data.json();
  });
}

export async function getUser(user) {
  return fetch(`${ENDPOINTS.USERS}/${user.id}`, {
    method: "GET",
    headers: await getRequestsHeaders(),
  }).then((data) => data.json());
}

export async function getRequestsHeaders() {
  return {
    "Content-Type": "application/json",
  };
}
