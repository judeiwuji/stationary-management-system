import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faTachometer,
  faUsers,
  faBookJournalWhills,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { IAuthResponse } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css'],
})
export class MainSidebarComponent {
  faTachometer = faTachometer;
  faUsers = faUsers;
  faBookJournalWhills = faBookJournalWhills;
  faComments = faComments;
  currentURL: string;
  credentials: IAuthResponse | null;

  constructor(
    private readonly router: Router,
    private authService: AuthService
  ) {
    this.currentURL = this.router.url;
    this.credentials = this.authService.getCredentials();
  }
}
