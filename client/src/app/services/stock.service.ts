import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IFeedback } from '../model/feedback';
import { IStock, IStockActionRequest } from '../model/stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  api = `${environment.apiURL}/stocks`;

  constructor(private http: HttpClient) {}

  getStocks(page: number, search = '') {
    return this.http.get<IFeedback<IStock>>(
      `${this.api}?page=${page}&search=${search}`
    );
  }

  createStock(stock: IStockActionRequest) {
    return this.http.post<IFeedback<IStock>>(`${this.api}`, stock);
  }

  updateStock(stock: IStockActionRequest) {
    return this.http.put<IFeedback<IStock>>(`${this.api}`, stock);
  }

  deleteStock(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
