import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenStorageService } from '../core/services/token-storage.service';
import { AuthService } from './auth.service';
import { Tokens } from './model/user.model';

@Injectable()
export class CheckAuthAfterRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenStorage = inject(TokenStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Exclude auth-sensitive URLs from triggering refresh token logic
          if (
            req.url.includes('/change-password') ||
            req.url.includes('/forget-password') ||
            req.url.includes('/auth/login') ||
            req.url.includes('/auth/signup') ||
            req.url.includes('/auth/refresh') ||
            req.url.includes('/auth/logout')
          ) {
            return throwError(() => error);
          } else {
            return this.handle401Error(req, next);
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokens: Tokens) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokens.access_token);
          return next.handle(this.addToken(req, tokens.access_token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          // Notify any queued requests of failure to avoid hanging
          this.refreshTokenSubject.error(err);
          this.refreshTokenSubject = new BehaviorSubject<string | null>(null);
          // Local logout cleanup without making redundant network request
          this.authService.afterLogoutRequest();
          this.router.navigate(['/auth']);
          return throwError(() => err);
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token?: string): HttpRequest<any> {
    const accessToken = token || this.tokenStorage.getAccessToken();
    if (accessToken) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return req;
  }
}
