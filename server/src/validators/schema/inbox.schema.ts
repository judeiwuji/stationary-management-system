import { mixed, number, object, string } from "yup";
import { MessageStatus } from "../../models/message_status";

export const InboxSchema = object({
  otherId: number().positive().integer().required(),
});

export const MessageCreationSchema = object({
  content: string().required(),
});

export const MessageUpdateSchema = object({
  id: number().positive().integer().required(),
  status: mixed().oneOf(Object.values(MessageStatus)).defined(),
});
