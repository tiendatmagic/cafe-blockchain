import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { MiniButtonsComponent, DATE_FILTER_OPTIONS } from '@shared/components/mini-buttons/mini-buttons.component';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { TableComponent, TableColumn, TableCellDirective } from '@shared/components/table/table.component';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    IconComponent,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    MiniButtonsComponent,
    CustomDatePickerComponent,
    TableComponent,
    TableCellDirective,
    ShortAddressPipe,
    VNDCurrencyPipe
  ],
  templateUrl: './shifts.component.html'
})
export class ShiftsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  public readonly datePresets = DATE_FILTER_OPTIONS;

  public readonly shiftColumns: TableColumn[] = [
    { key: 'staff_name', header: 'NHÂN VIÊN', sortable: true, class: 'font-extrabold text-slate-800 dark:text-white pl-6' },
    { key: 'status', header: 'TRẠNG THÁI', sortable: true, class: 'font-bold' },
    { key: 'start_time', header: 'MỞ CA', sortable: true, class: 'text-slate-500' },
    { key: 'end_time', header: 'KẾT CA', sortable: true, class: 'text-slate-500' },
    { key: 'initial_cash', header: 'TIỀN ĐẦU CA', sortable: true, class: 'text-right text-slate-500', headerClass: 'text-right' },
    { key: 'expected_cash', header: 'TIỀN HỆ THỐNG', sortable: true, class: 'text-right text-slate-500', headerClass: 'text-right' },
    { key: 'actual_cash', header: 'TIỀN THỰC TẾ', sortable: true, class: 'text-right font-bold text-slate-800 dark:text-white', headerClass: 'text-right' },
    { key: 'difference', header: 'CHÊNH LỆCH', sortable: true, class: 'text-right font-black', headerClass: 'text-right' },
    { key: 'actions', header: 'THAO TÁC', sortable: false, class: 'text-right pr-6', headerClass: 'text-right pr-6' }
  ];

  // Lọc ngày
  public readonly activePreset = signal<string>('7days');
  public readonly reportsStartDate = signal<string>('');
  public readonly reportsEndDate = signal<string>('');
  public tempStartDate = '';
  public tempEndDate = '';

  // Sắp xếp & Phân trang
  public readonly shiftSortField = signal<string>('start_time');
  public readonly shiftSortDesc = signal<boolean>(true);
  public readonly shiftPage = signal<number>(1);
  public readonly shiftLimit = 10;

  public get web3Service() {
    return this.stateService.web3Service;
  }

  ngOnInit() {
    this.setDatePreset('7days');
    if (this.web3Service.walletConnected()) {
      this.stateService.refreshShifts();
      this.stateService.refreshCurrentShift();
    }
  }

  // Định dạng Date thành YYYY-MM-DD
  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
      this.shiftPage.set(1);
    }
  }

  public onCustomDatesChange() {
    if (this.tempStartDate && this.tempEndDate) {
      this.reportsStartDate.set(this.tempStartDate);
      this.reportsEndDate.set(this.tempEndDate);
      this.shiftPage.set(1);
    }
  }

  // Lọc cục bộ theo ngày
  public readonly filteredShifts = computed(() => {
    const list = this.stateService.shifts() || [];
    const start = this.reportsStartDate();
    const end = this.reportsEndDate();
    if (!start || !end) return list;

    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T23:59:59');

    return list.filter(shift => {
      const shiftDate = new Date(shift.start_time);
      return shiftDate >= startDate && shiftDate <= endDate;
    });
  });

  // Sắp xếp danh sách
  public readonly sortedShifts = computed(() => {
    const list = this.filteredShifts();
    const field = this.shiftSortField();
    const desc = this.shiftSortDesc();

    const result = [...list];
    result.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'staff_name') {
        valA = a.user?.name || a.user?.wallet_address || '';
        valB = b.user?.name || b.user?.wallet_address || '';
      } else if (field === 'difference') {
        valA = (a.actual_cash ?? 0) - (a.expected_cash ?? 0);
        valB = (b.actual_cash ?? 0) - (b.expected_cash ?? 0);
      }

      if (valA === null || valA === undefined) return desc ? 1 : -1;
      if (valB === null || valB === undefined) return desc ? -1 : 1;

      if (typeof valA === 'string') {
        return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return desc ? (valB - valA) : (valA - valB);
    });
    return result;
  });

  // Phân trang
  public readonly shiftsPaged = computed(() => {
    const list = this.sortedShifts();
    const start = (this.shiftPage() - 1) * this.shiftLimit;
    return list.slice(start, start + this.shiftLimit);
  });

  public readonly shiftsTotalPages = computed(() => {
    const list = this.sortedShifts();
    return Math.ceil(list.length / this.shiftLimit);
  });

  public onSortChange(event: { key: string, direction: 'asc' | 'desc' | '' }) {
    if (event.key) {
      this.shiftSortField.set(event.key);
      this.shiftSortDesc.set(event.direction === 'desc');
    } else {
      this.shiftSortField.set('start_time');
      this.shiftSortDesc.set(true);
    }
    this.shiftPage.set(1);
  }

  // Mở modal bắt đầu / kết ca
  public openStartShiftModal() {
    this.stateService.openStartShiftModal();
  }

  public openCloseShiftModal() {
    this.stateService.openCloseShiftModal();
  }

  // Định dạng hiển thị thời gian
  public formatShiftTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  // In hóa đơn kết ca nhiệt (K80)
  public printShiftReceipt(shift: any) {
    if (!shift) return;
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    const printWindow = window.open('', '_blank', 'width=300,height=400');
    if (!printWindow) {
      this.stateService.showToast('Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt!', 'error');
      return;
    }

    const start = new Date(shift.start_time).toLocaleString('vi-VN');
    const end = shift.end_time ? new Date(shift.end_time).toLocaleString('vi-VN') : 'Chưa kết ca';
    const initial = (shift.initial_cash || 0).toLocaleString('vi-VN') + 'đ';
    const expected = shift.expected_cash !== null && shift.expected_cash !== undefined ? (shift.expected_cash).toLocaleString('vi-VN') + 'đ' : '—';
    const actual = shift.actual_cash !== null && shift.actual_cash !== undefined ? (shift.actual_cash).toLocaleString('vi-VN') + 'đ' : '—';
    const diffVal = shift.actual_cash !== null && shift.expected_cash !== null ? shift.actual_cash - shift.expected_cash : null;
    const diff = diffVal !== null ? (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN') + 'đ' : '—';
    const note = shift.note || 'Không có';
    const staff = shift.user?.name || 'Nhân viên';

    const html = `
      <html>
      <head>
        <title>Phieu Ket Ca</title>
        <style>
          body { font-family: monospace; font-size: 12px; margin: 10px; color: #000; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .border-bottom { border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
          .flex-between { display: flex; justify-content: space-between; }
          .mt-10 { margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="text-center font-bold" style="font-size: 14px;">CAFE WEB3 POS</div>
        <div class="text-center font-bold border-bottom">PHIẾU BÁO CÁO KẾT CA</div>
        
        <div class="border-bottom">
          <div class="flex-between"><span>Nhân viên:</span><span>${staff}</span></div>
          <div class="flex-between"><span>Mở ca:</span><span>${start}</span></div>
          <div class="flex-between"><span>Kết ca:</span><span>${end}</span></div>
          <div class="flex-between"><span>Trạng thái:</span><span>${shift.status === 'open' ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}</span></div>
        </div>
        
        <div class="border-bottom">
          <div class="flex-between font-bold"><span>Tiền đầu ca:</span><span>${initial}</span></div>
          <div class="flex-between"><span>Tiền hệ thống:</span><span>${expected}</span></div>
          <div class="flex-between font-bold"><span>Tiền thực tế:</span><span>${actual}</span></div>
          <div class="flex-between font-bold" style="font-size:13px;"><span>Chênh lệch:</span><span>${diff}</span></div>
        </div>
        
        <div class="mt-10">
          <div class="font-bold">Ghi chú giải trình:</div>
          <div style="font-style: italic; white-space: pre-wrap;">${note}</div>
        </div>
        
        <div class="mt-10 text-center" style="font-size: 10px; border-top: 1px dashed #000; padding-top: 10px;">
          Đã in ngày: ${new Date().toLocaleString('vi-VN')}
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }
}
