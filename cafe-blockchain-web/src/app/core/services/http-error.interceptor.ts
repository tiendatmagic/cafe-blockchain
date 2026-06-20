import { HttpInterceptorFn, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UiStateService } from './ui-state.service';
import { AuthService } from './auth.service';
import { Web3Service } from './web3.service';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStateService = inject(UiStateService);
  const authService = inject(AuthService);
  const web3Service = inject(Web3Service);
  const toastService = inject(ToastService);
  const router = inject(Router);

  // Kiểm tra xem trang hiện tại có phải là blockchain explorer không
  const isExplorer = router.url.includes('/blockchain-explorer') || 
                      (typeof window !== 'undefined' && window.location.pathname.includes('/blockchain-explorer'));

  // Kiểm tra xem trang hiện tại có phải là storefront không
  const isStorefront = router.url.includes('/store/') || 
                       (typeof window !== 'undefined' && window.location.pathname.includes('/store/'));

  const isBackendApi = req.url.startsWith(environment.apiBaseUrl);

  // Nếu hệ thống đang trong trạng thái bảo trì và không phải trang explorer, chặn request ngay từ client để chống spam
  if (uiStateService.isMaintenance() && isBackendApi && !isExplorer) {
    return throwError(() => new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
      error: { message: 'Hệ thống đang bảo trì, vui lòng quay lại sau.' }
    }));
  }

  return next(req).pipe(
    // Tự động hủy request này nếu nhận được tín hiệu hủy
    takeUntil(uiStateService.cancelRequests$),
    map((event: HttpEvent<any>) => {
      if (isBackendApi && event instanceof HttpResponse) {
        const body = event.body;
        if (body && body.success === false) {
          // Chủ động ném lỗi HttpErrorResponse để chuyển sang luồng bắt lỗi catchError bên dưới
          throw new HttpErrorResponse({
            error: body,
            status: 400,
            statusText: 'Bad Request',
            url: req.url
          });
        }
      }
      return event;
    }),
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        // Xử lý lỗi 503 bảo trì hệ thống hoặc lỗi status 0 (CORS block/mất kết nối) từ API backend
        if ((error.status === 503 || error.status === 0) && isBackendApi && !isExplorer) {
          console.warn(`Nhận được lỗi status ${error.status} từ Backend. Kích hoạt trạng thái bảo trì toàn hệ thống...`);
          uiStateService.isMaintenance.set(true);
          uiStateService.isInitialLoading.set(false); // Ẩn màn hình loading khởi tạo lập tiếp để hiện màn hình bảo trì
          uiStateService.cancelRequests$.next(); // Phát tín hiệu hủy toàn bộ request đang bay
        }

        const isUnauthenticated = error.status === 401;

        if (isUnauthenticated) {
          if (web3Service.walletConnected()) {
            console.warn('Nhận được lỗi 401 (Unauthenticated) từ API. Tự động ngắt kết nối ví...');
            authService.disconnectWalletAndClose('Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng kết nối lại ví!', true);
          }
        } else if (error.status !== 503 && !(error.status === 0 && isBackendApi)) {
          // 2. Tự động hiển thị Toast báo lỗi từ API (Bỏ qua lỗi 503 và lỗi sập backend vì đã có màn hình bảo trì)
          // Loại trừ trường hợp lấy thông tin store details trên trang public store (/store/:slug) 
          // để tránh hiện Toast đỏ lòm làm xấu giao diện (giao diện store tự render box thông báo lỗi chuyên nghiệp)
          const isStorefrontDetails = req.url.includes('/store/') && !req.url.includes('/orders');
          
          if (!isStorefrontDetails) {
            const errorMsg = error.error?.message || error.error?.error || error.message || 'Lỗi kết nối máy chủ!';
            
            const isFeatureError = errorMsg.includes('This feature is not unlocked');
            const isLimitError = errorMsg.includes('subscription plan has reached the maximum limit');

            if (isFeatureError && !isStorefront) {
              const featureKey = error.error?.feature || '';
              const config = authService.getFeatureConfig(featureKey);
              
              // Xác định xem request có phải là GET chạy ngầm ở background không
              const isGetRequest = req.method === 'GET';
              const isCurrentlyOnTargetRoute = config && router.url.includes('/' + config.tab);
              
              // Chỉ tự động hiển thị modal chặn nâng cấp nếu:
              // 1. Người dùng thao tác ghi dữ liệu chủ động (POST, PUT, DELETE) và bị chặn.
              // 2. Hoặc người dùng đang ở đúng trang của tính năng bị chặn đó (VD: ở trang /shifts và API GET bị chặn).
              const shouldTriggerModal = !isGetRequest || isCurrentlyOnTargetRoute;

              if (shouldTriggerModal && config) {
                uiStateService.triggerUpgradeModal(config.key, config.name);
              }
            }

            // Chỉ hiển thị Toast đỏ khi không phải lỗi khóa tính năng (đã hiện modal) và (không phải request GET bị dính limit)
            const isGetRequest = req.method === 'GET';
            if (!isFeatureError && !(isGetRequest && isLimitError)) {
              toastService.showToast(errorMsg, 'error');
            }
          }
        }
      }
      return throwError(() => error);
    })
  );
};

