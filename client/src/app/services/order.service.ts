import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IFeedback } from '../model/feedback';
import { IOrder, IOrderActionRequest } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  api = `${environment.apiURL}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(page: number, search = '', filters = '') {
    return this.http.get<IFeedback<IOrder>>(
      `${this.api}?page=${page}&search=${search}&filters=${filters}`
    );
  }

  getOrder(id: number) {
    return this.http.get<IFeedback<IOrder>>(`${this.api}/${id}`);
  }

  createOrder(request: IOrderActionRequest) {
    return this.http.post<IFeedback<IOrder>>(`${this.api}`, request);
  }

  updateOrder(request: IOrderActionRequest) {
    return this.http.put<IFeedback<IOrder>>(`${this.api}`, request);
  }

  deleteOrder(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}