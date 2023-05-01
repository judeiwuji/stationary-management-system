import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IReceipt, IReceiptActionRequest } from '../model/purchase';
import { IFeedback } from '../model/feedback';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  api = `${environment.apiURL}/receipts`;

  constructor(private http: HttpClient) {}

  getHistory(page: number, search = '', filters = '') {
    return this.http.get<IFeedback<IReceipt>>(
      `${this.api}?page=${page}&search=${search}&filters=${filters}`
    );
  }

  createReceipt(data: FormData) {
    return this.http.post<IFeedback<IReceipt>>(`${this.api}`, data);
  }

  updateReceipt(request: IReceiptActionRequest) {
    return this.http.put<IFeedback<IReceipt>>(`${this.api}`, request);
  }

  deleteReceipt(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
