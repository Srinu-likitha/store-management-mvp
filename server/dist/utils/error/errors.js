"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 400, isOperational = true, logs) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.logs = logs;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
