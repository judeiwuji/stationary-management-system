"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptCreationSchema = void 0;
const yup_1 = require("yup");
exports.ReceiptCreationSchema = (0, yup_1.object)({
    requisitionItemId: (0, yup_1.number)().required(),
});
//# sourceMappingURL=receipt.schema.js.map