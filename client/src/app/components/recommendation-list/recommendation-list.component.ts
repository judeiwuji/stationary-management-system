import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentAlt,
  faList,
  faPen,
  faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageBoxTypes } from 'src/app/model/message-box';
import { IRecommendation } from 'src/app/model/recommendation';
import { RequisitionStatus } from 'src/app/model/requisition';
import { RequisitionDetailComponent } from 'src/app/requisition-detail/requisition-detail.component';
import { MessageBoxService } from 'src/app/services/message-box.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { CommentsComponent } from '../comments/comments.component';
import { AuthService } from 'src/app/services/auth.service';
import { IAuthResponse } from 'src/app/model/auth';

@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
  styleUrls: ['./recommendation-list.component.css'],
})
export class RecommendationListComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faChevronDown = faChevronDown;
  faList = faList;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  faComment = faComment;
  faCommentAlt = faCommentAlt;

  sorts: any = {};
  recommendations: IRecommendation[] = [];
  currentPage = 1;
  totalPages = 0;
  processing!: boolean;
  RequisitionStatus = RequisitionStatus;
  requisitionStatus = Object.values(RequisitionStatus);

  @Input()
  filters: { status?: string } = {};

  @Input()
  showMenu = false;

  credentials!: IAuthResponse | null;
  constructor(
    private recommendationService: RecommendationService,
    private requitionService: RequisitionService,
    private modal: NgbModal,
    private messageBoxService: MessageBoxService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
    this.credentials = this.authService.getCredentials();
  }

  loadRecommendations(page = 1) {
    this.recommendationService
      .getRecommendations(page, JSON.stringify(this.filters))
      .subscribe((response) => {
        if (response.success) {
          this.currentPage = page;
          this.recommendations.push(...response.results);
          this.totalPages = response.totalPages;
        }
      });
  }

  deleteRecommendation(recommendation: IRecommendation) {
    if (this.processing) return;
    this.messageBoxService.show({
      message: `Are you sure you want to delete this recommendation with id: <strong class="text-capitalize">${recommendation.id}</strong>?`,
      onCancel: () => {},
      onConfirm: () => {
        this.processing = true;
        this.toastr.info('Deleting...', '', { timeOut: 0 });
        this.recommendationService
          .deleteRecommendation(recommendation.id)
          .subscribe({
            next: (response) => {
              this.toastr.clear();
              if (response.success) {
                this.toastr.clear();
                this.toastr.success('Deleted');
                const index = this.recommendations.findIndex(
                  (d) => d.id === recommendation.id
                );
                if (index !== -1) {
                  this.recommendations.splice(index, 1);
                }
              }
            },
            error: (err) => {
              this.toastr.clear();
              this.toastr.warning(err.error);
            },
          });
      },
      onDismiss: () => {},
      type: MessageBoxTypes.PROMPT,
    });
  }

  viewDetails(recommendation: IRecommendation) {
    this.requitionService
      .getRequisition(recommendation.requisitionId)
      .subscribe((response) => {
        if (response.success) {
          recommendation.requisition = response.data;
          const instance = this.modal.open(RequisitionDetailComponent, {
            size: 'md',
            backdrop: 'static',
          });

          instance.componentInstance.requisition = recommendation.requisition;
          instance.componentInstance.recommendation = recommendation;
        }
      });
  }

  viewComments(recommendation: IRecommendation) {
    const instance = this.modal.open(CommentsComponent, {
      size: 'md',
      backdrop: 'static',
    });

    instance.componentInstance.requisition = recommendation.requisition;
  }

  filterBy(status: string) {
    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.recommendations = [];
    this.loadRecommendations(1);
  }
}
