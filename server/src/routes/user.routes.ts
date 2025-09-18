import { Router } from "express";

const router = Router();

import { approveInvoicePayment, approveMaterialDc, approveMaterialInvoice, createMaterialDc, createMaterialInvoice, deleteMaterialInvoice, getMaterialInvoice, listMaterialDcs, listMaterialInvoices, updateMaterialInvoice } from '@controllers/user.controller'
import validateInput from "@/middlewares/validate.middleware";
import { ApproveDcEntrySchema, ApproveMaterialInvoiceSchema, DcEntrySchema } from "@/types/zod";
import { verifyUser } from "@/middlewares/auth.middleware";

// Material Invoice Routes
router.post("/create/material-invoice", verifyUser("STORE_INCHARGE"), createMaterialInvoice);
router.post("/update/material-invoice/:id", verifyUser("STORE_INCHARGE"), updateMaterialInvoice);
router.delete("/delete/material-invoice/:id", deleteMaterialInvoice);
router.get("/get/material-invoice/:id", getMaterialInvoice);
router.get("/list/material-invoices", listMaterialInvoices);
router.post("/approve/material-invoice", validateInput(ApproveMaterialInvoiceSchema), verifyUser("PROCUREMENT_MANAGER"), approveMaterialInvoice);
router.post("/approve/invoice-payment", validateInput(ApproveMaterialInvoiceSchema), verifyUser("ACCOUNTS_MANAGER"), approveInvoicePayment);

// Material DC Routes
router.post("/create/dc-entry", validateInput(DcEntrySchema), verifyUser("STORE_INCHARGE"), createMaterialDc);
router.get("/list/dc-entries", listMaterialDcs);
router.post("/approve/dc-entry", validateInput(ApproveDcEntrySchema), verifyUser("PROCUREMENT_MANAGER"), approveMaterialDc);

export default router