"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadInvoiceAttachmentFromBase64 = uploadInvoiceAttachmentFromBase64;
const crypto_1 = __importDefault(require("crypto"));
const _config_1 = require("../config/index");
const errors_1 = require("../utils/error/errors");
const STORAGE_PATH = "material-invoices";
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.\-]/g, "_");
}
async function uploadInvoiceAttachmentFromBase64(base64, originalName, mimeType) {
    if (!base64) {
        throw new errors_1.AppError("Invoice attachment is required", 400);
    }
    if (mimeType !== "application/pdf") {
        throw new errors_1.AppError("Only PDF invoice attachments are allowed", 400);
    }
    const buffer = Buffer.from(base64, "base64");
    const safeName = sanitizeFileName(originalName || "invoice.pdf");
    const uniqueName = `${Date.now()}-${crypto_1.default.randomUUID()}-${safeName}`;
    const objectPath = `${STORAGE_PATH}/${uniqueName}`;
    const uploadUrl = `${_config_1.config.supabase.url}/storage/v1/object/${encodeURIComponent(_config_1.config.supabase.bucket)}/${objectPath}`;
    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${_config_1.config.supabase.serviceRoleKey}`,
            "Content-Type": mimeType,
            "x-upsert": "true",
        },
        body: buffer,
    });
    if (!response.ok) {
        const message = await response.text();
        throw new errors_1.AppError(`Failed to upload invoice attachment: ${response.status} ${message}`, response.status);
    }
    return `${_config_1.config.supabase.url}/storage/v1/object/public/${_config_1.config.supabase.bucket}/${objectPath}`;
}
