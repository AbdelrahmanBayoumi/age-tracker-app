import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoading = false;
  isLoggedIn = false;

  constructor(private route: Router) {}

  login() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isLoggedIn = true;
      this.route.navigate(['/home']);
    }, 2000);
  }

  logout() {
    this.isLoggedIn = false;
  }
}
