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
  
  public refreshCustomers(hasPermission: boolean, force: boolean = false) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;

    if (this.isCustomersLoading()) return;
    this.isCustomersLoading.set(true);

    forkJoin({
      customers: this.apiService.getCustomers(undefined, undefined, 5 * 60 * 1000, force),
      groups: this.apiService.getCustomerGroups(5 * 60 * 1000, force)
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers || []);
        this.customerGroups.set(res.groups || []);
        this.isCustomersLoading.set(false);
      },
      error: (err) => {
        console.error('[CustomerStore] Lỗi tải khách hàng:', err);
        this.isCustomersLoading.set(false);
      }
    });
  }
}
