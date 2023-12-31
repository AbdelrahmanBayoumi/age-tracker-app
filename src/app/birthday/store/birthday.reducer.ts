import { createReducer, on } from '@ngrx/store';

import { Birthday } from '../model/birthday.model';
import * as BirthdayActions from './birthday.actions';

export interface State {
  birthdays: Birthday[];
  relationshipSelected: string;
  searchQuery: string;
  errMsg: string;
  loading: boolean;
  viewedBirthday?: Birthday;
}

const initialState: State = {
  birthdays: [],
  relationshipSelected: '-1',
  searchQuery: '',
  errMsg: '',
  loading: false,
};

export const birthdayReducer = createReducer(
  initialState,
  on(BirthdayActions.fetchBirthdaysStart, (state, action) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(BirthdayActions.fetchBirthdaysFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to Fetch birthdays. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.addBirthday, (state, action) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(BirthdayActions.birthdaySuccess, (state, action) => {
    return {
      ...state,
      errMsg: '',
      loading: false,
    };
  }),
  on(BirthdayActions.addBirthdayFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to add birthday. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.updateBirthdayFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to update birthday. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.setBirthdays, (state, action) => {
    return {
      ...state,
      errMsg: '',
      loading: false,
      birthdays: [...action.birthdays],
    };
  }),
  on(BirthdayActions.deleteBirthday, (state, action) => {
    return {
      ...state,
      errMsg: '',
      loading: true,
    };
  }),
  on(BirthdayActions.deleteBirthdayFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to delete birthday. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.searchByName, (state, action) => {
    return {
      ...state,
      searchQuery: action.name,
      errMsg: '',
      loading: false,
    };
  }),
  on(BirthdayActions.filterByRelationship, (state, action) => {
    return {
      ...state,
      relationshipSelected: action.relationship,
      errMsg: '',
      loading: false,
    };
  })
);
