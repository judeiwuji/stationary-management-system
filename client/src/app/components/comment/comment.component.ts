import { Component, Input } from '@angular/core';
import { IComment } from 'src/app/model/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  @Input()
  comment!: IComment;
}
