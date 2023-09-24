import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';
import * as fromApp from '../../../store/app.reducer';
import * as BirthdayActions from '../../../birthday/store/birthday.actions';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { BirthdayStatistics } from 'src/app/birthday/model/birthday-statistics.model';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-birthday-details',
  templateUrl: './birthday-details.component.html',
  styleUrls: ['./birthday-details.component.css'],
})
export class BirthdayDetailsCompnent implements OnInit, OnDestroy {
  birthday: Birthday | undefined;
  id: number | undefined;
  birthdayStat: BirthdayStatistics | undefined;
  userPhotoUrl: string | undefined = '';
  storeSub0: any;
  storeSub: any;
  isLoading = false;
  isMe = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  private initBirthday(birthday: Birthday) {
    if (!birthday) return;
    this.birthday = birthday;
    this.birthdayStat = new BirthdayStatistics(new Date(birthday.birthday));
    this.userPhotoUrl = birthday.image;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }
    });

    this.storeSub0 = this.store
      .select('birthdays')
      .subscribe((birthdaysState) => {
        if (birthdaysState.viewedBirthday) {
          console.log('viewedBirthday: ', birthdaysState.viewedBirthday);
          this.initBirthday(birthdaysState.viewedBirthday);
        } else {
          this.route.params
            .pipe(
              switchMap((params) => {
                if (params['id'] === 'me') {
                  this.isMe = true;
                  const user = this.authService.user.value;
                  if (!user) {
                    return of(null);
                  }

                  return of(
                    new Birthday(
                      -1,
                      user.fullName,
                      user.birthday,
                      'Me',
                      '',
                      user.image
                    )
                  );
                } else {
                  this.id = +params['id'];
                  this.isMe = false;
                  return this.store.select('birthdays').pipe(
                    map((birthdaysState) => {
                      const birthday = birthdaysState.birthdays.find(
                        (birthday, index) => {
                          return birthday.id === this.id;
                        }
                      );

                      if (
                        birthdaysState &&
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
            .subscribe((birthday) => {
              this.initBirthday(birthday!);
            });
        }
      });


  }

  onEditBirthday() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  async onDeleteBirthday() {
    const result = await Swal.fire({
      title: 'Delete Birthday?',
      text: 'You will not be able to recover this birthday!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'No, keep it',
    });
    if (result.value) {
      this.store.dispatch(BirthdayActions.deleteBirthday({ id: this.id! }));

      this.storeSub = this.store
        .select('birthdays')
        .subscribe(async (birthdaysState) => {
          this.isLoading = birthdaysState.loading;

          if (!this.isLoading) {
            await Swal.fire(
              'Deleted!',
              'Birthday has been deleted.',
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
