import { apiFetch } from '../../../utils/apiClient';

export const validateOffer = async (code: string, cart: { items: any[]; total: number }, options?: { paymentMethod?: string, paymentBank?: string }) => {
  const payload: any = { code, items: cart.items, total: cart.total };
  if (options) {
    if (options.paymentMethod) payload.paymentMethod = options.paymentMethod;
    if (options.paymentBank) payload.paymentBank = options.paymentBank;
  }
  try {
    const raw = localStorage.getItem('luxeva_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u) {
        payload.userId = u.id || u._id || u.uid;
        payload.email = u.email;
      }
    }
  } catch (e) {}
  return apiFetch('/api/offers/validate', { method: 'POST', body: JSON.stringify(payload) });
};

export default { validateOffer };
