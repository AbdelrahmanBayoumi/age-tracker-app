import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Birthday } from '../birthday/model/birthday.model';
import * as BirthdayActions from '../birthday/store/birthday.actions';
import { selectErrorMessage, selectIsInitialLoading, selectLoading } from '../birthday/store/birthday.selectors';
import { LanguageService } from '../shared/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  version = environment.version;
  @ViewChild('drawer') drawer: ElementRef | undefined;
  startSearch = false;
  searchQuery = '';
  otherLanguage = 'عربي';

  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private languageService = inject(LanguageService);

  isLoading = this.store.selectSignal(selectIsInitialLoading);
  errorMessage = this.store.selectSignal(selectErrorMessage);

  userVerified = computed(() => this.authService.user()?.isVerified ?? true);
  currentUserBirthday = computed(() => {
    const user = this.authService.user();
    if (user) {
      return new Birthday(-1, user.fullName, user.birthday, 'Me', '', user.image);
    }
    return null;
  });

  constructor() {
    this.otherLanguage = this.languageService.otherLanguage;
  }

  ngOnInit(): void {
    // Always fetch data to ensure freshness (Background Refresh)
    // We only dispatch if we are NOT already loading to avoid duplicate requests
    const loading = this.store.selectSignal(selectLoading);
    if (!loading()) {
      this.store.dispatch(BirthdayActions.fetchBirthdaysStart());
      this.store.dispatch(BirthdayActions.fetchBirthdays());
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }

  onCloseDrawer() {
    this.drawer?.nativeElement.classList.remove('drawer-open');
  }

  onOpenDrawer() {
    this.drawer?.nativeElement.classList.add('drawer-open');
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  sendVerificationEmail(buttonElement: HTMLButtonElement) {
    buttonElement.disabled = true;
    this.authService.resendVerificationEmail().subscribe(() => {
      console.log('Verification email sent');
    });
  }

  onStartSearch() {
    this.startSearch = true;
  }

  onSearch() {
    console.log('searchQuery', this.searchQuery);
    this.store.dispatch(BirthdayActions.searchByName({ name: this.searchQuery }));
  }

  onCancelSearch() {
    this.startSearch = false;
    this.searchQuery = '';
    this.store.dispatch(BirthdayActions.searchByName({ name: '' }));
  }

  onAddBirthday() {
    this.router.navigate(['/birthday/add-birthday']);
  }

  onChangeLanguage() {
    this.languageService.switchLanguage();
    this.otherLanguage = this.languageService.otherLanguage;
  }
}
