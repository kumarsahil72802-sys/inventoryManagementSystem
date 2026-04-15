import axios from 'axios';

// Create centralized axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' && localStorage.getItem('inventory_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Backward compatibility functions
const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function getApiUrl(path) {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchWithAuth(path, options = {}) {
  const url = path.startsWith("http") ? path : getApiUrl(path);
  const token = typeof window !== "undefined" && localStorage.getItem("inventory_admin_token");

  const { body, ...restOptions } = options;

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...restOptions,
  };

  // Axios uses 'data' instead of 'body'
  if (body) {
    config.data = body;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios(url, config);
    // Return fetch-like response for backward compatibility
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
    };
  } catch (error) {
    // Return fetch-like error response
    return {
      ok: false,
      status: error.response?.status || 500,
      json: () => Promise.resolve(error.response?.data || { message: error.message }),
    };
  }
}

export async function loginAdmin(email, password) {
  try {
    const response = await apiClient.post('/auth/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Login failed");
  }
}

// Export the centralized axios client for direct use
export { apiClient };
