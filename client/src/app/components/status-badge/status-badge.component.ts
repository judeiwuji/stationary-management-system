import { Component, Input } from '@angular/core';
import { RequisitionStatus } from 'src/app/model/requisition';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
})
export class StatusBadgeComponent {
  RequisitionStatus = RequisitionStatus;

  @Input()
  status?: string;
}
