import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api`
  : '/api';

console.log('[ZeroWaste AI] Active API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zw_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zw_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ─── Food Scanning ───────────────────────────────────────────────────────────

export async function scanFood(imageBase64) {
  return api.post('/scan', { image: imageBase64 });
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export async function getInventory(params = {}) {
  return api.get('/inventory', { params });
}

export async function addInventoryItems(items) {
  return api.post('/inventory/bulk', { items });
}

export async function updateInventoryItem(id, data) {
  return api.put(`/inventory/${id}`, data);
}

export async function deleteInventoryItem(id) {
  return api.delete(`/inventory/${id}`);
}

// ─── Predictions ─────────────────────────────────────────────────────────────

export async function getPredictions() {
  return api.get('/predictions');
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getActions(params = {}) {
  return api.get('/actions', { params });
}

export async function acceptAction(id) {
  return api.post(`/actions/${id}/accept`);
}

export async function completeAction(id) {
  return api.post(`/actions/${id}/complete`);
}

export async function dismissAction(id) {
  return api.post(`/actions/${id}/dismiss`);
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboard() {
  return api.get('/dashboard');
}

// ─── Impact ──────────────────────────────────────────────────────────────────

export async function getImpact(period = 'month') {
  return api.get('/impact', { params: { period } });
}

// ─── Food Banks ──────────────────────────────────────────────────────────────

export async function getFoodBanks(lat, lng, radius = 25) {
  return api.get('/food-banks', { params: { lat, lng, radius } });
}

// ─── AI Assistant ────────────────────────────────────────────────────────────

export async function askAI(question) {
  return api.post('/ai/ask', { question });
}

export default api;
