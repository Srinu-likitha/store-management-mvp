import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
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
  hnsCode: z.string().min(1, "HNS code is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0, "Quantity must be zero or greater"),
  ratePerUnit: z.number().min(0, "Rate per unit must be zero or greater"),
  cost: z.number().min(0, "Cost must be zero or greater"),
});

const pdfFileListSchema = z.custom<FileList>((files) => {
  if (typeof FileList === "undefined") {
    return false;
  }
  return files instanceof FileList;
}, {
  message: "Invoice attachment is required",
}).refine((files) => files.length > 0, {
  message: "Invoice attachment is required",
}).refine((files) => files.item(0)?.type === "application/pdf", {
  message: "Only PDF files are allowed",
});

export const MaterialInvoiceSchema = z.object({
  id: z.string().optional(),
  dateOfReceipt: z.string().min(1, "Date of receipt is required"),
  vendorName: z.string().min(1, "Vendor name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  deliveryChallanNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
  materialCategory: z.enum([
    "CIVIL",
    "PLUMBING",
    "ELECTRICAL",
    "INTERIOR",
    "EXTERIOR",
    "OTHER"
  ]),
  hnsCode: z.string().min(1, "HNS code is required"),
  uom: z.string().min(1, "Unit of measurement is required"),
  vendorContactNumber: z.string().optional(),
  poNumber: z.string().optional(),
  poDate: z.string().optional(),
  purposeOfMaterial: z.string().optional(),
  cgst: z.number().min(0, "CGST cannot be negative"),
  sgst: z.number().min(0, "SGST cannot be negative"),
  transportationCharges: z.number().min(0, "Transportation charges cannot be negative"),
  invoiceAttachment: pdfFileListSchema,
  remarks: z.string().optional(),
  InvoiceMaterialItem: z.array(InvoiceMaterialItemSchema).min(1, "At least one invoice item is required"),
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
