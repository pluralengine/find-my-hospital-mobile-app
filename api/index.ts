<<<<<<< HEAD
const qs = require("qs");
// export const BASE_API_URL = "http://192.168.1.51:3000";
export const BASE_API_URL = "http://localhost:3000";
=======
const qs = require('qs');
export const BASE_API_URL = 'http://192.168.1.68:3000';
>>>>>>> feat: add color of products in pharmacy callout
// export const BASE_API_URL = "https://covid-19-hospital-finder.herokuapp.com";

export const ENDPOINTS = {
  HOSPITALS: `${BASE_API_URL}/hospitals`,
  USERS: `${BASE_API_URL}/users`,
  LOGIN: `${BASE_API_URL}/login`,
  VOTE: `${BASE_API_URL}/score`,
  PRODUCTS: `${BASE_API_URL}/products`,
  PROVINCES: `${BASE_API_URL}/provinces/areas`,
  USER_PHARMACY: `${BASE_API_URL}/user/pharmacy`,
  PHARMACY_STOCK: `${BASE_API_URL}/user/pharmacy/stock`,
  PHARMACIES: `${BASE_API_URL}/pharmacies`,
};

export async function getProducts() {
  return fetch(ENDPOINTS.PRODUCTS, {
    method: 'GET',
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getProvinces() {
  return fetch(ENDPOINTS.PROVINCES, {
    method: 'GET',
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacies(queryParams) {
  const query = qs.stringify(queryParams);

  return fetch(`${ENDPOINTS.PHARMACIES}?${query}`, {
    method: 'GET',
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getHospitals() {
  return fetch(ENDPOINTS.HOSPITALS, {
    method: 'GET',
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacy(token) {
  return fetch(ENDPOINTS.USER_PHARMACY, {
    method: 'GET',
    headers: getRequestsHeaders(token),
  }).then(requestToJson);
}

export async function updatePharmacyStock(token, productId, stock) {
  const payload = {
    productId,
    stock,
  };
  const fetchOptions = {
    method: 'PUT',
    headers: getRequestsHeaders(token),
    body: JSON.stringify(payload),
  };

  return fetch(ENDPOINTS.PHARMACY_STOCK, fetchOptions).then(requestToJson);
}

export async function getHospital(id) {
  return fetch(`${ENDPOINTS.HOSPITALS}/${id}`, {
    method: 'GET',
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
    method: 'POST',
    headers: getRequestsHeaders(),
    body: JSON.stringify(payload),
  }).then(requestToJson);
}

export async function createPharmacyUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    centerCode: user.centerCode,
    pharmacyId: user.pharmacyId,
  };

  return fetch(ENDPOINTS.USER_PHARMACY, {
    method: 'POST',
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
    method: 'POST',
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
    method: 'POST',
    headers: getRequestsHeaders(user.token),
    body: JSON.stringify(payload),
  };

  return fetch(ENDPOINTS.VOTE, fetchOptions).then(requestToJson);
}

export function getRequestsHeaders(token = null) {
  return {
    'Content-Type': 'application/json',
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
