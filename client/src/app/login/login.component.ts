import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthRequest } from '../model/auth';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  processing = false;
  faSpinner = faSpinner;

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    if (AuthService.getCredentials()) {
      router.navigate(['/dashboard']);
    }
  }

  get fc() {
    return this.loginForm.controls;
  }

  login() {
    if (this.processing) return;
    this.processing = true;
    const request: IAuthRequest = {
      email: this.fc['email'].value as string,
      password: this.fc['password'].value as string,
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.processing = false;
        if (response.success) {
          this.authService.saveCredentials(response.data);
          this.router.navigate([response.data.redirect]);
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.processing = false;
        console.log(err);
        this.toastr.warning(err.error);
      },
    });
  }
}
