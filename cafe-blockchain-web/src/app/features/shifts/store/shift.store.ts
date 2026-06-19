import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States
  public readonly isShiftsLoading = signal<boolean>(false);
  public readonly currentShift = signal<any>(null);
  public readonly shifts = signal<any[]>([]);
  public readonly shiftDurationString = signal<string>('00:00:00');
  
  public readonly isCloseShiftModalOpen = signal<boolean>(false);
  public readonly isShiftSummaryLoading = signal<boolean>(false);
  public readonly shiftSummary = signal<any>(null);
  public readonly actualCashInput = signal<number>(0);
  public readonly closeShiftNote = signal<string>('');
  
  public readonly isStartShiftModalOpen = signal<boolean>(false);
  public readonly initialCashInput = signal<number>(0);
  
  private shiftTimerInterval: any = null;

  // Computed properties
  public readonly actualCashFormatted = computed(() => {
    const val = this.actualCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });

  public readonly initialCashFormatted = computed(() => {
    const val = this.initialCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });

  public readonly shiftFiatRevenue = computed(() => this.shiftSummary()?.payment_revenues?.cash ?? 0);
  public readonly shiftBankTransferRevenue = computed(() => this.shiftSummary()?.payment_revenues?.bank_transfer ?? 0);
  public readonly shiftCryptoRevenue = computed(() => this.shiftSummary()?.payment_revenues?.crypto ?? 0);
  public readonly shiftEWalletRevenue = computed(() => this.shiftSummary()?.payment_revenues?.e_wallet ?? 0);
  public readonly shiftFiatExpenses = computed(() => this.shiftSummary()?.payment_expenses?.cash ?? 0);
  public readonly shiftExpectedCash = computed(() => this.shiftSummary()?.expected_cash ?? 0);

  // Methods
  public startShiftTimer(startTimeIso: string) {
    this.stopShiftTimer();
    this.updateShiftDuration(startTimeIso);
    if (typeof window !== 'undefined') {
      this.shiftTimerInterval = setInterval(() => {
        this.updateShiftDuration(startTimeIso);
      }, 1000);
    }
  }

  public stopShiftTimer() {
    if (this.shiftTimerInterval) {
      clearInterval(this.shiftTimerInterval);
      this.shiftTimerInterval = null;
    }
    this.shiftDurationString.set('00:00:00');
  }

  private updateShiftDuration(startTimeIso: string) {
    const start = new Date(startTimeIso).getTime();
    if (isNaN(start)) {
      this.shiftDurationString.set('00:00:00');
      return;
    }
    const now = Date.now();
    const diff = Math.max(0, now - start); // ms

    const totalSecs = Math.floor(diff / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    this.shiftDurationString.set(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
  }

  public refreshCurrentShift(hasShiftsPermission: boolean, onSuccess?: (shift: any) => void) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasShiftsPermission) return;

    this.apiService.getCurrentShift().subscribe({
      next: (res) => {
        this.currentShift.set(res || null);
        if (res && res.status === 'open') {
          this.apiService.getShiftSummary().subscribe({
            next: (sum) => {
              this.shiftSummary.set(sum || null);
              if (onSuccess) onSuccess(res || null);
            },
            error: (err) => {
              console.error('[ShiftStore] Lỗi tải summary ca trực khi refresh:', err);
              if (onSuccess) onSuccess(res || null);
            }
          });
        } else {
          this.shiftSummary.set(null);
          if (onSuccess) onSuccess(res || null);
        }
      },
      error: (err) => {
        console.error('[ShiftStore] Lỗi tải ca trực hiện tại:', err);
      }
    });
  }

  public refreshShifts(hasShiftsPermission: boolean) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasShiftsPermission) return;
    if (this.isShiftsLoading()) return;
    this.isShiftsLoading.set(true);

    this.apiService.getShifts().subscribe({
      next: (res) => {
        this.shifts.set(res || []);
        this.isShiftsLoading.set(false);
      },
      error: (err) => {
        console.error('[ShiftStore] Lỗi tải danh sách ca làm việc:', err);
        this.isShiftsLoading.set(false);
      }
    });
  }

  public openShift(initialCash: number, options?: { onSuccess?: (res: any) => void, onError?: (err: any) => void }) {
    if (!this.web3Service.walletConnected()) return;
    
    this.apiService.openShift(initialCash).subscribe({
      next: (res) => {
        this.currentShift.set(res.data || res.shift || res);
        if (options?.onSuccess) options.onSuccess(res);
      },
      error: (err) => {
        console.error('[ShiftStore] Lỗi mở ca:', err);
        if (options?.onError) options.onError(err);
      }
    });
  }

  public closeShift(actualCash: number, note?: string, options?: { onSuccess?: (res: any) => void, onError?: (err: any) => void }) {
    if (!this.web3Service.walletConnected()) return;

    this.apiService.closeShift(actualCash, note).subscribe({
      next: (res) => {
        this.currentShift.set(null);
        if (options?.onSuccess) options.onSuccess(res);
      },
      error: (err) => {
        console.error('[ShiftStore] Lỗi kết ca:', err);
        if (options?.onError) options.onError(err);
      }
    });
  }
}
