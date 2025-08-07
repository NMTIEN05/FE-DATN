export interface IProduct {
      _id: string;
  title: string;
  imageUrl?: string | string[];
  priceDefault?: number;
  isFavorite?: boolean;
}