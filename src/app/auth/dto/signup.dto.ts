export class SignupDto {
  email: string;
  password: string;
  fullName: string;
  birthday: string;
  constructor(
    email: string,
    password: string,
    fullName: string,
    birthday: string
  ) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    if (this.validateBirthdate(birthday)) {
      this.birthday = birthday;
    } else {
      throw new Error('Invalid birthday format');
    }
  }

  validateBirthdate(birthday: string): boolean {
    // Regular expression pattern for ISO 8601 date format (YYYY-MM-DD)
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

    // Test if the birthday matches the ISO 8601 format
    if (!isoDatePattern.test(birthday)) {
      return false; // Not in the required format
    }

    // Parse the date to check if it's a valid date
    const parsedDate = new Date(birthday);
    if (isNaN(parsedDate.getTime())) {
      return false; // Invalid date
    }

    return true; // Birthdate is in the correct format and valid
  }
}
