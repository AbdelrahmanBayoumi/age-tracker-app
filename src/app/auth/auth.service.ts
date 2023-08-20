import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Tokens, User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  isLoading = new Subject<boolean>();

  isLoggedIn = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    this.isLoading.next(true);

    return this.http
      .post<Tokens>('https://birthday-database.azurewebsites.net/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        map((resData) => {
          console.log(resData);
          // save tokens to local storage
          localStorage.setItem('access_token', resData.access_token);
          localStorage.setItem('refresh_token', resData.refresh_token);
          // send user object with tokens until we get user object from check-token
          this.user.next(new User(-1, email, '', '', false, resData));
          return resData;
        }),
        map((resData) => {
          return this.http.get<User>(
            'https://birthday-database.azurewebsites.net/auth/check',
            {
              headers: {
                Authorization: `Bearer ${resData.access_token}`,
              },
            }
          );
        }),
        switchMap((resData) => resData),
        tap((user) => {
          // save user object to local storage
          localStorage.setItem('user', JSON.stringify(user));
          // send user object with tokens
          this.user.next(user);
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
      .post('https://birthday-database.azurewebsites.net/auth/logout', {})
      .pipe(
        tap((resData) => {
          console.log(resData);

          this.user.next(null);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
      );
  }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('user')!);
    // get access and refresh tokens from localStorage
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (!userData || !access_token || !refresh_token) {
      return;
    }
    const loadedUser = new User(
      userData.id,
      userData.email,
      userData.fullName,
      userData.birthday,
      userData.isVerified,
      { access_token, refresh_token }
    );
    this.user.next(loadedUser);
  }

  private handleErrorMsg(errorRes: any) {
    console.log(errorRes);
    let errorString = 'An unknown error occurred';
    if (errorRes.status == 401) {
      errorString = 'Email or password is not correct';
    }
    return errorString;
  }
}
