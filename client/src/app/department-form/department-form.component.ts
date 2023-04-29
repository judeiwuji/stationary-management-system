import { Component, Input, OnInit } from '@angular/core';
import { IDepartment } from '../model/department';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  @Input()
  department?: IDepartment;
  deptForm!: FormGroup;
  processing = false;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService,
    private readonly departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    if (this.department) {
      this.deptForm = new FormGroup({
        name: new FormControl(this.department.name, [Validators.required]),
      });
    } else {
      this.deptForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
    }
  }

  close() {
    this.activeModal.close(null);
  }

  save() {
    if (this.processing) return;

    if (this.department) {
      this.updateDept();
    } else {
      this.createDept();
    }
  }

  createDept() {
    this.processing = true;
    const newDepartment: IDepartment = {
      name: this.deptForm.controls['name'].value,
    };

    this.departmentService.createDepartment(newDepartment).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.toastr.success('Created');
          this.activeModal.close(response.data);
        }
      },
      error: (err) => {
        this.toastr.clear();
        this.processing = false;
        this.toastr.warning(err.error);
      },
    });
  }

  updateDept() {
    this.processing = true;
    const update: IDepartment = {
      name: this.deptForm.controls['name'].value,
      id: this.department?.id,
    };

    this.departmentService.updateDepartment(update).subscribe({
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
}
