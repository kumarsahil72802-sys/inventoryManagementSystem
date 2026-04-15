import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('inventory_admin_token');
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || 'Failed to fetch dashboard data'
    );
  }
};