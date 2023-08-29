import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class CheckAuthAfterRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap({
        next: (event) => {},
        // Operation failed; error is an HttpErrorResponse
        error: (error) => {
          console.log('before error', localStorage.getItem('access_token'));
          if (error.status === 401) {
            localStorage.removeItem('access_token');
            // TODO: if response is 401 Unauthorized, then call refresh-token endpoint
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
          console.log('after error', localStorage.getItem('access_token'));
        },
      })
    );
  }
}
