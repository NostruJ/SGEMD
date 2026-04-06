// src/api.js
const API_URL = 'http://localhost:3005';

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Asegurar que la URL sea completa
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log(`📡 Fetching ${fullUrl}`);
  console.log(`   Token presente: ${token ? 'SÍ' : 'NO'}`);
  if (token) {
    console.log(`   Token (primeros 20 chars): ${token.substring(0, 20)}...`);
  }

  const response = await fetch(fullUrl, { ...options, headers, credentials: 'include' });

  // Si el token expiró o no es válido
  if (response.status === 401 || response.status === 403) {
    console.warn(`⚠️ Error ${response.status}: Token inválido o expirado. URL: ${url}`);
    // localStorage.removeItem("token"); // Comentado temporalmente para debug
    // window.location.href = "/";
    // return;
    const errorMsg = `Error ${response.status}: No autorizado. Token: ${token ? 'Presente' : 'Ausente'}`;
    console.warn(`⚠️ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  return response.json();
};
