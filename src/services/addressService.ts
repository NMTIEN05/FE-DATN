import axios from "axios";

const API_URL = "https://provinces.open-api.vn/api";

export const getProvinces = () => axios.get(`${API_URL}/p/`);
export const getDistrictsByProvince = (provinceCode: string) =>
  axios.get(`${API_URL}/p/${provinceCode}?depth=2`);
export const getWardsByDistrict = (districtCode: string) =>
  axios.get(`${API_URL}/d/${districtCode}?depth=2`);
