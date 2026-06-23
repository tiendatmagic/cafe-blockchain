import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import { UiStateService } from './ui-state.service';
import { AuthService, FeatureConfig, FEATURE_CONFIGS, DEFAULT_PLAN_FEATURES } from './auth.service';
import { ThemeService } from './theme.service';
import { PosCartService } from './pos-cart.service';
import { ShiftService } from './shift.service';
import { ToastService } from './toast.service';
import { forkJoin, Subscription, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, catchError } from 'rxjs/operators';

// Expose lại các Type/Interface để các component cũ không lỗi import
export { FEATURE_CONFIGS, DEFAULT_PLAN_FEATURES };
export type { FeatureConfig };

import { OrderStore } from '@features/pos/store/order.store';
import { SettingStore } from '@features/settings/store/setting.store';
import { ShiftStore } from '@features/shifts/store/shift.store';
import { DebtStore } from '@features/debts/store/debt.store';
import { InventoryStore } from '@features/inventory/store/inventory.store';
import { CustomerStore } from '@features/customers/store/customer.store';
import { CartStore } from '@features/pos/store/cart.store';
import { PriceStore } from '@features/blockchain/store/price.store';
import { ProductStore } from '@features/menu/store/product.store';
import { TransactionStore } from '@features/financials/store/transaction.store';
import { TableStore } from '@features/tables/store/table.store';
import { DashboardStore } from '@features/dashboard/store/dashboard.store';
import { StaffStore } from '@features/staffs/store/staff.store';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);
  
  // Inject các sub-services
  private readonly uiStateService = inject(UiStateService);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly posCartService = inject(PosCartService);
  private readonly shiftService = inject(ShiftService);
  private readonly toastService = inject(ToastService);

  // Inject các Stores nghiệp vụ
  private readonly orderStore = inject(OrderStore);
  private readonly settingStore = inject(SettingStore);
  private readonly shiftStore = inject(ShiftStore);
  private readonly debtStore = inject(DebtStore);
  private readonly inventoryStore = inject(InventoryStore);
  private readonly customerStore = inject(CustomerStore);
  private readonly cartStore = inject(CartStore);
  private readonly priceStore = inject(PriceStore);
  private readonly productStore = inject(ProductStore);
  private readonly transactionStore = inject(TransactionStore);
  private readonly tableStore = inject(TableStore);
  private readonly dashboardStore = inject(DashboardStore);
  private readonly staffStore = inject(StaffStore);

  // ----------------------------------------------------
  // DELEGATED SIGNALS & STATE (ỦY THÁC ĐIỀU PHỐI)
  // ----------------------------------------------------

  // Trạng thái UI toàn cục (UiStateService)
  public readonly activeTab = this.uiStateService.activeTab;
  public readonly isMobileMenuOpen = this.uiStateService.isMobileMenuOpen;
  public readonly currentUrl = this.uiStateService.currentUrl;
  public readonly isInitialLoading = this.uiStateService.isInitialLoading;
  public readonly isLoading = this.uiStateService.isLoading;
  public readonly isMaintenance = this.uiStateService.isMaintenance;
  public readonly maintenanceType = this.uiStateService.maintenanceType;
  public readonly cancelRequests$ = this.uiStateService.cancelRequests$;
  public readonly useSlidingEffect = this.uiStateService.useSlidingEffect;
  public readonly showBackgroundMesh = this.uiStateService.showBackgroundMesh;

  // Trạng thái modal ví và modal upgrade
  public readonly isWalletModalOpen = this.uiStateService.isWalletModalOpen;
  public readonly isUpgradeModalOpen = this.uiStateService.isUpgradeModalOpen;
  public readonly lockedFeatureKey = this.uiStateService.lockedFeatureKey;
  public readonly lockedFeatureName = this.uiStateService.lockedFeatureName;
  public readonly upgradeModalStep = this.uiStateService.upgradeModalStep;
  public readonly blockedFeatureInRoute = this.uiStateService.blockedFeatureInRoute;

  // Trạng thái Theme (ThemeService)
  public readonly isDarkMode = this.themeService.isDarkMode;
  public readonly themeMode = this.themeService.themeMode;

  // Trạng thái Chờ ký và Xác thực ví (AuthService)
  public readonly isWaitingForSignature = this.authService.isWaitingForSignature;
  public readonly isCurrentlySigning = this.authService.isCurrentlySigning;
  public readonly isAuthLoggedIn = this.authService.isAuthLoggedIn;
  public readonly currentUserRole = this.authService.currentUserRole;
  public readonly currentUserPermissions = this.authService.currentUserPermissions;
  public readonly isSuperAdmin = this.authService.isSuperAdmin;
  public readonly currentUserAdminRole = this.authService.currentUserAdminRole;
  public readonly isSystemStaff = computed(() => {
    const role = this.currentUserAdminRole();
    return role === 'staff' || role === 'admin';
  });
  public readonly isSystemAdmin = computed(() => this.isSuperAdmin() || this.isSystemStaff());
  public readonly subscriptionPlanCode = this.authService.subscriptionPlanCode;
  public readonly subscriptionExpiresAt = this.authService.subscriptionExpiresAt;
  public readonly subscriptionStatus = this.authService.subscriptionStatus;
  public readonly planFeatures = this.authService.planFeatures;
  public readonly systemContacts = this.authService.systemContacts;

  // Profile signals
  public readonly currentUserName = this.authService.currentUserName;
  public readonly currentUserEmail = this.authService.currentUserEmail;
  public readonly currentUserPhone = this.authService.currentUserPhone;

  public get pendingNonceMessage() { return this.authService.pendingNonceMessage; }
  public set pendingNonceMessage(val: string) { this.authService.pendingNonceMessage = val; }
  public get pendingAddress() { return this.authService.pendingAddress; }
  public set pendingAddress(val: string) { this.authService.pendingAddress = val; }

  // Trạng thái POS & Giỏ hàng (PosCartService & Stores)
  public readonly products = this.posCartService.products;
  public readonly posSearchQuery = this.posCartService.posSearchQuery;
  public readonly posCurrentPage = this.posCartService.posCurrentPage;

  public readonly cart = this.cartStore.cart;
  public readonly cartTotal = this.cartStore.cartTotal;
  public readonly tableNumber = this.cartStore.tableNumber;
  public readonly paymentMethod = this.cartStore.paymentMethod;
  public readonly posCategoryFilter = this.productStore.posCategoryFilter;
  public readonly posMinPrice = this.productStore.posMinPrice;
  public readonly posMaxPrice = this.productStore.posMaxPrice;
  public readonly posMinVariantPrice = this.productStore.posMinVariantPrice;
  public readonly posMaxVariantPrice = this.productStore.posMaxVariantPrice;
  public readonly posFilterStatus = this.productStore.posFilterStatus;
  public readonly posSelectedCustomer = this.cartStore.posSelectedCustomer;
  public readonly editingOrderId = this.cartStore.editingOrderId;
  public readonly isOrderSubmitting = this.cartStore.isOrderSubmitting;
  public readonly posItemsPerPage = this.productStore.posItemsPerPage;
  public readonly posProductsList = this.productStore.posProductsList;
  public readonly paginatedPosProducts = this.productStore.paginatedPosProducts;
  public readonly posTotalPages = this.productStore.posTotalPages;
  public readonly posTotalItems = this.productStore.posTotalItems;
  public get posProductsCache() { return this.productStore.posProductsCache; }
  public get cacheTTL() { return this.productStore.cacheTTL; }



  // Trạng thái Loading của các Store khác
  public readonly isCustomersLoading = this.customerStore.isCustomersLoading;
  public readonly isTransactionsLoading = this.transactionStore.isTransactionsLoading;
  public readonly isInventoryLoading = this.inventoryStore.isInventoryLoading;
  public readonly isTablesLoading = this.tableStore.isTablesLoading;
  public readonly isSettingsLoading = this.settingStore.isSettingsLoading;
  public readonly isDebtsLoading = this.debtStore.isDebtsLoading;
  public readonly isStaffsLoading = this.staffStore.isStaffsLoading;
  public readonly isDashboardLoading = this.dashboardStore.isDashboardLoading;
  public readonly isProductsLoading = this.productStore.isProductsLoading;
  public readonly isOrdersLoading = this.orderStore.isOrdersLoading;

  // Dữ liệu Nhân viên (StaffStore)
  public readonly staffs = this.staffStore.staffs;
  public readonly roles = this.staffStore.roles;

  // Dữ liệu Coin Prices (PriceStore)
  public readonly coingeckoPrices = this.priceStore.coingeckoPrices;
  public readonly nativeTokenPriceVND = this.priceStore.nativeTokenPriceVND;
  public readonly usdtPriceVND = this.priceStore.usdtPriceVND;

  // Dữ liệu nạp từ store
  public readonly dashboardStartDate = this.dashboardStore.dashboardStartDate;
  public readonly dashboardEndDate = this.dashboardStore.dashboardEndDate;
  public readonly dashboardData = this.dashboardStore.dashboardData;
  public readonly orders = this.orderStore.orders;
  public readonly categoriesList = this.productStore.categoriesList;
  public readonly customers = this.customerStore.customers;
  public readonly customerGroups = this.customerStore.customerGroups;
  public readonly transactions = this.transactionStore.transactions;
  public readonly inventoryRecords = this.inventoryStore.inventoryRecords;
  public readonly areas = this.tableStore.areas;
  public readonly diningTables = this.tableStore.diningTables;
  public readonly debts = this.debtStore.debts;
  public readonly settings = this.settingStore.settings;

  // Dữ liệu phương thức thanh toán
  public readonly paymentMethodsList = signal<any[]>([]);
  public readonly paymentMethodsTotal = signal<number>(0);

  // Thông điệp Toast
  public readonly successMessage = this.toastService.successMessage;
  public readonly errorMessage = this.toastService.errorMessage;

  // Trạng thái modal gửi token native
  public readonly isSendTokenModalOpen = signal<boolean>(false);
  public readonly recipientAddress = signal<string>('');
  public readonly sendAmount = signal<string>('');
  public readonly isSendingToken = signal<boolean>(false);

  // ----------------------------------------------------
  // COMPUTED PROPERTIES (DỮ LIỆU TÍNH TOÁN)
  // ----------------------------------------------------

  public readonly isPublicLayout = computed(() => {
    const url = this.uiStateService.currentUrl();
    return url.includes('/mobile-sign') || 
           url.includes('/blockchain-explorer') || 
           url.includes('/store/') || 
           url.includes('/claim-points') || 
           url.includes('/marketplace');
  });

  public readonly subscriptionDaysLeft = computed(() => {
    const expiresAt = this.subscriptionExpiresAt();
    if (!expiresAt) return 0;
    try {
      const expires = new Date(expiresAt);
      const today = new Date();
      expires.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = expires.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  });

  public readonly isSubscriptionBlocked = computed(() => {
    if (this.isPublicLayout()) return false;
    if (!this.web3Service.walletConnected()) return false;
    if (this.isSuperAdmin()) return false;
    
    if (this.subscriptionStatus() === 'suspended') return true;
    
    const expiresAt = this.subscriptionExpiresAt();
    if (expiresAt) {
      return new Date().getTime() > new Date(expiresAt).getTime();
    }
    return false;
  });

  public readonly shortAddress = computed(() => this.web3Service.shortAddress());
  public readonly addressExplorerLink = computed(() => this.web3Service.addressExplorerLink());
  public readonly isWrongChain = computed(() => this.web3Service.isWrongChain());
  public readonly isGasLow = computed(() => this.web3Service.isGasLow());
  public readonly nativeTokenSymbol = computed(() => this.web3Service.nativeTokenSymbol());
  public readonly networkName = computed(() => this.web3Service.networkName());

  // ----------------------------------------------------
  // CONSTRUCTOR & SUBSCRIPTIONS
  // ----------------------------------------------------
  private isInitialSyncDone = false;
  private routerSubscription?: Subscription;
  private accountsChangedSub?: Subscription;

  constructor() {
    // 1. Tự động nạp cấu hình và dữ liệu của tab hiện tại khi ví đã xác thực thành công
    effect(() => {
      if (this.web3Service.walletConnected() && this.isAuthLoggedIn()) {
        untracked(() => {
          if (this.isSubscriptionBlocked()) {
            console.warn('[StateService] Gói thuê bao đã hết hạn! Bỏ qua gọi API khởi tạo ví.');
            this.isInitialLoading.set(false);
            this.syncSubscriptionFromBackend();
            return;
          }

          this.isInitialLoading.set(true);

          const settings$ = this.hasPermission('settings')
            ? this.apiService.getSettings().pipe(catchError((err) => {
              console.warn('[StateService] Không có quyền tải settings hoặc lỗi settings:', err);
              return of(null);
            }))
            : of(null);

          settings$.subscribe({
            next: (settings) => {
              if (settings) {
                const updatedSettings = {
                  default_print_size: '80mm',
                  show_crypto_payment: '0',
                  has_synced_menu: '0',
                  ...settings
                };
                this.settingStore.updateSettingsCache(updatedSettings);
              }

              // Giải phóng UI và nạp tab hiện tại ngay lập tức để không bị nghẽn màn hình loading
              this.reloadCurrentTab(true);
              this.syncSubscriptionFromBackend();
              this.isInitialLoading.set(false);
            },
            error: (err) => {
              console.error('[StateService] Lỗi tải dữ liệu khởi tạo ví:', err);
              this.isInitialLoading.set(false);
            }
          });
        });
      } else {
        untracked(() => {
          this.isInitialLoading.set(false);
        });
      }
    }, { allowSignalWrites: true });

    // 2. Lắng nghe thay đổi của page và category tại POS để tự động load sản phẩm
    effect(() => {
      const page = this.posCurrentPage();
      const category = this.posCategoryFilter();
      if (this.activeTab() === 'pos') {
        this.productStore.loadPosProducts();
      }
    }, { allowSignalWrites: true });



    // 4. Lắng nghe đăng nhập thành công để thiết lập ngày dashboard mặc định
    effect(() => {
      if (this.isAuthLoggedIn()) {
        const today = new Date();
        const formatDateStr = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        untracked(() => {
          if (!this.dashboardStore.dashboardStartDate()) {
            const check7 = new Date();
            check7.setDate(today.getDate() - 6);
            this.dashboardStore.dashboardStartDate.set(formatDateStr(check7));
          }
          if (!this.dashboardStore.dashboardEndDate()) {
            this.dashboardStore.dashboardEndDate.set(formatDateStr(today));
          }
        });
      }
    });

    // 5. Gọi tải thông tin coin prices ban đầu khi khởi tạo
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        this.priceStore.loadCoinPrices();
      }
    }, 0);

    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.priceStore.loadCoinPrices();
      }, 10 * 60 * 1000);
    }

    // 6. Lắng nghe sự kiện thay đổi route
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isInitialSyncDone = true;
      const url = event.urlAfterRedirects || event.url;
      this.uiStateService.currentUrl.set(url);
      this.syncTabWithUrl(url);
      this.syncThemeColorsForRoute(url);
    });

    setTimeout(() => {
      if (!this.isInitialSyncDone) {
        this.isInitialSyncDone = true;
        const url = this.router.url;
        this.uiStateService.currentUrl.set(url);
        this.syncTabWithUrl(url);
      }
    }, 200);

    // 7. Lắng nghe thay đổi tài khoản ví từ Web3Service
    this.accountsChangedSub = this.web3Service.accountsChanged$.subscribe((newAccount) => {
      this.handleAccountSwitch(newAccount);
    });
  }

  public destroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.accountsChangedSub) {
      this.accountsChangedSub.unsubscribe();
    }
    this.posCartService.destroy();
  }

  // ----------------------------------------------------
  // DELEGATED METHODS (ỦY THÁC PHƯƠNG THỨC SANG SUB-SERVICES)
  // ----------------------------------------------------

  // Toast
  public showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastService.showToast(msg, type);
  }

  // Sliding Effect
  public setSlidingEffect(enabled: boolean) {
    this.uiStateService.setSlidingEffect(enabled);
  }

  // Background Mesh Effect
  public setBackgroundMesh(enabled: boolean) {
    this.uiStateService.setBackgroundMesh(enabled);
  }

  // Theme
  public toggleTheme() { this.themeService.toggleTheme(); }
  public setThemeMode(mode: 'light' | 'auto' | 'dark') { this.themeService.setThemeMode(mode); }
  public applyDarkClass(dark: boolean) { this.themeService.applyDarkClass(dark); }
  public applyAutoTheme() { this.themeService.applyAutoTheme(); }
  public applyDynamicColors(primary: string, secondary: string) { this.themeService.applyDynamicColors(primary, secondary); }
  public applyAndCacheDynamicColors(primary: string, secondary: string) { this.themeService.applyAndCacheDynamicColors(primary, secondary); }

  // Auth / Wallet
  public async requestSignatureForAddress(address: string) { return this.authService.requestSignatureForAddress(address); }
  public async connectWalletAndSign() { return this.authService.connectWalletAndSign(); }
  public async retrySign() { return this.authService.retrySign(); }
  public cancelSign() { this.authService.cancelSign(); }
  public disconnectWalletAndClose(message?: string, isError = false) { this.authService.disconnectWalletAndClose(message, isError); }
  public hasPermission(module: string): boolean { return this.authService.hasPermission(module); }
  public hasFeature(featureKey: string): boolean { return this.authService.hasFeature(featureKey); }
  public getFeatureLimit(featureKey: string): number { return this.authService.getFeatureLimit(featureKey); }
  public getFeatureConfig(featureKey: string) { return this.authService.getFeatureConfig(featureKey); }
  public getFeatureConfigByTab(tab: string) { return this.authService.getFeatureConfigByTab(tab); }
  
  public triggerUpgradeModal(featureKey: string, featureName: string) { 
    this.uiStateService.triggerUpgradeModal(featureKey, featureName); 
  }
  public triggerUpgradeModalDirectly(featureKey: string, featureName: string) { 
    this.uiStateService.triggerUpgradeModalDirectly(featureKey, featureName); 
  }

  // POS / Cart
  public onSearchQueryChange(query: string) { this.posCartService.onSearchQueryChange(query); }
  public clearCart() { this.posCartService.clearCart(); }
  public editOrder(order: any) { this.posCartService.editOrder(order); }
  public cancelEditOrder() { this.posCartService.cancelEditOrder(); }
  public loadPosProducts() { this.posCartService.loadPosProducts(); }
  public resetPosFilters() { this.posCartService.resetPosFilters(); }
  public clearPosProductsCache() { this.posCartService.clearPosProductsCache(); }



  // ----------------------------------------------------
  // BUSINESS LOGIC & DATA SYNCHRONIZATION
  // ----------------------------------------------------

  // Tải toàn bộ dữ liệu nghiệp vụ của cửa hàng
  public loadAllData() {
    const connectedAddress = this.web3Service.currentAccount();
    if (typeof window !== 'undefined') {
      const authAddress = localStorage.getItem('auth_address');
      if (connectedAddress && authAddress && connectedAddress.toLowerCase() !== authAddress.toLowerCase()) {
        console.warn('Lệch tài khoản ví và token xác thực! Đang tự động đăng xuất và yêu cầu xác thực lại...');
        this.disconnectWalletAndClose();
        return;
      }
    }

    this.isLoading.set(true);
    forkJoin({
      dashboard: this.apiService.getDashboard(this.dashboardStartDate(), this.dashboardEndDate()),
      products: this.apiService.getProducts(),
      orders: this.apiService.getOrders(),
      settings: this.apiService.getSettings(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: (res) => {
        this.dashboardStore.dashboardData.set(res.dashboard);
        this.productStore.products.set(res.products);
        this.orderStore.orders.set(res.orders || []);
        this.productStore.categoriesList.set(res.categories || []);

        if (res.settings) {
          const settings = {
            default_print_size: '80mm',
            show_crypto_payment: '0',
            has_synced_menu: '0',
            ...res.settings
          };
          this.settingStore.settings.set(settings);
          this.settingStore.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
          this.web3Service.updateConfig(settings);
        }
        this.refreshTablesAndAreas();
        this.productStore.loadPosProducts();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu:', err);
        this.showToast('Lỗi tải dữ liệu từ máy chủ. Vui lòng kiểm tra Laravel Backend!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  public loadCoinPrices() {
    this.priceStore.loadCoinPrices();
  }

  public refreshProducts() {
    if (this.isSubscriptionBlocked()) return;
    const tab = this.activeTab();
    const ttl = tab === 'pos' ? 10 * 60 * 1000 : (tab === 'menu' ? 5 * 60 * 1000 : undefined);
    this.productStore.refreshProducts(
      this.hasPermission('pos') || this.hasPermission('menu') || this.hasPermission('inventory'),
      ttl
    );
  }

  public refreshOrders(statusFilter: string = 'all', blockchainFilter: string = 'all') {
    if (this.isSubscriptionBlocked()) return;
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('orders')) return;
    this.orderStore.refreshOrders(statusFilter, blockchainFilter);
  }

  public refreshDashboard(force: boolean = false) {
    if (this.isSubscriptionBlocked()) return;
    this.dashboardStore.refreshDashboard(this.hasPermission('dashboard'), force);
  }

  public loadPublicSettingsAndMenu() {
    this.apiService.getPublicSettings().subscribe({
      next: (res) => {
        if (res) {
          const settings = {
            default_print_size: '80mm',
            show_crypto_payment: '0',
            has_synced_menu: '0',
            ...res
          };
          this.settingStore.settings.set(settings);
          this.settingStore.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
          this.web3Service.updateConfig(settings);
          this.isInitialLoading.set(false);
        } else {
          this.isInitialLoading.set(false);
        }
      },
      error: (err) => {
        console.error('[StateService] Lỗi tải cấu hình public:', err);
        this.isInitialLoading.set(false);
      }
    });
  }

  public loadSettings() {
    if (this.isSubscriptionBlocked()) return;
    this.settingStore.loadSettings(this.hasPermission('settings'));
    if (this.web3Service.walletConnected()) {
      this.syncSubscriptionFromBackend();
    }
  }

  public syncSubscriptionFromBackend() {
    this.apiService.getMe().subscribe({
      next: (res) => {
        if (res?.subscription) {
          const sub = res.subscription;
          const planCode = sub.plan_code || 'free';
          const expiresAt = sub.subscription_expires_at || null;
          const status = sub.subscription_status || 'active';

          this.authService.subscriptionPlanCode.set(planCode);
          this.authService.subscriptionExpiresAt.set(expiresAt);
          this.authService.subscriptionStatus.set(status);

          if (sub.features) {
            this.authService.planFeatures.set(sub.features);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_plan_features', JSON.stringify(sub.features));
            }
          } else {
            this.authService.planFeatures.set(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_plan_features');
            }
          }

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_subscription_plan_code', planCode);
            if (expiresAt) {
              localStorage.setItem('auth_subscription_expires_at', expiresAt);
            } else {
              localStorage.removeItem('auth_subscription_expires_at');
            }
            localStorage.setItem('auth_subscription_status', status);
          }
        }

        if (res?.system_contacts) {
          this.authService.systemContacts.set(res.system_contacts);
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_system_contacts', JSON.stringify(res.system_contacts));
          }
        } else {
          this.authService.systemContacts.set([]);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_system_contacts');
          }
        }

        if (res) {
          if (res.name) {
            localStorage.setItem('auth_user_name', res.name);
            this.authService.currentUserName.set(res.name);
          } else {
            localStorage.removeItem('auth_user_name');
            this.authService.currentUserName.set('');
          }
          if (res.email) {
            localStorage.setItem('auth_user_email', res.email);
            this.authService.currentUserEmail.set(res.email);
          } else {
            localStorage.removeItem('auth_user_email');
            this.authService.currentUserEmail.set('');
          }
          if (res.phone) {
            localStorage.setItem('auth_user_phone', res.phone);
            this.authService.currentUserPhone.set(res.phone);
          } else {
            localStorage.removeItem('auth_user_phone');
            this.authService.currentUserPhone.set('');
          }
        }
      },
      error: (err) => {
        console.warn('[StateService] Không thể sync thông tin gói cước:', err?.status);
      }
    });
  }

  public refreshCustomers(force: boolean = false) {
    if (this.isSubscriptionBlocked()) return;
    this.customerStore.refreshCustomers(
      this.hasPermission('pos') || this.hasPermission('customers') || this.hasPermission('reports'),
      force
    );
  }

  public refreshTransactions(typeFilter: string = 'all') {
    if (this.isSubscriptionBlocked()) return;
    this.transactionStore.refreshTransactions(this.hasPermission('financials'), typeFilter);
  }

  public refreshInventory(typeFilter: string = 'all') {
    if (this.isSubscriptionBlocked()) return;
    this.inventoryStore.refreshInventory(this.hasPermission('inventory'), typeFilter);
  }

  public refreshTablesAndAreas() {
    if (this.isSubscriptionBlocked()) return;
    this.tableStore.refreshTablesAndAreas(this.hasPermission('pos') || this.hasPermission('tables'));
  }

  public updateTableStatusLocal(tableId: number, status: 'empty' | 'using') {
    this.tableStore.updateTableStatusLocal(tableId, status);
  }

  public reloadCurrentTab(force: boolean = false) {
    const tab = this.activeTab();
    if (tab === 'dashboard') this.refreshDashboard(force);
    else if (tab === 'pos') {
      this.refreshProducts();
      this.refreshTablesAndAreas();
      this.refreshCustomers();
    } else if (tab === 'orders') this.refreshOrders();
    else if (tab === 'tables') this.refreshTablesAndAreas();
    else if (tab === 'shifts') this.shiftService.refreshShifts();
    else if (tab === 'menu') this.refreshProducts();
    else if (tab === 'inventory') this.refreshInventory();
    else if (tab === 'customers') this.refreshCustomers(force);
    else if (tab === 'debts') this.refreshDebts();
    else if (tab === 'financials') this.refreshTransactions();
    else if (tab === 'staffs') this.refreshStaffsAndRoles();
    else if (tab === 'settings') this.loadSettings();
  }

  private syncTabWithUrl(url: string) {
    const tabConfig = FEATURE_CONFIGS.find(cfg => url.includes('/' + cfg.tab));
    if (tabConfig) {
      this.setTabState(tabConfig.tab);
    } else if (url.includes('/settings')) {
      this.setTabState('settings');
    } else if (url === '/' || url === '/dashboard') {
      this.setTabState('dashboard');
    }
  }

  private syncThemeColorsForRoute(url: string) {
    if (typeof window === 'undefined') return;
    
    // Nếu không ở storefront (/store/slug)
    if (!url.includes('/store/')) {
      if (this.web3Service.walletConnected() && this.isAuthLoggedIn()) {
        const settings = this.settingStore.settings();
        if (settings && (settings.primary_color || settings.secondary_color)) {
          this.settingStore.applyDynamicColors(settings.primary_color, settings.secondary_color);
        } else {
          this.settingStore.applyCachedDynamicColors();
        }
      } else {
        // Nếu chưa đăng nhập hoặc ngắt kết nối ví, khôi phục màu mặc định thương hiệu DApp
        this.settingStore.applyDynamicColors('#ff00dd', '#8000ff');
      }
    }
  }

  private setTabState(tab: string, force: boolean = false) {
    if (this.activeTab() === tab && !force) return;
    this.uiStateService.activeTab.set(tab);
    
    // Nạp dữ liệu tương ứng cho tab vừa mở
    this.reloadCurrentTab(false);
  }

  public refreshDebts(searchFilter: string = '', statusFilter: string = 'all') {
    if (this.isSubscriptionBlocked()) return;
    this.debtStore.refreshDebts(this.hasPermission('debts'), searchFilter, statusFilter);
  }

  public refreshStaffsAndRoles() {
    if (this.isSubscriptionBlocked()) return;
    this.staffStore.refreshStaffsAndRoles(this.hasPermission('staffs'));
  }

  public resetDefaultRoles() {
    this.staffStore.resetDefaultRoles((msg, type) => this.showToast(msg, type));
  }

  // ----------------------------------------------------
  // ACCOUNT SWITCHING & ACTIONS
  // ----------------------------------------------------

  public handleAccountSwitch(newAccount: string) {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('auth_address');
      const isLoggedIn = localStorage.getItem('auth_logged_in') === 'true';
      if (
        newAccount &&
        savedAddress &&
        newAccount.toLowerCase() === savedAddress.toLowerCase() &&
        isLoggedIn &&
        this.apiService.getToken()
      ) {
        console.log('[Auth] Tài khoản ví trùng khớp với phiên đăng nhập hiện tại. Bỏ qua yêu cầu ký lại.');
        return;
      }
    }

    this.apiService.removeToken();
    this.apiService.logout().subscribe({
      next: () => { },
      error: (err) => console.warn('[Auth] Không thể xóa phiên làm việc khi chuyển đổi tài khoản:', err)
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
    }

    // Reset Auth signals
    this.authService.isAuthLoggedIn.set(false);
    this.authService.currentUserRole.set('Chủ cửa hàng');
    this.authService.currentUserPermissions.set(null);
    this.authService.isSuperAdmin.set(false);
    this.authService.subscriptionPlanCode.set('free');
    this.authService.subscriptionExpiresAt.set(null);
    this.authService.subscriptionStatus.set('active');
    this.authService.planFeatures.set(null);
    this.authService.systemContacts.set([]);

    // Reset stores data
    this.cartStore.clearCart();
    this.dashboardStore.dashboardData.set(null);
    this.productStore.products.set([]);
    this.orderStore.orders.set([]);
    this.productStore.categoriesList.set([]);

    if (newAccount) {
      this.showToast('Phát hiện tài khoản ví thay đổi. Đang yêu cầu ký xác thực lại...', 'success');
      this.requestSignatureForAddress(newAccount);
    } else {
      this.showToast('Ví đã ngắt kết nối. Vui lòng kết nối ví để tiếp tục!', 'error');
    }
  }

  public copyAddress(customAddress?: string) {
    const address = customAddress || this.web3Service.currentAccount();
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      this.showToast('Đã sao chép địa chỉ ví vào bộ nhớ tạm!', 'success');
    }).catch(err => {
      this.showToast('Lỗi sao chép địa chỉ ví!', 'error');
    });
  }

  // Thực hiện phát giao dịch gửi Native Token
  public async handleSendNativeToken() {
    const to = this.recipientAddress().trim();
    const amount = this.sendAmount().trim();

    if (!to) {
      this.showToast('Vui lòng nhập địa chỉ nhận!', 'error');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      this.showToast('Số lượng token không hợp lệ!', 'error');
      return;
    }

    this.isSendingToken.set(true);
    this.showToast('Đang gửi giao dịch lên blockchain...', 'success');

    try {
      const res = await this.web3Service.sendNativeToken(to, amount);
      if (res.success) {
        this.showToast('Giao dịch gửi token đã được phát đi thành công!', 'success');
        this.isSendTokenModalOpen.set(false);
        this.recipientAddress.set('');
        this.sendAmount.set('');
      } else {
        this.showToast(res.error || 'Gửi token thất bại!', 'error');
      }
    } catch (e: any) {
      this.showToast(e.message || 'Gửi token thất bại!', 'error');
    } finally {
      this.isSendingToken.set(false);
    }
  }

  // Chuyển đổi mạng (Chain) trên ví Web3
  public async switchChain(chainId: string) {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      this.web3Service.configuredChainId.set(chainId);
      this.showToast(`Đã chọn mạng kết nối mong muốn: ${this.web3Service.getNetworkNameByChainId(chainId)}!`, 'success');
      return;
    }

    this.showToast('Đang yêu cầu chuyển mạng ví...', 'success');
    try {
      const success = await this.web3Service.ensureCorrectNetwork(chainId);
      if (success) {
        this.showToast(`Đã chuyển mạng ví sang ${this.web3Service.getNetworkNameByChainId(chainId)}!`, 'success');
      } else {
        this.showToast(this.web3Service.walletError() || 'Chuyển mạng thất bại!', 'error');
      }
    } catch (e: any) {
      this.showToast(e.message || 'Chuyển mạng thất bại!', 'error');
    }
  }
}
