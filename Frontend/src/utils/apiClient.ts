const BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:4000';

export const apiUrl = (path: string) => {
  if (!path) return BASE_URL;
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_URL}${path}`;
};

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = apiUrl(path);
  const rawHeaders = options.headers || {};

  const headers: Record<string, string> = {};
  // If body is FormData, don't set Content-Type (browser will add multipart boundary)
  const isForm = (options.body && typeof (options.body as any).append === 'function');
  if (!isForm) headers['Content-Type'] = 'application/json';
  Object.assign(headers, rawHeaders as any);

  // include token from either storage if available
  const token = localStorage.getItem('luxeva_token') || sessionStorage.getItem('luxeva_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return res.json();
}

export const setToken = (token: string, remember = true) => {
  try {
    if (remember) localStorage.setItem('luxeva_token', token);
    else sessionStorage.setItem('luxeva_token', token);
  } catch (e) {}
};

export const removeToken = () => {
  try { localStorage.removeItem('luxeva_token'); sessionStorage.removeItem('luxeva_token'); } catch (e) {}
};

export default {
  apiUrl,
  apiFetch,
  setToken,
  removeToken,
};
