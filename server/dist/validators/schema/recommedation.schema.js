"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationUpdateSchema = exports.RecommendationCreationSchema = void 0;
const yup_1 = require("yup");
const requisition_status_1 = require("../../models/requisition-status");
exports.RecommendationCreationSchema = (0, yup_1.object)({
    requisitionId: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.RECOMMENDED])
        .required(),
});
exports.RecommendationUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)()
        .oneOf([requisition_status_1.RequisitionStatus.CANCELED, requisition_status_1.RequisitionStatus.RECOMMENDED])
        .optional(),
});
//# sourceMappingURL=recommedation.schema.js.map