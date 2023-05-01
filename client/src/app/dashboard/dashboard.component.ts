import { Component } from '@angular/core';
import {
  faUsers,
  faBookJournalWhills,
  faBookBookmark,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../services/dashboard.service';
import { IDashboardAnalytics } from '../model/dashboard';
import { IAuthResponse } from '../model/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  faUsers = faUsers;
  faBookJournalWhills = faBookJournalWhills;
  faBookBookmark = faBookBookmark;
  faReceipt = faReceipt;
  analytics!: IDashboardAnalytics;
  credentials!: IAuthResponse | null;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService
  ) {
    this.getAnalytics();
    this.credentials = this.authService.getCredentials();
  }

  getAnalytics() {
    this.dashboardService.getAnalytics().subscribe((response) => {
      if (response.success) {
        this.analytics = response.data;
      }
    });
  }
}
