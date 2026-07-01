import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { routes } from '@app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
    providePrimeNG({
      license:
        'eyJpZCI6ImQ3MDUwYzY4LTA5M2EtNGY2Yi04NmE3LTQ0Y2IwMjA3YmU4NSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODI4OTYzMDEsImV4cCI6MTgxNDQzMjMwMX0.xYswTGP0Qm39f3ZhUVoC7rr5Wbe0ZQ6vAaQzC66N5GnL_-usDAKDKXE-JEuyjvzgLaEikXlMbJilnAfdRw5XDg',
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          darkMode: false,
        },
      },
    }),
  ],
};
