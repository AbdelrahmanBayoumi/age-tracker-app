import uq from '@umalqura/core';

interface DetailedAge {
  years: number;
  remainingMonths: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
}

interface HijriDate {
  fullDate: string;
  year: number;
  month: number;
  monthNameAR: string;
  monthNameEN: string;
  day: number;
}

export class BirthdayStatistics {
  georgianCalendarBirthday: string;
  ageDetailed: DetailedAge;
  age: number;
  ageInMonths: {
    months: number;
    days: number;
  };
  ageInWeeks: {
    weeks: number;
    days: number;
  };
  ageInDays: number;
  ageInHours: number;
  ageInMinutes: number;
  ageInSeconds: number;
  yearSeason: string;
  nextBirthdateString: string;
  nextBirthdayDayOfWeek: string;
  nextBirthdate: Date;
  toNextBirthdayStr: {
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };

  hjiriDate: HijriDate;
  ageInHijri: DetailedAge;

  private readonly today: Date;
  private readonly ageInMillis: number;
  constructor(public birthdate: Date) {
    this.today = new Date();
    this.ageInMillis = this.today.getTime() - this.birthdate.getTime();
    this.georgianCalendarBirthday = birthdate.toISOString().split('T')[0];
    this.ageDetailed = this.getAgeDetailed();
    this.age = this.ageDetailed.years;
    this.ageInMonths = this.getAgeInMonths();
    this.ageInWeeks = this.getAgeInWeeks();
    this.ageInDays = this.getAgeInDays();
    this.ageInHours = this.getAgeInHours();
    this.ageInMinutes = this.getAgeInMinutes();
    this.ageInSeconds = this.getAgeInSeconds();
    this.yearSeason = this.getYearSeason();
    this.nextBirthdateString = this.getNextBirthdate();
    this.nextBirthdate = new Date(this.nextBirthdateString);
    this.nextBirthdayDayOfWeek = this.nextBirthdate.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
      }
    );
    this.hjiriDate = this.getHijriDate();
    this.ageInHijri = this.getAgeInHijri();
    this.toNextBirthdayStr = this.getToNextBirthdayStr();
  }

  getAgeDetailed(): DetailedAge {
    const years = Math.floor(this.ageInMillis / (365.25 * 24 * 60 * 60 * 1000));
    const remainingMillis =
      this.ageInMillis - years * (365.25 * 24 * 60 * 60 * 1000);

    const months = Math.floor(remainingMillis / (30.44 * 24 * 60 * 60 * 1000));
    const remainingMillisMonths =
      remainingMillis - months * (30.44 * 24 * 60 * 60 * 1000);

    const days = Math.floor(remainingMillisMonths / (24 * 60 * 60 * 1000));
    const remainingMillisDays =
      remainingMillisMonths - days * (24 * 60 * 60 * 1000);

    const hours = Math.floor(remainingMillisDays / (60 * 60 * 1000));
    const remainingMillisHours = remainingMillisDays - hours * (60 * 60 * 1000);

    const minutes = Math.floor(remainingMillisHours / (60 * 1000));
    const remainingMillisMinutes = remainingMillisHours - minutes * (60 * 1000);

    const seconds = Math.floor(remainingMillisMinutes / 1000);

    return {
      years,
      remainingMonths: months,
      remainingDays: days,
      remainingHours: hours,
      remainingMinutes: minutes,
      remainingSeconds: seconds,
    };
  }

  getAgeInMonths(): { months: number; days: number } {
    const months = Math.floor(this.ageInMillis / (30.44 * 24 * 60 * 60 * 1000));
    const remainingMillis =
      this.ageInMillis - months * (30.44 * 24 * 60 * 60 * 1000);

    const days = Math.floor(remainingMillis / (24 * 60 * 60 * 1000));

    return { months, days };
  }

  getAgeInWeeks(): { weeks: number; days: number } {
    const weeks = Math.floor(this.ageInMillis / (7 * 24 * 60 * 60 * 1000));
    const remainingMillis =
      this.ageInMillis - weeks * (7 * 24 * 60 * 60 * 1000);

    const days = Math.floor(remainingMillis / (24 * 60 * 60 * 1000));

    return { weeks, days };
  }

  getAgeInDays(): number {
    return Math.floor(this.ageInMillis / (24 * 60 * 60 * 1000));
  }

  getAgeInHours(): number {
    return Math.floor(this.ageInMillis / (60 * 60 * 1000));
  }

  getAgeInMinutes(): number {
    return Math.floor(this.ageInMillis / (60 * 1000));
  }

  getAgeInSeconds(): number {
    return Math.floor(this.ageInMillis / 1000);
  }

  getYearSeason(): string {
    // TODO: FIX ME: This is not accurate
    const month = this.birthdate.getMonth() + 1;
    const day = this.birthdate.getDate();

    if (
      (month === 3 && day >= 20) ||
      month === 4 ||
      month === 5 ||
      (month === 6 && day < 21)
    ) {
      return 'Spring';
    } else if (
      (month === 6 && day >= 21) ||
      month === 7 ||
      month === 8 ||
      (month === 9 && day < 23)
    ) {
      return 'Summer';
    } else if (
      (month === 9 && day >= 23) ||
      month === 10 ||
      month === 11 ||
      (month === 12 && day < 21)
    ) {
      return 'Autumn';
    } else {
      return 'Winter';
    }
  }

  getNextBirthdate(): string {
    const birthdateUTC = new Date(
      Date.UTC(
        this.today.getUTCFullYear(),
        this.birthdate.getUTCMonth(),
        this.birthdate.getUTCDate(),
        12 // Set a consistent time (e.g., noon) to avoid DST issues
      )
    );

    if (birthdateUTC.getTime() <= this.today.getTime()) {
      birthdateUTC.setUTCFullYear(birthdateUTC.getUTCFullYear() + 1);
    }

    return birthdateUTC.toISOString().split('T')[0];
  }

  getToNextBirthdayStr(): {
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const nextBirthdate = new Date(this.getNextBirthdate());
    const today = new Date();

    const millisToNextBirthdate = nextBirthdate.getTime() - today.getTime();

    const months = Math.floor(
      millisToNextBirthdate / (30.44 * 24 * 60 * 60 * 1000)
    );
    const remainingMillis =
      millisToNextBirthdate - months * (30.44 * 24 * 60 * 60 * 1000);

    const days = Math.floor(remainingMillis / (24 * 60 * 60 * 1000));
    const remainingMillisDays = remainingMillis - days * (24 * 60 * 60 * 1000);

    const hours = Math.floor(remainingMillisDays / (60 * 60 * 1000));
    const remainingMillisHours = remainingMillisDays - hours * (60 * 60 * 1000);

    const minutes = Math.floor(remainingMillisHours / (60 * 1000));
    const remainingMillisMinutes = remainingMillisHours - minutes * (60 * 1000);

    const seconds = Math.floor(remainingMillisMinutes / 1000);

    return {
      months: Math.max(0, months), // Ensure months is non-negative
      days,
      hours,
      minutes,
      seconds,
    };
  }

  getHijriDate(): HijriDate {
    console.log(this.birthdate);
    const hijriDate = uq(this.birthdate);
    return {
      fullDate: hijriDate.format('yyyy-MM-dd', 'en'),
      year: hijriDate.hy,
      month: hijriDate.hm,
      monthNameAR: hijriDate.format('MMMM', 'ar'),
      monthNameEN: hijriDate.format('MMMM', 'en'),
      day: hijriDate.hd,
    };
  }

  getAgeInHijri(): DetailedAge {
    const hijriBirthdate = uq(this.birthdate);
    const hijriToday = uq(this.today);

    console.log(hijriBirthdate);
    console.log(hijriToday);

    let years = hijriToday.hy - hijriBirthdate.hy;
    let remainingMonths = hijriToday.hm - hijriBirthdate.hm;
    let remainingDays = hijriToday.hd - hijriBirthdate.hd;

    if (remainingDays < 0) {
      remainingMonths -= 1;
      remainingDays += hijriToday.daysInMonth;
    }

    if (remainingMonths < 0) {
      years -= 1;
      remainingMonths += 12;
    }

    return {
      years,
      remainingMonths,
      remainingDays,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
    };
  }

  toJSON(): any {
    const { today: today, ...jsonObject } = this;

    return jsonObject;
  }
}
