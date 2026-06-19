import { Component, OnInit, OnDestroy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { ApiService } from '@core/services/api.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';

@Component({
  selector: 'app-web3-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, ThemeToggleComponent, TabGroupComponent],
  templateUrl: './web3-public-header.component.html'
})
export class Web3PublicHeaderComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly isWaitingForSignature = signal<boolean>(false);
  public readonly isCurrentlySigning = signal<boolean>(false);

  public readonly activeTab = signal<string>('/claim-points');
  public readonly publicNavTabs: TabOption[] = [
    { value: '/marketplace', label: 'Chợ Voucher & NFT', icon: 'ticket' },
    { value: '/claim-points', label: 'Tích Điểm Hóa Đơn', icon: 'gift' },
  ];

  private pendingNonceMessage = '';
  private pendingAddress = '';
  private routerSub?: Subscription;

  public get settings() { return this.stateService.settings; }
  public get nativeTokenPriceVND() { return this.stateService.nativeTokenPriceVND; }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#public-chain-dropdown-container')?.contains(target)) {
      this.isChainDropdownOpen.set(false);
    }
  }

  ngOnInit() {
    // Tự động load settings nếu chưa có dữ liệu
    if (!this.stateService.settings() || !this.stateService.settings().store_name) {
      this.stateService.loadSettings();
    }

    this.setActiveTabByUrl(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setActiveTabByUrl(event.urlAfterRedirects || event.url);
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private setActiveTabByUrl(url: string) {
    if (url.includes('/claim-points')) {
      this.activeTab.set('/claim-points');
    } else if (url.includes('/marketplace')) {
      this.activeTab.set('/marketplace');
    }
  }

  public onTabChange(path: string) {
    this.router.navigate([path]);
  }

  // Kết nối và Yêu cầu Ký ví Web3 Auth cho khách hàng
  public async connectWalletAndSign() {
    if (this.isCurrentlySigning()) return;
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;

      this.isCurrentlySigning.set(true);
      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          this.pendingNonceMessage = res.message;
          this.pendingAddress = address;
          this.isWaitingForSignature.set(true);
          this.stateService.showToast('Vui lòng ký xác thực trên ví của bạn...', 'success');

          try {
            const signature = await this.web3Service.signMessage(res.message);
            this.isWaitingForSignature.set(false);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                this.isCurrentlySigning.set(false);
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                    localStorage.setItem('auth_logged_in', 'true');

                    // Thiết lập quyền hạn cơ bản của khách hàng
                    localStorage.removeItem('auth_role');
                    this.stateService.currentUserRole.set('Khách hàng');
                    this.stateService.currentUserPermissions.set(null);
                  }
                  this.web3Service.walletConnected.set(true);
                  this.stateService.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.stateService.isWalletModalOpen.set(false);

                  // Không redirect về dashboard, chỉ loadSettings để cập nhật giao diện
                  this.stateService.loadSettings();
                }
              },
              error: (err) => {
                this.isWaitingForSignature.set(false);
                this.isCurrentlySigning.set(false);
                this.web3Service.disconnectWallet();
                this.stateService.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            this.isWaitingForSignature.set(false);
            this.isCurrentlySigning.set(false);
            this.web3Service.disconnectWallet();
            this.stateService.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          this.isWaitingForSignature.set(false);
          this.isCurrentlySigning.set(false);
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.stateService.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
        }
      });
    }
  }

  // Ký lại xác thực
  public async retrySign() {
    if (this.isCurrentlySigning()) return;
    if (!this.pendingNonceMessage || !this.pendingAddress) return;
    this.isCurrentlySigning.set(true);
    try {
      const signature = await this.web3Service.signMessage(this.pendingNonceMessage);
      this.isWaitingForSignature.set(false);

      this.apiService.verifySignature(this.pendingAddress, signature).subscribe({
        next: (verifyRes) => {
          this.isCurrentlySigning.set(false);
          if (verifyRes.token) {
            this.apiService.setToken(verifyRes.token);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_address', this.pendingAddress);
              localStorage.setItem('auth_logged_in', 'true');
              localStorage.removeItem('auth_role');
              this.stateService.currentUserRole.set('Khách hàng');
              this.stateService.currentUserPermissions.set(null);
            }
            this.web3Service.walletConnected.set(true);
            this.stateService.showToast('Kết nối và xác thực ví thành công!', 'success');
            this.stateService.isWalletModalOpen.set(false);
            this.stateService.loadSettings();
          }
        },
        error: () => {
          this.isWaitingForSignature.set(false);
          this.isCurrentlySigning.set(false);
          this.web3Service.disconnectWallet();
          this.stateService.showToast('Phiên ký đã hết hạn. Vui lòng kết nối ví lại!', 'error');
        }
      });
    } catch (e) {
      this.isCurrentlySigning.set(false);
      this.stateService.showToast('Bạn đã từ chối ký xác thực!', 'error');
    }
  }

  // Hủy tiến trình ký
  public cancelSign() {
    this.isWaitingForSignature.set(false);
    this.isCurrentlySigning.set(false);
    this.pendingNonceMessage = '';
    this.pendingAddress = '';
    this.web3Service.disconnectWallet();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_logged_in');
    }
    this.stateService.showToast('Đã hủy xác thực ví.', 'error');
  }

  // Đổi mạng
  public async switchChain(chainId: string) {
    this.isChainDropdownOpen.set(false);
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 trước khi chọn mạng lưới!', 'error');
      return;
    }

    this.stateService.showToast('Đang yêu cầu chuyển mạng ví...', 'success');
    try {
      const success = await this.web3Service.ensureCorrectNetwork(chainId);
      if (success) {
        this.stateService.showToast(`Đã chuyển mạng ví sang ${this.web3Service.getNetworkNameByChainId(chainId)}!`, 'success');
      } else {
        this.stateService.showToast(this.web3Service.walletError() || 'Chuyển mạng thất bại!', 'error');
      }
    } catch (e: any) {
      this.stateService.showToast(e.message || 'Chuyển mạng thất bại!', 'error');
    }
  }

  // Lấy màu mạng blockchain
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

  // Sao chép ví
  public copyAddress() {
    const address = this.web3Service.currentAccount();
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      this.stateService.showToast('Đã sao chép địa chỉ ví!', 'success');
    });
  }

  // Mở modal ví
  public openWalletModal() {
    this.stateService.isWalletModalOpen.set(true);
  }
}
