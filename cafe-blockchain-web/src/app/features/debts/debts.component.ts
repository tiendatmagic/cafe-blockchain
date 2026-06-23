import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import * as XLSX from 'xlsx';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ModalService } from '@core/services/modal.service';
import { ManualDebtModalComponent } from './components/manual-debt-modal/manual-debt-modal.component';
import { DebtPaymentModalComponent } from './components/debt-payment-modal/debt-payment-modal.component';
import { CustomSearchInputComponent } from '@shared/components/custom-search-input/custom-search-input.component';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    SkeletonLoaderComponent,
    PaginationComponent,
    ShortAddressPipe,
    PageHeaderComponent,
    VNDCurrencyPipe,
    DrawerComponent,
    IconComponent,
    TabGroupComponent,
    ButtonComponent,
    CardComponent,
    CustomSearchInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './debts.component.html',
})
export class DebtsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  public readonly Number = Number;

  constructor() {
    effect(() => {
      if (this.web3Service.walletConnected()) {
        untracked(() => {
          if (this.customers().length === 0) {
            this.stateService.refreshCustomers();
          }
          if (this.stateService.transactions().length === 0) {
            this.stateService.refreshTransactions();
          }
        });
      }
    });
  }

  // Bộ lọc, tìm kiếm khách hàng
  public readonly debtSearchQuery = signal<string>('');
  public readonly debtFilterMode = signal<'all' | 'only_debt' | 'no_debt'>('all'); // all, only_debt, no_debt
  public readonly debtPage = signal<number>(1);
  public readonly debtLimit = 10;

  public readonly debtFilterOptions: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'only_debt', label: 'Đang nợ', dotClass: 'bg-rose-500' },
    { value: 'no_debt', label: 'Đã trả hết', dotClass: 'bg-emerald-500' },
  ];

  // Sắp xếp cột
  public readonly sortField = signal<string>('debt_balance');
  public readonly sortDesc = signal<boolean>(true);

  // Drawer & Logs State
  public readonly isHistoryDrawerOpen = signal<boolean>(false);
  public readonly selectedCustomer = signal<any>(null);
  public readonly selectedDebtLog = signal<any>(null);
  public readonly customerLogs = signal<any[]>([]);
  public readonly isLogsLoading = signal<boolean>(false);


  // Getters từ StateService
  public get debts() {
    return this.stateService.debts;
  }
  public get isDebtsLoading() {
    return this.stateService.isDebtsLoading;
  }
  public get customers() {
    return this.stateService.customers;
  }
  public get web3Service() {
    return this.stateService.web3Service;
  }

  // Định dạng ngày hiện tại YYYY-MM-DD
  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public ngOnInit() {
    // Nạp danh sách khách hàng nếu chưa có để dùng cho modal chọn khách hàng
    if (this.customers().length === 0 && this.web3Service.walletConnected()) {
      this.stateService.refreshCustomers();
    }
    // Nạp transactions nếu chưa có để tính dư nợ thu hồi trong tháng
    if (this.stateService.transactions().length === 0 && this.web3Service.walletConnected()) {
      this.stateService.refreshTransactions();
    }
  }

  // --- Thống kê công nợ ---
  // Tổng dư nợ phải thu (sum debt_balance của tất cả khách hàng)
  public readonly totalDebtOutstanding = computed(() => {
    return this.debts().reduce((sum, c) => sum + Number(c.debt_balance || 0), 0);
  });

  // Số khách đang nợ (debt_balance > 0)
  public readonly totalDebtorsCount = computed(() => {
    return this.debts().filter((c) => Number(c.debt_balance || 0) > 0).length;
  });

  // Đã thu hồi trong tháng (tính từ transactions thu nợ khách hàng trong tháng hiện tại)
  public readonly recoveredThisMonth = computed(() => {
    const txs = this.stateService.transactions();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    return txs
      .filter((t) => {
        if (t.type !== 'thu' || t.category !== 'Thu nợ khách hàng') return false;
        const tDate = new Date(t.transaction_date || t.created_at);
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  });

  // Hủy dấu tiếng Việt để tìm kiếm
  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Lọc và tìm kiếm danh sách nợ client-side
  public readonly filteredDebts = computed(() => {
    let list = this.debts();

    // 1. Lọc theo bộ lọc Đang nợ / Đã trả
    const filter = this.debtFilterMode();
    if (filter === 'only_debt') {
      list = list.filter((c) => Number(c.debt_balance || 0) > 0);
    } else if (filter === 'no_debt') {
      list = list.filter((c) => Number(c.debt_balance || 0) <= 0);
    }

    // 2. Lọc theo tìm kiếm từ khóa
    const search = this.debtSearchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter((c) => {
        const nameClean = c.name ? this.removeSign(c.name.toLowerCase()) : '';
        const phoneClean = c.phone ? c.phone.toLowerCase() : '';
        const codeClean = c.customer_code ? c.customer_code.toLowerCase() : '';
        return (
          nameClean.includes(searchClean) ||
          phoneClean.includes(searchClean) ||
          codeClean.includes(searchClean)
        );
      });
    }

    // 3. Sắp xếp cột
    const field = this.sortField();
    const desc = this.sortDesc();
    list = [...list].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === 'string') {
        return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }

      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;
      return desc ? numB - numA : numA - numB;
    });

    return list;
  });

  // Phân trang
  public readonly paginatedDebts = computed(() => {
    const list = this.filteredDebts();
    const startIndex = (this.debtPage() - 1) * this.debtLimit;
    return list.slice(startIndex, startIndex + this.debtLimit);
  });

  public readonly debtTotalPages = computed(() => {
    return Math.ceil(this.filteredDebts().length / this.debtLimit) || 1;
  });

  public refreshDebts() {
    this.debtPage.set(1);
    this.stateService.refreshDebts(this.debtSearchQuery(), this.debtFilterMode());
    this.stateService.refreshTransactions();
  }

  public toggleSort(field: string) {
    if (this.sortField() === field) {
      this.sortDesc.set(!this.sortDesc());
    } else {
      this.sortField.set(field);
      this.sortDesc.set(true);
    }
    this.debtPage.set(1);
  }


  public openManualDebtModal() {
    this.modalService.open(ManualDebtModalComponent, {
      title: 'Lập phiếu ghi nợ mới',
      size: 'md',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshDebts();
        this.stateService.refreshCustomers(true);
      }
    });
  }

  public openPaymentModal(customer: any) {
    this.modalService.open(DebtPaymentModalComponent, {
      title: 'Thu hồi công nợ khách hàng',
      size: 'md',
      data: { customer },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshDebts();
        this.stateService.refreshCustomers(true);
      }
    });
  }

  // --- Drawer Lịch sử Công nợ ---
  public openHistoryDrawer(customer: any) {
    this.selectedCustomer.set(customer);
    this.customerLogs.set([]);
    this.isHistoryDrawerOpen.set(true);
    this.loadCustomerDebtLogs();
  }

  public closeHistoryDrawer() {
    this.isHistoryDrawerOpen.set(false);
    this.selectedCustomer.set(null);
    this.customerLogs.set([]);
  }

  private loadCustomerDebtLogs() {
    const customer = this.selectedCustomer();
    if (!customer) return;

    this.isLogsLoading.set(true);
    this.apiService.getCustomerDebtLogs(customer.id).subscribe({
      next: (res: any) => {
        if (res.customer) {
          this.selectedCustomer.set(res.customer);
        }
        this.customerLogs.set(res.logs || []);
        this.isLogsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải lịch sử công nợ:', err);
        this.stateService.showToast('Không thể tải lịch sử công nợ!', 'error');
        this.isLogsLoading.set(false);
      },
    });
  }

  // --- Hủy/Xóa bản ghi công nợ thủ công ---
  public deleteDebtLog(log: any) {
    if (log.order_id) {
      this.stateService.showToast(
        'Bản ghi nợ này sinh ra từ Đơn hàng POS. Vui lòng hủy đơn hàng tương ứng ở trang Đơn hàng!',
        'error',
      );
      return;
    }

    if (log.type === 'payment' && log.transaction?.blockchain_status === 'success') {
      this.stateService.showToast(
        'Giao dịch thu nợ đã đồng bộ lên Blockchain, không thể hủy bỏ!',
        'error',
      );
      return;
    }

    this.modalService.confirm({
      title: 'Xác nhận hủy bản ghi công nợ',
      description: 'Hành động này sẽ xóa bản ghi công nợ này, hoàn tác lại số dư nợ của khách hàng, và tự động xóa bỏ giao dịch liên quan trong sổ quỹ thu chi (nếu có). Bạn chắc chắn muốn tiếp tục?',
      confirmText: 'Hủy ghi nhận',
      cancelText: 'Bỏ qua',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.confirmDeleteDebtLog(log);
      }
    });
  }

  private confirmDeleteDebtLog(log: any) {
    this.stateService.isLoading.set(true);
    this.apiService.deleteDebtLog(log.id).subscribe({
      next: (res: any) => {
        this.stateService.showToast(res.message || 'Đã hủy bản ghi công nợ thành công!', 'success');
        this.loadCustomerDebtLogs(); // Reload timeline
        this.refreshDebts(); // Reload bảng tổng
        this.stateService.refreshCustomers(true);
        this.stateService.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi xóa công nợ:', err);
        const errMsg = err.error?.message || 'Xóa bản ghi công nợ thất bại!';
        this.stateService.showToast(errMsg, 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }

  // --- Xuất sao kê công nợ Excel (.xlsx) cho Khách hàng ---
  public exportStatementToExcel() {
    const customer = this.selectedCustomer();
    const logs = this.customerLogs();
    if (!customer || logs.length === 0) {
      this.stateService.showToast('Không có dữ liệu để xuất sao kê!', 'error');
      return;
    }

    const rows = logs.map((log: any) => {
      let documentRef = '';
      if (log.order_id) {
        documentRef = `Hóa đơn POS: ${log.order?.order_code || '#' + log.order_id}`;
      } else if (log.transaction_id) {
        documentRef = `Phiếu thu nợ: #${log.transaction_id.substring(0, 8)}...`;
      } else {
        documentRef = 'Phiếu nợ thủ công';
      }

      return {
        'Thời gian ghi nhận': log.recorded_at
          ? new Date(log.recorded_at).toLocaleString('vi-VN')
          : '',
        'Loại giao dịch': log.type === 'debt' ? 'Ghi nợ (+)' : 'Trả nợ (-)',
        'Số tiền (đ)': Number(log.amount || 0),
        'Chứng từ / Nguồn': documentRef,
        'Ghi chú / Mô tả': log.note || '',
      };
    });

    const fileName = `sao_ke_cong_no_${this.removeSign(customer.name).replace(/\s+/g, '_')}_${this.getTodayDateString()}.xlsx`;

    // Tạo sheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // Thêm style đơn giản hoặc các thông tin chung ở đầu sheet nếu cần, nhưng json_to_sheet là chuẩn và an toàn nhất
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sao kê công nợ');
    XLSX.writeFile(wb, fileName);

    this.stateService.showToast('Đã xuất file sao kê Excel thành công!', 'success');
  }

  public translateNote(note: string): string {
    if (!note) return '';
    if (note === 'Manual debt entry') {
      return 'Ghi nợ thủ công';
    }
    if (note.startsWith('Customer debt payment')) {
      let method = 'Tiền mặt';
      if (note.includes('Bank Transfer')) method = 'Chuyển khoản';
      else if (note.includes('Crypto')) method = 'Blockchain/Crypto';
      else if (note.includes('E-Wallet')) method = 'Ví điện tử';
      return `Thu hồi công nợ thủ công (${method})`;
    }
    return note;
  }
}
