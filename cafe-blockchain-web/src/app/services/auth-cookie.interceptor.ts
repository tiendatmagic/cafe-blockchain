import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authCookieInterceptor: HttpInterceptorFn = (req, next) => {
  // Tự động đính kèm withCredentials: true cho tất cả các request gửi tới Laravel Backend API
  if (req.url.startsWith(environment.apiBaseUrl)) {
    req = req.clone({
      withCredentials: true
    });
  }
  return next(req);
};
