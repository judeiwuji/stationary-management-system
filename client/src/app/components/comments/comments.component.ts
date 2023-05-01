import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faComments,
  faPaperPlane,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IComment } from 'src/app/model/comment';
import { IRequisition } from 'src/app/model/requisition';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input()
  requisition!: IRequisition;
  totalPages = 0;
  currentPage = 1;
  comments: IComment[] = [];
  faPaperPlane = faPaperPlane;
  faComments = faComments;
  faSpinner = faSpinner;
  processing = false;
  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });
  firstTimeLoadCompleted = false;

  constructor(
    private readonly commentService: CommentService,
    private readonly activeModal: NgbActiveModal,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  close() {
    this.activeModal.dismiss();
  }

  loadComments(page = 1) {
    this.commentService
      .getComments(this.requisition.id as number, page)
      .subscribe((response) => {
        if (response.success) {
          this.comments.push(...response.results);
          this.totalPages = response.totalPages;
          this.currentPage = this.currentPage;
        }
        this.firstTimeLoadCompleted = true;
      });
  }

  comment() {
    if (this.commentForm.invalid) {
      return;
    }
    if (this.processing) return;

    this.processing = true;
    this.commentService
      .createComment({
        content: this.commentForm.controls['content'].value as string,
        requisitionId: this.requisition.id,
      })
      .subscribe({
        next: (response) => {
          this.processing = false;
          this.toastr.clear();
          if (response.success) {
            this.comments.unshift(response.data);
            this.commentForm.reset({ content: '' });
          } else {
            this.toastr.warning(response.message);
          }
        },
        error: (err) => {
          this.processing = false;
          this.toastr.clear();
          this.toastr.warning(err.error);
        },
      });
  }
}
