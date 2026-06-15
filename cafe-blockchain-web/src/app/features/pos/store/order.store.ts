import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class OrderStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly orders = signal<any[]>([]);
  public readonly isOrdersLoading = signal<boolean>(false);

  /**
   * Refresh danh sách đơn hàng từ API
   */
  public refreshOrders(statusFilter: string = 'all', blockchainFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    
    if (this.isOrdersLoading()) return;
    this.isOrdersLoading.set(true);

    this.apiService.getOrders(statusFilter, blockchainFilter).subscribe({
      next: (res) => {
        this.orders.set(res || []);
        this.isOrdersLoading.set(false);
      },
      error: (err) => {
        console.error('[OrderStore] Lỗi tải danh sách đơn hàng:', err);
        this.isOrdersLoading.set(false);
      }
    });
  }
}
