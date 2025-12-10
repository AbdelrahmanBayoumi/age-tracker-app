import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as BirthdayActions from '../birthday/store/birthday.actions';
import { environment } from 'src/environments/environment';
import { Birthday } from '../birthday/model/birthday.model';
import { LanguageService } from '../shared/language.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  version = environment.version;
  @ViewChild('drawer') drawer: ElementRef | undefined;
  private userSub: Subscription | null = null;
  private storeSub: Subscription | null = null;
  userVerified = true;
  startSearch = false;
  searchQuery = '';
  isLoading = true;
  errorMessage = '';
  currentUserBirthday: Birthday | null = null;
  otherLanguage = 'عربي';

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private languageService: LanguageService
  ) {
    this.otherLanguage = this.languageService.otherLanguage;
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.userVerified = user.isVerified;
        this.currentUserBirthday = new Birthday(-1, user.fullName, user.birthday, 'Me', '', user.image);
      }
    });

    this.storeSub = this.store.select('birthdays').subscribe(birthdaysState => {
      // Stale-While-Revalidate Logic:
      // Show loading spinner ONLY if we have NO data.
      // If we have data, we show it immediately while fetching updates in the background.
      this.isLoading = birthdaysState.loading && birthdaysState.birthdays.length === 0;
      this.errorMessage = birthdaysState.errMsg;
    });

    // Always fetch data to ensure freshness (Background Refresh)
    // We only dispatch if we are NOT already loading to avoid duplicate requests
    this.store
      .select('birthdays')
      .pipe(take(1))
      .subscribe(birthdaysState => {
        if (!birthdaysState.loading) {
          this.store.dispatch(BirthdayActions.fetchBirthdaysStart());
          this.store.dispatch(BirthdayActions.fetchBirthdays());
        }
      });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.storeSub?.unsubscribe();
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
