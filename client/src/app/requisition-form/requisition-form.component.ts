import { Component, Input, OnInit } from '@angular/core';
import { IRequisition, IRequisitionItem } from '../model/requisition';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisitionItemFormComponent } from '../requisition-item-form/requisition-item-form.component';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DepartmentService } from '../services/department.service';
import { RequisitionService } from '../services/requisition.service';
import { IDepartment } from '../model/department';
import { Roles } from '../model/roles';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
  styleUrls: ['./requisition-form.component.css'],
})
export class RequisitionFormComponent implements OnInit {
  @Input()
  requisition!: IRequisition;
  items: IRequisitionItem[] = [];
  departments: IDepartment[] = [];
  faTrashAlt = faTrashAlt;
  roles: number[] = [Roles.BURSAR, Roles.RECTOR];
  requisitionForm!: FormGroup;
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly modal: NgbModal,
    private readonly toastr: ToastrService,
    private readonly departmentService: DepartmentService,
    private readonly requisitionService: RequisitionService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    if (this.requisition) {
      this.requisitionForm = new FormGroup({
        description: new FormControl(this.requisition.description, [
          Validators.required,
        ]),
        source: new FormControl(this.requisition.sourceId, [
          Validators.required,
        ]),
        through: new FormControl(this.requisition.through, [
          Validators.required,
        ]),
        destination: new FormControl(this.requisition.destination, [
          Validators.required,
        ]),
      });
    } else {
      this.requisitionForm = new FormGroup({
        description: new FormControl('', [Validators.required]),
        source: new FormControl('', [Validators.required]),
        through: new FormControl(Roles.BURSAR, [Validators.required]),
        destination: new FormControl(Roles.RECTOR, [Validators.required]),
      });
    }
  }

  close() {
    this.activeModal.close(null);
  }

  addItem() {
    const instance = this.modal.open(RequisitionItemFormComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    instance.result.then((item?: IRequisitionItem) => {
      if (item) {
        this.items.push(item);
      }
    });
  }

  deleteItem(item: IRequisitionItem) {
    const index = this.items.findIndex((d) => d.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  getDepartments() {
    this.departmentService.getDepartments(1).subscribe((response) => {
      if (response.success) {
        this.departments.push(...response.results);
      }
    });
  }

  save() {
    if (this.processing) return;
    this.requisitionForm.markAllAsTouched();
    if (this.requisitionForm.invalid) {
      this.toastr.warning('There is a problem with your form');
      return;
    }

    this.processing = true;
    if (this.requisition) {
      this.updateRequisition();
    } else {
      this.createRequisition();
    }
  }

  createRequisition() {
    const newRequisition: IRequisition = {
      description: this.fc['description'].value,
      destination: Number(this.fc['destination'].value),
      items: this.items,
      sourceId: Number(this.fc['source'].value),
      through: Number(this.fc['through'].value),
    };

    this.requisitionService.createRequisition(newRequisition).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.toastr.success('Created');
          this.activeModal.close(response.data);
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

  updateRequisition() {
    const update: IRequisition = {
      description: this.fc['description'].value,
      destination: this.fc['destination'].value,
      items: this.items,
      sourceId: Number(this.fc['source'].value),
      through: Number(this.fc['through'].value),
      id: this.requisition.id,
    };

    this.requisitionService.updateRequisition(update).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.toastr.success('Saved');
          this.activeModal.close(response.data);
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

  get fc() {
    return this.requisitionForm.controls;
  }
}
