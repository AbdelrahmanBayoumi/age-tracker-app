import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Birthday } from './model/birthday.model';
import * as BirthdaysActions from './store/birthday.actions';
import { selectBirthdays } from './store/birthday.selectors';

@Injectable({ providedIn: 'root' })
export class BirthdaysResolverService implements Resolve<Birthday[]> {
  private store = inject(Store);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(selectBirthdays).pipe(
      take(1),
      switchMap(birthdays => {
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
