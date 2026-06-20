import { Component, inject, signal, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '@core/services/web3.service';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { JsonRpcProvider, Contract } from 'ethers';
import { CAFE_VOUCHER_NFT_ABI } from '@core/services/voucher-contract-abi';

import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-mobile-sign',
  standalone: true,
  imports: [CommonModule, VNDCurrencyPipe, ThemeToggleComponent, IconComponent, CardComponent],
  templateUrl: './mobile-sign.component.html'
})
export class MobileSignComponent implements OnInit {
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly stateService = inject(StateService);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef);

  public readonly isChainDropdownOpen = signal<boolean>(false);

  public orderCode = signal<string>('');
  public tokenId = signal<number | null>(null);
  public voucherInfo = signal<{ discount: number, minOrder: number, isUsed: boolean } | null>(null);
  public tempOrder = signal<any | null>(null);
  public orderStatus = signal<string | null>(null);
  public blockchainStatus = signal<string | null>(null);
  public txHash = signal<string | null>(null);
  public orderVoucherTokenId = signal<number | null>(null);

  public isConnecting = signal<boolean>(false);
  public isSigning = signal<boolean>(false);
  public step = signal<'connect' | 'sign' | 'success' | 'error'>('connect');
  public statusMessage = signal<string>('');
  public errorMessage = signal<string>('');

  get isWrongChain(): boolean {
    return this.web3Service.isWrongChain();
  }


  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#chain-dropdown-container')?.contains(target)) {
      this.isChainDropdownOpen.set(false);
    }
  }

  public async switchNetwork() {
    this.errorMessage.set('');
    try {
      const success = await this.web3Service.ensureCorrectNetwork();
      if (!success) {
        this.errorMessage.set('Không thể chuyển mạng tự động. Vui lòng tự chuyển mạng trong ví của bạn!');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Lỗi khi chuyển mạng.');
    }
  }

  public async switchChain(chainId: string) {
    this.isChainDropdownOpen.set(false);
    this.errorMessage.set('');

    // Kiểm tra xem ví đã được kết nối hay chưa
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      // Cho phép cập nhật cấu hình mạng mong muốn ngay cả khi ví chưa kết nối
      this.web3Service.configuredChainId.set(chainId);
      return;
    }

    try {
      const success = await this.web3Service.ensureCorrectNetwork(chainId);
      if (!success) {
        this.errorMessage.set('Không thể chuyển mạng tự động. Vui lòng tự chuyển mạng trong ví của bạn!');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Lỗi khi chuyển mạng.');
    }
  }

  public getChainColorClass(chainId: string): string {
    switch (chainId) {
      case '1':
      case '11155111':
        return 'bg-blue-500';
      case '56':
      case '97':
        return 'bg-yellow-500';
      case '137':
        return 'bg-purple-500';
      case '42161':
      case '8453':
        return 'bg-sky-500';
      case '10':
      case '43114':
      case '421614':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['order_code'] || '';
      const tid = params['token_id'] ? Number(params['token_id']) : null;
      this.orderCode.set(code);
      this.tokenId.set(tid);

      if (!code) {
        this.step.set('error');
        this.errorMessage.set('Thiếu tham số mã hóa đơn!');
        return;
      }

      // Tải cấu hình public của quán từ backend để lấy màu sắc động & địa chỉ contract blockchain
      this.apiService.getPublicSettings(code).subscribe({
        next: (settings) => {
          if (settings) {
            this.web3Service.updateConfig(settings);
            this.stateService.applyDynamicColors(settings.primary_color, settings.secondary_color);
            if (settings.temp_order) {
              this.tempOrder.set(settings.temp_order);
            }
            this.orderStatus.set(settings.order_status || null);
            this.blockchainStatus.set(settings.blockchain_status || null);
            this.txHash.set(settings.tx_hash || null);
            this.orderVoucherTokenId.set(settings.voucher_nft_token_id ? Number(settings.voucher_nft_token_id) : null);

            // Nếu không truyền token_id, đây là yêu cầu xem biên lai/trạng thái đơn hàng thông thường
            if (tid === null) {
              this.step.set('success');
              return;
            }

            // 1. Nếu đơn hàng đã bị hủy, chuyển sang step 'success' ngay để hiển thị màn hình báo hủy
            if (settings.order_status === 'cancelled') {
              this.step.set('success');
              return;
            }

            // 2. Nếu voucher đã được áp dụng thành công cho đơn hàng này rồi, chuyển sang step 'success' ngay
            const orderVoucherId = settings.voucher_nft_token_id ? Number(settings.voucher_nft_token_id) : null;
            if (orderVoucherId !== null && orderVoucherId === tid) {
              this.step.set('success');
              return;
            }

            // 3. Nếu đơn hàng đã hoàn tất (completed) hoặc đang chuẩn bị (preparing) nhưng không phải do voucher này áp dụng
            // (hoặc chưa áp dụng voucher nào, hoặc áp dụng voucher khác), thì không cho phép ký ví nữa vì đơn hàng đã được xử lý.
            if (settings.order_status === 'completed' || settings.order_status === 'preparing') {
              this.step.set('error');
              this.errorMessage.set('Đơn hàng đã được xử lý hoặc thanh toán từ trước, không thể áp dụng NFT Voucher này nữa!');
              return;
            }
          }
          // Tải thông tin voucher on-chain sau khi đã có config của quán
          if (tid !== null) {
            this.fetchVoucherDetailsOnChain(tid);
          }
        },
        error: (err) => {
          console.error('Lỗi tải cấu hình public của quán:', err);
          this.step.set('error');
          this.errorMessage.set(err.error?.message || 'Không thể tải thông tin hóa đơn và cấu hình của quán. Vui lòng kiểm tra lại đường dẫn!');
        }
      });
    });

    // Theo dõi trạng thái kết nối ví của khách hàng
    if (this.web3Service.walletConnected()) {
      this.step.set('sign');
    }
  }

  private async fetchVoucherDetailsOnChain(tokenId: number) {
    const rpc = this.web3Service.rpcUrl() || 'https://bsc-testnet-rpc.publicnode.com';
    const contractAddr = this.web3Service.voucherContractAddress();

    if (!contractAddr) {
      // Fallback hiển thị thông tin mặc định
      this.voucherInfo.set({ discount: 5000, minOrder: 100000, isUsed: false });
      return;
    }

    try {
      const provider = new JsonRpcProvider(rpc);
      const contract = new Contract(contractAddr, CAFE_VOUCHER_NFT_ABI, provider);
      const info = await contract['vouchers'](tokenId);
      
      this.voucherInfo.set({
        discount: Number(info.discountAmount),
        minOrder: Number(info.minOrderAmount),
        isUsed: info.isUsed
      });

      if (info.isUsed) {
        const isMatchedOrder = this.orderStatus() !== null && this.orderVoucherTokenId() === tokenId;
        if (isMatchedOrder) {
          this.step.set('success');
        } else {
          this.step.set('error');
          this.errorMessage.set('NFT Voucher này đã được sử dụng hoặc tiêu hủy trước đó!');
        }
      }
    } catch (err: any) {
      console.error('Lỗi lấy thông tin voucher on-chain:', err);
      // Fallback
      this.voucherInfo.set({ discount: 5000, minOrder: 100000, isUsed: false });
    }
  }

  public async connectWallet() {
    this.isConnecting.set(true);
    this.errorMessage.set('');
    try {
      const success = await this.web3Service.connectWallet();
      if (success) {
        this.step.set('sign');
      } else {
        this.errorMessage.set('Không thể kết nối tới ví của bạn. Vui lòng mở ví Metamask di động!');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Lỗi kết nối ví.');
    } finally {
      this.isConnecting.set(false);
    }
  }

  public async signVoucher() {
    const tid = this.tokenId();
    const code = this.orderCode();
    if (tid === null || !code) return;

    this.isSigning.set(true);
    this.errorMessage.set('');
    this.statusMessage.set('Vui lòng mở ứng dụng ví để duyệt chữ ký số...');

    try {
      // 1. Thực hiện ký số EIP-712 bằng ví Metamask di động của khách hàng
      const signature = await this.web3Service.signVoucherUsageEIP712(tid, code);

      this.statusMessage.set('Đang nộp chữ ký lên hệ thống POS...');
      
      // 2. POST chữ ký số lên backend Laravel qua endpoint công khai
      this.apiService.submitVoucherSignature(code, signature).subscribe({
        next: (res) => {
          if (res.success) {
            this.step.set('success');
          } else {
            this.step.set('error');
            this.errorMessage.set(res.message || 'Gửi chữ ký số thất bại!');
          }
          this.isSigning.set(false);
        },
        error: (err) => {
          this.step.set('error');
          this.errorMessage.set(err.error?.message || 'Lỗi gửi chữ ký lên máy POS.');
          this.isSigning.set(false);
        }
      });
    } catch (err: any) {
      console.error('Lỗi ký số:', err);
      this.errorMessage.set(err.reason || err.message || 'Bạn đã từ chối ký ví.');
      this.statusMessage.set('');
      this.isSigning.set(false);
    }
  }
}
