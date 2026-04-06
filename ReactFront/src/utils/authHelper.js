/**
 * Helper para autenticación con tokens JWT
 * Centraliza la lógica de envío de tokens en todas las peticiones
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

/**
 * Obtiene el token del localStorage y prepara headers con el token
 * @param {boolean} includeContentType - Si incluir Content-Type: application/json
 * @returns {object} Headers con Authorization y Content-Type si aplica
 */
export const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('📌 Token encontrado, agregando al header:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No hay token en localStorage');
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

/**
 * Realiza una petición fetch con autenticación
 * @param {string} endpoint - La ruta del endpoint (ej: '/users/me')
 * @param {object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise} Promesa con la respuesta
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    includeContentType = true,
    ...otherOptions
  } = options;

  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No hay token. Redirigiendo a login...');
    window.location.href = '/';
    return { success: false, error: 'No autenticado' };
  }

  const headers = getAuthHeaders(includeContentType && !body);
  
  // Si es FormData, no incluir Content-Type (el navegador lo pone automáticamente)
  if (body instanceof FormData) {
    delete headers['Content-Type'];
  }

  console.log('🔹 Petición autenticada:', { method, endpoint, headers: Object.keys(headers) });

  const config = {
    method,
    headers,
    credentials: 'include',
    ...otherOptions
  };

  if (body && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    config.body = body;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error en respuesta:', data);
      
      // Si es error de token, redirigir a login
      if (response.status === 401 || response.status === 403) {
        console.warn('🔄 Token inválido, limpiando y redirigiendo...');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
      
      return { success: false, error: data.error || 'Error en la respuesta' };
    }

    console.log('✅ Respuesta exitosa:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en fetch:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Obtiene el token actual
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Limpia la sesión (logout)
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  console.log('🚪 Sesión cerrada');
};
