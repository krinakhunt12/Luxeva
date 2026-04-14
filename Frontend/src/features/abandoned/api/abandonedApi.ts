import { apiFetch } from '../../../utils/apiClient';

export const fetchAbandoned = async (params: any = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/api/abandoned?${qs}`);
};

export const sendAbandonedNow = async (id: string) => {
  return apiFetch(`/api/abandoned/send/${id}`, { method: 'POST' });
};

export const previewAbandonedTemplate = async (id?: string) => {
  const qs = id ? `?id=${id}` : '';
  return apiFetch(`/api/abandoned/template${qs}`);
};
