import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { TaxService } from '@core/services/tax.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import * as XLSX from 'xlsx';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface TaxDeclarationRow {
  stt: string;
  name: string;
  code: string;
  revVat: number;
  exemptVat: number;
  zeroVat: number;
  payableVat: number;
  revPit: number;
  payablePit: number;
  isHeader?: boolean;
  industryKey?: string;
}

interface BankAccountRow {
  stt: number;
  locationName: string;
  locationCode: string;
  accountNumber: string;
  accountOwner: string;
  bankName: string;
  status: string;
}

interface S1aTransactionRow {
  stt: number;
  date: string;
  code: string;
  description: string;
  amount: number;
}

interface S2aAssetRow {
  stt: number;
  assetName: string;
  assetCode: string;
  purchaseDate: string;
  originalPrice: number;
  depreciationAccumulated: number;
  remainingValue: number;
}

interface S2bExpenseRow {
  stt: number;
  date: string;
  voucherCode: string;
  description: string;
  laborExpense: number;
  materialExpense: number;
  managementExpense: number;
  otherExpense: number;
}

interface S2cSalaryRow {
  stt: number;
  employeeName: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  signature: string;
}

interface S2dInventoryRow {
  stt: number;
  itemCode: string;
  itemName: string;
  unit: string;
  importQty: number;
  exportQty: number;
  stockQty: number;
}

interface S2eTaxObligationRow {
  stt: number;
  taxType: string;
  payableAmount: number;
  paidAmount: number;
  debtAmount: number;
}

