import { Injectable } from '@angular/core';
import { Birthday } from './model/birthday.model';

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  birthdays: Birthday[] = [
    new Birthday(
      1,
      'Mohamed',
      '1990-09-26',
      'Brother',
      this.generateRandomNote()
    ),
    new Birthday(2, 'Ahmed', '1990-02-02', 'Sister', this.generateRandomNote()),
    new Birthday(3, 'Ali', '1990-03-03', 'Father', this.generateRandomNote()),
    new Birthday(4, 'Omar', '1990-04-04', 'Brother', this.generateRandomNote()),
    new Birthday(
      5,
      'Khalid',
      '1990-05-05',
      'Brother',
      this.generateRandomNote()
    ),
    new Birthday(
      6,
      'Abdullah',
      '1990-06-06',
      'Friend',
      this.generateRandomNote()
    ),
    new Birthday(
      7,
      'Hassan',
      '1990-12-07',
      'Brother',
      this.generateRandomNote()
    ),
    new Birthday(8, 'Hussein', '1990-08-08', 'Work', this.generateRandomNote()),
    new Birthday(
      9,
      'Yousef',
      '1990-09-09',
      'Brother',
      this.generateRandomNote()
    ),
    new Birthday(
      10,
      'Majed',
      '1990-10-10',
      'Brother',
      this.generateRandomNote()
    ),
    new Birthday(
      11,
      'Layla',
      '1990-11-11',
      'Sister',
      this.generateRandomNote()
    ),
    new Birthday(
      12,
      'Amina',
      '1990-12-12',
      'Friend',
      this.generateRandomNote()
    ),
    new Birthday(
      13,
      'Karim',
      '1991-01-13',
      'Cousin',
      this.generateRandomNote()
    ),
    new Birthday(14, 'Rana', '1991-02-14', 'Friend', this.generateRandomNote()),
    new Birthday(
      15,
      'Sami',
      '1991-03-15',
      'Colleague',
      this.generateRandomNote()
    ),
    new Birthday(16, 'Nour', '1991-04-16', 'Sister', this.generateRandomNote()),
    new Birthday(17, 'Mona', '1991-05-17', 'Friend', this.generateRandomNote()),
    new Birthday(18, 'Tariq', '1991-06-18', 'Uncle', this.generateRandomNote()),
    new Birthday(19, 'Lina', '1991-07-19', 'Cousin', this.generateRandomNote()),
    new Birthday(
      20,
      'Saeed',
      '1991-08-20',
      'Friend',
      this.generateRandomNote()
    ),
  ];

  generateRandomNote(): string {
    const notes = [
      'Always has a smile on their face.',
      'Loves to travel and explore new places.',
      'Enjoys cooking and trying new recipes.',
      'A great listener and always supportive.',
      'Passionate about playing musical instruments.',
      'Incredibly creative and loves DIY projects.',
      'Has a great sense of humor and makes everyone laugh.',
      'Enthusiastic about outdoor activities and sports.',
      'Loves reading and sharing interesting books.',
      'Very organized and efficient in everything they do.',
      'Has a deep love for animals and nature.',
      'Enjoys painting and expressing through art.',
      'Always up for a game night and fun activities.',
      'A natural leader and motivator.',
      'Loves photography and capturing beautiful moments.',
      'Passionate about social causes and volunteering.',
      'Enjoys watching and discussing movies and TV shows.',
      'Has a green thumb and loves gardening.',
      'Adventurous spirit, always seeking new challenges.',
      'A tech-savvy individual who loves gadgets.',
      // Add more random notes if needed
    ];

    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  }

  constructor() {}

  getRelationships(): Set<string> {
    return new Set(this.birthdays.map((birthday) => birthday.relationship));
  }

  getNextBirthdays(birthdays: Birthday[]): any[] {
    const today = new Date();

    const sortedBirthdays = birthdays
      .map((birthday) => {
        birthday.birthDate = new Date(birthday.birthDate);
        return birthday;
      })
      .sort((a, b) => {
        const aNextBirthday = new Date(a.birthDate);
        const bNextBirthday = new Date(b.birthDate);

        aNextBirthday.setFullYear(today.getFullYear());
        bNextBirthday.setFullYear(today.getFullYear());

        if (aNextBirthday < today) {
          aNextBirthday.setFullYear(today.getFullYear() + 1);
        }

        if (bNextBirthday < today) {
          bNextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return aNextBirthday.getTime() - bNextBirthday.getTime();
      });

    const groupedBirthdays: { [key: string]: Birthday[] } = {};

    for (const birthday of sortedBirthdays) {
      const nextBirthday = new Date(birthday.birthDate);
      nextBirthday.setFullYear(today.getFullYear());

      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const birthMonthKey = `${nextBirthday.getFullYear()}-${(
        nextBirthday.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;
      if (!groupedBirthdays[birthMonthKey]) {
        groupedBirthdays[birthMonthKey] = [];
      }
      groupedBirthdays[birthMonthKey].push(birthday);
    }

    const resultArray = Object.keys(groupedBirthdays).map((key) => {
      return {
        month: key,
        birthdays: groupedBirthdays[key],
      };
    });

    return resultArray;
  }
}
