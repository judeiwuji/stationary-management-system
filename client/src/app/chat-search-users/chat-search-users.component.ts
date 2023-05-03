import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IUser } from '../model/user';

@Component({
  selector: 'app-chat-search-users',
  templateUrl: './chat-search-users.component.html',
  styleUrls: ['./chat-search-users.component.css'],
})
export class ChatSearchUsersComponent implements OnInit {
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  users: IUser[] = [];
  totalPages = 0;
  currentPage = 1;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = 1) {
    const search = this.searchForm.controls['search'].value || '';
    this.userService.getUsers(page, search).subscribe((response) => {
      if (response.success) {
        this.currentPage = page;
        this.users.push(...response.results);
        this.totalPages = response.totalPages;
      }
    });
  }

  search() {
    this.users = [];
    this.loadUsers(1);
  }

  close() {
    this.activeModal.dismiss();
  }

  selectUser(user: IUser) {
    this.activeModal.close(user);
  }
}
