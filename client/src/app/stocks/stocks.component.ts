import { Component } from '@angular/core';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
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

  sorts: any = {};
  stocks: IStock[] = [];
  currentPage = 1;
  totalPages = 0;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  processing!: boolean;

  constructor(
    private stockService: StockService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {
    this.loadStocks();
  }

  loadStocks(page = 1, search = '') {
    this.stockService.getStocks(page, search).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.stocks.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  search() {
    const searchText = this.searchForm.controls['search'].value || '';
    this.stocks = [];
    this.loadStocks(1, searchText);
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
}
