import { Component, Input } from '@angular/core';
import {
  faBookBookmark,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentAlt,
  faList,
  faPen,
  faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IAuthResponse } from 'src/app/model/auth';
import { MessageBoxTypes } from 'src/app/model/message-box';
import { IOrder, OrderStatus } from 'src/app/model/order';
import { OrderDetailsComponent } from 'src/app/order-details/order-details.component';
import { RequisitionDetailComponent } from 'src/app/requisition-detail/requisition-detail.component';
import { AuthService } from 'src/app/services/auth.service';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { OrderService } from 'src/app/services/order.service';
import { RequisitionService } from 'src/app/services/requisition.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faList = faList;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  faComment = faComment;
  faCommentAlt = faCommentAlt;
  faBookBookmark = faBookBookmark;

  sorts: any = {};
  orders: IOrder[] = [];
  currentPage = 1;
  totalPages = 0;
  processing!: boolean;
  OrderStatus = OrderStatus;
  orderStatus = Object.values(OrderStatus);

  @Input()
  filters: { status?: string } = {};

  @Input()
  showMenu = false;

  credentials!: IAuthResponse | null;
  constructor(
    private orderService: OrderService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService,
    private authService: AuthService,
    private requisitionService: RequisitionService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.credentials = AuthService.getCredentials();
  }

  loadOrders(page = 1) {
    this.orderService
      .getOrders(page, JSON.stringify(this.filters))
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.orders.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  deleteOrder(recommendation: IOrder) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this order with id: <strong class="text-capitalize">${recommendation.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.orderService.deleteOrder(recommendation.id).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.orders.findIndex(
                (d) => d.id === recommendation.id
              );
              if (index !== -1) {
                this.orders.splice(index, 1);
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

  viewDetails(order: IOrder) {
    const instance = this.modal.open(OrderDetailsComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.componentInstance.order = order;
  }

  filterBy(status: string) {
    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.orders = [];
    this.loadOrders(1);
  }

  viewRequisition(order: IOrder) {
    this.requisitionService
      .getRequisition(order.requisitionId)
      .subscribe((response) => {
        if (response.success) {
          const instance = this.modal.open(RequisitionDetailComponent, {
            size: 'md',
            backdrop: 'static',
          });

          instance.componentInstance.requisition = response.data;
        }
      });
  }
}
