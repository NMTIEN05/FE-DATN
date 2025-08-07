import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Banner {
  _id: string;
  title?: string;
  image: string;
  description?: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:8888/api';

export const useBannerSync = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/banners`);
      const allBanners = response.data;
      // Chỉ lấy banners active và sắp xếp theo order
      const activeBanners = allBanners
        .filter((banner: Banner) => banner.isActive)
        .sort((a: Banner, b: Banner) => a.order - b.order);
      setBanners(activeBanners);
    } catch (err) {
      setError('Không thể tải banner');
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch banners khi component mount
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Polling để đồng bộ real-time (mỗi 30 giây)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBanners();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, [fetchBanners]);

  // Lắng nghe event từ Admin panel (nếu có)
  useEffect(() => {
    const handleBannerUpdate = () => {
      fetchBanners();
    };

    window.addEventListener('banners-updated', handleBannerUpdate);
    return () => {
      window.removeEventListener('banners-updated', handleBannerUpdate);
    };
  }, [fetchBanners]);

  const refetch = useCallback(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    refetch,
  };
}; 