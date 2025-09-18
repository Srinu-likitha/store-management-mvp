"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.userErrorHandler = userErrorHandler;
function errorHandler(err, log, res) {
    console.log(log, err);
    return res.status(500).json({ message: "Internal server error" });
}
function userErrorHandler(res) {
    return res.status(401).json({ message: "Unauthorized User Id not found" });
}
