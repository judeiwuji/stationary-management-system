import { Injectable } from '@angular/core';
import { IAuthRequest, IAuthResponse } from '../model/auth';
import { HttpClient } from '@angular/common/http';
import { IFeedback } from '../model/feedback';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = `${environment.apiURL}/auth`;
  AUTH_TOKEN = 'sms__auth_token';
  AUTH_CREDENTIALS = 'sms__auth_credentials';
  constructor(private http: HttpClient) {}

  login(request: IAuthRequest) {
    return this.http.post<IFeedback<IAuthResponse>>(
      `${this.api}/login`,
      request
    );
  }

  logout() {
    this.clearSession();
    return this.http.post<IFeedback<string>>(`${this.api}/logout`, {});
  }

  clearSession() {
    localStorage.removeItem(this.AUTH_TOKEN);
    localStorage.removeItem(this.AUTH_CREDENTIALS);
  }

  saveToken(token: string) {
    localStorage.setItem(this.AUTH_TOKEN, token);
    const data = this.getCredentials();
    if (data) {
      data.token = token;
      this.saveCredentials(data);
    }
  }

  getToken() {
    return localStorage.getItem(this.AUTH_TOKEN);
  }

  saveCredentials(data: IAuthResponse) {
    localStorage.setItem(this.AUTH_CREDENTIALS, JSON.stringify(data));
  }

  getCredentials(): IAuthResponse | null {
    const raw = localStorage.getItem(this.AUTH_CREDENTIALS);
    let data: IAuthResponse | null = null;
    if (raw) {
      data = JSON.parse(raw);
    }
    return data;
  }
}
