import { createReducer, on } from '@ngrx/store';

import { Birthday } from '../model/birthday.model';
import * as BirthdayActions from './birthday.actions';

export interface State {
  birthdays: Birthday[];
  relationshipSelected: string;
  searchQuery: string;
}

const initialState: State = {
  birthdays: [],
  relationshipSelected: '-1',
  searchQuery: '',
};

export const birthdayReducer = createReducer(
  initialState,
  on(BirthdayActions.setBirthdays, (state, action) => {
    return {
      ...state,
      birthdays: [...action.birthdays],
    };
  }),
  on(BirthdayActions.addBirthday, (state, action) => {
    return {
      ...state,
      birthdays: [...state.birthdays, action.birthday],
    };
  }),
  on(BirthdayActions.updateBirthday, (state, action) => {
    const updatedBithday: Birthday = state.birthdays[action.index].update(
      action.newBirthday
    );

    const updatedBirthdays = [...state.birthdays];
    updatedBirthdays[action.index] = updatedBithday;

    return {
      ...state,
      birthdays: updatedBirthdays,
    };
  }),
  on(BirthdayActions.deleteBirthday, (state, action) => {
    return {
      ...state,
      birthdays: state.birthdays.filter((birthday, index) => {
        return index !== action.index;
      }),
    };
  }),
  on(BirthdayActions.searchByName, (state, action) => {
    return {
      ...state,
      searchQuery: action.name,
    };
  }),
  on(BirthdayActions.filterByRelationship, (state, action) => {
    return {
      ...state,
      relationshipSelected: action.relationship,
    };
  })
);
