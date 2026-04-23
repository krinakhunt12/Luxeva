import { apiFetch } from '../../../utils/apiClient';

export const fetchLowStock = async (threshold = 5) => {
  return apiFetch(`/api/admin/inventory/low-stock?threshold=${threshold}`);
};

export const restockProduct = async (id: string, stock?: number) => {
  return apiFetch(`/api/admin/inventory/restock/${id}`, { method: 'POST', body: JSON.stringify({ stock }) });
};

export default { fetchLowStock, restockProduct };
