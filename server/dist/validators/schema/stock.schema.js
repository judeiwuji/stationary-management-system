"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockUpdateSchema = exports.StockCreationSchema = void 0;
const yup_1 = require("yup");
exports.StockCreationSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
});
exports.StockUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    name: (0, yup_1.string)().optional(),
});
//# sourceMappingURL=stock.schema.js.map