import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faTachometer,
  faUsers,
  faBookJournalWhills,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

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
  constructor(private readonly router: Router) {
    this.currentURL = this.router.url;
  }
}
