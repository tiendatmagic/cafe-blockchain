import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from './state.service';
import { finalize } from 'rxjs/operators';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);
  
  // Bỏ qua loading overlay đối với các request polling hoặc chạy ngầm để tránh nhấp nháy giao diện
  const isSilent = req.url.includes('/signature/check') || req.url.includes('/settings/public');
  
  if (!isSilent) {
    stateService.isLoading.set(true);
  }
  
  return next(req).pipe(
    finalize(() => {
      if (!isSilent) {
        stateService.isLoading.set(false);
      }
    })
  );
};
