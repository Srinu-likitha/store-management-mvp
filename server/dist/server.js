"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const _config_1 = require("./config/index");
app_1.app.listen(_config_1.config.app.port, () => {
    console.log("server is running on port 3000");
});
