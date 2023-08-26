import { Birthday } from './model/birthday.model';

export class BirthdayService {
  // create a fake array of 10 birthdays of type Birthday with different names and birth dates and relationships and notes
  birthdays: Birthday[] = [
    new Birthday(1, 'Mohamed', '1990-01-01', 'Brother', 'No notes'),
    new Birthday(2, 'Ahmed', '1990-02-02', 'Brother', 'No notes'),
    new Birthday(3, 'Ali', '1990-03-03', 'Brother', 'No notes'),
    new Birthday(4, 'Omar', '1990-04-04', 'Brother', 'No notes'),
    new Birthday(5, 'Khalid', '1990-05-05', 'Brother', 'No notes'),
    new Birthday(6, 'Abdullah', '1990-06-06', 'Brother', 'No notes'),
    new Birthday(7, 'Hassan', '1990-07-07', 'Brother', 'No notes'),
    new Birthday(8, 'Hussein', '1990-08-08', 'Brother', 'No notes'),
    new Birthday(9, 'Yousef', '1990-09-09', 'Brother', 'No notes'),
    new Birthday(10, 'Majed', '1990-10-10', 'Brother', 'No notes'),
  ];
}
