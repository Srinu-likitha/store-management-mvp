import { errorHandler } from "@/utils/error";
import { AppError } from "@/utils/error/errors";
import { uploadInvoiceAttachmentFromBase64 } from "@/utils/storage";
import { Request, Response } from "express";
import {
  MaterialInvoiceSchema,
  ApproveMaterialInvoiceSchema,
  DcEntrySchema,
  ApproveDcEntrySchema
} from "@/types/zod";
import { materialInvoiceService, materialDcService } from "@/services/user.service";

type MaterialInvoiceRequestBody = Record<string, any> & {
  InvoiceMaterialItem?: Array<Record<string, any>>;
  invoiceAttachment?: string;
  invoiceAttachmentBase64?: string;
  invoiceAttachmentName?: string;
  invoiceAttachmentType?: string;
};

function normalizeMaterialInvoicePayload(body: MaterialInvoiceRequestBody) {
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

export async function createMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const {
      invoiceAttachmentBase64,
      invoiceAttachmentName,
      invoiceAttachmentType,
      ...rest
    } = req.body as MaterialInvoiceRequestBody;

    if (!invoiceAttachmentBase64 || !invoiceAttachmentName) {
      throw new AppError("Invoice attachment is required", 400);
    }

    const attachmentUrl = await uploadInvoiceAttachmentFromBase64(
      invoiceAttachmentBase64,
      invoiceAttachmentName,
      invoiceAttachmentType ?? "application/pdf",
    );

    const normalizedPayload = normalizeMaterialInvoicePayload(rest);
    const data = MaterialInvoiceSchema.parse({
      ...normalizedPayload,
      invoiceAttachment: attachmentUrl,
    });

    const invoice = await materialInvoiceService.createMaterialInvoice(data);
    return res.status(201).json({ success: true, message: "created invoice successfully",  data: invoice });
  } catch (error) {
    return errorHandler(error, "Create Material Invoice", res);
  }
}

export async function updateMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const {
      invoiceAttachmentBase64,
      invoiceAttachmentName,
      invoiceAttachmentType,
      ...rest
    } = req.body as MaterialInvoiceRequestBody;

    let attachmentUrl = rest.invoiceAttachment as string | undefined;
    if (invoiceAttachmentBase64) {
      attachmentUrl = await uploadInvoiceAttachmentFromBase64(
        invoiceAttachmentBase64,
        invoiceAttachmentName ?? "invoice.pdf",
        invoiceAttachmentType ?? "application/pdf",
      );
    }

    const normalizedPayload = normalizeMaterialInvoicePayload(rest);
    const data = MaterialInvoiceSchema.parse({
      ...normalizedPayload,
      invoiceAttachment: attachmentUrl,
    });

    const invoice = await materialInvoiceService.updateMaterialInvoice(id, data);
    return res.status(200).json({ success: true, message: "updated invoice successfully", data: invoice });
  } catch (error) {
    return errorHandler(error, "Update Material Invoice", res);
  }
}

export async function deleteMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    await materialInvoiceService.deleteMaterialInvoice(id);
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return errorHandler(error, "Delete Material Invoice", res);
  }
}

export async function getMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const invoice = await materialInvoiceService.getMaterialInvoice(id);
    return res.status(200).json({ success: true, message: "get invoices successfull", data: invoice });
  } catch (error) {
    return errorHandler(error, "Get Material Invoice", res);
  }
}

export async function listMaterialInvoices(req: Request, res: Response): Promise<Response> {
  try {
    const invoices = await materialInvoiceService.listMaterialInvoices();
    return res.status(200).json({ success: true, message: "get invoices success"  ,data: invoices });
  } catch (error) {
    return errorHandler(error, "List Material Invoices", res);
  }
}

export async function approveMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const { approved, id } = ApproveMaterialInvoiceSchema.parse(req.body);
    const invoice = await materialInvoiceService.approveMaterialInvoice(id, approved);
    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    return errorHandler(error, "Approve Material Invoice", res);
  }
}

export async function approveInvoicePayment(req: Request, res: Response): Promise<Response> {
  try {
    const { approved, id } = ApproveMaterialInvoiceSchema.parse(req.body);
    const invoice = await materialInvoiceService.approvePayment(id, approved);
    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    return errorHandler(error, "Approve Material Invoice", res);
  }
}

export async function createMaterialDc(req: Request, res: Response): Promise<Response> {
  try {
    const data = DcEntrySchema.parse(req.body);
    const dc = await materialDcService.createMaterialDc(data);
    return res.status(201).json({ success: true, message: "created DC successfully", data: dc });
  } catch (error) {
    return errorHandler(error, "Create Material DC", res);
  }
}

export async function getMaterialDc(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const dc = await materialDcService.getMaterialDc(id);
    return res.status(200).json({ success: true, message: "get DC successfull", data: dc });
  } catch (error) {
    return errorHandler(error, "Get Material DC", res);
  }
}

export async function listMaterialDcs(req: Request, res: Response): Promise<Response> {
  try {
    const dcs = await materialDcService.listMaterialDcs();
    return res.status(200).json({ success: true, message: "get DCs success", data: dcs });
  } catch (error) {
    return errorHandler(error, "List Material DCs", res);
  }
}

export async function approveMaterialDc(req: Request, res: Response): Promise<Response> {
  try {
    const { approved, id } = ApproveDcEntrySchema.parse(req.body);
    const dc = await materialDcService.approveMaterialDc(id, approved);
    return res.status(200).json({ success: true, data: dc });
  } catch (error) {
    return errorHandler(error, "Approve Material DC", res);
  }
}