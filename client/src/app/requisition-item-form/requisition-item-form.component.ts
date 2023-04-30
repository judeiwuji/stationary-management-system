import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { IRequisition, IRequisitionItem } from '../model/requisition';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../services/stock.service';
import { RequisitionService } from '../services/requisition.service';
import { IStock } from '../model/stock';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requisition-item-form',
  templateUrl: './requisition-item-form.component.html',
  styleUrls: ['./requisition-item-form.component.css'],
})
export class RequisitionItemFormComponent {
  @Input()
  requisition!: IRequisition;
  stocks: IStock[] = [];
  itemForm = new FormGroup({
    stockId: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly stockService: StockService,
    private readonly requisitionService: RequisitionService,
    private readonly toastr: ToastrService
  ) {
    this.loadStocks();
  }

  close() {
    this.activeModal.close();
  }

  loadStocks(page = 1) {
    this.stockService.getStocks(page).subscribe((response) => {
      if (response.success) {
        this.stocks.push(...response.results);
      }
    });
  }

  addItem() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Adding...', '', { timeOut: 0 });
    const item: IRequisitionItem = {
      price: Number(this.itemForm.controls['price'].value),
      quantity: Number(this.itemForm.controls['quantity'].value),
      requisitionId: Number(this.requisition.id),
      stockId: Number(this.itemForm.controls['stockId'].value),
    };

    this.requisitionService.addRequisitionItem(item).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.success) {
          this.toastr.success('Added');
          this.requisition.items.push(response.data);
          this.activeModal.close();
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
