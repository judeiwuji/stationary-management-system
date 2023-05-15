import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedback } from '../model/feedback';
import { ICart, ICartActionRequest } from '../model/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  api = `${environment.apiURL}/cart`;

  constructor(private http: HttpClient) {}

  getCartItems(page: number) {
    return this.http.get<IFeedback<ICart>>(`${this.api}?page=${page}`);
  }

  getCartItemsCount() {
    return this.http.get<IFeedback<number>>(`${this.api}/count`);
  }

  addCartItem(cart: ICartActionRequest) {
    return this.http.post<IFeedback<ICart>>(`${this.api}`, cart);
  }

  updateCartItem(cart: ICartActionRequest) {
    return this.http.put<IFeedback<boolean>>(`${this.api}`, cart);
  }

  deleteCartItem(id: number) {
    return this.http.delete<IFeedback<boolean>>(`${this.api}/${id}`);
  }
}
