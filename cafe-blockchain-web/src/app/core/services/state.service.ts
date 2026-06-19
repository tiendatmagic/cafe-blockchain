import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import { forkJoin, Subject, Subscription, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { OrderStore } from '@features/pos/store/order.store';
import { SettingStore } from '@features/settings/store/setting.store';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);
  private readonly orderStore = inject(OrderStore);
  private readonly settingStore = inject(SettingStore);
  private readonly colorStorageKey = 'dapp_dynamic_colors';

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
  public readonly isDashboardLoading = signal<boolean>(false);
  public readonly isProductsLoading = signal<boolean>(false);
  public readonly isOrdersLoading = this.orderStore.isOrdersLoading;
  public readonly isCustomersLoading = signal<boolean>(false);
  public readonly isTransactionsLoading = signal<boolean>(false);
  public readonly isInventoryLoading = signal<boolean>(false);
  public readonly isTablesLoading = signal<boolean>(false);
  public readonly isSettingsLoading = this.settingStore.isSettingsLoading;
  public readonly isDebtsLoading = signal<boolean>(false);
  public readonly isShiftsLoading = signal<boolean>(false);
  public readonly currentShift = signal<any>(null);
  
  // --- Quản lý ca trực (Trạng thái và logic dùng chung) ---
  public readonly isCloseShiftModalOpen = signal<boolean>(false);
  public readonly isShiftSummaryLoading = signal<boolean>(false);
  public readonly shiftSummary = signal<any>(null);
  public readonly actualCashInput = signal<number>(0);
  public readonly actualCashFormatted = computed(() => {
    const val = this.actualCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });
  public readonly closeShiftNote = signal<string>('');

  public readonly isStartShiftModalOpen = signal<boolean>(false);
  public readonly initialCashInput = signal<number>(0);
  public readonly initialCashFormatted = computed(() => {
    const val = this.initialCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });

  public readonly shiftFiatRevenue = computed(() => this.shiftSummary()?.payment_revenues?.cash ?? 0);
  public readonly shiftBankTransferRevenue = computed(() => this.shiftSummary()?.payment_revenues?.bank_transfer ?? 0);
  public readonly shiftCryptoRevenue = computed(() => this.shiftSummary()?.payment_revenues?.crypto ?? 0);
  public readonly shiftEWalletRevenue = computed(() => this.shiftSummary()?.payment_revenues?.e_wallet ?? 0);
  public readonly shiftFiatExpenses = computed(() => this.shiftSummary()?.payment_expenses?.cash ?? 0);
  public readonly shiftExpectedCash = computed(() => this.shiftSummary()?.expected_cash ?? 0);
  
  public readonly shifts = signal<any[]>([]);
  public readonly shiftDurationString = signal<string>('00:00:00');
  private shiftTimerInterval: any = null;

  // Thông điệp Toast
  public readonly successMessage = signal<string>('');
  public readonly errorMessage = signal<string>('');

  // Dữ liệu toàn cục tải từ Backend
  public readonly dashboardStartDate = signal<string>('');
  public readonly dashboardEndDate = signal<string>('');
  public readonly dashboardData = signal<any>(null);
  public readonly products = signal<any[]>([]);
  public readonly orders = this.orderStore.orders;
  public readonly categoriesList = signal<any[]>([]);
  public readonly customers = signal<any[]>([]);
  public readonly customerGroups = signal<any[]>([]);
  public readonly transactions = signal<any[]>([]);
  public readonly inventoryRecords = signal<any[]>([]);
  public readonly areas = signal<any[]>([]);
  public readonly diningTables = signal<any[]>([]);
  public readonly debts = signal<any[]>([]);

  // Dữ liệu phương thức thanh toán (đặt ở service để cache tồn tại xuyên vòng đời component)
  public readonly paymentMethodsList = signal<any[]>([]);
  public readonly paymentMethodsTotal = signal<number>(0);
  public lastPaymentMethodsLoadTimestamp = 0;

  public readonly settings = this.settingStore.settings;

  // Trạng thái POS (Giỏ hàng)
  public readonly cart = signal<{ product: any, variant: any | null, quantity: number, note?: string }[]>([]);
  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  });
  public readonly tableNumber = signal<string>('');
  public readonly paymentMethod = signal<string>('cash');
  public readonly posCategoryFilter = signal<string>('Tất cả');
  public readonly posSearchQuery = signal<string>('');
  public readonly posMinPrice = signal<number | null>(null);
  public readonly posMaxPrice = signal<number | null>(null);
  public readonly posMinVariantPrice = signal<number | null>(null);
  public readonly posMaxVariantPrice = signal<number | null>(null);
  public readonly posFilterStatus = signal<string>('all'); // 'all' | 'active' | 'inactive'
  public readonly posSelectedCustomer = signal<any | null>(null);
  public readonly editingOrderId = signal<number | null>(null);
  public readonly isOrderSubmitting = signal<boolean>(false);

  // Phân trang sản phẩm ở trang Bán hàng POS
  public readonly posItemsPerPage = 20;
  public readonly posCurrentPage = signal<number>(1);
  public readonly posProductsList = signal<any[]>([]);
  public readonly paginatedPosProducts = computed(() => this.posProductsList());
  public readonly posTotalPages = signal<number>(1);
  public readonly posTotalItems = signal<number>(0);

  // Bộ nhớ đệm Cache cho sản phẩm POS
  private posProductsCache = new Map<string, { data: any[], totalPages: number, totalItems: number, timestamp: number }>();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 phút (ms)
  private isInitialSyncDone = false;
  private isSettingsFetching = false;
  private lastSettingsLoadTimestamp = 0;
  private lastCustomersLoadTimestamp = 0;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private routerSubscription?: Subscription;
  public readonly cancelRequests$ = new Subject<void>();

  // Giá VND của các coin từ CoinGecko (hoặc fallback mặc định)
  public readonly coingeckoPrices = signal<{
    tether: number;
    binancecoin: number;
    ethereum: number;
    'polygon-ecosystem-token': number;
    'avalanche-2': number;
  }>({
    tether: 25420,
    binancecoin: 15240000,
    ethereum: 92450000,
    'polygon-ecosystem-token': 12800,
    'avalanche-2': 890000
  });

  // Tự động nhận diện Token giá VND
  public readonly nativeTokenPriceVND = computed(() => {
    const symbol = this.web3Service.nativeTokenSymbol();
    const prices = this.coingeckoPrices();
    switch (symbol) {
      case 'ETH':
        return prices.ethereum || 92450000;
      case 'BNB':
        return prices.binancecoin || 15240000;
      case 'MATIC':
      case 'POL':
        return prices['polygon-ecosystem-token'] || 12800;
      case 'AVAX':
        return prices['avalanche-2'] || 890000;
      default:
        return prices.ethereum || 92450000;
    }
  });

  // Tỷ giá USDT/VND
  public readonly usdtPriceVND = computed(() => {
    return this.coingeckoPrices().tether || 25420;
  });

  // Tải giá coin thực tế từ CoinGecko có cache
  public loadCoinPrices() {
    const cacheKey = 'coin_prices_cache';
    const cacheTTL = 10 * 60 * 1000; // 10 phút
    const now = Date.now();

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.timestamp && now - parsed.timestamp < cacheTTL) {
            this.coingeckoPrices.set(parsed.prices);
            return;
          }
        } catch (e) {
          console.error('[Prices] Error parsing cache:', e);
        }
      }
    }

    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,ethereum,tether,polygon-ecosystem-token,avalanche-2&vs_currencies=vnd';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const newPrices = {
            tether: data.tether?.vnd || this.coingeckoPrices().tether,
            binancecoin: data.binancecoin?.vnd || this.coingeckoPrices().binancecoin,
            ethereum: data.ethereum?.vnd || this.coingeckoPrices().ethereum,
            'polygon-ecosystem-token': data['polygon-ecosystem-token']?.vnd || this.coingeckoPrices()['polygon-ecosystem-token'],
            'avalanche-2': data['avalanche-2']?.vnd || this.coingeckoPrices()['avalanche-2']
          };
          this.coingeckoPrices.set(newPrices);

          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({
              prices: newPrices,
              timestamp: now
            }));
          }
        }
      })
      .catch(err => {
        console.warn('[Prices] CoinGecko API error, fallback to cache or defaults:', err);
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              this.coingeckoPrices.set(parsed.prices);
            } catch (e) {}
          }
        }
      });
  }


  constructor() {
    if (typeof window !== 'undefined') {
      (window as any)._stateServiceInstances = ((window as any)._stateServiceInstances || 0) + 1;
    }
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
      this.loadCoinPrices();
      setInterval(() => {
        this.loadCoinPrices();
      }, 10 * 60 * 1000);
    }

    // Lắng nghe thay đổi của page và category tại POS để tự động load sản phẩm
    effect(() => {
      const page = this.posCurrentPage();
      const category = this.posCategoryFilter();
      if (this.activeTab() === 'pos') {
        this.loadPosProducts();
      }
    }, { allowSignalWrites: true });

    // Tự động đếm thời gian trôi qua của ca làm việc
    effect(() => {
      const shift = this.currentShift();
      if (shift && shift.start_time) {
        this.startShiftTimer(shift.start_time);
      } else {
        this.stopShiftTimer();
      }
    }, { allowSignalWrites: true });

    // Tự động nạp cấu hình và dữ liệu của tab hiện tại ngay khi ví kết nối & xác thực thành công
    effect(() => {
      if (this.web3Service.walletConnected()) {
        untracked(() => {
          this.isInitialLoading.set(true);

          const settings$ = this.apiService.getSettings();
          const shift$ = this.hasPermission('shifts') 
            ? this.apiService.getCurrentShift() 
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
              
              // Nạp dữ liệu cho tab hiện tại
              this.reloadCurrentTab();
              
              // Đồng bộ thông tin gói cước mới nhất từ DB (phòng trường hợp admin đổi gói sau khi đăng nhập)
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
      this.loadPosProducts();
    });

    // Lắng nghe sự kiện thay đổi route để cập nhật activeTab và tự động refresh dữ liệu tương ứng
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isInitialSyncDone = true;
      this.syncTabWithUrl(event.urlAfterRedirects || event.url);
    });

    // Cơ chế fallback đồng bộ tab ban đầu nếu routerSubscription bỏ lỡ sự kiện NavigationEnd ban đầu
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

  // Hủy đăng ký khi service bị destroy (thường Injectable root không destroy nhưng viết cho chuẩn)
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
    this.applyCachedDynamicColors();

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

  private applyCachedDynamicColors() {
    this.settingStore.applyCachedDynamicColors();
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
          this.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
          this.web3Service.updateConfig(settings);
        }
        this.refreshTablesAndAreas();
        this.loadPosProducts();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu:', err);
        this.showToast('Lỗi tải dữ liệu từ máy chủ. Vui lòng kiểm tra Laravel Backend!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // Refresh danh sách thực đơn
  public refreshProducts() {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('menu') && !this.hasPermission('inventory')) return;
    if (this.isProductsLoading()) return;
    this.isProductsLoading.set(true);
    forkJoin({
      products: this.apiService.getProducts(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.categoriesList.set(res.categories || []);
        this.isProductsLoading.set(false);
        this.loadPosProducts();
      },
      error: (err) => {
        console.error('Lỗi refresh sản phẩm & danh mục:', err);
        this.isProductsLoading.set(false);
      }
    });
  }

  // Refresh danh sách đơn hàng
  public refreshOrders(statusFilter: string = 'all', blockchainFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('orders')) return;
    this.orderStore.refreshOrders(statusFilter, blockchainFilter);
  }

  // Refresh dữ liệu dashboard
  public refreshDashboard() {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('dashboard')) return;
    if (this.isDashboardLoading()) return;
    this.isDashboardLoading.set(true);
    this.apiService.getDashboard(this.dashboardStartDate(), this.dashboardEndDate()).subscribe({
      next: (res) => {
        this.dashboardData.set(res);
        this.isDashboardLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi refresh dashboard:', err);
        this.isDashboardLoading.set(false);
      }
    });
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

          // Nếu có website_slug, tải menu storefront công khai để hiển thị lên POS
          if (settings.website_slug) {
            this.apiService.getPublicStoreBySlug(settings.website_slug).subscribe({
              next: (storeRes) => {
                if (storeRes) {
                  const publicProducts = storeRes.products || [];
                  const publicCategories = storeRes.categories || [];
                  
                  // Chỉ gán nếu ví chưa kết nối (tránh ghi đè dữ liệu thật sau khi đăng nhập)
                  if (!this.web3Service.walletConnected()) {
                    this.products.set(publicProducts);
                    this.categoriesList.set(publicCategories);
                    this.loadPosProducts();
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

  // Refresh cấu hình + đồng thời sync thông tin subscription mới nhất từ backend
  public loadSettings() {
    this.settingStore.loadSettings(this.hasPermission('settings'));
    // Sync thông tin gói cước mới nhất từ backend mỗi khi load settings
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

          // Cập nhật localStorage để đồng bộ
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
        // Không làm gì nếu lỗi (silent - không cần toast)
        console.warn('[StateService] Không thể sync thông tin gói cước:', err?.status);
      }
    });
  }

  // Refresh danh sách khách hàng (có cache 5 phút)
  public refreshCustomers(force: boolean = false) {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('customers') && !this.hasPermission('reports')) return;
    
    const now = Date.now();
    // Nếu không force và đã có dữ liệu và chưa hết hạn 5 phút
    if (!force && this.customers().length > 0 && (now - this.lastCustomersLoadTimestamp < 5 * 60 * 1000)) {
      return;
    }

    if (this.isCustomersLoading()) return;
    this.isCustomersLoading.set(true);
    forkJoin({
      customers: this.apiService.getCustomers(),
      groups: this.apiService.getCustomerGroups()
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers || []);
        this.customerGroups.set(res.groups || []);
        this.lastCustomersLoadTimestamp = Date.now();
        this.isCustomersLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải khách hàng:', err);
        this.isCustomersLoading.set(false);
      }
    });
  }

  // Refresh danh sách giao dịch tài chính
  public refreshTransactions(typeFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('financials')) return;
    if (this.isTransactionsLoading()) return;
    this.isTransactionsLoading.set(true);
    this.apiService.getTransactions(typeFilter).subscribe({
      next: (res) => {
        this.transactions.set(res || []);
        this.isTransactionsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải thu chi:', err);
        this.isTransactionsLoading.set(false);
      }
    });
  }

  // Refresh danh sách phiếu kho
  public refreshInventory(typeFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('inventory')) return;
    if (this.isInventoryLoading()) return;
    this.isInventoryLoading.set(true);
    this.apiService.getInventoryRecords(typeFilter).subscribe({
      next: (res) => {
        this.inventoryRecords.set(res || []);
        this.isInventoryLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải kho hàng:', err);
        this.isInventoryLoading.set(false);
      }
    });
  }

  // Refresh sơ đồ bàn ăn và khu vực
  public refreshTablesAndAreas() {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('pos') && !this.hasPermission('tables')) return;
    if (this.isTablesLoading()) return;
    this.isTablesLoading.set(true);
    forkJoin({
      areas: this.apiService.getAreas(),
      tables: this.apiService.getDiningTables()
    }).subscribe({
      next: (res) => {
        this.areas.set(res.areas || []);
        this.diningTables.set(res.tables || []);
        this.isTablesLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải sơ đồ bàn/khu vực:', err);
        this.isTablesLoading.set(false);
      }
    });
  }

  // Ngắt kết nối ví
  public disconnectWalletAndClose(message?: string, isError = false) {
    this.web3Service.disconnectWallet();
    this.apiService.removeToken();
    
    // Gọi API đăng xuất để xóa cookie HttpOnly phía backend
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

  // Tải sản phẩm POS có phân trang và Lọc trực tiếp ở Client-side (Không gọi API)
  public loadPosProducts() {
    // Lấy toàn bộ danh sách sản phẩm đã tải trong State
    let list = this.products();

    // 1. Lọc theo danh mục (Category)
    const category = this.posCategoryFilter();
    if (category && category !== 'Tất cả') {
      list = list.filter(p => 
        (p.categories && p.categories.some((c: any) => c.name === category)) ||
        p.category?.category_name === category || 
        p.category_name === category
      );
    }

    // 2. Lọc theo từ khóa tìm kiếm (Search Query) - không phân biệt hoa thường
    const search = this.posSearchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.sku?.toLowerCase().includes(search) ||
        p.barcode?.toLowerCase().includes(search) ||
        p.category?.category_name?.toLowerCase().includes(search)
      );
    }

    // 3. Lọc theo khoảng giá sản phẩm chính
    const minPrice = this.posMinPrice();
    if (minPrice !== null && minPrice !== undefined) {
      list = list.filter(p => p.price >= minPrice);
    }
    const maxPrice = this.posMaxPrice();
    if (maxPrice !== null && maxPrice !== undefined) {
      list = list.filter(p => p.price <= maxPrice);
    }

    // 4. Lọc theo khoảng giá biến thể sản phẩm
    const minVarPrice = this.posMinVariantPrice();
    const maxVarPrice = this.posMaxVariantPrice();
    if (minVarPrice !== null || maxVarPrice !== null) {
      list = list.filter(p => 
        p.variants && p.variants.length > 0 && p.variants.some((v: any) => {
          const matchMin = minVarPrice === null || minVarPrice === undefined || v.price >= minVarPrice;
          const matchMax = maxVarPrice === null || maxVarPrice === undefined || v.price <= maxVarPrice;
          return matchMin && matchMax;
        })
      );
    }

    // 5. Lọc theo trạng thái bật/tắt (Đang bán/Ngừng bán)
    const statusFilter = this.posFilterStatus();
    if (statusFilter === 'active') {
      list = list.filter(p => p.status === true || Number(p.status) === 1);
    } else if (statusFilter === 'inactive') {
      list = list.filter(p => p.status === false || Number(p.status) === 0);
    }

    // Cập nhật tổng số sản phẩm sau khi lọc
    const totalItems = list.length;
    this.posTotalItems.set(totalItems);

    // Tính toán tổng số trang
    const limit = this.posItemsPerPage;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    this.posTotalPages.set(totalPages);

    // 6. Phân trang danh sách sản phẩm
    let page = this.posCurrentPage();
    // Đảm bảo số trang hiện tại không vượt quá tổng số trang sau khi lọc
    if (page > totalPages) {
      page = totalPages;
      this.posCurrentPage.set(totalPages);
    }
    const startIndex = (page - 1) * limit;
    const paginatedList = list.slice(startIndex, startIndex + limit);

    // Cập nhật danh sách hiển thị
    this.posProductsList.set(paginatedList);
  }

  public resetPosFilters() {
    this.posMinPrice.set(null);
    this.posMaxPrice.set(null);
    this.posMinVariantPrice.set(null);
    this.posMaxVariantPrice.set(null);
    this.posFilterStatus.set('all');
    this.posCategoryFilter.set('Tất cả');
    this.posCurrentPage.set(1);
    this.loadPosProducts();
  }

  public clearPosProductsCache() {
    this.posProductsCache.clear();
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

  // Quản lý giỏ hàng và chỉnh sửa đơn hàng POS toàn cục
  public clearCart() {
    this.cart.set([]);
    this.tableNumber.set('');
    this.paymentMethod.set('cash');
    this.posSelectedCustomer.set(null);
  }

  public editOrder(order: any) {
    if (!order) return;

    this.isOrderSubmitting.set(true);
    
    // Nạp lại khách hàng của đơn hàng cũ
    this.posSelectedCustomer.set(order.customer || null);

    // Tái cấu trúc giỏ hàng từ order items
    const loadedCart: { product: any, variant: any | null, quantity: number, note?: string }[] = [];
    const productsList = this.products();

    order.items.forEach((item: any) => {
      const product = productsList.find(p => Number(p.id) === Number(item.product_id));
      if (product) {
        let variant: any = null;
        if (item.product_variant_id && product.variants) {
          variant = product.variants.find((v: any) => Number(v.id) === Number(item.product_variant_id)) || null;
        }
        loadedCart.push({
          product,
          variant,
          quantity: Number(item.quantity) || 1,
          note: item.note || ''
        });
      }
    });

    this.cart.set(loadedCart);
    this.tableNumber.set(order.table_number || '');
    this.paymentMethod.set(order.payment_method || 'cash');
    this.editingOrderId.set(order.id);

    // Chuyển hướng sang POS bằng Angular Router
    this.router.navigate(['/pos']);

    this.showToast(`Đang chỉnh sửa đơn hàng ${order.order_code || ('#' + order.id)}`, 'success');
    this.isOrderSubmitting.set(false);
  }

  public cancelEditOrder() {
    this.clearCart();
    this.editingOrderId.set(null);
    this.router.navigate(['/orders']);
    this.showToast('Đã hủy chỉnh sửa đơn hàng', 'success');
  }

  public reloadCurrentTab() {
    this.setTabState(this.activeTab());
  }

  private syncTabWithUrl(url: string) {
    const cleanUrl = url.split('?')[0]; // bỏ qua query params nếu có
    if (cleanUrl.includes('/dashboard')) {
      this.setTabState('dashboard');
    } else if (cleanUrl.includes('/pos')) {
      this.setTabState('pos');
    } else if (cleanUrl.includes('/menu')) {
      this.setTabState('menu');
    } else if (cleanUrl.includes('/orders')) {
      this.setTabState('orders');
    } else if (cleanUrl.includes('/settings')) {
      this.setTabState('settings');
    } else if (cleanUrl.includes('/customers')) {
      this.setTabState('customers');
    } else if (cleanUrl.includes('/financials')) {
      this.setTabState('financials');
    } else if (cleanUrl.includes('/inventory')) {
      this.setTabState('inventory');
    } else if (cleanUrl.includes('/tables')) {
      this.setTabState('tables');
    } else if (cleanUrl.includes('/debts')) {
      this.setTabState('debts');
    } else if (cleanUrl.includes('/staffs')) {
      this.setTabState('staffs');
    } else if (cleanUrl.includes('/reports')) {
      this.setTabState('reports');
    }
  }

  private setTabState(tab: string) {
    const isNewTab = this.activeTab() !== tab;
    if (isNewTab) {
      this.activeTab.set(tab);
      this.isMobileMenuOpen.set(false);
    }

    // Refresh dữ liệu tương ứng khi đổi tab hoặc khi load trang lần đầu
    if (tab === 'dashboard') {
      this.refreshDashboard();
    } else if (tab === 'pos') {
      if (this.categoriesList().length === 0) {
        this.refreshProducts();
      }
      this.loadPosProducts();
      this.refreshTablesAndAreas(); // Tải sơ đồ bàn cho POS
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
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('debts')) return;
    if (this.isDebtsLoading()) return;
    this.isDebtsLoading.set(true);
    this.apiService.getDebts(searchFilter, statusFilter).subscribe({
      next: (res) => {
        this.debts.set(res || []);
        this.isDebtsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải danh sách nợ:', err);
        this.isDebtsLoading.set(false);
      }
    });
  }

  // Trạng thái dữ liệu nhân viên và vai trò
  public readonly staffs = signal<any[]>([]);
  public readonly roles = signal<any[]>([]);
  public readonly isStaffsLoading = signal<boolean>(false);

  // Refresh danh sách nhân viên và vai trò
  public refreshStaffsAndRoles() {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('staffs')) return;
    if (this.isStaffsLoading()) return;
    this.isStaffsLoading.set(true);

    forkJoin({
      staffs: this.apiService.getStaffs(),
      roles: this.apiService.getRoles()
    }).subscribe({
      next: (res) => {
        this.staffs.set(res.staffs || []);
        this.roles.set(res.roles || []);
        this.isStaffsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải nhân viên & vai trò:', err);
        this.isStaffsLoading.set(false);
      }
    });
  }

  // Khôi phục vai trò mặc định của hệ thống
  public resetDefaultRoles() {
    if (this.isStaffsLoading()) return;
    this.isStaffsLoading.set(true);

    this.apiService.resetDefaultRoles().subscribe({
      next: (res) => {
        this.isStaffsLoading.set(false);
        this.showToast('Khôi phục vai trò mặc định thành công', 'success');
        this.refreshStaffsAndRoles();
      },
      error: (err) => {
        console.error('Lỗi khôi phục vai trò mặc định:', err);
        this.isStaffsLoading.set(false);
        this.showToast(err.error?.message || 'Không thể khôi phục vai trò mặc định', 'error');
      }
    });
  }

  // Kiểm tra quyền truy cập module
  public hasPermission(module: string): boolean {
    const permissions = this.currentUserPermissions();
    // Nếu permissions là null, đây là Chủ cửa hàng (Admin) -> full quyền
    if (permissions === null) {
      return true;
    }
    return !!permissions[module];
  }

  // --- Quản lý Ca trực ---
  public refreshCurrentShift(onSuccess?: (shift: any) => void) {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('shifts')) return;
    this.apiService.getCurrentShift().subscribe({
      next: (res) => {
        this.currentShift.set(res || null);
        if (onSuccess) onSuccess(res || null);
      },
      error: (err) => {
        console.error('Lỗi tải ca trực hiện tại:', err);
      }
    });
  }

  public refreshShifts() {
    if (!this.web3Service.walletConnected()) return;
    if (!this.hasPermission('shifts')) return;
    if (this.isShiftsLoading()) return;
    this.isShiftsLoading.set(true);
    this.apiService.getShifts().subscribe({
      next: (res) => {
        this.shifts.set(res || []);
        this.isShiftsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải danh sách ca làm việc:', err);
        this.isShiftsLoading.set(false);
      }
    });
  }

  public openShift(initialCash: number, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.apiService.openShift(initialCash).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.currentShift.set(res.data || res.shift || res);
        this.showToast('Vào ca làm việc thành công', 'success');
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Lỗi mở ca:', err);
        this.showToast(err.error?.message || 'Không thể mở ca làm việc', 'error');
      }
    });
  }

  public closeShift(actualCash: number, note?: string, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.apiService.closeShift(actualCash, note).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.currentShift.set(null);
        this.showToast('Kết thúc ca trực thành công', 'success');
        if (onSuccess) onSuccess();
        this.refreshShifts();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Lỗi kết ca:', err);
        this.showToast(err.error?.message || 'Không thể kết thúc ca làm việc', 'error');
      }
    });
  }

  public onActualCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.actualCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public onInitialCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.initialCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public openStartShiftModal() {
    this.initialCashInput.set(0);
    this.isStartShiftModalOpen.set(true);
  }

  public confirmStartShift() {
    if (this.isLoading()) return;
    const cash = this.initialCashInput();
    this.openShift(cash, () => {
      this.isStartShiftModalOpen.set(false);
      this.initialCashInput.set(0);
    });
  }

  public openCloseShiftModal() {
    this.isShiftSummaryLoading.set(true);
    this.closeShiftNote.set('');
    this.isCloseShiftModalOpen.set(true);

    this.apiService.getShiftSummary().subscribe({
      next: (res) => {
        this.shiftSummary.set(res);
        const expected = res?.expected_cash ?? 0;
        this.actualCashInput.set(expected);
        this.isShiftSummaryLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải thống kê ca trực:', err);
        this.isShiftSummaryLoading.set(false);
      }
    });
  }

  public confirmCloseShift() {
    if (this.isLoading()) return;
    const actual = this.actualCashInput();
    const note = this.closeShiftNote();
    this.closeShift(actual, note, () => {
      this.isCloseShiftModalOpen.set(false);
      this.shiftSummary.set(null);
    });
  }

  private startShiftTimer(startTimeIso: string) {
    this.stopShiftTimer();
    this.updateShiftDuration(startTimeIso);
    if (typeof window !== 'undefined') {
      this.shiftTimerInterval = setInterval(() => {
        this.updateShiftDuration(startTimeIso);
      }, 1000);
    }
  }

  private stopShiftTimer() {
    if (this.shiftTimerInterval) {
      clearInterval(this.shiftTimerInterval);
      this.shiftTimerInterval = null;
    }
    this.shiftDurationString.set('00:00:00');
  }

  private updateShiftDuration(startTimeIso: string) {
    const start = new Date(startTimeIso).getTime();
    if (isNaN(start)) {
      this.shiftDurationString.set('00:00:00');
      return;
    }
    const now = Date.now();
    const diff = Math.max(0, now - start); // ms

    const totalSecs = Math.floor(diff / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    this.shiftDurationString.set(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
  }

  // Kết nối và Yêu cầu Ký ví Web3 Auth cho Admin
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

                  // Sau khi đăng nhập thành công: luôn chuyển về dashboard để tải dữ liệu,
                  // trừ khi người dùng đang ở dashboard thì chỉ refresh dữ liệu
                  if (this.router.url.includes('/dashboard')) {
                    this.refreshDashboard();
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

  // Ký lại xác thực khi bấm nút "Ký ngay" trên banner
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
              this.refreshDashboard();
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

  // Xử lý khi tài khoản ví Web3 thay đổi
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

  // Sao chép địa chỉ ví vào clipboard
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

  // Kiểm tra xem tính năng có được mở khóa cho gói cước hiện tại của quán không
  public hasFeature(featureKey: string): boolean {
    if (this.isSuperAdmin()) {
      return true;
    }
    
    const features = this.planFeatures();
    if (!features) {
      if (featureKey === 'enable_storefront' || featureKey === 'enable_reports' || featureKey === 'enable_excel_export') {
        return false;
      }
      return true;
    }

    if (features[featureKey] === undefined) {
      return true;
    }

    return !!features[featureKey];
  }

  // Lấy giới hạn tối đa theo gói cước (ví dụ: max_products, max_staffs)
  public getFeatureLimit(featureKey: string): number {
    if (this.isSuperAdmin()) {
      return -1; // Không giới hạn
    }
    
    const features = this.planFeatures();
    if (!features) {
      if (featureKey === 'max_products') return 20;
      if (featureKey === 'max_staffs') return 2;
      return -1;
    }

    return features[featureKey] !== undefined ? Number(features[featureKey]) : -1;
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
