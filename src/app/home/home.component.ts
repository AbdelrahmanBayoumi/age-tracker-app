import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as BirthdayActions from '../birthday/store/birthday.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: ElementRef | undefined;
  private userSub: Subscription | null = null;
  userVerified = false;
  startSearch = false;
  searchQuery = '';

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.userVerified = user.isVerified;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
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
    this.authService.sendVerificationEmail().subscribe(() => {
      console.log('Verification email sent');
    });
  }

  onStartSearch() {
    this.startSearch = true;
  }

  onSearch() {
    console.log('searchQuery', this.searchQuery);
    this.store.dispatch(
      BirthdayActions.searchByName({ name: this.searchQuery })
    );
  }

  onCancelSearch() {
    this.startSearch = false;
    this.searchQuery = '';
    this.store.dispatch(BirthdayActions.searchByName({ name: '' }));
  }

  onAddBirthday() {
    this.router.navigate(['/add-birthday']);
  }
}
