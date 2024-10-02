import { Request, Response } from "express";
import * as invoiceService from "../services/invoiceService";
import { Prisma } from "@prisma/client";

export const getAllInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json({ message: "success", data: invoices });
  } catch (error) {
    res.status(500).json({ message: "Error getting all invoices", error });
  }
};

export const createInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    // console.log(JSON.stringify(invoice));

    res.status(200).json({ message: "success", data: invoice });
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(req.body));
    res.status(500).json({ message: "Error posting invoice", error });
  }
};
