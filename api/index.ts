// export const BASE_API_URL = "http://localhost:3000";
export const BASE_API_URL = "https://covid-19-hospital-finder.herokuapp.com";

export const ENDPOINTS = {
  HOSPITALS: `${BASE_API_URL}/hospitals`,
  USERS: `${BASE_API_URL}/users`,
  LOGIN: `${BASE_API_URL}/login`,
  VOTE: `${BASE_API_URL}/score`,
  PROVINCES: `${BASE_API_URL}/provinces`,
};

export async function getProvinces() {
  return fetch(ENDPOINTS.PROVINCES, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacies() {
  return Promise.resolve([
    {
      id: 11329,
      name: "MARTINEZ COLINAS,ANDREA/SANCHEZ LOPEZ,MARIA",
      address: "CALLE CAMELIES 66",
      phoneNum: "932353039",
      geometryLat: "41.41346",
      geometryLng: "2.16384",
      products: [
        { id: 1, name: "Mascarilla", stock: true },
        { id: 2, name: "Gel desinfectante", stock: true },
      ],
    },
    {
      id: 10821,
      name: "DE FRUTOS ILLAN, M.CARME",
      centerCode: "F08008240",
      address: "CALLE CAMELIES 22",
      phoneNum: "932132513",
      geometryLat: "41.4111859",
      geometryLng: "2.1595809",
      products: [
        { id: 1, name: "Mascarilla", stock: false },
        { id: 2, name: "Gel desinfectante", stock: true },
      ],
    },
    {
      id: 12029,
      name: "QUIROS BERNAL, MARIA CARMEN",
      address: "CALLE CAMELIES 32",
      phoneNum: "935646904",
      geometryLat: "41.4626937",
      geometryLng: "2.1692016",
      products: [
        { id: 1, name: "Mascarilla", stock: true },
        { id: 2, name: "Gel desinfectante", stock: true },
      ],
    },
  ]);
}

export async function getHospitals() {
  return fetch(ENDPOINTS.HOSPITALS, {
    method: "GET",
    headers: getRequestsHeaders(),
  }).then(requestToJson);
}

export async function getPharmacy() {
  return Promise.resolve({
    id: 12029,
    name: "QUIROS BERNAL, MARIA CARMEN",
    address: "CALLE CAMELIES 32",
    phoneNum: "935646904",
    updatedAt: "2020-04-16T18:37:47.452Z",
    geometryLat: "41.4626937",
    geometryLng: "2.1692016",
    products: [
      { id: 1, name: "Mascarilla", photo: "", stock: true },
      { id: 2, name: "Gel desinfectante", photo: "", stock: true },
      { id: 4, name: "Guantes", photo: "", stock: false },
    ],
  });
}
export async function reportStock(products) {
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
