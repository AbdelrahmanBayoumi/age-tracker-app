import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeAr);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
