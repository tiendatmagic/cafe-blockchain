import { Injectable, inject, signal, effect, untracked } from '@angular/core';
import { ShiftStore } from '@features/shifts/store/shift.store';
import { Web3Service } from './web3.service';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private readonly shiftStore = inject(ShiftStore);
  private readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);

  public isLoading = signal<boolean>(false);
  public isShiftSkipped = signal<boolean>(false);

  public skipShift() {
    this.isShiftSkipped.set(true);
  }

  public readonly currentShift = this.shiftStore.currentShift;
  public readonly isCurrentShiftLoading = this.shiftStore.isCurrentShiftLoading;
  public readonly shifts = this.shiftStore.shifts;
  public readonly totalShifts = this.shiftStore.totalShifts;
  public readonly shiftsCurrentPage = this.shiftStore.shiftsCurrentPage;
  public readonly shiftsItemsPerPage = this.shiftStore.shiftsItemsPerPage;
  public readonly isStartShiftModalOpen = this.shiftStore.isStartShiftModalOpen;
  public readonly isCloseShiftModalOpen = this.shiftStore.isCloseShiftModalOpen;
  public readonly initialCashInput = this.shiftStore.initialCashInput;
  public readonly actualCashInput = this.shiftStore.actualCashInput;
  public readonly initialCashFormatted = this.shiftStore.initialCashFormatted;
  public readonly actualCashFormatted = this.shiftStore.actualCashFormatted;
  public readonly closeShiftNote = this.shiftStore.closeShiftNote;
  public readonly isSubmittingShift = this.isLoading;
  public readonly shiftSummary = this.shiftStore.shiftSummary;
  public readonly isShiftSummaryLoading = this.shiftStore.isShiftSummaryLoading;
  public readonly shiftDurationString = this.shiftStore.shiftDurationString;
  public readonly isShiftsLoading = this.shiftStore.isShiftsLoading;
  public readonly shiftExpectedCash = this.shiftStore.shiftExpectedCash;
 
  private lastShiftSummaryLoadedTime = 0;
 
  constructor() {
    // 1. Tự động nạp ca trực ban đầu dưới nền khi đăng nhập ví thành công
    effect(() => {
      if (this.web3Service.walletConnected() && this.authService.isAuthLoggedIn()) {
        untracked(() => {
          this.loadShiftDataInitially();
        });
      }
    }, { allowSignalWrites: true });
 
    // 2. Tự động đếm thời gian trôi qua của ca làm việc
    effect(() => {
      const shift = this.currentShift();
      if (shift && shift.start_time) {
        this.shiftStore.startShiftTimer(shift.start_time);
      } else {
        this.shiftStore.stopShiftTimer();
      }
    }, { allowSignalWrites: true });
  }
 
  private loadShiftDataInitially() {
    this.isShiftSkipped.set(false);
    if (this.authService.hasPermission('shifts') && this.authService.hasFeature('enable_shifts')) {
      this.refreshCurrentShift();
    } else {
      this.shiftStore.currentShift.set(null);
      this.shiftStore.shiftSummary.set(null);
      this.shiftStore.isCurrentShiftLoading.set(false);
    }
  }
 
  // Trạng thái blocked của subscription (sẽ được delegate hoặc check thông qua AuthService)
  private isSubscriptionBlocked() {
    // Để tránh phụ thuộc chéo vòng phức tạp, ta sẽ tự check dựa trên trạng thái thuê bao của AuthService
    if (this.authService.isSuperAdmin()) return false;
    if (this.authService.subscriptionStatus() === 'suspended') return true;
    
    const expiresAt = this.authService.subscriptionExpiresAt();
    if (expiresAt) {
      return new Date().getTime() > new Date(expiresAt).getTime();
    }
    return false;
  }
 
  public refreshCurrentShift(ttl?: number | ((shift: any) => void), force?: boolean, onSuccess?: (shift: any) => void) {
    if (this.isSubscriptionBlocked()) return;
    this.shiftStore.refreshCurrentShift(
      this.authService.hasPermission('shifts') && this.authService.hasFeature('enable_shifts'),
      ttl,
      force,
      onSuccess
    );
  }
 
  public refreshShifts(page: number = 1, startDate?: string, endDate?: string, status?: string, search?: string) {
    if (this.isSubscriptionBlocked()) return;
    this.shiftStore.refreshShifts(
      this.authService.hasPermission('shifts') && this.authService.hasFeature('enable_shifts'),
      page,
      startDate,
      endDate,
      status,
      search
    );
  }

  public openShift(initialCash: number, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (!this.authService.hasFeature('enable_shifts')) return;
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.shiftStore.openShift(initialCash, {
      onSuccess: (res) => {
        this.isLoading.set(false);
        this.isShiftSkipped.set(false);
        this.toastService.showToast('Vào ca làm việc thành công', 'success');
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        this.isLoading.set(false);
        this.toastService.showToast(err.error?.message || 'Không thể mở ca làm việc', 'error');
      }
    });
  }

  public closeShift(actualCash: number | null, note?: string, onSuccess?: () => void) {
    if (!this.web3Service.walletConnected()) return;
    if (!this.authService.hasFeature('enable_shifts')) return;
    if (actualCash === null || actualCash === undefined) {
      this.toastService.showToast('Vui lòng nhập số tiền mặt thực tế kiểm đếm!', 'error');
      return;
    }
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.shiftStore.closeShift(actualCash, note, {
      onSuccess: (res) => {
        this.isLoading.set(false);
        this.isShiftSkipped.set(false);
        this.toastService.showToast('Kết thúc ca trực thành công', 'success');
        if (onSuccess) onSuccess();
        this.refreshShifts();
      },
      onError: (err) => {
        this.isLoading.set(false);
        this.toastService.showToast(err.error?.message || 'Không thể kết thúc ca làm việc', 'error');
      }
    });
  }

  public onActualCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = cleanVal === '' ? null : Number(cleanVal);
    this.shiftStore.actualCashInput.set(numVal);
    event.target.value = cleanVal !== '' ? Number(cleanVal).toLocaleString('en-US') : '';
  }

  public onInitialCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = cleanVal === '' ? 0 : Number(cleanVal);
    this.shiftStore.initialCashInput.set(numVal);
    event.target.value = cleanVal !== '' ? Number(cleanVal).toLocaleString('en-US') : '';
  }

  public async openStartShiftModal() {
    if (!this.authService.hasFeature('enable_shifts')) return;
    this.shiftStore.initialCashInput.set(0);

    const { StartShiftModalComponent } = await import(
      '@features/shifts/components/start-shift-modal/start-shift-modal.component'
    );
    this.modalService.open(StartShiftModalComponent, {
      title: 'Bắt đầu ca làm việc mới',
      size: 'md',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshCurrentShift(0, true);
        this.refreshShifts();
      }
    });
  }

  public async openCloseShiftModal() {
    if (!this.authService.hasFeature('enable_shifts')) return;
    if (this.shiftStore.isShiftSummaryLoading()) return;

    this.shiftStore.closeShiftNote.set('');

    const { EndShiftModalComponent } = await import(
      '@features/shifts/components/end-shift-modal/end-shift-modal.component'
    );
    this.modalService.open(EndShiftModalComponent, {
      title: 'Kết thúc ca làm việc & Đối soát két',
      size: 'md',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshCurrentShift(0, true);
        this.refreshShifts();
      }
    });

    const now = Date.now();
    if (this.shiftStore.shiftSummary() && (now - this.lastShiftSummaryLoadedTime < 5000)) {
      this.shiftStore.actualCashInput.set(null);
      return;
    }

    this.shiftStore.isShiftSummaryLoading.set(true);
    this.apiService.getShiftSummary().subscribe({
      next: (res) => {
        this.shiftStore.shiftSummary.set(res);
        this.shiftStore.actualCashInput.set(null);
        this.lastShiftSummaryLoadedTime = Date.now();
        this.shiftStore.isShiftSummaryLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải thống kê ca trực:', err);
        this.shiftStore.isShiftSummaryLoading.set(false);
      }
    });
  }
}
