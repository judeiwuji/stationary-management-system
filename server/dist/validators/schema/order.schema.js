"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUpdateSchema = exports.OrderCreationSchema = exports.RequisitionItemOrderSchema = void 0;
const yup_1 = require("yup");
exports.RequisitionItemOrderSchema = (0, yup_1.object)({
    price: (0, yup_1.number)().positive().required(),
    quantity: (0, yup_1.number)().positive().integer().required(),
    stockId: (0, yup_1.number)().positive().integer().required(),
});
exports.OrderCreationSchema = (0, yup_1.object)({
    requisitionId: (0, yup_1.number)().positive().integer().required(),
    requisitionItems: (0, yup_1.array)().of(exports.RequisitionItemOrderSchema).required(),
});
exports.OrderUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.string)().optional(),
});
//# sourceMappingURL=order.schema.js.map