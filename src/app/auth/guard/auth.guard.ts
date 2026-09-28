import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private tokenStorage = inject(TokenStorageService);

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree {
    const accessToken = this.tokenStorage.getAccessToken();
    if (!accessToken) {
      return this.router.createUrlTree(['/auth']);
    }
    return true;
  }
}

export const guestGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  if (tokenStorage.hasTokens()) {
    return router.createUrlTree(['/home']);
  }
  return true;
};
