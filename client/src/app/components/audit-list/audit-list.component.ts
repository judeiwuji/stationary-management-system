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
import { IAudit } from 'src/app/model/audit';
import { MessageBoxTypes } from 'src/app/model/message-box';
import { RequisitionStatus } from 'src/app/model/requisition';
import { RequisitionDetailComponent } from 'src/app/requisition-detail/requisition-detail.component';
import { AuditService } from 'src/app/services/audit.service';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css'],
})
export class AuditListComponent {
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
  audits: IAudit[] = [];
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
    private auditService: AuditService,
    private requitionService: RequisitionService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAudits();
  }

  loadAudits(page = 1, search = '') {
    this.auditService
      .getAudits(page, search, JSON.stringify(this.filters))
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.audits.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  deleteAudit(audit: IAudit) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this audit with id: <strong class="text-capitalize">${audit.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.auditService.deleteAudit(audit.id).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.audits.findIndex((d) => d.id === audit.id);
              if (index !== -1) {
                this.audits.splice(index, 1);
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

  viewDetails(audit: IAudit) {
    this.requitionService
      .getRequisition(audit.requisitionId)
      .subscribe((response) => {
        if (response.success) {
          audit.requisition = response.data;
          const instance = this.modal.open(RequisitionDetailComponent, {
            size: 'md',
            backdrop: 'static',
          });

          instance.componentInstance.requisition = audit.requisition;
          instance.componentInstance.recommendation = audit;
        }
      });
  }

  viewComments(audit: IAudit) {
    const instance = this.modal.open(CommentsComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.componentInstance.requisition = audit.requisition;
  }

  filterBy(status: string) {
    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.audits = [];
    this.loadAudits(1);
  }
}
