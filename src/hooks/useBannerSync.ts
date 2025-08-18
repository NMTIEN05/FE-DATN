import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export interface Banner {
  _id: string;
  title?: string;
  image: string;        // URL tuyệt đối sau khi normalize
  description?: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:8888';
const API_URL = `${API_BASE}/api/banners`;

export const useBannerSync = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chuẩn hoá ảnh, path tương đối -> URL tuyệt đối
  const normalizeImage = (raw?: string) => {
    if (!raw) return '';
    return raw.startsWith('http') ? raw : `${API_BASE}${raw}`;
  };

  // Lấy mảng banner từ nhiều dạng response khác nhau
  const extractList = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.banners)) return data.banners;
    return []; // fallback an toàn
  };

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(API_URL, { timeout: 10000 });
      const listRaw = extractList(res.data);

      const list: Banner[] = listRaw
        .map((b: any) => ({
          _id: b._id || b.id,
          title: b.title || '',
          image: normalizeImage(b.image || b.imageUrl),
          description: b.description || '',
          link: b.link || '#',
          isActive: !!b.isActive,
          order: typeof b.order === 'number' ? b.order : 0,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        }))
        .filter((b: Banner) => b.isActive)
        .sort((a: Banner, b: Banner) => (a.order ?? 0) - (b.order ?? 0));

      setBanners(list);
    } catch (err: any) {
      console.error('Error fetching banners:', err);
      setError('Không thể tải banner');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  // Polling 30s
  useEffect(() => {
    const id = setInterval(fetchBanners, 30000);
    return () => clearInterval(id);
  }, [fetchBanners]);

  // Lắng nghe custom event từ admin (nếu có)
  useEffect(() => {
    const onUpdated = () => fetchBanners();
    window.addEventListener('banners-updated', onUpdated);
    return () => window.removeEventListener('banners-updated', onUpdated);
  }, [fetchBanners]);

  const refetch = useCallback(() => fetchBanners(), [fetchBanners]);

  return useMemo(() => ({ banners, loading, error, refetch }), [banners, loading, error, refetch]);
};
