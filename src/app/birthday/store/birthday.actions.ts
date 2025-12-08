import { createAction, props } from '@ngrx/store';

import { Birthday } from '../model/birthday.model';

export const setBirthdays = createAction(
  '[Birthday] Set Birthday',
  props<{ birthdays: Birthday[] }>()
);

export const fetchBirthdaysStart = createAction(
  '[Birthdays] Fetch Birthdays Start'
);
export const fetchBirthdays = createAction('[Birthdays] Fetch Birthdays');
export const fetchBirthdaysFailed = createAction(
  '[Birthdays] Fetch Birthdays Failed'
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
    image: { fileURL: string; fileObject?: File };
  }>()
);

export const birthdaySuccess = createAction(
  '[Birthdays] Birthday Updated Success',
  props<{ id?: number }>()
);
export const addBirthdayFailed = createAction(
  '[Birthdays] Add Birthday Failed'
);

export const updateBirthday = createAction(
  '[Birthday] Update Birthday',
  props<{
    id: number;
    newBirthday: Birthday;
    image: { fileURL: string; fileObject?: File };
  }>()
);
export const updateBirthdayFailed = createAction(
  '[Birthdays] Update Birthday Failed'
);

export const deleteBirthday = createAction(
  '[Birthday] Delete Birthday',
  props<{ id: number }>()
);
export const deleteBirthdayFailed = createAction(
  '[Birthdays] Delete Birthday Failed'
);
