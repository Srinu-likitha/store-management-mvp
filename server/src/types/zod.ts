import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})
export type LoginRequestParams = z.infer<typeof LoginRequest>;

export const InvoiceMaterialItemSchema = z.object({
  id: z.string().optional(),
  category: z.enum([
    "CIVIL",
    "PLUMBING",
    "ELECTRICAL",
    "INTERIOR",
    "EXTERIOR",
    "OTHER"
  ]),
  hnsCode: z.string(),
  description: z.string(),
  quantity: z.number(),
  ratePerUnit: z.number(),
  cost: z.number(),
});

export const MaterialInvoiceSchema = z.object({
  id: z.string().optional(),
  dateOfReceipt: z.string(),
  vendorName: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  deliveryChallanNumber: z.string(),
  vehicleNumber: z.string(),
  materialCategory: z.enum([
    "CIVIL",
    "PLUMBING",
    "ELECTRICAL",
    "INTERIOR",
    "EXTERIOR",
    "OTHER"
  ]),
  hnsCode: z.string(),
  uom: z.string(),
  vendorContactNumber: z.string(),
  poNumber: z.string(),
  poDate: z.string(),
  purposeOfMaterial: z.string(),
  cgst: z.number(),
  sgst: z.number(),
  transportationCharges: z.number(),
  invoiceAttachment: z.string().optional(),
  totalCost: z.number().optional(),
  remarks: z.string().optional(),
  InvoiceMaterialItem: z.array(InvoiceMaterialItemSchema),
});

export const ApproveMaterialInvoiceSchema = z.object({
  id: z.string(),
  approved: z.boolean(),
});

export const DcEntrySchema = z.object({
  id: z.string().optional(),
  dateOfReceipt: z.string(),
  vendorName: z.string(),
  dcNumber: z.string(),
  vehicleNumber: z.string(),
  materialDescription: z.string(),
  uom: z.string(),
  receivedQuantity: z.number(),
  purposeOfMaterial: z.string(),
  dcAttachment: z.string(),
  bmrnNumber: z.string(),
  approved: z.boolean().optional(),
  remarks: z.string().optional(),
});

export const ApproveDcEntrySchema = z.object({
  id: z.string(),
  approved: z.boolean(),
});

export type MaterialInvoiceInput = z.infer<typeof MaterialInvoiceSchema>;
export type InvoiceMaterialItemInput = z.infer<typeof InvoiceMaterialItemSchema>;
export type ApproveMaterialInvoiceInput = z.infer<typeof ApproveMaterialInvoiceSchema>;
export type DcEntryInput = z.infer<typeof DcEntrySchema>;
export type ApproveDcEntryInput = z.infer<typeof ApproveDcEntrySchema>;