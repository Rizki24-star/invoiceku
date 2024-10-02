import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "../types";
import { enableMapSet } from "immer";

enableMapSet();

type ProductState = {
  products: Product[];
  selectedProducts: Map<number, { name: string; quantity: number }>;
};

const initialState: ProductState = {
  products: [],
  selectedProducts: new Map(),
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProducts: (state) => {
      state.selectedProducts = new Map();
    },
    addProduct: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );

      // if (productIndex >= 0 && state.products[productIndex].stocks > 0) {
      //   state.products[productIndex] = {
      //     ...state.products[productIndex],
      //     stocks: state.products[productIndex].stocks - 1,
      //   };
      //   console.log("founded :" + state.products[productIndex].stocks);
      // }

      if (state.products[productIndex].stocks > 0) {
        state.products = state.products.map((product) => {
          return product.id === action.payload.id
            ? { ...state.products[productIndex], stocks: product.stocks - 1 }
            : product;
        });

        const newSelectedProducts = new Map(state.selectedProducts);
        newSelectedProducts.set(action.payload.id, {
          ...action.payload,
          quantity:
            (newSelectedProducts.get(action.payload.id)?.quantity || 0) + 1,
        });

        console.log(state.products[productIndex].stocks);

        state.selectedProducts = newSelectedProducts;
      }
    },
    deleteProduct: (state, action: PayloadAction<{ id: number }>) => {
      const newSelectedProducts = new Map(state.selectedProducts);
      const selectedProduct = newSelectedProducts.get(action.payload.id);
       const productIndex = state.products.findIndex(
         (product) => product.id === action.payload.id
       );

        state.products = state.products.map((product) => {
          return product.id === action.payload.id
            ? { ...state.products[productIndex], stocks: product.stocks + 1 }
            : product;
        });

          if (selectedProduct && selectedProduct.quantity === 1) {
            newSelectedProducts.delete(action.payload.id);
            state.selectedProducts = newSelectedProducts;
          } else if (selectedProduct) {
            newSelectedProducts.set(action.payload.id, {
              ...selectedProduct,
              quantity: selectedProduct.quantity - 1,
            });

            state.selectedProducts = newSelectedProducts;
          }
      

    
    },
  },
});

export const { setProducts, setSelectedProducts, addProduct, deleteProduct } =
  productSlice.actions;
export default productSlice.reducer;
