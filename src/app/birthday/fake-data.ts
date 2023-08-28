import { Birthday } from './model/birthday.model';

function getRandomYear(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const currentYear = new Date().getFullYear();
const minBirthYear = 1990;
const maxBirthYear = 2020;

const birthdays: Birthday[] = [
  new Birthday(
    1,
    'Mohamed',
    `${getRandomYear(minBirthYear, maxBirthYear)}-09-26`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    2,
    'Ahmed',
    `${getRandomYear(minBirthYear, maxBirthYear)}-02-02`,
    'Sister',
    generateRandomNote()
  ),
  new Birthday(
    3,
    'Ali',
    `${getRandomYear(minBirthYear, maxBirthYear)}-03-03`,
    'Father',
    generateRandomNote()
  ),
  new Birthday(
    4,
    'Omar',
    `${getRandomYear(minBirthYear, maxBirthYear)}-04-04`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    5,
    'Khalid',
    `${getRandomYear(minBirthYear, maxBirthYear)}-05-05`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    6,
    'Abdullah',
    `${getRandomYear(minBirthYear, maxBirthYear)}-06-06`,
    'Friend',
    generateRandomNote()
  ),
  new Birthday(
    7,
    'Hassan',
    `${getRandomYear(minBirthYear, maxBirthYear)}-12-07`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    8,
    'Hussein',
    `${getRandomYear(minBirthYear, maxBirthYear)}-08-08`,
    'Work',
    generateRandomNote()
  ),
  new Birthday(
    9,
    'Yousef',
    `${getRandomYear(minBirthYear, maxBirthYear)}-09-09`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    10,
    'Majed',
    `${getRandomYear(minBirthYear, maxBirthYear)}-10-10`,
    'Brother',
    generateRandomNote()
  ),
  new Birthday(
    11,
    'Layla',
    `${getRandomYear(minBirthYear, maxBirthYear)}-11-11`,
    'Sister',
    generateRandomNote()
  ),
  new Birthday(
    12,
    'Amina',
    `${getRandomYear(minBirthYear, maxBirthYear)}-12-12`,
    'Friend',
    generateRandomNote()
  ),
  new Birthday(
    13,
    'Karim',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-01-13`,
    'Cousin',
    generateRandomNote()
  ),
  new Birthday(
    14,
    'Rana',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-02-14`,
    'Friend',
    generateRandomNote()
  ),
  new Birthday(
    15,
    'Sami',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-03-15`,
    'Colleague',
    generateRandomNote()
  ),
  new Birthday(
    16,
    'Nour',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-04-16`,
    'Sister',
    generateRandomNote()
  ),
  new Birthday(
    17,
    'Mona',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-05-17`,
    'Friend',
    generateRandomNote()
  ),
  new Birthday(
    18,
    'Tariq',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-06-18`,
    'Uncle',
    generateRandomNote()
  ),
  new Birthday(
    19,
    'Lina',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-07-19`,
    'Cousin',
    generateRandomNote()
  ),
  new Birthday(
    20,
    'Saeed',
    `${getRandomYear(minBirthYear, maxBirthYear) + 1}-08-20`,
    'Friend',
    generateRandomNote()
  ),
];

function generateRandomNote(): string {
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

export { birthdays };
