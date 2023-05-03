import { Component, OnInit } from '@angular/core';
import {
  faCheck,
  faCheckDouble,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatSearchUsersComponent } from '../chat-search-users/chat-search-users.component';
import { IUser } from '../model/user';
import { ChatViews } from '../model/chat';
import { InboxService } from '../services/inbox.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IInbox } from '../model/inbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  faCheck = faCheck;
  faCheckDouble = faCheckDouble;
  faCommentAlt = faCommentAlt;
  isMainView = false;
  isMessagesView = false;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  inboxes: IInbox[] = [];
  totalPages = 0;
  currentPage = 1;
  selectedInbox!: IInbox;
  onSelectInbox = new Subject<IInbox>();

  constructor(
    private readonly modal: NgbModal,
    private readonly inboxService: InboxService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getInbox(this.activatedRoute.snapshot.params['id']);
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.getInbox(id);
    });
    this.loadInbox();
  }

  getInbox(id: number) {
    if (id) {
      this.inboxService.getInbox(id).subscribe((response) => {
        if (response.success) {
          if (response.data) {
            this.selectInbox(response.data);
          } else {
            const inbox: any = {
              id: 0,
              inboxId: 0,
              messages: [],
              otherId: Number(id),
              userId: 0,
            };
            this.selectInbox(inbox);
          }
        }
      });
    } else {
      this.setView(ChatViews.MAIN);
    }
  }

  searchUser() {
    const instance = this.modal.open(ChatSearchUsersComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.result.then((user?: IUser) => {
      if (user) {
        const inbox: IInbox = {
          id: 0,
          inboxId: 0,
          messages: [],
          other: user,
          otherId: Number(user.id),
          userId: 0,
        };
        this.selectInbox(inbox);
      }
    });
  }

  setView(mode: ChatViews) {
    this.isMainView = mode === ChatViews.MAIN;
    this.isMessagesView = mode === ChatViews.MESSAGES;
  }

  loadInbox(page = 1) {
    this.inboxService.getInboxes(page).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.inboxes.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  selectInbox(inbox: IInbox) {
    this.selectedInbox = inbox;
    this.setView(ChatViews.MESSAGES);
    this.onSelectInbox.next(inbox);
  }

  newInbox(inbox: IInbox) {
    this.inboxes.unshift(inbox);
  }

  gotoChat(inbox: IInbox) {
    this.router.navigateByUrl(`/chat/${inbox.otherId}`, {
      replaceUrl: true,
      onSameUrlNavigation: 'reload',
    });
  }
}
