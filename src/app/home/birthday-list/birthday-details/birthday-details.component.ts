import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import { BirthdayStatistics } from '../../../birthday/model/birthday-statistics.model';
import { Birthday } from '../../../birthday/model/birthday.model';
import * as BirthdayActions from '../../../birthday/store/birthday.actions';
import * as fromApp from '../../../store/app.reducer';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-birthday-details',
  templateUrl: './birthday-details.component.html',
  styleUrls: ['./birthday-details.component.css'],
  standalone: false,
})
export class BirthdayDetailsComponent implements OnInit, OnDestroy {
  birthday: Birthday | undefined;
  id: number | undefined;
  birthdayStat: BirthdayStatistics | undefined;
  userPhotoUrl: string | undefined = '';
  storeSub0: Subscription | undefined;
  storeSub: Subscription | undefined;
  isLoading = false;
  isMe = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private translate: TranslateService
  ) {}

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

    this.storeSub0 = this.store.select('birthdays').subscribe(birthdaysState => {
      if (birthdaysState.viewedBirthday) {
        console.log('viewedBirthday: ', birthdaysState.viewedBirthday);
        this.initBirthday(birthdaysState.viewedBirthday);
      } else {
        this.route.params
          .pipe(
            switchMap(params => {
              if (params['id'] === 'me') {
                this.isMe = true;
                const user = this.authService.user.value;
                if (!user) {
                  return of(null);
                }

                return of(new Birthday(-1, user.fullName, user.birthday, 'Me', '', user.image));
              } else {
                this.id = +params['id'];
                this.isMe = false;
                return this.store.select('birthdays').pipe(
                  map(birthdaysState => {
                    const birthday = birthdaysState.birthdays.find((birthday, index) => {
                      return birthday.id === this.id;
                    });

                    // Only redirect if NOT loading and finding nothing
                    if (
                      !birthdaysState.loading &&
                      birthdaysState.birthdays &&
                      birthdaysState.birthdays.length > 0 &&
                      !birthday
                    ) {
                      this.backToHome();
                    }
                    return birthday;
                  })
                );
              }
            })
          )
          .subscribe(birthday => {
            if (birthday) {
              this.initBirthday(birthday);
            }
          });
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
      this.store.dispatch(BirthdayActions.deleteBirthday({ id: this.id! }));

      this.storeSub = this.store.select('birthdays').subscribe(async birthdaysState => {
        this.isLoading = birthdaysState.loading;

        if (!this.isLoading) {
          await Swal.fire(
            this.translate.instant('DELETE_BIRTHDAY_SUCCESS_MESSAGE'),
            this.translate.instant('DELETE_BIRTHDAY_SUCCESS_MESSAGE'),
            'success'
          );
          this.backToHome();
        }
      });
    }
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.storeSub0?.unsubscribe();
    this.storeSub?.unsubscribe();
  }
}
