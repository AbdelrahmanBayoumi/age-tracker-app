import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // check if access_token is in localStorage
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      return next.handle(req);
    }
    // if access_token is in localStorage, add it to the request headers
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return next.handle(modifiedReq);
  }
}
