import { errorHandler } from "@/utils/error"
import {Request, Response} from "express"
import {
  MaterialInvoiceSchema,
  ApproveMaterialInvoiceSchema,
  DcEntrySchema,
  ApproveDcEntrySchema
} from "@/types/zod";
import { materialInvoiceService, materialDcService } from "@/services/user.service";

export async function createMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const data = MaterialInvoiceSchema.parse(req.body);
    const invoice = await materialInvoiceService.createMaterialInvoice(data);
    return res.status(201).json({ success: true, message: "created invoice successfully",  data: invoice });
  } catch (error) {
    return errorHandler(error, "Create Material Invoice", res);
  }
}

export async function updateMaterialInvoice(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const data = MaterialInvoiceSchema.parse(req.body);
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
    const { id } = req.params;
    const { approved } = ApproveMaterialInvoiceSchema.parse(req.body);
    const invoice = await materialInvoiceService.approveMaterialInvoice(id, approved);
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
    const { id } = req.params;
    const { approved } = ApproveDcEntrySchema.parse(req.body);
    const dc = await materialDcService.approveMaterialDc(id, approved);
    return res.status(200).json({ success: true, data: dc });
  } catch (error) {
    return errorHandler(error, "Approve Material DC", res);
  }
}