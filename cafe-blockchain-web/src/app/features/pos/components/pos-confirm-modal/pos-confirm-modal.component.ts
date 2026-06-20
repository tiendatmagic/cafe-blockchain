import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

export interface PosConfirmModalData {
  cartTotal: number;
  posTotalQuantity: number;
  posSelectedVoucher: any | null;
  posFinalTotal: number;
  tableNumber: string;
  settings: any;
  paymentMethod: string;
  posSelectedCustomer: any | null;
}

@Component({
  selector: 'app-pos-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent, VNDCurrencyPipe],
  templateUrl: './pos-confirm-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PosConfirmModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<PosConfirmModalData>(MODAL_DATA);

  public readonly posPaymentMethod = signal<'cash' | 'bank_transfer' | 'crypto' | 'e_wallet' | 'debt'>('cash');
  public readonly customerCashGiven = signal<number>(0);

  public readonly customerCashGivenFormatted = computed(() => {
    const val = this.customerCashGiven();
    if (val === 0) return '';
    return val.toLocaleString('en-US');
  });

  public readonly posCashReturn = computed(() => {
    return Math.max(0, this.customerCashGiven() - this.data.posFinalTotal);
  });

  constructor() {
    // Khởi tạo các giá trị ban đầu từ dữ liệu POS
    const currentMethod = this.data.paymentMethod;
    if (
      currentMethod === 'cash' ||
      currentMethod === 'bank_transfer' ||
      currentMethod === 'crypto' ||
      currentMethod === 'e_wallet' ||
      currentMethod === 'debt'
    ) {
      this.posPaymentMethod.set(currentMethod as any);
      if (currentMethod === 'debt') {
        this.customerCashGiven.set(0);
      } else {
        this.customerCashGiven.set(this.data.posFinalTotal);
      }
    } else {
      this.posPaymentMethod.set('cash');
      this.customerCashGiven.set(this.data.posFinalTotal);
    }
  }

  public setPaymentMethod(method: 'cash' | 'bank_transfer' | 'crypto' | 'e_wallet' | 'debt') {
    this.posPaymentMethod.set(method);
    if (method === 'debt') {
      this.customerCashGiven.set(0);
    } else {
      // Tự động điền số tiền cần trả khi chuyển phương thức khác
      this.customerCashGiven.set(this.data.posFinalTotal);
    }
  }

  public selectCashGivenQuick(amount: number) {
    this.customerCashGiven.set(amount);
  }

  public onCustomerCashGivenInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.customerCashGiven.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public formatVoucherCode(code: string | undefined | null): string {
    if (!code) return '';
    if (code.startsWith('NFT-') && code.length > 15) {
      const parts = code.split('-');
      if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];
        return `NFT-...-${lastPart}`;
      }
    }
    return code;
  }

  public onCancel() {
    this.modalRef.close(null);
  }

  public onConfirm() {
    if (this.posPaymentMethod() === 'debt' && !this.data.posSelectedCustomer) {
      return; // Không cho phép confirm nếu là ghi nợ mà chưa chọn khách hàng
    }
    this.modalRef.close({
      paymentMethod: this.posPaymentMethod(),
      customerCashGiven: this.customerCashGiven(),
    });
  }
}
