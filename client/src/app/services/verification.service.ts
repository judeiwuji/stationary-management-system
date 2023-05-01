import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IFeedback } from '../model/feedback';
import {
  IVerification,
  IVerificationActionRequest,
} from '../model/verification';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  api = `${environment.apiURL}/verifications`;

  constructor(private http: HttpClient) {}

  getVerifications(page: number, search = '', filters = '') {
    return this.http.get<IFeedback<IVerification>>(
      `${this.api}?page=${page}&search=${search}&filters=${filters}`
    );
  }

  createVerification(request: IVerificationActionRequest) {
    return this.http.post<IFeedback<IVerification>>(`${this.api}`, request);
  }

  deleteVerification(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
