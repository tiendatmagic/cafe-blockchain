import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-financial-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    VNDCurrencyPipe,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './financial-detail-modal.component.html',
})
export class FinancialDetailModalComponent {
  private readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  public readonly transaction = inject(MODAL_DATA);

  public readonly blockchainSyncLoading = signal<boolean>(false);

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.web3Service.getTxExplorerLink(txHash, chainId);
  }

  public async syncTransactionToBlockchain() {
    const tx = this.transaction;
    if (!tx) return;

    if (tx.is_verified === false) {
      this.stateService.showToast(
        'CẢNH BÁO: Dữ liệu tài chính của giao dịch này đã bị thay đổi trái phép trong Database! Không thể đồng bộ.',
        'error',
      );
      return;
    }

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    if (
      !this.web3Service.financeContractAddress() ||
      this.web3Service.financeContractAddress().trim() === ''
    ) {
      this.stateService.showToast(
        'Cửa hàng chưa được cấu hình Smart Contract Tài chính! Vui lòng truy cập mục Cấu hình hệ thống để deploy contract trước.',
        'error',
      );
      return;
    }

    if (!this.web3Service.isOwnerContract()) {
      this.stateService.showToast(
        'Địa chỉ ví thu ngân hiện tại của bạn không được phân quyền (Owner) trên Smart Contract! Hãy nhờ quản lý cấp quyền.',
        'error',
      );
      return;
    }

    this.blockchainSyncLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch trên ví của bạn...', 'success');

    const result = await this.web3Service.recordTransactionOnChain(
      tx.id,
      tx.transaction_code || '',
      tx.type,
      tx.amount,
      tx.category,
      tx.description || '',
    );

    if (result.success && result.txHash) {
      this.stateService.showToast('Giao dịch đã được gửi! Đang đồng bộ trạng thái...', 'success');

      this.apiService
        .syncTransactionBlockchain(tx.id, result.txHash, 'success', this.web3Service.chainId())
        .subscribe({
          next: () => {
            this.stateService.showToast(
              'Ghi nhận bằng chứng thu chi lên Blockchain EVM thành công!',
              'success',
            );
            tx.blockchain_status = 'success';
            tx.tx_hash = result.txHash;
            tx.chain_id = this.web3Service.chainId();
            this.blockchainSyncLoading.set(false);
            this.modalRef.close(true); // Trả về true để component cha reload list
          },
          error: (err) => {
            console.error('Loi cap nhat TxHash len DB:', err);
            this.blockchainSyncLoading.set(false);
          },
        });
    } else {
      const errorMsg = result.error || '';
      const isAlreadyExists =
        errorMsg.includes('transaction already exists') ||
        errorMsg.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        this.stateService.showToast(
          'Giao dịch đã tồn tại trên Blockchain. Đang truy vấn bằng chứng gốc...',
          'success',
        );
        const originalTxHash = await this.web3Service.getOriginalTxHashForTransaction(tx.id);

        if (originalTxHash) {
          this.apiService
            .syncTransactionBlockchain(tx.id, originalTxHash, 'success', this.web3Service.chainId())
            .subscribe({
              next: () => {
                this.stateService.showToast(
                  'Đối soát thành công! Đã khôi phục bằng chứng blockchain gốc cho phiếu thu chi.',
                  'success',
                );
                tx.blockchain_status = 'success';
                tx.tx_hash = originalTxHash;
                tx.chain_id = this.web3Service.chainId();
                this.blockchainSyncLoading.set(false);
                this.modalRef.close(true);
              },
              error: (err) => {
                console.error('Lỗi đối soát giao dịch thu chi:', err);
                this.stateService.showToast(err.error?.message || 'Đối soát thất bại!', 'error');
                this.blockchainSyncLoading.set(false);
              },
            });
        } else {
          this.stateService.showToast(
            'Giao dịch đã có trên blockchain nhưng không thể truy vấn tx_hash gốc. Vui lòng thử lại!',
            'error',
          );
          this.blockchainSyncLoading.set(false);
        }
      } else {
        this.stateService.showToast(result.error || 'Giao dịch thất bại hoặc bị từ chối!', 'error');
        this.blockchainSyncLoading.set(false);
      }
    }
  }
}
