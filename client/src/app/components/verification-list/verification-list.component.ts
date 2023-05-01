import { Component, Input } from '@angular/core';
import {
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faList,
  faPen,
  faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxTypes } from 'src/app/model/message-box';
import { RequisitionStatus } from 'src/app/model/requisition';
import { IVerification } from 'src/app/model/verification';
import { RequisitionDetailComponent } from 'src/app/requisition-detail/requisition-detail.component';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { VerificationService } from 'src/app/services/verification.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.css'],
})
export class VerificationListComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faList = faList;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  faComment = faComment;

  sorts: any = {};
  verifications: IVerification[] = [];
  currentPage = 1;
  totalPages = 0;
  processing!: boolean;
  RequisitionStatus = RequisitionStatus;
  requisitionStatus = Object.values(RequisitionStatus);

  @Input()
  filters: { status?: string } = {};

  @Input()
  showMenu = false;

  constructor(
    private verificationService: VerificationService,
    private requitionService: RequisitionService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadVerifications();
  }

  loadVerifications(page = 1, search = '') {
    this.verificationService
      .getVerifications(page, search, JSON.stringify(this.filters))
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.verifications.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  deleteAudit(verification: IVerification) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this audit with id: <strong class="text-capitalize">${verification.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.verificationService.deleteVerification(verification.id).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.verifications.findIndex(
                (d) => d.id === verification.id
              );
              if (index !== -1) {
                this.verifications.splice(index, 1);
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

  viewDetails(verification: IVerification) {
    this.requitionService
      .getRequisition(verification.requisitionId)
      .subscribe((response) => {
        if (response.success) {
          verification.requisition = response.data;
          const instance = this.modal.open(RequisitionDetailComponent, {
            size: 'md',
            backdrop: 'static',
          });

          instance.componentInstance.requisition = verification.requisition;
          instance.componentInstance.recommendation =
            verification.recommendation;
          instance.componentInstance.audit = verification.audit;
        }
      });
  }

  viewComments(verification: IVerification) {
    const instance = this.modal.open(CommentsComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.componentInstance.requisition = verification.requisition;
  }

  filterBy(status: string) {
    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.verifications = [];
    this.loadVerifications(1);
  }
}
