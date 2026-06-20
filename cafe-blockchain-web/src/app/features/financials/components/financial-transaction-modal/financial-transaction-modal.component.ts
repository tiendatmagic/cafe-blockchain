import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-financial-transaction-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabGroupComponent,
    CustomDatePickerComponent,
    CustomCheckboxComponent,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './financial-transaction-modal.component.html',
})
export class FinancialTransactionModalComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isTransactionSaving = signal<boolean>(false);
  public readonly isCategoryDropdownOpen = signal<boolean>(false);
  public readonly isSyncFinanceToBlockchainChecked = signal<boolean>(false);
  public transactionModalType: 'add' | 'edit' = 'add';
  private editingTransaction: any = null;

  public readonly transactionModalTypeOptions: TabOption[] = [
    { value: 'thu', label: 'Thu tiền (+)' },
    { value: 'chi', label: 'Chi tiền (-)' },
  ];

  public readonly transactionForm = signal<any>({
    type: 'thu',
    amount: 0,
    category: '',
    description: '',
    transaction_date: '',
  });

  public get web3Service() {
    return this.stateService.web3Service;
  }

  ngOnInit(): void {
    if (this.modalData && this.modalData.transaction) {
      this.transactionModalType = 'edit';
      this.editingTransaction = this.modalData.transaction;
      this.transactionForm.set({
        type: this.editingTransaction.type,
        amount: this.editingTransaction.amount,
        category: this.editingTransaction.category,
        description: this.editingTransaction.description || '',
        transaction_date: this.editingTransaction.transaction_date,
      });
    } else {
      this.transactionModalType = 'add';
      const initialType = this.modalData?.type || 'thu';
      this.transactionForm.set({
        type: initialType,
        amount: 0,
        category: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
      });
    }
  }

  public selectCategory(category: string): void {
    this.transactionForm.update((form) => ({
      ...form,
      category: category,
    }));
    this.isCategoryDropdownOpen.set(false);
  }

  public updateTransactionForm(field: string, value: any): void {
    this.transactionForm.update((form) => ({
      ...form,
      [field]: field === 'amount' ? Number(value) : value,
    }));
  }

  public saveTransaction(): void {
    const form = this.transactionForm();
    if (form.amount <= 0 || !form.category || !form.category.trim() || !form.transaction_date) {
      this.stateService.showToast(
        'Vui lòng nhập số tiền (>0), hạng mục và ngày giao dịch hợp lệ!',
        'error',
      );
      return;
    }

    this.isTransactionSaving.set(true);
    if (this.transactionModalType === 'add') {
      this.apiService.createTransaction(form).subscribe({
        next: (res) => {
          if (this.isSyncFinanceToBlockchainChecked()) {
            this.syncTransactionImmediatelyAfterCreate(res.transaction);
          } else {
            this.stateService.showToast('Ghi nhận thu chi thành công!', 'success');
            this.isTransactionSaving.set(false);
            this.modalRef.close(true);
          }
        },
        error: () => {
          this.stateService.showToast('Ghi nhận thu chi thất bại!', 'error');
          this.isTransactionSaving.set(false);
        },
      });
    } else {
      const id = this.editingTransaction.id;
      this.apiService.updateTransaction(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật giao dịch thành công!', 'success');
          this.isTransactionSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Cập nhật giao dịch thất bại!', 'error');
          this.isTransactionSaving.set(false);
        },
      });
    }
  }

  public async syncTransactionImmediatelyAfterCreate(tx: any) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast(
        'Ghi nhận thu chi thành công cục bộ! Chưa kết nối ví Web3 để đồng bộ Blockchain.',
        'error',
      );
      this.isTransactionSaving.set(false);
      this.modalRef.close(true);
      return;
    }

    if (
      !this.web3Service.financeContractAddress() ||
      this.web3Service.financeContractAddress().trim() === ''
    ) {
      this.stateService.showToast(
        'Ghi nhận thu chi thành công cục bộ! Chưa cấu hình Smart Contract để đồng bộ Blockchain.',
        'error',
      );
      this.isTransactionSaving.set(false);
      this.modalRef.close(true);
      return;
    }

    this.stateService.showToast(
      'Bắt đầu đồng bộ Blockchain. Vui lòng xác nhận trên ví của bạn...',
      'success',
    );

    const result = await this.web3Service.recordTransactionOnChain(
      tx.id,
      tx.transaction_code || '',
      tx.type,
      tx.amount,
      tx.category,
      tx.description || '',
    );

    if (result.success && result.txHash) {
      this.stateService.showToast(
        'Giao dịch Blockchain đã được gửi! Đang đồng bộ trạng thái...',
        'success',
      );

      this.apiService
        .syncTransactionBlockchain(tx.id, result.txHash, 'success', this.web3Service.chainId())
        .subscribe({
          next: () => {
            this.stateService.showToast(
              'Ghi nhận thu chi và đồng bộ Blockchain thành công!',
              'success',
            );
            this.isTransactionSaving.set(false);
            this.modalRef.close(true);
          },
          error: (err) => {
            console.error('Loi cap nhat TxHash len DB:', err);
            this.isTransactionSaving.set(false);
            this.modalRef.close(true);
          },
        });
    } else {
      console.warn('[Blockchain] Giao dịch Blockchain thất bại hoặc bị từ chối:', result.error);
      this.stateService.showToast(
        'Phiếu thu chi đã lưu cục bộ thành công! Giao dịch blockchain thất bại hoặc bị từ chối.',
        'error',
      );
      this.isTransactionSaving.set(false);
      this.modalRef.close(true);
    }
  }
}
