import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface RejectSubscriptionModalData {
  requestId: number;
}

@Component({
  selector: 'app-reject-subscription-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent
  ],
  templateUrl: './reject-subscription-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class RejectSubscriptionModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<RejectSubscriptionModalData>(MODAL_DATA);

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public readonly isActionLoading = signal<boolean>(false);
  public readonly rejectReason = signal<string>('');

  public onSubmit() {
    const id = this.data.requestId;
    const reason = this.rejectReason().trim();
    if (!id) return;
    if (!reason) {
      this.toastService.showToast('Vui lòng nhập lý do từ chối.', 'error');
      return;
    }

    this.isActionLoading.set(true);
    this.apiService.rejectAdminSubscription(id, reason).subscribe({
      next: (res) => {
        this.toastService.showToast(res.message || 'Đã từ chối yêu cầu thành công.', 'success');
        this.isActionLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        const msg = err.error?.message || 'Có lỗi xảy ra khi từ chối yêu cầu.';
        this.toastService.showToast(msg, 'error');
        this.isActionLoading.set(false);
      }
    });
  }

  public onCancel() {
    this.modalRef.close(false);
  }
}
