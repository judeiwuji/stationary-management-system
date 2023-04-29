import { Component } from '@angular/core';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IDepartment } from '../model/department';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartmentService } from '../services/department.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxService } from '../services/message-box.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { MessageBoxTypes } from '../model/message-box';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;

  sorts: any = {};
  departments: IDepartment[] = [];
  currentPage = 1;
  totalPages = 0;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  processing: any;

  constructor(
    private departmentService: DepartmentService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService
  ) {
    this.loadUsers();
  }

  sortBy(label: string, order: string) {
    if (this.sorts[label]) {
      delete this.sorts[label];
    } else {
      this.sorts[label] = order;
    }
  }

  loadUsers(page = 1, search = '') {
    this.departmentService
      .getDepartments(page, search)
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.departments.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  search() {
    const searchText = this.searchForm.controls['search'].value || '';
    this.departments = [];
    this.loadUsers(1, searchText);
  }

  createDept() {
    const instance = this.modal.open(DepartmentFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.result.then((dept: IDepartment | null) => {
      if (dept) {
        this.departments.unshift(dept);
      }
    });
  }

  editDept(dept: IDepartment) {
    const instance = this.modal.open(DepartmentFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.componentInstance.department = dept;
    instance.result.then((updated: IDepartment | null) => {
      if (updated) {
        const index = this.departments.findIndex((d) => d.id === dept.id);
        if (index !== -1) {
          this.departments[index] = updated;
        }
      }
    });
  }

  deleteUser(dept: IDepartment) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete <strong class="text-capitalize">${dept.name}</strong>`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.departmentService.deleteDepartment(dept.id as number).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.departments.findIndex((d) => d.id === dept.id);
              if (index !== -1) {
                this.departments.splice(index, 1);
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
