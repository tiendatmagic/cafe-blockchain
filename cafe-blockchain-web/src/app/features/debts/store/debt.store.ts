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

  /**
   * Tải danh sách công nợ từ backend
   */
  public refreshDebts(hasPermission: boolean, searchFilter: string = '', statusFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isDebtsLoading()) return;
    this.isDebtsLoading.set(true);

    this.apiService.getDebts(searchFilter, statusFilter).subscribe({
      next: (res) => {
        this.debts.set(res || []);
        this.isDebtsLoading.set(false);
      },
      error: (err) => {
        console.error('[DebtStore] Lỗi tải danh sách nợ:', err);
        this.isDebtsLoading.set(false);
      }
    });
  }
}
