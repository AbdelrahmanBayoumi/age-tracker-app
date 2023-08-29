import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';
import * as fromApp from '../../../store/app.reducer';
import * as BirthdayActions from '../../../birthday/store/birthday.actions';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-birthday-details',
  templateUrl: './birthday-details.component.html',
  styleUrls: ['./birthday-details.component.css'],
})
export class BirthdayDetailsCompnent implements OnInit, OnDestroy {
  birthday: Birthday | undefined;
  id: number | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    console.log('0) birthday', this.birthday);

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
        console.log('1) birthday', this.birthday);
      });
  }

  ngOnDestroy(): void {}
}
