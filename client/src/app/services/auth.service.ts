import { Injectable } from '@angular/core';
import { IAuthRequest, IAuthResponse } from '../model/auth';
import { HttpClient } from '@angular/common/http';
import { IFeedback } from '../model/feedback';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${environment.apiURL}/auth`;
  private static AUTH_TOKEN = 'sms__auth_token';
  private static AUTH_CREDENTIALS = 'sms__auth_credentials';
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
    localStorage.removeItem(AuthService.AUTH_TOKEN);
    localStorage.removeItem(AuthService.AUTH_CREDENTIALS);
  }

  saveToken(token: string) {
    localStorage.setItem(AuthService.AUTH_TOKEN, token);
    const data = AuthService.getCredentials();
    if (data) {
      data.token = token;
      this.saveCredentials(data);
    }
  }

  getToken() {
    return localStorage.getItem(AuthService.AUTH_TOKEN);
  }

  saveCredentials(data: IAuthResponse) {
    localStorage.setItem(AuthService.AUTH_CREDENTIALS, JSON.stringify(data));
  }

  static getCredentials(): IAuthResponse | null {
    const raw = localStorage.getItem(AuthService.AUTH_CREDENTIALS);
    let data: IAuthResponse | null = null;
    if (raw) {
      data = JSON.parse(raw);
    }
    return data;
  }
}
