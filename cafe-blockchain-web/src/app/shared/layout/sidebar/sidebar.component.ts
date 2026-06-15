import { Component, inject, signal, HostListener, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, IconComponent, ModalComponent, FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  public readonly stateService = inject(StateService);
  private readonly elementRef = inject(ElementRef);

  public readonly isChainDropdownOpen = signal<boolean>(false);

  // --- Quản lý ca trực (Kết ca) ---
  public readonly isCloseShiftModalOpen = signal<boolean>(false);
  public readonly actualCashInput = signal<number>(0);
  public readonly actualCashFormatted = computed(() => {
    const val = this.actualCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });
  public readonly closeShiftNote = signal<string>('');

  public readonly currentShift = computed(() => this.stateService.currentShift());

  public readonly shiftOrders = computed(() => {
    const shift = this.currentShift();
    if (!shift) return [];
    return this.stateService.orders().filter(o => o.shift_id === shift.id && o.status === 'completed');
  });

  public readonly shiftTransactions = computed(() => {
    const shift = this.currentShift();
    if (!shift) return [];
    return this.stateService.transactions().filter(t => t.shift_id === shift.id && t.type === 'chi' && t.payment_method === 'cash');
  });

  public readonly shiftFiatRevenue = computed(() => {
    return this.shiftOrders().reduce((sum, o) => o.payment_method === 'cash' ? sum + (Number(o.total_amount) || 0) : sum, 0);
  });

  public readonly shiftBankTransferRevenue = computed(() => {
    return this.shiftOrders().reduce((sum, o) => o.payment_method === 'bank_transfer' ? sum + (Number(o.total_amount) || 0) : sum, 0);
  });

  public readonly shiftCryptoRevenue = computed(() => {
    return this.shiftOrders().reduce((sum, o) => o.payment_method === 'crypto' ? sum + (Number(o.total_amount) || 0) : sum, 0);
  });

  public readonly shiftFiatExpenses = computed(() => {
    return this.shiftTransactions().reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  });

  public readonly shiftExpectedCash = computed(() => {
    const shift = this.currentShift();
    if (!shift) return 0;
    return (Number(shift.initial_cash) || 0) + this.shiftFiatRevenue() - this.shiftFiatExpenses();
  });

  public onActualCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.actualCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public openCloseShiftModal() {
    this.stateService.refreshOrders();
    this.stateService.refreshTransactions();
    
    // Đợi dữ liệu load xong và cập nhật expected
    setTimeout(() => {
      const expected = this.shiftExpectedCash();
      this.actualCashInput.set(expected);
      this.closeShiftNote.set('');
      this.isCloseShiftModalOpen.set(true);
    }, 300);
  }

  public confirmCloseShift() {
    const actual = this.actualCashInput();
    const note = this.closeShiftNote();
    this.stateService.closeShift(actual, note, () => {
      this.isCloseShiftModalOpen.set(false);
    });
  }

  public formatShiftTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  public get isMobileMenuOpen() {
    return this.stateService.isMobileMenuOpen;
  }

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public get isWalletModalOpen() {
    return this.stateService.isWalletModalOpen;
  }

  public connectWalletAndSign() {
    this.stateService.connectWalletAndSign();
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#mobile-chain-dropdown-container')?.contains(target)) {
      this.isChainDropdownOpen.set(false);
    }
  }

  // Chuyển đổi mạng (Chain) trên ví Web3 cho mobile/tablet
  public async switchChain(chainId: string) {
    this.isChainDropdownOpen.set(false);

    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 trước khi chọn mạng lưới!', 'error');
      return;
    }

    this.stateService.showToast('Đang yêu cầu chuyển mạng ví...', 'success');
    try {
      const success = await this.web3Service.ensureCorrectNetwork(chainId);
      if (success) {
        this.stateService.showToast(`Đã chuyển mạng ví sang ${this.web3Service.getNetworkNameByChainId(chainId)}!`, 'success');
      } else {
        this.stateService.showToast(this.web3Service.walletError() || 'Chuyển mạng thất bại!', 'error');
      }
    } catch (e: any) {
      this.stateService.showToast(e.message || 'Chuyển mạng thất bại!', 'error');
    }
  }

  // Lấy màu class cho chấm tròn chỉ báo của chain
  public getChainColorClass(chainId: string): string {
    switch (chainId) {
      case '1':
      case '11155111':
        return 'bg-blue-500';
      case '56':
      case '97':
        return 'bg-yellow-500';
      case '137':
         return 'bg-purple-500';
      case '42161':
      case '8453':
        return 'bg-sky-500';
      case '10':
      case '43114':
      case '421614':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  }
}

