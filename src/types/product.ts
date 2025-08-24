export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  capacity?: string;
  imageUrl: string[];
  description: string;
  shortDescription: string;
  priceDefault: number;
  soldCount: number; // Đây là dòng bạn cần thêm vào
  // Các thuộc tính khác nếu có trong dữ liệu API của bạn
  // ...
}