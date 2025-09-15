import { AppError } from "@/utils/error/errors";
import { prisma } from "@/utils/prisma";
import { MaterialInvoiceInput } from "@/types/zod";

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
    return prisma.materialInvoice.create({
      data: {
        ...data,
        dateOfReceipt: new Date(data.dateOfReceipt),
        invoiceDate: new Date(data.invoiceDate),
        poDate: new Date(data.poDate),
        InvoiceMaterialItem: {
          create: data.InvoiceMaterialItem.map((item) => ({ ...item }))
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
    await prisma.invoiceMaterialItem.deleteMany({ where: { materialInvoiceId: id } });
    return prisma.materialInvoice.update({
      where: { id },
      data: {
        ...data,
        dateOfReceipt: new Date(data.dateOfReceipt),
        invoiceDate: new Date(data.invoiceDate),
        poDate: new Date(data.poDate),
        InvoiceMaterialItem: {
          create: data.InvoiceMaterialItem.map((item) => ({ ...item }))
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
  }
};