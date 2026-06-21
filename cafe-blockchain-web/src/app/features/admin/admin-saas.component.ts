import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalService } from '@core/services/modal.service';
import { TenantSubscriptionModalComponent } from './components/tenant-subscription-modal/tenant-subscription-modal.component';
import { SubscriptionPlanModalComponent } from './components/subscription-plan-modal/subscription-plan-modal.component';
import { PaymentFormModalComponent } from '../settings/components/payment-form-modal/payment-form-modal.component';
import { QrCodeModalComponent } from '../settings/components/qr-code-modal/qr-code-modal.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from '@shared/components/table/table.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { forkJoin } from 'rxjs';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

@Component({
  selector: 'app-admin-saas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CustomSelectComponent,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    TableComponent,
    TableCellDirective,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    CustomSwitchComponent,
    VNDCurrencyPipe,
  ],
  templateUrl: './admin-saas.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AdminSaaSComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalService);

  // Expose Math to template
  public readonly Math = Math;

  // Columns Tables
  public readonly tenantColumns: TableColumn[] = [
    { key: 'store_name', header: 'Cửa hàng', sortable: false, class: 'pl-6 whitespace-nowrap' },
    {
      key: 'wallet_address',
      header: 'Địa chỉ ví chủ quán',
      sortable: false,
      class: 'whitespace-nowrap font-mono text-xs',
    },
    { key: 'plan_code', header: 'Gói dịch vụ', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'subscription_expires_at',
      header: 'Ngày hết hạn',
      sortable: false,
      class: 'whitespace-nowrap font-medium',
    },
    {
      key: 'subscription_status',
      header: 'Trạng thái',
      sortable: false,
      class: 'whitespace-nowrap',
    },
    {
      key: 'created_at',
      header: 'Ngày đăng ký',
      sortable: false,
      class: 'whitespace-nowrap text-slate-500',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right pr-6 whitespace-nowrap',
      headerClass: 'text-right pr-6',
    },
  ];

  public readonly planColumns: TableColumn[] = [
    {
      key: 'code',
      header: 'Mã gói',
      sortable: false,
      class: 'pl-6 whitespace-nowrap font-mono text-xs',
    },
    { key: 'name', header: 'Tên gói cước', sortable: false, class: 'whitespace-nowrap font-bold' },
    { key: 'prices', header: 'Giá cước', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'limits',
      header: 'Giới hạn (Sản phẩm / Nhân viên)',
      sortable: false,
      class: 'whitespace-nowrap',
    },
    {
      key: 'features',
      header: 'Tính năng hỗ trợ',
      sortable: false,
      class: 'whitespace-nowrap max-w-sm truncate',
    },
    { key: 'is_active', header: 'Trạng thái', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right pr-6 whitespace-nowrap',
      headerClass: 'text-right pr-6',
    },
  ];

  // Tab: 'sysconfig' | 'tenants' | 'plans' | 'system' | 'sysinfo' | 'payment'
  public readonly activeSubTab = signal<
    'sysconfig' | 'tenants' | 'plans' | 'system' | 'sysinfo' | 'payment'
  >('sysconfig');

  public readonly subTabOptions: TabOption[] = [
    { value: 'sysconfig', label: 'Cấu hình thông tin hệ thống' },
    { value: 'tenants', label: 'Cửa hàng' },
    { value: 'plans', label: 'Gói cước' },
    { value: 'payment', label: 'Thanh toán' },
    { value: 'system', label: 'Hệ thống' },
    { value: 'sysinfo', label: 'Thông tin hệ thống' },
  ];

  // Cấu hình Phương thức thanh toán Hệ thống (Super Admin)
  public readonly paymentColumns: TableColumn[] = [
    {
      key: 'type',
      header: 'Loại',
      sortable: false,
      class: 'font-semibold text-slate-700 dark:text-slate-300 pl-6',
    },
    {
      key: 'name',
      header: 'Tên Ngân hàng / Ví',
      sortable: false,
      class: 'font-extrabold text-slate-800 dark:text-white',
    },
    {
      key: 'account_number',
      header: 'Số tài khoản / Số điện thoại',
      sortable: false,
      class: 'font-mono font-bold text-slate-700 dark:text-slate-300',
    },
    {
      key: 'account_holder',
      header: 'Chủ tài khoản',
      sortable: false,
      class: 'font-bold uppercase text-slate-700 dark:text-slate-300',
    },
    { key: 'is_active', header: 'Trạng thái', sortable: false },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right pr-6 whitespace-nowrap',
      headerClass: 'text-right pr-6',
    },
  ];

  public readonly systemPaymentMethods = signal<any[]>([]);
  public readonly systemPaymentTotal = signal<number>(0);
  public readonly systemPaymentPage = signal<number>(1);
  public readonly systemPaymentPerPage = signal<number>(10);
  public readonly systemPaymentSearch = signal<string>('');
  public readonly isSystemPaymentsLoading = signal<boolean>(false);
  public readonly isSystemPaymentActionLoading = signal<boolean>(false);

  public readonly systemContactsList = signal<any[]>([]);
  public readonly isSavingContacts = signal<boolean>(false);

  // Trạng thái Loading và Dữ liệu
  public readonly isDataLoading = signal<boolean>(false);
  public readonly tenants = signal<any[]>([]);
  public readonly plans = signal<any[]>([]);
  public readonly tokenCleanupDays = signal<number>(7);
  public readonly turnstileEnabled = signal<boolean>(false);
  public readonly turnstileHasKey = signal<boolean>(false);
  public readonly isTogglingTurnstile = signal<boolean>(false);

  public readonly searchQuery = signal<string>('');
  public readonly tenantPlanFilter = signal<string>('all');
  public readonly tenantStatusFilter = signal<string>('all');

  // Computed signal cho danh sách chọn bộ lọc gói cước (kết hợp các gói thực tế từ DB)
  public readonly planFilterOptions = computed(() => {
    const list = this.plans().map((p) => ({
      value: p.code,
      label: p.name,
    }));
    return [{ value: 'all', label: 'Tất cả gói cước' }, ...list];
  });

  // Phân trang
  public readonly tenantCurrentPage = signal<number>(1);
  public readonly tenantItemsPerPage = 10;
  public readonly planCurrentPage = signal<number>(1);
  public readonly planItemsPerPage = 10;

  // Computed signals phân trang Client-side
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

  // Settings
  public readonly isSavingSettings = signal<boolean>(false);

  // Trạng thái Loading của các tiến trình chạy ngầm
  public readonly isDeletingPlan = signal<boolean>(false);
  public readonly isCleaningTokens = signal<boolean>(false);
  public readonly isCleaningAllTokens = signal<boolean>(false);
  public readonly isResettingDefaultPlans = signal<boolean>(false);

  // System Info & Packages
  public readonly systemInfo = signal<any | null>(null);
  public readonly packages = signal<any[]>([]);
  public readonly isLoadingSysInfo = signal<boolean>(false);
  public readonly packageSearch = signal<string>('');
  public readonly packageCurrentPage = signal<number>(1);
  public readonly packageItemsPerPage = 15;

  // Maintenance
  public readonly runningMaintenance = signal<string>('');

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

  // Select Options cho Gói cước
  public get planOptions() {
    return this.plans()
      .filter((p) => p.is_active)
      .map((p) => ({
        value: p.code,
        label: p.name,
      }));
  }

  // Note: Các hàm ngày tháng phục vụ form modal đã được đóng gói trong các component modal động tương ứng

  // Khử dấu tiếng Việt
  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Lọc Tenants
  public readonly filteredTenants = computed(() => {
    let list = this.tenants();

    // 1. Lọc theo gói cước
    const planFilter = this.tenantPlanFilter();
    if (planFilter !== 'all') {
      list = list.filter((t) => t.plan_code === planFilter);
    }

    // 2. Lọc theo trạng thái
    const statusFilter = this.tenantStatusFilter();
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.subscription_status === statusFilter);
    }

    // 3. Lọc theo từ khóa tìm kiếm
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

  ngOnInit() {
    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab && ['sysconfig', 'tenants', 'plans', 'system', 'sysinfo', 'payment'].includes(tab)) {
        this.activeSubTab.set(tab as any);
        if (tab === 'sysinfo' && !this.systemInfo()) {
          this.loadSysInfo();
        }
        if (tab === 'payment') {
          this.loadSystemPaymentMethods();
        }
      }
    });

    if (this.stateService.isSuperAdmin()) {
      this.loadAllAdminData();
    }
  }

  public setSubTab(tab: 'sysconfig' | 'tenants' | 'plans' | 'system' | 'sysinfo' | 'payment') {
    this.activeSubTab.set(tab);
    this.searchQuery.set('');
    this.tenantPlanFilter.set('all');
    this.tenantStatusFilter.set('all');
    this.tenantCurrentPage.set(1);
    this.planCurrentPage.set(1);
    this.systemPaymentPage.set(1);
    this.systemPaymentSearch.set('');

    // Lazy load sysinfo khi chuyển sang tab
    if (tab === 'sysinfo' && !this.systemInfo()) {
      this.loadSysInfo();
    }

    if (tab === 'payment') {
      this.loadSystemPaymentMethods();
    }

    // Cập nhật query parameter tab trên URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge',
    });
  }

  public onSearchQueryChange(query: string) {
    this.searchQuery.set(query);
    this.tenantCurrentPage.set(1);
  }

  public onTenantPlanFilterChange(value: string) {
    this.tenantPlanFilter.set(value);
    this.tenantCurrentPage.set(1);
  }

  public onTenantStatusFilterChange(value: string) {
    this.tenantStatusFilter.set(value);
    this.tenantCurrentPage.set(1);
  }

  // Load toàn bộ dữ liệu quản trị
  public loadAllAdminData() {
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
        this.isDataLoading.set(false);
      },
      error: (err) => {
        console.error('[AdminSaaS] Lỗi tải dữ liệu quản trị:', err);
        this.stateService.showToast('Không thể lấy dữ liệu quản trị từ Laravel API.', 'error');
        this.isDataLoading.set(false);
      },
    });
  }

  // --- Quản lý Thuê bao Quán ---
  public openEditSubscription(tenant: any) {
    this.modalService.open(TenantSubscriptionModalComponent, {
      title: 'Thay đổi thông tin thuê bao',
      size: 'md',
      data: {
        tenant,
        planOptions: this.planOptions,
      }
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.loadAllAdminData();
      }
    });
  }

  // --- Quản lý Gói cước ---
  public openAddPlan() {
    this.modalService.open(SubscriptionPlanModalComponent, {
      title: 'Thêm gói cước mới',
      size: '5xl',
      data: { plan: null }
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.loadAllAdminData();
      }
    });
  }

  public openEditPlan(plan: any) {
    this.modalService.open(SubscriptionPlanModalComponent, {
      title: 'Cấu hình chi tiết gói cước',
      size: '5xl',
      data: { plan }
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.loadAllAdminData();
      }
    });
  }

  public triggerDeletePlan(plan: any) {
    this.modalService.confirm({
      title: 'Xóa gói cước',
      description: `Bạn có chắc chắn muốn xóa gói cước "${plan.name}" không? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa gói',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.isDeletingPlan.set(true);
        this.apiService.deleteAdminPlan(plan.id).subscribe({
          next: () => {
            this.stateService.showToast('Xóa gói cước thành công!', 'success');
            this.isDeletingPlan.set(false);
            this.loadAllAdminData();
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Không thể xóa gói cước này.';
            this.stateService.showToast(errorMsg, 'error');
            this.isDeletingPlan.set(false);
          },
        });
      }
    });
  }

  public triggerResetDefaultPlans() {
    this.modalService.confirm({
      title: 'Khôi phục gói mặc định',
      description: 'Bạn có chắc chắn muốn khôi phục các gói cước mặc định (free, pro, ultra) về trạng thái ban đầu? Các tùy chỉnh hiện tại của các gói này sẽ bị ghi đè.',
      confirmText: 'Khôi phục',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.isResettingDefaultPlans.set(true);
        this.apiService.resetAdminDefaultPlans().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Khôi phục gói mặc định thành công!', 'success');
            this.isResettingDefaultPlans.set(false);
            this.loadAllAdminData();
          },
          error: () => {
            this.stateService.showToast('Có lỗi xảy ra khi khôi phục gói mặc định.', 'error');
            this.isResettingDefaultPlans.set(false);
          },
        });
      }
    });
  }

  // --- Cấu hình Dọn dẹp Token ---
  public saveSystemSettings() {
    if (this.isSavingSettings()) return;

    const days = this.tokenCleanupDays();
    if (days < 1 || days > 365) {
      this.stateService.showToast('Số ngày giữ lại token phải từ 1 đến 365 ngày.', 'error');
      return;
    }

    this.isSavingSettings.set(true);
    this.apiService.updateAdminSystemSettings({ token_cleanup_days: days }).subscribe({
      next: () => {
        this.stateService.showToast('Lưu cấu hình dọn dẹp hệ thống thành công!', 'success');
        this.isSavingSettings.set(false);
      },
      error: (err) => {
        this.stateService.showToast('Không thể lưu cấu hình dọn dẹp.', 'error');
        this.isSavingSettings.set(false);
      },
    });
  }

  // --- Bật/Tắt Cloudflare Turnstile ---
  public toggleTurnstile(enabled: boolean) {
    if (this.isTogglingTurnstile()) return;

    if (enabled && !this.turnstileHasKey()) {
      this.stateService.showToast(
        'Không thể bật Turnstile: Chưa cấu hình TURNSTILE_SECRET_KEY trong biến môi trường server.',
        'error',
      );
      return;
    }

    this.isTogglingTurnstile.set(true);
    this.apiService
      .updateAdminSystemSettings({
        token_cleanup_days: this.tokenCleanupDays(),
        turnstile_enabled: enabled,
      })
      .subscribe({
        next: () => {
          this.turnstileEnabled.set(enabled);
          this.stateService.showToast(
            enabled ? 'Đã bật Cloudflare Turnstile!' : 'Đã tắt Cloudflare Turnstile!',
            'success',
          );
          this.isTogglingTurnstile.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Không thể cập nhật cấu hình Turnstile.';
          this.stateService.showToast(msg, 'error');
          this.isTogglingTurnstile.set(false);
        },
      });
  }

  // --- Cấu hình Thông tin liên hệ ---
  public addContact() {
    this.systemContactsList.update((list) => [
      ...list,
      {
        name: '',
        phone: '',
        email: '',
        zalo: '',
        facebook: '',
        telegram: '',
      },
    ]);
  }

  public removeContact(index: number) {
    this.systemContactsList.update((list) => list.filter((_, i) => i !== index));
  }

  public saveSystemContacts() {
    if (this.isSavingContacts()) return;

    const contacts = this.systemContactsList();
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      if (!c.name || !c.name.trim()) {
        this.stateService.showToast(`Liên hệ thứ ${i + 1}: Họ tên không được để trống.`, 'error');
        return;
      }
      if (!c.phone || !c.phone.trim()) {
        this.stateService.showToast(
          `Liên hệ thứ ${i + 1}: Số điện thoại không được để trống.`,
          'error',
        );
        return;
      }
      if (!/^[0-9]+$/.test(c.phone)) {
        this.stateService.showToast(
          `Liên hệ thứ ${i + 1}: Số điện thoại chỉ được chứa các ký số.`,
          'error',
        );
        return;
      }
    }

    this.isSavingContacts.set(true);
    this.apiService
      .updateAdminSystemSettings({
        token_cleanup_days: this.tokenCleanupDays(),
        system_contacts: contacts,
      })
      .subscribe({
        next: () => {
          this.stateService.showToast('Lưu cấu hình thông tin hệ thống thành công!', 'success');
          this.isSavingContacts.set(false);
          this.stateService.systemContacts.set(contacts);
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_system_contacts', JSON.stringify(contacts));
          }
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Không thể lưu cấu hình thông tin hệ thống.';
          this.stateService.showToast(errorMsg, 'error');
          this.isSavingContacts.set(false);
        },
      });
  }

  public triggerCleanTokens() {
    this.modalService.confirm({
      title: 'Dọn dẹp Token hết hạn',
      description: `Bạn có chắc chắn muốn dọn dẹp các token Sanctum đã hết hạn không? Hệ thống sẽ xóa các token cũ hơn ${this.tokenCleanupDays()} ngày.`,
      confirmText: 'Dọn dẹp',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        if (this.isCleaningTokens()) return;
        this.isCleaningTokens.set(true);

        this.apiService.cleanTokens().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Dọn dẹp token thành công!', 'success');
            this.isCleaningTokens.set(false);
          },
          error: (err) => {
            this.stateService.showToast('Lỗi khi dọn dẹp token hệ thống.', 'error');
            this.isCleaningTokens.set(false);
          },
        });
      }
    });
  }

  public triggerCleanAllTokens() {
    this.modalService.confirm({
      title: 'Xóa tất cả Token',
      description: 'CẢNH BÁO: Thao tác này sẽ đăng xuất TẤT CẢ người dùng và yêu cầu tất cả các quán/nhân viên đăng nhập lại bằng cách ký lại ví. Bạn có chắc chắn muốn tiếp tục không?',
      confirmText: 'Xóa tất cả',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        if (this.isCleaningAllTokens()) return;
        this.isCleaningAllTokens.set(true);

        this.apiService.cleanAllTokens().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Xóa tất cả token thành công!', 'success');
            this.isCleaningAllTokens.set(false);
            this.stateService.disconnectWalletAndClose(
              'Tất cả token đã bị xóa. Vui lòng kết nối lại ví.',
            );
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.stateService.showToast('Lỗi khi xóa tất cả token hệ thống.', 'error');
            this.isCleaningAllTokens.set(false);
          },
        });
      }
    });
  }

  // Rút gọn ví
  public shortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // --- System Info ---
  public loadSysInfo() {
    if (this.isLoadingSysInfo()) return;
    this.isLoadingSysInfo.set(true);

    forkJoin({
      info: this.apiService.getAdminSystemInfo(),
      pkgs: this.apiService.getAdminPackages(),
    }).subscribe({
      next: (res) => {
        this.systemInfo.set(res.info);
        this.packages.set(res.pkgs?.packages ?? []);
        this.packageCurrentPage.set(1);
        this.isLoadingSysInfo.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể tải thông tin hệ thống.', 'error');
        this.isLoadingSysInfo.set(false);
      },
    });
  }

  public onPackageSearchChange(q: string) {
    this.packageSearch.set(q);
    this.packageCurrentPage.set(1);
  }

  // --- Maintenance ---
  public runMaintenance(action: string) {
    if (this.runningMaintenance()) return;
    this.runningMaintenance.set(action);

    const apiMap: Record<string, () => any> = {
      'clear-views': () => this.apiService.adminMaintenanceClearViews(),
      'clear-config': () => this.apiService.adminMaintenanceClearConfig(),
      'clear-routes': () => this.apiService.adminMaintenanceClearRoutes(),
      'clear-logs': () => this.apiService.adminMaintenanceClearLogs(),
      optimize: () => this.apiService.adminMaintenanceOptimize(),
      'clear-optimize': () => this.apiService.adminMaintenanceClearOptimize(),
    };

    const call = apiMap[action];
    if (!call) {
      this.runningMaintenance.set('');
      return;
    }

    call().subscribe({
      next: (res: any) => {
        this.stateService.showToast(res.message || 'Thao tác thành công!', 'success');
        this.runningMaintenance.set('');
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(msg, 'error');
        this.runningMaintenance.set('');
      },
    });
  }

  // --- Quản lý Phương thức thanh toán Hệ thống (Super Admin) ---
  public loadSystemPaymentMethods(force = false) {
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
          }
          this.isSystemPaymentsLoading.set(false);
        },
        error: () => {
          this.stateService.showToast('Không thể tải danh sách phương thức thanh toán!', 'error');
          this.isSystemPaymentsLoading.set(false);
        },
      });
  }

  public onSystemPaymentSearchChange() {
    this.systemPaymentPage.set(1);
    this.loadSystemPaymentMethods(true);
  }

  public setSystemPaymentPage(page: number) {
    if (page < 1 || page > this.getSystemPaymentTotalPages()) return;
    this.systemPaymentPage.set(page);
    this.loadSystemPaymentMethods(true);
  }

  public getSystemPaymentTotalPages(): number {
    return Math.ceil(this.systemPaymentTotal() / this.systemPaymentPerPage()) || 1;
  }

  public getSystemPaymentPagesArray(): number[] {
    const total = this.getSystemPaymentTotalPages();
    const current = this.systemPaymentPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  public openAddSystemPaymentModal() {
    this.modalService.open(PaymentFormModalComponent, {
      title: 'Thêm phương thức hệ thống mới',
      size: 'md',
      data: {
        isEdit: false,
        isSystem: true,
        form: {
          type: 'bank',
          name: '',
          account_number: '',
          account_holder: '',
          bank_code: '',
          is_active: true,
        }
      }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.loadSystemPaymentMethods(true);
      }
    });
  }

  public openEditSystemPaymentModal(item: any) {
    this.modalService.open(PaymentFormModalComponent, {
      title: 'Chỉnh sửa phương thức hệ thống',
      size: 'md',
      data: {
        isEdit: true,
        isSystem: true,
        id: item.id,
        form: {
          type: item.type,
          name: item.name,
          account_number: item.account_number,
          account_holder: item.account_holder,
          bank_code: item.bank_code || '',
          is_active: item.is_active,
        }
      }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.loadSystemPaymentMethods(true);
      }
    });
  }

  public deleteSystemPaymentMethod(id: number) {
    this.modalService.confirm({
      title: 'Xóa phương thức thanh toán hệ thống?',
      description: 'Bạn có chắc chắn muốn xóa phương thức thanh toán này? Chủ quán sẽ không thể chuyển khoản nâng cấp qua tài khoản này nữa.',
      confirmText: 'Xác nhận xóa'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteSystemPaymentMethod(id);
      }
    });
  }

  public confirmDeleteSystemPaymentMethod(id: number) {
    if (this.isSystemPaymentActionLoading()) return;
    this.isSystemPaymentActionLoading.set(true);

    this.apiService.deleteAdminPaymentMethod(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thành công!', 'success');
        this.isSystemPaymentActionLoading.set(false);
        this.loadSystemPaymentMethods(true);
      },
      error: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thất bại!', 'error');
        this.isSystemPaymentActionLoading.set(false);
      },
    });
  }

  public showSystemQrCode(item: any) {
    this.modalService.open(QrCodeModalComponent, {
      title: 'Mã QR chuyển khoản',
      size: 'sm',
      data: {
        payment: item
      }
    });
  }
}
