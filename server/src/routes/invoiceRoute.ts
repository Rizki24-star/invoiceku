import { Router } from "express";
import {
  getAllInvoices,
  getInvoicesByYear,
  createInvoice,
} from "../controllers/invoiceController";

const router = Router();

router.get("/", getAllInvoices);
router.get("/:year", getInvoicesByYear);
router.post("/create", createInvoice);

export default router;
