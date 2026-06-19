import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { MiniButtonsComponent, DASHBOARD_DATE_OPTIONS } from '@shared/components/mini-buttons/mini-buttons.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { IconComponent } from '@shared/components/icon/icon.component';

import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    ShortAddressPipe,
    PageHeaderComponent,
    VNDCurrencyPipe,
    CustomDatePickerComponent,
    MiniButtonsComponent,
    PaginationComponent,
    IconComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public readonly stateService = inject(StateService);

  public readonly datePresets = DASHBOARD_DATE_OPTIONS;
  public activeDatePreset = '7days'; // 'today' | '7days' | '30days' | 'thisMonth' | 'custom'
  public tempStartDate = '';
  public tempEndDate = '';

  // Phân trang cảnh báo tồn kho thấp
  public lowStockCurrentPage = 1;
  public readonly lowStockPageSize = 9;

  public get dashboardData() {
    return this.stateService.dashboardData;
  }

  public get isDashboardLoading() {
    return this.stateService.isDashboardLoading;
  }

  public get nativeTokenPriceVND() {
    return this.stateService.nativeTokenPriceVND;
  }

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public get settings() {
    return this.stateService.settings;
  }

  public loadAllData() {
    this.stateService.refreshDashboard(true);
    this.stateService.loadSettings();
    this.stateService.refreshCurrentShift();
  }

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.web3Service.getTxExplorerLink(txHash, chainId);
  }

  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  public getConicGradient(): string {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const chart = data.payment_methods_chart;
    const totalAmount = chart.reduce((sum: number, item: any) => sum + item.amount, 0);

    if (totalAmount === 0) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const cashAmount = chart.find((c: any) => c.method === 'cash')?.amount || 0;
    const bankAmount = chart.find((c: any) => c.method === 'bank_transfer')?.amount || 0;
    const cryptoAmount = chart.find((c: any) => c.method === 'crypto')?.amount || 0;
    const eWalletAmount = chart.find((c: any) => c.method === 'e_wallet')?.amount || 0;

    const cashPct = (cashAmount / totalAmount) * 100;
    const bankPct = (bankAmount / totalAmount) * 100;
    const cryptoPct = (cryptoAmount / totalAmount) * 100;
    const eWalletPct = (eWalletAmount / totalAmount) * 100;

    // Màu sắc: Crypto (var(--color-primary)), Bank Transfer (#10b981), E-wallet (#ec4899), Cash (#f59e0b)
    const endCrypto = cryptoPct;
    const endBank = cryptoPct + bankPct;
    const endEWallet = cryptoPct + bankPct + eWalletPct;

    return `conic-gradient(var(--color-primary) 0% ${endCrypto}%, #10b981 ${endCrypto}% ${endBank}%, #ec4899 ${endBank}% ${endEWallet}%, #f59e0b ${endEWallet}% 100%)`;
  }

  public getPaymentMethodPercentage(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    const totalAmount = chart.reduce((sum: number, item: any) => sum + item.amount, 0);
    if (totalAmount === 0) return 0;
    const amount = chart.find((c: any) => c.method === method)?.amount || 0;
    return Math.round((amount / totalAmount) * 100);
  }

  public getPaymentMethodAmount(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    return chart.find((c: any) => c.method === method)?.amount || 0;
  }

  public getPaymentMethodCount(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    return chart.find((c: any) => c.method === method)?.count || 0;
  }

  public getTotalRevenue(): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    return data.payment_methods_chart.reduce((sum: number, item: any) => sum + item.amount, 0);
  }

  public getTotalPaymentOrders(): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    return data.payment_methods_chart.reduce((sum: number, item: any) => sum + item.count, 0);
  }

  public ngOnInit() {
    // Khởi tạo bộ lọc ngày mặc định là 7 ngày qua nếu chưa có bộ lọc nào được thiết lập
    if (!this.stateService.dashboardStartDate() || !this.stateService.dashboardEndDate()) {
      this.setDatePreset('7days');
    } else {
      // Nhận diện lại preset hiện tại từ StateService
      this.tempStartDate = this.stateService.dashboardStartDate();
      this.tempEndDate = this.stateService.dashboardEndDate();
      
      const todayStr = this.formatDate(new Date());
      if (this.tempStartDate === todayStr && this.tempEndDate === todayStr) {
        this.activeDatePreset = 'today';
      } else {
        const check7 = new Date();
        check7.setDate(check7.getDate() - 6);
        const check7Str = this.formatDate(check7);
        if (this.tempStartDate === check7Str && this.tempEndDate === todayStr) {
          this.activeDatePreset = '7days';
        } else {
          const check30 = new Date();
          check30.setDate(check30.getDate() - 29);
          const check30Str = this.formatDate(check30);
          if (this.tempStartDate === check30Str && this.tempEndDate === todayStr) {
            this.activeDatePreset = '30days';
          } else {
            const checkMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const checkMonthStr = this.formatDate(checkMonth);
            if (this.tempStartDate === checkMonthStr && this.tempEndDate === todayStr) {
              this.activeDatePreset = 'thisMonth';
            } else {
              this.activeDatePreset = 'custom';
            }
          }
        }
      }
    }
  }

  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public setDatePreset(preset: string) {
    this.activeDatePreset = preset;
    const today = new Date();
    let start = '';
    let end = this.formatDate(today);

    if (preset === 'today') {
      start = this.formatDate(today);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(today.getDate() - 6);
      start = this.formatDate(d);
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(today.getDate() - 29);
      start = this.formatDate(d);
    } else if (preset === 'thisMonth') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      start = this.formatDate(d);
    }

    if (preset !== 'custom') {
      this.tempStartDate = start;
      this.tempEndDate = end;
      this.stateService.dashboardStartDate.set(start);
      this.stateService.dashboardEndDate.set(end);
      this.stateService.refreshDashboard(true);
    }
  }

  public onCustomDatesChange() {
    if (this.tempStartDate && this.tempEndDate) {
      this.stateService.dashboardStartDate.set(this.tempStartDate);
      this.stateService.dashboardEndDate.set(this.tempEndDate);
      this.stateService.refreshDashboard(true);
    }
  }

  public getMaxRevenue(): number {
    const data = this.dashboardData();
    if (!data || !data.weekly_chart || data.weekly_chart.length === 0) {
      return 200000;
    }
    const max = Math.max(...data.weekly_chart.map((item: any) => item.revenue || 0));
    return max > 0 ? max : 200000;
  }

  // Phân trang: Lấy danh sách cảnh báo tồn kho theo trang hiện tại
  public getLowStockPaged(): any[] {
    const data = this.dashboardData();
    if (!data?.low_stock_alerts) return [];
    const start = (this.lowStockCurrentPage - 1) * this.lowStockPageSize;
    return data.low_stock_alerts.slice(start, start + this.lowStockPageSize);
  }

  public getLowStockTotalPages(): number {
    const data = this.dashboardData();
    if (!data?.low_stock_alerts) return 0;
    return Math.ceil(data.low_stock_alerts.length / this.lowStockPageSize);
  }

  public getLowStockTotalCount(): number {
    const data = this.dashboardData();
    return data?.low_stock_alerts?.length ?? 0;
  }

  public goToLowStockPage(page: number) {
    const total = this.getLowStockTotalPages();
    if (page >= 1 && page <= total) {
      this.lowStockCurrentPage = page;
    }
  }
}
