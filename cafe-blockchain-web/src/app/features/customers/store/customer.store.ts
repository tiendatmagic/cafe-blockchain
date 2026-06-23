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
  public readonly totalCustomers = signal<number>(0);
  public readonly customerCurrentPage = signal<number>(1);
  public readonly customerItemsPerPage = 10;
  
  public refreshCustomers(
    hasPermission: boolean,
    force: boolean = false,
    page?: number,
    limit: number = this.customerItemsPerPage,
    search?: string,
    groupId?: number
  ) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;

    if (this.isCustomersLoading()) return;
    this.isCustomersLoading.set(true);

    if (page !== undefined) {
      this.customerCurrentPage.set(page);
    }

    forkJoin({
      customers: this.apiService.getCustomers(search, limit, page, 5 * 60 * 1000, force, groupId),
      groups: this.apiService.getCustomerGroups(5 * 60 * 1000, force)
    }).subscribe({
      next: (res: any) => {
        if (res.customers && res.customers.data) {
          this.customers.set(res.customers.data || []);
          this.totalCustomers.set(res.customers.total || 0);
          if (page !== undefined) {
            this.customerCurrentPage.set(res.customers.current_page || page);
          }
        } else {
          this.customers.set(res.customers || []);
          this.totalCustomers.set(Array.isArray(res.customers) ? res.customers.length : 0);
        }
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
