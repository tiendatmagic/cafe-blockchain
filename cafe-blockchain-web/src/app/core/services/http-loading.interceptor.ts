import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UiStateService } from './ui-state.service';
import { finalize } from 'rxjs/operators';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStateService = inject(UiStateService);
  
  // Bỏ qua loading overlay đối với các request có header X-Silent-Request hoặc chạy ngầm để tránh nhấp nháy giao diện
  const isSilent = req.headers.has('X-Silent-Request') || 
                   req.url.includes('/signature/check') || 
                   req.url.includes('/settings/public');
  
  let cleanReq = req;
  if (req.headers.has('X-Silent-Request')) {
    cleanReq = req.clone({
      headers: req.headers.delete('X-Silent-Request')
    });
  }
  
  if (!isSilent) {
    uiStateService.isLoading.set(true);
  }
  
  return next(cleanReq).pipe(
    finalize(() => {
      if (!isSilent) {
        uiStateService.isLoading.set(false);
      }
    })
  );
};

