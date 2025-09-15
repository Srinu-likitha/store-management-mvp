import { Router } from "express";

const router = Router();

import { approveMaterialInvoice, createMaterialInvoice, deleteMaterialInvoice, getMaterialInvoice, healthCheck, listMaterialInvoices, updateMaterialInvoice } from '@controllers/user.controller'
import validateInput from "@/middlewares/validate.middleware";
import { ApproveMaterialInvoiceSchema, MaterialInvoiceSchema } from "@/types/zod";
import { verifyUser } from "@/middlewares/auth.middleware";

router.get("/health", healthCheck);

router.post("/create/material-invoice", validateInput(MaterialInvoiceSchema), verifyUser("STORE_INCHARGE"), createMaterialInvoice);
router.post("/update/material-invoice/:id", validateInput(MaterialInvoiceSchema), verifyUser("STORE_INCHARGE"), updateMaterialInvoice);
router.delete("/delete/material-invoice/:id", verifyUser("STORE_INCHARGE"), deleteMaterialInvoice);
router.get("/get/material-invoice/:id", verifyUser("STORE_INCHARGE"), getMaterialInvoice);
router.get("/list/material-invoices", verifyUser("STORE_INCHARGE"), listMaterialInvoices);
router.post("/approve/material-invoice", validateInput(ApproveMaterialInvoiceSchema), verifyUser("PROCUREMENT_MANAGER"), approveMaterialInvoice);

export default router