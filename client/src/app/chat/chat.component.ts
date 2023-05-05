import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { IMessage } from '../model/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
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
  chatInterval: any;
  lastChatCheck = Date.now();

  constructor(
    private readonly modal: NgbModal,
    private readonly inboxService: InboxService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  clearChatInterval() {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
      this.chatInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearChatInterval();
  }

  ngOnInit(): void {
    this.getInbox(this.activatedRoute.snapshot.params['id']);
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.getInbox(id);
    });
    this.loadInbox();

    this.clearChatInterval();
    this.chatInterval = setInterval(() => {
      this.inboxService
        .hasNewInboxMessages(this.lastChatCheck)
        .subscribe((response) => {
          console.log(response);
          this.lastChatCheck = Date.now();
          if (response.success) {
            for (const inbox of response.results) {
              const index = this.inboxes.findIndex(
                (d) => d.inboxId === inbox.inboxId
              );

              if (index !== -1) {
                this.inboxes.splice(index, 1);
                this.inboxes.unshift(inbox);
                if (this.selectedInbox.inboxId === inbox.inboxId) {
                  this.selectInbox(inbox);
                }
              } else {
                this.inboxes.unshift(inbox);
              }
            }
          }
        });
    }, 20000);
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

    const chat = this.inboxes.find((d) => d.inboxId === inbox.inboxId);
    if (
      chat &&
      chat.messages &&
      chat.messages.length > 0 &&
      !chat.messages[0].isOwner
    ) {
      chat.messages[0].status = 1;
    }
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

  onNewMessage(message: IMessage) {
    const inbox = this.inboxes.find((d) => d.inboxId === message.inboxId);
    if (inbox) {
      inbox.messages.splice(0, 1);
      inbox.messages.push(message);
    }
  }
}
