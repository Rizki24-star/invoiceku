import { Router } from "express";
import productRoutes from "./productRoute";
import invoiceRoutes from "./invoiceRoute";
import authRoutes from "./authRoute";

const router = Router();

router.use("/products", productRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/auth", authRoutes);

export default router;
