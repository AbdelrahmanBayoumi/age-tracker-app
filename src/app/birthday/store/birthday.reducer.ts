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
  lastAddedBirthdayId?: number;
}

const initialState: State = {
  birthdays: [],
  relationshipSelected: '-1',
  searchQuery: '',
  errMsg: '',
  loading: false,
  lastAddedBirthdayId: undefined,
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
      lastAddedBirthdayId: undefined,
    };
  }),
  on(BirthdayActions.birthdaySuccess, (state, action) => {
    return {
      ...state,
      errMsg: '',
      loading: false,
      lastAddedBirthdayId: action.birthday.id,
      birthdays: [...state.birthdays, action.birthday],
    };
  }),
  on(BirthdayActions.addBirthdayFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to add birthday. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.updateBirthday, (state, action) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(BirthdayActions.updateBirthdayFailed, (state, action) => {
    return {
      ...state,
      errMsg: 'Unable to update birthday. Please try again later.',
      loading: false,
    };
  }),
  on(BirthdayActions.updateBirthdaySuccess, (state, action) => {
    const updatedBirthdays = state.birthdays.map(b => (b.id === action.birthday.id ? action.birthday : b));
    return {
      ...state,
      loading: false,
      errMsg: '',
      birthdays: updatedBirthdays,
    };
  }),
  on(BirthdayActions.resetBirthdays, () => {
    return initialState;
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
