import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './birthday.reducer';
import { Birthday } from '../model/birthday.model';

export const selectBirthdayState = createFeatureSelector<State>('birthdays');

export const selectBirthdays = createSelector(
  selectBirthdayState,
  (state: State) => state.birthdays
);

export const selectSearchQuery = createSelector(
  selectBirthdayState,
  (state: State) => state.searchQuery
);

export const selectRelationshipSelected = createSelector(
  selectBirthdayState,
  (state: State) => state.relationshipSelected
);

export const selectFilteredBirthdays = createSelector(
  selectBirthdays,
  selectSearchQuery,
  selectRelationshipSelected,
  (
    birthdays: Birthday[],
    searchQuery: string,
    relationshipSelected: string
  ) => {
    return birthdays.filter((birthday) => {
      const matchesRelationship =
        relationshipSelected === '-1' ||
        birthday.relationship === relationshipSelected;
      const matchesSearch = birthday.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesRelationship && matchesSearch;
    });
  }
);
