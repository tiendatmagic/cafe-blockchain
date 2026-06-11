import { Component, OnInit, OnDestroy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from './services/state.service';
import { Web3Service } from './services/web3.service';
import { ApiService } from './services/api.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly elementRef = inject(ElementRef);

  public readonly isPriceDropdownOpen = signal<boolean>(false);
  public get usdtPriceVND() { return this.stateService.usdtPriceVND; }
  private readonly router = inject(Router);

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#price-dropdown-container')?.contains(target)) {
      this.isPriceDropdownOpen.set(false);
    }
  }

  public get isPublicLayout(): boolean {
    return this.router.url.includes('/mobile-sign') || 
           this.router.url.includes('/blockchain-explorer') ||
           this.router.url.includes('/store/');
  }

  // Getters từ StateService để binding dễ dàng trong app.html
  public get successMessage() { return this.stateService.successMessage; }
  public get errorMessage() { return this.stateService.errorMessage; }
  public get isWalletModalOpen() { return this.stateService.isWalletModalOpen; }
  public get settings() { return this.stateService.settings; }
  public get nativeTokenPriceVND() { return this.stateService.nativeTokenPriceVND; }

  // Tính trạng thái sai chain trực tiếp hoặc lấy từ StateService/Web3Service
  public get isWrongChain() {
    const connected = this.web3Service.walletConnected();
    const contract = this.web3Service.contractAddress();
    const activeChain = this.web3Service.chainId();
    const configChain = this.web3Service.configuredChainId();
    return connected && !!contract && contract.trim() !== '' && activeChain !== configChain;
  }

  private accountsChangedSub?: any;

  ngOnInit() {
    const isPublic = typeof window !== 'undefined' && (
      window.location.pathname.includes('/mobile-sign') || 
      window.location.pathname.includes('/blockchain-explorer') ||
      window.location.pathname.includes('/store/')
    );


    // Chỉ tải cấu hình quán của admin khi không ở trang public
    if (!isPublic) {
      this.stateService.loadSettings();
    }

    // Nếu đã có token và ví được lưu trước đó, tải toàn bộ dữ liệu
    const hasToken = this.apiService.getToken();
    const hasAddress = typeof window !== 'undefined' ? localStorage.getItem('auth_address') : null;

    if (hasToken && hasAddress) {
      // Dữ liệu của tab hiện tại sẽ tự động được tải thông qua setTabState khi router kích hoạt.
      // Không cần gọi loadAllData() tải trước tất cả các module ở đây để tránh dư thừa và trùng lặp API request.
    }

    // Lắng nghe sự kiện thay đổi ví từ Web3Service
    this.accountsChangedSub = this.web3Service.accountsChanged$.subscribe((newAccount) => {
      this.handleAccountSwitch(newAccount);
    });
  }

  ngOnDestroy() {
    if (this.accountsChangedSub) {
      this.accountsChangedSub.unsubscribe();
    }
  }

  // Kết nối và Yêu cầu Ký ví Web3 Auth
  public async connectWalletAndSign() {
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;

      this.stateService.showToast('Vui lòng ký xác thực trên ví Metamask...', 'success');
      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          try {
            const signature = await this.web3Service.signMessage(res.message);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                  }
                  this.web3Service.walletConnected.set(true);
                  this.stateService.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.stateService.isWalletModalOpen.set(false);

                  // Thiết lập ngày mặc định cho dashboard nếu chưa có
                  const today = new Date();
                  const formatDateStr = (d: Date) => {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  };
                  if (!this.stateService.dashboardStartDate()) {
                    const check7 = new Date();
                    check7.setDate(today.getDate() - 6);
                    this.stateService.dashboardStartDate.set(formatDateStr(check7));
                  }
                  if (!this.stateService.dashboardEndDate()) {
                    this.stateService.dashboardEndDate.set(formatDateStr(today));
                  }

                  this.stateService.loadSettings();
                  this.stateService.refreshDashboard();

                  // Nếu đang ở trang POS, tự động chuyển hướng về Dashboard
                  if (this.router.url.includes('/pos')) {
                    this.router.navigate(['/dashboard']);
                  }
                }
              },
              error: (err) => {
                this.web3Service.disconnectWallet();
                this.stateService.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            this.web3Service.disconnectWallet();
            this.stateService.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.stateService.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
        }
      });
    }
  }

  // Xử lý khi tài khoản ví Web3 thay đổi
  private handleAccountSwitch(newAccount: string) {
    // Xóa token cũ và địa chỉ ví cũ để đảm bảo bảo mật
    this.apiService.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
    }

    // Làm sạch dữ liệu hiện tại trong StateService để tránh lộ thông tin ví cũ
    this.stateService.cart.set([]);
    this.stateService.dashboardData.set(null);
    this.stateService.products.set([]);
    this.stateService.orders.set([]);
    this.stateService.categoriesList.set([]);

    if (newAccount) {
      console.log('Đã chuyển đổi tài khoản ví sang:', newAccount);
      this.stateService.showToast('Phát hiện tài khoản ví thay đổi. Đang yêu cầu ký xác thực lại...', 'success');
      this.connectWalletAndSign();
    } else {
      console.log('Ví đã ngắt kết nối hoàn toàn');
      this.stateService.showToast('Ví đã ngắt kết nối. Vui lòng kết nối ví để tiếp tục!', 'error');
    }
  }

  // Sao chép địa chỉ ví vào clipboard
  public copyAddress() {
    const address = this.web3Service.currentAccount();
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      this.stateService.showToast('Đã sao chép địa chỉ ví vào bộ nhớ tạm!', 'success');
    }).catch(err => {
      this.stateService.showToast('Lỗi sao chép địa chỉ ví!', 'error');
    });
  }

  // Quản lý trạng thái và dữ liệu modal gửi Native Token
  public readonly isSendTokenModalOpen = signal<boolean>(false);
  public readonly recipientAddress = signal<string>('');
  public readonly sendAmount = signal<string>('');
  public readonly isSendingToken = signal<boolean>(false);

  // Hàm thực hiện phát giao dịch gửi Native Token lên blockchain
  public async handleSendNativeToken() {
    const to = this.recipientAddress().trim();
    const amount = this.sendAmount().trim();

    if (!to) {
      this.stateService.showToast('Vui lòng nhập địa chỉ nhận!', 'error');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      this.stateService.showToast('Số lượng token không hợp lệ!', 'error');
      return;
    }

    this.isSendingToken.set(true);
    this.stateService.showToast('Đang gửi giao dịch lên blockchain...', 'success');

    try {
      const res = await this.web3Service.sendNativeToken(to, amount);
      if (res.success) {
        this.stateService.showToast('Giao dịch gửi token đã được phát đi thành công!', 'success');
        this.isSendTokenModalOpen.set(false);
        this.recipientAddress.set('');
        this.sendAmount.set('');
      } else {
        this.stateService.showToast(res.error || 'Gửi token thất bại!', 'error');
      }
    } catch (e: any) {
      this.stateService.showToast(e.message || 'Gửi token thất bại!', 'error');
    } finally {
      this.isSendingToken.set(false);
    }
  }
}
