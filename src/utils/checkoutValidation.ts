export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  cuthe: string;
  paymentMethod: string;
}

export const validateCheckout = (values: CheckoutFormValues) => {
  const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

  if (!values.fullName?.trim()) {
    errors.fullName = "Vui lòng nhập họ tên";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^(0|\+84)[0-9]{9,10}$/.test(values.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  if (!values.city?.trim()) {
    errors.city = "Vui lòng nhập Tỉnh/TP";
  }

  if (!values.district?.trim()) {
    errors.district = "Vui lòng nhập Quận/Huyện";
  }

  if (!values.ward?.trim()) {
    errors.ward = "Vui lòng nhập Phường/Xã";
  }

  if (!values.cuthe?.trim()) {
    errors.cuthe = "Vui lòng nhập Số nhà / Đường";
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
  }

  return errors;
};
