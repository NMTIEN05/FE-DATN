import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SearchResultPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const [products, setProducts] = useState([]);
interface Product {
  _id: string;
  title: string;
  priceDefault: number;
  imageUrl?: string;
  // thêm các trường khác nếu cần
}

// const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!query) return;

    const fetch = async () => {
      const res = await axios.get("http://localhost:8888/api/product", {
        params: { search: query },
      });
      setProducts(res.data.data);
    };

    fetch();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Kết quả cho "{query}"</h2>
      {products.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-red-500">{p.priceDefault?.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;
