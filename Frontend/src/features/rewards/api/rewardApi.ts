import { apiFetch } from '../../../../utils/apiClient';

export const fetchPoints = async () => {
  return apiFetch('/api/rewards');
};

export const redeemPoints = async (points: number) => {
  return apiFetch('/api/rewards/redeem', { method: 'POST', body: JSON.stringify({ points }) });
};

export default { fetchPoints, redeemPoints };
