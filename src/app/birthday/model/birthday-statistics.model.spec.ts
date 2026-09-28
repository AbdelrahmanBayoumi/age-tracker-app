import { BirthdayStatistics, SeasonAR, SeasonEN } from './birthday-statistics.model';

describe('BirthdayStatistics', () => {
  describe('Season calculation (getYearSeason)', () => {
    it('should correctly identify Spring in English and Arabic', () => {
      // April 15
      const date = new Date(2000, 3, 15);
      const statsEn = new BirthdayStatistics(date, 'en');
      const statsAr = new BirthdayStatistics(date, 'ar');

      expect(statsEn.yearSeason).toBe(SeasonEN.Spring);
      expect(statsAr.yearSeason).toBe(SeasonAR.Spring);
    });

    it('should correctly identify Summer in English and Arabic', () => {
      // July 20
      const date = new Date(2000, 6, 20);
      const statsEn = new BirthdayStatistics(date, 'en');
      const statsAr = new BirthdayStatistics(date, 'ar');

      expect(statsEn.yearSeason).toBe(SeasonEN.Summer);
      expect(statsAr.yearSeason).toBe(SeasonAR.Summer);
    });

    it('should correctly identify Autumn in English and Arabic', () => {
      // October 15
      const date = new Date(2000, 9, 15);
      const statsEn = new BirthdayStatistics(date, 'en');
      const statsAr = new BirthdayStatistics(date, 'ar');

      expect(statsEn.yearSeason).toBe(SeasonEN.Autumn);
      expect(statsAr.yearSeason).toBe(SeasonAR.Autumn);
    });

    it('should correctly identify Winter in English and Arabic', () => {
      // January 10
      const date = new Date(2000, 0, 10);
      const statsEn = new BirthdayStatistics(date, 'en');
      const statsAr = new BirthdayStatistics(date, 'ar');

      expect(statsEn.yearSeason).toBe(SeasonEN.Winter);
      expect(statsAr.yearSeason).toBe(SeasonAR.Winter);
    });
  });

  describe('Age metrics calculation', () => {
    it('should compute age in days, hours, minutes and seconds greater than zero for past date', () => {
      const birthdate = new Date(1995, 5, 15);
      const stats = new BirthdayStatistics(birthdate, 'en');

      expect(stats.age).toBeGreaterThan(20);
      expect(stats.ageInDays).toBeGreaterThan(7000);
      expect(stats.ageInHours).toBeGreaterThan(stats.ageInDays);
      expect(stats.ageInMinutes).toBeGreaterThan(stats.ageInHours);
      expect(stats.ageInSeconds).toBeGreaterThan(stats.ageInMinutes);
    });

    it('should set next birthday date and day of week correctly', () => {
      const birthdate = new Date(1995, 5, 15);
      const stats = new BirthdayStatistics(birthdate, 'en');

      expect(stats.nextBirthdate).toBeDefined();
      expect(stats.nextBirthdayDayOfWeek).toBeTruthy();
      expect(stats.toNextBirthdayStr).toBeDefined();
    });

    it('should calculate Hijri date details', () => {
      const birthdate = new Date(2000, 0, 1);
      const stats = new BirthdayStatistics(birthdate, 'en');

      expect(stats.hjiriDate).toBeDefined();
      expect(stats.hjiriDate.year).toBeGreaterThan(1400);
      expect(stats.hjiriDate.monthName).toBeTruthy();
    });
  });
});
