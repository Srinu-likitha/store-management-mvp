"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialDcService = exports.materialInvoiceService = exports.userService = void 0;
const errors_1 = require("../utils/error/errors");
const prisma_1 = require("../utils/prisma");
const DOCUMENT_NUMBER_PAD_LENGTH = 5;
async function getNextDocumentNumber(field, prefix) {
    const lastInvoice = await prisma_1.prisma.materialInvoice.findFirst({
        orderBy: { createdAt: "desc" },
    });
    const lastValue = lastInvoice?.[field];
    const lastNumeric = lastValue ? Number(lastValue.replace(/[^0-9]/g, "")) : 0;
    const nextNumeric = (Number.isNaN(lastNumeric) ? 0 : lastNumeric) + 1;
    const padded = nextNumeric.toString().padStart(DOCUMENT_NUMBER_PAD_LENGTH, "0");
    return `${prefix}-${padded}`;
}
function mapInvoiceItems(items) {
    return items.map((item) => {
        const quantity = Number(item.quantity);
        const ratePerUnit = Number(item.ratePerUnit);
        return {
            ...item,
            quantity,
            ratePerUnit,
            cost: quantity * ratePerUnit,
        };
    });
}
function calculateTotalCost(items, cgst, sgst, transportationCharges) {
    const materialCost = items.reduce((sum, item) => sum + item.cost, 0);
    return materialCost + Number(cgst || 0) + Number(sgst || 0) + Number(transportationCharges || 0);
}
exports.userService = {
    getUserById: async (id) => {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new errors_1.AppError("User not found", 404);
        }
        return user;
    },
};
exports.materialInvoiceService = {
    async createMaterialInvoice(data) {
        const items = mapInvoiceItems(data.InvoiceMaterialItem);
        const totalCost = calculateTotalCost(items, data.cgst, data.sgst, data.transportationCharges);
        const serialNumber = await getNextDocumentNumber("serialNumber", "INV");
        const mrnNumber = await getNextDocumentNumber("mrnNumber", "MRN");
        const ginNumber = await getNextDocumentNumber("ginNumber", "GIN");
        return prisma_1.prisma.materialInvoice.create({
            data: {
                serialNumber,
                dateOfReceipt: new Date(data.dateOfReceipt),
                vendorName: data.vendorName,
                invoiceNumber: data.invoiceNumber,
                invoiceDate: new Date(data.invoiceDate),
                deliveryChallanNumber: data.deliveryChallanNumber,
                vehicleNumber: data.vehicleNumber,
                materialCategory: data.materialCategory,
                hnsCode: data.hnsCode,
                uom: data.uom,
                vendorContactNumber: data.vendorContactNumber,
                poNumber: data.poNumber,
                poDate: new Date(data.poDate),
                purposeOfMaterial: data.purposeOfMaterial,
                invoiceAttachment: data.invoiceAttachment ?? "",
                mrnNumber,
                ginNumber,
                cgst: Number(data.cgst),
                sgst: Number(data.sgst),
                transportationCharges: Number(data.transportationCharges),
                totalCost,
                remarks: data.remarks,
                InvoiceMaterialItem: {
                    create: items.map((item) => ({ ...item }))
                }
            },
            include: { InvoiceMaterialItem: true }
        });
    },
    async updateMaterialInvoice(id, data) {
        const materialInvoiceCheck = await prisma_1.prisma.materialInvoice.findUnique({ where: { id } });
        if (!materialInvoiceCheck || materialInvoiceCheck.approved) {
            throw new errors_1.AppError("Material Invoice not found or Approved", 404);
        }
        const items = mapInvoiceItems(data.InvoiceMaterialItem);
        const totalCost = calculateTotalCost(items, data.cgst, data.sgst, data.transportationCharges);
        const serialNumber = materialInvoiceCheck.serialNumber;
        const mrnNumber = materialInvoiceCheck.mrnNumber;
        const ginNumber = materialInvoiceCheck.ginNumber;
        await prisma_1.prisma.invoiceMaterialItem.deleteMany({ where: { materialInvoiceId: id } });
        return prisma_1.prisma.materialInvoice.update({
            where: { id },
            data: {
                serialNumber,
                dateOfReceipt: new Date(data.dateOfReceipt),
                vendorName: data.vendorName,
                invoiceNumber: data.invoiceNumber,
                invoiceDate: new Date(data.invoiceDate),
                deliveryChallanNumber: data.deliveryChallanNumber,
                vehicleNumber: data.vehicleNumber,
                materialCategory: data.materialCategory,
                hnsCode: data.hnsCode,
                uom: data.uom,
                vendorContactNumber: data.vendorContactNumber,
                poNumber: data.poNumber,
                poDate: new Date(data.poDate),
                purposeOfMaterial: data.purposeOfMaterial,
                invoiceAttachment: data.invoiceAttachment ?? materialInvoiceCheck.invoiceAttachment,
                mrnNumber,
                ginNumber,
                cgst: Number(data.cgst),
                sgst: Number(data.sgst),
                transportationCharges: Number(data.transportationCharges),
                totalCost,
                remarks: data.remarks,
                InvoiceMaterialItem: {
                    create: items.map((item) => ({ ...item }))
                }
            },
            include: { InvoiceMaterialItem: true }
        });
    },
    async deleteMaterialInvoice(id) {
        const materialInvoiceCheck = await prisma_1.prisma.materialInvoice.findUnique({ where: { id } });
        if (!materialInvoiceCheck || materialInvoiceCheck.approved) {
            throw new errors_1.AppError("Material Invoice not found or Approved", 404);
        }
        await prisma_1.prisma.materialInvoice.delete({ where: { id } });
    },
    async getMaterialInvoice(id) {
        return prisma_1.prisma.materialInvoice.findUnique({
            where: { id },
            include: { InvoiceMaterialItem: true }
        });
    },
    async listMaterialInvoices() {
        return prisma_1.prisma.materialInvoice.findMany({
            include: { InvoiceMaterialItem: true }
        });
    },
    async approveMaterialInvoice(id, approved) {
        return prisma_1.prisma.materialInvoice.update({
            where: { id },
            data: { approved },
            include: { InvoiceMaterialItem: true }
        });
    },
    async approvePayment(id, approved) {
        return prisma_1.prisma.materialInvoice.update({
            where: { id },
            data: { paid: approved },
            include: { InvoiceMaterialItem: true }
        });
    }
};
exports.materialDcService = {
    async createMaterialDc(data) {
        return prisma_1.prisma.dcEntry.create({
            data: {
                ...data,
                dateOfReceipt: new Date(data.dateOfReceipt),
                receivedQuantity: Number(data.receivedQuantity),
                approved: data.approved ?? false,
            },
        });
    },
    async getMaterialDc(id) {
        return prisma_1.prisma.dcEntry.findUnique({
            where: { id },
        });
    },
    async listMaterialDcs() {
        return prisma_1.prisma.dcEntry.findMany();
    },
    async approveMaterialDc(id, approved) {
        return prisma_1.prisma.dcEntry.update({
            where: { id },
            data: { approved },
        });
    },
};
