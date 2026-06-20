import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

export interface CancelOrderExplanationModalData {
  order: any;
}

@Component({
  selector: 'app-cancel-order-explanation-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './cancel-order-explanation-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CancelOrderExplanationModalComponent {
  public readonly modalRef = inject(ModalRef);
  private readonly toastService = inject(ToastService);
  public readonly data = inject<CancelOrderExplanationModalData>(MODAL_DATA);

  public copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.showToast('Đã sao chép lý do chi vào bộ nhớ tạm!', 'success');
    }).catch(err => {
      console.error('Không thể sao chép:', err);
    });
  }

  public onClose() {
    this.modalRef.close();
  }
}
