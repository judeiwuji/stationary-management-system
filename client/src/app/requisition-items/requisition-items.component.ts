import { Component, Input, OnInit } from '@angular/core';
import {
  IRequisition,
  IRequisitionItem,
  RequisitionStatus,
} from '../model/requisition';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisitionService } from '../services/requisition.service';
import { PurchaseService } from '../services/purchase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requisition-items',
  templateUrl: './requisition-items.component.html',
  styleUrls: ['./requisition-items.component.css'],
})
export class RequisitionItemsComponent implements OnInit {
  @Input()
  requisition!: IRequisition;
  loading = false;
  selectedItem!: IRequisitionItem;
  processing = false;
  canMarkRequisitionAsPurchased = false;

  constructor(
    private readonly toastr: ToastrService,
    private readonly activeModal: NgbActiveModal,
    private readonly requisitionService: RequisitionService,
    private readonly purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.requisitionService
      .getRequisition(this.requisition.id as number)
      .subscribe((response) => {
        this.loading = false;
        if (response.success) {
          this.requisition = response.data;
          this.canMarkRequisitionAsPurchased = this.canMarkAsPurchased();
        }
      });
  }

  close() {
    this.activeModal.dismiss();
  }

  computeSubtotal(item: IRequisitionItem) {
    return Number(item.price) * item.quantity;
  }

  selectItem(item: IRequisitionItem) {
    this.selectedItem = item;
  }

  uploadReceipt(event: any) {
    if (!event.target.files || event.target.files.length === 0) return;
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Uploading...', '', { timeOut: 0 });
    const formData = new FormData();
    formData.append('receipt', event.target.files[0]);
    formData.append('requisitionItemId', `${this.selectedItem.id}`);
    this.purchaseService.createReceipt(formData).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.selectedItem.receipt = response.data;
          this.toastr.success('Uploaded');
          this.canMarkRequisitionAsPurchased = this.canMarkAsPurchased();
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.toastr.clear();
        this.processing = false;
        this.toastr.warning(err.error);
      },
    });
  }

  canMarkAsPurchased() {
    return (
      this.requisition.items.filter((d) => !!d.receipt).length ===
      this.requisition.items.length
    );
  }

  markRequisitionAsPurchased() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...');
    this.requisitionService
      .updateRequisition({
        id: this.requisition.id,
        status: RequisitionStatus.PURCHASED,
      })
      .subscribe({
        next: (response) => {
          this.processing = false;
          this.toastr.clear();
          if (response.success) {
            this.requisition.status = RequisitionStatus.PURCHASED;
            this.toastr.success('Purchased');
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
