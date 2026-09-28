import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Birthday } from '../model/birthday.model';
import * as BirthdaysActions from './birthday.actions';

@Injectable()
export class BirthdayEffects {
  private readonly END_POINT = '/birthday';

  fetchBirthdays = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.fetchBirthdays),
      switchMap(() =>
        this.http.get<Birthday[]>(environment.apiUrl + this.END_POINT).pipe(
          map(birthdays => {
            if (!birthdays) {
              return [];
            }
            return birthdays.map(
              birthday =>
                new Birthday(
                  birthday.id,
                  birthday.name,
                  birthday.birthday,
                  birthday.relationship,
                  birthday.notes,
                  birthday.image
                )
            );
          }),
          map(birthdays => BirthdaysActions.setBirthdays({ birthdays })),
          catchError(_error => of(BirthdaysActions.fetchBirthdaysFailed()))
        )
      )
    )
  );

  addBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.addBirthday),
      concatMap(action =>
        this.http.post<Birthday>(environment.apiUrl + this.END_POINT, action.birthday).pipe(
          switchMap(res =>
            this.uploadImage(res.id, action.image).pipe(
              map(
                () =>
                  new Birthday(
                    res.id,
                    res.name,
                    res.birthday,
                    res.relationship,
                    res.notes,
                    action.image.fileURL || res.image
                  )
              )
            )
          ),
          map((birthday: Birthday) => BirthdaysActions.birthdaySuccess({ birthday })),
          catchError(_error => of(BirthdaysActions.addBirthdayFailed()))
        )
      )
    )
  );

  private uploadImage(id: number, image?: { fileURL?: string; fileObject?: File }): Observable<any> {
    if (!image?.fileObject) {
      return of(null);
    }
    const formData = new FormData();
    formData.append('image', image.fileObject, image.fileObject.name);
    return this.http.post(environment.apiUrl + this.END_POINT + '/' + id + '/upload-image', formData);
  }

  updateBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.updateBirthday),
      concatMap(action => {
        const updatePayload = {
          name: action.newBirthday.name,
          birthday: action.newBirthday.birthday,
          relationship: action.newBirthday.relationship,
          notes: action.newBirthday.notes || '',
        };

        return this.http.patch<Birthday>(environment.apiUrl + this.END_POINT + '/' + action.id, updatePayload).pipe(
          switchMap(res =>
            this.uploadImage(action.id, action.image).pipe(
              map(
                () =>
                  new Birthday(
                    res.id,
                    res.name,
                    res.birthday,
                    res.relationship,
                    res.notes,
                    action.image.fileURL || res.image
                  )
              )
            )
          ),
          map(birthday => BirthdaysActions.updateBirthdaySuccess({ birthday })),
          catchError(_error => of(BirthdaysActions.updateBirthdayFailed()))
        );
      })
    )
  );

  deleteBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.deleteBirthday),
      concatMap(action =>
        this.http.delete<void>(environment.apiUrl + this.END_POINT + '/' + action.id).pipe(
          map(() => BirthdaysActions.fetchBirthdays()),
          catchError(_error => of(BirthdaysActions.deleteBirthdayFailed()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
