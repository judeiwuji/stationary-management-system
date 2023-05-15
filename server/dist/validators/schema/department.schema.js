"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentUpdateSchema = exports.DepartmentCreationSchema = void 0;
const yup_1 = require("yup");
exports.DepartmentCreationSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
});
exports.DepartmentUpdateSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    id: (0, yup_1.string)().required(),
});
//# sourceMappingURL=department.schema.js.map