import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as BirthdaysActions from './birthday.actions';
import { Birthday } from '../model/birthday.model';
import * as fromApp from '../../store/app.reducer';
import { environment } from 'src/environments/environment';

@Injectable()
export class BirthdayEffects {
  // handle fetch birthdays
  fetchBirthdays = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.fetchBirthdays),
      switchMap(() => {
        return this.http.get<Birthday[]>(environment.apiUrl + '/birthday');
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
      })
    )
  );

  // storeBirthdays = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(BirthdaysActions.storeBirthdays),
  //       withLatestFrom(this.store.select('recipes')),
  //       switchMap(([actionData, recipesState]) => {
  //         return this.http.put(
  //           'https://angular-demo-ce5e5-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
  //           recipesState.recipes
  //         );
  //       })
  //     ),
  //   { dispatch: false }
  // );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
