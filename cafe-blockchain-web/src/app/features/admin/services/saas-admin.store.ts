import { Injectable, inject, signal, computed, VERSION } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { environment } from '@environments/environment';
import { TabOption } from '@shared/components/tab-group/tab-group.component';
import { TableColumn } from '@shared/components/table/table.component';
import packageInfo from '../../../../../package.json';

@Injectable()
export class SaaSAdminStore {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);

  // --- STATE SIGNALS ---
  public readonly activeSubTab = signal<
    'config' | 'tenants' | 'plans' | 'maintenance' | 'info' | 'payment' | 'subscriptions' | 'staffs'
  >('config');

  // Loaded cache flags
  public readonly hasLoadedPayments = signal<boolean>(false);
  public readonly hasLoadedSubscriptions = signal<boolean>(false);
  public readonly hasLoadedStaffs = signal<boolean>(false);
  public readonly hasLoadedLogs = signal<boolean>(false);

  // General Loading & State
  public readonly isDataLoading = signal<boolean>(false);
  public readonly tenants = signal<any[]>([]);
  public readonly plans = signal<any[]>([]);
  public readonly tokenCleanupDays = signal<number>(7);
  public readonly turnstileEnabled = signal<boolean>(false);
  public readonly turnstileHasKey = signal<boolean>(false);
  public readonly isTogglingTurnstile = signal<boolean>(false);
  public readonly systemContactsList = signal<any[]>([]);
  public readonly newUserPromoEnabled = signal<boolean>(false);
  public readonly newUserPromoPlanCode = signal<string>('free');
  public readonly newUserPromoDurationDays = signal<number>(7);
  public readonly isSavingPromoSettings = signal<boolean>(false);

  // Search & Filter (Tenants tab)
  public readonly searchQuery = signal<string>('');
  public readonly tenantPlanFilter = signal<string>('all');
  public readonly tenantStatusFilter = signal<string>('all');
  public readonly tenantCurrentPage = signal<number>(1);
  public readonly tenantItemsPerPage = 10;

  // Pagination (Plans tab)
  public readonly planCurrentPage = signal<number>(1);
  public readonly planItemsPerPage = 10;

  // Subscription Requests Signals
  public readonly subscriptionRequests = signal<any[]>([]);
  public readonly subscriptionTotal = signal<number>(0);
  public readonly subscriptionPage = signal<number>(1);
  public readonly subscriptionPerPage = signal<number>(10);
  public readonly subscriptionStatus = signal<string>('pending');
  public readonly subscriptionSearch = signal<string>('');
  public readonly isSubscriptionsLoading = signal<boolean>(false);
  public readonly isSubscriptionActionLoading = signal<boolean>(false);

  // System Staffs Signals
  public readonly systemStaffs = signal<any[]>([]);
  public readonly systemStaffsTotal = signal<number>(0);
  public readonly systemStaffsPage = signal<number>(1);
  public readonly systemStaffsPerPage = signal<number>(10);
  public readonly systemStaffsSearch = signal<string>('');
  public readonly isSystemStaffsLoading = signal<boolean>(false);
  public readonly isSystemStaffActionLoading = signal<boolean>(false);

  // System Payment Methods Signals
  public readonly systemPaymentMethods = signal<any[]>([]);
  public readonly systemPaymentTotal = signal<number>(0);
  public readonly systemPaymentPage = signal<number>(1);
  public readonly systemPaymentPerPage = signal<number>(10);
  public readonly systemPaymentSearch = signal<string>('');
  public readonly isSystemPaymentsLoading = signal<boolean>(false);
  public readonly isSystemPaymentActionLoading = signal<boolean>(false);

  // Settings Save State
  public readonly isSavingSettings = signal<boolean>(false);
  public readonly isSavingContacts = signal<boolean>(false);

  // Maintenance Loading States
  public readonly isDeletingPlan = signal<boolean>(false);
  public readonly isCleaningTokens = signal<boolean>(false);
  public readonly isCleaningAllTokens = signal<boolean>(false);
  public readonly isResettingDefaultPlans = signal<boolean>(false);
  public readonly runningMaintenance = signal<string>('');

  // System Info & Packages Signals
  public readonly systemInfo = signal<any | null>(null);
  public readonly composerPackages = signal<any[]>([]);
  public readonly npmPackages = signal<any[]>([]);
  public readonly packageType = signal<'composer' | 'npm'>('composer');
  public readonly isLoadingSysInfo = signal<boolean>(false);
  public readonly packageSearch = signal<string>('');
  public readonly packageCurrentPage = signal<number>(1);
  public readonly packageItemsPerPage = 15;
  public readonly webBuildSize = signal<string>('0.00 MB');

  // System Logs Signals
  public readonly systemLogs = signal<any[]>([]);
  public readonly logsLimit = signal<number>(100);
  public readonly logsLevelFilter = signal<string>('ALL');
  public readonly logSearchQuery = signal<string>('');
  public readonly isLoadingLogs = signal<boolean>(false);
  public readonly logSize = signal<string>('0 MB');

  // Window Sizes & Environment Information
  public readonly windowWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  public readonly windowHeight = signal<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
  public readonly angularVersion = VERSION.full;
  public readonly frontendEnv = environment;


  // --- COMPUTED SIGNALS ---
  public readonly subTabOptions = computed<TabOption[]>(() => {
    const role = this.stateService.currentUserAdminRole();
    if (role === 'staff') {
      return [
        { value: 'subscriptions', label: 'Thuê bao' },
        { value: 'tenants', label: 'Cửa hàng' },
      ];
    }
    if (role === 'admin') {
      return [
        { value: 'subscriptions', label: 'Thuê bao' },
        { value: 'tenants', label: 'Cửa hàng' },
        { value: 'staffs', label: 'Nhân viên hệ thống' },
        { value: 'payment', label: 'Thanh toán' },
        { value: 'info', label: 'Thông tin hệ thống' },
      ];
    }
    return [
      { value: 'config', label: 'Cấu hình thông tin hệ thống' },
      { value: 'tenants', label: 'Cửa hàng' },
      { value: 'plans', label: 'Gói cước' },
      { value: 'payment', label: 'Thanh toán' },
      { value: 'subscriptions', label: 'Thuê bao' },
      { value: 'staffs', label: 'Nhân viên hệ thống' },
      { value: 'maintenance', label: 'Bảo trì & Tối ưu' },
      { value: 'info', label: 'Thông tin hệ thống' },
    ];
  });

  public readonly staffSystemColumns = computed<TableColumn[]>(() => {
    const isSuperAdmin = this.stateService.isSuperAdmin();
    const base: TableColumn[] = [
      { key: 'wallet_address', header: 'Địa chỉ ví nhân viên', sortable: false, class: 'pl-6 font-mono text-sm whitespace-nowrap' },
      { key: 'name', header: 'Tên nhân viên', sortable: false, class: 'font-semibold text-slate-800 dark:text-white' },
      { key: 'role', header: 'Vai trò', sortable: false, class: 'whitespace-nowrap' },
      { key: 'is_active', header: 'Trạng thái', sortable: false },
      { key: 'created_at', header: 'Ngày tạo', sortable: false, class: 'whitespace-nowrap' },
    ];
    if (isSuperAdmin) {
      base.push({ key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6', headerClass: 'text-right pr-6' });
    }
    return base;
  });

  public readonly planFilterOptions = computed(() => {
    const list = this.plans().map((p) => ({
      value: p.code,
      label: p.name,
    }));
    return [{ value: 'all', label: 'Tất cả gói cước' }, ...list];
  });

  // Client-side pagination & filter for tenants
  public readonly filteredTenants = computed(() => {
    let list = this.tenants();

    const planFilter = this.tenantPlanFilter();
    if (planFilter !== 'all') {
      list = list.filter((t) => t.plan_code === planFilter);
    }

    const statusFilter = this.tenantStatusFilter();
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.subscription_status === statusFilter);
    }

    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter((t) => {
        const storeNameClean = t.store_name ? this.removeSign(t.store_name.toLowerCase()) : '';
        const walletClean = t.wallet_address ? t.wallet_address.toLowerCase() : '';
        const planClean = t.plan_code ? t.plan_code.toLowerCase() : '';
        return (
          storeNameClean.includes(searchClean) ||
          walletClean.includes(searchClean) ||
          planClean.includes(searchClean)
        );
      });
    }
    return list;
  });

  public readonly paginatedTenants = computed(() => {
    const list = this.filteredTenants();
    const startIndex = (this.tenantCurrentPage() - 1) * this.tenantItemsPerPage;
    return list.slice(startIndex, startIndex + this.tenantItemsPerPage);
  });

  public readonly paginatedPlans = computed(() => {
    const list = this.plans();
    const startIndex = (this.planCurrentPage() - 1) * this.planItemsPerPage;
    return list.slice(startIndex, startIndex + this.planItemsPerPage);
  });

  // Packages computed logic
  public readonly packages = computed(() => {
    return this.packageType() === 'composer' ? this.composerPackages() : this.npmPackages();
  });

  public readonly filteredPackages = computed(() => {
    const q = this.packageSearch().trim().toLowerCase();
    if (!q) return this.packages();
    return this.packages().filter((p) => p.name.toLowerCase().includes(q));
  });

  public readonly paginatedPackages = computed(() => {
    const list = this.filteredPackages();
    const start = (this.packageCurrentPage() - 1) * this.packageItemsPerPage;
    return list.slice(start, start + this.packageItemsPerPage);
  });

  public readonly packageTotalPages = computed(() =>
    Math.ceil(this.filteredPackages().length / this.packageItemsPerPage),
  );

  // Client info computed logic
  public readonly clientInfo = computed(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        browser: 'Server Side Rendering',
        os: 'Server',
        screenResolution: 'N/A',
        language: 'N/A',
        userAgent: 'N/A'
      };
    }

    const ua = navigator.userAgent;
    let browser = 'Không xác định';
    if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome')) browser = 'Google Chrome';
    else if (ua.includes('Safari')) browser = 'Apple Safari';

    let os = 'Không xác định';
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('like Mac')) os = 'iOS';

    return {
      browser,
      os,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      userAgent: ua
    };
  });

  constructor() {
    // Nạp npm packages từ package.json khi khởi tạo Store
    const npmPkgs: any[] = [];
    if (packageInfo && (packageInfo as any).dependencies) {
      Object.entries((packageInfo as any).dependencies).forEach(([name, version]) => {
        npmPkgs.push({
          name,
          version: version as string,
          require: [],
        });
      });
    }
    if (packageInfo && (packageInfo as any).devDependencies) {
      Object.entries((packageInfo as any).devDependencies).forEach(([name, version]) => {
        npmPkgs.push({
          name,
          version: version as string,
          require: [],
        });
      });
    }
    this.npmPackages.set(npmPkgs);
  }

  // --- API ACTIONS / LOAD METHODS ---

  // Load toàn bộ dữ liệu quản trị cơ bản (Super Admin)
  public loadAllAdminData(force = false) {
    if (this.tenants().length > 0 && this.plans().length > 0 && !force) return;

    this.isDataLoading.set(true);
    const tenants$ = this.apiService.getAdminTenants();
    const plans$ = this.apiService.getAdminPlans();
    const settings$ = this.apiService.getAdminSystemSettings();

    forkJoin({
      tenants: tenants$,
      plans: plans$,
      settings: settings$,
    }).subscribe({
      next: (res) => {
        this.tenants.set(res.tenants || []);
        this.plans.set(res.plans || []);
        this.tenantCurrentPage.set(1);
        this.planCurrentPage.set(1);
        this.tokenCleanupDays.set(res.settings?.token_cleanup_days ?? 7);
        this.turnstileEnabled.set(res.settings?.turnstile_enabled ?? false);
        this.turnstileHasKey.set(res.settings?.turnstile_has_key ?? false);
        this.systemContactsList.set(res.settings?.system_contacts || []);
        this.newUserPromoEnabled.set(res.settings?.new_user_promo_enabled ?? false);
        this.newUserPromoPlanCode.set(res.settings?.new_user_promo_plan_code ?? 'free');
        this.newUserPromoDurationDays.set(res.settings?.new_user_promo_duration_days ?? 7);
        this.isDataLoading.set(false);
      },
      error: (err) => {
        console.error('[SaaSAdminStore] Lỗi tải dữ liệu quản trị:', err);
        this.stateService.showToast('Không thể lấy dữ liệu quản trị từ Laravel API.', 'error');
        this.isDataLoading.set(false);
      },
    });
  }

  // Load dữ liệu quản trị cho Staff
  public loadStaffAdminData(force = false) {
    if (this.tenants().length > 0 && this.plans().length > 0 && !force) return;

    this.isDataLoading.set(true);
    forkJoin({
      tenants: this.apiService.getAdminTenants(),
      plans: this.apiService.getPublicPlans(),
    }).subscribe({
      next: (res) => {
        this.tenants.set(res.tenants || []);
        this.plans.set(res.plans || []);
        this.tenantCurrentPage.set(1);
        this.isDataLoading.set(false);
        this.triggerTabLoad(this.activeSubTab());
      },
      error: (err) => {
        console.error('[SaaSAdminStore] Lỗi tải dữ liệu cho Staff:', err);
        this.stateService.showToast('Không thể lấy dữ liệu cửa hàng từ API.', 'error');
        this.isDataLoading.set(false);
      },
    });
  }

  // Tải thông tin hệ thống & packages (tab Info)
  public loadSysInfo(force = false) {
    if (this.systemInfo() && !force) return;
    if (this.isLoadingSysInfo()) return;
    this.isLoadingSysInfo.set(true);

    forkJoin({
      info: this.apiService.getAdminSystemInfo(),
      pkgs: this.apiService.getAdminPackages(),
      webBuild: this.apiService.getWebBuildSize().pipe(catchError(() => of(null)))
    }).subscribe({
      next: (res) => {
        this.systemInfo.set(res.info);
        this.composerPackages.set(res.pkgs?.packages ?? []);

        if (res.webBuild && res.webBuild.size) {
          this.webBuildSize.set(res.webBuild.size);
        } else {
          const backendSize = res.info?.system_env?.web_build_size;
          if (backendSize && backendSize !== 'N/A (Deploy độc lập)') {
            this.webBuildSize.set(backendSize);
          } else {
            this.webBuildSize.set('0.00 MB');
          }
        }

        this.packageCurrentPage.set(1);
        this.isLoadingSysInfo.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể tải thông tin hệ thống.', 'error');
        this.isLoadingSysInfo.set(false);
      },
    });
  }

  // Tải Logs hệ thống (tab Maintenance)
  public loadSystemLogs() {
    this.isLoadingLogs.set(true);
    this.apiService.getAdminSystemLogs({
      limit: this.logsLimit(),
      level: this.logsLevelFilter(),
      search: this.logSearchQuery(),
    }).subscribe({
      next: (res) => {
        if (res) {
          this.systemLogs.set(res.logs || []);
          this.logSize.set(res.log_size || '0 MB');
          this.hasLoadedLogs.set(true);
        }
        this.isLoadingLogs.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể tải nhật ký lỗi hệ thống.', 'error');
        this.isLoadingLogs.set(false);
      }
    });
  }

  // Tải danh sách phương thức thanh toán
  public loadSystemPaymentMethods(force = false) {
    if (this.hasLoadedPayments() && !force) return;

    this.isSystemPaymentsLoading.set(true);
    this.apiService
      .getAdminPaymentMethods({
        page: this.systemPaymentPage(),
        per_page: this.systemPaymentPerPage(),
        search: this.systemPaymentSearch(),
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.systemPaymentMethods.set(res.data || []);
            this.systemPaymentTotal.set(res.total || 0);
            this.hasLoadedPayments.set(true);
          }
          this.isSystemPaymentsLoading.set(false);
        },
        error: () => {
          this.stateService.showToast('Không thể tải danh sách phương thức thanh toán!', 'error');
          this.isSystemPaymentsLoading.set(false);
        },
      });
  }

  // Tải danh sách yêu cầu nâng cấp gói (Subscriptions)
  public loadSubscriptionRequests(force = false) {
    if (this.hasLoadedSubscriptions() && !force) return;

    this.isSubscriptionsLoading.set(true);
    this.apiService.getAdminSubscriptionRequests({
      status: this.subscriptionStatus() === 'all' ? undefined : this.subscriptionStatus(),
      search: this.subscriptionSearch(),
      page: this.subscriptionPage(),
      per_page: this.subscriptionPerPage()
    }).subscribe({
      next: (res) => {
        if (res) {
          this.subscriptionRequests.set(res.data || []);
          this.subscriptionTotal.set(res.total || 0);
          this.hasLoadedSubscriptions.set(true);
        }
        this.isSubscriptionsLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể tải danh sách yêu cầu thuê bao!', 'error');
        this.isSubscriptionsLoading.set(false);
      }
    });
  }

  // Tải danh sách nhân viên hệ thống (Staffs)
  public loadSystemStaffs(force = false) {
    if (this.hasLoadedStaffs() && !force) return;

    this.isSystemStaffsLoading.set(true);
    this.apiService.getAdminSystemStaffs({
      page: this.systemStaffsPage(),
      per_page: this.systemStaffsPerPage(),
      search: this.systemStaffsSearch()
    }).subscribe({
      next: (res) => {
        this.systemStaffs.set(res.data || []);
        this.systemStaffsTotal.set(res.total || 0);
        this.hasLoadedStaffs.set(true);
        this.isSystemStaffsLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể tải danh sách nhân viên hệ thống.', 'error');
        this.isSystemStaffsLoading.set(false);
      }
    });
  }

  // Hàm trigger nạp dữ liệu tab thông minh (Cache Check)
  public triggerTabLoad(tab: string) {
    const isSuperAdmin = this.stateService.isSuperAdmin();
    const role = this.stateService.currentUserAdminRole();

    if (tab === 'info') {
      this.loadSysInfo();
    }
    if (tab === 'maintenance' && !this.hasLoadedLogs()) {
      this.loadSystemLogs();
    }
    if (tab === 'payment' && !this.hasLoadedPayments()) {
      this.loadSystemPaymentMethods();
    }
    if (tab === 'subscriptions' && !this.hasLoadedSubscriptions()) {
      this.loadSubscriptionRequests();
    }
    if (tab === 'staffs' && (isSuperAdmin || role === 'admin') && !this.hasLoadedStaffs()) {
      this.loadSystemStaffs();
    }
  }

  // --- TĨNH & CẤU HÌNH CHO LOGS / PACKAGES ---
  public readonly packageTabOptions: TabOption[] = [
    { value: 'composer', label: 'Backend (Composer)' },
    { value: 'npm', label: 'Frontend (NPM)' },
  ];

  public readonly logsLimitOptions = [
    { value: 50, label: '50 dòng' },
    { value: 100, label: '100 dòng' },
    { value: 200, label: '200 dòng' },
    { value: 500, label: '500 dòng' }
  ];

  public readonly logsLevelOptions = [
    { value: 'ALL', label: 'Tất cả cấp độ' },
    { value: 'INFO', label: 'INFO' },
    { value: 'WARNING', label: 'WARNING' },
    { value: 'ERROR', label: 'ERROR' },
    { value: 'CRITICAL', label: 'CRITICAL' },
    { value: 'ALERT', label: 'ALERT' },
    { value: 'EMERGENCY', label: 'EMERGENCY' },
    { value: 'DEBUG', label: 'DEBUG' }
  ];

  public onLogsLimitChange(limit: any) {
    this.logsLimit.set(Number(limit));
    this.loadSystemLogs();
  }

  public onLogsLevelChange(level: string) {
    this.logsLevelFilter.set(level);
    this.loadSystemLogs();
  }

  public onLogsSearchChange(search: string) {
    this.logSearchQuery.set(search);
    this.loadSystemLogs();
  }

  public onPackageSearchChange(q: string) {
    this.packageSearch.set(q);
    this.packageCurrentPage.set(1);
  }

  public onPackageTypeChange(type: any) {
    this.packageType.set(type);
    this.packageCurrentPage.set(1);
  }

  public onTenantPlanFilterChange(val: string) {
    this.tenantPlanFilter.set(val);
    this.tenantCurrentPage.set(1);
  }

  public onTenantStatusFilterChange(val: string) {
    this.tenantStatusFilter.set(val);
    this.tenantCurrentPage.set(1);
  }

  public onSearchQueryChange(val: string) {
    this.searchQuery.set(val);
    this.tenantCurrentPage.set(1);
  }

  public onSystemPaymentSearchChange() {
    this.systemPaymentPage.set(1);
    this.loadSystemPaymentMethods(true);
  }

  public setSystemPaymentPage(page: number) {
    this.systemPaymentPage.set(page);
    this.loadSystemPaymentMethods(true);
  }

  // --- UTILS ---
  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
}
