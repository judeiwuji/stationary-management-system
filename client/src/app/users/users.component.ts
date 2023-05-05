import { Component } from '@angular/core';
import {
  faSortAlphaUp,
  faSortAlphaDown,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faTrashAlt,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { IUser } from '../model/user';
import { Roles } from '../model/roles';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from '../user-form/user-form.component';
import { MessageBoxService } from '../services/message-box.service';
import { MessageBoxTypes } from '../model/message-box';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;

  sorts: any = {};
  users: IUser[] = [];
  currentPage = 1;
  totalPages = 0;
  Roles = Roles;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  processing: any;

  constructor(
    private userService: UserService,
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

  loadUsers(page = 1) {
    const search = this.searchForm.controls['search'].value || '';
    this.userService.getUsers(page, search).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.users.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  search() {
    this.users = [];
    this.loadUsers(1);
  }

  createUser() {
    const instance = this.modal.open(UserFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.result.then((user: IUser | null) => {
      if (user) {
        this.users.unshift(user);
      }
    });
  }

  editUser(user: IUser) {
    const instance = this.modal.open(UserFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    instance.componentInstance.user = user;
    instance.result.then((updatedUser: IUser | null) => {
      if (updatedUser) {
        const index = this.users.findIndex((d) => d.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      }
    });
  }

  deleteUser(user: IUser) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete <strong class="text-capitalize">${user.lastname} ${user.firstname}</strong>`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.userService.deleteUser(user.id as number).subscribe({
          next: (response) => {
            this.toastr.clear();
            if (response.success) {
              this.toastr.clear();
              this.toastr.success('Deleted');
              const index = this.users.findIndex((d) => d.id === user.id);
              if (index !== -1) {
                this.users.splice(index, 1);
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
