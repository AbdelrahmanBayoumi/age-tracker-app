import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.autoLogin()?.subscribe();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
