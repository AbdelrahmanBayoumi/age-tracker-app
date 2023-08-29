import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as BirthdaysActions from './birthday.actions';
import { Birthday } from '../model/birthday.model';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable()
export class BirthdayEffects {
  private readonly END_POINT = '/birthday';

  fetchBirthdays = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.fetchBirthdays),
      switchMap(() => {
        return this.http.get<Birthday[]>(environment.apiUrl + this.END_POINT);
      }),
      map((birthdays) => {
        return birthdays.map((birthday) => {
          return new Birthday(
            birthday.id,
            birthday.name,
            birthday.birthday,
            birthday.relationship,
            birthday.notes
          );
        });
      }),
      map((birthdays) => {
        console.log('birthdays', birthdays);
        if (!birthdays) {
          return [];
        }
        return birthdays;
      }),
      map((birthdays) => {
        return BirthdaysActions.setBirthdays({ birthdays });
      }),
      catchError((_error) => {
        return of(BirthdaysActions.fetchBirthdaysFailed());
      })
    )
  );

  addBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.addBirthday),
      switchMap((action) => {
        console.log(action.birthday);

        return this.http.post<Birthday>(
          environment.apiUrl + this.END_POINT,
          action.birthday
        );
      }),
      map(() => {
        return BirthdaysActions.birthdaySuccess();
      }),
      catchError((_error) => {
        return of(BirthdaysActions.addBirthdayFailed());
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
