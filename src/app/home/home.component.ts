import { logout } from './../auth/store/auth.actions';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authSvc: AuthService) {}

  get isLoggedIn() {
    return this.authSvc.isLoggedIn;
  }

  logout() {
    this.authSvc.logout();
  }
}
