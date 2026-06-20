import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODAL_DATA, ModalRef } from '@core/services/modal-ref';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-qr-code-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './qr-code-modal.component.html',
})
export class QrCodeModalComponent {
  public readonly selectedPayment = signal<any>(null);

  constructor(
    @Inject(MODAL_DATA) public data: any,
    public modalRef: ModalRef
  ) {
    if (data && data.payment) {
      this.selectedPayment.set(data.payment);
    }
  }

  onClose(): void {
    this.modalRef.close();
  }

  getQrCodeUrl(item: any): string {
    if (!item) return '';
    if (item.type === 'bank') {
      return `https://img.vietqr.io/image/${item.bank_code}-${item.account_number}-compact.jpg?accountName=${encodeURIComponent(item.account_holder)}`;
    } else if (item.type === 'wallet' && item.name.toLowerCase() === 'momo') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fnhantien.momo.vn%2F${item.account_number}`;
    } else {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(item.account_number)}`;
    }
  }

  downloadQrCode(item: any): void {
    if (!item) return;
    const url = this.getQrCodeUrl(item);
    const filename = `qrcode-${item.bank_code || item.name}-${item.account_number}.jpg`;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  }
}
