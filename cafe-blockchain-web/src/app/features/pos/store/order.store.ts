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
  public readonly totalOrders = signal<number>(0);
  public readonly ordersCurrentPage = signal<number>(1);
  public readonly ordersItemsPerPage = 10;

  /**
   * Refresh danh sách đơn hàng từ API
   */
  public refreshOrders(statusFilter: string = 'all', blockchainFilter: string = 'all', page: number = 1, searchQuery: string = '') {
    if (!this.web3Service.walletConnected()) return;
    
    if (this.isOrdersLoading()) return;
    this.isOrdersLoading.set(true);
    this.ordersCurrentPage.set(page);

    this.apiService.getOrders(statusFilter, blockchainFilter, page, this.ordersItemsPerPage, searchQuery).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.orders.set(res.data || []);
          this.totalOrders.set(res.total || 0);
          this.ordersCurrentPage.set(res.current_page || page);
        } else {
          this.orders.set(res || []);
          this.totalOrders.set(Array.isArray(res) ? res.length : 0);
        }
        this.isOrdersLoading.set(false);
      },
      error: (err) => {
        console.error('[OrderStore] Lỗi tải danh sách đơn hàng:', err);
        this.isOrdersLoading.set(false);
      }
    });
  }
}
