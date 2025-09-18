"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("./errors");
function errorHandler(err, context, res) {
    console.error(`[${context}]`, err);
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            logs: err.logs || []
        });
    }
    // fallback for unexpected errors
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
