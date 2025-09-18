import { AppError } from "@/utils/error/errors";
import { prisma } from "@/utils/prisma";
import { MaterialInvoiceInput, DcEntryInput } from "@/types/zod";

const DOCUMENT_NUMBER_PAD_LENGTH = 5;

async function getNextDocumentNumber(field: "serialNumber" | "mrnNumber" | "ginNumber", prefix: string) {
  const lastInvoice = await prisma.materialInvoice.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const lastValue = lastInvoice?.[field];
  const lastNumeric = lastValue ? Number(lastValue.replace(/[^0-9]/g, "")) : 0;
  const nextNumeric = (Number.isNaN(lastNumeric) ? 0 : lastNumeric) + 1;
  const padded = nextNumeric.toString().padStart(DOCUMENT_NUMBER_PAD_LENGTH, "0");

  return `${prefix}-${padded}`;
}

function mapInvoiceItems(items: MaterialInvoiceInput["InvoiceMaterialItem"]) {
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

function calculateTotalCost(
  items: ReturnType<typeof mapInvoiceItems>,
  cgst: number,
  sgst: number,
  transportationCharges: number,
) {
  const materialCost = items.reduce((sum, item) => sum + item.cost, 0);
  return materialCost + Number(cgst || 0) + Number(sgst || 0) + Number(transportationCharges || 0);
}

export const userService = {
  getUserById: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
};

export const materialInvoiceService = {
  async createMaterialInvoice(data: MaterialInvoiceInput) {
    const items = mapInvoiceItems(data.InvoiceMaterialItem);
    const totalCost = calculateTotalCost(items, data.cgst, data.sgst, data.transportationCharges);
    const serialNumber = await getNextDocumentNumber("serialNumber", "INV");
    const mrnNumber = await getNextDocumentNumber("mrnNumber", "MRN");
    const ginNumber = await getNextDocumentNumber("ginNumber", "GIN");

    return prisma.materialInvoice.create({
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
  async updateMaterialInvoice(id: string, data: MaterialInvoiceInput) {
    const materialInvoiceCheck = await prisma.materialInvoice.findUnique({ where: { id } });
    if (!materialInvoiceCheck || materialInvoiceCheck.approved) {
      throw new AppError("Material Invoice not found or Approved", 404);
    }
    const items = mapInvoiceItems(data.InvoiceMaterialItem);
    const totalCost = calculateTotalCost(items, data.cgst, data.sgst, data.transportationCharges);
    const serialNumber = materialInvoiceCheck.serialNumber;
    const mrnNumber = materialInvoiceCheck.mrnNumber;
    const ginNumber = materialInvoiceCheck.ginNumber;
    await prisma.invoiceMaterialItem.deleteMany({ where: { materialInvoiceId: id } });
    return prisma.materialInvoice.update({
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
  async deleteMaterialInvoice(id: string) {
    const materialInvoiceCheck = await prisma.materialInvoice.findUnique({ where: { id } });
    if (!materialInvoiceCheck || materialInvoiceCheck.approved) {
      throw new AppError("Material Invoice not found or Approved", 404);
    }
    await prisma.materialInvoice.delete({ where: { id } });
  },
  async getMaterialInvoice(id: string) {
    return prisma.materialInvoice.findUnique({
      where: { id },
      include: { InvoiceMaterialItem: true }
    });
  },
  async listMaterialInvoices() {
    return prisma.materialInvoice.findMany({
      include: { InvoiceMaterialItem: true }
    });
  },
  async approveMaterialInvoice(id: string, approved: boolean) {
    return prisma.materialInvoice.update({
      where: { id },
      data: { approved },
      include: { InvoiceMaterialItem: true }
    });
  },
  async approvePayment(id: string, approved: boolean) {
    return prisma.materialInvoice.update({
      where: { id },
      data: { paid: approved },
      include: { InvoiceMaterialItem: true }
    });
  }
};

export const materialDcService = {
  async createMaterialDc(data: DcEntryInput) {
    return prisma.dcEntry.create({
      data: {
        ...data,
        dateOfReceipt: new Date(data.dateOfReceipt),
        receivedQuantity: Number(data.receivedQuantity),
        approved: data.approved ?? false,
      },
    });
  },
  async getMaterialDc(id: string) {
    return prisma.dcEntry.findUnique({
      where: { id },
    });
  },
  async listMaterialDcs() {
    return prisma.dcEntry.findMany();
  },
  async approveMaterialDc(id: string, approved: boolean) {
    return prisma.dcEntry.update({
      where: { id },
      data: { approved },
    });
  },
};