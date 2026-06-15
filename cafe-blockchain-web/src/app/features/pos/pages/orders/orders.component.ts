import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { TableComponent, TableCellDirective, TableColumn } from '@shared/components/table/table.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    VNDCurrencyPipe,
    TableComponent,
    TableCellDirective,
    IconComponent
  ],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  public readonly columns: TableColumn[] = [
    { key: 'order_code', header: 'Mã đơn', sortable: false, class: 'font-bold whitespace-nowrap' },
    { key: 'table_number', header: 'Số bàn', sortable: false, class: 'font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap' },
    { key: 'total_amount', header: 'Tổng tiền', sortable: false, class: 'font-black text-slate-800 dark:text-white whitespace-nowrap' },
    { key: 'payment_method', header: 'Hình thức', sortable: false, class: 'text-xs font-bold whitespace-nowrap' },
    { key: 'created_at', header: 'Thời gian', sortable: false, class: 'text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap' },
    { key: 'status', header: 'Trạng thái đơn', sortable: false, class: 'whitespace-nowrap' },
    { key: 'blockchain_status', header: 'Bằng chứng Blockchain', sortable: false, class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right whitespace-nowrap', headerClass: 'text-right' }
  ];
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Lọc và Phân trang Sổ đơn hàng
  public readonly orderStatusFilter = signal<string>('all');
  public readonly orderBlockchainFilter = signal<string>('all');
  public readonly ordersCurrentPage = signal<number>(1);
  public readonly ordersItemsPerPage = 9;

  // Bộ tìm kiếm Đơn hàng
  public readonly orderSearchQuery = signal<string>('');

  // Trạng thái đồng bộ blockchain & cập nhật
  public readonly isAutoSyncOnCompleteChecked = signal<boolean>(false);
  public readonly blockchainSyncLoading = signal<boolean>(false);
  public readonly isOrderStatusUpdating = signal<boolean>(false);
  public readonly isMintingVoucherManual = signal<boolean>(false);

  // Chi tiết đơn hàng & Hủy đơn hàng
  public readonly selectedOrderDetails = signal<any>(null);
  public readonly isOrderDetailModalOpen = signal<boolean>(false);
  public readonly isCancelExplanationOpen = signal<boolean>(false);
  public readonly explanationOrderDetails = signal<any>(null);

  // Getters từ StateService
  public get web3Service() { return this.stateService.web3Service; }
  public get orders() { return this.stateService.orders; }
  public get settings() { return this.stateService.settings; }
  
  ngOnInit() {
    this.refreshOrders();
  }

  // Danh sách đơn hàng hoàn thành chưa đồng bộ blockchain để hiện cảnh báo đối soát
  public readonly unsyncedCompletedOrders = computed(() => {
    return this.orders().filter(o => o.status === 'completed' && o.blockchain_status === 'none');
  });

  // Danh sách đơn hàng đã được lọc cục bộ trên client
  public readonly filteredOrders = computed(() => {
    let list = this.orders();

    // 1. Lọc theo trạng thái đơn hàng
    const status = this.orderStatusFilter();
    if (status !== 'all') {
      list = list.filter(o => o.status === status);
    }

    // 2. Lọc theo trạng thái blockchain
    const blockchain = this.orderBlockchainFilter();
    if (blockchain !== 'all') {
      list = list.filter(o => o.blockchain_status === blockchain);
    }

    // 3. Lọc theo từ khóa tìm kiếm (mã đơn hàng order_code, bàn ăn, hoặc tên khách hàng)
    const search = this.orderSearchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(o => 
        (o.order_code && o.order_code.toLowerCase().includes(search)) ||
        (o.table_number && o.table_number.toLowerCase().includes(search)) ||
        (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(search)) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(search)) ||
        (o.id && o.id.toString().includes(search))
      );
    }

    return list;
  });

  // Phân trang đơn hàng dựa trên danh sách đã lọc cục bộ
  public readonly paginatedOrders = computed(() => {
    const list = this.filteredOrders();
    const startIndex = (this.ordersCurrentPage() - 1) * this.ordersItemsPerPage;
    return list.slice(startIndex, startIndex + this.ordersItemsPerPage);
  });

  public readonly ordersTotalPages = computed(() => {
    return Math.ceil(this.filteredOrders().length / this.ordersItemsPerPage) || 1;
  });

  // Gọi API lấy toàn bộ danh sách đơn hàng từ máy chủ (lọc client-side tự động xử lý hiển thị)
  public refreshOrders() {
    this.stateService.refreshOrders();
  }

  // Cập nhật đơn hàng cục bộ để tránh reload toàn bộ danh sách đơn hàng
  private updateLocalOrder(updatedOrder: any) {
    if (!updatedOrder) return;
    
    // Cập nhật trong danh sách orders của StateService
    const currentOrders = this.stateService.orders();
    const index = currentOrders.findIndex(o => o.id === updatedOrder.id);
    if (index > -1) {
      const updatedList = [...currentOrders];
      updatedList[index] = updatedOrder;
      this.stateService.orders.set(updatedList);
    }
    
    // Cập nhật selectedOrderDetails nếu đang mở xem chi tiết đơn đó
    if (this.selectedOrderDetails() && this.selectedOrderDetails().id === updatedOrder.id) {
      this.selectedOrderDetails.set(updatedOrder);
    }
  }

  // Cập nhật bộ lọc trạng thái đơn hàng (lọc cục bộ tức thì)
  public setOrderStatusFilter(status: string) {
    this.orderStatusFilter.set(status);
    this.ordersCurrentPage.set(1);
  }

  // Cập nhật bộ lọc blockchain đơn hàng (lọc cục bộ tức thì)
  public setOrderBlockchainFilter(blockchain: string) {
    this.orderBlockchainFilter.set(blockchain);
    this.ordersCurrentPage.set(1);
  }

  // Mở modal xem chi tiết đơn hàng
  public viewOrderDetail(order: any) {
    this.selectedOrderDetails.set(order);
    this.isOrderDetailModalOpen.set(true);
  }

  // Đóng modal xem chi tiết
  public closeOrderDetail() {
    this.isOrderDetailModalOpen.set(false);
    this.selectedOrderDetails.set(null);
  }

  // Cập nhật trạng thái đơn hàng (xác nhận thành công / đã hủy)
  public async updateStatus(orderId: string | number, status: 'completed' | 'cancelled' | 'preparing') {
    if (status === 'cancelled' || status === 'preparing' || !this.isAutoSyncOnCompleteChecked()) {
      this.executeStatusUpdateOnly(orderId, status);
      return;
    }

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để đồng bộ hóa đơn lên Blockchain!', 'error');
      return;
    }

    const order = this.selectedOrderDetails();
    if (!order) return;

    this.isOrderStatusUpdating.set(true);
    this.blockchainSyncLoading.set(true);

    // 1. Lưu Database POS trước
    this.apiService.updateOrderStatus(orderId, 'completed').subscribe({
      next: async (res) => {
        this.stateService.showToast('Đơn hàng đã được hoàn thành cục bộ! Đang ghi nhận lên Blockchain...', 'success');
        this.updateLocalOrder(res.data);

        // 2. Ký giao dịch Blockchain sau khi DB lưu thành công
        const itemsSummary = order.items.map((item: any) => {
          const variantStr = item.variant ? ` (${item.variant.variant_name})` : '';
          return `${item.quantity}x ${item.product.name}${variantStr}`;
        }).join(', ');

        const result = await this.web3Service.recordOrderOnChain(
          order.id,
          order.order_code || '',
          order.table_number || 'Mang về',
          order.total_amount,
          this.getPaymentMethodText(order.payment_method),
          itemsSummary
        );

        if (result.success && result.txHash) {
          // 3. Đồng bộ txHash vào DB
          this.apiService.syncOrderBlockchain(orderId, result.txHash, 'success', this.web3Service.chainId()).subscribe({
            next: (syncRes) => {
              this.stateService.showToast('Hoàn thành đơn hàng và đồng bộ Blockchain thành công!', 'success');
              this.updateLocalOrder(syncRes.data);
              this.isOrderStatusUpdating.set(false);
              this.blockchainSyncLoading.set(false);
            },
            error: (syncErr) => {
              console.error('Lỗi đồng bộ TxHash:', syncErr);
              this.isOrderStatusUpdating.set(false);
              this.blockchainSyncLoading.set(false);
            }
          });
        } else {
          console.warn('[Blockchain] Giao dịch Blockchain thất bại hoặc bị từ chối:', result.error);
          this.stateService.showToast('Giao dịch Blockchain thất bại hoặc bị từ chối! Bạn có thể đồng bộ/đối soát lại sau.', 'error');
          this.isOrderStatusUpdating.set(false);
          this.blockchainSyncLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Lỗi cập nhật trạng thái:', err);
        this.stateService.showToast('Cập nhật trạng thái POS thất bại!', 'error');
        this.isOrderStatusUpdating.set(false);
        this.blockchainSyncLoading.set(false);
      }
    });
  }

  // Cập nhật Database đơn thuần
  private executeStatusUpdateOnly(orderId: string | number, status: 'completed' | 'cancelled' | 'preparing') {
    this.isOrderStatusUpdating.set(true);
    this.apiService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        this.stateService.showToast(`Cập nhật trạng thái đơn hàng thành công!`, 'success');
        this.updateLocalOrder(res.data);
        this.isOrderStatusUpdating.set(false);
      },
      error: (err) => {
        console.error('Loi cap nhat trang thai:', err);
        this.stateService.showToast('Cập nhật trạng thái thất bại!', 'error');
        this.isOrderStatusUpdating.set(false);
      }
    });
  }

  // Đồng bộ hóa đơn lên Blockchain EVM
  public async syncToBlockchain(order: any) {
    if (order.is_verified === false) {
      this.stateService.showToast('CẢNH BÁO: Dữ liệu tài chính của đơn hàng này đã bị thay đổi trái phép trong Database! Không thể đồng bộ.', 'error');
      return;
    }

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    if (!this.web3Service.contractAddress() || this.web3Service.contractAddress().trim() === '') {
      this.stateService.showToast('Cửa hàng chưa được cấu hình Smart Contract! Vui lòng truy cập mục Cấu hình hệ thống để deploy contract trước.', 'error');
      return;
    }

    if (!this.web3Service.isOwnerContract()) {
      this.stateService.showToast('Địa chỉ ví thu ngân hiện tại của bạn không được phân quyền (Owner) trên Smart Contract! Hãy nhờ quản lý cấp quyền trong mục Cấu hình.', 'error');
      return;
    }

    this.blockchainSyncLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch trên ví Metamask...', 'success');

    const itemsSummary = order.items.map((item: any) => {
      const variantStr = item.variant ? ` (${item.variant.variant_name})` : '';
      return `${item.quantity}x ${item.product.name}${variantStr}`;
    }).join(', ');

    const result = await this.web3Service.recordOrderOnChain(
      order.id,
      order.order_code || '',
      order.table_number || 'Mang về',
      order.total_amount,
      this.getPaymentMethodText(order.payment_method),
      itemsSummary
    );

    if (result.success && result.txHash) {
      this.stateService.showToast('Giao dịch đã được gửi! Đang đồng bộ trạng thái...', 'success');

      this.apiService.syncOrderBlockchain(order.id, result.txHash, 'success', this.web3Service.chainId()).subscribe({
        next: (res) => {
          this.stateService.showToast('Ghi nhận bằng chứng hóa đơn lên Blockchain EVM thành công!', 'success');
          this.updateLocalOrder(res.data);
          this.blockchainSyncLoading.set(false);
        },
        error: (err) => {
          console.error('Loi cap nhat TxHash len DB:', err);
          this.blockchainSyncLoading.set(false);
        }
      });
    } else {
      const errorMsg = result.error || '';
      const isAlreadyExists = errorMsg.includes('order already exists') || errorMsg.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        this.stateService.showToast('Đơn hàng đã tồn tại trên Blockchain. Đang truy vấn bằng chứng gốc...', 'success');
        const originalTxHash = await this.web3Service.getOriginalTxHashForOrder(order.id);

        if (originalTxHash) {
          this.apiService.syncOrderBlockchain(order.id, originalTxHash, 'success', this.web3Service.chainId()).subscribe({
            next: (res) => {
              this.stateService.showToast('Đối soát thành công! Đã khôi phục bằng chứng blockchain gốc.', 'success');
              this.updateLocalOrder(res.data);
              this.blockchainSyncLoading.set(false);
            },
            error: (err) => {
              console.error('Lỗi đối soát đơn hàng:', err);
              this.stateService.showToast(err.error?.message || 'Đối soát thất bại!', 'error');
              this.blockchainSyncLoading.set(false);
            }
          });
        } else {
          this.stateService.showToast('Đơn hàng đã có trên blockchain nhưng không thể truy vấn tx_hash gốc. Vui lòng thử lại!', 'error');
          this.blockchainSyncLoading.set(false);
        }
      } else {
        this.stateService.showToast(result.error || 'Giao dịch thất bại hoặc bị từ chối!', 'error');
        this.blockchainSyncLoading.set(false);
      }
    }
  }

  // Đồng bộ tuần tự toàn bộ các hóa đơn chưa đồng bộ (khi chốt ca)
  public async syncAllUnsyncedOrders() {
    const list = this.unsyncedCompletedOrders();
    if (list.length === 0) {
      this.stateService.showToast('Không có đơn hàng nào cần đồng bộ!', 'success');
      return;
    }

    if (this.blockchainSyncLoading() || this.isOrderStatusUpdating()) return;

    this.stateService.showToast(`Bắt đầu đồng bộ hàng loạt ${list.length} đơn hàng. Vui lòng xác nhận trên ví cho từng đơn...`, 'success');

    for (const order of list) {
      this.selectedOrderDetails.set(order);
      this.isOrderDetailModalOpen.set(true);
      await this.syncToBlockchain(order);
    }

    this.stateService.showToast('Đã hoàn tất tiến trình đồng bộ đối soát ca trực!', 'success');
  }

  // Tặng và đúc lại Voucher NFT thủ công
  public mintVoucherManual(order: any) {
    if (!order) return;
    if (this.isMintingVoucherManual()) return;

    this.isMintingVoucherManual.set(true);
    this.stateService.showToast('Đang đúc và gửi tặng Voucher NFT thủ công...', 'success');

    this.apiService.mintVoucherManual(order.id).subscribe({
      next: (res) => {
        this.stateService.showToast(res.message || 'Tặng Voucher NFT thành công!', 'success');
        this.updateLocalOrder(res.data);
        this.isMintingVoucherManual.set(false);
      },
      error: (err) => {
        console.error('Lỗi đúc Voucher NFT thủ công:', err);
        const errMsg = err.error?.message || 'Có lỗi xảy ra khi đúc Voucher NFT!';
        this.stateService.showToast(errMsg, 'error');
        this.isMintingVoucherManual.set(false);
      }
    });
  }

  // Khởi động chế độ chỉnh sửa đơn hàng POS
  public editOrder(order: any) {
    this.stateService.editOrder(order);
  }

  // Kích hoạt popup cảnh báo nghiệp vụ khi hủy đơn đã thành công
  public triggerCancelExplanation(order: any) {
    this.explanationOrderDetails.set(order);
    this.isCancelExplanationOpen.set(true);
  }

  // Sao chép lý do hoàn tiền đối ứng
  public copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.stateService.showToast('Đã sao chép lý do chi vào bộ nhớ tạm!', 'success');
    }).catch(err => {
      this.stateService.showToast('Không thể tự động sao chép lý do chi!', 'error');
    });
  }

  // Dịch phương thức thanh toán
  public getPaymentMethodText(method: string): string {
    const map: any = {
      'cash': 'Tiền mặt',
      'bank_transfer': 'Chuyển khoản',
      'crypto': 'Crypto',
      'e_wallet': 'Ví điện tử'
    };
    return map[method] || method;
  }

  // In hóa đơn theo khổ giấy config
  public printOrder(order: any) {
    if (!order) return;
    
    const storeName = this.settings().store_name || 'Cafe Web3 POS';
    const printSize = this.settings().default_print_size || '80mm';
    const orderCode = order.order_code || ('#' + order.id);
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
      const variantText = item.variant ? `<br><small style="color:#555;font-weight:bold;">Size: ${item.variant.variant_name}</small>` : '';
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

    const isWrongChainAlert = order.is_verified === false ? `
      <div style="border: 2px dashed #ef4444; background: #fee2e2; color: #b91c1c; padding: 8px; border-radius: 8px; margin-top: 10px; font-size: 10px; font-weight: bold; text-align: center;">
        [CẢNH BÁO] HÓA ĐƠN BỊ KHÓA ĐỒNG BỘ!<br>Dữ liệu đã bị thay đổi trong Database.
      </div>
    ` : '';

    let discountHtml = '';
    if (order.discount_amount > 0) {
      const voucherText = order.voucher ? ` (Voucher: ${this.formatVoucherCode(order.voucher.code)})` : '';
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


  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.web3Service.getTxExplorerLink(txHash, chainId);
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
}
