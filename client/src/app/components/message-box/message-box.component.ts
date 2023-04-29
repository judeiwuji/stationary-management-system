import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IMessageBoxOptions,
  MessageBoxResponse,
  MessageBoxTypes,
} from 'src/app/model/message-box';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
})
export class MessageBoxComponent {
  @Input()
  options!: IMessageBoxOptions;
  MessageBoxTypes = MessageBoxTypes;

  constructor(private readonly activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close(MessageBoxResponse.DISMISS);
  }

  confirm() {
    this.activeModal.close(MessageBoxResponse.OK);
  }

  cancel() {
    this.activeModal.close(MessageBoxResponse.CANCEL);
  }
}
