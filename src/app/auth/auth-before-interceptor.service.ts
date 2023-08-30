import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // check if access_token is in localStorage
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (!access_token && !refresh_token) {
      return next.handle(req);
    }

    let modifiedReq;
    if (req.url.includes('/refresh')) {
      return next.handle(req);
    } else {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    }
    return next.handle(modifiedReq);
  }
}
