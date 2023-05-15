import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedback } from '../model/feedback';
import { IAudit, IAuditActionRequest } from '../model/audit';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  api = `${environment.apiURL}/audits`;

  constructor(private http: HttpClient) {}

  getAudits(page: number, search = '', filters = '') {
    return this.http.get<IFeedback<IAudit>>(
      `${this.api}?page=${page}&search=${search}&filters=${filters}`
    );
  }

  createAudit(request: IAuditActionRequest) {
    return this.http.post<IFeedback<IAudit>>(`${this.api}`, request);
  }

  updateAudit(request: IAuditActionRequest) {
    return this.http.put<IFeedback<IAudit>>(`${this.api}`, request);
  }

  deleteAudit(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
