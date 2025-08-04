# 🎯 Hướng dẫn tính năng mới - Form Đăng ký

## 📋 Tổng quan

Form đăng ký đã được nâng cấp với các tính năng mới:
- ✅ **Nhập lại mật khẩu** - Xác nhận mật khẩu
- ✅ **Tích hợp API tỉnh thành phường xã** - Chọn địa chỉ tự động
- ✅ **Validation nâng cao** - Kiểm tra dữ liệu chặt chẽ
- ✅ **Loading states** - Trạng thái loading khi submit
- ✅ **Error handling** - Xử lý lỗi tốt hơn

## 🏗️ Cấu trúc mới

### 1. Type Definitions
```typescript
// src/types/User.ts
export interface FormData {
  username: string;
  password: string;
  confirmPassword: string; // Mới
  email: string;
  phone: string;
  full_name: string;
  province?: string;    // Mới
  district?: string;    // Mới
  ward?: string;        // Mới
  address?: string;     // Mới
}
```

### 2. Location Service
```typescript
// src/services/location.service.ts
export const locationService = {
  getProvinces(): Promise<Province[]>
  getDistricts(provinceCode: string): Promise<District[]>
  getWards(districtCode: string): Promise<Ward[]>
}
```

### 3. Address Selector Component
```typescript
// src/components/common/AddressSelector.tsx
// Component tái sử dụng cho việc chọn địa chỉ
```

## 🚀 Tính năng mới

### 1. Nhập lại mật khẩu
- **Validation**: Kiểm tra mật khẩu xác nhận có khớp không
- **UI**: Hiển thị icon eye để ẩn/hiện mật khẩu
- **Error**: Thông báo lỗi nếu không khớp

### 2. API Tỉnh thành phường xã
- **Source**: https://provinces.open-api.vn/api
- **Cascade**: Tỉnh → Quận/Huyện → Phường/Xã
- **Auto-reset**: Tự động reset khi thay đổi cấp trên
- **Loading**: Hiển thị loading khi fetch data

### 3. Validation nâng cao
```typescript
// Password validation
{
  required: "Vui lòng nhập mật khẩu",
  minLength: {
    value: 6,
    message: "Mật khẩu ít nhất 6 ký tự",
  },
}

// Confirm password validation
{
  required: "Vui lòng xác nhận mật khẩu",
  validate: (value) => {
    const password = watch("password");
    return value === password || "Mật khẩu xác nhận không khớp";
  },
}
```

## 🔧 Cách sử dụng

### 1. Form đăng ký cơ bản
```tsx
// src/pages/auth/register.tsx
const Register = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  
  // Watch để validation
  const watchProvince = watch("province");
  const watchDistrict = watch("district");
  
  // Submit với validation
  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    // ... submit logic
  };
}
```

### 2. Sử dụng AddressSelector component
```tsx
import AddressSelector from '../components/common/AddressSelector';

<AddressSelector
  province={watchProvince}
  district={watchDistrict}
  ward={watchWard}
  onProvinceChange={(code) => setValue("province", code)}
  onDistrictChange={(code) => setValue("district", code)}
  onWardChange={(code) => setValue("ward", code)}
/>
```

### 3. Location Service
```tsx
import { locationService } from '../services/location.service';

// Load provinces
const provinces = await locationService.getProvinces();

// Load districts theo province
const districts = await locationService.getDistricts(provinceCode);

// Load wards theo district
const wards = await locationService.getWards(districtCode);
```

## 📱 UI/UX Features

### 1. Loading States
- **Button loading**: Spinner khi submit
- **Select loading**: Disabled khi đang fetch data
- **Cascade loading**: Loading indicator cho address selector

### 2. Error Handling
- **Toast notifications**: Thông báo lỗi rõ ràng
- **Field validation**: Hiển thị lỗi ngay tại field
- **API errors**: Xử lý lỗi từ backend

### 3. Responsive Design
- **Mobile friendly**: Hoạt động tốt trên mobile
- **Touch friendly**: Dễ dàng chọn trên touch devices
- **Accessibility**: Hỗ trợ keyboard navigation

## 🔄 Workflow

### 1. User Journey
```
1. User nhập thông tin cơ bản
2. Chọn tỉnh/thành phố → Auto load quận/huyện
3. Chọn quận/huyện → Auto load phường/xã
4. Nhập địa chỉ chi tiết
5. Nhập mật khẩu + xác nhận
6. Submit form với validation
```

### 2. Data Flow
```
User Input → Form Validation → API Call → Success/Error
     ↓
Location API → Cascade Loading → Update UI
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Location API không load**
   - Kiểm tra network connection
   - Kiểm tra CORS settings
   - Fallback: Hiển thị empty options

2. **Password validation lỗi**
   - Kiểm tra watch function
   - Kiểm tra validate function
   - Debug: console.log password values

3. **Form submit lỗi**
   - Kiểm tra API endpoint
   - Kiểm tra data format
   - Kiểm tra required fields

### Debug
```javascript
// Debug form data
console.log('Form data:', data);
console.log('Watched values:', watch());

// Debug location data
console.log('Provinces:', provinces);
console.log('Districts:', districts);
console.log('Wards:', wards);
```

## 📈 Performance

- **Lazy loading**: Chỉ load khi cần
- **Caching**: Cache location data
- **Debouncing**: Tránh spam API calls
- **Optimization**: Minimal re-renders

## 🔒 Security

- **Password validation**: Kiểm tra độ mạnh
- **Input sanitization**: Xử lý input an toàn
- **CSRF protection**: Bảo vệ form
- **Rate limiting**: Giới hạn API calls

## 📞 Support

Nếu có vấn đề:
1. Kiểm tra console logs
2. Kiểm tra network tab
3. Kiểm tra form validation
4. Kiểm tra API responses 