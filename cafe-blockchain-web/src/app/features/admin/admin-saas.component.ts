import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent, TableColumn, TableCellDirective } from '@shared/components/table/table.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-saas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmModalComponent,
    CustomSelectComponent,
    CustomDatePickerComponent,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    TableComponent,
    TableCellDirective,
    ModalComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './admin-saas.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminSaaSComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Expose Math to template
  public readonly Math = Math;

  // Columns Tables
  public readonly tenantColumns: TableColumn[] = [
    { key: 'store_name', header: 'Cửa hàng', sortable: false, class: 'pl-6 whitespace-nowrap' },
    { key: 'wallet_address', header: 'Địa chỉ ví chủ quán', sortable: false, class: 'whitespace-nowrap font-mono text-xs' },
    { key: 'plan_code', header: 'Gói dịch vụ', sortable: false, class: 'whitespace-nowrap' },
    { key: 'subscription_expires_at', header: 'Ngày hết hạn', sortable: false, class: 'whitespace-nowrap font-medium' },
    { key: 'subscription_status', header: 'Trạng thái', sortable: false, class: 'whitespace-nowrap' },
    { key: 'created_at', header: 'Ngày đăng ký', sortable: false, class: 'whitespace-nowrap text-slate-500' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6 whitespace-nowrap', headerClass: 'text-right pr-6' }
  ];

  public readonly planColumns: TableColumn[] = [
    { key: 'code', header: 'Mã gói', sortable: false, class: 'pl-6 whitespace-nowrap font-mono text-xs' },
    { key: 'name', header: 'Tên gói cước', sortable: false, class: 'whitespace-nowrap font-bold' },
    { key: 'limits', header: 'Giới hạn (Sản phẩm / Nhân viên)', sortable: false, class: 'whitespace-nowrap' },
    { key: 'features', header: 'Tính năng hỗ trợ', sortable: false, class: 'whitespace-nowrap max-w-sm truncate' },
    { key: 'is_active', header: 'Trạng thái', sortable: false, class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6 whitespace-nowrap', headerClass: 'text-right pr-6' }
  ];

  // Tab: 'tenants' | 'plans' | 'system' | 'sysinfo'
  public readonly activeSubTab = signal<'tenants' | 'plans' | 'system' | 'sysinfo'>('tenants');

  public readonly subTabOptions: TabOption[] = [
    { value: 'tenants', label: 'Cửa hàng' },
    { value: 'plans', label: 'Gói cước' },
    { value: 'system', label: 'Hệ thống' },
    { value: 'sysinfo', label: 'Thông tin hệ thống' },
  ];

  // Trạng thái Loading và Dữ liệu
  public readonly isDataLoading = signal<boolean>(false);
  public readonly tenants = signal<any[]>([]);
  public readonly plans = signal<any[]>([]);
  public readonly tokenCleanupDays = signal<number>(7);

  public readonly searchQuery = signal<string>('');

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

  // Forms
  public subscriptionForm!: FormGroup;
  public readonly isSubscriptionModalOpen = signal<boolean>(false);
  public readonly selectedTenant = signal<any | null>(null);
  public readonly isSavingSubscription = signal<boolean>(false);

  public planForm!: FormGroup;
  public readonly isPlanModalOpen = signal<boolean>(false);
  public readonly editingPlan = signal<any | null>(null);
  public readonly isSavingPlan = signal<boolean>(false);

  // Settings
  public readonly isSavingSettings = signal<boolean>(false);

  // Modals xác nhận
  public readonly confirmDeletePlanData = signal<any | null>(null);
  public readonly isDeletingPlan = signal<boolean>(false);

  public readonly confirmCleanTokensOpen = signal<boolean>(false);
  public readonly isCleaningTokens = signal<boolean>(false);

  public readonly confirmCleanAllTokensOpen = signal<boolean>(false);
  public readonly isCleaningAllTokens = signal<boolean>(false);

  // Khôi phục gói mặc định
  public readonly confirmResetDefaultPlansOpen = signal<boolean>(false);
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
    return this.packages().filter(p => p.name.toLowerCase().includes(q));
  });

  public readonly paginatedPackages = computed(() => {
    const list = this.filteredPackages();
    const start = (this.packageCurrentPage() - 1) * this.packageItemsPerPage;
    return list.slice(start, start + this.packageItemsPerPage);
  });

  public readonly packageTotalPages = computed(() =>
    Math.ceil(this.filteredPackages().length / this.packageItemsPerPage)
  );

  // Select Options cho Gói cước
  public get planOptions() {
    return this.plans()
      .filter(p => p.is_active)
      .map(p => ({
        value: p.code,
        label: p.name
      }));
  }

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
    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter(t => {
        const storeNameClean = t.store_name ? this.removeSign(t.store_name.toLowerCase()) : '';
        const walletClean = t.wallet_address ? t.wallet_address.toLowerCase() : '';
        const planClean = t.plan_code ? t.plan_code.toLowerCase() : '';
        return storeNameClean.includes(searchClean) ||
          walletClean.includes(searchClean) ||
          planClean.includes(searchClean);
      });
    }
    return list;
  });

  ngOnInit() {
    this.initForms();

    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['tenants', 'plans', 'system', 'sysinfo'].includes(tab)) {
        this.activeSubTab.set(tab as any);
        if (tab === 'sysinfo' && !this.systemInfo()) {
          this.loadSysInfo();
        }
      }
    });

    if (this.stateService.isSuperAdmin()) {
      this.loadAllAdminData();
    }
  }

  private initForms() {
    this.subscriptionForm = this.fb.group({
      plan_code: ['free', [Validators.required]],
      subscription_expires_at: [null],
      subscription_status: ['active', [Validators.required]]
    });

    this.planForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]+$/)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      is_active: [true, [Validators.required]],
      features: this.fb.group({
        max_products: [20, [Validators.required]],
        max_staffs: [2, [Validators.required]],
        enable_storefront: [false, [Validators.required]],
        enable_reports: [false, [Validators.required]],
        enable_excel_export: [false, [Validators.required]]
      })
    });
  }

  public setSubTab(tab: 'tenants' | 'plans' | 'system' | 'sysinfo') {
    this.activeSubTab.set(tab);
    this.searchQuery.set('');
    this.tenantCurrentPage.set(1);
    this.planCurrentPage.set(1);

    // Lazy load sysinfo khi chuyển sang tab
    if (tab === 'sysinfo' && !this.systemInfo()) {
      this.loadSysInfo();
    }

    // Cập nhật query parameter tab trên URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  public onSearchQueryChange(query: string) {
    this.searchQuery.set(query);
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
      settings: settings$
    }).subscribe({
      next: (res) => {
        this.tenants.set(res.tenants || []);
        this.plans.set(res.plans || []);
        this.tenantCurrentPage.set(1);
        this.planCurrentPage.set(1);
        this.tokenCleanupDays.set(res.settings?.token_cleanup_days ?? 7);
        this.isDataLoading.set(false);
      },
      error: (err) => {
        console.error('[AdminSaaS] Lỗi tải dữ liệu quản trị:', err);
        this.stateService.showToast('Không thể lấy dữ liệu quản trị từ Laravel API.', 'error');
        this.isDataLoading.set(false);
      }
    });
  }

  // --- Quản lý Thuê bao Quán ---
  public openEditSubscription(tenant: any) {
    this.selectedTenant.set(tenant);

    // Format ngày hết hạn thành YYYY-MM-DD để input date hiển thị đúng
    let dateStr = null;
    if (tenant.subscription_expires_at) {
      dateStr = tenant.subscription_expires_at.split('T')[0];
    }

    this.subscriptionForm.patchValue({
      plan_code: tenant.plan_code || 'free',
      subscription_expires_at: dateStr,
      subscription_status: tenant.subscription_status || 'active'
    });
    this.isSubscriptionModalOpen.set(true);
  }

  public saveSubscription() {
    if (this.isSavingSubscription()) return;

    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const tenant = this.selectedTenant();
    if (!tenant) return;

    this.isSavingSubscription.set(true);
    const data = this.subscriptionForm.value;

    this.apiService.updateTenantSubscription(tenant.id, data).subscribe({
      next: () => {
        this.stateService.showToast('Cập nhật thuê bao quán thành công!', 'success');
        this.isSubscriptionModalOpen.set(false);
        this.loadAllAdminData();
        this.isSavingSubscription.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(errorMsg, 'error');
        this.isSavingSubscription.set(false);
      }
    });
  }

  // --- Quản lý Gói cước ---
  public openAddPlan() {
    this.editingPlan.set(null);
    this.planForm.reset();

    this.planForm.get('code')?.enable();
    this.planForm.patchValue({
      is_active: true,
      features: {
        max_products: 20,
        max_staffs: 2,
        enable_storefront: false,
        enable_reports: false,
        enable_excel_export: false
      }
    });
    this.isPlanModalOpen.set(true);
  }

  public openEditPlan(plan: any) {
    this.editingPlan.set(plan);
    this.planForm.reset();

    // Khóa mã gói khi sửa
    this.planForm.get('code')?.disable();

    this.planForm.patchValue({
      code: plan.code,
      name: plan.name,
      is_active: plan.is_active,
      features: {
        max_products: plan.features?.max_products ?? 20,
        max_staffs: plan.features?.max_staffs ?? 2,
        enable_storefront: !!plan.features?.enable_storefront,
        enable_reports: !!plan.features?.enable_reports,
        enable_excel_export: !!plan.features?.enable_excel_export
      }
    });
    this.isPlanModalOpen.set(true);
  }

  public savePlan() {
    if (this.isSavingPlan()) return;

    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    this.isSavingPlan.set(true);

    // Lấy value bao gồm cả disabled controls (như 'code' khi sửa)
    const data = this.planForm.getRawValue();
    const editing = this.editingPlan();

    const request = editing
      ? this.apiService.updateAdminPlan(editing.id, data)
      : this.apiService.createAdminPlan(data);

    request.subscribe({
      next: () => {
        this.stateService.showToast(
          editing ? 'Cập nhật gói cước thành công!' : 'Tạo gói cước mới thành công!',
          'success'
        );
        this.isPlanModalOpen.set(false);
        this.loadAllAdminData();
        this.isSavingPlan.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(errorMsg, 'error');
        this.isSavingPlan.set(false);
      }
    });
  }

  public triggerDeletePlan(plan: any) {
    this.confirmDeletePlanData.set(plan);
  }

  public onDeletePlanConfirm() {
    if (this.isDeletingPlan()) return;
    const plan = this.confirmDeletePlanData();
    if (!plan) return;

    this.isDeletingPlan.set(true);
    this.apiService.deleteAdminPlan(plan.id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa gói cước thành công!', 'success');
        this.confirmDeletePlanData.set(null);
        this.isDeletingPlan.set(false);
        this.loadAllAdminData();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Không thể xóa gói cước này.';
        this.stateService.showToast(errorMsg, 'error');
        this.confirmDeletePlanData.set(null);
        this.isDeletingPlan.set(false);
      }
    });
  }

  public triggerResetDefaultPlans() {
    this.confirmResetDefaultPlansOpen.set(true);
  }

  public onResetDefaultPlansConfirm() {
    if (this.isResettingDefaultPlans()) return;
    this.isResettingDefaultPlans.set(true);

    this.apiService.resetAdminDefaultPlans().subscribe({
      next: (res) => {
        this.stateService.showToast(res.message || 'Khôi phục gói mặc định thành công!', 'success');
        this.confirmResetDefaultPlansOpen.set(false);
        this.isResettingDefaultPlans.set(false);
        this.loadAllAdminData();
      },
      error: () => {
        this.stateService.showToast('Có lỗi xảy ra khi khôi phục gói mặc định.', 'error');
        this.confirmResetDefaultPlansOpen.set(false);
        this.isResettingDefaultPlans.set(false);
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
      }
    });
  }

  public confirmCleanTokens() {
    if (this.isCleaningTokens()) return;
    this.isCleaningTokens.set(true);

    this.apiService.cleanTokens().subscribe({
      next: (res) => {
        this.stateService.showToast(res.message || 'Dọn dẹp token thành công!', 'success');
        this.confirmCleanTokensOpen.set(false);
        this.isCleaningTokens.set(false);
      },
      error: (err) => {
        this.stateService.showToast('Lỗi khi dọn dẹp token hệ thống.', 'error');
        this.confirmCleanTokensOpen.set(false);
        this.isCleaningTokens.set(false);
      }
    });
  }

  public onCleanAllTokensConfirm() {
    if (this.isCleaningAllTokens()) return;
    this.isCleaningAllTokens.set(true);

    this.apiService.cleanAllTokens().subscribe({
      next: (res) => {
        this.stateService.showToast(res.message || 'Xóa tất cả token thành công!', 'success');
        this.confirmCleanAllTokensOpen.set(false);
        this.isCleaningAllTokens.set(false);
        this.stateService.disconnectWalletAndClose('Tất cả token đã bị xóa. Vui lòng kết nối lại ví.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.stateService.showToast('Lỗi khi xóa tất cả token hệ thống.', 'error');
        this.confirmCleanAllTokensOpen.set(false);
        this.isCleaningAllTokens.set(false);
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
      }
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
      'optimize': () => this.apiService.adminMaintenanceOptimize(),
      'clear-optimize': () => this.apiService.adminMaintenanceClearOptimize(),
    };

    const call = apiMap[action];
    if (!call) { this.runningMaintenance.set(''); return; }

    call().subscribe({
      next: (res: any) => {
        this.stateService.showToast(res.message || 'Thao tác thành công!', 'success');
        this.runningMaintenance.set('');
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(msg, 'error');
        this.runningMaintenance.set('');
      }
    });
  }
}
