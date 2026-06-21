import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import { ToastService } from './toast.service';

export interface FeatureConfig {
  key: string;
  tab: string;
  name: string;
}

export const FEATURE_CONFIGS: FeatureConfig[] = [
  { key: 'enable_dashboard', tab: 'dashboard', name: 'Tổng quan' },
  { key: 'enable_pos', tab: 'pos', name: 'Bán hàng POS' },
  { key: 'enable_orders', tab: 'orders', name: 'Đơn hàng' },
  { key: 'enable_tables', tab: 'tables', name: 'Sơ đồ bàn' },
  { key: 'enable_shifts', tab: 'shifts', name: 'Ca làm việc' },
  { key: 'enable_menu', tab: 'menu', name: 'Quản lý Thực đơn' },
  { key: 'enable_inventory', tab: 'inventory', name: 'Kho hàng' },
  { key: 'enable_customers', tab: 'customers', name: 'Khách hàng' },
  { key: 'enable_debts', tab: 'debts', name: 'Sổ nợ' },
  { key: 'enable_financials', tab: 'financials', name: 'Thu chi tài chính' },
  { key: 'enable_reports', tab: 'reports', name: 'Báo cáo' },
  { key: 'enable_staffs', tab: 'staffs', name: 'Nhân viên' }
];

