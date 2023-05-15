"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartUpdateSchema = exports.CartCreationSchema = void 0;
const yup_1 = require("yup");
exports.CartCreationSchema = (0, yup_1.object)({
    stockId: (0, yup_1.number)().positive().integer().required(),
    quantity: (0, yup_1.number)().positive().integer().required(),
});
exports.CartUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    quantity: (0, yup_1.number)().positive().integer().optional(),
});
//# sourceMappingURL=cart.schema.js.map