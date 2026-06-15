import { Component, OnInit, OnDestroy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from '@services/state.service';
import { Web3Service } from '@services/web3.service';
import { ApiService } from '@services/api.service';
import { SidebarComponent } from '@components/layout/sidebar/sidebar.component';
import { IconComponent } from '@components/shared/icon/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly elementRef = inject(ElementRef);

  public readonly isPriceDropdownOpen = signal<boolean>(false);
  public readonly isChainDropdownOpen = signal<boolean>(false);
  public get usdtPriceVND() { return this.stateService.usdtPriceVND; }
  private readonly router = inject(Router);

  // Trạng thái chờ ký xác thực - hiển thị banner nhắc nhở người dùng
  public readonly isWaitingForSignature = signal<boolean>(false);
  private pendingNonceMessage = '';
  private pendingAddress = '';

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#price-dropdown-container')?.contains(target)) {
      this.isPriceDropdownOpen.set(false);
    }
    if (!this.elementRef.nativeElement.querySelector('#chain-dropdown-container')?.contains(target)) {
      this.isChainDropdownOpen.set(false);
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

  public get isWrongChain() {
    return this.web3Service.isWrongChain();
  }


  private accountsChangedSub?: any;

  ngOnInit() {
    const isPublic = typeof window !== 'undefined' && (
      window.location.pathname.includes('/mobile-sign') || 
      window.location.pathname.includes('/blockchain-explorer') ||
      window.location.pathname.includes('/store/')
    );




    // Nếu đã có ví được lưu trước đó, hệ thống sẽ tự động đồng bộ trạng thái khi AppKit kết nối
    const hasAddress = typeof window !== 'undefined' ? localStorage.getItem('auth_address') : null;

    if (hasAddress) {
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

      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          // Lưu nonce để có thể ký lại nếu người dùng quên
          this.pendingNonceMessage = res.message;
          this.pendingAddress = address;
          this.isWaitingForSignature.set(true);
          this.stateService.showToast('Vui lòng ký xác thực trên ví của bạn...', 'success');

          try {
            const signature = await this.web3Service.signMessage(res.message);
            this.isWaitingForSignature.set(false);

            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                    localStorage.setItem('auth_logged_in', 'true');
                    if (verifyRes.role) {
                      localStorage.setItem('auth_role', verifyRes.role);
                      this.stateService.currentUserRole.set(verifyRes.role);
                    } else {
                      localStorage.removeItem('auth_role');
                      this.stateService.currentUserRole.set('Chủ cửa hàng');
                    }
                    if (verifyRes.permissions) {
                      const permStr = JSON.stringify(verifyRes.permissions);
                      localStorage.setItem('auth_permissions', permStr);
                      this.stateService.currentUserPermissions.set(verifyRes.permissions);
                    } else {
                      localStorage.removeItem('auth_permissions');
                      this.stateService.currentUserPermissions.set(null);
                    }
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

                  // Sau khi đăng nhập thành công: luôn chuyển về dashboard để tải dữ liệu,
                  // trừ khi người dùng đang ở dashboard thì chỉ refresh dữ liệu
                  if (this.router.url.includes('/dashboard')) {
                    this.stateService.refreshDashboard();
                  } else {
                    this.router.navigate(['/dashboard']);
                  }
                }
              },
              error: (err) => {
                this.isWaitingForSignature.set(false);
                this.web3Service.disconnectWallet();
                this.stateService.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            // Người dùng từ chối - giữ banner để họ có thể ký lại
            this.isWaitingForSignature.set(false);
            this.web3Service.disconnectWallet();
            this.stateService.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          this.isWaitingForSignature.set(false);
          console.error('Lỗi lấy nonce từ server:', err, 'địa chỉ ví:', address);
          this.web3Service.disconnectWallet();
          this.stateService.showToast(`Lỗi lấy mã xác thực từ server! (Ví: ${address})`, 'error');
        }
      });
    }
  }

  // Ký lại xác thực khi người dùng bấm nút "Ký ngay" trên banner
  public async retrySign() {
    if (!this.pendingNonceMessage || !this.pendingAddress) return;
    try {
      const signature = await this.web3Service.signMessage(this.pendingNonceMessage);
      this.isWaitingForSignature.set(false);

      this.apiService.verifySignature(this.pendingAddress, signature).subscribe({
        next: (verifyRes) => {
          if (verifyRes.token) {
            this.apiService.setToken(verifyRes.token);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_address', this.pendingAddress);
              localStorage.setItem('auth_logged_in', 'true');
              if (verifyRes.role) {
                localStorage.setItem('auth_role', verifyRes.role);
                this.stateService.currentUserRole.set(verifyRes.role);
              } else {
                localStorage.removeItem('auth_role');
                this.stateService.currentUserRole.set('Chủ cửa hàng');
              }
              if (verifyRes.permissions) {
                const permStr = JSON.stringify(verifyRes.permissions);
                localStorage.setItem('auth_permissions', permStr);
                this.stateService.currentUserPermissions.set(verifyRes.permissions);
              } else {
                localStorage.removeItem('auth_permissions');
                this.stateService.currentUserPermissions.set(null);
              }
            }
            this.web3Service.walletConnected.set(true);
            this.stateService.showToast('Kết nối và xác thực ví thành công!', 'success');
            this.stateService.isWalletModalOpen.set(false);
            this.stateService.loadSettings();
            if (this.router.url.includes('/dashboard')) {
              this.stateService.refreshDashboard();
            } else {
              this.router.navigate(['/dashboard']);
            }
          }
        },
        error: () => {
          this.isWaitingForSignature.set(false);
          this.web3Service.disconnectWallet();
          this.stateService.showToast('Phiên ký đã hết hạn. Vui lòng kết nối ví lại!', 'error');
        }
      });
    } catch (e) {
      this.stateService.showToast('Bạn đã từ chối ký xác thực!', 'error');
    }
  }

  // Hủy tiến trình ký
  public cancelSign() {
    this.isWaitingForSignature.set(false);
    this.pendingNonceMessage = '';
    this.pendingAddress = '';
    this.web3Service.disconnectWallet();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_logged_in');
    }
    this.stateService.showToast('Đã hủy xác thực ví.', 'error');
  }

  // Xử lý khi tài khoản ví Web3 thay đổi
  private handleAccountSwitch(newAccount: string) {
    // Xóa token cũ và địa chỉ ví cũ để đảm bảo bảo mật
    this.apiService.removeToken();
    
    // Gọi API đăng xuất để xóa cookie HttpOnly phía backend
    this.apiService.logout().subscribe({
      next: () => {},
      error: (err) => console.warn('[Auth] Không thể xóa phiên làm việc khi chuyển đổi tài khoản:', err)
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
      localStorage.removeItem('auth_logged_in');
    }

    // Làm sạch dữ liệu hiện tại trong StateService để tránh lộ thông tin ví cũ
    this.stateService.cart.set([]);
    this.stateService.dashboardData.set(null);
    this.stateService.products.set([]);
    this.stateService.orders.set([]);
    this.stateService.categoriesList.set([]);

    if (newAccount) {
      this.stateService.showToast('Phát hiện tài khoản ví thay đổi. Đang yêu cầu ký xác thực lại...', 'success');
      this.connectWalletAndSign();
    } else {
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

  // Chuyển đổi mạng (Chain) trên ví Web3
  public async switchChain(chainId: string) {
    this.isChainDropdownOpen.set(false);

    // Kiểm tra xem ví đã được kết nối hay chưa
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

  // Lấy màu class cho chấm tròn chỉ báo của chain
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
}
