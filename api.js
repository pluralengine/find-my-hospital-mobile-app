export const BASE_API_URL = "https://covid-19-hospital-finder.herokuapp.com";
export const ENDPOINTS = {
  HOSPITALS: `${BASE_API_URL}/hospitals`,
  USERS: `${BASE_API_URL}/users`
};

export async function getHospitals() {
  return fetch(ENDPOINTS.HOSPITALS).then(data => data.json());
}

export async function createUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    hospitalId: user.hospitalId
  };

  return fetch(ENDPOINTS.USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload) // body data type must match "Content-Type" header
  }).then(data => data.json());
}
