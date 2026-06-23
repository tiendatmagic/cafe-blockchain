import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly inventoryRecords = signal<any[]>([]);
  public readonly isInventoryLoading = signal<boolean>(false);
  public readonly totalInventoryRecords = signal<number>(0);
  public readonly inventoryCurrentPage = signal<number>(1);
  public readonly inventoryItemsPerPage = 10;

  /**
   * Tải danh sách phiếu kho từ backend
   */
  public refreshInventory(hasPermission: boolean, typeFilter: string = 'all', page: number = this.inventoryCurrentPage(), searchQuery?: string) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isInventoryLoading()) return;
    this.isInventoryLoading.set(true);
    this.inventoryCurrentPage.set(page);

    this.apiService.getInventoryRecords(typeFilter, page, this.inventoryItemsPerPage, searchQuery).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.inventoryRecords.set(res.data || []);
          this.totalInventoryRecords.set(res.total || 0);
          this.inventoryCurrentPage.set(res.current_page || page);
        } else {
          this.inventoryRecords.set(res || []);
          this.totalInventoryRecords.set(Array.isArray(res) ? res.length : 0);
        }
        this.isInventoryLoading.set(false);
      },
      error: (err) => {
        console.error('[InventoryStore] Lỗi tải kho hàng:', err);
        this.isInventoryLoading.set(false);
      }
    });
  }
}
