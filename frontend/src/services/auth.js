import api from './api';

export async function loginWithEmail(email, password) {
  const data = await api.post('/auth/login', { email, password });
  if (data?.token) {
    localStorage.setItem('zw_token', data.token);
    localStorage.setItem('zw_user', JSON.stringify(data.user));
  }
  return data;
}

export async function loginWithGoogle(token) {
  const data = await api.post('/auth/google', { token });
  if (data?.token) {
    localStorage.setItem('zw_token', data.token);
    localStorage.setItem('zw_user', JSON.stringify(data.user));
  }
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (_) {
    // ignore
  } finally {
    localStorage.removeItem('zw_token');
    localStorage.removeItem('zw_user');
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('zw_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('zw_token'));
}
