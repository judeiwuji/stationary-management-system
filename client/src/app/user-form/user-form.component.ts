import { Component, Input, OnInit } from '@angular/core';
import { faClose, faL } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from '../model/roles';
import { IUser } from '../model/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  faClose = faClose;
  roles: any = Object.values(Roles).filter((d) => typeof d === 'number');
  processing = false;
  userForm!: FormGroup;

  @Input()
  user?: IUser;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly userService: UserService,
    private readonly toastr: ToastrService
  ) {
    console.log(this.roles);
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm = new FormGroup({
        lastname: new FormControl(this.user.lastname, [Validators.required]),
        firstname: new FormControl(this.user.firstname, [Validators.required]),
        role: new FormControl(this.user.role, [Validators.required]),
      });
    } else {
      this.userForm = new FormGroup({
        lastname: new FormControl('', [Validators.required]),
        firstname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        role: new FormControl(Roles.AUDITOR, [Validators.required]),
      });
    }
  }

  close() {
    this.activeModal.close(null);
  }

  save() {
    if (this.user) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('creating...', '', { timeOut: 0 });
    const user: IUser = {
      email: this.userForm.controls['email'].value,
      firstname: this.userForm.controls['firstname'].value,
      lastname: this.userForm.controls['lastname'].value,
      role: Number(this.userForm.controls['role'].value),
      password: this.userForm.controls['password'].value,
    };

    this.userService.createUser(user).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.clear();
        if (response.success) {
          this.activeModal.close(response.data);
          this.toastr.success('Created');
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.processing = false;
        this.toastr.clear();
        this.toastr.warning(err.error);
      },
    });
  }

  updateUser() {
    if (this.processing) return;

    this.toastr.info('saving...', '', { timeOut: 0 });
    this.processing = true;
    const user: IUser = {
      id: this.user?.id,
      firstname: this.userForm.controls['firstname'].value,
      lastname: this.userForm.controls['lastname'].value,
      role: Number(this.userForm.controls['role'].value),
    };

    this.userService.updateUser(user).subscribe({
      next: (response) => {
        this.toastr.clear();
        this.processing = false;
        if (response.success) {
          this.activeModal.close(response.data);
          this.toastr.success('Saved');
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.toastr.clear();
        this.processing = false;
        this.toastr.warning(err.message);
      },
    });
  }
}
