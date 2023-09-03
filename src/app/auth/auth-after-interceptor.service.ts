import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class CheckAuthAfterRequestInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap({
        next: (event) => {},
        // Operation failed; error is an HttpErrorResponse
        error: (error) => {
          // if it is /change-password no nothing
          if (req.url.includes('/change-password') || req.url.includes('/forget-password')) {
            return;
          }
          if (error.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            this.authService.refreshToken().pipe(catchError(() => {
              this.router.navigate(['/auth']);
              return [];
            })).subscribe();
          }
        },
      })
    );
  }
}
