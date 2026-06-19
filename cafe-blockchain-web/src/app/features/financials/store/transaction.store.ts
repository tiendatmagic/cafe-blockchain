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

  /**
   * Tải danh sách giao dịch thu chi từ backend
   */
  public refreshTransactions(hasPermission: boolean, typeFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isTransactionsLoading()) return;
    this.isTransactionsLoading.set(true);

    this.apiService.getTransactions(typeFilter).subscribe({
      next: (res) => {
        this.transactions.set(res || []);
        this.isTransactionsLoading.set(false);
      },
      error: (err) => {
        console.error('[TransactionStore] Lỗi tải thu chi:', err);
        this.isTransactionsLoading.set(false);
      }
    });
  }
}
