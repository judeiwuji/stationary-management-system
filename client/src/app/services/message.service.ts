import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedback } from '../model/feedback';
import { IMessage, IMessageActionRequest } from '../model/message';
import { IInboxActionRequest } from '../model/inbox';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  api = `${environment.apiURL}`;

  constructor(private http: HttpClient) {}

  getMessages(page: number, inboxId: number) {
    return this.http.get<IFeedback<IMessage>>(
      `${this.api}/inbox/${inboxId}/messages?page=${page}`
    );
  }

  createMessage(
    request: IMessageActionRequest & IInboxActionRequest,
    inboxId: number
  ) {
    return this.http.post<IFeedback<IMessage>>(
      `${this.api}/inbox/${inboxId}/messages`,
      request
    );
  }

  unReadMessageCount() {
    return this.http.get<IFeedback<number>>(
      `${this.api}/messages/count/unread`
    );
  }
}
