import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faAlignLeft,
  faChevronDown,
  faPowerOff,
  faShoppingCart,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { IAuthResponse } from 'src/app/model/auth';
import { CartRx } from 'src/app/rx/cart-rx';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css'],
})
export class MainNavbarComponent {
  faAlignLeft = faAlignLeft;
  faChevronDown = faChevronDown;
  faPowerOff = faPowerOff;
  faSpinner = faSpinner;
  faShoppingCart = faShoppingCart;
  processing = false;
  credentials: IAuthResponse | null;
  cartRx = new CartRx();
  cartCount = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly cartService: CartService
  ) {
    this.credentials = AuthService.getCredentials();
    this.cartService.getCartItemsCount().subscribe((response) => {
      if (response.success) {
        this.cartCount = response.data;
      }
    });
    this.cartRx.onAddItem((cart) => {
      ++this.cartCount;
    });

    this.cartRx.onRemoveItem((cart) => {
      --this.cartCount;
    });

    this.cartRx.onClearCart(() => {
      this.cartCount = 0;
    });
  }

  completeLogout() {
    this.toastr.clear();
    this.processing = false;
    this.router.navigateByUrl('');
  }

  logout() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Logging out', '', { progressBar: true, timeOut: 0 });
    this.authService.logout().subscribe({
      next: (response) => {
        this.completeLogout();
      },
      error: (err) => {
        this.completeLogout();
      },
    });
  }
}
