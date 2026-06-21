import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-store-cart-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    ButtonComponent,
    BadgeComponent,
    DrawerComponent,
    VNDCurrencyPipe,
  ],
  templateUrl: './store-cart-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StoreCartDrawerComponent {
  private readonly toastService = inject(ToastService);

  @Input() isOpen: boolean = false;
  @Input() cart: any[] = [];
  @Input() storeSettings: any = null;
  @Input() paymentMethods: any[] = [];
  @Input() shippingFee: number = 0;
  @Input() cartTotal: number = 0;
  @Input() cartTotalWithShipping: number = 0;
  @Input() turnstileSiteKey: string | null = null;
  @Input() isSubmittingOrder: boolean = false;
  @Input() isQrTable: boolean = false;
  @Input() orderForm: any = {};

  @Output() close = new EventEmitter<void>();
  @Output() clearCart = new EventEmitter<void>();
  @Output() updateCartQty = new EventEmitter<{ index: number; delta: number }>();
  @Output() cartItemNoteChange = new EventEmitter<void>();
  @Output() selectStorePaymentMethod = new EventEmitter<number>();
  @Output() phoneInputChange = new EventEmitter<string>();
  @Output() placeOrder = new EventEmitter<void>();

  public getSelectedPaymentMethod(): any {
    const id = this.orderForm.selected_payment_method_id;
    if (!id) return null;
    return this.paymentMethods.find((pm) => pm.id === id);
  }

  public downloadQrCode(item: any) {
    if (!item) return;
    const url = this.getStoreQrUrl(item);
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

  public getStoreQrUrl(item: any): string {
    if (!item) return '';
    if (item.type === 'bank') {
      return `https://img.vietqr.io/image/${item.bank_code}-${item.account_number}-compact.jpg?accountName=${encodeURIComponent(item.account_holder)}`;
    } else if (item.type === 'wallet' && item.name.toLowerCase() === 'momo') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fnhantien.momo.vn%2F${item.account_number}`;
    } else {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(item.account_number)}`;
    }
  }

  public copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.toastService.showToast('Đã sao chép vào bộ nhớ tạm');
      },
      () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          this.toastService.showToast('Đã sao chép vào bộ nhớ tạm');
        } catch (err) {
          console.error('Không thể sao chép: ', err);
        }
        document.body.removeChild(textarea);
      }
    );
  }
}
