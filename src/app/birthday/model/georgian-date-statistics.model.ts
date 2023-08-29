export class GeorgianDateStatistics {
  constructor(public date: Date) {}

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this.date.getFullYear();
    const month = today.getMonth() - this.date.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < this.date.getDate())) {
      age--;
    }
    return age;
  }

  get ageString(): {
    years: number;
    months: number;
    days: number;
    hours: number;
    remainingMinutes: number;
    remainingSeconds: number;
  } {
    const today = new Date();
    const timeDiff = today.getTime() - this.date.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    return {
      years,
      months,
      days,
      hours,
      remainingMinutes,
      remainingSeconds,
    };
  }

  get whenNextBirthday(): {
    days: number;
    months: number;
    dayOfWeek: string;
    date: string;
  } {
    const today = new Date();
    const nextBirthday = new Date(
      today.getFullYear(),
      this.date.getMonth(),
      this.date.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const timeDiff = nextBirthday.getTime() - today.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    const dayOfWeek = nextBirthday.toLocaleString('en-us', {
      weekday: 'long',
    });
    // convert nextBirthday to dd-mm-yyyy
    const date = `${nextBirthday.getDate()}-${nextBirthday.getMonth()}-${nextBirthday.getFullYear()}`;

    return {
      days,
      months,
      dayOfWeek,
      date,
    };
  }
}
