import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly customers = signal<any[]>([]);
  public readonly customerGroups = signal<any[]>([]);
  public readonly isCustomersLoading = signal<boolean>(false);
  
  public lastCustomersLoadTimestamp = 0;

  /**
   * Tải danh sách khách hàng và nhóm khách hàng
   */
  public refreshCustomers(hasPermission: boolean, force: boolean = false) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;

    const now = Date.now();
    if (!force && this.customers().length > 0 && (now - this.lastCustomersLoadTimestamp < 5 * 60 * 1000)) {
      return;
    }

    if (this.isCustomersLoading()) return;
    this.isCustomersLoading.set(true);

    forkJoin({
      customers: this.apiService.getCustomers(),
      groups: this.apiService.getCustomerGroups()
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers || []);
        this.customerGroups.set(res.groups || []);
        this.lastCustomersLoadTimestamp = Date.now();
        this.isCustomersLoading.set(false);
      },
      error: (err) => {
        console.error('[CustomerStore] Lỗi tải khách hàng:', err);
        this.isCustomersLoading.set(false);
      }
    });
  }
}
