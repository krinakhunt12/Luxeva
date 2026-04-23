const BASE_URL = import.meta.env.VITE_API_URL || 'https://luxeva.onrender.com';
import { showSuccess, showError } from './toastService';

export interface FetchOptions extends RequestInit {
  successMessage?: string;
  hideSuccessToast?: boolean;
  hideErrorToast?: boolean;
}

export const apiUrl = (path: string) => {
  if (!path) return BASE_URL;
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_URL}${path}`;
};

export async function apiFetch(path: string, options: FetchOptions = {}) {
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

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body?.message || res.statusText || 'Request failed';

      if (res.status === 401) {
        // Auto-logout on invalid/expired token
        removeToken();
        localStorage.removeItem('luxeva_user');
        window.dispatchEvent(new Event('luxeva:user-changed'));
        if (!window.location.pathname.includes('/login')) {
          showError('Session expired. Please login again.');
          window.location.href = '/login';
        }
      } else {
        if (!options.hideErrorToast) showError(message);
      }
      throw new Error(message);
    }
    const data = await res.json();

    // Show success toast for non-GET requests only if a custom successMessage is provided
    if (!options.hideSuccessToast && options.method && options.method !== 'GET' && options.successMessage) {
      showSuccess(options.successMessage);
    }

    return data;
  } catch (error: any) {
    // Only show error if it hasn't been shown by the !res.ok block
    if (!options.hideErrorToast && error instanceof TypeError && error.message === 'Failed to fetch') {
      showError('Network error: Could not connect to server');
    }
    throw error;
  }
}

export const setToken = (token: string, remember = true) => {
  try {
    if (remember) localStorage.setItem('luxeva_token', token);
    else sessionStorage.setItem('luxeva_token', token);
  } catch (e) { }
};

export const removeToken = () => {
  try { localStorage.removeItem('luxeva_token'); sessionStorage.removeItem('luxeva_token'); } catch (e) { }
};

export default {
  apiUrl,
  apiFetch,
  setToken,
  removeToken,
};
