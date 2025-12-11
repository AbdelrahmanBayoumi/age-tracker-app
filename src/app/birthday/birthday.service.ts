import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Birthday } from './model/birthday.model';
import { selectBirthdays } from './store/birthday.selectors';

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private store = inject(Store);

  getRelationships(): Observable<Set<string>> {
    return this.store.select(selectBirthdays).pipe(
      map((birthdays: Birthday[]) => {
        return new Set(birthdays.map(birthday => birthday.relationship));
      })
    );
  }

  getNextBirthdays(birthdays: Birthday[]): any[] {
    const today = new Date();

    const sortedBirthdays = birthdays
      .map(birthday => {
        return new Birthday(
          birthday.id,
          birthday.name,
          new Date(birthday.birthDate),
          birthday.relationship,
          birthday.notes,
          birthday.image
        );
      })
      .sort((a, b) => {
        const aNextBirthday = new Date(a.birthDate);
        const bNextBirthday = new Date(b.birthDate);

        aNextBirthday.setFullYear(today.getFullYear());
        bNextBirthday.setFullYear(today.getFullYear());

        if (aNextBirthday < today) {
          aNextBirthday.setFullYear(today.getFullYear() + 1);
        }

        if (bNextBirthday < today) {
          bNextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return aNextBirthday.getTime() - bNextBirthday.getTime();
      });

    const groupedBirthdays: { [key: string]: Birthday[] } = {};

    for (const birthday of sortedBirthdays) {
      const nextBirthday = new Date(birthday.birthDate);
      nextBirthday.setFullYear(today.getFullYear());

      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const birthMonthKey = `${nextBirthday.getFullYear()}-${(nextBirthday.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      if (!groupedBirthdays[birthMonthKey]) {
        groupedBirthdays[birthMonthKey] = [];
      }
      groupedBirthdays[birthMonthKey].push(birthday);
    }

    const resultArray = Object.keys(groupedBirthdays).map(key => {
      return {
        month: key,
        birthdays: groupedBirthdays[key],
      };
    });

    return resultArray;
  }
}
