"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveDcEntrySchema = exports.DcEntrySchema = exports.ApproveMaterialInvoiceSchema = exports.MaterialInvoiceSchema = exports.InvoiceMaterialItemSchema = exports.LoginRequest = void 0;
const zod_1 = require("zod");
exports.LoginRequest = zod_1.z.object({
    email: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.InvoiceMaterialItemSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    category: zod_1.z.enum([
        "CIVIL",
        "PLUMBING",
        "ELECTRICAL",
        "INTERIOR",
        "EXTERIOR",
        "OTHER"
    ]),
    hnsCode: zod_1.z.string(),
    description: zod_1.z.string(),
    quantity: zod_1.z.number(),
    ratePerUnit: zod_1.z.number(),
    cost: zod_1.z.number(),
});
exports.MaterialInvoiceSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    dateOfReceipt: zod_1.z.string(),
    vendorName: zod_1.z.string(),
    invoiceNumber: zod_1.z.string(),
    invoiceDate: zod_1.z.string(),
    deliveryChallanNumber: zod_1.z.string(),
    vehicleNumber: zod_1.z.string(),
    materialCategory: zod_1.z.enum([
        "CIVIL",
        "PLUMBING",
        "ELECTRICAL",
        "INTERIOR",
        "EXTERIOR",
        "OTHER"
    ]),
    hnsCode: zod_1.z.string(),
    uom: zod_1.z.string(),
    vendorContactNumber: zod_1.z.string(),
    poNumber: zod_1.z.string(),
    poDate: zod_1.z.string(),
    purposeOfMaterial: zod_1.z.string(),
    cgst: zod_1.z.number(),
    sgst: zod_1.z.number(),
    transportationCharges: zod_1.z.number(),
    invoiceAttachment: zod_1.z.string().optional(),
    totalCost: zod_1.z.number().optional(),
    remarks: zod_1.z.string().optional(),
    InvoiceMaterialItem: zod_1.z.array(exports.InvoiceMaterialItemSchema),
});
exports.ApproveMaterialInvoiceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    approved: zod_1.z.boolean(),
});
exports.DcEntrySchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    dateOfReceipt: zod_1.z.string(),
    vendorName: zod_1.z.string(),
    dcNumber: zod_1.z.string(),
    vehicleNumber: zod_1.z.string(),
    materialDescription: zod_1.z.string(),
    uom: zod_1.z.string(),
    receivedQuantity: zod_1.z.number(),
    purposeOfMaterial: zod_1.z.string(),
    dcAttachment: zod_1.z.string(),
    bmrnNumber: zod_1.z.string(),
    approved: zod_1.z.boolean().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.ApproveDcEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    approved: zod_1.z.boolean(),
});
