import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly transactions = signal<any[]>([]);
  public readonly isTransactionsLoading = signal<boolean>(false);
  public readonly totalTransactions = signal<number>(0);
  public readonly transactionCurrentPage = signal<number>(1);
  public readonly transactionItemsPerPage = 10;
  public readonly totalIncome = signal<number>(0);
  public readonly totalExpense = signal<number>(0);

  /**
   * Tải danh sách giao dịch thu chi từ backend
   */
  public refreshTransactions(hasPermission: boolean, typeFilter: string = 'all', page: number = this.transactionCurrentPage(), search: string = '') {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isTransactionsLoading()) return;
    this.isTransactionsLoading.set(true);
    this.transactionCurrentPage.set(page);

    this.apiService.getTransactions(typeFilter, undefined, page, this.transactionItemsPerPage, search).subscribe({
      next: (res: any) => {
        if (res && res.paginated) {
          this.transactions.set(res.paginated.data || []);
          this.totalTransactions.set(res.paginated.total || 0);
          this.transactionCurrentPage.set(res.paginated.current_page || page);
          this.totalIncome.set(res.total_income || 0);
          this.totalExpense.set(res.total_expense || 0);
        } else if (res && res.data) {
          this.transactions.set(res.data || []);
          this.totalTransactions.set(res.total || 0);
          this.transactionCurrentPage.set(res.current_page || page);
        } else {
          this.transactions.set(res || []);
          this.totalTransactions.set(Array.isArray(res) ? res.length : 0);
        }
        this.isTransactionsLoading.set(false);
      },
      error: (err) => {
        console.error('[TransactionStore] Lỗi tải thu chi:', err);
        this.isTransactionsLoading.set(false);
      }
    });
  }
}
