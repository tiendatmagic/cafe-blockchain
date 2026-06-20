import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ModalService } from '@core/services/modal.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

export interface SignQrModalData {
  signQrCodeUrlSignal: any; // signal hoặc string
  signLinkSignal: any;     // signal hoặc string
  signOrderCode: string;
  signTokenId: number | null;
}

@Component({
  selector: 'app-sign-qr-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './sign-qr-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SignQrModalComponent implements OnDestroy {
  public readonly modalRef = inject(ModalRef);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);
  public readonly data = inject<SignQrModalData>(MODAL_DATA);

  public getSignQrCodeUrl(): string {
    return typeof this.data.signQrCodeUrlSignal === 'function'
      ? this.data.signQrCodeUrlSignal()
      : this.data.signQrCodeUrlSignal;
  }

  public getSignLink(): string {
    return typeof this.data.signLinkSignal === 'function'
      ? this.data.signLinkSignal()
      : this.data.signLinkSignal;
  }

  public copySignLink() {
    const link = this.getSignLink();
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      this.toastService.showToast('Đã sao chép liên kết ký số!', 'success');
    }).catch(err => {
      console.error('Không thể sao chép liên kết:', err);
    });
  }

  public onCancelSign() {
    this.modalService.confirm({
      title: 'Hủy yêu cầu ký số?',
      description: 'Bạn có chắc chắn muốn hủy yêu cầu ký số Voucher NFT cho hóa đơn này không? Dữ liệu đơn hàng tạm thời sẽ bị xóa bỏ hoàn toàn.',
      confirmText: 'Xác nhận hủy',
      cancelText: 'Quay lại',
      confirmButtonClass: 'btn-danger'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.modalRef.close('cancel_sign');
      }
    });
  }

  ngOnDestroy() {
    // Không cần dọn polling ở đây vì pos.component.ts sẽ lo việc polling
  }
}
