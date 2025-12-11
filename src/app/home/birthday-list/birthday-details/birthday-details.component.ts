import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import { BirthdayStatistics } from '../../../birthday/model/birthday-statistics.model';
import { Birthday } from '../../../birthday/model/birthday.model';
import * as BirthdayActions from '../../../birthday/store/birthday.actions';
import { selectBirthdays, selectLoading, selectViewedBirthday } from '../../../birthday/store/birthday.selectors';

@Component({
  selector: 'app-birthday-details',
  templateUrl: './birthday-details.component.html',
  styleUrls: ['./birthday-details.component.scss'],
  standalone: false,
})
export class BirthdayDetailsComponent implements OnInit, OnDestroy {
  birthday: Birthday | undefined;
  id: number | undefined;
  birthdayStat: BirthdayStatistics | undefined;
  userPhotoUrl: string | undefined = '';
  isMe = false;

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  private viewedBirthday = this.store.selectSignal(selectViewedBirthday);
  private birthdays = this.store.selectSignal(selectBirthdays);
  isLoading = this.store.selectSignal(selectLoading);

  private routeSub: any;
  private deleteWasLoading = false;

  constructor() {
    // Effect to handle viewed birthday updates
    effect(() => {
      const viewed = this.viewedBirthday();
      if (viewed) {
        console.log('viewedBirthday: ', viewed);
        this.initBirthday(viewed);
      }
    });

    // Effect to track loading state changes for delete operation
    effect(async () => {
      const loading = this.isLoading();
      if (this.deleteWasLoading && !loading) {
        await Swal.fire(
          this.translate.instant('DELETE_BIRTHDAY_SUCCESS_MESSAGE'),
          this.translate.instant('DELETE_BIRTHDAY_SUCCESS_MESSAGE'),
          'success'
        );
        this.backToHome();
        this.deleteWasLoading = false;
      }
    });
  }

  private initBirthday(birthday: Birthday) {
    if (!birthday) return;
    this.birthday = birthday;
    this.birthdayStat = new BirthdayStatistics(new Date(birthday.birthday), this.translate.currentLang);
    this.userPhotoUrl = birthday.image;
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }
    });

    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] === 'me') {
        this.isMe = true;
        const user = this.authService.user();
        if (user) {
          const meBirthday = new Birthday(-1, user.fullName, user.birthday, 'Me', '', user.image);
          this.initBirthday(meBirthday);
        }
      } else {
        this.id = +params['id'];
        this.isMe = false;

        // Find birthday from current state
        const birthdaysList = this.birthdays();
        const birthday = birthdaysList.find(b => b.id === this.id);

        if (birthday) {
          this.initBirthday(birthday);
        } else if (!this.isLoading() && birthdaysList.length > 0) {
          // Only redirect if NOT loading and finding nothing
          this.backToHome();
        }
      }
    });
  }

  onEditBirthday() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  async onDeleteBirthday() {
    const result = await Swal.fire({
      title: this.translate.instant('DELETE_BIRTHDAY_TITLE'),
      text: this.translate.instant('DELETE_BIRTHDAY_MESSAGE'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('DELETE_BIRTHDAY_CONFIRMATION'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: this.translate.instant('DELETE_BIRTHDAY_CANCEL'),
    });
    if (result.value) {
      this.deleteWasLoading = true;
      this.store.dispatch(BirthdayActions.deleteBirthday({ id: this.id! }));
    }
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
