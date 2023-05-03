import { IInbox } from './inbox';
import { IUser } from './user';

export interface IMessage {
  id: number;
  inboxId: number;
  userId: number;
  content: string;
  status: number;
  user: IUser;
  inbox?: IInbox;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageActionRequest {
  id?: number;
  inboxId?: number;
  userId?: number;
  content?: string;
  status?: number;
}
