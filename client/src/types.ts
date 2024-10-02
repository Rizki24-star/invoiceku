export type Product = {
  id: number;
  name: string;
  image: string;
  stocks: number;
  price: number;
};

export type PostInvoice = {
  customer_name: string;
  salesperson_name: string;
  date: string;
  notes: string;
  products: {
    id: number;
    quantity: number;
  }[];
};

export type InvoiceProducts = {
  id: number;
  customer_name: string;
  salesperson_name: string;
  date: string;
  notes: string;
  total_price: string;
  invoice_product: [
    {
      product: {
        id: number;
        name: string;
        image: string;
      };
      quantity: number;
      sub_total: string;
    },
  ];
};
