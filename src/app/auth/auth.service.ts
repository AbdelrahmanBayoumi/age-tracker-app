import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Tokens, User } from './model/user.model';
import { environment } from 'src/environments/environment';
import { SignupDto } from './dto/signup.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  isLoading = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    this.isLoading.next(true);

    return this.http
      .post<Tokens>(environment.apiUrl + '/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        map((resData) => {
          console.log(resData);
          // save tokens to local storage
          localStorage.setItem('access_token', resData.access_token);
          localStorage.setItem('refresh_token', resData.refresh_token);
          return resData;
        }),
        switchMap((resData) => {
          return this.checkToken(resData.access_token);
        }),
        tap(() => {
          this.isLoading.next(false);
        }),
        catchError((errorRes) => {
          this.isLoading.next(false);
          return throwError(() => this.handleErrorMsg(errorRes));
        })
      );
  }

  signup(signupDto: SignupDto) {
    this.isLoading.next(true);

    return this.http
      .post<Tokens>(environment.apiUrl + '/auth/signup', signupDto)
      .pipe(
        map((resData) => {
          console.log(resData);
          // save tokens to local storage
          localStorage.setItem('access_token', resData.access_token);
          localStorage.setItem('refresh_token', resData.refresh_token);
          return resData;
        }),
        switchMap((resData) => {
          return this.checkToken(resData.access_token);
        }),
        tap(() => {
          this.isLoading.next(false);
        }),
        catchError((errorRes) => {
          this.isLoading.next(false);
          return throwError(() => this.handleErrorMsg(errorRes));
        })
      );
  }

  logout() {
    return this.http
      .post(environment.apiUrl + '/auth/logout', {
        refresh_token: localStorage.getItem('refresh_token'),
      })
      .pipe(
        tap(() => {
          this.afterLogoutRequest();
        }),
        catchError((errorRes) => {
          return throwError(() => {
            console.log(errorRes);
            this.afterLogoutRequest();
          });
        })
      );
  }

  private afterLogoutRequest() {
    this.user.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  resendVerificationEmail() {
    return this.http.post(environment.apiUrl + '/auth/resend-verification', {
      email: this.user.value?.email,
    });
  }

  autoLogin() {
    // get access and refresh tokens from localStorage
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (!access_token || !refresh_token) {
      return;
    }
    // call check-token to validate current access token
    return this.checkToken(access_token);
  }

  updateUser(
    fullName: string,
    email: string,
    birthday: string,
    image: { fileURL: string; fileObject?: File }
  ): Observable<any> {
    const id = this.user.value?.id;
    if (!id) {
      throw new Error('User id is not found');
    }

    return of(true).pipe(
      map(() => {
        console.log('image', image);
        const formData = new FormData();
        const isNewImage: boolean =
          image.fileObject != null || image.fileObject != undefined;
        const isOldImage: boolean =
          image.fileURL != null &&
          image.fileURL != undefined &&
          image.fileURL != '' &&
          !isNewImage;
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
        return this.http.post<{ url: string }>(
          environment.apiUrl + '/users/upload-profile-image',
          formData
        );
      }),
      switchMap((resData) => {
        if (resData == null) {
          return of(null);
        }
        return resData;
      }),
      map((resData) => {
        console.log('resData', resData);

        return this.http.patch<User>(environment.apiUrl + '/users/' + id, {
          fullName: fullName,
          email: email,
          birthday: birthday,
        });
      }),
      switchMap((resData) => {
        return resData;
      }),
      tap((user) => {
        // save user object to local storage
        localStorage.setItem('user', JSON.stringify(user));
        // send updated user object to subscribers
        this.user.next(user);
      })
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const id = this.user.value?.id;
    if (!id) {
      throw new Error('User id is not found');
    }
    return this.http.patch<User>(
      environment.apiUrl + '/users/' + id + '/change-password',
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }
    );
  }

  deleteAccount(): Observable<any> {
    const id = this.user.value?.id;
    if (!id) {
      throw new Error('User id is not found');
    }
    return this.http
      .delete(environment.apiUrl + '/users/' + id)
      .pipe(tap(() => this.afterLogoutRequest()));
  }

  forgetPassword(email: string): Observable<any> {
    this.isLoading.next(true);
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
        tap((user) => {
          console.log("checkToken's user: ", user);
          // save user object to local storage
          localStorage.setItem('user', JSON.stringify(user));
          // send updated user object to subscribers
          this.user.next(user);
        }),
        catchError((errorRes) => {
          return throwError(() => {
            console.log(errorRes);
            this.user.next(null);
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

  refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return throwError(() => {
        this.afterLogoutRequest();
      });
    }
    localStorage.removeItem('refresh_token');
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
        map((resData) => {
          localStorage.setItem('access_token', resData.access_token);
          localStorage.setItem('refresh_token', resData.refresh_token);
          return resData;
        }),
        switchMap((resData) => {
          return this.checkToken(resData.access_token);
        }),
        catchError((errorRes) => {
          return throwError(() => {
            this.afterLogoutRequest();
          });
        })
      );
  }
}
