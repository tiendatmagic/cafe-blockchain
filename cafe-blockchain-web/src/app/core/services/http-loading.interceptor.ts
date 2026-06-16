import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { StateService } from './state.service';
import { finalize } from 'rxjs/operators';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  
  // Bỏ qua loading overlay đối với các request polling hoặc chạy ngầm để tránh nhấp nháy giao diện
  const isSilent = req.url.includes('/signature/check') || req.url.includes('/settings/public');
  
  let stateService: StateService | null = null;
  if (!isSilent) {
    // Lazy load StateService to break circular dependency during initialization
    stateService = injector.get(StateService);
    stateService.isLoading.set(true);
  }
  
  return next(req).pipe(
    finalize(() => {
      if (!isSilent && stateService) {
        stateService.isLoading.set(false);
      }
    })
  );
};
