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

  // Tab nhỏ trong Cấu hình: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store'
  public readonly settingsSubTab = signal<'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store'>('general');

  // Form Cấu hình hệ thống
  public readonly configForm = signal<any>({
    store_name: '',
    contract_address: '',
    finance_contract_address: '',
    voucher_contract_address: '',
    menu_registry_contract_address: '',
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
    show_crypto_payment: '0',
    has_synced_menu: '0',
    website_slug: '',
    store_categories: '',
    website_cover_image: '',
    has_relayer_private_key: false
  });

  // Quản lý các danh mục cho Website Cửa hàng
  public readonly categoriesList = signal<any[]>([]);
  public readonly selectedCategories = signal<string[]>([]);


  // Trạng thái lưu cấu hình & deploy smart contracts
  public readonly isConfigSaving = signal<boolean>(false);
  public readonly isDeploying = signal<boolean>(false);
  public readonly isDeployingFinance = signal<boolean>(false);
  public readonly isDeployingVoucher = signal<boolean>(false);
  public readonly isDeployingMenuRegistry = signal<boolean>(false);

  // Trạng thái Quản trị Owner Ví và ví Kế toán trên Blockchain
  public readonly ownersFromChain = signal<string[]>([]);
  public readonly newOwnerAddress = signal<string>('');
  public readonly isOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingOwnerAddress = signal<string>('');
  public readonly isOwnersLoading = signal<boolean>(false);

  public readonly financeOwnersFromChain = signal<string[]>([]);
  public readonly newFinanceOwnerAddress = signal<string>('');
  public readonly isFinanceOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteFinanceOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingFinanceOwnerAddress = signal<string>('');

  public readonly menuOwnersFromChain = signal<string[]>([]);
  public readonly newMenuOwnerAddress = signal<string>('');
  public readonly isMenuOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteMenuOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingMenuOwnerAddress = signal<string>('');

  public readonly voucherOwnersFromChain = signal<string[]>([]);
  public readonly newVoucherOwnerAddress = signal<string>('');
  public readonly isVoucherOwnerActionLoading = signal<boolean>(false);
  public readonly isDeleteVoucherOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingVoucherOwnerAddress = signal<string>('');
  public readonly isFinanceOwnersLoading = signal<boolean>(false);
  public readonly isMenuOwnersLoading = signal<boolean>(false);
  public readonly isVoucherOwnersLoading = signal<boolean>(false);

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
    this.loadStoreCategories();

    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && ['general', 'blockchain', 'permissions', 'invoice', 'voucher', 'store'].includes(tab)) {
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
          show_crypto_payment: res.show_crypto_payment || '0',
          has_synced_menu: res.has_synced_menu || '0',
          website_slug: res.website_slug || '',
          store_categories: res.store_categories || '',
          website_cover_image: res.website_cover_image || '',
          has_relayer_private_key: res.has_relayer_private_key || false,
          ...res
        };
        this.configForm.set({ ...settings });
        this.syncSelectedCategories();

        // Đồng bộ cấu hình vào Web3Service và StateService để đảm bảo các cuộc gọi blockchain sử dụng đúng cấu hình mới nhất
        this.stateService.settings.set(settings);
        this.web3Service.updateConfig(settings);
        
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

  public setSettingsSubTab(subTab: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store') {
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

  // --- Hỗ trợ cấu hình Website Cửa hàng ---
  public loadStoreCategories() {
    this.apiService.getCategories().subscribe(res => {
      if (res) {
        this.categoriesList.set(res);
        this.syncSelectedCategories();
      }
    });
  }

  public syncSelectedCategories() {
    const csv = this.configForm().store_categories || '';
    if (csv === 'all') {
      this.selectedCategories.set(this.categoriesList().map(c => c.id.toString()));
    } else if (csv === '') {
      this.selectedCategories.set([]);
    } else {
      this.selectedCategories.set(csv.split(','));
    }
  }

  public isCategorySelected(categoryId: any): boolean {
    return this.selectedCategories().includes(categoryId.toString());
  }

  public toggleCategorySelection(categoryId: any) {
    const idStr = categoryId.toString();
    const current = [...this.selectedCategories()];
    const index = current.indexOf(idStr);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(idStr);
    }
    
    this.selectedCategories.set(current);
    
    // Nếu chọn hết, lưu là 'all' để tiện đồng bộ sau này hoặc lưu chuỗi CSV
    if (current.length === this.categoriesList().length && current.length > 0) {
      this.updateConfigForm('store_categories', 'all');
    } else {
      this.updateConfigForm('store_categories', current.join(','));
    }
  }

  public selectAllCategories() {
    const allIds = this.categoriesList().map(c => c.id.toString());
    this.selectedCategories.set(allIds);
    this.updateConfigForm('store_categories', 'all');
  }

  public clearAllCategories() {
    this.selectedCategories.set([]);
    this.updateConfigForm('store_categories', '');
  }

  public getFullStoreLink(): string {
    const slug = this.configForm().website_slug || '';
    if (!slug) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/store/${slug}`;
    }
    return `http://localhost:4200/store/${slug}`;
  }

  public copyStoreLink() {
    const link = this.getFullStoreLink();
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      this.stateService.showToast('Đã sao chép liên kết Website Cửa hàng!', 'success');
    }).catch(err => {
      this.stateService.showToast('Lỗi sao chép liên kết!', 'error');
    });
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

  // Tự động deploy Smart Contract Menu Registry mới
  public async deployMenuRegistryContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url
    });

    this.isDeployingMenuRegistry.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract Menu Registry trên ví của bạn...', 'success');

    const res = await this.web3Service.deployMenuRegistryContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update(form => ({
        ...form,
        menu_registry_contract_address: res.contractAddress
      }));
      this.web3Service.updateConfig({ menu_registry_contract_address: res.contractAddress });
      this.stateService.showToast(`Deploy Smart Contract Menu Registry thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`, 'success');
    } else {
      this.stateService.showToast(res.error || 'Deploy Smart Contract Menu Registry thất bại!', 'error');
    }
    this.isDeployingMenuRegistry.set(false);
  }

  // Tải danh sách Owners trực tiếp từ Smart Contract Blockchain
  public async loadOwnersList() {
    if (this.web3Service.walletConnected()) {
      this.isOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getOwnersFromChain();
        this.ownersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví thu ngân:', e);
        this.ownersFromChain.set([]);
      } finally {
        this.isOwnersLoading.set(false);
      }
      await this.loadFinanceOwnersList();
      await this.loadMenuOwnersList();
      await this.loadVoucherOwnersList();
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
      this.isFinanceOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getFinanceOwnersFromChain();
        this.financeOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví kế toán:', e);
        this.financeOwnersFromChain.set([]);
      } finally {
        this.isFinanceOwnersLoading.set(false);
      }
    } else {
      this.financeOwnersFromChain.set([]);
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

  // Tải danh sách ví Menu Registry trực tiếp từ Smart Contract Blockchain
  public async loadMenuOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.menuRegistryContractAddress()) {
      this.isMenuOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getMenuRegistryOwnersFromChain();
        this.menuOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví menu registry:', e);
        this.menuOwnersFromChain.set([]);
      } finally {
        this.isMenuOwnersLoading.set(false);
      }
    } else {
      this.menuOwnersFromChain.set([]);
    }
  }

  // Thêm ví Menu Registry mới trên Blockchain
  public async addMenuOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newMenuOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast('Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!', 'error');
      return;
    }

    this.isMenuOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch thêm ví Quản trị Thực đơn trên ví của bạn...', 'success');

    const res = await this.web3Service.addMenuRegistryOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch thêm ví Quản trị Thực đơn thành công! TxHash: ${res.txHash}`, 'success');
      this.newMenuOwnerAddress.set('');

      // Đồng bộ đăng ký ví vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ đăng ký quản trị thực đơn vào DB.'),
        error: (err) => console.error('Lỗi đồng bộ đăng ký quản trị thực đơn:', err)
      });

      await this.loadMenuOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Quản trị Thực đơn thất bại!', 'error');
    }
    this.isMenuOwnerActionLoading.set(false);
  }

  public removeMenuOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.deletingMenuOwnerAddress.set(address);
    this.isDeleteMenuOwnerConfirmOpen.set(true);
  }

  public async confirmDeleteMenuOwner() {
    if (this.isMenuOwnerActionLoading()) return;

    const address = this.deletingMenuOwnerAddress();
    if (!address) return;

    this.isMenuOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch xóa ví Quản trị Thực đơn trên ví của bạn...', 'success');

    const res = await this.web3Service.removeMenuRegistryOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch xóa ví Quản trị Thực đơn thành công! TxHash: ${res.txHash}`, 'success');
      this.isDeleteMenuOwnerConfirmOpen.set(false);
      this.deletingMenuOwnerAddress.set('');

      // Đồng bộ gỡ ví khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ gỡ quản trị thực đơn khỏi DB.'),
        error: (err) => console.error('Lỗi đồng bộ gỡ quản trị thực đơn khỏi DB:', err)
      });

      await this.loadMenuOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Quản trị Thực đơn thất bại!', 'error');
    }
    this.isMenuOwnerActionLoading.set(false);
  }

  // Tải danh sách ví Voucher NFT trực tiếp từ Smart Contract Blockchain
  public async loadVoucherOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.voucherContractAddress()) {
      this.isVoucherOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getVoucherOwnersFromChain();
        this.voucherOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví voucher nft:', e);
        this.voucherOwnersFromChain.set([]);
      } finally {
        this.isVoucherOwnersLoading.set(false);
      }
    } else {
      this.voucherOwnersFromChain.set([]);
    }
  }

  // Thêm ví Voucher NFT mới trên Blockchain
  public async addVoucherOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newVoucherOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast('Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!', 'error');
      return;
    }

    this.isVoucherOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch thêm ví Quản trị Voucher trên ví của bạn...', 'success');

    const res = await this.web3Service.addVoucherOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch thêm ví Quản trị Voucher thành công! TxHash: ${res.txHash}`, 'success');
      this.newVoucherOwnerAddress.set('');

      // Đồng bộ đăng ký ví vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ đăng ký quản trị voucher vào DB.'),
        error: (err) => console.error('Lỗi đồng bộ đăng ký quản trị voucher:', err)
      });

      await this.loadVoucherOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Quản trị Voucher thất bại!', 'error');
    }
    this.isVoucherOwnerActionLoading.set(false);
  }

  public removeVoucherOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.deletingVoucherOwnerAddress.set(address);
    this.isDeleteVoucherOwnerConfirmOpen.set(true);
  }

  public async confirmDeleteVoucherOwner() {
    if (this.isVoucherOwnerActionLoading()) return;

    const address = this.deletingVoucherOwnerAddress();
    if (!address) return;

    this.isVoucherOwnerActionLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch xóa ví Quản trị Voucher trên ví của bạn...', 'success');

    const res = await this.web3Service.removeVoucherOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(`Giao dịch xóa ví Quản trị Voucher thành công! TxHash: ${res.txHash}`, 'success');
      this.isDeleteVoucherOwnerConfirmOpen.set(false);
      this.deletingVoucherOwnerAddress.set('');

      // Đồng bộ gỡ ví khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ gỡ quản trị voucher khỏi DB.'),
        error: (err) => console.error('Lỗi đồng bộ gỡ quản trị voucher khỏi DB:', err)
      });

      await this.loadVoucherOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Quản trị Voucher thất bại!', 'error');
    }
    this.isVoucherOwnerActionLoading.set(false);
  }
}
