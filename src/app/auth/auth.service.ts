import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../core/services/token-storage.service';
import * as BirthdayActions from '../birthday/store/birthday.actions';
import { SignupDto } from './dto/signup.dto';
import { Tokens, User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: WritableSignal<User | null> = signal<User | null>(null);

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  private http = inject(HttpClient);
  private store = inject(Store);
  private tokenStorage = inject(TokenStorageService);

  login(email: string, password: string) {
    this.isLoading.set(true);

    return this.http
      .post<Tokens>(environment.apiUrl + '/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        map(resData => {
          this.tokenStorage.saveTokens(resData);
          return resData;
        }),
        switchMap(resData => {
          return this.checkToken(resData.access_token);
        }),
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError(errorRes => {
          this.isLoading.set(false);
          return throwError(() => this.handleErrorMsg(errorRes));
        })
      );
  }

  signup(signupDto: SignupDto) {
    this.isLoading.set(true);

    return this.http.post<Tokens>(environment.apiUrl + '/auth/signup', signupDto).pipe(
      map(resData => {
        this.tokenStorage.saveTokens(resData);
        return resData;
      }),
      switchMap(resData => {
        return this.checkToken(resData.access_token);
      }),
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError(errorRes => {
        this.isLoading.set(false);
        return throwError(() => this.handleErrorMsg(errorRes));
      })
    );
  }

  logout() {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.http
      .post(environment.apiUrl + '/auth/logout', {
        refresh_token: refreshToken,
      })
      .pipe(
        tap(() => {
          this.afterLogoutRequest();
        }),
        catchError(errorRes => {
          this.afterLogoutRequest();
          return of(null);
        })
      );
  }

  afterLogoutRequest() {
    this.user.set(null);
    this.tokenStorage.clearAll();
    this.store.dispatch(BirthdayActions.resetBirthdays());
  }

  resendVerificationEmail() {
    return this.http.post(environment.apiUrl + '/auth/resend-verification', {
      email: this.user()?.email,
    });
  }

  autoLogin() {
    const access_token = this.tokenStorage.getAccessToken();
    const refresh_token = this.tokenStorage.getRefreshToken();
    if (!access_token || !refresh_token) {
      return;
    }
    return this.checkToken(access_token);
  }

  updateUser(
    fullName: string,
    email: string,
    birthday: string,
    image: { fileURL: string; fileObject?: File }
  ): Observable<any> {
    const id = this.user()?.id;
    if (!id) {
      throw new Error('User id is not found');
    }

    return of(true).pipe(
      map(() => {
        console.log('image', image);
        const formData = new FormData();
        const isNewImage: boolean = image.fileObject != null || image.fileObject != undefined;
        const isOldImage: boolean =
          image.fileURL != null && image.fileURL != undefined && image.fileURL != '' && !isNewImage;
        // const isImageRemoved =
        //   image.fileURL == null ||
        //   image.fileURL == undefined ||
        //   (image.fileURL == '' && !isNewImage);

        if (isNewImage) {
          // image changed => upload new image
          formData.append('image', image.fileObject!, image.fileObject!.name);
        } else if (isOldImage) {
          // image not changed => keep old image
          return of(null);
        }
        // use the formData to upload image
        return this.http.post<{ url: string }>(environment.apiUrl + '/users/upload-profile-image', formData);
      }),
      switchMap(resData => {
        if (resData == null) {
          return of(null);
        }
        return resData;
      }),
      map(resData => {
        console.log('resData', resData);

        return this.http.patch<User>(environment.apiUrl + '/users/' + id, {
          fullName: fullName,
          email: email,
          birthday: birthday,
        });
      }),
      switchMap(resData => {
        return resData;
      }),
      tap(user => {
        this.tokenStorage.saveUser(user);
        this.user.set(user);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const id = this.user()?.id;
    if (!id) {
      throw new Error('User id is not found');
    }
    return this.http.patch<User>(environment.apiUrl + '/users/' + id + '/change-password', {
      currentPassword: currentPassword,
      newPassword: newPassword,
    });
  }

  deleteAccount(): Observable<any> {
    const id = this.user()?.id;
    if (!id) {
      throw new Error('User id is not found');
    }
    return this.http.delete(environment.apiUrl + '/users/' + id).pipe(tap(() => this.afterLogoutRequest()));
  }

  forgetPassword(email: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.post(environment.apiUrl + '/auth/forget-password', {
      email: email,
    });
  }

  private checkToken(accessToken: string): Observable<User> {
    return this.http
      .get<User>(environment.apiUrl + '/auth/check', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        tap(user => {
          this.tokenStorage.saveUser(user);
          this.user.set(user);
        }),
        catchError(errorRes => {
          return throwError(() => {
            console.log(errorRes);
            this.user.set(null);
          });
        })
      );
  }

  private handleErrorMsg(errorRes: any) {
    console.log(errorRes);
    let errorString = 'An unknown error occurred';
    if (errorRes.status == 401) {
      errorString = 'Email or password is not correct';
    }
    return errorString;
  }

  refreshToken(): Observable<Tokens> {
    const refresh_token = this.tokenStorage.getRefreshToken();
    if (!refresh_token) {
      this.afterLogoutRequest();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<Tokens>(
        environment.apiUrl + '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        }
      )
      .pipe(
        tap(resData => {
          this.tokenStorage.saveTokens(resData);
        }),
        catchError(errorRes => {
          this.afterLogoutRequest();
          return throwError(() => errorRes);
        })
      );
  }
}
