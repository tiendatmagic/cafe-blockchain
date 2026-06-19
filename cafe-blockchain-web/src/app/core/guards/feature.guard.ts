import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StateService } from '../services/state.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanActivate {
  private readonly stateService = inject(StateService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const featureKey = route.data['featureKey'];
    const featureName = route.data['featureName'];

    if (featureKey && !this.stateService.hasFeature(featureKey)) {
      this.stateService.blockedFeatureInRoute.set({ key: featureKey, name: featureName });
      return true; // Cho phép kích hoạt để giữ nguyên URL bị block trên trình duyệt
    }

    this.stateService.blockedFeatureInRoute.set(null);
    return true;
  }
}
