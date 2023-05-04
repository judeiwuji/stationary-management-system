import { Component, Input } from '@angular/core';
import { IReceipt } from '../model/purchase';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-receipt-image',
  templateUrl: './receipt-image.component.html',
  styleUrls: ['./receipt-image.component.css'],
})
export class ReceiptImageComponent {
  @Input()
  receipt!: IReceipt;
  faTimes = faTimes;

  constructor(private readonly activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.dismiss();
  }
}
