import { PostInvoice } from "../types";
import { get, post } from "./api";

export const getAllInvoices = async () => {
  try {
    return await get("/invoices");
  } catch (error) {
    throw { message: `Error: ${error}` };
  }
};

export const getInvoicesByYear = async (year: string) => {
  try {
    return await get(`/invoices/${year}`);
  } catch (error) {
    throw { message: `Error: ${error}` };
  }
};

export const postInvoice = async (req: PostInvoice) => {
  try {
    return await post("/invoices/create", req);
  } catch (error) {
    throw { message: `Error: ${error}` };
  }
};
