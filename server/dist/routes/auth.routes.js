"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.loginController);
router.get("/me", (0, auth_middleware_1.verifyUser)("ALL"), auth_controller_1.me);
exports.default = router;
