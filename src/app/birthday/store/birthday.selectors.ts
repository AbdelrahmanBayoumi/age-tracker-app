import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Birthday } from '../model/birthday.model';
import { State } from './birthday.reducer';

export const selectBirthdayState = createFeatureSelector<State>('birthdays');

export const selectBirthdays = createSelector(selectBirthdayState, (state: State) => state.birthdays);

export const selectSearchQuery = createSelector(selectBirthdayState, (state: State) => state.searchQuery);

export const selectRelationshipSelected = createSelector(
  selectBirthdayState,
  (state: State) => state.relationshipSelected
);

export const selectLoading = createSelector(selectBirthdayState, (state: State) => state.loading);

export const selectErrorMessage = createSelector(selectBirthdayState, (state: State) => state.errMsg);

export const selectViewedBirthday = createSelector(selectBirthdayState, (state: State) => state.viewedBirthday);

export const selectLastAddedBirthdayId = createSelector(
  selectBirthdayState,
  (state: State) => state.lastAddedBirthdayId
);

export const selectFilteredBirthdays = createSelector(
  selectBirthdays,
  selectSearchQuery,
  selectRelationshipSelected,
  (birthdays: Birthday[], searchQuery: string, relationshipSelected: string) => {
    return birthdays.filter(birthday => {
      const matchesRelationship = relationshipSelected === '-1' || birthday.relationship === relationshipSelected;
      const matchesSearch = birthday.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRelationship && matchesSearch;
    });
  }
);

// Computed selector for loading with stale-while-revalidate logic
export const selectIsInitialLoading = createSelector(
  selectLoading,
  selectBirthdays,
  (loading: boolean, birthdays: Birthday[]) => loading && birthdays.length === 0
);
