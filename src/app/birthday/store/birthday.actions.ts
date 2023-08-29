import { createAction, props } from '@ngrx/store';

import { Birthday } from '../model/birthday.model';

export const setBirthdays = createAction(
  '[Birthday] Set Birthday',
  props<{ birthdays: Birthday[] }>()
);

// TODO: Handle loading state
export const fetchBirthdays = createAction('[Birthdays] Fetch Birthdays');

export const getBirthday = createAction(
  '[Birthday] Get Birthday',
  props<{ index: number }>()
);

export const searchByName = createAction(
  '[Birthday] Search Birthday By Name',
  props<{ name: string }>()
);

export const filterByRelationship = createAction(
  '[Birthday] Filter Birthday By Relationship',
  props<{ relationship: string }>()
);

export const addBirthday = createAction(
  '[Birthday] Add Birthday',
  props<{
    birthday: {
      name: string;
      birthday: string;
      relationship: string;
    };
  }>()
);

export const birthdaySuccess = createAction('[Birthdays] Birthday Updated Sccess');
export const addBirthdayFailed = createAction(
  '[Birthdays] Add Birthday Failed'
);

export const updateBirthday = createAction(
  '[Birthday] Update Birthday',
  props<{ index: number; newBirthday: Birthday }>()
);

export const deleteBirthday = createAction(
  '[Birthday] Delete Birthday',
  props<{ index: number }>()
);

export const storeBirthdays = createAction('[Birthday] Store Birthdays');
