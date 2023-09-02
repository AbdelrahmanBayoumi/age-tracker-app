export class Birthday {
  public birthDate: Date;
  public birthDateStr: string;
  constructor(
    public id: number,
    public name: string,
    public birthday: string | Date,
    public relationship: string,
    public notes?: string,
    public image?: string,
    public userId?: string
  ) {
    this.birthDate = new Date(birthday);
    this.birthDateStr = this.birthday.toString();
  }

  setBirthdate(value: Date) {
    this.birthDate = value;
  }

  // return age and birth date in a string like: 30 years old (01-15)
  getAgeAndBirthDate(): string {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const birthDateStr = `${birthDate.getMonth() + 1}/${birthDate.getDate()}`;
    return ` ${birthDateStr} - ${age} years old`;
  }

  getDaysUntilNextBirthday(): number {
    const today = new Date();
    const birthDate = new Date(this.birthDate);

    // Set the year of the birth date to the current year
    birthDate.setFullYear(today.getFullYear());

    // If the birth date is before today, set it to next year
    if (birthDate < today) {
      birthDate.setFullYear(today.getFullYear() + 1);
    }

    // Calculate the time difference in milliseconds
    const timeDiff = birthDate.getTime() - today.getTime();

    // Convert milliseconds to days
    const daysUntilNextBirthday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysUntilNextBirthday;
  }

  update(newBirthday: Birthday): Birthday {
    this.name = newBirthday.name;
    this.birthDate = newBirthday.birthDate;
    this.relationship = newBirthday.relationship;
    this.notes = newBirthday.notes;
    return this;
  }
}
