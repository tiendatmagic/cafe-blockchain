import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StateService } from './state.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  
  return next(req).pipe(
    catchError((error: any) => {
      const isUnauthenticated = error instanceof HttpErrorResponse && 
        error.status === 401 && 
        (
          (error.error && error.error.message === 'Unauthenticated.') ||
          (typeof error.error === 'string' && error.error.includes('Unauthenticated.'))
        );

      if (isUnauthenticated) {
        // Lấy StateService một cách lazy để tránh lỗi vòng lặp phụ thuộc (circular dependency)
        const stateService = injector.get(StateService);
        if (stateService.web3Service.walletConnected()) {
          console.warn('Nhận được lỗi 401 (Unauthenticated) từ API. Tự động ngắt kết nối ví...');
          stateService.disconnectWalletAndClose('Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng kết nối lại ví!', true);
        }
      }
      return throwError(() => error);
    })
  );
};
