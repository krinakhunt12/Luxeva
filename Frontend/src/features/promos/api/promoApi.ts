import { apiFetch } from '../../../utils/apiClient';

export const getPromosContext = async (productId: string) => {
  const payload = {} as any;
  try {
    const raw = localStorage.getItem('luxeva_user');
    if (raw) {
      const u = JSON.parse(raw);
      payload.userId = u.id || u._id || u.uid;
      payload.email = u.email;
    }
  } catch (e) {}
  const qs = new URLSearchParams({ productId });
  if (payload.userId) qs.set('userId', payload.userId);
  if (payload.email) qs.set('email', payload.email);
  return apiFetch(`/api/promos/context?${qs.toString()}`);
};

export default { getPromosContext };
