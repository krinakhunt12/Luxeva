import { apiFetch } from '../../../utils/apiClient';

export const fetchRecommendations = async (productId: string, limit = 8) => {
  return apiFetch(`/api/products/${productId}/recommendations?limit=${limit}`);
};