@Component({
  selector: 'app-tax-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    IconComponent,
    CustomSwitchComponent,
    VNDCurrencyPipe,
    TabGroupComponent
  ],
  templateUrl: './tax-detail-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ]
})
export class TaxDetailModalComponent implements OnInit {
  private readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA);
  private readonly taxService = inject(TaxService);
  private readonly toastService = inject(ToastService);

  public logRow: any = null;
  public period: any = null;
  public periodName = 'Tháng 06/2026';
  
  // Views
  public isEditingInfo = false;
  public activeTab: 'declaration' | 'pl01' = 'declaration';
  public readonly declarationTabOptions: TabOption[] = [
    { value: 'declaration', label: 'Tờ khai thuế' },
    { value: 'pl01', label: 'PL 01 BK-STK' }
  ];
  private hasSaved = false;
  public isSaving = signal(false);

  // Tax Info Form
  public taxInfo = {
    taxpayerName: 'Cửa hàng Cafe Blockchain',
    taxpayerMst: '8096245103',
    taxOffice: 'Chi cục Thuế Quận 1',
    addressStreet: '123 Đường Song Hành',
    addressProvince: 'Thành phố Hồ Chí Minh',
    addressDistrict: 'Quận 1',
    addressWard: 'Phường Bến Nghé',
    isAuthorized: false,
    taxAgentName: ''
  };

  // Dropdown options
  public readonly taxOfficeOptions = [
    { value: 'Chi cục Thuế Quận 1', label: 'Chi cục Thuế Quận 1' },
    { value: 'Chi cục Thuế Quận 3', label: 'Chi cục Thuế Quận 3' },
    { value: 'Chi cục Thuế Tp. Thủ Đức', label: 'Chi cục Thuế Tp. Thủ Đức' },
    { value: 'Chi cục Thuế Quận Bình Thạnh', label: 'Chi cục Thuế Quận Bình Thạnh' },
    { value: 'Cục Thuế Thành phố Hồ Chí Minh', label: 'Cục Thuế Thành phố Hồ Chí Minh' },
    { value: 'Cục Thuế Thành phố Hà Nội', label: 'Cục Thuế Thành phố Hà Nội' }
  ];

  public readonly provinceOptions = [
    { value: 'Thành phố Hồ Chí Minh', label: 'Thành phố Hồ Chí Minh' },
    { value: 'Thành phố Hà Nội', label: 'Thành phố Hà Nội' },
    { value: 'Thành phố Đà Nẵng', label: 'Thành phố Đà Nẵng' },
    { value: 'Tỉnh Bình Dương', label: 'Tỉnh Bình Dương' }
  ];

  // Tab 1: Declaration rows
  public declarationRows: TaxDeclarationRow[] = [];

  // Tab 2: Bank accounts (PL01)
  public bankAccounts: BankAccountRow[] = [];

  // S1a Transactions
  public s1aTransactions: S1aTransactionRow[] = [];

  // S2a, S2b, S2c, S2d, S2e
  public s2aAssets: S2aAssetRow[] = [];
  public s2bExpenses: S2bExpenseRow[] = [];
  public s2cSalaries: S2cSalaryRow[] = [];
  public s2dInventories: S2dInventoryRow[] = [];
  public s2eTaxObligations: S2eTaxObligationRow[] = [];

  ngOnInit() {
    this.logRow = this.modalData?.log || null;
    if (this.logRow) {
      this.period = this.logRow.period || null;
      if (this.period) {
        this.periodName = this.formatPeriodName(this.period);
      } else {
        this.periodName = 'Tháng 06/2026';
      }

      this.loadSavedData();
    }
  }

  public close() {
    this.modalRef.close(this.hasSaved);
  }

  private formatPeriodName(p: any): string {
    if (p.period_type === 'month') return `Tháng ${p.period_value}/${p.period_year}`;
    if (p.period_type === 'quarter') return `Quý ${p.period_value}/${p.period_year}`;
    return `Năm ${p.period_year}`;
  }

  private loadSavedData() {
    if (!this.period || !this.period.id) return;

    // Xác định các loại tài liệu cần tải dựa trên category đang mở (Lazy Loading)
    let documentTypes: string[] = [];
    const cat = this.logRow.category || '';
    if (cat.includes('Tờ khai')) {
      documentTypes = ['info', 'declaration', 'banks'];
    } else if (cat.includes('S1a')) {
      documentTypes = ['s1a'];
    } else if (cat.includes('S2a')) {
      documentTypes = ['s2a'];
    } else if (cat.includes('S2b')) {
      documentTypes = ['s2b'];
    } else if (cat.includes('S2c')) {
      documentTypes = ['s2c'];
    } else if (cat.includes('S2d')) {
      documentTypes = ['s2d'];
    } else if (cat.includes('S2e')) {
      documentTypes = ['s2e'];
    } else {
      // Mặc định tải hết nếu không khớp loại nào
      documentTypes = ['info', 'declaration', 'banks', 's1a', 's2a', 's2b', 's2c', 's2d', 's2e'];
    }

    const requests = documentTypes.map(docType => 
      this.taxService.getPeriodDetails(this.period.id, docType).pipe(
        catchError(() => of({ detail: null }))
      )
    );

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        const getData = (type: string) => {
          const idx = documentTypes.indexOf(type);
          return idx !== -1 ? results[idx]?.detail?.data : null;
        };

        // 1. Tax Info
        const infoRes = getData('info');
        if (infoRes) {
          this.taxInfo = infoRes;
        } else {
          this.taxInfo = {
            taxpayerName: 'Cửa hàng Cafe Blockchain',
            taxpayerMst: '8096245103',
            taxOffice: 'Chi cục Thuế Quận 1',
            addressStreet: '123 Đường Song Hành',
            addressProvince: 'Thành phố Hồ Chí Minh',
            addressDistrict: 'Quận 1',
            addressWard: 'Phường Bến Nghé',
            isAuthorized: false,
            taxAgentName: ''
          };
        }

        // 2. Declaration
        const decRes = getData('declaration');
        if (decRes) {
          this.declarationRows = decRes;
        } else {
          this.generateDeclarationRows();
        }

        // 3. Banks
        const banksRes = getData('banks');
        if (banksRes) {
          this.bankAccounts = banksRes;
        } else {
          this.bankAccounts = [
            {
              stt: 1,
              locationName: 'Trụ sở chính Cafe Blockchain',
              locationCode: '001',
              accountNumber: '1903456789012',
              accountOwner: 'NGUYEN VAN A',
              bankName: 'Techcombank',
              status: 'Khai lần đầu'
            }
          ];
        }

        // 4. S1a
        const s1aRes = getData('s1a');
        if (s1aRes) {
          this.s1aTransactions = s1aRes;
        } else {
          this.generateS1aTransactions();
        }

        // 5. S2a
        const s2aRes = getData('s2a');
        if (s2aRes) {
          this.s2aAssets = s2aRes;
        } else {
          this.generateS2aAssets();
        }

        // 6. S2b
        const s2bRes = getData('s2b');
        if (s2bRes) {
          this.s2bExpenses = s2bRes;
        } else {
          this.generateS2bExpenses();
        }

        // 7. S2c
        const s2cRes = getData('s2c');
        if (s2cRes) {
          this.s2cSalaries = s2cRes;
        } else {
          this.generateS2cSalaries();
        }

        // 8. S2d
        const s2dRes = getData('s2d');
        if (s2dRes) {
          this.s2dInventories = s2dRes;
        } else {
          this.generateS2dInventories();
        }

        // 9. S2e
        const s2eRes = getData('s2e');
        if (s2eRes) {
          this.s2eTaxObligations = s2eRes;
        } else {
          this.generateS2eTaxObligations();
        }
      },
      error: () => {
        this.toastService.showToast('Không thể tải dữ liệu kê khai từ máy chủ!', 'error');
        this.generateDeclarationRows();
        this.generateS1aTransactions();
        this.generateS2aAssets();
        this.generateS2bExpenses();
        this.generateS2cSalaries();
        this.generateS2dInventories();
        this.generateS2eTaxObligations();
      }
    });
  }

  private generateDeclarationRows() {
    const baseRows: TaxDeclarationRow[] = [
      { stt: '1', name: 'Hoạt động sản xuất kinh doanh hàng hóa, cung cấp dịch vụ có địa điểm kinh doanh cố định', code: '[08]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, isHeader: true },
      { stt: '1.1', name: 'Phân phối, cung cấp hàng hóa', code: '[08a]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, industryKey: 'distributor' },
      { stt: '1.2', name: 'Dịch vụ, xây dựng không bao thầu NVL', code: '[08b]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, industryKey: 'service' },
      { stt: '1.3', name: 'Cho thuê tài sản (trừ BĐS)', code: '[08c]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0 },
      { stt: '1.4', name: 'SX, vận tải, DV có gắn với HH, XD có bao thầu NVL', code: '[08d]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, industryKey: 'production' },
      { stt: '1.5', name: 'Hoạt động cung cấp sản phẩm nội dung thông tin số', code: '[08e]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0 },
      { stt: '1.6', name: 'Hoạt động kinh doanh khác', code: '[08g]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, industryKey: 'others' },
      { stt: '2', name: 'Hoạt động kinh doanh trên nền tảng thương mại điện tử, nền tảng số khác không có chức năng đặt hàng trực tuyến và thanh toán', code: '[09]', revVat: 0, exemptVat: 0, zeroVat: 0, payableVat: 0, revPit: 0, payablePit: 0, isHeader: true }
    ];

    const revAmount = this.period ? Number(this.period.revenue_amount) : 120000000;
    const estVat = this.period ? Number(this.period.estimated_vat) : 3600000;
    const estPit = this.period ? Number(this.period.estimated_pit) : 1800000;

    const profile = this.taxService.taxProfile();
    const isExempt = profile?.business_group === 1;

    if (profile) {
      if (profile.is_multi_industry && profile.industry_allocation) {
        baseRows.forEach(row => {
          if (row.industryKey && profile.industry_allocation[row.industryKey] > 0) {
            const pct = profile.industry_allocation[row.industryKey] / 100;
            const rowRev = revAmount * pct;
            
            row.revVat = isExempt ? 0 : rowRev;
            row.exemptVat = isExempt ? rowRev : 0;
            row.payableVat = isExempt ? 0 : estVat * pct;
            row.revPit = isExempt ? 0 : rowRev;
            row.payablePit = isExempt ? 0 : estPit * pct;
          }
        });
      } else {
        const primaryKey = profile.industry_type || 'production';
        baseRows.forEach(row => {
          if (row.industryKey === primaryKey) {
            row.revVat = isExempt ? 0 : revAmount;
            row.exemptVat = isExempt ? revAmount : 0;
            row.payableVat = isExempt ? 0 : estVat;
            row.revPit = isExempt ? 0 : revAmount;
            row.payablePit = isExempt ? 0 : estPit;
          }
        });
      }
    } else {
      baseRows.forEach(row => {
        if (row.industryKey === 'production') {
          row.revVat = revAmount;
          row.payableVat = estVat;
          row.revPit = revAmount;
          row.payablePit = estPit;
        }
      });
    }

    this.declarationRows = baseRows;
  }

  private generateS1aTransactions() {
    const revAmount = this.period ? Number(this.period.revenue_amount) : 120000000;
    if (revAmount === 0) {
      this.s1aTransactions = [];
      return;
    }

    const orderCount = Math.min(8, Math.max(1, Math.round(revAmount / 500000)));
    const list: S1aTransactionRow[] = [];
    let remaining = revAmount;

    for (let i = 1; i <= orderCount; i++) {
      const isLast = (i === orderCount);
      const orderRevenue = isLast ? remaining : Math.round((revAmount / orderCount) * (0.8 + Math.random() * 0.4));
      remaining -= orderRevenue;

      const dateDay = Math.min(28, i * 3);
      const monthVal = this.period ? this.period.period_value : 6;
      const yearVal = this.period ? this.period.period_year : 2026;
      const monthStr = monthVal < 10 ? `0${monthVal}` : `${monthVal}`;
      const dateStr = `${dateDay}/${monthStr}/${yearVal}`;

      list.push({
        stt: i,
        date: dateStr,
        code: `HD-${1000 + i}`,
        description: `Bán lẻ hóa đơn thanh toán Blockchain #${1000 + i}`,
        amount: orderRevenue
      });
    }

    this.s1aTransactions = list;
  }

  private generateS2aAssets() {
    this.s2aAssets = [
      {
        stt: 1,
        assetName: 'Máy pha cà phê Espresso chuyên nghiệp',
        assetCode: 'TSCĐ-01',
        purchaseDate: '15/01/2026',
        originalPrice: 45000000,
        depreciationAccumulated: 4500000,
        remainingValue: 40500000
      },
      {
        stt: 2,
        assetName: 'Tủ đông bảo quan nguyên liệu',
        assetCode: 'TSCĐ-02',
        purchaseDate: '20/01/2026',
        originalPrice: 15000000,
        depreciationAccumulated: 1500000,
        remainingValue: 13500000
      }
    ];
  }

  private generateS2bExpenses() {
    const expenseAmount = this.period ? Number(this.period.expense_amount) : 45000000;
    if (expenseAmount === 0) {
      this.s2bExpenses = [];
      return;
    }

    const monthVal = this.period ? this.period.period_value : 6;
    const yearVal = this.period ? this.period.period_year : 2026;
    const monthStr = monthVal < 10 ? `0${monthVal}` : `${monthVal}`;

    this.s2bExpenses = [
      {
        stt: 1,
        date: `05/${monthStr}/${yearVal}`,
        voucherCode: 'PC-01',
        description: 'Chi phí mua nguyên vật liệu hạt cà phê, sữa',
        laborExpense: 0,
        materialExpense: Math.round(expenseAmount * 0.5),
        managementExpense: 0,
        otherExpense: 0
      },
      {
        stt: 2,
        date: `10/${monthStr}/${yearVal}`,
        voucherCode: 'PC-02',
        description: 'Chi lương cho nhân viên phục vụ, pha chế',
        laborExpense: Math.round(expenseAmount * 0.3),
        materialExpense: 0,
        managementExpense: 0,
        otherExpense: 0
      },
      {
        stt: 3,
        date: `15/${monthStr}/${yearVal}`,
        voucherCode: 'PC-03',
        description: 'Chi phí tiền điện, nước, internet',
        laborExpense: 0,
        materialExpense: 0,
        managementExpense: Math.round(expenseAmount * 0.15),
        otherExpense: 0
      },
      {
        stt: 4,
        date: `25/${monthStr}/${yearVal}`,
        voucherCode: 'PC-04',
        description: 'Chi phí quảng cáo, sự kiện mini',
        laborExpense: 0,
        materialExpense: 0,
        managementExpense: 0,
        otherExpense: Math.round(expenseAmount * 0.05)
      }
    ];
  }

  private generateS2cSalaries() {
    this.s2cSalaries = [
      {
        stt: 1,
        employeeName: 'Nguyễn Văn Pha',
        baseSalary: 7000000,
        allowance: 500000,
        deduction: 200000,
        netSalary: 7300000,
        signature: 'Đã nhận'
      },
      {
        stt: 2,
        employeeName: 'Trần Thị Phục Vụ',
        baseSalary: 5500000,
        allowance: 300000,
        deduction: 0,
        netSalary: 5800000,
        signature: 'Đã nhận'
      }
    ];
  }

  private generateS2dInventories() {
    this.s2dInventories = [
      {
        stt: 1,
        itemCode: 'SP-001',
        itemName: 'Cà phê hạt Robusta Honey (kg)',
        unit: 'Kg',
        importQty: 50,
        exportQty: 35,
        stockQty: 15
      },
      {
        stt: 2,
        itemCode: 'SP-002',
        itemName: 'Sữa đặc Ngôi sao Phương Nam (hộp)',
        unit: 'Hộp',
        importQty: 120,
        exportQty: 90,
        stockQty: 30
      },
      {
        stt: 3,
        itemCode: 'SP-003',
        itemName: 'Ly giấy Cafe Blockchain (cái)',
        unit: 'Cái',
        importQty: 1000,
        exportQty: 750,
        stockQty: 250
      }
    ];
  }

  private generateS2eTaxObligations() {
    const estVat = this.period ? Number(this.period.estimated_vat) : 3600000;
    const estPit = this.period ? Number(this.period.estimated_pit) : 1800000;

    this.s2eTaxObligations = [
      {
        stt: 1,
        taxType: 'Thuế giá trị gia tăng (GTGT)',
        payableAmount: estVat,
        paidAmount: estVat,
        debtAmount: 0
      },
      {
        stt: 2,
        taxType: 'Thuế thu nhập cá nhân (TNCN)',
        payableAmount: estPit,
        paidAmount: estPit,
        debtAmount: 0
      }
    ];
  }

  // UI Actions
  public saveDeclaration() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    
    forkJoin([
      this.taxService.savePeriodDetails(this.period.id, 'info', this.taxInfo),
      this.taxService.savePeriodDetails(this.period.id, 'declaration', this.declarationRows),
      this.taxService.savePeriodDetails(this.period.id, 'banks', this.bankAccounts)
    ]).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu tờ khai thuế thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu tờ khai thuế thất bại!', 'error');
      }
    });
  }

  public saveS1a() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's1a', this.s1aTransactions).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S1a thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S1a thất bại!', 'error');
      }
    });
  }

  public saveS2a() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's2a', this.s2aAssets).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2a thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2a thất bại!', 'error');
      }
    });
  }

  public saveS2b() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's2b', this.s2bExpenses).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2b thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2b thất bại!', 'error');
      }
    });
  }

  public saveS2c() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's2c', this.s2cSalaries).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2c thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2c thất bại!', 'error');
      }
    });
  }

  public saveS2d() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's2d', this.s2dInventories).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2d thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2d thất bại!', 'error');
      }
    });
  }

  public saveS2e() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 's2e', this.s2eTaxObligations).subscribe({
      next: () => {
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2e thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu sổ S2e thất bại!', 'error');
      }
    });
  }

  public openInfoEdit() {
    this.isEditingInfo = true;
  }

  public closeInfoEdit() {
    this.isEditingInfo = false;
  }

  public saveInfo() {
    if (!this.period || !this.period.id) return;
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.taxService.savePeriodDetails(this.period.id, 'info', this.taxInfo).subscribe({
      next: () => {
        this.isEditingInfo = false;
        this.hasSaved = true;
        this.isSaving.set(false);
        this.toastService.showToast('Cập nhật thông tin khai thuế thành công!', 'success');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Cập nhật thông tin khai thuế thất bại!', 'error');
      }
    });
  }

  public downloadXml() {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<HSoThue xmlns="http://kekhaithue.gdt.gov.vn/TKhaiThue">
  <Header>
    <MaSoThue>${this.taxInfo.taxpayerMst}</MaSoThue>
    <TenNguoiNopThue>${this.taxInfo.taxpayerName}</TenNguoiNopThue>
    <CoQuanThueQuanLy>${this.taxInfo.taxOffice}</CoQuanThueQuanLy>
    <LoaiTờKhai>01/CNKD</LoaiTờKhai>
    <KyTinhThue>${this.periodName}</KyTinhThue>
  </Header>
  <Body>
    <ChiTieuCoBan>
      <DiaChi>${this.taxInfo.addressStreet}, ${this.taxInfo.addressWard}, ${this.taxInfo.addressDistrict}, ${this.taxInfo.addressProvince}</DiaChi>
    </ChiTieuCoBan>
    <BảngKêKhai>
      ${this.declarationRows.filter(r => !r.isHeader).map(r => `
      <DongChitieu>
        <STT>${r.stt}</STT>
        <MaChitieu>${r.code.replace('[', '').replace(']', '')}</MaChitieu>
        <DoanhThuGTGT>${r.revVat}</DoanhThuGTGT>
        <ThueGTGTPHaiNop>${r.payableVat}</ThueGTGTPHaiNop>
        <DoanhThuTNCN>${r.revPit}</DoanhThuTNCN>
        <ThueTNCNPHaiNop>${r.payablePit}</ThueTNCNPHaiNop>
      </DongChitieu>`).join('')}
    </BảngKêKhai>
  </Body>
</HSoThue>`;

    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `To_khai_01_CNKD_${this.periodName.replace('/', '_')}.xml`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.toastService.showToast('Đã tải xuống file tờ khai XML thành công!', 'success');
  }

  public downloadExcel() {
    const keyPrefix = `tax_data_${this.logRow.id}`;
    
    if (this.logRow.category.includes('Tờ khai')) {
      const fileName = `to_khai_thue_01_TKN_CNKD_${this.periodName.replace('/', '_')}.xlsx`;
      const rows: any[][] = [
        ['TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH'],
        ['Mẫu số: 01/CNKD (Ban hành kèm theo Thông tư số 40/2021/TT-BTC)'],
        [],
        ['Người nộp thuế:', this.taxInfo.taxpayerName],
        ['Mã số thuế:', this.taxInfo.taxpayerMst],
        ['Cơ quan thuế quản lý:', this.taxInfo.taxOffice],
        ['Địa chỉ trụ sở:', `${this.taxInfo.addressStreet}, ${this.taxInfo.addressWard}, ${this.taxInfo.addressDistrict}, ${this.taxInfo.addressProvince}`],
        ['Kỳ tính thuế:', this.periodName],
        [],
        ['STT', 'Mã chỉ tiêu', 'Chỉ tiêu', 'Doanh thu GTGT (VND)', 'Số thuế GTGT phải nộp (VND)', 'Doanh thu TNCN (VND)', 'Số thuế TNCN phải nộp (VND)']
      ];

      this.declarationRows.forEach(r => {
        rows.push([
          r.stt,
          r.code,
          r.name,
          r.revVat,
          r.payableVat,
          r.revPit,
          r.payablePit
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tờ khai 01.TKN-CNKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S1a')) {
      const fileName = `so_S1a_HKD_doanh_thu_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ'],
        ['Mẫu số: S1a-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Ngày, tháng ghi sổ', 'Số hiệu chứng từ', 'Ngày chứng từ', 'Diễn giải', 'Doanh thu bán lẻ (VND)']
      ];

      this.s1aTransactions.forEach(t => {
        tableRows.push([t.stt, t.date, t.code, t.date, t.description, t.amount]);
      });

      const total = this.getS1aTotal();
      tableRows.push(['', '', '', '', 'TỔNG CỘNG', total]);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S1a-HKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S2a')) {
      const fileName = `so_S2a_HKD_tai_san_co_dinh_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ CHI TIẾT TÀI SẢN CỐ ĐỊNH'],
        ['Mẫu số: S2a-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Tên tài sản cố định', 'Mã tài sản cố định', 'Ngày mua', 'Nguyên giá (VND)', 'Hao mòn lũy kế (VND)', 'Giá trị còn lại (VND)']
      ];
      this.s2aAssets.forEach(t => {
        tableRows.push([t.stt, t.assetName, t.assetCode, t.purchaseDate, t.originalPrice, t.depreciationAccumulated, t.remainingValue]);
      });
      const total = this.getS2aTotal();
      tableRows.push(['', '', '', '', total.originalPrice, total.depreciationAccumulated, total.remainingValue]);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S2a-HKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S2b')) {
      const fileName = `so_S2b_HKD_chi_phi_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ CHI PHÍ SẢN XUẤT, KINH DOANH'],
        ['Mẫu số: S2b-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Ngày ghi sổ', 'Số chứng từ', 'Diễn giải', 'Chi phí nhân công (VND)', 'Chi phí nguyên vật liệu (VND)', 'Chi phí quản lý (VND)', 'Chi phí khác (VND)']
      ];
      this.s2bExpenses.forEach(t => {
        tableRows.push([t.stt, t.date, t.voucherCode, t.description, t.laborExpense, t.materialExpense, t.managementExpense, t.otherExpense]);
      });
      const total = this.getS2bTotal();
      tableRows.push(['', '', '', 'TỔNG CỘNG', total.labor, total.material, total.management, total.other]);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S2b-HKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S2c')) {
      const fileName = `so_S2c_HKD_luong_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ THEO DÕI TÌNH HÌNH THANH TOÁN TIỀN LƯƠNG'],
        ['Mẫu số: S2c-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Họ và tên người lao động', 'Mức lương cơ bản (VND)', 'Phụ cấp (VND)', 'Các khoản giảm trừ (VND)', 'Thực lĩnh (VND)', 'Ký nhận']
      ];
      this.s2cSalaries.forEach(t => {
        tableRows.push([t.stt, t.employeeName, t.baseSalary, t.allowance, t.deduction, t.netSalary, t.signature]);
      });
      const total = this.getS2cTotal();
      tableRows.push(['', 'TỔNG CỘNG', total.base, total.allowance, total.deduction, total.net, '']);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S2c-HKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S2d')) {
      const fileName = `so_S2d_HKD_vat_tu_kho_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ CHI TIẾT VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA'],
        ['Mẫu số: S2d-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Mã hàng hóa', 'Tên hàng hóa, vật tư', 'Đơn vị tính', 'Số lượng nhập', 'Số lượng xuất', 'Tồn kho cuối kỳ']
      ];
      this.s2dInventories.forEach(t => {
        tableRows.push([t.stt, t.itemCode, t.itemName, t.unit, t.importQty, t.exportQty, t.stockQty]);
      });
      const total = this.getS2dTotal();
      tableRows.push(['', '', 'TỔNG CỘNG', '', total.import, total.export, total.stock]);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S2d-HKD');
      XLSX.writeFile(wb, fileName);
    } else if (this.logRow.category.includes('S2e')) {
      const fileName = `so_S2e_HKD_nghia_vu_thue_${this.periodName.replace('/', '_')}.xlsx`;
      const tableRows: any[][] = [
        ['SỔ THEO DÕI THỰC HIỆN NGHĨA VỤ THUẾ VỚI NSNN'],
        ['Mẫu số: S2e-HKD (Ban hành kèm theo Thông tư số 88/2021/TT-BTC)'],
        [],
        ['Kỳ ghi sổ:', this.periodName],
        ['Chủ sở hữu:', this.taxInfo.taxpayerName],
        [],
        ['STT', 'Loại thuế phát sinh', 'Số thuế phải nộp (VND)', 'Số thuế đã nộp (VND)', 'Số thuế còn nợ (VND)']
      ];
      this.s2eTaxObligations.forEach(t => {
        tableRows.push([t.stt, t.taxType, t.payableAmount, t.paidAmount, t.debtAmount]);
      });
      const total = this.getS2eTotal();
      tableRows.push(['', 'TỔNG CỘNG', total.payable, total.paid, total.debt]);

      const ws = XLSX.utils.aoa_to_sheet(tableRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sổ S2e-HKD');
      XLSX.writeFile(wb, fileName);
    }

    this.toastService.showToast('Tải file Excel thành công!', 'success');
  }

  // PL01 BK-STK Actions
  public addBankRow() {
    const nextStt = this.bankAccounts.length + 1;
    this.bankAccounts.push({
      stt: nextStt,
      locationName: 'Chi nhánh Cafe Blockchain mới',
      locationCode: '00' + nextStt,
      accountNumber: '1903' + Math.floor(100000000 + Math.random() * 900000000),
      accountOwner: this.taxInfo.taxpayerName.toUpperCase(),
      bankName: 'Vietcombank',
      status: 'Khai lần đầu'
    });
    this.toastService.showToast('Đã thêm một tài khoản ngân hàng mới!', 'success');
  }

  public removeBankRow(stt: number) {
    this.bankAccounts = this.bankAccounts.filter(b => b.stt !== stt);
    this.bankAccounts.forEach((b, idx) => b.stt = idx + 1);
  }

  // S1a Actions
  public addS1aRow() {
    const nextStt = this.s1aTransactions.length + 1;
    const now = new Date();
    const day = now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`;
    const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const dateStr = `${day}/${month}/${now.getFullYear()}`;

    this.s1aTransactions.push({
      stt: nextStt,
      date: dateStr,
      code: `HD-${1000 + nextStt}`,
      description: `Bán lẻ hóa đơn trực tiếp tại quầy #${1000 + nextStt}`,
      amount: 150000
    });
  }

  public removeS1aRow(stt: number) {
    this.s1aTransactions = this.s1aTransactions.filter(t => t.stt !== stt);
    this.s1aTransactions.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS1aTotal(): number {
    return this.s1aTransactions.reduce((sum, t) => sum + t.amount, 0);
  }

  // S2a Actions
  public addS2aRow() {
    const nextStt = this.s2aAssets.length + 1;
    this.s2aAssets.push({
      stt: nextStt,
      assetName: 'Thiết bị dụng cụ mới',
      assetCode: `TSCĐ-0${nextStt}`,
      purchaseDate: '01/06/2026',
      originalPrice: 10000000,
      depreciationAccumulated: 0,
      remainingValue: 10000000
    });
  }

  public removeS2aRow(stt: number) {
    this.s2aAssets = this.s2aAssets.filter(t => t.stt !== stt);
    this.s2aAssets.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS2aTotal() {
    return this.s2aAssets.reduce(
      (acc, t) => {
        acc.originalPrice += t.originalPrice;
        acc.depreciationAccumulated += t.depreciationAccumulated;
        acc.remainingValue += t.remainingValue;
        return acc;
      },
      { originalPrice: 0, depreciationAccumulated: 0, remainingValue: 0 }
    );
  }

  // S2b Actions
  public addS2bRow() {
    const nextStt = this.s2bExpenses.length + 1;
    const now = new Date();
    const day = now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`;
    const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const dateStr = `${day}/${month}/${now.getFullYear()}`;

    this.s2bExpenses.push({
      stt: nextStt,
      date: dateStr,
      voucherCode: `PC-0${nextStt}`,
      description: 'Chi phí mua sắm vật tư khác',
      laborExpense: 0,
      materialExpense: 200000,
      managementExpense: 0,
      otherExpense: 0
    });
  }

  public removeS2bRow(stt: number) {
    this.s2bExpenses = this.s2bExpenses.filter(t => t.stt !== stt);
    this.s2bExpenses.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS2bTotal() {
    return this.s2bExpenses.reduce(
      (acc, t) => {
        acc.labor += t.laborExpense;
        acc.material += t.materialExpense;
        acc.management += t.managementExpense;
        acc.other += t.otherExpense;
        return acc;
      },
      { labor: 0, material: 0, management: 0, other: 0 }
    );
  }

  // S2c Actions
  public addS2cRow() {
    const nextStt = this.s2cSalaries.length + 1;
    this.s2cSalaries.push({
      stt: nextStt,
      employeeName: 'Nhân viên thời vụ mới',
      baseSalary: 3000000,
      allowance: 0,
      deduction: 0,
      netSalary: 3000000,
      signature: 'Chưa ký'
    });
  }

  public removeS2cRow(stt: number) {
    this.s2cSalaries = this.s2cSalaries.filter(t => t.stt !== stt);
    this.s2cSalaries.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS2cTotal() {
    return this.s2cSalaries.reduce(
      (acc, t) => {
        acc.base += t.baseSalary;
        acc.allowance += t.allowance;
        acc.deduction += t.deduction;
        acc.net += t.netSalary;
        return acc;
      },
      { base: 0, allowance: 0, deduction: 0, net: 0 }
    );
  }

  // S2d Actions
  public addS2dRow() {
    const nextStt = this.s2dInventories.length + 1;
    this.s2dInventories.push({
      stt: nextStt,
      itemCode: `SP-00${nextStt}`,
      itemName: 'Nguyên liệu cà phê pha phin',
      unit: 'Kg',
      importQty: 10,
      exportQty: 5,
      stockQty: 5
    });
  }

  public removeS2dRow(stt: number) {
    this.s2dInventories = this.s2dInventories.filter(t => t.stt !== stt);
    this.s2dInventories.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS2dTotal() {
    return this.s2dInventories.reduce(
      (acc, t) => {
        acc.import += t.importQty;
        acc.export += t.exportQty;
        acc.stock += t.stockQty;
        return acc;
      },
      { import: 0, export: 0, stock: 0 }
    );
  }

  // S2e Actions
  public addS2eRow() {
    const nextStt = this.s2eTaxObligations.length + 1;
    this.s2eTaxObligations.push({
      stt: nextStt,
      taxType: 'Lệ phí môn bài',
      payableAmount: 300000,
      paidAmount: 300000,
      debtAmount: 0
    });
  }

  public removeS2eRow(stt: number) {
    this.s2eTaxObligations = this.s2eTaxObligations.filter(t => t.stt !== stt);
    this.s2eTaxObligations.forEach((t, idx) => t.stt = idx + 1);
  }

  public getS2eTotal() {
    return this.s2eTaxObligations.reduce(
      (acc, t) => {
        acc.payable += t.payableAmount;
        acc.paid += t.paidAmount;
        acc.debt += t.debtAmount;
        return acc;
      },
      { payable: 0, paid: 0, debt: 0 }
    );
  }
}
