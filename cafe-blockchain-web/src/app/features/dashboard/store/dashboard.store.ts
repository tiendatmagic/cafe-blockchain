import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly dashboardStartDate = signal<string>('');
  public readonly dashboardEndDate = signal<string>('');
  public readonly dashboardData = signal<any>(null);
  public readonly isDashboardLoading = signal<boolean>(false);
  
  public refreshDashboard(hasPermission: boolean, force: boolean = false) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;

    if (this.isDashboardLoading()) return;
    this.isDashboardLoading.set(true);

    this.apiService.getDashboard(this.dashboardStartDate(), this.dashboardEndDate(), 5 * 60 * 1000, force).subscribe({
      next: (res) => {
        this.dashboardData.set(res);
        this.isDashboardLoading.set(false);
      },
      error: (err) => {
        console.error('[DashboardStore] Lỗi tải dashboard:', err);
        this.isDashboardLoading.set(false);
      }
    });
  }
}
