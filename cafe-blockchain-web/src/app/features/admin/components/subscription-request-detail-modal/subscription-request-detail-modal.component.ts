import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { StateService } from '@core/services/state.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

export interface SubscriptionRequestDetailModalData {
  item: any;
}

@Component({
  selector: 'app-subscription-request-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    VNDCurrencyPipe
  ],
  templateUrl: './subscription-request-detail-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SubscriptionRequestDetailModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<SubscriptionRequestDetailModalData>(MODAL_DATA);

  public readonly apiService = inject(ApiService);
  public readonly toastService = inject(ToastService);
  public readonly stateService = inject(StateService);

  public readonly isActionLoading = signal<boolean>(false);
  public readonly isRejectMode = signal<boolean>(false);
  public readonly rejectReason = signal<string>('');

  public get item(): any {
    return this.data.item;
  }

  public shortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  }

  public onApprove() {
    this.isActionLoading.set(true);
    this.apiService.approveAdminSubscription(this.item.id).subscribe({
      next: (res) => {
        this.toastService.showToast(res.message || 'Phê duyệt yêu cầu thành công!', 'success');
        this.isActionLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        const msg = err.error?.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu.';
        this.toastService.showToast(msg, 'error');
        this.isActionLoading.set(false);
      }
    });
  }

  public enterRejectMode() {
    this.rejectReason.set('');
    this.isRejectMode.set(true);
  }

  public cancelRejectMode() {
    this.isRejectMode.set(false);
    this.rejectReason.set('');
  }

  public submitReject() {
    const reason = this.rejectReason().trim();
    if (!reason) {
      this.toastService.showToast('Vui lòng nhập lý do từ chối.', 'error');
      return;
    }

    this.isActionLoading.set(true);
    this.apiService.rejectAdminSubscription(this.item.id, reason).subscribe({
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

  public onClose() {
    this.modalRef.close(false);
  }
}
