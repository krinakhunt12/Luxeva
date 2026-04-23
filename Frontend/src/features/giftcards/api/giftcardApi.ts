import { apiFetch } from '../../../utils/apiClient';

export const purchaseGiftCard = async (amount: number, opts: { code?: string; expiresAt?: string } = {}) => {
  const body: any = { amount };
  if (opts.code) body.code = opts.code;
  if (opts.expiresAt) body.expiresAt = opts.expiresAt;
  return apiFetch('/api/giftcards/purchase', { method: 'POST', body: JSON.stringify(body) });
};

export const redeemGiftCard = async (code: string, amount: number) => {
  return apiFetch('/api/giftcards/redeem', { method: 'POST', body: JSON.stringify({ code, amount }) });
};

export default { purchaseGiftCard, redeemGiftCard };
