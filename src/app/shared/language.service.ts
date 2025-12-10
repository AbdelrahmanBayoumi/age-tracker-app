import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export enum LanguageCode {
  Arabic = 'ar',
  English = 'en',
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  otherLanguage: string;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(LanguageCode.English);

    // if not language in localStorage see browser language
    let language = localStorage.getItem('lang');
    if (!localStorage.getItem('lang')) {
      let browserLang = translate.getBrowserLang();
      if (!browserLang) {
        browserLang = LanguageCode.English;
      }
      language = browserLang.match(/en|ar/) ? browserLang : LanguageCode.English;
    }

    translate.use(language || LanguageCode.English);
    this.otherLanguage = this.getLanguageNameByCode(
      language === LanguageCode.English ? LanguageCode.Arabic : LanguageCode.English
    );
  }

  switchLanguage() {
    if (this.translate.currentLang === LanguageCode.English) {
      this.translate.use(LanguageCode.Arabic);
      localStorage.setItem('lang', LanguageCode.Arabic);
      this.otherLanguage = this.getLanguageNameByCode(LanguageCode.English);
      console.log("[LanguageService] switchLanguage: 'ar'");
    } else {
      this.translate.use(LanguageCode.English);
      localStorage.setItem('lang', LanguageCode.English);
      this.otherLanguage = this.getLanguageNameByCode(LanguageCode.Arabic);
      console.log("[LanguageService] switchLanguage: 'en'");
    }
  }

  getLanguageNameByCode(code: LanguageCode) {
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
