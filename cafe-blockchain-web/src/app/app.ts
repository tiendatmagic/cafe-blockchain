import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  // Getters từ StateService để binding dễ dàng trong app.html
  public get successMessage() { return this.stateService.successMessage; }
  public get errorMessage() { return this.stateService.errorMessage; }
  public get isWalletModalOpen() { return this.stateService.isWalletModalOpen; }

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
    // Tải dữ liệu ban đầu
    this.stateService.loadAllData();

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
                  this.stateService.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.stateService.isWalletModalOpen.set(false);
                  this.stateService.loadAllData();
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
          this.web3Service.disconnectWallet();
          this.stateService.showToast('Lỗi lấy mã xác thực từ server!', 'error');
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
}