export const DEFAULT_PLAN_FEATURES: Record<string, Record<string, any>> = {
  'free': {
    'enable_dashboard': true,
    'enable_pos': true,
    'enable_orders': true,
    'enable_tables': true,
    'enable_shifts': false,
    'enable_menu': true,
    'enable_inventory': false,
    'enable_customers': true,
    'enable_debts': false,
    'enable_financials': false,
    'enable_reports': false,
    'enable_excel_export': false,
    'enable_storefront': false,
    'enable_staffs': true,
    'max_products': 20,
    'max_staffs': 2,
    'max_customers': 50,
    'max_transactions': 100,
    'max_debts': 10
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Trạng thái đã xác thực đăng nhập backend
  public readonly isAuthLoggedIn = signal<boolean>(false);

  // Trạng thái chờ ký xác thực Web3 và modal ví
  public readonly isWaitingForSignature = signal<boolean>(false);
  public readonly isCurrentlySigning = signal<boolean>(false);
  public readonly isWalletModalOpen = signal<boolean>(false);

  // Các thông tin nonce chờ ký
  public pendingNonceMessage = '';
  public pendingAddress = '';

  // Vai trò và quyền truy cập của người dùng hiện tại
  public readonly currentUserRole = signal<string>('Chủ cửa hàng');
  public readonly currentUserPermissions = signal<any>(null); // null tức là Chủ cửa hàng (Full quyền)

  // Thông tin thuê bao và Super Admin
  public readonly isSuperAdmin = signal<boolean>(false);
  public readonly subscriptionPlanCode = signal<string>('free');
  public readonly subscriptionExpiresAt = signal<string | null>(null);
  public readonly subscriptionStatus = signal<string>('active');
  public readonly planFeatures = signal<any>(null);

  // Danh sách liên hệ hệ thống
  public readonly systemContacts = signal<any[]>([]);

  // Thông tin profile cá nhân
  public readonly currentUserName = signal<string>('');
  public readonly currentUserEmail = signal<string>('');
  public readonly currentUserPhone = signal<string>('');

  constructor() {
    this.restoreSessionFromStorage();
  }

  /**
   * Khôi phục phiên kết nối ví và đăng nhập từ localStorage nếu hợp lệ
   */
  private restoreSessionFromStorage() {
    if (typeof window === 'undefined') return;
    const savedAddress = localStorage.getItem('auth_address');
    if (savedAddress && this.hasValidAuthToken(savedAddress)) {
      this.isAuthLoggedIn.set(true);
      this.isSuperAdmin.set(localStorage.getItem('auth_is_super_admin') === 'true');
      this.currentUserRole.set(localStorage.getItem('auth_role') || 'Chủ cửa hàng');
      
      const permStr = localStorage.getItem('auth_permissions');
      if (permStr) {
        try {
          this.currentUserPermissions.set(JSON.parse(permStr));
        } catch {
          this.currentUserPermissions.set(null);
        }
      }

      this.subscriptionPlanCode.set(localStorage.getItem('auth_subscription_plan_code') || 'free');
      this.subscriptionExpiresAt.set(localStorage.getItem('auth_subscription_expires_at'));
      this.subscriptionStatus.set(localStorage.getItem('auth_subscription_status') || 'active');

      const featStr = localStorage.getItem('auth_plan_features');
      if (featStr) {
        try {
          this.planFeatures.set(JSON.parse(featStr));
        } catch {
          this.planFeatures.set(null);
        }
      }

      const contactsStr = localStorage.getItem('auth_system_contacts');
      if (contactsStr) {
        try {
          this.systemContacts.set(JSON.parse(contactsStr));
        } catch {
          this.systemContacts.set([]);
        }
      }

      this.currentUserName.set(localStorage.getItem('auth_user_name') || '');
      this.currentUserEmail.set(localStorage.getItem('auth_user_email') || '');
      this.currentUserPhone.set(localStorage.getItem('auth_user_phone') || '');
    }
  }

  /**
   * Kiểm tra xem session xác thực có hợp lệ không
   */
  private hasValidAuthToken(account: string): boolean {
    if (typeof window === 'undefined') return false;
    const savedAddress = localStorage.getItem('auth_address');
    const isLoggedIn = localStorage.getItem('auth_logged_in') === 'true';

    let hasLoggedCookie = false;
    if (typeof document !== 'undefined') {
      hasLoggedCookie = document.cookie.split(';').some(c => c.trim().startsWith('auth_logged_in='));
    }

    return !!savedAddress && savedAddress.toLowerCase() === account.toLowerCase() && (isLoggedIn || hasLoggedCookie);
  }

  /**
   * Yêu cầu ký xác thực ví với Nonce từ Server cho một địa chỉ ví cụ thể (không mở modal)
   */
  public async requestSignatureForAddress(address: string): Promise<boolean> {
    if (this.isCurrentlySigning()) return false;
    this.isCurrentlySigning.set(true);

    return new Promise<boolean>((resolve) => {
      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          this.pendingNonceMessage = res.message;
          this.pendingAddress = address;
          this.isWaitingForSignature.set(true);
          this.toastService.showToast('Vui lòng ký xác thực trên ví của bạn...', 'success');

          try {
            const signature = await this.web3Service.signMessage(res.message);
            this.isWaitingForSignature.set(false);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                this.isCurrentlySigning.set(false);
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                    localStorage.setItem('auth_logged_in', 'true');
                    this.isAuthLoggedIn.set(true);
                    localStorage.setItem('auth_is_super_admin', verifyRes.is_super_admin ? 'true' : 'false');
                    this.isSuperAdmin.set(!!verifyRes.is_super_admin);

                    if (verifyRes.role) {
                      localStorage.setItem('auth_role', verifyRes.role);
                      this.currentUserRole.set(verifyRes.role);
                    } else {
                      localStorage.removeItem('auth_role');
                      this.currentUserRole.set('Chủ cửa hàng');
                    }
                    if (verifyRes.permissions) {
                      const permStr = JSON.stringify(verifyRes.permissions);
                      localStorage.setItem('auth_permissions', permStr);
                      this.currentUserPermissions.set(verifyRes.permissions);
                    } else {
                      localStorage.removeItem('auth_permissions');
                      this.currentUserPermissions.set(null);
                    }

                    if (verifyRes.subscription) {
                      const sub = verifyRes.subscription;
                      localStorage.setItem('auth_subscription_plan_code', sub.plan_code || 'free');
                      localStorage.setItem('auth_subscription_expires_at', sub.subscription_expires_at || '');
                      localStorage.setItem('auth_subscription_status', sub.subscription_status || 'active');

                      this.subscriptionPlanCode.set(sub.plan_code || 'free');
                      this.subscriptionExpiresAt.set(sub.subscription_expires_at || null);
                      this.subscriptionStatus.set(sub.subscription_status || 'active');

                      if (sub.features) {
                        localStorage.setItem('auth_plan_features', JSON.stringify(sub.features));
                        this.planFeatures.set(sub.features);
                      } else {
                        localStorage.removeItem('auth_plan_features');
                        this.planFeatures.set(null);
                      }
                    } else {
                      localStorage.removeItem('auth_subscription_plan_code');
                      localStorage.removeItem('auth_subscription_expires_at');
                      localStorage.removeItem('auth_subscription_status');
                      localStorage.removeItem('auth_plan_features');

                      this.subscriptionPlanCode.set('free');
                      this.subscriptionExpiresAt.set(null);
                      this.subscriptionStatus.set('active');
                      this.planFeatures.set(null);
                    }

                    if (verifyRes.system_contacts) {
                      localStorage.setItem('auth_system_contacts', JSON.stringify(verifyRes.system_contacts));
                      this.systemContacts.set(verifyRes.system_contacts);
                    } else {
                      localStorage.removeItem('auth_system_contacts');
                      this.systemContacts.set([]);
                    }

                    if (verifyRes.name) {
                      localStorage.setItem('auth_user_name', verifyRes.name);
                      this.currentUserName.set(verifyRes.name);
                    } else {
                      localStorage.removeItem('auth_user_name');
                      this.currentUserName.set('');
                    }
                    if (verifyRes.email) {
                      localStorage.setItem('auth_user_email', verifyRes.email);
                      this.currentUserEmail.set(verifyRes.email);
                    } else {
                      localStorage.removeItem('auth_user_email');
                      this.currentUserEmail.set('');
                    }
                    if (verifyRes.phone) {
                      localStorage.setItem('auth_user_phone', verifyRes.phone);
                      this.currentUserPhone.set(verifyRes.phone);
                    } else {
                      localStorage.removeItem('auth_user_phone');
                      this.currentUserPhone.set('');
                    }
                  }
                  
                  this.web3Service.walletConnected.set(true);
                  this.toastService.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.isWalletModalOpen.set(false);

                  if (!this.router.url.includes('/dashboard')) {
                    this.router.navigate(['/dashboard']);
                  }
                  resolve(true);
                } else {
                  resolve(false);
                }
              },
              error: (err) => {
                this.isWaitingForSignature.set(false);
                this.isCurrentlySigning.set(false);
                this.web3Service.disconnectWallet();
                this.toastService.showToast('Xác thực chữ ký thất bại!', 'error');
                resolve(false);
              }
            });
          } catch (e) {
            this.isWaitingForSignature.set(false);
            this.isCurrentlySigning.set(false);
            this.web3Service.disconnectWallet();
            this.toastService.showToast('Bạn đã từ chối ký xác thực!', 'error');
            resolve(false);
          }
        },
        error: (err) => {
          this.isWaitingForSignature.set(false);
          this.isCurrentlySigning.set(false);
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.toastService.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
          resolve(false);
        }
      });
    });
  }

  /**
   * Kết nối và Yêu cầu Ký ví Web3 Auth
   */
  public async connectWalletAndSign() {
    if (this.isCurrentlySigning()) return;
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;
      await this.requestSignatureForAddress(address);
    }
  }

  /**
   * Ký lại xác thực khi bấm nút "Ký ngay"
   */
  public async retrySign() {
    if (this.isCurrentlySigning()) return;
    if (!this.pendingNonceMessage || !this.pendingAddress) return;
    this.isCurrentlySigning.set(true);
    try {
      const signature = await this.web3Service.signMessage(this.pendingNonceMessage);
      this.isWaitingForSignature.set(false);

      this.apiService.verifySignature(this.pendingAddress, signature).subscribe({
        next: (verifyRes) => {
          this.isCurrentlySigning.set(false);
          if (verifyRes.token) {
            this.apiService.setToken(verifyRes.token);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_address', this.pendingAddress);
              localStorage.setItem('auth_logged_in', 'true');
              this.isAuthLoggedIn.set(true);
              localStorage.setItem('auth_is_super_admin', verifyRes.is_super_admin ? 'true' : 'false');
              this.isSuperAdmin.set(!!verifyRes.is_super_admin);

              if (verifyRes.role) {
                localStorage.setItem('auth_role', verifyRes.role);
                this.currentUserRole.set(verifyRes.role);
              } else {
                localStorage.removeItem('auth_role');
                this.currentUserRole.set('Chủ cửa hàng');
              }
              if (verifyRes.permissions) {
                localStorage.setItem('auth_permissions', JSON.stringify(verifyRes.permissions));
                this.currentUserPermissions.set(verifyRes.permissions);
              } else {
                localStorage.removeItem('auth_permissions');
                this.currentUserPermissions.set(null);
              }

              if (verifyRes.subscription) {
                const sub = verifyRes.subscription;
                localStorage.setItem('auth_subscription_plan_code', sub.plan_code || 'free');
                localStorage.setItem('auth_subscription_expires_at', sub.subscription_expires_at || '');
                localStorage.setItem('auth_subscription_status', sub.subscription_status || 'active');

                this.subscriptionPlanCode.set(sub.plan_code || 'free');
                this.subscriptionExpiresAt.set(sub.subscription_expires_at || null);
                this.subscriptionStatus.set(sub.subscription_status || 'active');

                if (sub.features) {
                  localStorage.setItem('auth_plan_features', JSON.stringify(sub.features));
                  this.planFeatures.set(sub.features);
                } else {
                  localStorage.removeItem('auth_plan_features');
                  this.planFeatures.set(null);
                }
              }

              if (verifyRes.name) {
                localStorage.setItem('auth_user_name', verifyRes.name);
                this.currentUserName.set(verifyRes.name);
              } else {
                localStorage.removeItem('auth_user_name');
                this.currentUserName.set('');
              }
              if (verifyRes.email) {
                localStorage.setItem('auth_user_email', verifyRes.email);
                this.currentUserEmail.set(verifyRes.email);
              } else {
                localStorage.removeItem('auth_user_email');
                this.currentUserEmail.set('');
              }
              if (verifyRes.phone) {
                localStorage.setItem('auth_user_phone', verifyRes.phone);
                this.currentUserPhone.set(verifyRes.phone);
              } else {
                localStorage.removeItem('auth_user_phone');
                this.currentUserPhone.set('');
              }
            }
            this.web3Service.walletConnected.set(true);
            this.toastService.showToast('Ký xác thực thành công!', 'success');
            this.isWalletModalOpen.set(false);

            if (!this.router.url.includes('/dashboard')) {
              this.router.navigate(['/dashboard']);
            }
          }
        },
        error: (err) => {
          this.isCurrentlySigning.set(false);
          this.web3Service.disconnectWallet();
          this.toastService.showToast('Xác thực chữ ký thất bại!', 'error');
        }
      });
    } catch (e) {
      this.isCurrentlySigning.set(false);
      this.web3Service.disconnectWallet();
      this.toastService.showToast('Bạn đã từ chối ký xác thực!', 'error');
    }
  }

  /**
   * Ngắt kết nối ví
   */
  public disconnectWalletAndClose(message?: string, isError = false) {
    this.web3Service.disconnectWallet();
    this.apiService.removeToken();

    this.apiService.logout().subscribe({
      next: () => { },
      error: (err) => console.warn('[Auth] Không thể xóa phiên làm việc phía backend:', err)
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
      localStorage.removeItem('auth_logged_in');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_permissions');
      localStorage.removeItem('auth_is_super_admin');
      localStorage.removeItem('auth_subscription_plan_code');
      localStorage.removeItem('auth_subscription_expires_at');
      localStorage.removeItem('auth_subscription_status');
      localStorage.removeItem('auth_plan_features');
      localStorage.removeItem('auth_system_contacts');
      localStorage.removeItem('auth_user_name');
      localStorage.removeItem('auth_user_email');
      localStorage.removeItem('auth_user_phone');
      this.isAuthLoggedIn.set(false);
    }
    this.currentUserName.set('');
    this.currentUserEmail.set('');
    this.currentUserPhone.set('');
    this.systemContacts.set([]);
    this.currentUserRole.set('Chủ cửa hàng');
    this.currentUserPermissions.set(null);
    this.isSuperAdmin.set(false);
    this.subscriptionPlanCode.set('free');
    this.subscriptionExpiresAt.set(null);
    this.subscriptionStatus.set('active');
    this.planFeatures.set(null);
    this.isWalletModalOpen.set(false);

    if (message) {
      this.toastService.showToast(message, isError ? 'error' : 'success');
    } else {
      this.toastService.showToast('Đã ngắt kết nối ví Web3 thành công!', 'success');
    }
  }

  /**
   * Kiểm tra quyền truy cập module
   */
  public hasPermission(module: string): boolean {
    const permissions = this.currentUserPermissions();
    if (permissions === null) {
      return true;
    }
    return !!permissions[module];
  }

  /**
   * Hủy tiến trình ký xác thực
   */
  public cancelSign() {
    this.isWaitingForSignature.set(false);
    this.pendingNonceMessage = '';
    this.pendingAddress = '';
    this.web3Service.disconnectWallet();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_logged_in');
    }
    this.toastService.showToast('Đã hủy xác thực ví.', 'error');
  }

  public hasFeature(featureKey: string): boolean {
    if (!this.web3Service.walletConnected()) {
      return true;
    }

    let features = this.planFeatures();
    if (features && typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = null;
      }
    }

    if (features && features[featureKey] !== undefined) {
      return !!features[featureKey];
    }

    const planCode = this.subscriptionPlanCode() || 'free';
    const defaultFeatures = DEFAULT_PLAN_FEATURES[planCode];
    if (defaultFeatures && defaultFeatures[featureKey] !== undefined) {
      return !!defaultFeatures[featureKey];
    }

    return true;
  }

  public getFeatureLimit(featureKey: string): number {
    let features = this.planFeatures();
    if (features && typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = null;
      }
    }

    if (features && features[featureKey] !== undefined) {
      return Number(features[featureKey]);
    }

    const planCode = this.subscriptionPlanCode() || 'free';
    const defaultFeatures = DEFAULT_PLAN_FEATURES[planCode];
    if (defaultFeatures && defaultFeatures[featureKey] !== undefined) {
      return Number(defaultFeatures[featureKey]);
    }

    return -1;
  }

  public getFeatureConfig(featureKey: string): FeatureConfig | undefined {
    return FEATURE_CONFIGS.find(cfg => cfg.key === featureKey);
  }

  public getFeatureConfigByTab(tab: string): FeatureConfig | undefined {
    return FEATURE_CONFIGS.find(cfg => cfg.tab === tab);
  }
}
