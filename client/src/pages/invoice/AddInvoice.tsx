import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import SelectedProductCard from "../../components/selectedProductCard/selectedProductCard";
import ProductSearchPanel from "../../components/productSearchPanel/ProductSearchPanel";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { z } from "zod";
import { PostInvoice } from "../../types";
import { postInvoice } from "../../services/invoiceService";
import { Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedProducts } from "../../slices/productSlice";

const invoiceFormData = [
  {
    label: "Date",
    name: "date",
    type: "date",
  },
  {
    label: "Customer Name",
    name: "customer_name",
    type: "text",
  },
  {
    label: "Salesperson Name",
    name: "salesperson_name",
    type: "text",
  },
];

const productSchema = z.object({
  id: z.number(),
  quantity: z.number().min(1, "Product quantity must be greater than zero"),
});

const invoiceSchema = z.object({
  customer_name: z.string().min(3, "Customer name is required"),
  salesperson_name: z.string().min(3, "Sales person name is required"),
  date: z.string().min(3, "Date  is required"),
  notes: z.string().optional(),
  products: z
    .array(productSchema)
    .min(1, "At least 1 product must be selected"),
});

const AddInvoicePage = () => {
  const [isOpen, setisOpen] = useState(false);
  const dispatch = useDispatch();
  const { selectedProducts } = useSelector(
    (state: RootState) => state.products
  );
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState<PostInvoice>({
    customer_name: "",
    salesperson_name: "",
    date: "",
    notes: "",
    products: [],
  });

  useEffect(() => {
    const selectedInvoiceProducts = Array.from(selectedProducts.entries()).map(
      ([id, { quantity }]) => ({
        id: id,
        quantity: quantity,
      })
    );

    console.log(selectedInvoiceProducts);

    setInvoiceData({
      ...invoiceData,
      products: selectedInvoiceProducts,
    });
  }, [selectedProducts]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
    console.log({ ...invoiceData });
  };

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();

    const validate = invoiceSchema.safeParse(invoiceData);

    if (!validate.success) {
      const errorMessage = validate.error.issues.map((issue) => issue.message);
      setErrors(errorMessage);
      console.log(validate.error.issues);
    } else {
      setErrors([]);
      postInvoice(invoiceData)
        .then((res) => {
          console.log(res);
          dispatch(setSelectedProducts());
          setInvoiceData({
            customer_name: "",
            salesperson_name: "",
            date: "",
            notes: "",
            products: [],
          });
          navigate("/invoices", { state: "Invoice created successfully" });
        })
        .catch((e) => {
          setErrors([e.message]);
        });
    }
  };

  return (
    <div className="add-invoice">
      <div className="flex items-center justify-between ">
        <h1 className="title">Add Invoice</h1>
      </div>
      <div className="mt-4">
        {errors.length > 0 && (
          <div className="text-red-500">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={handleSumbit}
          className="flex flex-col justify-between gap-4 "
        >
          <div className="flex items-center justify-between w-full  gap-4">
            {invoiceFormData.map(({ label, name, type }) => (
              <Input
                label={label}
                name={name}
                type={type as "text" | "datetime" | "number"}
                value={invoiceData[name as keyof typeof invoiceData]}
                onChange={handleInputChange}
              />
            ))}
          </div>
          <div>
            <Input
              label="Notes"
              name="notes"
              onChange={handleInputChange}
              value={invoiceData.notes}
              type="text"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4>Select Products</h4>
              <a
                className="text-blue-500 font-bold text-lg cursor-pointer"
                onClick={() => setisOpen(true)}
              >
                Add product
              </a>
            </div>

            <div className="flex flex-wrap max-h-32 py-2  gap-4 overflow-auto">
              {Array.from(selectedProducts.entries()).map(
                ([id, { name, quantity }]) => (
                  <SelectedProductCard
                    key={id}
                    id={id}
                    name={name}
                    quantity={quantity}
                  />
                )
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button text="Add Invoice" onClick={() => {}} type="submit" />
          </div>
        </form>
      </div>
      <ProductSearchPanel open={isOpen} onClose={() => setisOpen(false)} />
    </div>
  );
};

export default AddInvoicePage;
