import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);
  private readonly colorStorageKey = 'dapp_dynamic_colors';

  // Trạng thái UI toàn cục
  public readonly activeTab = signal<string>('dashboard');
  public readonly isDarkMode = signal<boolean>(false);
  public readonly themeMode = signal<'light' | 'auto' | 'dark'>('light');
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly isWalletModalOpen = signal<boolean>(false);

  // Trạng thái Loading
  public readonly isLoading = signal<boolean>(false);
  public readonly isDashboardLoading = signal<boolean>(false);
  public readonly isProductsLoading = signal<boolean>(false);
  public readonly isOrdersLoading = signal<boolean>(false);
  public readonly isCustomersLoading = signal<boolean>(false);
  public readonly isTransactionsLoading = signal<boolean>(false);
  public readonly isInventoryLoading = signal<boolean>(false);
  public readonly isTablesLoading = signal<boolean>(false);
  public readonly isSettingsLoading = signal<boolean>(false);

  // Thông điệp Toast
  public readonly successMessage = signal<string>('');
  public readonly errorMessage = signal<string>('');

  // Dữ liệu toàn cục tải từ Backend
  public readonly dashboardStartDate = signal<string>('');
  public readonly dashboardEndDate = signal<string>('');
  public readonly dashboardData = signal<any>(null);
  public readonly products = signal<any[]>([]);
  public readonly orders = signal<any[]>([]);
  public readonly categoriesList = signal<any[]>([]);
  public readonly customers = signal<any[]>([]);
  public readonly customerGroups = signal<any[]>([]);
  public readonly transactions = signal<any[]>([]);
  public readonly inventoryRecords = signal<any[]>([]);
  public readonly areas = signal<any[]>([]);
  public readonly diningTables = signal<any[]>([]);

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
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private routerSubscription?: Subscription;

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
            console.log('[Prices] Loaded from cache:', parsed.prices);
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
          console.log('[Prices] Fetched and cached new prices:', newPrices);
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
              console.log('[Prices] Fallback to old cache prices:', parsed.prices);
            } catch (e) {}
          }
        }
      });
  }


  constructor() {
    if (typeof window !== 'undefined') {
      (window as any)._stateServiceInstances = ((window as any)._stateServiceInstances || 0) + 1;
      console.log('[StateService] Khởi tạo instance thứ:', (window as any)._stateServiceInstances);
    }
    this.initTheme();
    // Không tự động gọi loadSettings() khi khởi tạo để tránh gọi API dư thừa khi chưa kết nối ví

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
  }

  // Hủy đăng ký khi service bị destroy (thường Injectable root không destroy nhưng viết cho chuẩn)
  public destroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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

  private applyCachedDynamicColors() {
    if (typeof window === 'undefined') return;
    const cachedColors = localStorage.getItem(this.colorStorageKey);
    if (!cachedColors) return;

    try {
      const colors = JSON.parse(cachedColors);
      this.applyDynamicColors(colors.primary_color, colors.secondary_color);
    } catch {
      localStorage.removeItem(this.colorStorageKey);
    }
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
        this.orders.set(res.orders);
        this.categoriesList.set(res.categories || []);

        if (res.settings) {
          const settings = {
            default_print_size: '80mm',
            show_crypto_payment: '0',
            has_synced_menu: '0',
            ...res.settings
          };
          this.settings.set(settings);
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
    this.isOrdersLoading.set(true);
    this.apiService.getOrders(statusFilter, blockchainFilter).subscribe({
      next: (res) => {
        this.orders.set(res);
        this.isOrdersLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi refresh đơn hàng:', err);
        this.isOrdersLoading.set(false);
      }
    });
  }

  // Refresh dữ liệu dashboard
  public refreshDashboard() {
    if (!this.web3Service.walletConnected()) return;
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

  // Refresh cấu hình
  public loadSettings() {
    console.log('[StateService] loadSettings() được gọi. Cờ isSettingsFetching hiện tại:', this.isSettingsFetching, 'hasToken:', !!this.apiService.getToken(), 'Time:', Date.now());
    
    if (!this.web3Service.walletConnected()) {
      console.log('[StateService] loadSettings() bị chặn do ví chưa kết nối!');
      return;
    }

    // Nếu dữ liệu đã có và thời gian load trước đó chưa quá 5 phút (300000ms), thì sử dụng cache
    const now = Date.now();
    const hasCachedSettings = this.settings() && this.settings().store_name && this.settings().store_name !== 'Blockchain Cafe & Bistro';
    if (hasCachedSettings && (now - this.lastSettingsLoadTimestamp < 5 * 60 * 1000)) {
      console.log('[StateService] Sử dụng settings từ cache (chưa quá 5 phút):', this.settings());
      return;
    }

    if (this.isSettingsFetching) {
      console.warn('[StateService] loadSettings() BỊ CHẶN do cờ isSettingsFetching là true!');
      return;
    }
    this.isSettingsFetching = true;
    this.isSettingsLoading.set(true);
    const hasToken = this.web3Service.walletConnected();
    const settingsObservable = hasToken 
      ? this.apiService.getSettings() 
      : this.apiService.getPublicSettings();

    settingsObservable.subscribe({
      next: (res) => {
        const settings = {
          default_print_size: '80mm',
          show_crypto_payment: '0',
          has_synced_menu: '0',
          ...res
        };
        this.settings.set(settings);
        this.lastSettingsLoadTimestamp = Date.now(); // Lưu timestamp khi load thành công
        this.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
        this.web3Service.updateConfig(settings);
        this.isSettingsLoading.set(false);
        this.isSettingsFetching = false;
      },
      error: (err) => {
        console.error('Lỗi tải cấu hình quán:', err);
        // Fallback dùng màu mặc định nếu API lỗi hoặc chưa thiết lập màu
        this.applyAndCacheDynamicColors('#7c3aed', '#c084fc');
        this.isSettingsLoading.set(false);
        this.isSettingsFetching = false;
      }
    });
  }

  // Refresh danh sách khách hàng
  public refreshCustomers() {
    if (!this.web3Service.walletConnected()) return;
    this.isCustomersLoading.set(true);
    forkJoin({
      customers: this.apiService.getCustomers(),
      groups: this.apiService.getCustomerGroups()
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers || []);
        this.customerGroups.set(res.groups || []);
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
      next: () => console.log('[Auth] Đã xóa phiên làm việc và cookie HttpOnly từ backend.'),
      error: (err) => console.warn('[Auth] Không thể xóa phiên làm việc phía backend:', err)
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
    }
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
        p.category?.category_name?.toLowerCase().includes(search)
      );
    }

    // Cập nhật tổng số sản phẩm sau khi lọc
    const totalItems = list.length;
    this.posTotalItems.set(totalItems);

    // Tính toán tổng số trang
    const limit = this.posItemsPerPage;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    this.posTotalPages.set(totalPages);

    // 3. Phân trang danh sách sản phẩm
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

  public async connectWalletAndSign() {
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;

      this.showToast('Vui lòng ký xác thực trên ví Metamask...', 'success');
      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          try {
            const signature = await this.web3Service.signMessage(res.message);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
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

                  // Chỉ redirect về dashboard nếu đang ở POS
                  if (this.router.url.includes('/pos')) {
                    this.router.navigate(['/dashboard']);
                  } else if (this.router.url.includes('/dashboard')) {
                    // Chỉ gọi refresh dashboard khi đang ở dashboard sẵn
                    this.refreshDashboard();
                  } else if (!this.router.url.includes('/settings')) {
                    // Chỉ reload tab nếu không phải trang settings (vì trang settings đã được nạp qua loadSettings() ở trên và có effect tự động đồng bộ)
                    this.reloadCurrentTab();
                  }
                }
              },
              error: (err) => {
                this.web3Service.disconnectWallet();
                this.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            this.web3Service.disconnectWallet();
            this.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
        }
      });
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
    }
  }
}
