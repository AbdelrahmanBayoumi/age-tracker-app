import { createReducer, on } from '@ngrx/store';

import { User } from '../model/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.authenticateSuccess, (state, action) => {
    // const user = new User(
    //   action.email,
    //   action.userId,
    //   action.token,
    //   action.expirationDate
    // );
    const user = null;
    return {
      ...state,
      authError: null,
      user: user,
      loading: false,
    };
  }),
  on(AuthActions.logout, (state) => {
    return {
      ...state,
      user: null,
    };
  }),
  on(AuthActions.loginStart, (state) => {
    return {
      ...state,
      authError: null,
      loading: true,
    };
  }),
  on(AuthActions.authenticateFail, (state, action) => {
    return {
      ...state,
      user: null,
      authError: action.error,
      loading: false,
    };
  }),
  on(AuthActions.clearError, (state) => {
    return {
      ...state,
      authError: null,
    };
  })
);
