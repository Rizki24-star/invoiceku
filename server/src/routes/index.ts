import { Router } from "express";
import productRoutes from "./productRoute";
import invoiceRoutes from "./invoiceRoute";

const router = Router();

router.use("/products", productRoutes);
router.use("/invoices", invoiceRoutes);

export default router;
