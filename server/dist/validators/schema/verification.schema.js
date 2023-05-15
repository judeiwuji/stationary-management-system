"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationUpdateSchema = exports.VerificationCreationSchema = void 0;
const yup_1 = require("yup");
const requisition_status_1 = require("../../models/requisition-status");
exports.VerificationCreationSchema = (0, yup_1.object)({
    auditId: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.APPROVED])
        .required(),
});
exports.VerificationUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.APPROVED])
        .optional(),
});
//# sourceMappingURL=verification.schema.js.map