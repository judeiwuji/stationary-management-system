import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedback } from '../model/feedback';
import { IDepartment } from '../model/department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  api = `${environment.apiURL}/departments`;

  constructor(private http: HttpClient) {}

  getDepartments(page: number, search = '') {
    return this.http.get<IFeedback<IDepartment>>(
      `${this.api}?page=${page}&search=${search}`
    );
  }

  createDepartment(dept: IDepartment) {
    return this.http.post<IFeedback<IDepartment>>(`${this.api}`, dept);
  }

  updateDepartment(dept: IDepartment) {
    return this.http.put<IFeedback<IDepartment>>(`${this.api}`, dept);
  }

  deleteDepartment(id: number) {
    return this.http.delete<IFeedback<IDepartment>>(`${this.api}/${id}`);
  }
}
