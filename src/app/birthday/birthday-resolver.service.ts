import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Birthday } from './model/birthday.model';
import * as BirthdaysActions from './store/birthday.actions';
import { selectBirthdays } from './store/birthday.selectors';

@Injectable({ providedIn: 'root' })
export class BirthdaysResolverService implements Resolve<Birthday[]> {
  private store = inject(Store);
  private actions$ = inject(Actions);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(selectBirthdays).pipe(
      take(1),
      switchMap(birthdays => {
        if (birthdays.length === 0) {
          this.store.dispatch(BirthdaysActions.fetchBirthdays());
          return this.waitForBirthdays();
        } else {
          return of(birthdays);
        }
      })
    );
  }

  private waitForBirthdays() {
    return this.actions$.pipe(
      ofType(BirthdaysActions.setBirthdays, BirthdaysActions.fetchBirthdaysFailed),
      take(1),
      map(() => [])
    );
  }
}
