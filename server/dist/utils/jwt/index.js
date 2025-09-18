"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwt = (payload, options = { expiresIn: '200h' }) => {
    return jsonwebtoken_1.default.sign(payload, config_1.config.auth.jwtSecret, options);
};
exports.generateJwt = generateJwt;
