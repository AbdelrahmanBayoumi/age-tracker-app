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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: ElementRef | undefined;
  private userSub: Subscription | null = null;

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/auth']);
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

  onCloseDrawer() {
    this.drawer?.nativeElement.classList.remove('drawer-open');
  }

  onOpenDrawer() {
    this.drawer?.nativeElement.classList.add('drawer-open');
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
