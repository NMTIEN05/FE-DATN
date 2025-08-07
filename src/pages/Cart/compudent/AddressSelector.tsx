// AddressSelector.tsx
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;
 // ✅ dùng require thay vì import

interface Props {
  province: string;
  district: string;
  ward: string;
  onChange: (data: { province: string; district: string; ward: string }) => void;
}

const AddressSelector: React.FC<Props> = ({ province, district, ward, onChange }) => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const provinces = dvhcvn.getProvinces();

  useEffect(() => {
    if (province) {
      setDistricts(dvhcvn.getDistrictsByProvinceCode(province));
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [province]);

  useEffect(() => {
    if (district) {
      setWards(dvhcvn.getWardsByDistrictCode(district));
    } else {
      setWards([]);
    }
  }, [district]);

  const emitChange = (p: string, d: string, w: string) => {
    onChange({ province: p, district: d, ward: w });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
      <Select
        value={province || undefined}
        onChange={(value) => emitChange(value, '', '')}
        placeholder="Tỉnh / Thành phố"
        showSearch
      >
        {provinces.map((p: any) => (
          <Option key={p.code} value={p.code}>
            {p.name}
          </Option>
        ))}
      </Select>

      <Select
        value={district || undefined}
        onChange={(value) => emitChange(province, value, '')}
        placeholder="Quận / Huyện"
        disabled={!province}
        showSearch
      >
        {districts.map((d: any) => (
          <Option key={d.code} value={d.code}>
            {d.name}
          </Option>
        ))}
      </Select>

      <Select
        value={ward || undefined}
        onChange={(value) => emitChange(province, district, value)}
        placeholder="Phường / Xã"
        disabled={!district}
        showSearch
      >
        {wards.map((w: any) => (
          <Option key={w.code} value={w.code}>
            {w.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default AddressSelector;
