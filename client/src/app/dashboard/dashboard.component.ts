import { Component } from '@angular/core';
import {
  faUsers,
  faBookJournalWhills,
  faBookBookmark,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';

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

  constructor() {}
}
