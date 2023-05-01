import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IRequisition,
  IRequisitionItem,
  RequisitionStatus,
} from '../model/requisition';
import {
  faChevronDown,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { RequisitionItemFormComponent } from '../requisition-item-form/requisition-item-form.component';
import { MessageBoxService } from '../services/message-box.service';
import { ToastrService } from 'ngx-toastr';
import { RequisitionService } from '../services/requisition.service';
import { MessageBoxTypes } from '../model/message-box';
import { RecommendationService } from '../services/recommendation.service';
import {
  IRecommendation,
  IRecommendationActionRequest,
} from '../model/recommendation';
import { AuditService } from '../services/audit.service';
import { IAudit, IAuditActionRequest } from '../model/audit';
import { IVerificationActionRequest } from '../model/verification';
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'app-requisition-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.css'],
})
export class RequisitionDetailComponent {
  @Input()
  requisition!: IRequisition;

  @Input()
  recommendation!: IRecommendation;

  @Input()
  audit!: IAudit;

  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  processing = false;
  RequisitionStatus = RequisitionStatus;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly modal: NgbModal,
    private readonly messageBoxService: MessageBoxService,
    private readonly toastr: ToastrService,
    private readonly requisitionService: RequisitionService,
    private readonly recommendationService: RecommendationService,
    private readonly auditService: AuditService,
    private readonly verificationService: VerificationService
  ) {}

  close() {
    this.activeModal.close();
  }

  addItem() {
    const instance = this.modal.open(RequisitionItemFormComponent, {
      size: 'sm',
      backdrop: 'static',
    });

    instance.componentInstance.requisition = this.requisition;
  }

  deleteItem(item: IRequisitionItem) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete <strong class="text-capitalize">${item.stock?.name}</strong> from this requisition?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.requisitionService
          .deleteRequisitionItem(item.id as number)
          .subscribe({
            next: (response) => {
              this.toastr.clear();
              if (response.success) {
                this.toastr.clear();
                this.toastr.success('Deleted');
                const index = this.requisition.items.findIndex(
                  (d) => d.id === item.id
                );
                if (index !== -1) {
                  this.requisition.items.splice(index, 1);
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

  computeSubTotal(item: IRequisitionItem) {
    return Number(item.price) * item.quantity;
  }

  computeTotal() {
    let total = 0;

    this.requisition.items.forEach((item) => {
      total += Number(this.computeSubTotal(item));
    });
    return total;
  }

  bursarAction(status: RequisitionStatus) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...', '', { timeOut: 0 });
    const request: IRecommendationActionRequest = {
      requisitionId: this.requisition.id,
      status: status,
    };
    this.recommendationService.createRecommendation(request).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;

        if (response.success) {
          this.toastr.success('Done');
          this.requisition.status = status;
          this.activeModal.close();
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

  auditorAction(status: RequisitionStatus) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...', '', { timeOut: 0 });
    const request: IAuditActionRequest = {
      recommendationId: this.recommendation.id,
      requisitionId: this.requisition.id,
      status: status,
    };

    this.auditService.createAudit(request).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;

        if (response.success) {
          this.toastr.success('Done');
          this.requisition.status = status;
          this.activeModal.close();
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

  rectorAction(status: RequisitionStatus) {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Please wait...', '', { timeOut: 0 });
    const request: IVerificationActionRequest = {
      recommendationId: this.audit.recommendationId,
      requisitionId: this.requisition.id,
      auditId: this.audit.id,
      status: status,
    };

    this.verificationService.createVerification(request).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;

        if (response.success) {
          this.toastr.success('Done');
          this.requisition.status = status;
          this.activeModal.close();
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
}
