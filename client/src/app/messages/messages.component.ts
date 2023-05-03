import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IInbox, IInboxActionRequest } from '../model/inbox';
import { MessageService } from '../services/message.service';
import { IMessage, IMessageActionRequest } from '../model/message';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  // @Input()
  inbox!: IInbox;

  messages: IMessage[] = [];
  totalPages = 0;
  currentPage = 1;

  messageForm = new FormGroup({
    content: new FormControl(),
  });
  processing = false;

  @Output()
  onInbox = new EventEmitter<IInbox>();
  constructor(
    private readonly messageService: MessageService,
    private readonly toastr: ToastrService
  ) {}

  @Input()
  onSelectInbox!: Observable<IInbox>;

  ngOnInit(): void {
    this.onSelectInbox.subscribe((inbox) => {
      this.inbox = inbox;
      this.messages = [];
      this.totalPages = 0;
      this.currentPage = 1;
      this.loadMessages();
    });
  }

  loadMessages(page = 1) {
    this.messageService
      .getMessages(page, this.inbox.inboxId)
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.messages.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  sendMessage() {
    if (this.processing) return;
    const message: IMessageActionRequest & IInboxActionRequest = {
      content: this.messageForm.controls.content.value,
      inboxId: this.inbox.inboxId,
      otherId: this.inbox.otherId,
    };

    this.processing = true;
    this.messageService.createMessage(message, this.inbox.inboxId).subscribe({
      next: (response) => {
        this.processing = false;
        if (response.success) {
          this.messages.unshift(response.data);
          this.messageForm.reset({ content: '' });
          if (response.data.inbox) {
            this.inbox = response.data.inbox;
            this.onInbox.emit(this.inbox);
          }
        } else {
          this.toastr.warning(response.message);
        }
      },
      error: (err) => {
        this.toastr.warning(err.error);
        this.processing = false;
      },
    });
  }
}
