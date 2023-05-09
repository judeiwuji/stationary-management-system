import { Component } from '@angular/core';
import {
  faCartPlus,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IStock } from '../model/stock';
import { FormControl, FormGroup } from '@angular/forms';
import { StockService } from '../services/stock.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxService } from '../services/message-box.service';
import { ToastrService } from 'ngx-toastr';
import { StockFormComponent } from '../stock-form/stock-form.component';
import { MessageBoxTypes } from '../model/message-box';
import { ICart, ICartActionRequest } from '../model/cart';
import { CartService } from '../services/cart.service';
import { CartRx } from '../rx/cart-rx';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
})
export class StocksComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faCartPlus = faCartPlus;
  faMinus = faMinus;

  sorts: any = {};
  stocks: IStock[] = [];
  currentPage = 1;
  totalPages = 0;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  processing!: boolean;
  cartRx = new CartRx();

  constructor(
    private stockService: StockService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {
    this.loadStocks();
  }

  loadStocks(page = 1) {
    const search = this.searchForm.controls['search'].value || '';
    this.stockService.getStocks(page, search).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.stocks.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  search() {
    this.stocks = [];
    this.loadStocks(1);
  }

  createStock() {
    const instance = this.modal.open(StockFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.result.then((stock: any) => {
      if (stock) {
        this.stocks.unshift(stock);
      }
    });
  }

  editStock(stock: IStock) {
    const instance = this.modal.open(StockFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.componentInstance.stock = stock;
    instance.result.then((data: IStock) => {
      if (data) {
        const index = this.stocks.findIndex((d) => d.id === stock.id);
        if (index !== -1) {
          this.stocks[index] = data;
        }
      }
    });
  }

  deleteStock(stock: IStock) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete <strong class="text-capitalize">${stock.name}</strong>`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.stockService.deleteStock(stock.id as number).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.stocks.findIndex((d) => d.id === stock.id);
              if (index !== -1) {
                this.stocks.splice(index, 1);
              }
            }
          },
          error: (err) => {
            this.toastr.clear();
            this.toastr.warning(err.error);
          },
        });
      },
      onDismiss: () => {},
      type: MessageBoxTypes.PROMPT,
    });
  }

  cartAction(stock: IStock) {
    if (!stock.cart) {
      this.addItemToCart(stock);
    } else {
      this.removeItemFromCart(stock);
    }
  }

  addItemToCart(stock: IStock) {
    if (this.processing) return;
    const cart: ICartActionRequest = {
      quantity: 1,
      stockId: stock.id,
    };

    this.processing = true;
    this.toastr.info('Adding...', '', { timeOut: 0 });
    this.cartService.addCartItem(cart).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.success) {
          stock.cart = response.data;
          this.toastr.success('Added');
          this.cartRx.addItem(response.data);
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

  removeItemFromCart(stock: IStock) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Removing...', '', { timeOut: 0 });
    this.cartService.deleteCartItem(stock.cart?.id as number).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.data) {
          this.toastr.success('Removed');
          this.cartRx.removeItem(stock.cart as ICart);
          stock.cart = undefined;
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
}
