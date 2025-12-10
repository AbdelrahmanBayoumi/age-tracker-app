import { Birthday } from '../model/birthday.model';
import { State } from './birthday.reducer';
import * as BirthdaySelectors from './birthday.selectors';

describe('Birthday Selectors', () => {
  const initialState: State = {
    birthdays: [
      new Birthday(1, 'John Doe', new Date('1990-01-01'), 'Friend', '', ''),
      new Birthday(2, 'Jane Doe', new Date('1995-05-05'), 'Family', '', ''),
      new Birthday(3, 'Test User', new Date('2000-10-10'), 'Friend', '', ''),
    ],
    searchQuery: '',
    relationshipSelected: '-1',
    loading: false,
    errMsg: '',
    viewedBirthday: undefined,
  };

  it('should select the feature state', () => {
    const result = BirthdaySelectors.selectBirthdayState.projector(initialState);
    expect(result).toEqual(initialState);
  });

  it('should return all birthdays when no filter is applied', () => {
    const result = BirthdaySelectors.selectFilteredBirthdays.projector(initialState.birthdays, '', '-1');
    expect(result.length).toBe(3);
  });

  it('should filter birthdays by name (case insensitive)', () => {
    const result = BirthdaySelectors.selectFilteredBirthdays.projector(initialState.birthdays, 'john', '-1');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('John Doe');
  });

  it('should filter birthdays by relationship', () => {
    const result = BirthdaySelectors.selectFilteredBirthdays.projector(initialState.birthdays, '', 'Family');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Jane Doe');
  });

  it('should filter birthdays by name AND relationship', () => {
    const result = BirthdaySelectors.selectFilteredBirthdays.projector(initialState.birthdays, 'test', 'Friend');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Test User');
  });

  it('should return empty array if no matches found', () => {
    const result = BirthdaySelectors.selectFilteredBirthdays.projector(initialState.birthdays, 'NonExistent', '-1');
    expect(result.length).toBe(0);
  });
});
