import axios from "../../../api/axios.config";

export type WishlistItem = {
  _id: string;
  user: string;
  product: any;
  addedAt: string;
};

export const wishlistService = {
  getAll: async () => {
    const { data } = await axios.get<WishlistItem[]>("/wishlist");
    return data;
  },
  add: async (productId: string) => {
    const { data } = await axios.post<WishlistItem>(`/wishlist/${productId}`);
    return data;
  },
  remove: async (productId: string) => {
    const { data } = await axios.delete<{ message: string }>(`/wishlist/${productId}`);
    return data;
  },
};
