import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StateService } from './state.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  
  return next(req).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        const stateService = injector.get(StateService);

        // 1. Kiểm tra lỗi 401 Unauthorized (Unauthenticated)
        const isUnauthenticated = error.status === 401 && 
          (
            (error.error && error.error.message === 'Unauthenticated.') ||
            (typeof error.error === 'string' && error.error.includes('Unauthenticated.'))
          );

        if (isUnauthenticated) {
          if (stateService.web3Service.walletConnected()) {
            console.warn('Nhận được lỗi 401 (Unauthenticated) từ API. Tự động ngắt kết nối ví...');
            stateService.disconnectWalletAndClose('Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng kết nối lại ví!', true);
          }
        } else {
          // 2. Tự động hiển thị Toast báo lỗi từ API
          // Loại trừ trường hợp lấy thông tin store details trên trang public store (/store/:slug) 
          // để tránh hiện Toast đỏ lòm làm xấu giao diện (giao diện store tự render box thông báo lỗi chuyên nghiệp)
          const isStorefrontDetails = req.url.includes('/store/') && !req.url.includes('/orders');
          
          if (!isStorefrontDetails) {
            const errorMsg = error.error?.message || error.error?.error || error.message || 'Lỗi kết nối máy chủ!';
            stateService.errorMessage.set(errorMsg);
            
            // Xóa message sau 4 giây để ẩn Toast
            setTimeout(() => {
              stateService.errorMessage.set('');
            }, 4000);
          }
        }
      }
      return throwError(() => error);
    })
  );
};
