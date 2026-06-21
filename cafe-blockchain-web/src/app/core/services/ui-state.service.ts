import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  // Trạng thái UI và Menu
  public readonly activeTab = signal<string>('dashboard');
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly currentUrl = signal<string>('');

  // Trạng thái Loading và Bảo trì
  public readonly isInitialLoading = signal<boolean>(true);
  public readonly isLoading = signal<boolean>(false); // Cho loading overlay của HTTP requests
  public readonly isMaintenance = signal<boolean>(false);
  public readonly maintenanceType = signal<'maintenance' | 'connection' | null>(null);
  public readonly cancelRequests$ = new Subject<void>();

  // Trạng thái Modals chặn tính năng nâng cấp (Upgrade)
  public readonly blockedFeatureInRoute = signal<{ key: string, name: string } | null>(null);
  public readonly isUpgradeModalOpen = signal<boolean>(false);
  public readonly upgradeModalStep = signal<number>(1);
  public readonly lockedFeatureKey = signal<string>('');
  public readonly lockedFeatureName = signal<string>('');

  // Trạng thái Modal ví (có thể được điều phối tại đây)
  public readonly isWalletModalOpen = signal<boolean>(false);

  // Hiệu ứng trượt menu/sidebar (sliding background) toàn cục
  public readonly useSlidingEffect = signal<boolean>(
    typeof window !== 'undefined'
      ? localStorage.getItem('ui_sliding_effect') === 'true'
      : false
  );

  public setSlidingEffect(enabled: boolean) {
    this.useSlidingEffect.set(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ui_sliding_effect', String(enabled));
    }
  }

  // Kích hoạt mở modal blocked & nâng cấp tính năng
  public triggerUpgradeModal(featureKey: string, featureName: string) {
    this.lockedFeatureKey.set(featureKey);
    this.lockedFeatureName.set(featureName);
    
    this.isWalletModalOpen.set(false);
    this.isUpgradeModalOpen.set(true);
    this.upgradeModalStep.set(1);
  }

  // Mở trực tiếp step 2 nâng cấp
  public triggerUpgradeModalDirectly(featureKey: string, featureName: string) {
    this.lockedFeatureKey.set(featureKey);
    this.lockedFeatureName.set(featureName);
    
    this.isWalletModalOpen.set(false);
    this.isUpgradeModalOpen.set(true);
    this.upgradeModalStep.set(2);
  }
}
