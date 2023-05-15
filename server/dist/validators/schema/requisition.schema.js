"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequisitionUpdateSchema = exports.RequisitionCreationSchema = exports.RequisitionItemUpdateSchema = exports.RequisitionItemCreationSchema = void 0;
const yup_1 = require("yup");
const requisition_status_1 = require("../../models/requisition-status");
const role_1 = require("../../models/role");
exports.RequisitionItemCreationSchema = (0, yup_1.object)({
    price: (0, yup_1.number)().positive().required(),
    quantity: (0, yup_1.number)().positive().integer().required(),
    requisitionId: (0, yup_1.number)().positive().integer().optional(),
    stockId: (0, yup_1.number)().positive().integer().required(),
});
exports.RequisitionItemUpdateSchema = (0, yup_1.object)({
    price: (0, yup_1.number)().optional(),
    quantity: (0, yup_1.number)().positive().integer().optional(),
    requisitionId: (0, yup_1.number)().positive().integer().optional(),
    stockId: (0, yup_1.number)().positive().integer().optional(),
});
exports.RequisitionCreationSchema = (0, yup_1.object)({
    sourceId: (0, yup_1.number)().positive().integer().required(),
    through: (0, yup_1.mixed)().oneOf([role_1.Roles.BURSAR]).required(),
    destination: (0, yup_1.mixed)().oneOf([role_1.Roles.RECTOR]).required(),
    description: (0, yup_1.string)().required(),
    items: (0, yup_1.array)().of(exports.RequisitionItemCreationSchema).min(1),
});
exports.RequisitionUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.string)().required(),
    sourceId: (0, yup_1.number)().positive().integer().optional(),
    through: (0, yup_1.number)().positive().integer().optional(),
    destination: (0, yup_1.number)().positive().integer().optional(),
    description: (0, yup_1.string)().optional(),
    status: (0, yup_1.mixed)().oneOf(Object.values(requisition_status_1.RequisitionStatus)).optional(),
});
//# sourceMappingURL=requisition.schema.js.map