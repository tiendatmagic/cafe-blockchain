import { Web3ConnectPromptComponent } from '../web3-connect-prompt/web3-connect-prompt.component';
import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, Web3ConnectPromptComponent],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);

  constructor() {
    effect(() => {
      if (this.web3Service.walletConnected()) {
        this.loadReports();
      }
    });
  }

  // Mốc lọc thời gian
  public readonly activePreset = signal<string>('7days'); // today, yesterday, 7days, thisMonth, lastMonth, custom
  public readonly reportsStartDate = signal<string>('');
  public readonly reportsEndDate = signal<string>('');
  
  public tempStartDate = '';
  public tempEndDate = '';

  // Tab báo cáo chi tiết
  public readonly activeTab = signal<'products' | 'customers'>('products');

  // Sắp xếp cột báo cáo
  public readonly productSortField = signal<string>('total_quantity');
  public readonly productSortDesc = signal<boolean>(true);

  public readonly customerSortField = signal<string>('total_spent');
  public readonly customerSortDesc = signal<boolean>(true);

  // Dữ liệu báo cáo
  public readonly reportsData = signal<any>(null);
  public readonly isReportsLoading = signal<boolean>(false);
  public readonly reportsError = signal<string>('');

  // Phân trang danh sách hàng hóa
  public readonly productPage = signal<number>(1);
  public readonly productLimit = 10;

  // Phân trang danh sách khách hàng
  public readonly customerPage = signal<number>(1);
  public readonly customerLimit = 10;

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public ngOnInit() {
    this.setDatePreset('7days');
  }

  // Định dạng Date thành chuỗi YYYY-MM-DD
  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Đặt mốc thời gian lọc nhanh
  public setDatePreset(preset: string) {
    this.activePreset.set(preset);
    const today = new Date();
    let start = '';
    let end = this.formatDate(today);

    if (preset === 'today') {
      start = this.formatDate(today);
    } else if (preset === 'yesterday') {
      const d = new Date();
      d.setDate(today.getDate() - 1);
      start = this.formatDate(d);
      end = this.formatDate(d);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(today.getDate() - 6);
      start = this.formatDate(d);
    } else if (preset === 'thisMonth') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      start = this.formatDate(d);
    } else if (preset === 'lastMonth') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      start = this.formatDate(firstDayLastMonth);
      end = this.formatDate(lastDayLastMonth);
    }

    if (preset !== 'custom') {
      this.tempStartDate = start;
      this.tempEndDate = end;
      this.reportsStartDate.set(start);
      this.reportsEndDate.set(end);
      this.loadReports();
    }
  }

  // Lọc tùy chỉnh khoảng ngày
  public onCustomDatesChange() {
    if (this.tempStartDate && this.tempEndDate) {
      this.reportsStartDate.set(this.tempStartDate);
      this.reportsEndDate.set(this.tempEndDate);
      this.loadReports();
    }
  }

  // Tải báo cáo từ Backend
  public loadReports() {
    if (!this.web3Service.walletConnected()) return;

    this.isReportsLoading.set(true);
    this.reportsError.set('');
    
    // Reset phân trang & sắp xếp
    this.productPage.set(1);
    this.customerPage.set(1);
    this.productSortField.set('total_quantity');
    this.productSortDesc.set(true);
    this.customerSortField.set('total_spent');
    this.customerSortDesc.set(true);

    this.apiService.getReports(this.reportsStartDate(), this.reportsEndDate()).subscribe({
      next: (data: any) => {
        this.reportsData.set(data);
        this.isReportsLoading.set(false);
      },
      error: (err: any) => {
        console.error('Lỗi tải báo cáo:', err);
        this.reportsError.set('Không thể tải dữ liệu báo cáo từ máy chủ.');
        this.isReportsLoading.set(false);
      }
    });
  }

  // --- Tính Biên lợi nhuận % ---
  public getGrossProfitMargin(): number {
    const data = this.reportsData();
    if (!data || !data.financials || !data.financials.revenue) return 0;
    return (data.financials.gross_profit / data.financials.revenue) * 100;
  }

  public getNetProfitMargin(): number {
    const data = this.reportsData();
    if (!data || !data.financials || !data.financials.revenue) return 0;
    return (data.financials.net_profit / data.financials.revenue) * 100;
  }

  // --- Logic Sắp xếp cột ---
  public toggleProductSort(field: string) {
    if (this.productSortField() === field) {
      this.productSortDesc.set(!this.productSortDesc());
    } else {
      this.productSortField.set(field);
      this.productSortDesc.set(true);
    }
    this.productPage.set(1); // Quay về trang 1 khi đổi cách sắp xếp
  }

  public toggleCustomerSort(field: string) {
    if (this.customerSortField() === field) {
      this.customerSortDesc.set(!this.customerSortDesc());
    } else {
      this.customerSortField.set(field);
      this.customerSortDesc.set(true);
    }
    this.customerPage.set(1); // Quay về trang 1
  }

  // --- Hỗ trợ vẽ biểu đồ Conic Gradient (Cơ cấu thanh toán) ---
  public getConicGradient(): string {
    const data = this.reportsData();
    if (!data || !data.payment_methods || data.payment_methods.length === 0) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const total = data.payment_methods.reduce((sum: number, item: any) => sum + item.amount, 0);
    if (total === 0) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const cash = data.payment_methods.find((c: any) => c.method === 'cash')?.amount || 0;
    const bank = data.payment_methods.find((c: any) => c.method === 'bank_transfer')?.amount || 0;
    const crypto = data.payment_methods.find((c: any) => c.method === 'crypto')?.amount || 0;
    const eWallet = data.payment_methods.find((c: any) => c.method === 'e_wallet')?.amount || 0;

    const cryptoPct = (crypto / total) * 100;
    const bankPct = (bank / total) * 100;
    const eWalletPct = (eWallet / total) * 100;

    const endCrypto = cryptoPct;
    const endBank = cryptoPct + bankPct;
    const endEWallet = cryptoPct + bankPct + eWalletPct;

    return `conic-gradient(#7c3aed 0% ${endCrypto}%, #10b981 ${endCrypto}% ${endBank}%, #ec4899 ${endBank}% ${endEWallet}%, #f59e0b ${endEWallet}% 100%)`;
  }

  public getPaymentPercentage(method: string): number {
    const data = this.reportsData();
    if (!data || !data.payment_methods) return 0;
    const total = data.payment_methods.reduce((sum: number, item: any) => sum + item.amount, 0);
    if (total === 0) return 0;
    const amount = data.payment_methods.find((c: any) => c.method === method)?.amount || 0;
    return Math.round((amount / total) * 100);
  }

  public getPaymentCount(method: string): number {
    const data = this.reportsData();
    if (!data || !data.payment_methods) return 0;
    return data.payment_methods.find((c: any) => c.method === method)?.count || 0;
  }

  public getPaymentAmount(method: string): number {
    const data = this.reportsData();
    if (!data || !data.payment_methods) return 0;
    return data.payment_methods.find((c: any) => c.method === method)?.amount || 0;
  }

  // --- Hỗ trợ vẽ biểu đồ xu hướng stacked bar ---
  public getMaxChartValue(): number {
    const data = this.reportsData();
    if (!data || !data.trend_chart || data.trend_chart.length === 0) {
      return 100000;
    }
    const maxVal = Math.max(...data.trend_chart.map((item: any) => Math.max(item.revenue, item.expense)));
    return maxVal > 0 ? maxVal : 100000;
  }

  // --- Phân trang & Sắp xếp Báo cáo hàng hóa ---
  public getProductsPaged(): any[] {
    const data = this.reportsData();
    if (!data?.products) return [];

    // Copy để không mutate dữ liệu gốc
    const list = [...data.products];
    const field = this.productSortField();
    const desc = this.productSortDesc();

    list.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      
      // Xử lý kiểu chuỗi/số
      if (typeof valA === 'string') {
        return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return desc ? (valB - valA) : (valA - valB);
    });

    const start = (this.productPage() - 1) * this.productLimit;
    return list.slice(start, start + this.productLimit);
  }

  public getProductsTotalPages(): number {
    const data = this.reportsData();
    if (!data?.products) return 0;
    return Math.ceil(data.products.length / this.productLimit);
  }

  // --- Phân trang & Sắp xếp Báo cáo khách hàng ---
  public getCustomersPaged(): any[] {
    const data = this.reportsData();
    if (!data?.customers) return [];

    const list = [...data.customers];
    const field = this.customerSortField();
    const desc = this.customerSortDesc();

    list.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      
      if (typeof valA === 'string') {
        return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return desc ? (valB - valA) : (valA - valB);
    });

    const start = (this.customerPage() - 1) * this.customerLimit;
    return list.slice(start, start + this.customerLimit);
  }

  public getCustomersTotalPages(): number {
    const data = this.reportsData();
    if (!data?.customers) return 0;
    return Math.ceil(data.customers.length / this.customerLimit);
  }

  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  public getPagesArray(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  // --- Logic Xuất file Excel (.xlsx) bằng SheetJS ---
  public exportToExcel(type: 'products' | 'customers') {
    const data = this.reportsData();
    if (!data) return;

    let fileName = '';
    let sheetName = '';
    let rows: any[] = [];

    if (type === 'products') {
      rows = data.products.map((p: any) => ({
        'Mã SKU': p.sku || '',
        'Tên món ăn': p.product_name || '',
        'Biến thể': p.variant_name || '',
        'Số lượng bán': p.total_quantity,
        'Doanh số (đ)': p.total_revenue,
        'Tổng giá vốn (đ)': p.total_cost,
        'Lợi nhuận gộp (đ)': p.gross_profit
      }));
      fileName = `bao_cao_ban_hang_theo_mon_${this.reportsStartDate()}_den_${this.reportsEndDate()}.xlsx`;
      sheetName = 'Báo cáo món ăn';
    } else {
      rows = data.customers.map((c: any) => ({
        'Tên khách hàng': c.customer_name || '',
        'Số điện thoại': c.customer_phone || '',
        'Địa chỉ ví': c.wallet_address || '',
        'Số đơn mua': c.orders_count,
        'Tổng chi tiêu (đ)': c.total_spent,
        'TB đơn hàng (đ)': c.average_order_value
      }));
      fileName = `bao_cao_chi_tieu_khach_hang_${this.reportsStartDate()}_den_${this.reportsEndDate()}.xlsx`;
      sheetName = 'Báo cáo khách hàng';
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }
}
