import { Component, OnInit, inject, signal, computed, effect, HostListener, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
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
import { TaxDetailModalComponent } from './components/tax-detail-modal/tax-detail-modal.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';

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
    CustomCheckboxComponent,
    AccessRestrictedComponent,
    SkeletonLoaderComponent,
    Web3ConnectPromptComponent,
    PaginationComponent
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

  // Estimate range states (Đọc/ghi qua TaxService để giữ trạng thái khi chuyển route)
  public get estimateStartDate() { return this.taxService.estimateStartDate; }
  public get estimateEndDate() { return this.taxService.estimateEndDate; }
  public get estimateResult() { return this.taxService.estimateResult; }
  public readonly isEstimateLoading = signal<boolean>(false);

  // Periods list states
  public get periodsList() { return this.taxService.periodsList; }
  public get openPeriodsList() { return this.taxService.openPeriodsList; }
  public readonly periodsCurrentPage = signal<number>(1);
  public get periodsTotalItems() { return this.taxService.periodsTotalItems; }
  public readonly periodsItemsPerPage = 10;
  public readonly isPeriodsLoading = signal<boolean>(false);

  // Loaded states for soft caching
  public get isLogsLoaded() { return this.taxService.isLogsLoaded; }
  public get isPeriodsLoaded() { return this.taxService.isPeriodsLoaded; }
  public get isEstimateLoaded() { return this.taxService.isEstimateLoaded; }

  // Locked logs list
  public get logsList() { return this.taxService.logsList; }
  public readonly logsCurrentPage = signal<number>(1);
  public get logsTotalItems() { return this.taxService.logsTotalItems; }
  public readonly isLogsLoading = signal<boolean>(false);
  public readonly totalLogsPages = computed(() => Math.max(1, Math.ceil(this.logsTotalItems() / this.periodsItemsPerPage)));
  public readonly totalPeriodsPages = computed(() => Math.max(1, Math.ceil(this.periodsTotalItems() / this.periodsItemsPerPage)));

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
    { value: 'S2a - HKD', label: 'S2a - HKD' },
    { value: 'S1a - HKD', label: 'S1a - HKD' },
    { value: 'Tờ khai thuế', label: 'Tờ khai thuế' }
  ];

  public readonly isFilterDropdownOpen = signal<boolean>(false);
  public readonly tempSelectedFilters = signal<string[]>(['Tờ khai thuế', 'S1a - HKD']);
  public readonly activeSelectedFilters = signal<string[]>(['Tờ khai thuế', 'S1a - HKD']);

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

    // Lắng nghe tab và ví kết nối để tải dữ liệu, triệt tiêu gọi trùng lặp API
    effect(() => {
      const connected = this.web3Service.walletConnected();
      const tab = this.activeTab();

      if (connected) {
        // Tải profile (chỉ tải khi chưa có profile và không đang tải)
        const hasProfile = untracked(() => !!this.taxService.taxProfile());
        const isProfileLoading = untracked(() => this.taxService.isLoading());
        if (!hasProfile && !isProfileLoading) {
          untracked(() => this.taxService.loadTaxProfile());
        }

        // Tải dữ liệu tương ứng với từng tab nếu chưa được tải trước đó (cache mềm)
        if (tab === 'logs') {
          const loaded = untracked(() => this.isLogsLoaded());
          if (!loaded) {
            untracked(() => this.loadLogs());
          }
        } else if (tab === 'declaration') {
          const loaded = untracked(() => this.isPeriodsLoaded());
          if (!loaded) {
            untracked(() => this.loadPeriods());
          }
        } else if (tab === 'estimation') {
          const loaded = untracked(() => this.isEstimateLoaded());
          if (!loaded) {
            untracked(() => this.getEstimate());
          }
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Set default dates for estimate (current month) if not already set in Service
    const now = new Date();
    if (!this.taxService.estimateStartDate()) {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      this.estimateStartDate.set(firstDay.toISOString().substring(0, 10));
      this.estimateEndDate.set(now.toISOString().substring(0, 10));
    }

    this.newPeriodValue.set(now.getMonth() + 1);
    this.newPeriodYear.set(now.getFullYear());

    this.updateTabFromRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabFromRoute();
    });
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
    const connected = this.web3Service.walletConnected();
    if (!connected) return;

    // Reset loaded flags để bắt buộc tải mới
    this.isLogsLoaded.set(false);
    this.isPeriodsLoaded.set(false);
    this.isEstimateLoaded.set(false);

    const hasProfile = this.taxService.taxProfile();
    if (!hasProfile) {
      this.taxService.loadTaxProfile();
    }
    
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
        this.isPeriodsLoaded.set(true); // Đánh dấu đã load thành công
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
        this.openPeriodsList.set(res.data || []);
      }
    });

    this.taxService.getTaxPeriods(this.logsCurrentPage(), this.periodsItemsPerPage, 'locked').subscribe({
      next: (res) => {
        this.logsList.set(res.data || []);
        this.logsTotalItems.set(res.total || 0);
        this.isLogsLoading.set(false);
        this.isLogsLoaded.set(true); // Đánh dấu đã load thành công
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
        if (groupNum === 4) groupTitle = 'Bạn thuộc nhóm doanh thu trên 50 tỷ';

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
        this.isEstimateLoaded.set(true); // Đánh dấu đã load thành công
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
        this.isPeriodsLoaded.set(false); // Reset cache mềm
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
            this.isPeriodsLoaded.set(false); // Reset cache mềm
            this.isLogsLoaded.set(false);    // Reset cache mềm
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
            this.isPeriodsLoaded.set(false); // Reset cache mềm
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
    const openList = this.openPeriodsList() || [];
    
    let allLogs: any[] = [];
    
    if (lockedList.length === 0 && openList.length === 0) {
      const demo1Saved = localStorage.getItem('tax_data_demo-1_rows') !== null;
      const demoS2aSaved = localStorage.getItem('tax_data_demo-s2a_rows') !== null;
      const demoS2bSaved = localStorage.getItem('tax_data_demo-s2b_rows') !== null;
      const demoS2cSaved = localStorage.getItem('tax_data_demo-s2c_rows') !== null;
      const demoS2dSaved = localStorage.getItem('tax_data_demo-s2d_rows') !== null;
      const demoS2eSaved = localStorage.getItem('tax_data_demo-s2e_rows') !== null;

      allLogs = [
        {
          id: 'demo-1',
          category: 'Tờ khai thuế 01.TKN-CNKD',
          name: '',
          status: demo1Saved ? 'saved' : 'pending',
          statusLabel: demo1Saved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        },
        {
          id: 'demo-2',
          category: 'S1a - HKD',
          name: 'Sổ chi tiết doanh thu bán hàng hóa dịch vụ',
          status: 'saved',
          statusLabel: 'Đã lưu'
        },
        {
          id: 'demo-s2a',
          category: 'S2a - HKD',
          name: 'Sổ chi tiết tài sản cố định',
          status: demoS2aSaved ? 'saved' : 'pending',
          statusLabel: demoS2aSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        },
        {
          id: 'demo-s2b',
          category: 'S2b - HKD',
          name: 'Sổ chi phí sản xuất, kinh doanh',
          status: demoS2bSaved ? 'saved' : 'pending',
          statusLabel: demoS2bSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        },
        {
          id: 'demo-s2c',
          category: 'S2c - HKD',
          name: 'Sổ theo dõi tình hình thanh toán tiền lương',
          status: demoS2cSaved ? 'saved' : 'pending',
          statusLabel: demoS2cSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        },
        {
          id: 'demo-s2d',
          category: 'S2d - HKD',
          name: 'Sổ chi tiết vật liệu, dụng cụ, sản phẩm, hàng hóa',
          status: demoS2dSaved ? 'saved' : 'pending',
          statusLabel: demoS2dSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        },
        {
          id: 'demo-s2e',
          category: 'S2e - HKD',
          name: 'Sổ theo dõi thực hiện nghĩa vụ thuế với NSNN',
          status: demoS2eSaved ? 'saved' : 'pending',
          statusLabel: demoS2eSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp'
        }
      ];
    } else {
      // 1. Duyệt qua các kỳ đã khóa
      lockedList.forEach((item) => {
        const periodName = this.getPeriodName(item);
        const decId = `real-declaration-locked-${item.id}`;
        const s1aId = `real-s1a-locked-${item.id}`;
        const s2aId = `real-s2a-locked-${item.id}`;
        const s2bId = `real-s2b-locked-${item.id}`;
        const s2cId = `real-s2c-locked-${item.id}`;
        const s2dId = `real-s2d-locked-${item.id}`;
        const s2eId = `real-s2e-locked-${item.id}`;
        
        const decSaved = item.details?.some((d: any) => d.document_type === 'declaration') || false;
        const s1aSaved = item.details?.some((d: any) => d.document_type === 's1a') || false;
        const s2aSaved = item.details?.some((d: any) => d.document_type === 's2a') || false;
        const s2bSaved = item.details?.some((d: any) => d.document_type === 's2b') || false;
        const s2cSaved = item.details?.some((d: any) => d.document_type === 's2c') || false;
        const s2dSaved = item.details?.some((d: any) => d.document_type === 's2d') || false;
        const s2eSaved = item.details?.some((d: any) => d.document_type === 's2e') || false;

        allLogs.push({
          id: decId,
          category: 'Tờ khai thuế 01.TKN-CNKD',
          name: `Tờ khai thuế của kỳ ${periodName}`,
          status: decSaved ? 'saved' : 'pending',
          statusLabel: decSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s1aId,
          category: 'S1a - HKD',
          name: `Sổ chi tiết doanh thu bán hàng hóa dịch vụ kỳ ${periodName}`,
          status: s1aSaved ? 'saved' : 'pending',
          statusLabel: s1aSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2aId,
          category: 'S2a - HKD',
          name: `Sổ chi tiết tài sản cố định kỳ ${periodName}`,
          status: s2aSaved ? 'saved' : 'pending',
          statusLabel: s2aSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2bId,
          category: 'S2b - HKD',
          name: `Sổ chi phí sản xuất, kinh doanh kỳ ${periodName}`,
          status: s2bSaved ? 'saved' : 'pending',
          statusLabel: s2bSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2cId,
          category: 'S2c - HKD',
          name: `Sổ theo dõi thanh toán tiền lương kỳ ${periodName}`,
          status: s2cSaved ? 'saved' : 'pending',
          statusLabel: s2cSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2dId,
          category: 'S2d - HKD',
          name: `Sổ chi tiết vật liệu, dụng cụ, sản phẩm, hàng hóa kỳ ${periodName}`,
          status: s2dSaved ? 'saved' : 'pending',
          statusLabel: s2dSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2eId,
          category: 'S2e - HKD',
          name: `Sổ theo dõi nghĩa vụ thuế với NSNN kỳ ${periodName}`,
          status: s2eSaved ? 'saved' : 'pending',
          statusLabel: s2eSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
      });

      // 2. Duyệt qua các kỳ đang mở
      openList.forEach((item) => {
        const periodName = this.getPeriodName(item);
        const decId = `real-declaration-open-${item.id}`;
        const s1aId = `real-s1a-open-${item.id}`;
        const s2aId = `real-s2a-open-${item.id}`;
        const s2bId = `real-s2b-open-${item.id}`;
        const s2cId = `real-s2c-open-${item.id}`;
        const s2dId = `real-s2d-open-${item.id}`;
        const s2eId = `real-s2e-open-${item.id}`;
        
        const decSaved = item.details?.some((d: any) => d.document_type === 'declaration') || false;
        const s1aSaved = item.details?.some((d: any) => d.document_type === 's1a') || false;
        const s2aSaved = item.details?.some((d: any) => d.document_type === 's2a') || false;
        const s2bSaved = item.details?.some((d: any) => d.document_type === 's2b') || false;
        const s2cSaved = item.details?.some((d: any) => d.document_type === 's2c') || false;
        const s2dSaved = item.details?.some((d: any) => d.document_type === 's2d') || false;
        const s2eSaved = item.details?.some((d: any) => d.document_type === 's2e') || false;

        allLogs.push({
          id: decId,
          category: 'Tờ khai thuế 01.TKN-CNKD',
          name: `Tờ khai thuế của kỳ ${periodName} (Đang mở)`,
          status: decSaved ? 'saved' : 'pending',
          statusLabel: decSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s1aId,
          category: 'S1a - HKD',
          name: `Sổ chi tiết doanh thu bán hàng hóa dịch vụ kỳ ${periodName} (Đang mở)`,
          status: s1aSaved ? 'saved' : 'pending',
          statusLabel: s1aSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2aId,
          category: 'S2a - HKD',
          name: `Sổ chi tiết tài sản cố định kỳ ${periodName} (Đang mở)`,
          status: s2aSaved ? 'saved' : 'pending',
          statusLabel: s2aSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2bId,
          category: 'S2b - HKD',
          name: `Sổ chi phí sản xuất, kinh doanh kỳ ${periodName} (Đang mở)`,
          status: s2bSaved ? 'saved' : 'pending',
          statusLabel: s2bSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2cId,
          category: 'S2c - HKD',
          name: `Sổ theo dõi thanh toán tiền lương kỳ ${periodName} (Đang mở)`,
          status: s2cSaved ? 'saved' : 'pending',
          statusLabel: s2cSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2dId,
          category: 'S2d - HKD',
          name: `Sổ chi tiết vật liệu, dụng cụ, sản phẩm, hàng hóa kỳ ${periodName} (Đang mở)`,
          status: s2dSaved ? 'saved' : 'pending',
          statusLabel: s2dSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
        allLogs.push({
          id: s2eId,
          category: 'S2e - HKD',
          name: `Sổ theo dõi nghĩa vụ thuế với NSNN kỳ ${periodName} (Đang mở)`,
          status: s2eSaved ? 'saved' : 'pending',
          statusLabel: s2eSaved ? 'Đã lưu' : 'Chưa kê khai / Nháp',
          period: item
        });
      });
    }

    const activeFilters = this.activeSelectedFilters();
    if (activeFilters.length === 0) return allLogs;

    return allLogs.filter(log => {
      if (activeFilters.includes('Tờ khai thuế') && log.category.includes('Tờ khai')) {
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
  }

  public lockLatestOpenPeriod() {
    const openPeriods = this.periodsList().filter(p => p.status === 'open');
    if (openPeriods.length === 0) {
      this.toastService.showToast('Không có kỳ kê khai nào đang mở để khóa sổ!', 'error');
      return;
    }
    this.lockPeriod(openPeriods[0].id);
  }


  public getActiveSelectedFiltersLabel(): string {
    return this.activeSelectedFilters().map(val => this.getFilterLabel(val)).join(', ');
  }


  public openLogDetail(row: any) {
    let title = row.category;
    if (row.name) {
      title += ' - ' + row.name;
    }
    
    this.modalService.open(TaxDetailModalComponent, {
      title: title,
      size: '5xl',
      data: { log: row }
    }).afterClosed$.subscribe((hasChanges) => {
      // Reload logs after closing details modal to catch any status updates (e.g. 'Đã lưu')
      if (hasChanges === true) {
        this.isLogsLoaded.set(false); // Reset cache mềm
        this.loadLogs();
      }
    });
  }

  public downloadLogExcel(row: any) {
    const period = row.period;
    if (!period) {
      this.toastService.showToast('Không tìm thấy dữ liệu kỳ kê khai tương ứng để tải!', 'error');
      return;
    }

    const periodName = this.getPeriodName(period);
    
    if (row.category.includes('Tờ khai thuế')) {
      const fileName = `to_khai_thue_01_TKN_CNKD_${periodName.replace('/', '_')}.xlsx`;
      
      const rows = [
        ['TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH'],
        ['Mẫu số: 01/CNKD (Ban hành kèm theo Thông tư số 40/2021/TT-BTC)'],
        [],
        ['Kỳ tính thuế:', periodName],
        ['Trạng thái:', period.status === 'locked' ? 'Đã khóa sổ' : 'Đang mở'],
        ['Địa chỉ ví chủ quán:', period.store_owner_address],
        [],
        ['STT', 'Chỉ tiêu', 'Giá trị (VND)'],
        [1, 'Doanh thu tính thuế GTGT', period.revenue_amount],
        [2, 'Doanh thu tính thuế TNCN', period.revenue_amount],
        [3, 'Chi phí vận hành ghi nhận', period.expense_amount],
        [4, 'Thuế GTGT phải nộp tạm tính', period.estimated_vat],
        [5, 'Thuế TNCN phải nộp tạm tính', period.estimated_pit],
        [6, 'Tổng số thuế phải nộp', period.estimated_vat + period.estimated_pit]
      ];

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tờ khai 01.TKN-CNKD');
      XLSX.writeFile(wb, fileName);
      this.toastService.showToast(`Đã tải về Tờ khai thuế kỳ ${periodName} thành công.`, 'success');
    } else if (row.category.includes('S1a')) {
      const fileName = `so_S1a_HKD_doanh_thu_${periodName.replace('/', '_')}.xlsx`;

      const totalRevenue = period.revenue_amount;
      const orderCount = totalRevenue > 0 ? Math.min(8, Math.max(1, Math.round(totalRevenue / 500000))) : 0;
      
      const tableRows = [
        ['SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ'],
        ['Mẫu số: S1a-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', periodName],
        ['Chủ quán:', period.store_owner_address],
        [],
        ['STT', 'Ngày, tháng ghi sổ', 'Số hiệu chứng từ', 'Ngày chứng từ', 'Diễn giải', 'Doanh thu bán lẻ (VND)']
      ];

      if (orderCount === 0) {
        tableRows.push([1, '-', '-', '-', 'Không phát sinh doanh thu trong kỳ', 0]);
      } else {
        let remainingRevenue = totalRevenue;
        for (let i = 1; i <= orderCount; i++) {
          const isLast = (i === orderCount);
          const orderRevenue = isLast ? remainingRevenue : Math.round((totalRevenue / orderCount) * (0.8 + Math.random() * 0.4));
          remainingRevenue -= orderRevenue;

          const dateDay = Math.min(28, i * 3);
          const monthStr = period.period_value < 10 ? `0${period.period_value}` : `${period.period_value}`;
          const dateStr = `${dateDay}/${monthStr}/${period.period_year}`;

          tableRows.push([
            i,
            dateStr,
            `HD-${1000 + i}`,
            dateStr,
            `Bán lẻ hóa đơn thanh toán Blockchain #${1000 + i}`,
            orderRevenue
          ]);
        }
        tableRows.push(['', '', '', '', 'TỔNG CỘNG', totalRevenue]);
      }

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S1a-HKD');
      XLSX.writeFile(wb, fileName);
      this.toastService.showToast(`Đã tải về Sổ S1a-HKD kỳ ${periodName} thành công.`, 'success');
    }
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
    switch (Number(group)) {
      case 1: return 'Dưới 1 tỷ/năm';
      case 2: return '1 tỷ - 3 tỷ/năm';
      case 3: return '3 tỷ - 50 tỷ/năm';
      case 4: return 'Trên 50 tỷ/năm';
      default: return `Nhóm ${group}`;
    }
  }

  public getPitMethodLabel(profile: any): string {
    if (!profile) return '';
    const group = Number(profile.business_group);
    if (group === 1) {
      return 'Miễn thuế';
    } else if (group === 2) {
      return profile.tax_method === 'profit_percent' ? '15% Lợi nhuận' : 'Tỷ lệ % doanh thu';
    } else if (group === 3) {
      return '17% Lợi nhuận';
    } else if (group === 4) {
      return '20% Lợi nhuận';
    }
    return '';
  }

  public getVatMethodLabel(profile: any): string {
    if (!profile) return '';
    const group = Number(profile.business_group);
    if (group === 1) {
      return 'Miễn thuế';
    } else if (group === 2) {
      return 'Tỷ lệ % doanh thu';
    } else if (group === 3 || group === 4) {
      return 'Khấu trừ (đầu ra - đầu vào)';
    }
    return '';
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
