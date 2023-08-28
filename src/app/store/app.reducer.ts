import { ActionReducerMap } from '@ngrx/store';

import * as fromBirthday from '../birthday/store/birthday.reducer';

export interface AppState {
  birthdays: fromBirthday.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  birthdays: fromBirthday.birthdayReducer,
};
