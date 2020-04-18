export const BASE_API_URL = "http://localhost:3000";
// export const BASE_API_URL = "https://covid-19-hospital-finder.herokuapp.com";

export const ENDPOINTS = {
  HOSPITALS: `${BASE_API_URL}/hospitals`,
  USERS: `${BASE_API_URL}/users`,
  LOGIN: `${BASE_API_URL}/login`,
  VOTE: `${BASE_API_URL}/score`,
  PROVINCES: `${BASE_API_URL}/provinces`,
  USER_PHARMACY: `${BASE_API_URL}/user/pharmacy`,
  PHARMACIES: `${BASE_API_URL}/pharmacies`,
};

export async function getProducts() {
  return Promise.resolve([
    { id: 1, name: "Mascarilla", photo: "mask" },
    { id: 2, name: "Gel desinfectante", photo: "handSanitizer" },
    { id: 4, name: "Guantes", photo: "gloves" },
  ]);
}

export async function getProvinces() {
  return fetch(ENDPOINTS.PROVINCES, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacies(province) {
  return fetch(`${ENDPOINTS.PHARMACIES}?provinces=${province}`, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);;
}

export async function getHospitals() {
  return fetch(ENDPOINTS.HOSPITALS, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacy(token) {
  return fetch(ENDPOINTS.USER_PHARMACY, {
    method: "GET",
    headers: getRequestsHeaders(token),
  }).then(requestToJson);
}

export async function updatePharmacyStock(products) {
  return Promise.resolve({
    id: 12029,
    name: "QUIROS BERNAL, MARIA CARMEN",
    address: "CALLE CAMELIES 32",
    updatedAt: String(new Date()),
    phoneNum: "935646904",
    geometryLat: "41.4626937",
    geometryLng: "2.1692016",
    products,
  });
}

export async function getHospital(id) {
  return fetch(`${ENDPOINTS.HOSPITALS}/${id}`, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);
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
    headers: getRequestsHeaders(),
    body: JSON.stringify(payload),
  }).then(requestToJson);
}

export async function login(user, password) {
  const payload = {
    email: user,
    password: password,
  };
  const fetchOptions = {
    method: "POST",
    headers: getRequestsHeaders(),
    body: JSON.stringify(payload),
  };

  return fetch(ENDPOINTS.LOGIN, fetchOptions).then((data) => {
    return data.json();
  });
}

export async function vote(user, score) {
  const payload = {
    hospitalId: user.hospitalId,
    userId: user.id,
    score,
  };
  const fetchOptions = {
    method: "POST",
    headers: getRequestsHeaders(user.token),
    body: JSON.stringify(payload),
  };

  return fetch(ENDPOINTS.VOTE, fetchOptions).then(requestToJson);
}

export function getRequestsHeaders(token = null) {
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
  };
}

export async function requestToJson(res) {
  const response = await res.json();
  if (response.error) {
    throw Error(response.error);
  }
  return response;
}
