import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-tax-confirm-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="space-y-4 text-left">
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
        Việc thiết lập lại thông tin khởi tạo ban đầu sẽ không làm mất sổ kế toán và tờ khai đã nộp trước đó. Bạn có thể xem lại ở Nhật ký kê khai.
      </p>
      <div class="flex justify-end gap-3 pt-2">
        <button app-button variant="secondary" (click)="cancel()">Từ chối</button>
        <button app-button variant="primary" class="!bg-emerald-600 hover:!bg-emerald-700 text-white !px-5" (click)="confirm()">Đồng ý</button>
      </div>
    </div>
  `
})
export class TaxConfirmModalComponent {
  private readonly modalRef = inject(ModalRef);

  cancel() {
    this.modalRef.close(false);
  }

  confirm() {
    this.modalRef.close(true);
  }
}
