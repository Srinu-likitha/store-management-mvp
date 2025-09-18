"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaterialInvoice = createMaterialInvoice;
exports.updateMaterialInvoice = updateMaterialInvoice;
exports.deleteMaterialInvoice = deleteMaterialInvoice;
exports.getMaterialInvoice = getMaterialInvoice;
exports.listMaterialInvoices = listMaterialInvoices;
exports.approveMaterialInvoice = approveMaterialInvoice;
exports.approveInvoicePayment = approveInvoicePayment;
exports.createMaterialDc = createMaterialDc;
exports.getMaterialDc = getMaterialDc;
exports.listMaterialDcs = listMaterialDcs;
exports.approveMaterialDc = approveMaterialDc;
const error_1 = require("../utils/error");
const errors_1 = require("../utils/error/errors");
const storage_1 = require("../utils/storage");
const zod_1 = require("../types/zod");
const user_service_1 = require("../services/user.service");
function normalizeMaterialInvoicePayload(body) {
    const invoiceItemsInput = Array.isArray(body.InvoiceMaterialItem) ? body.InvoiceMaterialItem : [];
    const invoiceItems = invoiceItemsInput.map((item) => ({
        ...item,
        quantity: Number(item.quantity ?? 0),
        ratePerUnit: Number(item.ratePerUnit ?? 0),
    }));
    return {
        ...body,
        cgst: Number(body.cgst ?? 0),
        sgst: Number(body.sgst ?? 0),
        transportationCharges: Number(body.transportationCharges ?? 0),
        InvoiceMaterialItem: invoiceItems,
    };
}
async function createMaterialInvoice(req, res) {
    try {
        const { invoiceAttachmentBase64, invoiceAttachmentName, invoiceAttachmentType, ...rest } = req.body;
        if (!invoiceAttachmentBase64 || !invoiceAttachmentName) {
            throw new errors_1.AppError("Invoice attachment is required", 400);
        }
        const attachmentUrl = await (0, storage_1.uploadInvoiceAttachmentFromBase64)(invoiceAttachmentBase64, invoiceAttachmentName, invoiceAttachmentType ?? "application/pdf");
        const normalizedPayload = normalizeMaterialInvoicePayload(rest);
        const data = zod_1.MaterialInvoiceSchema.parse({
            ...normalizedPayload,
            invoiceAttachment: attachmentUrl,
        });
        const invoice = await user_service_1.materialInvoiceService.createMaterialInvoice(data);
        return res.status(201).json({ success: true, message: "created invoice successfully", data: invoice });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Create Material Invoice", res);
    }
}
async function updateMaterialInvoice(req, res) {
    try {
        const { id } = req.params;
        const { invoiceAttachmentBase64, invoiceAttachmentName, invoiceAttachmentType, ...rest } = req.body;
        let attachmentUrl = rest.invoiceAttachment;
        if (invoiceAttachmentBase64) {
            attachmentUrl = await (0, storage_1.uploadInvoiceAttachmentFromBase64)(invoiceAttachmentBase64, invoiceAttachmentName ?? "invoice.pdf", invoiceAttachmentType ?? "application/pdf");
        }
        const normalizedPayload = normalizeMaterialInvoicePayload(rest);
        const data = zod_1.MaterialInvoiceSchema.parse({
            ...normalizedPayload,
            invoiceAttachment: attachmentUrl,
        });
        const invoice = await user_service_1.materialInvoiceService.updateMaterialInvoice(id, data);
        return res.status(200).json({ success: true, message: "updated invoice successfully", data: invoice });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Update Material Invoice", res);
    }
}
async function deleteMaterialInvoice(req, res) {
    try {
        const { id } = req.params;
        await user_service_1.materialInvoiceService.deleteMaterialInvoice(id);
        return res.status(200).json({ success: true, message: "Deleted successfully" });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Delete Material Invoice", res);
    }
}
async function getMaterialInvoice(req, res) {
    try {
        const { id } = req.params;
        const invoice = await user_service_1.materialInvoiceService.getMaterialInvoice(id);
        return res.status(200).json({ success: true, message: "get invoices successfull", data: invoice });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Get Material Invoice", res);
    }
}
async function listMaterialInvoices(req, res) {
    try {
        const invoices = await user_service_1.materialInvoiceService.listMaterialInvoices();
        return res.status(200).json({ success: true, message: "get invoices success", data: invoices });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "List Material Invoices", res);
    }
}
async function approveMaterialInvoice(req, res) {
    try {
        const { approved, id } = zod_1.ApproveMaterialInvoiceSchema.parse(req.body);
        const invoice = await user_service_1.materialInvoiceService.approveMaterialInvoice(id, approved);
        return res.status(200).json({ success: true, data: invoice });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Approve Material Invoice", res);
    }
}
async function approveInvoicePayment(req, res) {
    try {
        const { approved, id } = zod_1.ApproveMaterialInvoiceSchema.parse(req.body);
        const invoice = await user_service_1.materialInvoiceService.approvePayment(id, approved);
        return res.status(200).json({ success: true, data: invoice });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Approve Material Invoice", res);
    }
}
async function createMaterialDc(req, res) {
    try {
        const data = zod_1.DcEntrySchema.parse(req.body);
        const dc = await user_service_1.materialDcService.createMaterialDc(data);
        return res.status(201).json({ success: true, message: "created DC successfully", data: dc });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Create Material DC", res);
    }
}
async function getMaterialDc(req, res) {
    try {
        const { id } = req.params;
        const dc = await user_service_1.materialDcService.getMaterialDc(id);
        return res.status(200).json({ success: true, message: "get DC successfull", data: dc });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Get Material DC", res);
    }
}
async function listMaterialDcs(req, res) {
    try {
        const dcs = await user_service_1.materialDcService.listMaterialDcs();
        return res.status(200).json({ success: true, message: "get DCs success", data: dcs });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "List Material DCs", res);
    }
}
async function approveMaterialDc(req, res) {
    try {
        const { approved, id } = zod_1.ApproveDcEntrySchema.parse(req.body);
        const dc = await user_service_1.materialDcService.approveMaterialDc(id, approved);
        return res.status(200).json({ success: true, data: dc });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Approve Material DC", res);
    }
}
