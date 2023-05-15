import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IComment, ICommentActionRequest } from '../model/comment';
import { IFeedback } from '../model/feedback';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  api = `${environment.apiURL}`;

  constructor(private http: HttpClient) {}

  getComments(requisitionId: number, page: number, search = '', filters = '') {
    return this.http.get<IFeedback<IComment>>(
      `${this.api}/requisitions/${requisitionId}/comments?page=${page}&search=${search}&filters=${filters}`
    );
  }

  createComment(request: ICommentActionRequest) {
    return this.http.post<IFeedback<IComment>>(
      `${this.api}/requisitions/${request.requisitionId}/comments`,
      request
    );
  }

  updateComment(request: ICommentActionRequest) {
    return this.http.put<IFeedback<IComment>>(
      `${this.api}/comments/${request.requisitionId}`,
      request
    );
  }

  deleteRecommendation(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/comments/${id}`);
  }
}
