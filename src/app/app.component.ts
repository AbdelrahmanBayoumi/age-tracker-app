import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { LanguageService } from './shared/language.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  private userSub: Subscription | undefined;

  constructor(private authService: AuthService, languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.autoLogin()?.subscribe();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
