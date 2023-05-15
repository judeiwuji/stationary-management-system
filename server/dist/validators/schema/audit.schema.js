"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditUpdateSchema = exports.AuditCreationSchema = void 0;
const yup_1 = require("yup");
const requisition_status_1 = require("../../models/requisition-status");
exports.AuditCreationSchema = (0, yup_1.object)({
    recommendationId: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.VERIFIED])
        .required(),
});
exports.AuditUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.VERIFIED])
        .required(),
});
//# sourceMappingURL=audit.schema.js.map