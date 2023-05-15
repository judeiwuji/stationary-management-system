import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IInbox } from '../model/inbox';
import { IFeedback } from '../model/feedback';

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  api = `${environment.apiURL}/inbox`;

  constructor(private http: HttpClient) {}

  getInboxes(page: number) {
    return this.http.get<IFeedback<IInbox>>(`${this.api}?page=${page}`);
  }

  getInbox(otherId: number) {
    return this.http.get<IFeedback<IInbox>>(`${this.api}/${otherId}`);
  }

  hasNewInboxMessages(timestamp: number) {
    return this.http.get<IFeedback<IInbox>>(`${this.api}/hasNewMessages`, {
      params: {
        timestamp,
      },
    });
  }
}
