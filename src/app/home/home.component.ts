import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription, map, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private userSub: Subscription | null = null;
  userData: string = '';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      console.log(user);

      if (!user) {
        this.router.navigate(['/auth']);
      }
      this.userData = JSON.stringify(user);
      this.isLoggedIn = !!user;
    });

    console.log("------------------------------------------");

    // setTimeout(() => {
    //   this.authService.autoLogin();
    // }, 2000);
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
  }

  // get isLoggedIn() {
  //   return this.authService.user.pipe(
  //     take(1),
  //     map((user) => {
  //       console.log(user);
  //       // !!user returns true if user is not null
  //       return !!user;
  //     })
  //   );
  // }

  // get userData() {
  //   return this.authService.user.pipe(
  //     take(1),
  //     map((user) => {
  //       // !!user returns true if user is not null
  //       if (user) {
  //         console.log(user);

  //         return JSON.stringify(user);
  //       } else {
  //         return '';
  //       }
  //     })
  //   );
  // }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
