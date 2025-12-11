import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LanguageService } from '../shared/language.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
})
export class AuthComponent {
  version = environment.version;
  otherLanguage;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.otherLanguage = this.languageService.otherLanguage;

    // Use effect() to navigate when user signal changes
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }

  onChangeLanguage() {
    this.languageService.switchLanguage();
    this.otherLanguage = this.languageService.otherLanguage;
  }
}
