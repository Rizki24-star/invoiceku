import React, { useEffect, useState } from "react";
import "./home.scss";
import ChartComponent from "../../components/chart/Chart";
import { InvoiceProducts } from "../../types";
import { getAllInvoices } from "../../services/invoiceService";

const HomePage = () => {
  const [invoiceProducts, setInvoiceProduct] = useState<InvoiceProducts[]>([]);
  const [chartData, setChartDate] = useState<{
    dates: string[];
    totalPrices: number[];
  }>();

  useEffect(() => {
    getAllInvoices()
      .then((invoices) => {
        setInvoiceProduct(invoices.data);
        setChartDate({
          dates: invoiceProducts.map((invoice) =>
            new Date(invoice.date).toLocaleDateString()
          ),
          totalPrices: invoiceProducts.map((invoice) =>
            Number(invoice.total_price)
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [invoiceProducts]);

  return (
    <div className="home">
      <div className="flex items-center justify-between">
        <h1 className="title">Dashboard</h1>
      </div>

      <ChartComponent />
    </div>
  );
};

export default HomePage;
