import React, { useEffect, useState } from "react";
import { FaCity, FaMap, FaMapSigns, FaHome } from "react-icons/fa";
import axios from "axios";
import { Input, Select } from "antd";

interface AddressFormProps {
  city: string;
  district: string;
  ward: string;
  cuthe: string;
  errors: {
    city?: string;
    district?: string;
    ward?: string;
    cuthe?: string;
  };
  onChange: (value: string, type: "city" | "district" | "ward" | "cuthe") => void;
}

interface Province {
  code: number;
  name: string;
  districts?: District[];
}

interface District {
  code: number;
  name: string;
  wards?: Ward[];
}

interface Ward {
  code: number;
  name: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ city, district, ward, cuthe, errors, onChange }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Load tất cả tỉnh
  useEffect(() => {
    axios.get<Province[]>("https://provinces.open-api.vn/api/p/")
      .then(res => setProvinces(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load huyện khi chọn tỉnh
  useEffect(() => {
    if (!city) {
      setDistricts([]);
      return;
    }
    const selectedProvince = provinces.find(p => p.name === city);
    if (selectedProvince) {
      axios.get<Province>(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then(res => setDistricts(res.data.districts || []))
        .catch(err => console.error(err));
    }
    setWards([]);
    onChange("", "district");
    onChange("", "ward");
  }, [city, provinces]);

  // Load xã khi chọn huyện
  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }
    const selectedDistrict = districts.find(d => d.name === district);
    if (selectedDistrict) {
      axios.get<District>(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then(res => setWards(res.data.wards || []))
        .catch(err => console.error(err));
    }
    onChange("", "ward");
  }, [district, districts]);

  return (
    <div className="flex flex-col w-full mt-4">
      <span className="mb-2 text-gray-700 font-medium">Địa chỉ</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tỉnh/Thành */}
        <div className="flex items-center gap-2">
          <FaCity className="text-gray-400 text-xl flex-shrink-0" />
          <Select
            placeholder="Chọn Tỉnh/Thành"
            value={city || undefined}
            options={provinces.map(p => ({ value: p.name, label: p.name }))}
            onChange={(value) => onChange(value, "city")}
            size="large" // Thêm size="large"
            className="w-full" // Thêm className="w-full"
          />
        </div>
        {errors.city && (
          <span className="text-red-500 text-xs mt-1">{errors.city}</span>
        )}

        {/* Quận/Huyện */}
        <div className="flex items-center gap-2">
          <FaMap className="text-gray-400 text-xl flex-shrink-0" />
          <Select
            placeholder="Chọn Quận/Huyện"
            value={district || undefined}
            options={districts.map(d => ({ value: d.name, label: d.name }))}
            onChange={(value) => onChange(value, "district")}
            size="large" // Thêm size="large"
            className="w-full" // Thêm className="w-full"
            disabled={!city} // Thêm disabled khi chưa chọn tỉnh
          />
        </div>
        {errors.district && (
          <span className="text-red-500 text-xs mt-1">{errors.district}</span>
        )}

        {/* Phường/Xã */}
        <div className="flex items-center gap-2">
          <FaMapSigns className="text-gray-400 text-xl flex-shrink-0" />
          <Select
            placeholder="Chọn Phường/Xã"
            value={ward || undefined}
            options={wards.map(w => ({ value: w.name, label: w.name }))}
            onChange={(value) => onChange(value, "ward")}
            size="large" // Thêm size="large"
            className="w-full" // Thêm className="w-full"
            disabled={!district} // Thêm disabled khi chưa chọn huyện
          />
        </div>
        {errors.ward && (
          <span className="text-red-500 text-xs mt-1">{errors.ward}</span>
        )}

        {/* Số nhà / Đường */}
        <div className="flex items-center gap-2">
          <FaHome className="text-gray-400 text-xl flex-shrink-0" />
          <Input
            placeholder="Số nhà / Đường"
            value={cuthe}
            onChange={(e) => onChange(e.target.value, "cuthe")}
            size="large" // Thêm size="large"
            className="w-full" // Thêm className="w-full"
          />
        </div>
        {errors.cuthe && (
          <span className="text-red-500 text-xs mt-1">{errors.cuthe}</span>
        )}
      </div>
    </div>
  );
};

export default AddressForm;