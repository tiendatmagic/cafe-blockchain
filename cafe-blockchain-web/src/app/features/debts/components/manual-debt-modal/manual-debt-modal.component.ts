import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef } from '@core/services/modal-ref';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-manual-debt-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomDatePickerComponent,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './manual-debt-modal.component.html',
})
export class ManualDebtModalComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);

  public readonly isManualDebtSaving = signal<boolean>(false);

  public readonly manualDebtForm = signal<any>({
    customer_id: null,
    amount: null,
    note: '',
    recorded_at: '',
  });

  // Tìm kiếm khách hàng khi lập phiếu nợ thủ công
  public readonly modalCustomerSearch = signal<string>('');
  public readonly isModalCustomerDropdownOpen = signal<boolean>(false);

  public get customers() {
    return this.stateService.customers;
  }

  public get web3Service() {
    return this.stateService.web3Service;
  }

  // Định dạng ngày hiện tại YYYY-MM-DD
  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public ngOnInit(): void {
    this.manualDebtForm.set({
      customer_id: null,
      amount: null,
      note: '',
      recorded_at: this.getTodayDateString(),
    });
    this.modalCustomerSearch.set('');
    this.isModalCustomerDropdownOpen.set(false);

    // Tải danh sách khách hàng nếu chưa có
    if (this.customers().length === 0 && this.web3Service.walletConnected()) {
      this.stateService.refreshCustomers();
    }
  }

  // Hủy dấu tiếng Việt để tìm kiếm
  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Lọc Khách hàng trong modal khi chọn lập phiếu nợ
  public readonly modalFilteredCustomers = computed(() => {
    const search = this.modalCustomerSearch().trim().toLowerCase();
    const allCusts = this.customers();
    if (!search) return allCusts.slice(0, 10);

    const searchClean = this.removeSign(search);
    return allCusts
      .filter((c) => {
        const nameClean = c.name ? this.removeSign(c.name.toLowerCase()) : '';
        const phoneClean = c.phone ? c.phone.toLowerCase() : '';
        const codeClean = c.customer_code ? c.customer_code.toLowerCase() : '';
        return (
          nameClean.includes(searchClean) ||
          phoneClean.includes(searchClean) ||
          codeClean.includes(searchClean)
        );
      })
      .slice(0, 10);
  });

  public selectModalCustomer(customer: any): void {
    this.manualDebtForm.update((form) => ({
      ...form,
      customer_id: customer.id,
    }));
    this.modalCustomerSearch.set(customer.name + (customer.phone ? ` - ${customer.phone}` : ''));
    this.isModalCustomerDropdownOpen.set(false);
  }

  public saveManualDebt(): void {
    if (this.isManualDebtSaving()) return;

    const form = this.manualDebtForm();
    if (!form.customer_id) {
      this.stateService.showToast('Vui lòng chọn khách hàng để ghi nợ!', 'error');
      return;
    }
    if (!form.amount || form.amount <= 0) {
      this.stateService.showToast('Số tiền ghi nợ phải lớn hơn 0!', 'error');
      return;
    }
    if (!form.recorded_at) {
      this.stateService.showToast('Vui lòng chọn ngày ghi nhận!', 'error');
      return;
    }

    this.isManualDebtSaving.set(true);
    this.stateService.isLoading.set(true);
    this.apiService.createManualDebt(form).subscribe({
      next: () => {
        this.stateService.showToast('Lập phiếu ghi nợ thành công!', 'success');
        this.isManualDebtSaving.set(false);
        this.stateService.isLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        console.error('Lỗi ghi nợ thủ công:', err);
        const errMsg = err.error?.message || 'Lập phiếu ghi nợ thất bại!';
        this.stateService.showToast(errMsg, 'error');
        this.isManualDebtSaving.set(false);
        this.stateService.isLoading.set(false);
      },
    });
  }
}
