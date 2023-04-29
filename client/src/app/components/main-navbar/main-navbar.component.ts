import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faAlignLeft,
  faChevronDown,
  faPowerOff,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { IAuthResponse } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css'],
})
export class MainNavbarComponent {
  faAlignLeft = faAlignLeft;
  faChevronDown = faChevronDown;
  faPowerOff = faPowerOff;
  faSpinner = faSpinner;
  processing = false;
  credentials: IAuthResponse | null;

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    this.credentials = this.authService.getCredentials();
  }

  completeLogout() {
    this.toastr.clear();
    this.processing = false;
    this.router.navigateByUrl('');
  }

  logout() {
    if (this.processing) return;

    this.processing = true;
    this.toastr.info('Logging out', '', { progressBar: true, timeOut: 0 });
    this.authService.logout().subscribe({
      next: (response) => {
        this.completeLogout();
      },
      error: (err) => {
        this.completeLogout();
      },
    });
  }
}
