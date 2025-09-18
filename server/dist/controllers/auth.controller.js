"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.me = me;
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const zod_1 = require("../types/zod");
const error_1 = require("../utils/error");
async function loginController(req, res) {
    try {
        const { email, password } = zod_1.LoginRequest.parse(req.body);
        const token = await (0, auth_service_1.loginService)(email, password);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token }
        });
    }
    catch (err) {
        return (0, error_1.errorHandler)(err, "Error in loginController", res);
    }
}
async function me(req, res) {
    try {
        const user = await user_service_1.userService.getUserById(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });
    }
    catch (error) {
        return (0, error_1.errorHandler)(error, "Error in me controller", res);
    }
}
