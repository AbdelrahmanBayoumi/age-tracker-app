import { Birthday } from '../model/birthday.model';
import * as BirthdayActions from './birthday.actions';
import * as fromReducer from './birthday.reducer';

describe('BirthdayReducer', () => {
  const initialState: fromReducer.State = {
    birthdays: [],
    relationshipSelected: '-1',
    searchQuery: '',
    errMsg: '',
    loading: false,
    lastAddedBirthdayId: undefined,
  };

  it('should return default state', () => {
    const action = { type: 'NOOP' } as any;
    const state = fromReducer.birthdayReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should set loading to true on fetchBirthdaysStart', () => {
    const action = BirthdayActions.fetchBirthdaysStart();
    const state = fromReducer.birthdayReducer(initialState, action);

    expect(state.loading).toBe(true);
  });

  it('should set loading to false and update birthdays on setBirthdays', () => {
    const birthdays = [new Birthday(1, 'Test', new Date(), 'Friend', '', '')];
    const action = BirthdayActions.setBirthdays({ birthdays });

    // Set loading to true first to verify it changes back to false
    const loadingState = { ...initialState, loading: true };
    const state = fromReducer.birthdayReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.birthdays).toEqual(birthdays);
  });

  it('should update searchQuery on searchByName', () => {
    const action = BirthdayActions.searchByName({ name: 'John' });
    const state = fromReducer.birthdayReducer(initialState, action);

    expect(state.searchQuery).toBe('John');
  });

  it('should update relationshipSelected on filterByRelationship', () => {
    const action = BirthdayActions.filterByRelationship({
      relationship: 'Family',
    });
    const state = fromReducer.birthdayReducer(initialState, action);

    expect(state.relationshipSelected).toBe('Family');
  });
});
