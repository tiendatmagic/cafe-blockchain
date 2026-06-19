import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import { forkJoin, Subject, Subscription, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, catchError } from 'rxjs/operators';
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
import { StaffStore } from '@features/staffs/store/staff.store';
import { DashboardStore } from '@features/dashboard/store/dashboard.store';

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
export class StateService {
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);
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
  private readonly staffStore = inject(StaffStore);
  private readonly dashboardStore = inject(DashboardStore);

  // Trạng thái UI toàn cục
  public readonly activeTab = signal<string>('dashboard');
  public readonly isDarkMode = signal<boolean>(false);
  public readonly themeMode = signal<'light' | 'auto' | 'dark'>('light');
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly isWalletModalOpen = signal<boolean>(false);
  public readonly isMaintenance = signal<boolean>(false);
  public readonly isInitialLoading = signal<boolean>(true);

  // Trạng thái chờ ký xác thực Web3 và modal gửi token
  public readonly isWaitingForSignature = signal<boolean>(false);
  public readonly isSendTokenModalOpen = signal<boolean>(false);
  public readonly recipientAddress = signal<string>('');
  public readonly sendAmount = signal<string>('');
  public readonly isSendingToken = signal<boolean>(false);

  public pendingNonceMessage = '';
  public pendingAddress = '';
  private accountsChangedSub?: Subscription;

  // Vai trò và quyền truy cập của người dùng hiện tại
  public readonly currentUserRole = signal<string>('Chủ cửa hàng');
  public readonly currentUserPermissions = signal<any>(null); // null tức là Chủ cửa hàng (Full quyền)

  // Thông tin thuê bao và Super Admin
  public readonly isSuperAdmin = signal<boolean>(false);
  public readonly subscriptionPlanCode = signal<string>('free');
  public readonly subscriptionExpiresAt = signal<string | null>(null);
  public readonly subscriptionStatus = signal<string>('active');
  public readonly planFeatures = signal<any>(null);

  // Trạng thái modal chặn và nâng cấp gói cước
  public readonly isUpgradeModalOpen = signal<boolean>(false);
  public readonly upgradeModalStep = signal<number>(1);
  public readonly lockedFeatureKey = signal<string>('');
  public readonly lockedFeatureName = signal<string>('');
  public readonly blockedFeatureInRoute = signal<{ key: string, name: string } | null>(null);

  // Computed signal to calculate the remaining trial days for free plan
  public readonly freeTrialDaysLeft = computed(() => {
    if (this.subscriptionPlanCode() !== 'free') return 0;
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
    } catch (e) {
      return 0;
    }
  });

  // Computed signal to calculate the remaining days for the current subscription plan
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
    } catch (e) {
      return 0;
    }
  });

  // Trạng thái Loading
  public readonly isLoading = signal<boolean>(false);
  public readonly isDashboardLoading = this.dashboardStore.isDashboardLoading;
  public readonly isProductsLoading = this.productStore.isProductsLoading;
  public readonly isOrdersLoading = this.orderStore.isOrdersLoading;
  public readonly isCustomersLoading = this.customerStore.isCustomersLoading;
  public readonly isTransactionsLoading = this.transactionStore.isTransactionsLoading;
  public readonly isInventoryLoading = this.inventoryStore.isInventoryLoading;
  public readonly isTablesLoading = this.tableStore.isTablesLoading;
  public readonly isSettingsLoading = this.settingStore.isSettingsLoading;
  public readonly isDebtsLoading = this.debtStore.isDebtsLoading;
  public readonly isShiftsLoading = this.shiftStore.isShiftsLoading;
  public readonly currentShift = this.shiftStore.currentShift;
  
  // --- Quản lý ca trực (Trạng thái và logic dùng chung) ---
  public readonly isCloseShiftModalOpen = this.shiftStore.isCloseShiftModalOpen;
  public readonly isShiftSummaryLoading = this.shiftStore.isShiftSummaryLoading;
  public readonly shiftSummary = this.shiftStore.shiftSummary;
  public readonly actualCashInput = this.shiftStore.actualCashInput;
  public readonly actualCashFormatted = this.shiftStore.actualCashFormatted;
  public readonly closeShiftNote = this.shiftStore.closeShiftNote;

  public readonly isStartShiftModalOpen = this.shiftStore.isStartShiftModalOpen;
  public readonly initialCashInput = this.shiftStore.initialCashInput;
  public readonly initialCashFormatted = this.shiftStore.initialCashFormatted;

  public readonly shiftFiatRevenue = this.shiftStore.shiftFiatRevenue;
  public readonly shiftBankTransferRevenue = this.shiftStore.shiftBankTransferRevenue;
  public readonly shiftCryptoRevenue = this.shiftStore.shiftCryptoRevenue;
  public readonly shiftEWalletRevenue = this.shiftStore.shiftEWalletRevenue;
  public readonly shiftFiatExpenses = this.shiftStore.shiftFiatExpenses;
  public readonly shiftExpectedCash = this.shiftStore.shiftExpectedCash;
  
  public readonly shifts = this.shiftStore.shifts;
  public readonly shiftDurationString = this.shiftStore.shiftDurationString;

  // Tín hiệu Tỷ giá Coin (Ủy quyền sang PriceStore)
  public readonly coingeckoPrices = this.priceStore.coingeckoPrices;
  public readonly nativeTokenPriceVND = this.priceStore.nativeTokenPriceVND;
  public readonly usdtPriceVND = this.priceStore.usdtPriceVND;

  // Thông điệp Toast
  public readonly successMessage = signal<string>('');
  public readonly errorMessage = signal<string>('');

  // Dữ liệu toàn cục tải từ Backend (Ủy quyền sang các Store chuyên biệt)
  public readonly dashboardStartDate = this.dashboardStore.dashboardStartDate;
  public readonly dashboardEndDate = this.dashboardStore.dashboardEndDate;
  public readonly dashboardData = this.dashboardStore.dashboardData;
  public readonly products = this.productStore.products;
  public readonly orders = this.orderStore.orders;
  public readonly categoriesList = this.productStore.categoriesList;
  public readonly customers = this.customerStore.customers;
  public readonly customerGroups = this.customerStore.customerGroups;
  public readonly transactions = this.transactionStore.transactions;
  public readonly inventoryRecords = this.inventoryStore.inventoryRecords;
  public readonly areas = this.tableStore.areas;
  public readonly diningTables = this.tableStore.diningTables;
  public readonly debts = this.debtStore.debts;

  // Dữ liệu phương thức thanh toán
  public readonly paymentMethodsList = signal<any[]>([]);
  public readonly paymentMethodsTotal = signal<number>(0);
  public lastPaymentMethodsLoadTimestamp = 0;
  
  public get lastDashboardLoadTimestamp() { return this.dashboardStore.lastDashboardLoadTimestamp; }
  public set lastDashboardLoadTimestamp(val: number) { this.dashboardStore.lastDashboardLoadTimestamp = val; }

  public readonly settings = this.settingStore.settings;

  // Trạng thái POS (Giỏ hàng) và Lọc (Ủy quyền kết hợp CartStore và ProductStore)
  public readonly cart = this.cartStore.cart;
  public readonly cartTotal = this.cartStore.cartTotal;
  public readonly tableNumber = this.cartStore.tableNumber;
  public readonly paymentMethod = this.cartStore.paymentMethod;
  public readonly posCategoryFilter = this.productStore.posCategoryFilter;
  public readonly posSearchQuery = this.productStore.posSearchQuery;
  public readonly posMinPrice = this.productStore.posMinPrice;
  public readonly posMaxPrice = this.productStore.posMaxPrice;
  public readonly posMinVariantPrice = this.productStore.posMinVariantPrice;
  public readonly posMaxVariantPrice = this.productStore.posMaxVariantPrice;
  public readonly posFilterStatus = this.productStore.posFilterStatus;
  public readonly posSelectedCustomer = this.cartStore.posSelectedCustomer;
  public readonly editingOrderId = this.cartStore.editingOrderId;
  public readonly isOrderSubmitting = this.cartStore.isOrderSubmitting;

  // Phân trang sản phẩm ở trang Bán hàng POS
  public readonly posItemsPerPage = this.productStore.posItemsPerPage;
  public readonly posCurrentPage = this.productStore.posCurrentPage;
  public readonly posProductsList = this.productStore.posProductsList;
  public readonly paginatedPosProducts = this.productStore.paginatedPosProducts;
  public readonly posTotalPages = this.productStore.posTotalPages;
  public readonly posTotalItems = this.productStore.posTotalItems;

  // Bộ nhớ đệm Cache cho sản phẩm POS
  public get posProductsCache() { return this.productStore.posProductsCache; }
  public get cacheTTL() { return this.productStore.cacheTTL; }
  
  private isInitialSyncDone = false;
  private isSettingsFetching = false;
  private lastSettingsLoadTimestamp = 0;
  
  public get lastCustomersLoadTimestamp() { return this.customerStore.lastCustomersLoadTimestamp; }
  public set lastCustomersLoadTimestamp(val: number) { this.customerStore.lastCustomersLoadTimestamp = val; }
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private routerSubscription?: Subscription;
  public readonly cancelRequests$ = new Subject<void>();

  constructor() {
    this.initTheme();
    
    // Khôi phục vai trò, quyền và gói cước từ localStorage
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('auth_role');
      const savedPermissions = localStorage.getItem('auth_permissions');
      const savedIsSuperAdmin = localStorage.getItem('auth_is_super_admin');
      const savedPlanCode = localStorage.getItem('auth_subscription_plan_code');
      const savedExpiresAt = localStorage.getItem('auth_subscription_expires_at');
      const savedStatus = localStorage.getItem('auth_subscription_status');
      const savedFeatures = localStorage.getItem('auth_plan_features');

      if (savedRole) {
        this.currentUserRole.set(savedRole);
      }
      if (savedPermissions) {
        try {
          this.currentUserPermissions.set(JSON.parse(savedPermissions));
        } catch (e) {
          this.currentUserPermissions.set(null);
        }
      }
      this.isSuperAdmin.set(savedIsSuperAdmin === 'true');
      if (savedPlanCode) this.subscriptionPlanCode.set(savedPlanCode);
      if (savedExpiresAt) this.subscriptionExpiresAt.set(savedExpiresAt);
      if (savedStatus) this.subscriptionStatus.set(savedStatus);
      if (savedFeatures) {
        try {
          this.planFeatures.set(JSON.parse(savedFeatures));
        } catch (e) {
          this.planFeatures.set(null);
        }
      }
    }
    
    // Gọi tải cấu hình public và menu storefront ban đầu khi chưa kết nối ví
    if (!this.web3Service.walletConnected()) {
      this.loadPublicSettingsAndMenu();
    }
    if (typeof window !== 'undefined') {
      this.priceStore.loadCoinPrices();
      setInterval(() => {
        this.priceStore.loadCoinPrices();
      }, 10 * 60 * 1000);
    }

    // Lắng nghe thay đổi của page và category tại POS để tự động load sản phẩm
    effect(() => {
      const page = this.posCurrentPage();
      const category = this.posCategoryFilter();
      if (this.activeTab() === 'pos') {
        this.productStore.loadPosProducts();
      }
    }, { allowSignalWrites: true });

    // Tự động đếm thời gian trôi qua của ca làm việc
    effect(() => {
      const shift = this.currentShift();
      if (shift && shift.start_time) {
        this.shiftStore.startShiftTimer(shift.start_time);
      } else {
        this.shiftStore.stopShiftTimer();
      }
    }, { allowSignalWrites: true });

    // Tự động nạp cấu hình và dữ liệu của tab hiện tại ngay khi ví kết nối & xác thực thành công
    effect(() => {
      if (this.web3Service.walletConnected()) {
        untracked(() => {
          this.isInitialLoading.set(true);

          const settings$ = this.hasPermission('settings')
            ? this.apiService.getSettings().pipe(catchError((err) => {
                console.warn('[StateService] Không có quyền tải settings hoặc lỗi settings:', err);
                return of(null);
              }))
            : of(null);
          const shift$ = this.hasPermission('shifts') 
            ? this.apiService.getCurrentShift().pipe(catchError((err) => {
                console.warn('[StateService] Lỗi tải ca trực hiện tại:', err);
                return of(null);
              }))
            : of(null);

          forkJoin({
            settings: settings$,
            shift: shift$
          }).subscribe({
            next: (res) => {
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
              this.currentShift.set(res.shift || null);
              if (res.shift && res.shift.status === 'open') {
                this.apiService.getShiftSummary().subscribe({
                  next: (sum) => this.shiftSummary.set(sum),
                  error: (err) => console.error('[StateService] Lỗi tải summary ca trực ban đầu:', err)
                });
              } else {
                this.shiftSummary.set(null);
              }
              
              // Nạp dữ liệu cho tab hiện tại
              this.reloadCurrentTab();
              
              // Đồng bộ thông tin gói cước mới nhất từ DB
              this.syncSubscriptionFromBackend();
              
              // Tắt loading khởi tạo
              this.isInitialLoading.set(false);
            },
            error: (err) => {
              console.error('[StateService] Lỗi tải dữ liệu khởi tạo ví:', err);
              this.isInitialLoading.set(false);
            }
          });
        });
      }
    }, { allowSignalWrites: true });

    // Lắng nghe sự kiện thay đổi từ khóa tìm kiếm có Debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((val) => {
      this.posSearchQuery.set(val);
      this.posCurrentPage.set(1);
      this.productStore.loadPosProducts();
    });

    // Lắng nghe sự kiện thay đổi route để cập nhật activeTab và tự động refresh dữ liệu tương ứng
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isInitialSyncDone = true;
      this.syncTabWithUrl(event.urlAfterRedirects || event.url);
    });

    // Cơ chế fallback đồng bộ tab ban đầu
    setTimeout(() => {
      if (!this.isInitialSyncDone) {
        this.isInitialSyncDone = true;
        this.syncTabWithUrl(this.router.url);
      }
    }, 200);

    // Lắng nghe sự kiện thay đổi ví từ Web3Service
    this.accountsChangedSub = this.web3Service.accountsChanged$.subscribe((newAccount) => {
      this.handleAccountSwitch(newAccount);
    });
  }

  public destroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.accountsChangedSub) {
      this.accountsChangedSub.unsubscribe();
    }
  }

  // Toast thông báo bóng bẩy
  public showToast(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      this.successMessage.set(msg);
      setTimeout(() => this.successMessage.set(''), 3000);
    } else {
      this.errorMessage.set(msg);
      setTimeout(() => this.errorMessage.set(''), 4000);
    }
  }

  // Khởi tạo Light/Dark/Auto Theme
  private initTheme() {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    this.settingStore.applyCachedDynamicColors();

    if (savedTheme === 'auto') {
      this.themeMode.set('auto');
      this.applyAutoTheme();
    } else if (savedTheme === 'dark') {
      this.themeMode.set('dark');
      this.applyDarkClass(true);
    } else {
      this.themeMode.set('light');
      this.applyDarkClass(false);
    }
  }

  private isNightTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  }

  public applyDarkClass(dark: boolean) {
    this.isDarkMode.set(dark);
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }

  public applyAutoTheme() {
    this.applyDarkClass(this.isNightTime());
  }

  public setThemeMode(mode: 'light' | 'auto' | 'dark') {
    this.themeMode.set(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
    }
    if (mode === 'auto') {
      this.applyAutoTheme();
    } else {
      this.applyDarkClass(mode === 'dark');
    }
  }

  public applyDynamicColors(primary: string, secondary: string) {
    this.settingStore.applyDynamicColors(primary, secondary);
  }

  public applyAndCacheDynamicColors(primary: string, secondary: string) {
    this.settingStore.applyAndCacheDynamicColors(primary, secondary);
  }

  // Tải toàn bộ dữ liệu từ Laravel Backend
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
        this.dashboardData.set(res.dashboard);
        this.products.set(res.products);
        this.orderStore.orders.set(res.orders || []);
        this.categoriesList.set(res.categories || []);

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

  // Tải giá coin thực tế từ CoinGecko
  public loadCoinPrices() {
    this.priceStore.loadCoinPrices();
  }

  // Refresh danh sách thực đơn
  public refreshProducts() {
    this.productStore.refreshProducts(
      this.hasPermission('pos') || this.hasPermission('menu') || this.hasPermission('inventory')
    );
  }

  // Refresh danh sách đơn hàng
  public refreshOrders(statusFilter: string = 'all', blockchainFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('orders')) return;
    this.orderStore.refreshOrders(statusFilter, blockchainFilter);
  }

  // Refresh dữ liệu dashboard
  public refreshDashboard(force: boolean = false) {
    this.dashboardStore.refreshDashboard(this.hasPermission('dashboard'), force);
  }

  // Tải cấu hình public và menu storefront khi chưa kết nối ví
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

          // Nếu có website_slug, tải menu storefront công khai để hiển thị
          if (settings.website_slug) {
            this.apiService.getPublicStoreBySlug(settings.website_slug).subscribe({
              next: (storeRes) => {
                if (storeRes) {
                  const publicProducts = storeRes.products || [];
                  const publicCategories = storeRes.categories || [];
                  
                  // Chỉ gán nếu ví chưa kết nối
                  if (!this.web3Service.walletConnected()) {
                    this.products.set(publicProducts);
                    this.categoriesList.set(publicCategories);
                    this.productStore.loadPosProducts();
                  }
                }
                this.isInitialLoading.set(false);
              },
              error: (err) => {
                console.error('[StateService] Lỗi tải menu storefront công khai:', err);
                this.isInitialLoading.set(false);
              }
            });
          } else {
            this.isInitialLoading.set(false);
          }
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

  // Refresh cấu hình + đồng thời sync thông tin subscription từ backend
  public loadSettings() {
    this.settingStore.loadSettings(this.hasPermission('settings'));
    if (this.web3Service.walletConnected()) {
      this.syncSubscriptionFromBackend();
    }
  }

  // Đồng bộ thông tin subscription từ backend (gọi /auth/me)
  private syncSubscriptionFromBackend() {
    this.apiService.getMe().subscribe({
      next: (res) => {
        if (res?.subscription) {
          const sub = res.subscription;
          const planCode = sub.plan_code || 'free';
          const expiresAt = sub.subscription_expires_at || null;
          const status = sub.subscription_status || 'active';

          // Cập nhật signals
          this.subscriptionPlanCode.set(planCode);
          this.subscriptionExpiresAt.set(expiresAt);
          this.subscriptionStatus.set(status);

          if (sub.features) {
            this.planFeatures.set(sub.features);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_plan_features', JSON.stringify(sub.features));
            }
          } else {
            this.planFeatures.set(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_plan_features');
            }
          }

          // Cập nhật localStorage
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
      },
      error: (err) => {
        console.warn('[StateService] Không thể sync thông tin gói cước:', err?.status);
      }
    });
  }

  // Refresh danh sách khách hàng
  public refreshCustomers(force: boolean = false) {
    this.customerStore.refreshCustomers(
      this.hasPermission('pos') || this.hasPermission('customers') || this.hasPermission('reports'),
      force
    );
  }

  // Refresh danh sách giao dịch tài chính
  public refreshTransactions(typeFilter: string = 'all') {
    this.transactionStore.refreshTransactions(this.hasPermission('financials'), typeFilter);
  }

  // Refresh danh sách phiếu kho
  public refreshInventory(typeFilter: string = 'all') {
    this.inventoryStore.refreshInventory(this.hasPermission('inventory'), typeFilter);
  }

  // Refresh sơ đồ bàn ăn và khu vực
  public refreshTablesAndAreas() {
    this.tableStore.refreshTablesAndAreas(this.hasPermission('pos') || this.hasPermission('tables'));
  }

  // Ngắt kết nối ví
  public disconnectWalletAndClose(message?: string, isError = false) {
    this.web3Service.disconnectWallet();
    this.apiService.removeToken();
    
    this.apiService.logout().subscribe({
      next: () => {},
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
    }
    this.currentUserRole.set('Chủ cửa hàng');
    this.currentUserPermissions.set(null);
    this.isSuperAdmin.set(false);
    this.subscriptionPlanCode.set('free');
    this.subscriptionExpiresAt.set(null);
    this.subscriptionStatus.set('active');
    this.planFeatures.set(null);
    this.isWalletModalOpen.set(false);
    if (message) {
      this.showToast(message, isError ? 'error' : 'success');
    } else {
      this.showToast('Đã ngắt kết nối ví Web3 thành công!', 'success');
    }
  }

  // Tải sản phẩm POS (Ủy quyền sang ProductStore)
  public loadPosProducts() {
    this.productStore.loadPosProducts();
  }

  public resetPosFilters() {
    this.productStore.resetPosFilters();
  }

  public clearPosProductsCache() {
    this.productStore.clearPosProductsCache();
  }

  public toggleTheme() {
    const current = this.themeMode();
    if (current === 'light') {
      this.setThemeMode('auto');
    } else if (current === 'auto') {
      this.setThemeMode('dark');
    } else {
      this.setThemeMode('light');
    }
  }

  public onSearchQueryChange(query: string) {
    this.searchSubject.next(query);
  }

  // Quản lý giỏ hàng POS
  public clearCart() {
    this.cartStore.clearCart();
  }

  public editOrder(order: any) {
    this.cartStore.editOrder(order, this.products(), (msg, type) => this.showToast(msg, type));
  }

  public cancelEditOrder() {
    this.cartStore.cancelEditOrder((msg, type) => this.showToast(msg, type));
  }

  public reloadCurrentTab() {
    this.setTabState(this.activeTab());
  }

  private syncTabWithUrl(url: string) {
    const cleanUrl = url.split('?')[0];
    let tab = '';
    if (cleanUrl.includes('/dashboard')) tab = 'dashboard';
    else if (cleanUrl.includes('/pos')) tab = 'pos';
    else if (cleanUrl.includes('/menu')) tab = 'menu';
    else if (cleanUrl.includes('/orders')) tab = 'orders';
    else if (cleanUrl.includes('/settings')) tab = 'settings';
    else if (cleanUrl.includes('/customers')) tab = 'customers';
    else if (cleanUrl.includes('/financials')) tab = 'financials';
    else if (cleanUrl.includes('/inventory')) tab = 'inventory';
    else if (cleanUrl.includes('/tables')) tab = 'tables';
    else if (cleanUrl.includes('/debts')) tab = 'debts';
    else if (cleanUrl.includes('/staffs')) tab = 'staffs';
    else if (cleanUrl.includes('/reports')) tab = 'reports';
    else if (cleanUrl.includes('/shifts')) tab = 'shifts';

    if (tab) {
      this.setTabState(tab);
    }
  }

  private setTabState(tab: string) {
    const isNewTab = this.activeTab() !== tab;
    if (isNewTab) {
      this.activeTab.set(tab);
      this.isMobileMenuOpen.set(false);
    }

    if (tab === 'dashboard') {
      this.refreshDashboard();
    } else if (tab === 'pos') {
      if (this.categoriesList().length === 0) {
        this.refreshProducts();
      }
      this.productStore.loadPosProducts();
      this.refreshTablesAndAreas();
      this.refreshCurrentShift();
    } else if (tab === 'orders') {
      this.refreshOrders();
    } else if (tab === 'menu') {
      this.refreshProducts();
    } else if (tab === 'settings') {
      this.loadSettings();
    } else if (tab === 'customers') {
      this.refreshCustomers();
    } else if (tab === 'financials') {
      this.refreshTransactions();
    } else if (tab === 'inventory') {
      this.refreshProducts();
      this.refreshOrders();
      this.refreshInventory();
    } else if (tab === 'tables') {
      this.refreshTablesAndAreas();
    } else if (tab === 'debts') {
      this.refreshDebts();
    } else if (tab === 'staffs') {
      this.refreshStaffsAndRoles();
    } else if (tab === 'reports') {
      this.refreshShifts();
    }
  }

  // Refresh danh sách nợ khách hàng
  public refreshDebts(searchFilter: string = '', statusFilter: string = 'all') {
    this.debtStore.refreshDebts(this.hasPermission('debts'), searchFilter, statusFilter);
  }

  // Trạng thái dữ liệu nhân viên và vai trò
  public readonly staffs = this.staffStore.staffs;
  public readonly roles = this.staffStore.roles;
  public readonly isStaffsLoading = this.staffStore.isStaffsLoading;

  // Refresh danh sách nhân viên và vai trò
  public refreshStaffsAndRoles() {
    this.staffStore.refreshStaffsAndRoles(this.hasPermission('staffs'));
  }

  // Khôi phục vai trò mặc định
  public resetDefaultRoles() {
    this.staffStore.resetDefaultRoles((msg, type) => this.showToast(msg, type));
  }

  // Kiểm tra quyền truy cập module
  public hasPermission(module: string): boolean {
    const permissions = this.currentUserPermissions();
    if (permissions === null) {
      return true;
    }
    return !!permissions[module];
  }

  // --- Quản lý Ca trực ---
  public refreshCurrentShift(onSuccess?: (shift: any) => void) {
    this.shiftStore.refreshCurrentShift(this.hasPermission('shifts'), onSuccess);
  }

  public refreshShifts() {
    this.shiftStore.refreshShifts(this.hasPermission('shifts'));
  }

  public openShift(initialCash: number, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.shiftStore.openShift(initialCash, {
      onSuccess: (res) => {
        this.isLoading.set(false);
        this.showToast('Vào ca làm việc thành công', 'success');
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        this.isLoading.set(false);
        this.showToast(err.error?.message || 'Không thể mở ca làm việc', 'error');
      }
    });
  }

  public closeShift(actualCash: number, note?: string, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.shiftStore.closeShift(actualCash, note, {
      onSuccess: (res) => {
        this.isLoading.set(false);
        this.showToast('Kết thúc ca trực thành công', 'success');
        if (onSuccess) onSuccess();
        this.refreshShifts();
      },
      onError: (err) => {
        this.isLoading.set(false);
        this.showToast(err.error?.message || 'Không thể kết thúc ca làm việc', 'error');
      }
    });
  }

  public onActualCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.shiftStore.actualCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public onInitialCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.shiftStore.initialCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public openStartShiftModal() {
    this.shiftStore.initialCashInput.set(0);
    this.shiftStore.isStartShiftModalOpen.set(true);
  }

  public confirmStartShift() {
    if (this.isLoading()) return;
    const cash = this.shiftStore.initialCashInput();
    this.openShift(cash, () => {
      this.shiftStore.isStartShiftModalOpen.set(false);
      this.shiftStore.initialCashInput.set(0);
    });
  }

  public openCloseShiftModal() {
    this.shiftStore.isShiftSummaryLoading.set(true);
    this.shiftStore.closeShiftNote.set('');
    this.shiftStore.isCloseShiftModalOpen.set(true);

    this.apiService.getShiftSummary().subscribe({
      next: (res) => {
        this.shiftStore.shiftSummary.set(res);
        const expected = res?.expected_cash ?? 0;
        this.shiftStore.actualCashInput.set(expected);
        this.shiftStore.isShiftSummaryLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải thống kê ca trực:', err);
        this.shiftStore.isShiftSummaryLoading.set(false);
      }
    });
  }

  public confirmCloseShift() {
    if (this.isLoading()) return;
    const actual = this.shiftStore.actualCashInput();
    const note = this.shiftStore.closeShiftNote();
    this.closeShift(actual, note, () => {
      this.shiftStore.isCloseShiftModalOpen.set(false);
      this.shiftStore.shiftSummary.set(null);
    });
  }

  // Kết nối và Yêu cầu Ký ví Web3 Auth
  public async connectWalletAndSign() {
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;

      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          this.pendingNonceMessage = res.message;
          this.pendingAddress = address;
          this.isWaitingForSignature.set(true);
          this.showToast('Vui lòng ký xác thực trên ví của bạn...', 'success');

          try {
            const signature = await this.web3Service.signMessage(res.message);
            this.isWaitingForSignature.set(false);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                    localStorage.setItem('auth_logged_in', 'true');
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
                  }
                  this.web3Service.walletConnected.set(true);
                  this.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.isWalletModalOpen.set(false);

                  // Thiết lập ngày mặc định cho dashboard nếu chưa có
                  const today = new Date();
                  const formatDateStr = (d: Date) => {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  };
                  if (!this.dashboardStartDate()) {
                    const check7 = new Date();
                    check7.setDate(today.getDate() - 6);
                    this.dashboardStartDate.set(formatDateStr(check7));
                  }
                  if (!this.dashboardEndDate()) {
                    this.dashboardEndDate.set(formatDateStr(today));
                  }

                  this.loadSettings();

                  if (this.router.url.includes('/dashboard')) {
                    this.refreshDashboard(true);
                  } else {
                    this.router.navigate(['/dashboard']);
                  }
                }
              },
              error: (err) => {
                this.isWaitingForSignature.set(false);
                this.web3Service.disconnectWallet();
                this.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            this.isWaitingForSignature.set(false);
            this.web3Service.disconnectWallet();
            this.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          this.isWaitingForSignature.set(false);
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
        }
      });
    }
  }

  // Ký lại xác thực khi bấm nút "Ký ngay"
  public async retrySign() {
    if (!this.pendingNonceMessage || !this.pendingAddress) return;
    try {
      const signature = await this.web3Service.signMessage(this.pendingNonceMessage);
      this.isWaitingForSignature.set(false);

      this.apiService.verifySignature(this.pendingAddress, signature).subscribe({
        next: (verifyRes) => {
          if (verifyRes.token) {
            this.apiService.setToken(verifyRes.token);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_address', this.pendingAddress);
              localStorage.setItem('auth_logged_in', 'true');
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
            }
            this.web3Service.walletConnected.set(true);
            this.showToast('Kết nối và xác thực ví thành công!', 'success');
            this.isWalletModalOpen.set(false);
            this.loadSettings();
            if (this.router.url.includes('/dashboard')) {
              this.refreshDashboard(true);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }
        },
        error: () => {
          this.isWaitingForSignature.set(false);
          this.web3Service.disconnectWallet();
          this.showToast('Phiên ký đã hết hạn. Vui lòng kết nối ví lại!', 'error');
        }
      });
    } catch (e) {
      this.showToast('Bạn đã từ chối ký xác thực!', 'error');
    }
  }

  // Hủy tiến trình ký
  public cancelSign() {
    this.isWaitingForSignature.set(false);
    this.pendingNonceMessage = '';
    this.pendingAddress = '';
    this.web3Service.disconnectWallet();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_logged_in');
    }
    this.showToast('Đã hủy xác thực ví.', 'error');
  }

  // Xử lý khi tài khoản ví thay đổi
  public handleAccountSwitch(newAccount: string) {
    this.apiService.removeToken();
    this.apiService.logout().subscribe({
      next: () => {},
      error: (err) => console.warn('[Auth] Không thể xóa phiên làm việc khi chuyển đổi tài khoản:', err)
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
      localStorage.removeItem('auth_logged_in');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_permissions');
    }

    this.cart.set([]);
    this.dashboardData.set(null);
    this.products.set([]);
    this.orders.set([]);
    this.categoriesList.set([]);

    if (newAccount) {
      this.showToast('Phát hiện tài khoản ví thay đổi. Đang yêu cầu ký xác thực lại...', 'success');
      this.connectWalletAndSign();
    } else {
      this.showToast('Ví đã ngắt kết nối. Vui lòng kết nối ví để tiếp tục!', 'error');
    }
  }

  // Sao chép địa chỉ ví
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

  // Kích hoạt mở modal blocked & nâng cấp tính năng
  public triggerUpgradeModal(featureKey: string, featureName: string) {
    this.lockedFeatureKey.set(featureKey);
    this.lockedFeatureName.set(featureName);

    this.isWalletModalOpen.set(false);
    this.isWaitingForSignature.set(false);
    this.isSendTokenModalOpen.set(false);
    this.isCloseShiftModalOpen.set(false);
    this.isStartShiftModalOpen.set(false);
    this.isMobileMenuOpen.set(false);

    this.upgradeModalStep.set(1);
    this.isUpgradeModalOpen.set(true);
  }

  // Mở trực tiếp step 2 nâng cấp
  public triggerUpgradeModalDirectly(featureKey: string, featureName: string) {
    this.lockedFeatureKey.set(featureKey);
    this.lockedFeatureName.set(featureName);

    this.isWalletModalOpen.set(false);
    this.isWaitingForSignature.set(false);
    this.isSendTokenModalOpen.set(false);
    this.isCloseShiftModalOpen.set(false);
    this.isStartShiftModalOpen.set(false);
    this.isMobileMenuOpen.set(false);

    this.upgradeModalStep.set(2);
    this.isUpgradeModalOpen.set(true);
  }

  // Chuyển đổi mạng (Chain) trên ví Web3
  public async switchChain(chainId: string) {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      this.showToast('Vui lòng kết nối ví Web3 trước khi chọn mạng lưới!', 'error');
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
