import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faTachometer,
  faUsers,
  faBookJournalWhills,
  faComments,
  faCartShopping,
  faBookBookmark,
  faShare,
  faNewspaper,
  faHistory,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IAuthResponse } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css'],
})
export class MainSidebarComponent implements OnInit {
  faTachometer = faTachometer;
  faUsers = faUsers;
  faBookJournalWhills = faBookJournalWhills;
  faComments = faComments;
  faCartShopping = faCartShopping;
  faBookBookmark = faBookBookmark;
  faShare = faShare;
  faNewspaper = faNewspaper;
  faHistory = faHistory;
  faListAlt = faListAlt;
  currentURL: string;
  credentials: IAuthResponse | null;
  messageCount = 0;

  constructor(
    private readonly router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.currentURL = this.router.url;
    this.credentials = this.authService.getCredentials();
  }

  ngOnInit(): void {
    this.messageService.unReadMessageCount().subscribe((response) => {
      if (response.success) {
        this.messageCount = response.data;
      }
    });
  }
}
