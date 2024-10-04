import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { CheckBadgeIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { InvoiceProducts } from "../../types";
import { getAllInvoices } from "../../services/invoiceService";

const InvoicePage = () => {
  const [invoiceProducts, setInvoiceProduct] = useState<InvoiceProducts[]>([]);
  const [selectedInvoiceProduct, setSelectedInvoiceProduct] =
    useState<InvoiceProducts | null>();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    getAllInvoices()
      .then((invoices) => {
        setInvoiceProduct(invoices.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [invoiceProducts]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <div className="invoice">
      <div className="flex items-center justify-between">
        <h1 className="title">Invoices</h1>
        <Button
          text="Add Invoice"
          Icon={PlusIcon}
          onClick={() => handleNavigate("create")}
        />
      </div>
      <div className="mt-4">
        {location.state && (
          <div className="text-green-500 flex items-center gap-2 font-bold md:text-xl mb-2">
            <CheckBadgeIcon width={20} />
            <span>{location.state}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoiceProducts.map((invoice) => (
            <div
              className="p-4 border bg-white shadow-md rounded-md cursor-pointer"
              onClick={() => setSelectedInvoiceProduct(invoice)}
            >
              <div className="flex flex-col gap-2 ">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded-full" />
                  <span>{invoice.salesperson_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span>{invoice.customer_name}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">IDR {invoice.total_price}</p>
                    <p>
                      <strong>{invoice.invoice_product.length} </strong>{" "}
                      products
                    </p>
                    <span className="text-xs">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedInvoiceProduct && (
        <div className="absolute top-0 right-0 w-full h-screen">
          <div className="bg-slate-500 w-full h-screen flex justify-center bg-opacity-50 fixed">
            <div className="max-h-[600px] p-4 bg-white opacity-100 w-full  m-auto mx-2 max-w-[600px] rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Invoice Detail</p>
                <button
                  className="font-bold"
                  onClick={() => setSelectedInvoiceProduct(null)}
                >
                  X
                </button>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div>
                  <span className="text-sm">Date</span>
                  <p className="font-medium">
                    {new Date(selectedInvoiceProduct.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm">Customer Name</span>
                  <p className="font-medium">
                    {selectedInvoiceProduct.customer_name}
                  </p>
                </div>
                <div>
                  <span className="text-sm">Salesperson Name</span>
                  <p className="font-medium">
                    {selectedInvoiceProduct.salesperson_name}
                  </p>
                </div>

                <div className="overflow-y-scroll max-h-[280px] p-2">
                  <p className="font-bold">Purchased products ()</p>
                  {selectedInvoiceProduct.invoice_product.map((product) => (
                    <div className="flex items-center justify-between">
                      <img
                        src={product.product.image}
                        className="max-w-[60px] max-h-[60px]"
                        alt="product-image"
                      />
                      <p>{product.product.name}</p>
                      <p>x{product.quantity}</p>
                      <p>{product.sub_total}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span>Total price</span>
                  <p className="text-lg font-bold">
                    IDR {selectedInvoiceProduct.total_price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
