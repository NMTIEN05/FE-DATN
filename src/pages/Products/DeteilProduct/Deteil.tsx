import React from "react";
import ProductDetaill from "../ProductDetail";
import ReviewProduct from "../ReviewProduct";
import { useParams } from "react-router-dom";

const Deteil = () => {
    const { id } = useParams(); // Lấy id từ URL (tương ứng với productId)
    console.log('Product ID from URL:', id);
    return (
        <div>
            <ProductDetaill />
               <ReviewProduct productId={id} /> 
        </div>
    );
};

export default Deteil;