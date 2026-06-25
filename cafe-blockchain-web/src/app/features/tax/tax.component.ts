import { Component, OnInit, inject, signal, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxService } from '@core/services/tax.service';
import { StateService } from '@core/services/state.service';
import { ToastService } from '@core/services/toast.service';
import { Web3Service } from '@core/services/web3.service';
import { ModalService } from '@core/services/modal.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { CreateTaxPeriodModalComponent } from './components/create-tax-period-modal/create-tax-period-modal.component';
import { TaxConfirmModalComponent } from './components/tax-confirm-modal/tax-confirm-modal.component';
import { TaxResultModalComponent } from './components/tax-result-modal/tax-result-modal.component';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    TabGroupComponent,
    IconComponent,
    ButtonComponent,
    CardComponent,
    VNDCurrencyPipe,
    CustomDatePickerComponent,
    CustomSwitchComponent,
    AccessRestrictedComponent,
    SkeletonLoaderComponent,
    Web3ConnectPromptComponent,
  ],
  templateUrl: './tax.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TaxComponent implements OnInit {
  public readonly taxService = inject(TaxService);
  public readonly Math = Math;
  public readonly stateService = inject(StateService);
  private readonly toastService = inject(ToastService);
  public readonly web3Service = inject(Web3Service);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Tab: 'logs' (Nhật ký kê khai) | 'declaration' (Kê khai thuế) | 'estimation' (Ước tính thuế)
  public readonly activeTab = signal<'logs' | 'declaration' | 'estimation'>('logs');

  public readonly tabOptions: TabOption[] = [
    { value: 'logs', label: 'Nhật ký kê khai' },
    { value: 'declaration', label: 'Kê khai thuế' },
    { value: 'estimation', label: 'Ước tính thuế' },
  ];

  // Estimate range states
  public readonly estimateStartDate = signal<string>('');
  public readonly estimateEndDate = signal<string>('');
  public readonly estimateResult = signal<any>(null);
  public readonly isEstimateLoading = signal<boolean>(false);

  // Periods list states
  public readonly periodsList = signal<any[]>([]);
  public readonly periodsCurrentPage = signal<number>(1);
  public readonly periodsTotalItems = signal<number>(0);
  public readonly periodsItemsPerPage = 10;
  public readonly isPeriodsLoading = signal<boolean>(false);

  // Locked logs list
  public readonly logsList = signal<any[]>([]);
  public readonly logsCurrentPage = signal<number>(1);
  public readonly logsTotalItems = signal<number>(0);
  public readonly isLogsLoading = signal<boolean>(false);

  // Create Period Modal
  public readonly isCreateModalOpen = signal<boolean>(false);
  public readonly newPeriodType = signal<'month' | 'quarter' | 'year'>('month');
  public readonly newPeriodValue = signal<number>(1);
  public readonly newPeriodYear = signal<number>(2026);

  public readonly monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));
  public readonly quarterOptions = [
    { value: 1, label: 'Quý 1 (T1 - T3)' },
    { value: 2, label: 'Quý 2 (T4 - T6)' },
    { value: 3, label: 'Quý 3 (T7 - T9)' },
    { value: 4, label: 'Quý 4 (T10 - T12)' },
  ];
  public readonly yearOptions = [2025, 2026, 2027, 2028].map(y => ({ value: y, label: `Năm ${y}` }));

  public readonly demoLogs = [
    {
      id: 'demo-1',
      category: 'Tờ khai thuế 01.TKN-CNKD',
      name: '',
      status: 'pending',
      statusLabel: 'Chưa gửi tờ khai TCT'
    },
    {
      id: 'demo-2',
      category: 'S1a - HKD',
      name: 'Sổ chi tiết doanh thu bán hàng hóa dịch vụ',
      status: 'saved',
      statusLabel: 'Đã lưu'
    }
  ];

  public readonly filterOptions = [
    { value: 'S2b - HKD', label: 'S2b - HKD' },
    { value: 'S2e - HKD', label: 'S2e - HKD' },
    { value: 'S2c - HKD', label: 'S2c - HKD' },
    { value: 'S2d - HKD', label: 'S2d - HKD' },
    { value: 'S1a - HKD', label: 'S1a - HKD' },
    { value: 'S2a - HKD', label: 'S2a - HKD' },
    { value: 'Tờ khai thuế', label: 'Tờ khai thuế' }
  ];

  public readonly isFilterDropdownOpen = signal<boolean>(false);
  public readonly tempSelectedFilters = signal<string[]>([]);
  public readonly activeSelectedFilters = signal<string[]>([]);
  public readonly activeRowMenuId = signal<string | null>(null);
  public readonly activePeriodMenuId = signal<string | null>(null);

  // Inline Survey states
  public readonly isSurveyMode = signal<boolean>(false);
  public readonly surveyStep = signal<number>(1);
  public readonly isSavingProfile = signal<boolean>(false);

  public readonly surveyForm = signal<any>({
    business_group: 1,
    is_seasonal: 'không',
    sales_channels: {
      ecommerce: false,
      foodapp: false,
      social: false
    },
    industry_type: 'production',
    is_multi_industry: false,
    industry_allocation: {
      distributor: 0,
      service: 0,
      production: 0,
      others: 0
    },
    tax_method: 'revenue_percent'
  });

  constructor() {
    // Đồng bộ form khi tải profile từ Backend
    effect(() => {
      const profile = this.taxService.taxProfile();
      if (profile && !this.isSurveyMode()) {
        this.surveyForm.set({
          business_group: profile.business_group || 1,
          is_seasonal: profile.is_seasonal || 'không',
          sales_channels: profile.sales_channels || {
            ecommerce: false,
            foodapp: false,
            social: false
          },
          industry_type: profile.industry_type || 'production',
          is_multi_industry: !!profile.is_multi_industry,
          industry_allocation: profile.industry_allocation || {
            distributor: 0,
            service: 0,
            production: 0,
            others: 0
          },
          tax_method: profile.tax_method || 'revenue_percent'
        });
      }
    });
  }

  ngOnInit() {
    // Set default dates for estimate (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.estimateStartDate.set(firstDay.toISOString().substring(0, 10));
    this.estimateEndDate.set(now.toISOString().substring(0, 10));

    this.newPeriodValue.set(now.getMonth() + 1);
    this.newPeriodYear.set(now.getFullYear());

    this.updateTabFromRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabFromRoute();
      this.loadInitialData();
    });

    if (this.web3Service.walletConnected()) {
      this.loadInitialData();
    }
  }

  private updateTabFromRoute() {
    const url = this.router.url;
    if (url.includes('/tax/logs')) {
      this.activeTab.set('logs');
    } else if (url.includes('/tax/declaration')) {
      this.activeTab.set('declaration');
    } else if (url.includes('/tax/estimation')) {
      this.activeTab.set('estimation');
    } else {
      this.activeTab.set('logs');
    }
  }

  public setTab(tab: 'logs' | 'declaration' | 'estimation') {
    this.router.navigate(['/tax', tab]);
  }

  public loadInitialData() {
    this.taxService.loadTaxProfile();
    const tab = this.activeTab();
    if (tab === 'logs') this.loadLogs();
    if (tab === 'declaration') this.loadPeriods();
    if (tab === 'estimation') this.getEstimate();
  }

  // Load all tax periods (both open and locked)
  public loadPeriods() {
    this.isPeriodsLoading.set(true);
    this.taxService.getTaxPeriods(this.periodsCurrentPage(), this.periodsItemsPerPage).subscribe({
      next: (res) => {
        this.periodsList.set(res.data || []);
        this.periodsTotalItems.set(res.total || 0);
        this.isPeriodsLoading.set(false);
      },
      error: () => {
        this.isPeriodsLoading.set(false);
      }
    });
  }

  // Load locked tax periods
  public loadLogs() {
    this.isLogsLoading.set(true);
    
    // Tải các kỳ kê khai đang mở để hiển thị nhật ký tương ứng
    this.taxService.getTaxPeriods(1, 100, 'open').subscribe({
      next: (res) => {
        this.periodsList.set(res.data || []);
      }
    });

    this.taxService.getTaxPeriods(this.logsCurrentPage(), this.periodsItemsPerPage, 'locked').subscribe({
      next: (res) => {
        this.logsList.set(res.data || []);
        this.logsTotalItems.set(res.total || 0);
        this.isLogsLoading.set(false);
      },
      error: () => {
        this.isLogsLoading.set(false);
      }
    });
  }

  public resetTaxProfile() {
    this.modalService.open(TaxConfirmModalComponent, {
      title: 'Xác nhận thiết lập lại',
      size: 'md',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.isSurveyMode.set(true);
        this.surveyStep.set(1);
      }
    });
  }

  // Survey action helpers
  public setSurveyField(field: string, value: any) {
    this.surveyForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  public toggleSalesChannel(channel: string) {
    this.surveyForm.update((form) => {
      const channels = { ...form.sales_channels, [channel]: !form.sales_channels[channel] };
      return { ...form, sales_channels: channels };
    });
  }

  public setAllocationField(industry: string, val: any) {
    this.surveyForm.update((form) => {
      const alloc = { ...form.industry_allocation, [industry]: Number(val) };
      return { ...form, industry_allocation: alloc };
    });
  }

  public nextStep() {
    if (this.surveyStep() === 1) {
      this.surveyStep.set(2);
    }
  }

  public prevStep() {
    this.surveyStep.set(1);
  }

  public cancelSurveyReset() {
    this.isSurveyMode.set(false);
    this.surveyStep.set(1);
  }

  public submitSurvey() {
    if (this.isSavingProfile()) return;

    const form = this.surveyForm();
    if (form.is_multi_industry) {
      const sum = Object.values(form.industry_allocation).reduce((s: any, v: any) => s + v, 0) as number;
      if (sum !== 100) {
        this.toastService.showToast('Tổng tỷ lệ phân bổ các ngành kinh doanh phải bằng 100%!', 'error');
        return;
      }
    }

    this.isSavingProfile.set(true);
    this.taxService.saveTaxProfile(form).subscribe({
      next: (res) => {
        this.toastService.showToast('Lập hồ sơ khảo sát thuế thành công!', 'success');
        this.taxService.taxProfile.set(res.profile);
        this.taxService.isProfileConfigured.set(true);
        this.isSurveyMode.set(false);
        this.isSavingProfile.set(false);

        // Show group results popup modal
        const groupNum = res.profile.business_group;
        let groupTitle = 'Bạn thuộc nhóm doanh thu dưới 1 tỷ';
        if (groupNum === 2) groupTitle = 'Bạn thuộc nhóm doanh thu 1 tỷ - 3 tỷ';
        if (groupNum === 3) groupTitle = 'Bạn thuộc nhóm doanh thu 3 tỷ - 50 tỷ';

        this.modalService.open(TaxResultModalComponent, {
          title: groupTitle,
          size: 'md',
          data: { group: groupNum }
        }).afterClosed$.subscribe(() => {
          this.setTab('declaration');
          this.loadInitialData();
        });
      },
      error: () => {
        this.isSavingProfile.set(false);
        this.toastService.showToast('Lưu hồ sơ thuế thất bại!', 'error');
      }
    });
  }

  // Get estimations
  public getEstimate() {
    const start = this.estimateStartDate();
    const end = this.estimateEndDate();
    if (!start || !end) return;

    this.isEstimateLoading.set(true);
    this.taxService.getTaxEstimate(start, end).subscribe({
      next: (res) => {
        this.estimateResult.set(res);
        this.isEstimateLoading.set(false);
      },
      error: () => {
        this.isEstimateLoading.set(false);
      }
    });
  }

  // Action methods for periods
  public createPeriod() {
    this.modalService.open(CreateTaxPeriodModalComponent, {
      title: 'Tạo kỳ kê khai mới',
      size: 'md',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.loadPeriods();
      }
    });
  }

  public lockPeriod(id: string) {
    this.modalService.confirm({
      title: 'Khóa sổ kỳ kê khai thuế',
      description: 'Khóa sổ kỳ kê khai sẽ cố định toàn bộ số liệu doanh thu, chi phí và thuế ước tính của khoảng thời gian đó. Bạn không thể hoàn tác tác vụ này. Bạn có chắc chắn muốn khóa sổ?',
      confirmText: 'Khóa sổ',
      cancelText: 'Hủy',
      confirmButtonClass: '!bg-rose-600 hover:!bg-rose-700 text-white'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.taxService.lockTaxPeriod(id).subscribe({
          next: () => {
            this.toastService.showToast('Khóa sổ kỳ kế toán thuế thành công!', 'success');
            this.loadPeriods();
            this.loadLogs();
          },
          error: () => {
            this.toastService.showToast('Khóa sổ thất bại!', 'error');
          }
        });
      }
    });
  }

  public deletePeriod(id: string) {
    this.modalService.confirm({
      title: 'Xóa kỳ kê khai thuế',
      description: 'Bạn có chắc chắn muốn xóa kỳ kê khai đang mở này? Các số liệu giao dịch gốc vẫn được giữ nguyên.',
      confirmText: 'Xóa kỳ',
      cancelText: 'Hủy',
      confirmButtonClass: '!bg-rose-600 hover:!bg-rose-700 text-white'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.taxService.destroyTaxPeriod(id).subscribe({
          next: () => {
            this.toastService.showToast('Xóa kỳ kê khai thành công!', 'success');
            this.loadPeriods();
          },
          error: () => {
            this.toastService.showToast('Xóa kỳ kê khai thất bại!', 'error');
          }
        });
      }
    });
  }

  public getFormattedLogs(): any[] {
    const lockedList = this.logsList() || [];
    const openList = this.periodsList() || [];
    
    let allLogs: any[] = [];
    
    if (lockedList.length === 0 && openList.length === 0) {
      allLogs = [...this.demoLogs];
    } else {
      // 1. Duyệt qua các kỳ đã khóa
      lockedList.forEach((item) => {
        const periodName = this.getPeriodName(item);
        allLogs.push({
          id: `real-declaration-locked-${item.id}`,
          category: 'Tờ khai thuế 01.TKN-CNKD',
          name: `Tờ khai thuế của kỳ ${periodName}`,
          status: item.is_submitted ? 'saved' : 'pending',
          statusLabel: item.is_submitted ? 'Đã gửi TCT' : 'Chưa gửi tờ khai TCT'
        });
        allLogs.push({
          id: `real-s1a-locked-${item.id}`,
          category: 'S1a - HKD',
          name: `Sổ chi tiết doanh thu bán hàng hóa dịch vụ kỳ ${periodName}`,
          status: 'saved',
          statusLabel: 'Đã lưu'
        });
      });

      // 2. Duyệt qua các kỳ đang mở
      openList.forEach((item) => {
        const periodName = this.getPeriodName(item);
        allLogs.push({
          id: `real-declaration-open-${item.id}`,
          category: 'Tờ khai thuế 01.TKN-CNKD',
          name: `Tờ khai thuế của kỳ ${periodName} (Đang mở)`,
          status: 'pending',
          statusLabel: 'Chưa gửi tờ khai TCT'
        });
        allLogs.push({
          id: `real-s1a-open-${item.id}`,
          category: 'S1a - HKD',
          name: `Sổ chi tiết doanh thu bán hàng hóa dịch vụ kỳ ${periodName} (Đang mở)`,
          status: 'saved',
          statusLabel: 'Đã lưu'
        });
      });
    }

    const activeFilters = this.activeSelectedFilters();
    if (activeFilters.length === 0) return allLogs;

    return allLogs.filter(log => {
      if (activeFilters.includes('Tờ khai thuế') && log.category.includes('Tờ khai thuế')) {
        return true;
      }
      return activeFilters.includes(log.category);
    });
  }

  public toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    this.isFilterDropdownOpen.update(v => !v);
    if (this.isFilterDropdownOpen()) {
      this.tempSelectedFilters.set([...this.activeSelectedFilters()]);
    }
  }

  public toggleTempFilter(val: string) {
    this.tempSelectedFilters.update(current => {
      if (current.includes(val)) {
        return current.filter(v => v !== val);
      } else {
        return [...current, val];
      }
    });
  }

  public resetTempFilters() {
    this.tempSelectedFilters.set([]);
  }

  public applyFilters() {
    this.activeSelectedFilters.set([...this.tempSelectedFilters()]);
    this.isFilterDropdownOpen.set(false);
  }

  public removeActiveFilter(val: string) {
    this.activeSelectedFilters.update(current => current.filter(v => v !== val));
  }

  public clearAllFilters() {
    this.activeSelectedFilters.set([]);
    this.tempSelectedFilters.set([]);
  }

  public getFilterLabel(val: string): string {
    return this.filterOptions.find(o => o.value === val)?.label || val;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutsideDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container')) {
      this.isFilterDropdownOpen.set(false);
    }
    if (!target.closest('.row-menu-container')) {
      this.activeRowMenuId.set(null);
    }
    if (!target.closest('.period-menu-container')) {
      this.activePeriodMenuId.set(null);
    }
  }

  public lockLatestOpenPeriod() {
    const openPeriods = this.periodsList().filter(p => p.status === 'open');
    if (openPeriods.length === 0) {
      this.toastService.showToast('Không có kỳ kê khai nào đang mở để khóa sổ!', 'error');
      return;
    }
    this.lockPeriod(openPeriods[0].id);
  }

  public togglePeriodMenu(id: string, event: Event) {
    event.stopPropagation();
    this.activePeriodMenuId.update(current => current === id ? null : id);
  }

  public closePeriodMenu() {
    this.activePeriodMenuId.set(null);
  }

  public getActiveSelectedFiltersLabel(): string {
    return this.activeSelectedFilters().map(val => this.getFilterLabel(val)).join(', ');
  }

  public toggleRowMenu(id: string, event: Event) {
    event.stopPropagation();
    this.activeRowMenuId.update(current => current === id ? null : id);
  }

  public closeRowMenu() {
    this.activeRowMenuId.set(null);
  }

  public downloadLogExcel(row: any) {
    this.toastService.showToast(`Bắt đầu tải file Excel cho ${row.category} (${row.name || 'Tờ khai'})`, 'success');
  }

  // Page index helper
  public getPeriodName(row: any): string {
    if (row.period_type === 'month') {
      return `Tháng ${row.period_value}/${row.period_year}`;
    }
    if (row.period_type === 'quarter') {
      return `Quý ${row.period_value}/${row.period_year}`;
    }
    return `Năm ${row.period_year}`;
  }

  public getIndustryLabel(type: string): string {
    switch (type) {
      case 'distributor':
        return 'Phân phối, cung cấp hàng hóa';
      case 'service':
        return 'Dịch vụ, XD không NVL';
      case 'production':
        return 'SX, vận tải, XD có NVL';
      case 'others':
        return 'Hoạt động KD khác';
      default:
        return type;
    }
  }

  public getBusinessGroupLabel(group: number): string {
    switch (group) {
      case 1: return 'Dưới 1 tỷ/năm';
      case 2: return '1 tỷ - 3 tỷ/năm';
      case 3: return '3 tỷ - 50 tỷ/năm';
      default: return `Nhóm ${group}`;
    }
  }

  public changePeriodsPage(page: number) {
    this.periodsCurrentPage.set(page);
    this.loadPeriods();
  }

  public changeLogsPage(page: number) {
    this.logsCurrentPage.set(page);
    this.loadLogs();
  }
}
