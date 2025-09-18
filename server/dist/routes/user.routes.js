"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const zod_1 = require("../types/zod");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Material Invoice Routes
router.post("/create/material-invoice", (0, auth_middleware_1.verifyUser)("STORE_INCHARGE"), user_controller_1.createMaterialInvoice);
router.post("/update/material-invoice/:id", (0, auth_middleware_1.verifyUser)("STORE_INCHARGE"), user_controller_1.updateMaterialInvoice);
router.delete("/delete/material-invoice/:id", user_controller_1.deleteMaterialInvoice);
router.get("/get/material-invoice/:id", user_controller_1.getMaterialInvoice);
router.get("/list/material-invoices", user_controller_1.listMaterialInvoices);
router.post("/approve/material-invoice", (0, validate_middleware_1.default)(zod_1.ApproveMaterialInvoiceSchema), (0, auth_middleware_1.verifyUser)("PROCUREMENT_MANAGER"), user_controller_1.approveMaterialInvoice);
router.post("/approve/invoice-payment", (0, validate_middleware_1.default)(zod_1.ApproveMaterialInvoiceSchema), (0, auth_middleware_1.verifyUser)("ACCOUNTS_MANAGER"), user_controller_1.approveInvoicePayment);
// Material DC Routes
router.post("/create/dc-entry", (0, validate_middleware_1.default)(zod_1.DcEntrySchema), (0, auth_middleware_1.verifyUser)("STORE_INCHARGE"), user_controller_1.createMaterialDc);
router.get("/list/dc-entries", user_controller_1.listMaterialDcs);
router.post("/approve/dc-entry", (0, validate_middleware_1.default)(zod_1.ApproveDcEntrySchema), (0, auth_middleware_1.verifyUser)("PROCUREMENT_MANAGER"), user_controller_1.approveMaterialDc);
exports.default = router;
