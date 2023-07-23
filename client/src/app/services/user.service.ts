import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../model/user';
import { IFeedback } from '../model/feedback';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = `${environment.apiURL}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number, search = '') {
    return this.http.get<IFeedback<IUser>>(`${this.api}?search=${search}`);
  }

  createUser(user: IUser) {
    return this.http.post<IFeedback<IUser>>(`${this.api}`, user);
  }

  updateUser(user: IUser) {
    return this.http.put<IFeedback<IUser>>(`${this.api}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete<IFeedback<IUser>>(`${this.api}/${id}`);
  }

  identifyUser(request: { email: string }) {
    return this.http.get<IUser>(`${this.api}/identify`, {
      params: request,
    });
  }

  resetPassword(request: { userId: number; newPassword: string }) {
    return this.http.post<{ status: boolean }>(
      `${this.api}/reset/password`,
      request
    );
  }
}
