export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  category_id: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
