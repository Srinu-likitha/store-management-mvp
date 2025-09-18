import crypto from "crypto";
import { config } from "@config";
import { AppError } from "@/utils/error/errors";

const STORAGE_PATH = "material-invoices";

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-]/g, "_");
}

export async function uploadInvoiceAttachmentFromBase64(
  base64: string,
  originalName: string,
  mimeType: string,
): Promise<string> {
  if (!base64) {
    throw new AppError("Invoice attachment is required", 400);
  }

  if (mimeType !== "application/pdf") {
    throw new AppError("Only PDF invoice attachments are allowed", 400);
  }

  const buffer = Buffer.from(base64, "base64");
  const safeName = sanitizeFileName(originalName || "invoice.pdf");
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const objectPath = `${STORAGE_PATH}/${uniqueName}`;
  const uploadUrl = `${config.supabase.url}/storage/v1/object/${encodeURIComponent(config.supabase.bucket)}/${objectPath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.supabase.serviceRoleKey}`,
      "Content-Type": mimeType,
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new AppError(`Failed to upload invoice attachment: ${response.status} ${message}`, response.status);
  }

  return `${config.supabase.url}/storage/v1/object/public/${config.supabase.bucket}/${objectPath}`;
}
