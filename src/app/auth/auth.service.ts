import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
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
    console.log(signupDto);

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
    return this.http.post(environment.apiUrl + '/auth/logout', {}).pipe(
      tap(() => {
        this.user.next(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }),
      catchError((errorRes) => {
        return throwError(() => {
          console.log(errorRes);

          this.user.next(null);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        });
      })
    );
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

  sendVerificationEmail() {
    return this.http.post(environment.apiUrl + '/auth/resend-verification', {
      email: this.user.value?.email,
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
}
