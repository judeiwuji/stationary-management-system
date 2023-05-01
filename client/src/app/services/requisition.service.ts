import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IFeedback } from '../model/feedback';
import {
  IRequisition,
  IRequisitionActionRequest,
  IRequisitionItem,
} from '../model/requisition';

@Injectable({
  providedIn: 'root',
})
export class RequisitionService {
  api = `${environment.apiURL}/requisitions`;

  constructor(private http: HttpClient) {}

  getRequisitions(page: number, search = '', filters: any) {
    return this.http.get<IFeedback<IRequisition>>(
      `${this.api}?page=${page}&search=${search}&filters=${filters}`
    );
  }

  getRequisition(id: number) {
    return this.http.get<IFeedback<IRequisition>>(`${this.api}/${id}`);
  }

  createRequisition(requisition: IRequisition) {
    return this.http.post<IFeedback<IRequisition>>(`${this.api}`, requisition);
  }

  updateRequisition(request: IRequisitionActionRequest) {
    return this.http.put<IFeedback<IRequisition>>(`${this.api}`, request);
  }

  deleteRequisition(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }

  addRequisitionItem(item: IRequisitionItem) {
    return this.http.post<IFeedback<IRequisitionItem>>(
      `${this.api}/items`,
      item
    );
  }

  deleteRequisitionItem(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/items/${id}`);
  }
}