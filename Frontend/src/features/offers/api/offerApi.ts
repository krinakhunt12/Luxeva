import { apiFetch } from '../../../../utils/apiClient';

export const validateOffer = async (code: string, cart: { items: any[]; total: number }) => {
  const payload = { code, items: cart.items, total: cart.total };
  return apiFetch('/api/offers/validate', { method: 'POST', body: JSON.stringify(payload) });
};

export default { validateOffer };
