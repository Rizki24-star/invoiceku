import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/Home";
import "./index.css";
import "./global.scss";
import InvoicePage from "./pages/invoice/Invoice";
import AddInvoicePage from "./pages/invoice/AddInvoice";
import MainLayout from "./layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "invoices",
        element: <InvoicePage />,
      },
      {
        path: "invoices/create",
        element: <AddInvoicePage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
