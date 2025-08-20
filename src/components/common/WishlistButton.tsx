import React, { useEffect, useState } from "react";
import { wishlistService } from "../../pages/Services/wishlist/wishlist.service";

type Props = { productId?: string };

const Heart = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24"
       fill={filled ? "currentColor" : "none"}
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function WishlistButton({ productId }: Props) {
  const [liked, setLiked] = useState(false);

  if (!productId) return null;

  useEffect(() => {
    let mounted = true;
    wishlistService.getAll().then(list => {
      if (!mounted) return;
      const inList = list.some(i => String(i.product?._id ?? i.product) === productId);
      setLiked(inList);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      await wishlistService.add(productId);
      setLiked(true);
    } else {
      await wishlistService.remove(productId);
      setLiked(false);
    }
  };

  return (
    <button
      onClick={toggle}
      title={liked ? "Bỏ yêu thích" : "Thêm yêu thích"}
      style={{
        width: 30, height: 30, borderRadius: 999,
        display: "grid", placeItems: "center",
        background: liked ? "#ef4444" : "#fff",
        color: liked ? "#fff" : "#ef4444",
        border: "1px solid #ef4444", cursor: "pointer"
      }}
    >
      <Heart filled={liked} />
    </button>
  );
}
