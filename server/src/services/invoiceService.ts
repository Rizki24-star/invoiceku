import { Invoices, Prisma, Products } from "@prisma/client";
import { prisma } from "../prsima/prisma";
import { Decimal } from "@prisma/client/runtime/library";

type NewInvoice = {
  customer_name: string;
  salesperson_name: string;
  date: Date;
  notes: string;
  products: {
    id: number;
    quantity: number;
  }[];
};

export type InvoiceResponse = {
  id: number;
  customer_name: string;
  salesperson_name: string;
  date: Date;
  notes?: string | null;
  total_price: Decimal;
  invoice_product: {
    product: {
      id: number;
      name: string;
      image: string;
    };
    quantity: number;
    sub_total: Decimal;
  }[];
};

export const getAllInvoices = async (): Promise<InvoiceResponse[]> => {
  return await prisma.invoices.findMany({
    select: {
      id: true,
      customer_name: true,
      salesperson_name: true,
      date: true,
      notes: true,
      total_price: true,
      invoice_product: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          quantity: true,
          sub_total: true,
        },
      },
    },
  });
};

export const getInvoicesByYear = async (year: number) => {
  return await prisma.invoices.findMany({
    where: {
      date: {
        gt: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
    select: {
      id: true,
      date: true,
      total_price: true,
    },
  });
};

export const createInvoice = async (
  invoice: NewInvoice
): Promise<Invoices | any> => {
  const products = await Promise.all(
    invoice.products.map(async (product) => {
      const getProduct = await prisma.products.findUnique({
        where: { id: product.id },
      });
      return {
        ...getProduct,
        quantity: product.quantity,
        sub_total: Number(getProduct?.price) * product.quantity,
      };
    })
  );
  const totalPrice = products.reduce(
    (acc, product) => acc + Number(product.sub_total),
    0
  );
  console.log("total pricee" + totalPrice);

  const newInvoice = await prisma.invoices.create({
    data: {
      customer_name: invoice.customer_name,
      salesperson_name: invoice.salesperson_name,
      notes: invoice.notes,
      date: new Date(invoice.date),
      total_price: totalPrice,
    },
  });
  await prisma.invoiceProduct.createMany({
    data: products.map((product) => ({
      product_id: product.id!,
      invoice_id: newInvoice && newInvoice.id,
      quantity: product.quantity,
      sub_total: product.quantity * Number(product.price),
    })),
  });
  return newInvoice;
};
