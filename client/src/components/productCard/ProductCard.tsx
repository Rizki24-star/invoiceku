import React, { useEffect, useState } from "react";
import { Product } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type ProductCardProps = {
  id: number;
  // name: string;
  // stocks: number;
  // price: number;
  onClick: () => void;
};

const ProductCard = ({
  id,
  // name,
  //  stocks, price,
  onClick,
}: ProductCardProps) => {
  const { products } = useSelector((state: RootState) => state.products);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    setProduct(products.find((product) => product.id === id));
  }, [products, onClick]);

  // const handleUpdateStock = () => {
  //   setProduct((prevProduct) => ({
  //     ...prevProduct!,
  //     stock: prevProduct?.stocks,
  //   }));
  // };

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-white w-full border rounded-md">
      <img className="w-8" src={product?.image} alt="product-image" />
      <p className="font-bold">{product?.name}</p>
      {product && product?.stocks > 0 ? (
        <span className="text-sm">Stocks : {product?.stocks}</span>
      ) : (
        <span className="italic text-red-500 text-sm">Out of stocks </span>
      )}
      <h4 className="font-bold ">IDR {product?.price}</h4>
      <a className="cursor-pointer text-blue-500 font-bold" onClick={onClick}>
        Add
      </a>
    </div>
  );
};

export default ProductCard;
