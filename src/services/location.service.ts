import axios from 'axios';

export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  province_code: string;
}

export interface Ward {
  code: string;
  name: string;
  district_code: string;
}

const BACKEND_API_URL = 'http://localhost:8888/api/location';
const EXTERNAL_API_URL = 'https://provinces.open-api.vn/api';

export const locationService = {
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async (): Promise<Province[]> => {
    try {
      // Thử backend trước
      const response = await axios.get(`${BACKEND_API_URL}/provinces`);
      return response.data;
    } catch (error) {
      console.error('Backend API failed, trying external API:', error);
      try {
        // Fallback to external API
        const response = await axios.get(`${EXTERNAL_API_URL}/p`);
        return response.data;
      } catch (externalError) {
        console.error('External API also failed:', externalError);
        return [];
      }
    }
  },

  // Lấy danh sách quận/huyện theo tỉnh
  getDistricts: async (provinceCode: string): Promise<District[]> => {
    try {
      // Thử backend trước
      const response = await axios.get(`${BACKEND_API_URL}/provinces/${provinceCode}/districts`);
      return response.data;
    } catch (error) {
      console.error('Backend API failed, trying external API:', error);
      try {
        // Fallback to external API
        const response = await axios.get(`${EXTERNAL_API_URL}/p/${provinceCode}?depth=2`);
        return response.data.districts || [];
      } catch (externalError) {
        console.error('External API also failed:', externalError);
        return [];
      }
    }
  },

  // Lấy danh sách phường/xã theo quận/huyện
  getWards: async (districtCode: string): Promise<Ward[]> => {
    try {
      // Thử backend trước
      const response = await axios.get(`${BACKEND_API_URL}/districts/${districtCode}/wards`);
      return response.data;
    } catch (error) {
      console.error('Backend API failed, trying external API:', error);
      try {
        // Fallback to external API
        const response = await axios.get(`${EXTERNAL_API_URL}/d/${districtCode}?depth=2`);
        return response.data.wards || [];
      } catch (externalError) {
        console.error('External API also failed:', externalError);
        return [];
      }
    }
  },

  // Lấy thông tin chi tiết tỉnh
  getProvinceDetail: async (provinceCode: string): Promise<Province | null> => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/provinces/${provinceCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching province detail:', error);
      return null;
    }
  },

  // Lấy thông tin chi tiết quận/huyện
  getDistrictDetail: async (districtCode: string): Promise<District | null> => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/districts/${districtCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching district detail:', error);
      return null;
    }
  },

  // Lấy thông tin chi tiết phường/xã
  getWardDetail: async (wardCode: string): Promise<Ward | null> => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/wards/${wardCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ward detail:', error);
      return null;
    }
  }
}; 