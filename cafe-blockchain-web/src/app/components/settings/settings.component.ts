import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Tab nhỏ trong Cấu hình: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher'
  public readonly settingsSubTab = signal<'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher'>('general');

  // Form Cấu hình hệ thống
  public readonly configForm = signal<any>({
    store_name: '',
    contract_address: '',
    finance_contract_address: '',
    voucher_contract_address: '',
    relayer_private_key: '',
    rpc_url: '',
    chain_id: '',
    explorer_url: '',
    explorer_api_key: '',
    primary_color: '#7c3aed',
    secondary_color: '#c084fc',
    default_print_size: '80mm',
    voucher_gift_min_amount: 100000,
    voucher_discount_amount: 5000,
    voucher_use_min_amount: 100000,
    has_relayer_private_key: false
  });

  // Trạng thái lưu cấu hình & deploy smart contracts
  public readonly isConfigSaving = signal<boolean>(false);
  public readonly isDeploying = signal<boolean>(false);
  public readonly isDeployingFinance = signal<boolean>(false);
  public readonly isDeployingVoucher = signal<boolean>(false);

  // Trạng thái Quản trị Owner Ví và ví Kế toán trên Blockchain
  public readonly ownersFromChain = signal<string[]>([]);
  public readonly newOwnerAddress = signal<string>('');
  public readonly isOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingOwnerAddress = signal<string>('');

  public readonly financeOwnersFromChain = signal<string[]>([]);
  public readonly newFinanceOwnerAddress = signal<string>('');
  public readonly isFinanceOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteFinanceOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingFinanceOwnerAddress = signal<string>('');

  // Dropdown chọn mạng
  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly selectedChainName = signal<string>('Tùy chỉnh (Custom EVM)');

  // Danh sách các mạng EVM phổ biến để Admin chọn nhanh
  public readonly POPULAR_CHAINS = [
    { name: 'Ethereum Mainnet', chainId: '1', rpcUrl: 'https://cloudflare-eth.com', explorerUrl: 'https://etherscan.io' },
    { name: 'BNB Smart Chain (BSC)', chainId: '56', rpcUrl: 'https://bsc-dataseed.binance.org', explorerUrl: 'https://bscscan.com' },
    { name: 'Polygon PoS Mainnet', chainId: '137', rpcUrl: 'https://polygon-rpc.com', explorerUrl: 'https://polygonscan.com' },
    { name: 'Arbitrum One Mainnet', chainId: '42161', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io' },
    { name: 'Optimism Mainnet', chainId: '10', rpcUrl: 'https://mainnet.optimism.io', explorerUrl: 'https://optimistic.etherscan.io' },
    { name: 'Base Mainnet', chainId: '8453', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org' },
    { name: 'Avalanche C-Chain', chainId: '43114', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', explorerUrl: 'https://snowtrace.io' },
    { name: 'Sepolia Testnet', chainId: '11155111', rpcUrl: 'https://ethereum-sepolia.publicnode.com', explorerUrl: 'https://sepolia.etherscan.io' },
    { name: 'BSC Testnet', chainId: '97', rpcUrl: 'https://bnb-testnet.api.onfinality.io/public', explorerUrl: 'https://testnet.bscscan.com' },
    { name: 'Arbitrum Sepolia', chainId: '421614', rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc', explorerUrl: 'https://sepolia.arbiscan.io/' },
  ];

  // Getters từ StateService
  public get web3Service() { return this.stateService.web3Service; }
  public get settings() { return this.stateService.settings; }

  public ngOnInit() {
    this.loadSettings();

    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['general', 'blockchain', 'permissions', 'invoice', 'voucher'].includes(tab)) {
        this.settingsSubTab.set(tab as any);
        if (tab === 'permissions' && this.web3Service.walletConnected()) {
          this.loadOwnersList();
        }
      }
    });
  }

  // Tải cấu hình
  public loadSettings() {
    this.apiService.getSettings().subscribe(res => {
      if (res) {
        const settings = {
          store_name: res.store_name || '',
          contract_address: res.contract_address || '',
          finance_contract_address: res.finance_contract_address || '',
          voucher_contract_address: res.voucher_contract_address || '',
          relayer_private_key: '',
          rpc_url: res.rpc_url || '',
          chain_id: res.chain_id || '',
          explorer_url: res.explorer_url || '',
          explorer_api_key: res.explorer_api_key || '',
          primary_color: res.primary_color || '#7c3aed',
          secondary_color: res.secondary_color || '#c084fc',
          default_print_size: res.default_print_size || '80mm',
          voucher_gift_min_amount: res.voucher_gift_min_amount !== undefined ? Number(res.voucher_gift_min_amount) : 100000,
          voucher_discount_amount: res.voucher_discount_amount !== undefined ? Number(res.voucher_discount_amount) : 5000,
          voucher_use_min_amount: res.voucher_use_min_amount !== undefined ? Number(res.voucher_use_min_amount) : 100000,
          has_relayer_private_key: res.has_relayer_private_key || false,
          ...res
        };
        this.configForm.set({ ...settings });
        
        // Cập nhật tên mạng hiển thị
        const match = this.POPULAR_CHAINS.find(c => c.chainId === settings.chain_id);
        if (match) {
          this.selectedChainName.set(`${match.name} (ID: ${match.chainId})`);
        } else {
          this.selectedChainName.set('Tùy chỉnh (Custom EVM)');
        }

        // Tải danh sách owners nếu ví đã kết nối
        if (this.web3Service.walletConnected()) {
          this.loadOwnersList();
        }
      }
    });
  }

  public setSettingsSubTab(subTab: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher') {
    this.settingsSubTab.set(subTab);
    
    // Cập nhật query parameter tab trên URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: subTab },
      queryParamsHandling: 'merge'
    });

    if (subTab === 'permissions' && this.web3Service.walletConnected()) {
      this.loadOwnersList();
    }
  }

  public updateConfigForm(field: string, value: any) {
    this.configForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  // Lưu cấu hình
  public saveConfig() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    this.isConfigSaving.set(true);
    const data = this.configForm();
    this.apiService.updateSettings(data).subscribe({
      next: (res) => {
        this.stateService.showToast('Lưu cấu hình quán và Blockchain thành công!', 'success');
        this.stateService.settings.set(res.data);
        // Cập nhật form với dữ liệu phản hồi đã ẩn private key, reset relayer_private_key về trống
        this.configForm.set({
          ...this.configForm(),
          ...res.data,
          relayer_private_key: ''
        });
        // Áp dụng màu sắc động
        this.stateService.applyAndCacheDynamicColors(res.data.primary_color, res.data.secondary_color);
        this.web3Service.updateConfig(res.data);
        this.isConfigSaving.set(false);
      },
      error: () => {
        this.stateService.showToast('Lưu cấu hình thất bại!', 'error');
        this.isConfigSaving.set(false);
      }
    });
  }

  // Khôi phục màu sắc giao diện về mặc định
  public resetColorsToDefault() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    this.configForm.update(form => ({
      ...form,
      primary_color: '#7c3aed',
      secondary_color: '#c084fc'
    }));
    this.stateService.applyDynamicColors('#7c3aed', '#c084fc');
    this.stateService.showToast('Đã đặt màu về mặc định. Nhấn "LƯU CẤU HÌNH HỆ THỐNG" để ghi nhận!', 'success');
  }

  // Tự động deploy Smart Contract bán hàng mới
  public async deployNewContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url
    });

    this.isDeploying.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract trên ví của bạn...', 'success');

    const res = await this.web3Service.deployContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update(form => ({
        ...form,
        contract_address: res.contractAddress
      }));
      this.web3Service.updateConfig({ contract_address: res.contractAddress });
      this.stateService.showToast(`Deploy thành công! Contract mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`, 'success');
      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Deploy Smart Contract thất bại!', 'error');
    }
    this.isDeploying.set(false);
  }

  // Tự động deploy Smart Contract Tài chính mới
  public async deployFinanceContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url
    });

    this.isDeployingFinance.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract Tài chính trên ví của bạn...', 'success');

    const res = await this.web3Service.deployFinanceContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update(form => ({
        ...form,
        finance_contract_address: res.contractAddress
      }));
      this.web3Service.updateConfig({ finance_contract_address: res.contractAddress });
      this.stateService.showToast(`Deploy Smart Contract Tài chính thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`, 'success');
    } else {
      this.stateService.showToast(res.error || 'Deploy Smart Contract Tài chính thất bại!', 'error');
    }
    this.isDeployingFinance.set(false);
  }

  // Tự động deploy Smart Contract NFT Voucher mới
  public async deployVoucherContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url
    });

    this.isDeployingVoucher.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract NFT Voucher trên ví của bạn...', 'success');

    const res = await this.web3Service.deployVoucherContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update(form => ({
        ...form,
        voucher_contract_address: res.contractAddress
      }));
      this.web3Service.updateConfig({ voucher_contract_address: res.contractAddress });
      this.stateService.showToast(`Deploy Smart Contract NFT Voucher thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`, 'success');
    } else {
      this.stateService.showToast(res.error || 'Deploy Smart Contract NFT Voucher thất bại!', 'error');
    }
    this.isDeployingVoucher.set(false);
  }

  // Tải danh sách Owners trực tiếp từ Smart Contract Blockchain
  public async loadOwnersList() {
    if (this.web3Service.walletConnected()) {
      const list = await this.web3Service.getOwnersFromChain();
      this.ownersFromChain.set(list);
      await this.loadFinanceOwnersList();
    }
  }

  // Thêm Owner (ví thu ngân) mới trên Blockchain
  public async addOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast('Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!', 'error');
      return;
    }

    this.isOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch thêm Owner trên ví của bạn...', 'success');

    const res = await this.web3Service.addOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch thêm Owner thành công! TxHash: ${res.txHash}`, 'success');
      this.newOwnerAddress.set('');

      // Đồng bộ đăng ký ví thu ngân vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ đăng ký thu ngân vào DB.'),
        error: (err) => console.error('Lỗi đồng bộ đăng ký thu ngân:', err)
      });

      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Tải danh sách ví Kế toán trực tiếp từ Smart Contract Blockchain
  public async loadFinanceOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.financeContractAddress()) {
      const list = await this.web3Service.getFinanceOwnersFromChain();
      this.financeOwnersFromChain.set(list);
    }
  }

  // Thêm ví Kế toán mới trên Blockchain
  public async addFinanceOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newFinanceOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast('Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!', 'error');
      return;
    }

    this.isFinanceOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch thêm ví Kế toán trên ví của bạn...', 'success');

    const res = await this.web3Service.addFinanceOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch thêm ví Kế toán thành công! TxHash: ${res.txHash}`, 'success');
      this.newFinanceOwnerAddress.set('');

      // Đồng bộ đăng ký ví kế toán vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ đăng ký kế toán vào DB.'),
        error: (err) => console.error('Lỗi đồng bộ đăng ký kế toán:', err)
      });

      await this.loadFinanceOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Kế toán thất bại!', 'error');
    }
    this.isFinanceOwnerActionLoading.set(false);
  }

  public removeFinanceOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.deletingFinanceOwnerAddress.set(address);
    this.isDeleteFinanceOwnerConfirmOpen.set(true);
  }

  public async confirmDeleteFinanceOwner() {
    if (this.isFinanceOwnerActionLoading()) return;

    const address = this.deletingFinanceOwnerAddress();
    if (!address) return;

    this.isFinanceOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch xóa ví Kế toán trên ví của bạn...', 'success');

    const res = await this.web3Service.removeFinanceOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch xóa ví Kế toán thành công! TxHash: ${res.txHash}`, 'success');
      this.isDeleteFinanceOwnerConfirmOpen.set(false);
      this.deletingFinanceOwnerAddress.set('');

      // Đồng bộ gỡ ví kế toán khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ gỡ kế toán khỏi DB.'),
        error: (err) => console.error('Lỗi đồng bộ gỡ kế toán khỏi DB:', err)
      });

      await this.loadFinanceOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Kế toán thất bại!', 'error');
    }
    this.isFinanceOwnerActionLoading.set(false);
  }

  public removeOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.deletingOwnerAddress.set(address);
    this.isDeleteOwnerConfirmOpen.set(true);
  }

  public async confirmDeleteOwner() {
    if (this.isOwnerActionLoading()) return;

    const address = this.deletingOwnerAddress();
    if (!address) return;

    this.isOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch xóa Owner trên ví của bạn...', 'success');

    const res = await this.web3Service.removeOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch xóa Owner thành công! TxHash: ${res.txHash}`, 'success');
      this.isDeleteOwnerConfirmOpen.set(false);
      this.deletingOwnerAddress.set('');

      // Đồng bộ gỡ bỏ ví thu ngân khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ gỡ thu ngân khỏi DB.'),
        error: (err) => console.error('Lỗi đồng bộ gỡ thu ngân khỏi DB:', err)
      });

      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Toggle đóng mở dropdown chọn mạng
  public toggleChainDropdown() {
    if (!this.web3Service.walletConnected() || !this.web3Service.isOwnerContract()) return;
    this.isChainDropdownOpen.update(val => !val);
  }

  // Chọn nhanh mạng lưới EVM
  public selectPopularChainDirect(chain: { name: string, chainId: string, rpcUrl: string, explorerUrl: string }) {
    this.configForm.update(form => ({
      ...form,
      rpc_url: chain.rpcUrl,
      chain_id: chain.chainId,
      explorer_url: chain.explorerUrl
    }));
    this.selectedChainName.set(`${chain.name} (ID: ${chain.chainId})`);
    this.stateService.showToast(`Đã tự động điền cấu hình mạng: ${chain.name}!`, 'success');
    this.isChainDropdownOpen.set(false);
  }
}
