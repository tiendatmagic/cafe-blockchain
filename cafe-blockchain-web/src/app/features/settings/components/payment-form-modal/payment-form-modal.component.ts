import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MODAL_DATA, ModalRef } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-payment-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomSelectComponent,
    CustomSwitchComponent,
    IconComponent
  ],
  templateUrl: './payment-form-modal.component.html',
})
export class PaymentFormModalComponent {
  private readonly apiService = inject(ApiService);
  private readonly stateService = inject(StateService);

  public readonly POPULAR_BANKS = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'MB', name: 'MB Bank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'VTB', name: 'VietinBank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'SHB', name: 'SHB' },
    { code: 'VBA', name: 'Agribank' },
  ];

  public readonly POPULAR_WALLETS = [
    { name: 'Momo' },
    { name: 'ZaloPay' },
    { name: 'Viettel Money' },
  ];

  public readonly isEditing = signal<boolean>(false);
  public readonly editingId = signal<number | null>(null);
  public readonly isPaymentActionLoading = signal<boolean>(false);
  
  public readonly paymentForm = signal<any>({
    type: 'bank',
    name: '',
    account_number: '',
    account_holder: '',
    bank_code: '',
    is_active: true,
  });

  constructor(
    @Inject(MODAL_DATA) public data: any,
    public modalRef: ModalRef<boolean>
  ) {
    if (data) {
      this.isEditing.set(data.isEdit || false);
      this.editingId.set(data.id || null);
      if (data.form) {
        this.paymentForm.set({ ...data.form });
      }
    }
  }

  onBankSelectChange(bankCode: string) {
    const bank = this.POPULAR_BANKS.find((b) => b.code === bankCode);
    if (bank) {
      this.paymentForm.update((form) => ({
        ...form,
        name: bank.name,
        bank_code: bank.code,
      }));
    } else {
      this.paymentForm.update((form) => ({
        ...form,
        bank_code: bankCode,
      }));
    }
  }

  onWalletSelectChange(walletName: string) {
    this.paymentForm.update((form) => ({
      ...form,
      name: walletName,
      bank_code: '',
    }));
  }

  savePaymentMethod() {
    const data = this.paymentForm();
    if (!data.name || !data.account_number || !data.account_holder) {
      this.stateService.showToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
      return;
    }

    if (data.type === 'bank' && !data.bank_code) {
      this.stateService.showToast('Vui lòng chọn hoặc nhập mã ngân hàng!', 'error');
      return;
    }

    if (this.isPaymentActionLoading()) return;
    this.isPaymentActionLoading.set(true);

    const request = this.isEditing()
      ? this.apiService.updatePaymentMethod(this.editingId()!, data)
      : this.apiService.createPaymentMethod(data);

    request.subscribe({
      next: () => {
        this.stateService.showToast(
          this.isEditing()
            ? 'Cập nhật phương thức thanh toán thành công!'
            : 'Thêm phương thức thanh toán thành công!',
          'success',
        );
        this.isPaymentActionLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        this.stateService.showToast(err.error?.message || 'Có lỗi xảy ra khi lưu!', 'error');
        this.isPaymentActionLoading.set(false);
      },
    });
  }
}
