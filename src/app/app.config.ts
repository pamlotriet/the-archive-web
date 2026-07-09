import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { routes } from '@app/app.routes';
import {
  AuthenticationApiEffects,
  authenticationApiFeatureKey,
  authenticationApiReducer,
} from '@features/authentication/state/authentication-api';
import {
  LibraryApiEffects,
  libraryApiFeatureKey,
  libraryApiReducer,
} from '@features/library/state/library-api';
import { TagsApiEffects, tagsApiFeatureKey, tagsApiReducer } from '@features/tags/state/tags-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    provideState(authenticationApiFeatureKey, authenticationApiReducer),
    provideState(libraryApiFeatureKey, libraryApiReducer),
    provideState(tagsApiFeatureKey, tagsApiReducer),
    provideEffects(AuthenticationApiEffects, LibraryApiEffects, TagsApiEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
    providePrimeNG({
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
