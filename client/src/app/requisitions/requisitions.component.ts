import { Component } from '@angular/core';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faPen,
  faTrashAlt,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { IRequisition, RequisitionStatus } from '../model/requisition';
import { FormControl, FormGroup } from '@angular/forms';
import { RequisitionService } from '../services/requisition.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxService } from '../services/message-box.service';
import { ToastrService } from 'ngx-toastr';
import { RequisitionFormComponent } from '../requisition-form/requisition-form.component';
import { MessageBoxTypes } from '../model/message-box';
import { RequisitionDetailComponent } from '../requisition-detail/requisition-detail.component';

@Component({
  selector: 'app-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrls: ['./requisitions.component.css'],
})
export class RequisitionsComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faList = faList;

  sorts: any = {};
  requisitions: IRequisition[] = [];
  currentPage = 1;
  totalPages = 0;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  processing!: boolean;
  RequisitionStatus = RequisitionStatus;
  requisitionStatus = Object.values(RequisitionStatus);
  filters: { status?: string } = {};

  constructor(
    private requisitionService: RequisitionService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {
    this.loadRequisitions();
  }

  loadRequisitions(page = 1, search = '') {
    this.requisitionService
      .getRequisitions(page, search, JSON.stringify(this.filters))
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.requisitions.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  search() {
    const searchText = this.searchForm.controls['search'].value || '';
    this.requisitions = [];
    this.loadRequisitions(1, searchText);
  }

  createRequisition() {
    const instance = this.modal.open(RequisitionFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.result.then((requisition: any) => {
      if (requisition) {
        this.requisitions.unshift(requisition);
      }
    });
  }

  editRequisition(requisition: IRequisition) {
    const instance = this.modal.open(RequisitionFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.componentInstance.requisition = requisition;
    instance.result.then((data: IRequisition) => {
      if (data) {
        const index = this.requisitions.findIndex(
          (d) => d.id === requisition.id
        );
        if (index !== -1) {
          this.requisitions[index] = data;
        }
      }
    });
  }

  deleteRequisition(requisition: IRequisition) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this requisition with id: <strong class="text-capitalize">${requisition.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.requisitionService
          .deleteRequisition(requisition.id as number)
          .subscribe({
            next: (response) => {
              this.toastr.clear();
              if (response.success) {
                this.toastr.clear();
                this.toastr.success('Deleted');
                const index = this.requisitions.findIndex(
                  (d) => d.id === requisition.id
                );
                if (index !== -1) {
                  this.requisitions.splice(index, 1);
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

  viewDetails(requisition: IRequisition) {
    const instance = this.modal.open(RequisitionDetailComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.componentInstance.requisition = requisition;
  }

  filterBy(status: string) {
    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.requisitions = [];
    this.loadRequisitions(1);
  }
}
