import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRequisition, IRequisitionItem } from '../model/requisition';
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

@Component({
  selector: 'app-requisition-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.css'],
})
export class RequisitionDetailComponent {
  @Input()
  requisition!: IRequisition;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly modal: NgbModal,
    private readonly messageBoxService: MessageBoxService,
    private readonly toastr: ToastrService,
    private readonly requisitionService: RequisitionService
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
}
