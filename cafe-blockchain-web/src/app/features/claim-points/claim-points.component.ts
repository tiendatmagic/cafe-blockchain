import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';

@Component({
  selector: 'app-claim-points',
  standalone: true,
  imports: [CommonModule, FormsModule, Web3ConnectPromptComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './claim-points.component.html',
})
export class ClaimPointsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);

  // Form Fields
  public readonly orderCode = signal<string>('');
  public readonly phoneLast5 = signal<string>('');

  // Status Signals
  public readonly isClaiming = signal<boolean>(false);
  public readonly claimResult = signal<any>(null);
  public readonly isSuccessModalOpen = signal<boolean>(false);

  // Ví điểm thưởng khách hàng
  public readonly tokenBalance = signal<string>('0.00');

  public ngOnInit() {
    this.loadTokenBalance();
  }

  public async loadTokenBalance() {
    const address = this.web3Service.currentAccount();
    if (address) {
      const bal = await this.web3Service.getCafeTokenBalance(address);
      this.tokenBalance.set(bal);
    }
  }

  /**
   * Xử lý kết nối ví trực tiếp bằng Reown AppKit
   */
  public async connectWallet() {
    const success = await this.web3Service.connectWallet();
    if (success) {
      this.loadTokenBalance();
      this.stateService.showToast('Kết nối ví thành công!', 'success');
    }
  }

  /**
   * Submit đơn claim tích điểm thưởng
   */
  public onSubmitClaim() {
    if (!this.web3Service.currentAccount()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để nhận token!', 'error');
      return;
    }

    const code = this.orderCode().trim();
    const phone = this.phoneLast5().trim();

    if (!code) {
      this.stateService.showToast('Vui lòng nhập mã hóa đơn!', 'error');
      return;
    }

    if (!phone || phone.length !== 5 || isNaN(Number(phone))) {
      this.stateService.showToast('Số điện thoại xác nhận phải là 5 chữ số cuối!', 'error');
      return;
    }

    this.isClaiming.set(true);

    this.apiService.claimPoints(code, phone, this.web3Service.currentAccount()).subscribe({
      next: (res) => {
        this.isClaiming.set(false);
        if (res.success) {
          this.claimResult.set(res);
          this.isSuccessModalOpen.set(true);
          this.loadTokenBalance();

          // Reset Form
          this.orderCode.set('');
          this.phoneLast5.set('');
        } else {
          this.stateService.showToast(res.message || 'Tích điểm thất bại!', 'error');
        }
      },
      error: (err) => {
        this.isClaiming.set(false);
        const msg = err.error?.message || 'Có lỗi xảy ra trong quá trình kết nối máy chủ.';
        this.stateService.showToast(msg, 'error');
      },
    });
  }

  public closeSuccessModal() {
    this.isSuccessModalOpen.set(false);
    this.claimResult.set(null);
  }

  public getTxLink(txHash: string): string {
    return this.web3Service.getTxExplorerLink(txHash, this.web3Service.configuredChainId());
  }
}
