import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UiStateService } from './ui-state.service';
import { finalize } from 'rxjs/operators';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStateService = inject(UiStateService);
  
  // Bỏ qua loading overlay đối với các request polling hoặc chạy ngầm để tránh nhấp nháy giao diện
  const isSilent = req.url.includes('/signature/check') || req.url.includes('/settings/public');
  
  if (!isSilent) {
    uiStateService.isLoading.set(true);
  }
  
  return next(req).pipe(
    finalize(() => {
      if (!isSilent) {
        uiStateService.isLoading.set(false);
      }
    })
  );
};

