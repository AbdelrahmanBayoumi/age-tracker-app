import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export enum LanguageCode {
  Arabic = 'ar',
  English = 'en',
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);

  readonly currentLanguage = signal<LanguageCode>(LanguageCode.English);
  readonly otherLanguageSignal = computed(() =>
    this.getLanguageNameByCode(
      this.currentLanguage() === LanguageCode.English ? LanguageCode.Arabic : LanguageCode.English
    )
  );

  get otherLanguage(): string {
    return this.otherLanguageSignal();
  }

  constructor() {
    this.translate.setDefaultLang(LanguageCode.English);

    let language: LanguageCode = LanguageCode.English;
    try {
      const savedLang = localStorage.getItem('lang') as LanguageCode;
      if (savedLang && (savedLang === LanguageCode.Arabic || savedLang === LanguageCode.English)) {
        language = savedLang;
      } else {
        const browserLang = this.translate.getBrowserLang();
        if (browserLang && browserLang.match(/en|ar/)) {
          language = browserLang as LanguageCode;
        }
      }
    } catch {
      language = LanguageCode.English;
    }

    this.applyLanguage(language);
  }

  switchLanguage(): void {
    const nextLang =
      this.currentLanguage() === LanguageCode.English ? LanguageCode.Arabic : LanguageCode.English;
    this.setLanguage(nextLang);
  }

  setLanguage(lang: LanguageCode): void {
    this.applyLanguage(lang);
  }

  private applyLanguage(lang: LanguageCode): void {
    this.translate.use(lang).subscribe({
      next: () => {
        this.currentLanguage.set(lang);
        try {
          localStorage.setItem('lang', lang);
        } catch {}
        this.updateDocumentDirection(lang);
      },
      error: () => {
        this.currentLanguage.set(lang);
        this.updateDocumentDirection(lang);
      },
    });
  }

  private updateDocumentDirection(lang: LanguageCode): void {
    if (this.document?.documentElement) {
      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = lang === LanguageCode.Arabic ? 'rtl' : 'ltr';
    }
  }

  getLanguageNameByCode(code: LanguageCode): string {
    switch (code) {
      case LanguageCode.Arabic:
        return 'عربي';
      case LanguageCode.English:
        return 'English';
      default:
        return '';
    }
  }
}

