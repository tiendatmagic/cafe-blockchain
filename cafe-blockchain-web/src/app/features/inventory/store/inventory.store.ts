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

  /**
   * Tải danh sách phiếu kho từ backend
   */
  public refreshInventory(hasPermission: boolean, typeFilter: string = 'all') {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isInventoryLoading()) return;
    this.isInventoryLoading.set(true);

    this.apiService.getInventoryRecords(typeFilter).subscribe({
      next: (res) => {
        this.inventoryRecords.set(res || []);
        this.isInventoryLoading.set(false);
      },
      error: (err) => {
        console.error('[InventoryStore] Lỗi tải kho hàng:', err);
        this.isInventoryLoading.set(false);
      }
    });
  }
}
