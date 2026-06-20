import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

@Component({
  selector: 'app-debt-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomDatePickerComponent,
    IconComponent,
    ButtonComponent,
    VNDCurrencyPipe,
  ],
  templateUrl: './debt-payment-modal.component.html',
})
export class DebtPaymentModalComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isPaymentSaving = signal<boolean>(false);
  public selectedCustomer: any = null;
  public readonly Number = Number;

  public readonly paymentForm = signal<any>({
    customer_id: null,
    amount: null,
    payment_method: 'cash',
    note: '',
    recorded_at: '',
  });

  // Định dạng ngày hiện tại YYYY-MM-DD
  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public ngOnInit(): void {
    if (this.modalData && this.modalData.customer) {
      this.selectedCustomer = this.modalData.customer;
      this.paymentForm.set({
        customer_id: this.selectedCustomer.id,
        amount: null,
        payment_method: 'cash',
        note: '',
        recorded_at: this.getTodayDateString(),
      });
    } else {
      this.modalRef.close();
    }
  }

  public savePayment(): void {
    if (this.isPaymentSaving()) return;

    const form = this.paymentForm();
    const customer = this.selectedCustomer;
    if (!customer) return;

    if (!form.amount || form.amount <= 0) {
      this.stateService.showToast('Số tiền thu nợ phải lớn hơn 0!', 'error');
      return;
    }

    if (form.amount > Number(customer.debt_balance)) {
      this.stateService.showToast(
        `Số tiền thu nợ không được vượt quá số dư nợ hiện tại (${Number(customer.debt_balance).toLocaleString()}đ)!`,
        'error',
      );
      return;
    }

    if (!form.recorded_at) {
      this.stateService.showToast('Vui lòng chọn ngày ghi nhận!', 'error');
      return;
    }

    this.isPaymentSaving.set(true);
    this.stateService.isLoading.set(true);
    this.apiService.createDebtPayment(form).subscribe({
      next: () => {
        this.stateService.showToast('Lập phiếu thu nợ thành công! Đã cập nhật sổ quỹ.', 'success');
        this.isPaymentSaving.set(false);
        this.stateService.isLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        console.error('Lỗi thu nợ:', err);
        const errMsg = err.error?.message || 'Lập phiếu thu nợ thất bại!';
        this.stateService.showToast(errMsg, 'error');
        this.isPaymentSaving.set(false);
        this.stateService.isLoading.set(false);
      },
    });
  }
}
