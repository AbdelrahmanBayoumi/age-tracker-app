import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';
import * as fromApp from '../../../store/app.reducer';
import * as BirthdayActions from '../../../birthday/store/birthday.actions';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { GeorgianDateStatistics } from 'src/app/birthday/model/georgian-date-statistics.model';

@Component({
  selector: 'app-birthday-details',
  templateUrl: './birthday-details.component.html',
  styleUrls: ['./birthday-details.component.css'],
})
export class BirthdayDetailsCompnent implements OnInit, OnDestroy {
  birthday: Birthday | undefined;
  id: number | undefined;
  georgianStat: GeorgianDateStatistics | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select('birthdays');
        }),
        map((birthdaysState) => {
          return birthdaysState.birthdays.find((birthday, index) => {
            return birthday.id === this.id;
          });
        })
      )
      .subscribe((recipe) => {
        this.birthday = recipe;
        this.georgianStat = new GeorgianDateStatistics(
          new Date(this.birthday?.birthDate!)
        );
      });
  }

  onEditBirthday() {
    // this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteBirthday() {
    // => show confirm alert => delete and navigate to home after delete success
    // this.store.dispatch(new BirthdayActions.DeleteBirthday(this.id!));
    // this.router.navigate(['/']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {}
}
