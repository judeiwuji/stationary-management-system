import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordViews } from 'src/app/model/enums/ResetPasswordViews';
import { IUser } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  isMainView = false;
  isResetView = false;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
  });

  processing = false;
  user!: IUser;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.setView(ResetPasswordViews.Main);
  }

  close() {
    this.activeModal.close();
  }

  setView(mode: ResetPasswordViews) {
    this.isMainView = mode === ResetPasswordViews.Main;
    this.isResetView = mode === ResetPasswordViews.Reset;
  }

  identifyUser() {
    if (this.processing) return;
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid) {
      return;
    }

    const request = {
      email: this.emailForm.controls['email'].value as string,
    };
    this.processing = true;
    this.userService.identifyUser(request).subscribe({
      next: (response) => {
        this.processing = false;
        this.setView(ResetPasswordViews.Reset);
        this.user = response;
      },
      error: (err) => {
        this.processing = false;
        this.toastr.warning(err.error.error);
      },
    });
  }

  resetPassword() {
    if (this.processing) return;
    this.resetPasswordForm.markAllAsTouched();

    if (this.resetPasswordForm.invalid) {
      return;
    }
    const request = {
      newPassword: this.resetPasswordForm.controls['newPassword']
        .value as string,
      userId: this.user.id as number,
    };

    this.processing = true;
    this.userService.resetPassword(request).subscribe({
      next: (response) => {
        this.processing = false;
        this.toastr.success('Success');
        this.close();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.warning(err.error.error);
        this.processing = false;
      },
    });
  }
}
