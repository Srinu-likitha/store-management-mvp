"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: "30mb" }));
exports.app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
exports.app.use("/api/v1/auth", auth_routes_1.default);
exports.app.use("/api/v1/user", user_routes_1.default);
exports.app.get("/", (req, res) => {
    res.send("API is running...");
});
