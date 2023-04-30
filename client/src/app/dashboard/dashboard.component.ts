import { Component } from '@angular/core';
import {
  faUsers,
  faBookJournalWhills,
  faBookBookmark,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../services/dashboard.service';
import { IDashboardAnalytics } from '../model/dashboard';

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

  constructor(private readonly dashboardService: DashboardService) {
    this.getAnalytics();
  }

  getAnalytics() {
    this.dashboardService.getAnalytics().subscribe((response) => {
      if (response.success) {
        this.analytics = response.data;
      }
    });
  }
}
