import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authCookieInterceptor } from '@services/auth-cookie.interceptor';
import { httpLoadingInterceptor } from '@services/http-loading.interceptor';
import { httpErrorInterceptor } from '@services/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authCookieInterceptor, 
      httpLoadingInterceptor, 
      httpErrorInterceptor
    ]))
  ]
};
