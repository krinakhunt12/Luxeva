import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../utils/apiClient';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueTrend: RevenueTrend[];
}

export interface RecentOrder {
  _id: string;
  total: number;
  createdAt: string;
  status: string;
  userId: string;
}

const fetchDashboardStats = async (): Promise<DashboardData> => {
  return apiFetch('/api/admin/dashboard/stats');
};

const fetchRecentOrders = async (): Promise<RecentOrder[]> => {
  return apiFetch('/api/admin/dashboard/recent-orders');
};

export const useAdminStats = () => {
  return useQuery<DashboardData>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export const useRecentOrders = () => {
  return useQuery<RecentOrder[]>({
    queryKey: ['admin-recent-orders'],
    queryFn: fetchRecentOrders,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
};
