import { Component } from '@angular/core';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCommentAlt,
  faList,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IReceipt } from '../model/purchase';
import { PurchaseService } from '../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxService } from '../services/message-box.service';
import { ToastrService } from 'ngx-toastr';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';
import { MessageBoxTypes } from '../model/message-box';
import { ReceiptImageComponent } from '../receipt-image/receipt-image.component';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css'],
})
export class PurchaseHistoryComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faList = faList;
  faCommentAlt = faCommentAlt;

  sorts: any = {};
  receipts: IReceipt[] = [];
  currentPage = 1;
  totalPages = 0;
  processing!: boolean;

  constructor(
    private purchaseService: PurchaseService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(page = 1) {
    this.purchaseService.getHistory(page).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.receipts.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  createReceipt() {
    const instance = this.modal.open(PurchaseFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.result.then((receipt: any) => {
      if (receipt) {
        this.receipts.unshift(receipt);
      }
    });
  }

  deleteReceipt(receipt: IReceipt) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this receipt with id: <strong class="text-capitalize">${receipt.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.purchaseService.deleteReceipt(receipt.id as number).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.receipts.findIndex((d) => d.id === receipt.id);
              if (index !== -1) {
                this.receipts.splice(index, 1);
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

  computeSubtotal(receipt: IReceipt) {
    return Number(receipt.item.price) * receipt.item.quantity;
  }

  viewReceipt(receipt: IReceipt) {
    const instance = this.modal.open(ReceiptImageComponent, {
      size: 'lg',
      backdrop: 'static',
      modalDialogClass: 'modal-transparent',
    });

    instance.componentInstance.receipt = receipt;
  }
}
