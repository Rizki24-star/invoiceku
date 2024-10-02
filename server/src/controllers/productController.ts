import { Request, Response } from "express";
import * as productSercvices from "../services/productService";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await productSercvices.getAllProducts();
    res.status(200).json({ message: "success", products });
  } catch (error) {
    res.status(500).json({ message: "Error getting all products", error });
  }
};
