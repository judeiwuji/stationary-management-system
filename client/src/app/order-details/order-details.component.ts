import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IOrder, OrderStatus } from '../model/order';
import { OrderService } from '../services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent {
  @Input()
  order!: IOrder;
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly orderService: OrderService,
    private readonly toastr: ToastrService
  ) {}

  close() {
    this.activeModal.dismiss();
  }

  markAsCompleted() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...', '', { timeOut: 0 });
    this.orderService
      .updateOrder({
        id: this.order.id,
        requisitionId: this.order.requisitionId,
        status: OrderStatus.COMPLETED,
      })
      .subscribe({
        next: (response) => {
          this.processing = false;
          this.toastr.clear();
          if (response.success) {
            this.order.status = OrderStatus.COMPLETED;
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
