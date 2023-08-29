import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Birthday } from './model/birthday.model';
import * as fromApp from '../store/app.reducer';
import * as BirthdaysActions from './store/birthday.actions';

@Injectable({ providedIn: 'root' })
export class BirthdaysResolverService implements Resolve<Birthday[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('birthdays').pipe(
      take(1),
      map((birthdaysState) => {
        return birthdaysState.birthdays;
      }),
      switchMap((birthdays) => {
        if (birthdays.length === 0) {
          this.store.dispatch(BirthdaysActions.fetchBirthdays());
          return of([]);
        } else {
          return of(birthdays);
        }
      })
    );
  }
}
