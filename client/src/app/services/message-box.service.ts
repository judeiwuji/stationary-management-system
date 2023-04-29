import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import {
  IMessageBoxOptions,
  MessageBoxResponse,
  MessageBoxTypes,
} from '../model/message-box';

@Injectable({
  providedIn: 'root',
})
export class MessageBoxService {
  constructor(private readonly modal: NgbModal) {}

  show(
    options: IMessageBoxOptions = {
      type: MessageBoxTypes.INFO,
      onCancel: () => {},
      onDismiss: () => {},
      onConfirm: () => {},
    }
  ) {
    const instance = this.modal.open(MessageBoxComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    instance.componentInstance.options = options;
    instance.result.then((response: MessageBoxResponse) => {
      switch (response) {
        case MessageBoxResponse.OK:
          options.onConfirm();
          break;
        case MessageBoxResponse.CANCEL:
          options.onCancel();
          break;
        case MessageBoxResponse.DISMISS:
          options.onCancel();
          break;
      }
    });
  }
}
