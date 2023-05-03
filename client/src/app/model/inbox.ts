import { IMessage } from './message';
import { IUser } from './user';

export interface IInbox {
  id: number;
  userId: number;
  otherId: number;
  inboxId: number;
  messages: IMessage[];
  other: IUser;
}

export interface IInboxActionRequest {
  id?: number;
  userId?: number;
  otherId?: number;
  inboxId?: number;
}
