import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedback } from '../model/feedback';
import {
  IRecommendation,
  IRecommendationActionRequest,
} from '../model/recommendation';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  api = `${environment.apiURL}/recommendations`;

  constructor(private http: HttpClient) {}

  getRecommendations(page: number, filters = '') {
    return this.http.get<IFeedback<IRecommendation>>(
      `${this.api}?page=${page}&filters=${filters}`
    );
  }

  createRecommendation(request: IRecommendationActionRequest) {
    return this.http.post<IFeedback<IRecommendation>>(`${this.api}`, request);
  }

  updateRecommendation(request: IRecommendationActionRequest) {
    return this.http.put<IFeedback<IRecommendation>>(`${this.api}`, request);
  }

  deleteRecommendation(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
