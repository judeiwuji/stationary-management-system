import { Subject } from 'rxjs';
import { ICart } from '../model/cart';

export class CartRx {
  static instance: CartRx;
  private cartAddItemSubject = new Subject<ICart>();
  private cartRemoveItemSubject = new Subject<ICart>();
  private clearCartSubject = new Subject<boolean>();

  constructor() {
    if (CartRx.instance) {
      return CartRx.instance;
    }
    CartRx.instance = this;
  }

  addItem(item: ICart) {
    this.cartAddItemSubject.next(item);
  }

  onAddItem(action: (cart: ICart) => void) {
    return this.cartAddItemSubject.subscribe(action);
  }

  removeItem(item: ICart) {
    this.cartRemoveItemSubject.next(item);
  }

  onRemoveItem(action: (cart: ICart) => void) {
    return this.cartRemoveItemSubject.subscribe(action);
  }

  clearCart() {
    return this.clearCartSubject.next(true);
  }

  onClearCart(action: () => void) {
    return this.clearCartSubject.subscribe(action);
  }
}
