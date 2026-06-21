import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly staffs = signal<any[]>([]);
  public readonly roles = signal<any[]>([]);
  public readonly isStaffsLoading = signal<boolean>(false);

  /**
   * Tải danh sách nhân viên và vai trò từ backend
   */
  public refreshStaffsAndRoles(hasPermission: boolean) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;
    
    if (this.isStaffsLoading()) return;
    this.isStaffsLoading.set(true);

    forkJoin({
      staffs: this.apiService.getStaffs(10 * 60 * 1000),
      roles: this.apiService.getRoles(10 * 60 * 1000)
    }).subscribe({
      next: (res) => {
        this.staffs.set(res.staffs || []);
        this.roles.set(res.roles || []);
        this.isStaffsLoading.set(false);
      },
      error: (err) => {
        console.error('[StaffStore] Lỗi tải nhân viên & vai trò:', err);
        this.isStaffsLoading.set(false);
      }
    });
  }

  /**
   * Khôi phục các vai trò mặc định của hệ thống
   */
  public resetDefaultRoles(showToastCallback: (msg: string, type: 'success' | 'error') => void) {
    if (this.isStaffsLoading()) return;
    this.isStaffsLoading.set(true);

    this.apiService.resetDefaultRoles().subscribe({
      next: () => {
        this.isStaffsLoading.set(false);
        showToastCallback('Khôi phục vai trò mặc định thành công', 'success');
        this.refreshStaffsAndRoles(true);
      },
      error: (err) => {
        console.error('[StaffStore] Lỗi khôi phục vai trò mặc định:', err);
        this.isStaffsLoading.set(false);
        showToastCallback(err.error?.message || 'Không thể khôi phục vai trò mặc định', 'error');
      }
    });
  }
}
