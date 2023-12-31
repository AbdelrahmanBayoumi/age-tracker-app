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
            birthday.notes,
            birthday.image
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
        return this.http
          .post<Birthday>(environment.apiUrl + this.END_POINT, action.birthday)
          .pipe(
            switchMap((res) => {
              return this.uploadImage(res.id, action.image);
            })
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

  private uploadImage(
    id: number,
    image: { fileURL: string; fileObject?: File }
  ) {
    const formData = new FormData();
    const isNewImage: boolean =
      image.fileObject != null || image.fileObject != undefined;
    const isOldImage: boolean =
      image.fileURL != null &&
      image.fileURL != undefined &&
      image.fileURL != '' &&
      !isNewImage;

    if (isNewImage) {
      // image changed => upload new image
      formData.append('image', image.fileObject!, image.fileObject!.name);
    } else if (isOldImage) {
      // image not changed => keep old image
      return of(null);
    }

    return this.http.post(
      environment.apiUrl + this.END_POINT + '/' + id + '/upload-image',
      formData
    );
  }

  updateBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.updateBirthday),
      switchMap((action) => {
        console.log('action.newBirthday', action.newBirthday);

        return this.http
          .patch<Birthday>(
            environment.apiUrl + this.END_POINT + '/' + action.id,
            action.newBirthday
          )
          .pipe(
            switchMap(() => {
              return this.uploadImage(action.id, action.image);
            })
          );
      }),
      map((res) => {
        console.log('res', res);

        return BirthdaysActions.fetchBirthdays();
      }),
      catchError((_error) => {
        return of(BirthdaysActions.updateBirthdayFailed());
      })
    )
  );

  deleteBirthday = createEffect(() =>
    this.actions$.pipe(
      ofType(BirthdaysActions.deleteBirthday),
      switchMap((action) => {
        return this.http.delete<Birthday>(
          environment.apiUrl + this.END_POINT + '/' + action.id
        );
      }),
      map(() => {
        return BirthdaysActions.fetchBirthdays();
      }),
      catchError((_error) => {
        return of(BirthdaysActions.deleteBirthdayFailed());
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
