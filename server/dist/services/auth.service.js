"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
const errors_1 = require("../utils/error/errors");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../utils/prisma");
async function loginService(email, password) {
    const user = await prisma_1.prisma.user.findFirst({
        where: { email, password }
    });
    if (!user) {
        throw new errors_1.AppError("User not found", 400);
    }
    return (0, jwt_1.generateJwt)({ id: user.id, email: user.email });
}
