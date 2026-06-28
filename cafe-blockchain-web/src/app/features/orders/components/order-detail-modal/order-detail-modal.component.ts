import { Component, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { ModalService } from '@core/services/modal.service';
import { CancelOrderExplanationModalComponent } from '../cancel-order-explanation-modal/cancel-order-explanation-modal.component';

export interface OrderDetailModalData {
  order: any;
  settings: any;
  web3Service: any;
  // Signal references thay vì static boolean để modal đọc reactive state
  isOrderStatusUpdating: Signal<boolean>;
  blockchainSyncLoading: Signal<boolean>;
  isMintingVoucherManual: Signal<boolean>;
  isAutoSyncOnCompleteChecked: Signal<boolean>;
  // Callback functions để modal thực thi action mà không đóng modal
  onUpdateStatus?: (status: 'preparing' | 'completed' | 'cancelled', isAutoSync: boolean) => void;
  onSyncToBlockchain?: () => void;
  onMintVoucher?: () => void;
  onUpdateOrder?: (order: any) => void;
}

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    CustomCheckboxComponent,
    VNDCurrencyPipe,
  ],
  templateUrl: './order-detail-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class OrderDetailModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<OrderDetailModalData>(MODAL_DATA);
  private readonly modalService = inject(ModalService);

  // Signal cục bộ phản ánh trạng thái tích chọn của checkbox, khởi tạo từ signal của parent
  public isAutoSync = signal<boolean>(this.data.isAutoSyncOnCompleteChecked());

  public getPaymentMethodText(method: string): string {
    const map: any = {
      cash: 'Tiền mặt',
      bank_transfer: 'Chuyển khoản',
      crypto: 'Crypto',
      e_wallet: 'Ví điện tử',
    };
    return map[method] || method;
  }

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.data.web3Service.getTxExplorerLink(txHash, chainId);
  }

  /** Gọi callback cập nhật trạng thái - không đóng modal */
  public onUpdateStatus(status: 'preparing' | 'completed' | 'cancelled') {
    if (this.data.onUpdateStatus) {
      this.data.onUpdateStatus(status, this.isAutoSync());
    }
  }

  /** Gọi callback đồng bộ blockchain - không đóng modal */
  public onSyncToBlockchain() {
    if (this.data.onSyncToBlockchain) {
      this.data.onSyncToBlockchain();
    }
  }

  /** Gọi callback đúc voucher NFT - không đóng modal */
  public onMintVoucher() {
    if (this.data.onMintVoucher) {
      this.data.onMintVoucher();
    }
  }

  /** Mở modal cảnh báo nghiệp vụ khi yêu cầu hủy đơn đã hoàn thành */
  public onCancelExplanation() {
    this.modalService.open(CancelOrderExplanationModalComponent, {
      title: 'Cảnh báo nghiệp vụ',
      size: 'md',
      data: { order: this.data.order }
    });
  }

  /** Đóng modal (bấm nút ĐÓNG CỬA SỔ) */
  public onClose() {
    this.modalRef.close();
  }

  public formatVoucherCode(code: string | undefined | null): string {
    if (!code) return '';
    if (code.startsWith('NFT-') && code.length > 15) {
      const parts = code.split('-');
      if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];
        return `NFT-...-${lastPart}`;
      }
    }
    return code;
  }

  public printOrder() {
    const order = this.data.order;
    if (!order) return;

    const storeName = this.data.settings?.store_name || 'Cafe Web3 POS';
    const printSize = this.data.settings?.default_print_size || '80mm';
    const orderCode = order.order_code || '#' + order.id;
    const tableNum = order.table_number || 'Mang về';
    const paymentMethodText = this.getPaymentMethodText(order.payment_method);
    const orderDate = new Date(order.created_at).toLocaleString('vi-VN');

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    let itemsHtml = '';
    order.items.forEach((item: any) => {
      const variantText = item.variant
        ? `<br><small style="color:#555;font-weight:bold;">Size: ${item.variant.variant_name}</small>`
        : '';
      itemsHtml += `
        <tr>
          <td style="padding: 4px 0; text-align: left; vertical-align: top;">
            ${item.product?.name || 'Sản phẩm'}${variantText}
          </td>
          <td style="padding: 4px 0; text-align: center; vertical-align: top;">${item.quantity}</td>
          <td style="padding: 4px 0; text-align: right; vertical-align: top;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
        </tr>
      `;
    });

    const isWrongChainAlert =
      order.is_verified === false
        ? `
      <div style="border: 2px dashed #ef4444; background: #fee2e2; color: #b91c1c; padding: 8px; border-radius: 8px; margin-top: 10px; font-size: 10px; font-weight: bold; text-align: center;">
        [CẢNH BÁO] HÓA ĐƠN BỊ KHÓA ĐỒNG BỘ!<br>Dữ liệu đã bị thay đổi trong Database.
      </div>
    `
        : '';

    let discountHtml = '';
    if (order.discount_amount > 0) {
      const voucherText = order.voucher
        ? ` (Voucher: ${this.formatVoucherCode(order.voucher.code)})`
        : '';
      discountHtml = `
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <span>Tạm tính:</span>
          <span>${(order.total_amount + order.discount_amount).toLocaleString('vi-VN')}đ</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #b91c1c;">
          <span>Giảm giá${voucherText}:</span>
          <span>-${order.discount_amount.toLocaleString('vi-VN')}đ</span>
        </div>
      `;
    }

    let taxHtml = '';
    if (order.tax_amount && Number(order.tax_amount) > 0) {
      taxHtml = `
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <span>Thuế VAT:</span>
          <span>${Number(order.tax_amount).toLocaleString('vi-VN')}đ</span>
        </div>
      `;
    }

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>In Hóa Đơn</title>
          <style>
            @page { size: ${printSize === '80mm' ? '80mm 200mm' : printSize}; margin: 0; }
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.4; color: #000; margin: 0; padding: 10px; width: ${printSize === '80mm' ? '72mm' : 'auto'}; }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .header { font-size: 16px; margin-bottom: 2px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin: 6px 0; }
            th { border-bottom: 1px solid #000; padding: 4px 0; text-align: left; font-size: 10px; }
            .total-row { font-size: 14px; font-weight: bold; margin-top: 8px; }
            .footer { font-size: 10px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="text-center bold header">${storeName}</div>
          <div class="text-center" style="font-size: 10px;">Blockchain Transparency Ledger</div>
          <div class="divider"></div>
          <div>Mã HĐ: <span class="bold">${orderCode}</span></div>
          <div>Bàn: <span class="bold">${tableNum}</span></div>
          <div>Thanh toán: ${paymentMethodText}</div>
          <div>Ngày: ${orderDate}</div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">Tên món</th>
                <th style="width: 15%; text-align: center;">SL</th>
                <th style="width: 30%; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="divider"></div>
          ${discountHtml}
          ${taxHtml}
          <div style="display: flex; justify-content: space-between;" class="total-row">
            <span>TỔNG THANH TOÁN:</span>
            <span>${order.total_amount.toLocaleString('vi-VN')}đ</span>
          </div>
          ${isWrongChainAlert}
          <div class="divider"></div>
          <div class="text-center footer">
            Cảm ơn quý khách! Hẹn gặp lại!<br>
            Powered by Blockchain Dapp POS
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.frameElement.remove(); }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  }
}
