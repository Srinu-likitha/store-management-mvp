"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateInput;
function validateInput(schema) {
    return (req, res, next) => {
        const parsedInput = schema.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(400).json({
                message: 'Invalid Input',
                err: parsedInput.error.message,
            });
        }
        req.body = parsedInput.data;
        return next();
    };
}
