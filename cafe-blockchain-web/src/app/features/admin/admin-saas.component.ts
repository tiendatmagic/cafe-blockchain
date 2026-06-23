import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalService } from '@core/services/modal.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TenantSubscriptionModalComponent } from './components/tenant-subscription-modal/tenant-subscription-modal.component';
import { SubscriptionPlanModalComponent } from './components/subscription-plan-modal/subscription-plan-modal.component';
import { PaymentFormModalComponent } from '../settings/components/payment-form-modal/payment-form-modal.component';
import { QrCodeModalComponent } from '../settings/components/qr-code-modal/qr-code-modal.component';
import { SubscriptionRequestDetailModalComponent } from './components/subscription-request-detail-modal/subscription-request-detail-modal.component';
import { SystemStaffModalComponent } from './components/system-staff-modal/system-staff-modal.component';
import { RejectSubscriptionModalComponent } from './components/reject-subscription-modal/reject-subscription-modal.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  TableComponent,
  TableCellDirective,
  TableColumn,
} from '@shared/components/table/table.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { CustomSearchInputComponent } from '@shared/components/custom-search-input/custom-search-input.component';
import { SaaSAdminStore } from './services/saas-admin.store';

@Component({
  selector: 'app-admin-saas',
  standalone: true,
  providers: [SaaSAdminStore], // Khởi tạo Store theo vòng đời của Component này
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
    CustomSearchInputComponent,
    PaginationComponent,
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
  public readonly store = inject(SaaSAdminStore);
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
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

  public readonly subscriptionColumns: TableColumn[] = [
    { key: 'store_name', header: 'Cửa hàng', sortable: false, class: 'pl-6 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200' },
    { key: 'current_plan', header: 'Thuê bao hiện tại', sortable: false, class: 'whitespace-nowrap' },
    { key: 'current_subscription_expires_at', header: 'Ngày hết hạn', sortable: false, class: 'whitespace-nowrap' },
    { key: 'plan_code', header: 'Gói dịch vụ', sortable: false, class: 'whitespace-nowrap font-bold' },
    { key: 'tx_hash', header: 'Mã giao dịch (TxHash)', sortable: false, class: 'font-mono text-xs max-w-[120px] truncate' },
    { key: 'status', header: 'Trạng thái', sortable: false, class: 'whitespace-nowrap' },
    { key: 'created_at', header: 'Ngày gửi', sortable: false, class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6 whitespace-nowrap', headerClass: 'text-right pr-6' }
  ];

  // Select Options cho Gói cước
  public get planOptions() {
    return this.store.plans()
      .filter((p) => p.is_active)
      .map((p) => ({
        value: p.code,
        label: p.name,
      }));
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      // Cập nhật kích thước màn hình sang store
      (this.store as any).windowWidth?.set(window.innerWidth);
      (this.store as any).windowHeight?.set(window.innerHeight);
    }
  }

  ngOnInit() {
    const role = this.stateService.currentUserAdminRole();
    const isStaff = role === 'staff';
    const isAdmin = role === 'admin';
    const allowedTabs = isStaff
      ? ['subscriptions', 'tenants']
      : isAdmin
        ? ['subscriptions', 'tenants', 'staffs', 'payment', 'info']
        : ['config', 'tenants', 'plans', 'maintenance', 'info', 'payment', 'subscriptions', 'staffs'];

    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab && allowedTabs.includes(tab)) {
        this.store.activeSubTab.set(tab as any);
        this.store.triggerTabLoad(tab);
      } else {
        const defaultTab = isStaff ? 'subscriptions' : isAdmin ? 'subscriptions' : 'config';
        this.store.activeSubTab.set(defaultTab);
        this.store.triggerTabLoad(defaultTab);
      }
    });

    if (this.stateService.isSuperAdmin()) {
      this.store.loadAllAdminData();
    } else {
      this.store.loadStaffAdminData();
    }
  }

  public setSubTab(tab: 'config' | 'tenants' | 'plans' | 'maintenance' | 'info' | 'payment' | 'subscriptions' | 'staffs') {
    this.store.activeSubTab.set(tab);
    this.store.triggerTabLoad(tab);

    // Cập nhật query parameter tab trên URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge',
    });
  }

  // Rút gọn ví
  public shortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
        this.store.loadAllAdminData(true);
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
        this.store.loadAllAdminData(true);
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
        this.store.loadAllAdminData(true);
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
        this.store.isDeletingPlan.set(true);
        this.apiService.deleteAdminPlan(plan.id).subscribe({
          next: () => {
            this.stateService.showToast('Xóa gói cước thành công!', 'success');
            this.store.isDeletingPlan.set(false);
            this.store.loadAllAdminData(true);
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Không thể xóa gói cước này.';
            this.stateService.showToast(errorMsg, 'error');
            this.store.isDeletingPlan.set(false);
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
        this.store.isResettingDefaultPlans.set(true);
        this.apiService.resetAdminDefaultPlans().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Khôi phục gói mặc định thành công!', 'success');
            this.store.isResettingDefaultPlans.set(false);
            this.store.loadAllAdminData(true);
          },
          error: () => {
            this.stateService.showToast('Có lỗi xảy ra khi khôi phục gói mặc định.', 'error');
            this.store.isResettingDefaultPlans.set(false);
          },
        });
      }
    });
  }

  // --- Cấu hình Dọn dẹp Token ---
  public saveSystemSettings() {
    if (this.store.isSavingSettings()) return;

    const days = this.store.tokenCleanupDays();
    if (days < 1 || days > 365) {
      this.stateService.showToast('Số ngày giữ lại token phải từ 1 đến 365 ngày.', 'error');
      return;
    }

    this.store.isSavingSettings.set(true);
    this.apiService.updateAdminSystemSettings({ token_cleanup_days: days }).subscribe({
      next: () => {
        this.stateService.showToast('Lưu cấu hình dọn dẹp hệ thống thành công!', 'success');
        this.store.isSavingSettings.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể lưu cấu hình dọn dẹp.', 'error');
        this.store.isSavingSettings.set(false);
      },
    });
  }

  // --- Cấu hình Ưu đãi Người mới ---
  public savePromoSettings() {
    if (this.store.isSavingPromoSettings()) return;

    this.store.isSavingPromoSettings.set(true);
    this.apiService
      .updateAdminSystemSettings({
        token_cleanup_days: this.store.tokenCleanupDays(),
        new_user_promo_enabled: this.store.newUserPromoEnabled(),
        new_user_promo_plan_code: this.store.newUserPromoPlanCode(),
        new_user_promo_duration_days: this.store.newUserPromoDurationDays(),
      })
      .subscribe({
        next: () => {
          this.stateService.showToast('Lưu cấu hình ưu đãi người mới thành công!', 'success');
          this.store.isSavingPromoSettings.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Không thể lưu cấu hình ưu đãi.';
          this.stateService.showToast(msg, 'error');
          this.store.isSavingPromoSettings.set(false);
        },
      });
  }

  public onPromoEnabledChange(enabled: boolean) {
    this.store.newUserPromoEnabled.set(enabled);
  }

  public onPromoPlanChange(planCode: string) {
    this.store.newUserPromoPlanCode.set(planCode);
  }

  public onPromoDurationChange(event: any) {
    const val = parseInt(event.target.value, 10) || 7;
    this.store.newUserPromoDurationDays.set(val);
  }

  // --- Bật/Tắt Cloudflare Turnstile ---
  public toggleTurnstile(enabled: boolean) {
    if (this.store.isTogglingTurnstile()) return;

    if (enabled && !this.store.turnstileHasKey()) {
      this.stateService.showToast(
        'Không thể bật Turnstile: Chưa cấu hình TURNSTILE_SECRET_KEY trong biến môi trường server.',
        'error',
      );
      return;
    }

    this.store.isTogglingTurnstile.set(true);
    this.apiService
      .updateAdminSystemSettings({
        token_cleanup_days: this.store.tokenCleanupDays(),
        turnstile_enabled: enabled,
      })
      .subscribe({
        next: () => {
          this.store.turnstileEnabled.set(enabled);
          this.stateService.showToast(
            enabled ? 'Đã bật Cloudflare Turnstile!' : 'Đã tắt Cloudflare Turnstile!',
            'success',
          );
          this.store.isTogglingTurnstile.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Không thể cập nhật cấu hình Turnstile.';
          this.stateService.showToast(msg, 'error');
          this.store.isTogglingTurnstile.set(false);
        },
      });
  }

  // --- Cấu hình Thông tin liên hệ ---
  public addContact() {
    this.store.systemContactsList.update((list) => [
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
    this.store.systemContactsList.update((list) => list.filter((_, i) => i !== index));
  }

  public saveSystemContacts() {
    if (this.store.isSavingContacts()) return;

    const contacts = this.store.systemContactsList();
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

    this.store.isSavingContacts.set(true);
    this.apiService
      .updateAdminSystemSettings({
        token_cleanup_days: this.store.tokenCleanupDays(),
        system_contacts: contacts,
      })
      .subscribe({
        next: () => {
          this.stateService.showToast('Lưu cấu hình thông tin hệ thống thành công!', 'success');
          this.store.isSavingContacts.set(false);
          this.stateService.systemContacts.set(contacts);
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_system_contacts', JSON.stringify(contacts));
          }
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Không thể lưu cấu hình thông tin hệ thống.';
          this.stateService.showToast(errorMsg, 'error');
          this.store.isSavingContacts.set(false);
        },
      });
  }

  public triggerCleanTokens() {
    this.modalService.confirm({
      title: 'Dọn dẹp Token hết hạn',
      description: `Bạn có chắc chắn muốn dọn dẹp các token Sanctum đã hết hạn không? Hệ thống sẽ xóa các token cũ hơn ${this.store.tokenCleanupDays()} ngày.`,
      confirmText: 'Dọn dẹp',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        if (this.store.isCleaningTokens()) return;
        this.store.isCleaningTokens.set(true);

        this.apiService.cleanTokens().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Dọn dẹp token thành công!', 'success');
            this.store.isCleaningTokens.set(false);
          },
          error: () => {
            this.stateService.showToast('Lỗi khi dọn dẹp token hệ thống.', 'error');
            this.store.isCleaningTokens.set(false);
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
        if (this.store.isCleaningAllTokens()) return;
        this.store.isCleaningAllTokens.set(true);

        this.apiService.cleanAllTokens().subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Xóa tất cả token thành công!', 'success');
            this.store.isCleaningAllTokens.set(false);
            this.stateService.disconnectWalletAndClose(
              'Tất cả token đã bị xóa. Vui lòng kết nối lại ví.',
            );
            this.router.navigate(['/']);
          },
          error: () => {
            this.stateService.showToast('Lỗi khi xóa tất cả token hệ thống.', 'error');
            this.store.isCleaningAllTokens.set(false);
          },
        });
      }
    });
  }

  // --- Maintenance ---
  public runMaintenance(action: string) {
    if (this.store.runningMaintenance()) return;
    this.store.runningMaintenance.set(action);

    const apiMap: Record<string, () => any> = {
      'clear-views': () => this.apiService.adminMaintenanceClearViews(),
      'clear-config': () => this.apiService.adminMaintenanceClearConfig(),
      'clear-routes': () => this.apiService.adminMaintenanceClearRoutes(),
      'clear-logs': () => this.apiService.adminMaintenanceClearLogs(),
      optimize: () => this.apiService.adminMaintenanceOptimize(),
      'clear-optimize': () => this.apiService.adminMaintenanceClearOptimize(),
      'clear-all': () => this.apiService.adminMaintenanceClearAll(),
    };

    const call = apiMap[action];
    if (!call) {
      this.store.runningMaintenance.set('');
      return;
    }

    call().subscribe({
      next: (res: any) => {
        this.stateService.showToast(res.message || 'Thao tác thành công!', 'success');
        this.store.runningMaintenance.set('');
        if (action === 'clear-logs') {
          this.store.loadSystemLogs();
        }
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(msg, 'error');
        this.store.runningMaintenance.set('');
      },
    });
  }

  // --- Quản lý Yêu cầu thuê bao (Subscriptions) ---
  public approveSubscription(item: any) {
    this.modalService.confirm({
      title: 'Phê duyệt yêu cầu nâng gói?',
      description: `Bạn có chắc chắn muốn duyệt yêu cầu nâng cấp lên gói "${item.plan_code.toUpperCase()}" (${item.duration_months} tháng) của ví chủ cửa hàng ${this.shortAddress(item.store_owner_address)}?`,
      confirmText: 'Phê duyệt',
      cancelText: 'Hủy'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.isSubscriptionActionLoading.set(true);
        this.apiService.approveAdminSubscription(item.id).subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Phê duyệt yêu cầu thành công!', 'success');
            this.store.isSubscriptionActionLoading.set(false);
            this.store.loadSubscriptionRequests(true);
            // Cập nhật lại danh sách cửa hàng
            this.apiService.getAdminTenants().subscribe(tenants => this.store.tenants.set(tenants));
          },
          error: (err) => {
            const msg = err.error?.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu.';
            this.stateService.showToast(msg, 'error');
            this.store.isSubscriptionActionLoading.set(false);
          }
        });
      }
    });
  }

  // --- Chi tiết yêu cầu thuê bao (Subscription Detail Modal) ---
  public openDetailModal(item: any) {
    this.modalService.open(SubscriptionRequestDetailModalComponent, {
      title: 'Chi tiết yêu cầu đăng ký thuê bao',
      size: '5xl',
      data: { item }
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.store.loadSubscriptionRequests(true);
        // Cập nhật lại danh sách cửa hàng
        this.apiService.getAdminTenants().subscribe(tenants => this.store.tenants.set(tenants));
      }
    });
  }

  public openRejectModal(item: any) {
    this.modalService.open(RejectSubscriptionModalComponent, {
      title: 'Từ chối yêu cầu nâng gói',
      size: 'md',
      data: { requestId: item.id }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.store.loadSubscriptionRequests(true);
        this.apiService.getAdminTenants().subscribe(tenants => this.store.tenants.set(tenants));
      }
    });
  }

  // --- Quản lý Nhân viên hệ thống (System Staffs) ---
  public openAddStaff() {
    this.modalService.open(SystemStaffModalComponent, {
      title: 'Thêm nhân viên hệ thống mới',
      size: 'md'
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.store.loadSystemStaffs(true);
      }
    });
  }

  public openEditStaff(staff: any) {
    this.modalService.open(SystemStaffModalComponent, {
      title: 'Chỉnh sửa nhân viên hệ thống',
      size: 'md',
      data: staff
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.store.loadSystemStaffs(true);
      }
    });
  }

  public deleteSystemStaff(item: any) {
    this.modalService.confirm({
      title: 'Xóa nhân viên hệ thống?',
      description: `Bạn có chắc chắn muốn xóa nhân viên "${item.name}" với địa chỉ ví ${this.shortAddress(item.wallet_address)} không?`,
      confirmText: 'Xác nhận xóa'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.isSystemStaffActionLoading.set(true);
        this.apiService.deleteAdminSystemStaff(item.id).subscribe({
          next: (res) => {
            this.stateService.showToast(res.message || 'Xóa nhân viên thành công.', 'success');
            this.store.isSystemStaffActionLoading.set(false);
            this.store.loadSystemStaffs(true);
          },
          error: (err) => {
            const msg = err.error?.message || 'Có lỗi xảy ra khi xóa nhân viên.';
            this.stateService.showToast(msg, 'error');
            this.store.isSystemStaffActionLoading.set(false);
          }
        });
      }
    });
  }

  // --- Quản lý Phương thức thanh toán Hệ thống (Super Admin) ---
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
        this.store.loadSystemPaymentMethods(true);
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
        this.store.loadSystemPaymentMethods(true);
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
    if (this.store.isSystemPaymentActionLoading()) return;
    this.store.isSystemPaymentActionLoading.set(true);

    this.apiService.deleteAdminPaymentMethod(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thành công!', 'success');
        this.store.isSystemPaymentActionLoading.set(false);
        this.store.loadSystemPaymentMethods(true);
      },
      error: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thất bại!', 'error');
        this.store.isSystemPaymentActionLoading.set(false);
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
