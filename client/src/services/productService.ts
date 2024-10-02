import { get } from "./api";

export const getProducts = async () => {
  try {
    return await get("/products");
  } catch (error) {
    throw { message: `Error: ${error}` };
  }
};
