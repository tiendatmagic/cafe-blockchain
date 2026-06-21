import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';

import { routes } from './app.routes';
import { authCookieInterceptor } from '@core/services/auth-cookie.interceptor';
import { cacheInterceptor } from '@core/services/cache.interceptor';
import { httpLoadingInterceptor } from '@core/services/http-loading.interceptor';
import { httpErrorInterceptor } from '@core/services/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withXhr(),
      withInterceptors([authCookieInterceptor, cacheInterceptor, httpLoadingInterceptor, httpErrorInterceptor]),
    ),
  ],
};
