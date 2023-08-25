import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.autoLogin()?.subscribe((user) => {
      if (user) {
        // nvaigate to home page
        this.router.navigate(['/']);
      }
    });
  }
}
