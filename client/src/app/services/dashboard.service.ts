import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IFeedback } from '../model/feedback';
import { IDashboardAnalytics } from '../model/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  api = `${environment.apiURL}/dashboard`;

  constructor(private http: HttpClient) {}

  getAnalytics() {
    return this.http.get<IFeedback<IDashboardAnalytics>>(
      `${this.api}/analytics`
    );
  }
}
