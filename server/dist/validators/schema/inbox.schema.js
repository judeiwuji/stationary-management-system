"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUpdateSchema = exports.MessageCreationSchema = exports.InboxSchema = void 0;
const yup_1 = require("yup");
const message_status_1 = require("../../models/message_status");
exports.InboxSchema = (0, yup_1.object)({
    otherId: (0, yup_1.number)().positive().integer().required(),
});
exports.MessageCreationSchema = (0, yup_1.object)({
    content: (0, yup_1.string)().required(),
});
exports.MessageUpdateSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().positive().integer().required(),
    status: (0, yup_1.mixed)().oneOf(Object.values(message_status_1.MessageStatus)).defined(),
});
//# sourceMappingURL=inbox.schema.js.map