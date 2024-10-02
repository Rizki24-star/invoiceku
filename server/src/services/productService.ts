import { Products } from "@prisma/client";
import { prisma } from "../prsima/prisma";

export const getAllProducts = async (): Promise<Products[]> => {
  return await prisma.products.findMany();
};
export const getProduct = async (id: number): Promise<Products | null> => {
  return await prisma.products.findUnique({
    where: {
      id: id,
    },
  });
};
