import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class DebtStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly debts = signal<any[]>([]);
  public readonly isDebtsLoading = signal<boolean>(false);
  public readonly totalDebts = signal<number>(0);
  public readonly debtCurrentPage = signal<number>(1);
  public readonly debtItemsPerPage = 10;
  public readonly totalDebtOutstanding = signal<number>(0);
  public readonly totalDebtorsCount = signal<number>(0);

  /**
   * Tải danh sách công nợ từ backend
   */
  public refreshDebts(hasPermission: boolean, searchFilter: string = '', statusFilter: string = 'all', page: number = this.debtCurrentPage()) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isDebtsLoading()) return;
    this.isDebtsLoading.set(true);
    this.debtCurrentPage.set(page);

    this.apiService.getDebts(searchFilter, statusFilter, page, this.debtItemsPerPage).subscribe({
      next: (res: any) => {
        if (res && res.paginated) {
          this.debts.set(res.paginated.data || []);
          this.totalDebts.set(res.paginated.total || 0);
          this.debtCurrentPage.set(res.paginated.current_page || page);
          this.totalDebtOutstanding.set(res.total_debt_outstanding || 0);
          this.totalDebtorsCount.set(res.total_debtors_count || 0);
        } else if (res && res.data) {
          this.debts.set(res.data || []);
          this.totalDebts.set(res.total || 0);
          this.debtCurrentPage.set(res.current_page || page);
        } else {
          this.debts.set(res || []);
          this.totalDebts.set(Array.isArray(res) ? res.length : 0);
        }
        this.isDebtsLoading.set(false);
      },
      error: (err) => {
        console.error('[DebtStore] Lỗi tải danh sách nợ:', err);
        this.isDebtsLoading.set(false);
      }
    });
  }
}
