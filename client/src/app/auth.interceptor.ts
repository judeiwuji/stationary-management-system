import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          let token = event.headers.get('x-access');
          token = !token ? event.headers.get('x-access-refresh') : token;

          if (token) {
            this.authService.saveToken(token);
          }
        }
        return event;
      }),
      catchError((err, event) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.clearSession();
            this.router.navigateByUrl('/');
          }
        }

        return throwError(() => err);
      })
    );
  }
}
