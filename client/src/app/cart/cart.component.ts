import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ICart, ICartActionRequest } from '../model/cart';
import {
  faMinus,
  faMinusCircle,
  faPlus,
  faShoppingCart,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CartRx } from '../rx/cart-rx';
import { OrderService } from '../services/order.service';
import { MessageBoxService } from '../services/message-box.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  currentPage = 1;
  totalPages = 0;
  cartItems: ICart[] = [];
  faMinusCircle = faMinusCircle;
  faMinus = faMinus;
  faPlus = faPlus;
  faShoppingCart = faShoppingCart;
  faSpinner = faSpinner;
  processing = false;
  cartRx = new CartRx();
  firstTimeLoadCompleted = false;
  orderProcessing = false;

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly messageBoxService: MessageBoxService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(page = 1) {
    this.cartService.getCartItems(page).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.cartItems.push(...response.results);
        this.totalPages = response.totalPages;
      }

      if (!this.firstTimeLoadCompleted) {
        this.firstTimeLoadCompleted = true;
      }
    });
  }

  removeItemFromCart(cart: ICart) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Removing...', '', { timeOut: 0 });
    this.cartService.deleteCartItem(cart.id as number).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.data) {
          const index = this.cartItems.findIndex((d) => d.id === cart.id);
          if (index !== -1) {
            this.cartItems.splice(index, 1);
          }
          this.toastr.success('Removed');
          this.cartRx.removeItem(cart);
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.processing = false;
        this.toastr.clear();
        this.toastr.warning(err.error);
      },
    });
  }

  updateQuantity(cart: ICart, qty = 1) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...', '', { timeOut: 0 });
    const request: ICartActionRequest = {
      quantity: cart.quantity + qty,
      id: cart.id,
    };
    this.cartService.updateCartItem(request).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.data) {
          cart.quantity += qty;
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.processing = false;
        this.toastr.clear();
        this.toastr.warning(err.error);
      },
    });
  }

  createOrder() {
    if (this.orderProcessing) return;

    this.orderProcessing = true;
    this.toastr.info('Ordering...', '', { timeOut: 0 });

    this.orderService.createOrder().subscribe({
      next: (response) => {
        this.orderProcessing = false;
        this.toastr.clear();
        if (response.success) {
          this.toastr.success('Ordered');
          this.cartItems = [];
          this.cartRx.clearCart();
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.orderProcessing = false;
        this.toastr.clear();
        this.toastr.warning(err.error);
      },
    });
  }
}
