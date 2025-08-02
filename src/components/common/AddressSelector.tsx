import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { locationService, Province, District, Ward } from '../../services/location.service';

interface AddressSelectorProps {
  province?: string;
  district?: string;
  ward?: string;
  onProvinceChange?: (provinceCode: string) => void;
  onDistrictChange?: (districtCode: string) => void;
  onWardChange?: (wardCode: string) => void;
  disabled?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  province,
  district,
  ward,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  disabled = false,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  // Load provinces khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        const provincesData = await locationService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Load districts khi province thay đổi
  useEffect(() => {
    if (province) {
      const loadDistricts = async () => {
        try {
          setLoading(true);
          const districtsData = await locationService.getDistricts(province);
          setDistricts(districtsData);
          setWards([]); // Reset wards
          if (onDistrictChange) onDistrictChange('');
          if (onWardChange) onWardChange('');
        } catch (error) {
          console.error('Error loading districts:', error);
        } finally {
          setLoading(false);
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [province, onDistrictChange, onWardChange]);

  // Load wards khi district thay đổi
  useEffect(() => {
    if (district) {
      const loadWards = async () => {
        try {
          setLoading(true);
          const wardsData = await locationService.getWards(district);
          setWards(wardsData);
          if (onWardChange) onWardChange('');
        } catch (error) {
          console.error('Error loading wards:', error);
        } finally {
          setLoading(false);
        }
      };
      loadWards();
    } else {
      setWards([]);
    }
  }, [district, onWardChange]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    if (onProvinceChange) onProvinceChange(provinceCode);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    if (onDistrictChange) onDistrictChange(districtCode);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    if (onWardChange) onWardChange(wardCode);
  };

  return (
    <div className="space-y-3">
      {/* Province */}
      <div className="relative group">
        <label htmlFor="province" className="block text-sm font-semibold text-gray-700 mb-0.5">
          Tỉnh/Thành phố
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="province"
            value={province || ''}
            onChange={handleProvinceChange}
            disabled={disabled || loading}
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm appearance-none ${
              disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((provinceItem) => (
              <option key={provinceItem.code} value={provinceItem.code}>
                {provinceItem.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* District */}
      <div className="relative group">
        <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-0.5">
          Quận/Huyện
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="district"
            value={district || ''}
            onChange={handleDistrictChange}
            disabled={disabled || loading || !province}
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm appearance-none ${
              disabled || loading || !province ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((districtItem) => (
              <option key={districtItem.code} value={districtItem.code}>
                {districtItem.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ward */}
      <div className="relative group">
        <label htmlFor="ward" className="block text-sm font-semibold text-gray-700 mb-0.5">
          Phường/Xã
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="ward"
            value={ward || ''}
            onChange={handleWardChange}
            disabled={disabled || loading || !district}
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm appearance-none ${
              disabled || loading || !district ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((wardItem) => (
              <option key={wardItem.code} value={wardItem.code}>
                {wardItem.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Đang tải...</span>
        </div>
      )}
    </div>
  );
};

export default AddressSelector; 