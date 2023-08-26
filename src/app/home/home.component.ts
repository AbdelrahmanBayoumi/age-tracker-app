import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  appName = 'متتبع الأعمار';
  private userSub: Subscription | null = null;
  userData: string = '';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/auth']);
      } else {
        this.userData = JSON.stringify(user);
        this.isLoggedIn = !!user;
      }
    });
    // TODO: handle if the account is unverified
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }

  onChooseRelation() {
    console.log('onChooseRelation');
  }
}
