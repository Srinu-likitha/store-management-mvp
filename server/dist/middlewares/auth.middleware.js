"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const validateJWT = (token) => {
    if (!token) {
        return { success: false, message: 'Auth Token Not Provided' };
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.auth.jwtSecret);
        return { success: true, payload };
    }
    catch (ex) {
        return { success: false, message: 'Invalid or expired token' };
    }
};
const verifyUser = (role) => {
    return async (req, res, next) => {
        // let token = req.cookies.token;
        let token = '';
        // if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // }
        const payloadObj = validateJWT(token);
        if (!payloadObj.success) {
            return res.status(401).json({ success: false, message: payloadObj.message });
        }
        if (!payloadObj.payload) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
        const userId = payloadObj.payload.id;
        req.user = payloadObj.payload;
        // Role checks 
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        let hasRole = false;
        switch (role) {
            case "ADMIN":
                hasRole = user.role === "ADMIN";
                break;
            case "STORE_INCHARGE":
                hasRole = user.role === "STORE_INCHARGE";
                break;
            case "PROCUREMENT_MANAGER":
                hasRole = user.role === "PROCUREMENT_MANAGER";
                break;
            case "ACCOUNTS_MANAGER":
                hasRole = user.role === "ACCOUNTS_MANAGER";
                break;
            case "ALL":
                hasRole = true;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }
        if (!hasRole) {
            console.log(role, hasRole);
            return res.status(403).json({ success: false, message: 'User Verification Failed' });
        }
        return next();
    };
};
exports.verifyUser = verifyUser;
