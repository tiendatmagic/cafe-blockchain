import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class SettingStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);
  private readonly colorStorageKey = 'dapp_dynamic_colors';

  // States
  public readonly isSettingsLoading = signal<boolean>(false);
  public readonly settings = signal<any>({
    store_name: 'Blockchain Cafe & Bistro',
    contract_address: '',
    finance_contract_address: '',
    rpc_url: 'https://ethereum-sepolia.publicnode.com',
    chain_id: '11155111',
    explorer_url: 'https://sepolia.etherscan.io',
    explorer_api_key: '',
    primary_color: '#7c3aed',
    secondary_color: '#c084fc',
    default_print_size: '80mm',
    show_crypto_payment: '0',
    has_synced_menu: '0',
    has_synced_orders: false,
    has_synced_transactions: false
  });

  /**
   * Cập nhật cache cài đặt thủ công (sử dụng khi tải từ effect bên ngoài)
   */
  public updateSettingsCache(settings: any) {
    this.settings.set(settings);
    this.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
    this.web3Service.updateConfig(settings);
  }

  /**
   * Tải cấu hình từ backend
   */
  public loadSettings(hasSettingsPermission: boolean, force: boolean = false) {
    if (!this.web3Service.walletConnected()) {
      return;
    }

    if (this.isSettingsLoading()) {
      return;
    }
    this.isSettingsLoading.set(true);

    const settingsObservable = hasSettingsPermission
      ? this.apiService.getSettings(5 * 60 * 1000, force) 
      : this.apiService.getPublicSettings();

    settingsObservable.subscribe({
      next: (res) => {
        const updated = {
          default_print_size: '80mm',
          show_crypto_payment: '0',
          has_synced_menu: '0',
          ...res
        };
        this.updateSettingsCache(updated);
        this.isSettingsLoading.set(false);
      },
      error: (err) => {
        console.error('[SettingStore] Lỗi tải cấu hình:', err);
        this.applyAndCacheDynamicColors('#7c3aed', '#c084fc');
        this.isSettingsLoading.set(false);
      }
    });
  }

  public applyDynamicColors(primary: string, secondary: string) {
    if (typeof document !== 'undefined') {
      const pColor = primary || '#7c3aed';
      const sColor = secondary || '#c084fc';
      document.documentElement.style.setProperty('--dynamic-primary', pColor);
      document.documentElement.style.setProperty('--dynamic-secondary', sColor);
    }
  }

  public applyAndCacheDynamicColors(primary: string, secondary: string) {
    this.applyDynamicColors(primary, secondary);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.colorStorageKey, JSON.stringify({
        primary_color: primary || '#7c3aed',
        secondary_color: secondary || '#c084fc'
      }));
    }
  }

  public applyCachedDynamicColors() {
    if (typeof window === 'undefined') return;
    const cachedColors = localStorage.getItem(this.colorStorageKey);
    if (!cachedColors) {
      this.applyDynamicColors('#7c3aed', '#c084fc');
      return;
    }

    try {
      const colors = JSON.parse(cachedColors);
      this.applyDynamicColors(colors.primary_color, colors.secondary_color);
    } catch {
      localStorage.removeItem(this.colorStorageKey);
      this.applyDynamicColors('#7c3aed', '#c084fc');
    }
  }
}
