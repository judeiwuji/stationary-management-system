"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentUpdateSchema = exports.CommentCreationSchema = void 0;
const yup_1 = require("yup");
exports.CommentCreationSchema = (0, yup_1.object)({
    content: (0, yup_1.string)().required(),
});
exports.CommentUpdateSchema = (0, yup_1.object)({
    content: (0, yup_1.string)().optional(),
    id: (0, yup_1.string)().required(),
});
//# sourceMappingURL=comment.schema.js.map