import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, useTransition } from "react";
import ProductCard from "../productCard/ProductCard";
import { Product } from "../../types";
import { getProducts } from "../../services/productService";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  setProducts,
} from "../../slices/productSlice";

const ProductSearchPanel = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>();
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const { products, selectedProducts } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    getProducts()
      .then((data) => {
        dispatch(setProducts(data.products));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [search, dispatch]);

  useEffect(() => {
    handleProductFilter(search);
  }, [open]);

  const handleProductFilter = (search: string) => {
    if (search.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(search)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSelectProducts = (
    product: { id: number; name: string },
    operation: "add" | "delete"
  ) => {
    if (operation === "add") {
      dispatch(addProduct(product));

      setFilteredProducts(
        products.map((prevProduct) =>
          prevProduct.id === product.id
            ? { ...prevProduct, stock: prevProduct.stocks - 1 }
            : prevProduct
        )
      );
    } else {
      dispatch(deleteProduct(product));
    }
  };

  return (
    <div
      className={`absolute p-4 bg-white top-0 right-0 w-full md:max-w-[50%] h-screen overflow-x-hidden overflow-y-auto ${open ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-bold">List Products</h2>
        <button className="cursor-pointer" onClick={onClose}>
          <XMarkIcon width={32} />
        </button>
      </div>
      <div className="h-max p-4 mt-4">
        <input
          type="text"
          className="w-full border p-2 rounded-md focus:border-white"
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        {selectedProducts ? (
          <div className="flex flex-col py-2">
            <p className="font-bold">Selected Products</p>
            <div className="flex flex-wrap items-center gap-2">
              {Array.from(selectedProducts.entries()).map(
                ([id, { name, quantity }]) => (
                  <button
                    key={id}
                    className="flex items-center gap-1 cursor-pointer  border-4 p-2 px-8 rounded-sm"
                    onClick={() => handleSelectProducts({ id, name }, "delete")}
                  >
                    <span>
                      {name} <strong>{quantity}</strong>
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 h-full max-h-screen mt-4 overflow-y-auto px-2">
          {filteredProducts?.map((product, i) => (
            <ProductCard
              key={i}
              onClick={() => handleSelectProducts(product, "add")}
              {...{ ...product, price: Number(product.price) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSearchPanel;
