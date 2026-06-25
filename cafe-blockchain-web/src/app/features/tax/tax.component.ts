import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxService } from '@core/services/tax.service';
import { StateService } from '@core/services/state.service';
import { ToastService } from '@core/services/toast.service';
import { Web3Service } from '@core/services/web3.service';
import { ModalService } from '@core/services/modal.service';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { CreateTaxPeriodModalComponent } from './components/create-tax-period-modal/create-tax-period-modal.component';
import { TaxSurveyModalComponent } from './components/tax-survey-modal/tax-survey-modal.component';

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

  // Tab: 'logs' (Nhật ký kê khai) | 'declaration' (Kê khai thuế) | 'estimation' (Ước tính thuế)
  public readonly activeTab = signal<'logs' | 'declaration' | 'estimation'>('logs');

  public readonly tabOptions: TabOption[] = [
    { value: 'logs', label: 'Nhật ký chốt thuế' },
    { value: 'declaration', label: 'Kỳ kê khai' },
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

  ngOnInit() {
    // Set default dates for estimate (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.estimateStartDate.set(firstDay.toISOString().substring(0, 10));
    this.estimateEndDate.set(now.toISOString().substring(0, 10));

    this.newPeriodValue.set(now.getMonth() + 1);
    this.newPeriodYear.set(now.getFullYear());

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['logs', 'declaration', 'estimation'].includes(tab)) {
        this.setTab(tab as any);
      }
    });

    if (this.web3Service.walletConnected()) {
      this.loadInitialData();
    }
  }

  public loadInitialData() {
    this.taxService.loadTaxProfile();
    this.loadPeriods();
    this.loadLogs();
    this.getEstimate();
  }

  // Load active/open tax periods
  public loadPeriods() {
    this.isPeriodsLoading.set(true);
    this.taxService.getTaxPeriods(this.periodsCurrentPage(), this.periodsItemsPerPage, 'open').subscribe({
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

  // Handle Tab changes
  public setTab(tab: any) {
    this.activeTab.set(tab);
    if (tab === 'logs') this.loadLogs();
    if (tab === 'declaration') this.loadPeriods();
    if (tab === 'estimation') this.getEstimate();
  }

  // Open survey modal dialog
  public openSurveyModal() {
    this.modalService.open(TaxSurveyModalComponent, {
      title: 'Khảo sát Hồ sơ Thuế cửa hàng',
      size: 'xl',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.loadInitialData();
      }
    });
  }

  public resetTaxProfile() {
    this.modalService.confirm({
      title: 'Thiết lập lại Hồ sơ Thuế',
      description: 'Bạn có chắc chắn muốn thiết lập lại Hồ sơ khảo sát thuế của cửa hàng? Các kỳ kê khai cũ vẫn được giữ nguyên.',
      confirmText: 'Thiết lập lại',
      cancelText: 'Hủy',
      confirmButtonClass: '!bg-purple-600 hover:!bg-purple-700 text-white'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.openSurveyModal();
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
        return 'Phân phối, bán buôn hàng hóa';
      case 'service':
        return 'Dịch vụ, xây dựng';
      case 'production':
        return 'Sản xuất, F&B, vận tải';
      case 'others':
        return 'Kinh doanh khác';
      default:
        return type;
    }
  }

  public getBusinessGroupLabel(group: number): string {
    switch (group) {
      case 1: return 'Dưới 1 tỷ đồng / năm';
      case 2: return 'Từ 1 - 3 tỷ đồng / năm';
      case 3: return 'Từ 3 - 50 tỷ đồng / năm';
      case 4: return 'Trên 50 tỷ đồng / năm';
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
