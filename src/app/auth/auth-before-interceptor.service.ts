import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../core/services/token-storage.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private tokenStorage = inject(TokenStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
      return next.handle(req);
    }

    const accessToken = this.tokenStorage.getAccessToken();
    if (!accessToken) {
      return next.handle(req);
    }

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(modifiedReq);
  }
}
