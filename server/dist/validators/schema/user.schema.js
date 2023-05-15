"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateSchema = exports.UserCreationSchema = void 0;
const yup_1 = require("yup");
const role_1 = require("../../models/role");
exports.UserCreationSchema = (0, yup_1.object)({
    firstname: (0, yup_1.string)().required(),
    lastname: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().email("must be a valid email").required(),
    password: (0, yup_1.string)()
        .required()
        .matches(/^[A-Za-z0-9@#$%^&*()!_+=]{6,}$/),
    role: (0, yup_1.mixed)().oneOf(Object.values(role_1.Roles)).defined(),
});
exports.UserUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    firstname: (0, yup_1.string)().optional(),
    lastname: (0, yup_1.string)().optional(),
    email: (0, yup_1.string)().email("must be a valid email").optional(),
    role: (0, yup_1.mixed)().oneOf(Object.values(role_1.Roles)).optional(),
});
//# sourceMappingURL=user.schema.js.map