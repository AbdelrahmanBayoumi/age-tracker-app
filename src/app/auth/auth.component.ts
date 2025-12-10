import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LanguageService } from '../shared/language.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: false,
})
export class AuthComponent implements OnDestroy, OnInit {
  version = environment.version;
  private userSub: Subscription | undefined;
  otherLanguage;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.otherLanguage = this.languageService.otherLanguage;
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onChangeLanguage() {
    this.languageService.switchLanguage();
    this.otherLanguage = this.languageService.otherLanguage;
  }
}
