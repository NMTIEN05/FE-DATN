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

const API_BASE_URL = 'https://provinces.open-api.vn/api';

export const locationService = {
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/p`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  },

  // Lấy danh sách quận/huyện theo tỉnh
  getDistricts: async (provinceCode: string): Promise<District[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
      return response.data.districts || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  },

  // Lấy danh sách phường/xã theo quận/huyện
  getWards: async (districtCode: string): Promise<Ward[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/d/${districtCode}?depth=2`);
      return response.data.wards || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  },

  // Lấy thông tin chi tiết tỉnh
  getProvinceDetail: async (provinceCode: string): Promise<Province | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/p/${provinceCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching province detail:', error);
      return null;
    }
  },

  // Lấy thông tin chi tiết quận/huyện
  getDistrictDetail: async (districtCode: string): Promise<District | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/d/${districtCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching district detail:', error);
      return null;
    }
  },

  // Lấy thông tin chi tiết phường/xã
  getWardDetail: async (wardCode: string): Promise<Ward | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/w/${wardCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ward detail:', error);
      return null;
    }
  }
}; 