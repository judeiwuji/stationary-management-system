"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = void 0;
const yup_1 = require("yup");
exports.AuthSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().email().required(),
    password: (0, yup_1.string)().required(),
});
//# sourceMappingURL=auth.schema.js.map