import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly areas = signal<any[]>([]);
  public readonly diningTables = signal<any[]>([]);
  public readonly isTablesLoading = signal<boolean>(false);

  /**
   * Tải sơ đồ bàn ăn và khu vực
   */
  public refreshTablesAndAreas(hasPermission: boolean) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isTablesLoading()) return;
    this.isTablesLoading.set(true);

    forkJoin({
      areas: this.apiService.getAreas(),
      tables: this.apiService.getDiningTables()
    }).subscribe({
      next: (res) => {
        this.areas.set(res.areas || []);
        this.diningTables.set(res.tables || []);
        this.isTablesLoading.set(false);
      },
      error: (err) => {
        console.error('[TableStore] Lỗi tải sơ đồ bàn/khu vực:', err);
        this.isTablesLoading.set(false);
      }
    });
  }
}
