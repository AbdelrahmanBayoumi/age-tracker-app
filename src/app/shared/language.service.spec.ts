import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LanguageCode, LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: TranslateService;
  let documentMock: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [LanguageService],
    });

    translateService = TestBed.inject(TranslateService);
    documentMock = TestBed.inject(DOCUMENT);
    spyOn(translateService, 'use').and.returnValue(of({}));
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and default to English', () => {
    expect(service).toBeTruthy();
    expect(service.currentLanguage()).toBe(LanguageCode.English);
    expect(service.otherLanguage).toBe('عربي');
  });

  it('should switch language to Arabic and update direction to rtl', () => {
    service.switchLanguage();

    expect(service.currentLanguage()).toBe(LanguageCode.Arabic);
    expect(service.otherLanguage).toBe('English');
    expect(documentMock.documentElement.dir).toBe('rtl');
    expect(documentMock.documentElement.lang).toBe('ar');
  });

  it('should toggle language back to English and direction to ltr', () => {
    service.switchLanguage(); // to Arabic
    service.switchLanguage(); // back to English

    expect(service.currentLanguage()).toBe(LanguageCode.English);
    expect(service.otherLanguage).toBe('عربي');
    expect(documentMock.documentElement.dir).toBe('ltr');
    expect(documentMock.documentElement.lang).toBe('en');
  });
});
