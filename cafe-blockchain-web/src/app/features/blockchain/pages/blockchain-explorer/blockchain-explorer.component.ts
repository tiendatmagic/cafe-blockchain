import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JsonRpcProvider, Contract, Interface } from 'ethers';
import { CAFE_WEB3_POS_ABI } from '@core/services/contract-abi';
import { CAFE_WEB3_FINANCE_ABI } from '@core/services/finance-contract-abi';
import { CAFE_VOUCHER_NFT_ABI } from '@core/services/voucher-contract-abi';
import { CAFE_MENU_REGISTRY_ABI } from '@core/services/menu-registry-contract-abi';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { environment } from '@environments/environment';

import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-blockchain-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ShortAddressPipe,
    ThemeToggleComponent,
    CustomSelectComponent,
    PaginationComponent,
    IconComponent,
    TabGroupComponent,
    CardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './blockchain-explorer.component.html',
})
export class BlockchainExplorerComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);

  public get isDarkMode() {
    return this.stateService.isDarkMode;
  }

  // Cấu hình kết nối hiện tại
  public readonly storeName = signal<string>('Cafe Web3 POS');
  public readonly rpcUrl = signal<string>('');
  public readonly posContractAddress = signal<string>('');
  public readonly financeContractAddress = signal<string>('');
  public readonly voucherContractAddress = signal<string>('');
  public readonly menuRegistryContractAddress = signal<string>('');
  public readonly explorerUrl = signal<string>('');
  public readonly chainId = signal<string>('42161');

  // Trạng thái kết nối
  public readonly connectionStatus = signal<'api' | 'offline_fallback' | 'custom' | 'loading'>(
    'loading',
  );

  // Cấu hình tùy chỉnh (form)
  public customRpcUrl = '';
  public customPosAddress = '';
  public customFinanceAddress = '';
  public customVoucherAddress = '';
  public customMenuRegistryAddress = '';
  public customExplorerUrl = '';
  public customChainId = '';

  // Trạng thái hiển thị menu cài đặt
  public readonly isSettingsOpen = signal<boolean>(false);

  // Dữ liệu Tìm kiếm
  public searchQuery = '';
  public searchType: 'order' | 'transaction' | 'voucher' = 'order';
  public readonly isSearching = signal<boolean>(false);
  public readonly searchResult = signal<any | null>(null);
  public readonly searchError = signal<string>('');

  // Quản lý Tab & Phân trang luồng dữ liệu onchain
  public readonly activeTab = signal<'order' | 'transaction' | 'voucher' | 'menu'>('order');
  public readonly limit = 10;

  public readonly feedTabOptions = computed<TabOption[]>(() => [
    { value: 'order', label: `Hóa đơn (${this.orderTotal()})` },
    { value: 'transaction', label: `Thu chi (${this.transactionTotal()})` },
    { value: 'voucher', label: `Voucher NFT (${this.voucherTotal()})` },
    { value: 'menu', label: `Thực đơn (${this.menuTotal()})` },
  ]);

  public readonly orderPage = signal<number>(1);
  public readonly orderTotal = signal<number>(0);

  public readonly transactionPage = signal<number>(1);
  public readonly transactionTotal = signal<number>(0);

  public readonly voucherPage = signal<number>(1);
  public readonly voucherTotal = signal<number>(0);

  // Getters hỗ trợ phân trang
  public get totalOrderPages(): number {
    return Math.ceil(this.orderTotal() / this.limit) || 1;
  }

  public get totalTransactionPages(): number {
    return Math.ceil(this.transactionTotal() / this.limit) || 1;
  }

  public get totalVoucherPages(): number {
    return Math.ceil(this.voucherTotal() / this.limit) || 1;
  }

  public get totalMenuPages(): number {
    return Math.ceil(this.menuTotal() / this.limit) || 1;
  }

  // Danh sách dữ liệu mới nhất hiển thị trên tabs
  public readonly latestOrders = signal<any[]>([]);
  public readonly latestTransactions = signal<any[]>([]);
  public readonly latestVouchers = signal<any[]>([]);
  public readonly menuProducts = signal<any[]>([]);
  public readonly menuLastUpdated = signal<number>(0);
  public readonly menuPage = signal<number>(1);
  public readonly menuTotal = signal<number>(0);
  public readonly menuHistory = signal<any[]>([]);
  public readonly isLatestDataLoading = signal<boolean>(false);
  public readonly localProducts = signal<any[]>([]);

  // Các biến phục vụ phân trang danh sách món ăn ở cột trái (chi tiết)
  public readonly detailProductPage = signal<number>(1);
  public readonly detailProductLimit = 10;
  public readonly detailProductTotal = signal<number>(0);
  public readonly detailProducts = signal<any[]>([]);
  private allHistoryProducts: any[] = [];

  ngOnInit() {
    this.initConfiguration();
    this.loadLocalProducts();
  }

  /**
   * Tải danh sách sản phẩm cục bộ từ API để làm nguồn hình ảnh fallback
   */
  public loadLocalProducts() {
    this.apiService.getProducts({ limit: 1000 }).subscribe({
      next: (res) => {
        const list = res.data || res || [];
        this.localProducts.set(list);
      },
      error: (err) => {
        console.warn('Không thể tải sản phẩm từ local API phục vụ fallback hình ảnh:', err);
      },
    });
  }

  /**
   * Khởi tạo cấu hình (Thử từ localStorage -> Cấu hình Store đang đăng nhập -> Cấu hình môi trường mặc định)
   */
  public initConfiguration() {
    const cachedConfig = localStorage.getItem('cafe_blockchain_explorer_config');
    if (cachedConfig) {
      try {
        const config = JSON.parse(cachedConfig);
        this.rpcUrl.set(config.rpcUrl);
        this.posContractAddress.set(config.posContractAddress);
        this.financeContractAddress.set(config.financeContractAddress);
        this.voucherContractAddress.set(config.voucherContractAddress);
        this.menuRegistryContractAddress.set(config.menuRegistryContractAddress || '');
        this.explorerUrl.set(config.explorerUrl);
        this.chainId.set(config.chainId);
        this.storeName.set(config.storeName || 'Cấu hình tùy chỉnh');
        this.connectionStatus.set('custom');

        this.syncToCustomFields();
        this.loadDataForActiveTab();
        return;
      } catch (e) {
        console.error('Lỗi đọc cấu hình cache, thử tải tự động:', e);
      }
    }

    this.loadFromApi();
  }

  /**
   * Tải cấu hình tự động (từ Store nếu đã đăng nhập hoặc dùng fallback mặc định)
   */
  public loadFromApi() {
    const storeSettings = this.stateService.settings();
    if (this.stateService.isAuthLoggedIn() && storeSettings) {
      this.rpcUrl.set(storeSettings.rpc_url || environment.defaultRpcUrl || 'https://arb1.arbitrum.io/rpc');
      this.posContractAddress.set(storeSettings.contract_address || '');
      this.financeContractAddress.set(storeSettings.finance_contract_address || '');
      this.voucherContractAddress.set(storeSettings.voucher_contract_address || '');
      this.menuRegistryContractAddress.set(storeSettings.menu_registry_contract_address || '');
      this.explorerUrl.set(storeSettings.explorer_url || environment.defaultExplorerUrl || 'https://arbiscan.io');
      this.chainId.set(storeSettings.chain_id || environment.defaultChainId || '42161');
      this.storeName.set(storeSettings.store_name || 'Cafe Web3 POS');
      this.connectionStatus.set('api');

      this.syncToCustomFields();
      this.loadDataForActiveTab();
    } else {
      this.useOfflineFallback();
    }
  }

  /**
   * Kích hoạt chế độ mặc định hệ thống (Offline Fallback)
   */
  public useOfflineFallback() {
    this.rpcUrl.set(environment.defaultRpcUrl || 'https://arb1.arbitrum.io/rpc');
    this.posContractAddress.set('');
    this.financeContractAddress.set('');
    this.voucherContractAddress.set('');
    this.menuRegistryContractAddress.set('');
    this.explorerUrl.set(environment.defaultExplorerUrl || 'https://arbiscan.io');
    this.chainId.set(environment.defaultChainId || '42161');
    this.storeName.set('Mạng Arbitrum (Mặc định)');
    this.connectionStatus.set('offline_fallback');

    this.syncToCustomFields();
    this.loadDataForActiveTab();
  }

  /**
   * Đồng bộ các biến signal sang các trường form custom
   */
  private syncToCustomFields() {
    this.customRpcUrl = this.rpcUrl();
    this.customPosAddress = this.posContractAddress();
    this.customFinanceAddress = this.financeContractAddress();
    this.customVoucherAddress = this.voucherContractAddress();
    this.customMenuRegistryAddress = this.menuRegistryContractAddress();
    this.customExplorerUrl = this.explorerUrl();
    this.customChainId = this.chainId();
  }

  /**
   * Lưu cấu hình chỉnh sửa thủ công
   */
  public saveCustomSettings() {
    if (!this.customRpcUrl || !this.customPosAddress || !this.customFinanceAddress) {
      alert('Vui lòng điền đầy đủ thông tin RPC và Smart Contract POS & Tài chính!');
      return;
    }

    const config = {
      rpcUrl: this.customRpcUrl.trim(),
      posContractAddress: this.customPosAddress.trim(),
      financeContractAddress: this.customFinanceAddress.trim(),
      voucherContractAddress: this.customVoucherAddress.trim(),
      menuRegistryContractAddress: this.customMenuRegistryAddress.trim(),
      explorerUrl: this.customExplorerUrl.trim(),
      chainId: this.customChainId.trim(),
      storeName: 'Cấu hình tùy chỉnh',
    };

    localStorage.setItem('cafe_blockchain_explorer_config', JSON.stringify(config));

    this.rpcUrl.set(config.rpcUrl);
    this.posContractAddress.set(config.posContractAddress);
    this.financeContractAddress.set(config.financeContractAddress);
    this.voucherContractAddress.set(config.voucherContractAddress);
    this.menuRegistryContractAddress.set(config.menuRegistryContractAddress);
    this.explorerUrl.set(config.explorerUrl);
    this.chainId.set(config.chainId);
    this.storeName.set(config.storeName);
    this.connectionStatus.set('custom');
    this.isSettingsOpen.set(false);

    // Reset trang về 1 khi đổi mạng/contract
    this.orderPage.set(1);
    this.transactionPage.set(1);
    this.voucherPage.set(1);

    // Xóa dữ liệu cũ của cả 4 tab để kích hoạt tải lại theo mạng mới
    this.latestOrders.set([]);
    this.latestTransactions.set([]);
    this.latestVouchers.set([]);
    this.menuProducts.set([]);

    this.loadDataForActiveTab();
  }

  /**
   * Xóa cấu hình tùy chỉnh để quay lại cấu hình tự động
   */
  public resetToAuto() {
    localStorage.removeItem('cafe_blockchain_explorer_config');

    // Reset trang về 1 khi đổi mạng/contract
    this.orderPage.set(1);
    this.transactionPage.set(1);
    this.voucherPage.set(1);

    // Xóa dữ liệu cũ của cả 4 tab
    this.latestOrders.set([]);
    this.latestTransactions.set([]);
    this.latestVouchers.set([]);
    this.menuProducts.set([]);

    this.loadFromApi();
  }

  /**
   * Tự động nhận diện loại tìm kiếm khi gõ mã
   */
  public onSearchQueryChange() {
    const query = this.searchQuery.trim().toUpperCase();
    if (query.startsWith('HD-')) {
      this.searchType = 'order';
    } else if (query.startsWith('TC-') || query.startsWith('PC-')) {
      this.searchType = 'transaction';
    } else if (query.startsWith('0X') && query.length === 42) {
      this.searchType = 'voucher';
    } else if (/^\d+$/.test(query)) {
      this.searchType = 'voucher';
    }
  }

  /**
   * Thực hiện tra cứu onchain trực tiếp qua RPC
   */
  public async searchOnChain() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.searchError.set('Vui lòng nhập thông tin cần tra cứu.');
      this.searchResult.set(null);
      return;
    }

    this.isSearching.set(true);
    this.searchError.set('');
    this.searchResult.set(null);

    try {
      const provider = new JsonRpcProvider(this.rpcUrl());

      if (this.searchType === 'order') {
        const contract = new Contract(this.posContractAddress(), CAFE_WEB3_POS_ABI, provider);
        const orderData = await contract['getOrderByCode'](query);

        if (!orderData || orderData.orderCode !== query) {
          this.searchError.set(`Không tìm thấy dữ liệu hóa đơn "${query}" trên blockchain.`);
        } else {
          this.searchResult.set({
            type: 'order',
            orderId: orderData.orderId.toString(),
            orderCode: orderData.orderCode,
            tableNumber: orderData.tableNumber,
            totalAmount: Number(orderData.totalAmount),
            paymentMethod: orderData.paymentMethod,
            itemsSummary: orderData.itemsSummary,
            timestamp: Number(orderData.timestamp) * 1000,
            recordedBy: orderData.recordedBy,
          });
        }
      } else if (this.searchType === 'transaction') {
        const contract = new Contract(
          this.financeContractAddress(),
          CAFE_WEB3_FINANCE_ABI,
          provider,
        );
        const txData = await contract['getTransactionByCode'](query);

        if (!txData || txData.transactionCode !== query) {
          this.searchError.set(`Không tìm thấy dữ liệu phiếu thu/chi "${query}" trên blockchain.`);
        } else {
          this.searchResult.set({
            type: 'transaction',
            txId: txData.txId.toString(),
            transactionCode: txData.transactionCode,
            txType: txData.txType === 1 ? 'thu' : 'chi',
            amount: Number(txData.amount),
            category: txData.category,
            description: txData.description,
            timestamp: Number(txData.timestamp) * 1000,
            recordedBy: txData.recordedBy,
          });
        }
      } else if (this.searchType === 'voucher') {
        const contract = new Contract(
          this.voucherContractAddress(),
          CAFE_VOUCHER_NFT_ABI,
          provider,
        );

        if (query.startsWith('0x') && query.length === 42) {
          // Tra cứu ví sở hữu
          const tokenIds = await contract['getTokensOfOwner'](query);
          const vouchersList: any[] = [];

          for (let i = 0; i < tokenIds.length; i++) {
            const id = Number(tokenIds[i]);
            const info = await contract['vouchers'](id);
            vouchersList.push({
              tokenId: id,
              discountAmount: Number(info.discountAmount),
              minOrderAmount: Number(info.minOrderAmount),
              isUsed: info.isUsed,
            });
          }

          this.searchResult.set({
            type: 'voucher_owner',
            address: query,
            vouchers: vouchersList,
          });
        } else if (/^\d+$/.test(query)) {
          // Tra cứu ID NFT
          const tokenId = Number(query);
          const info = await contract['vouchers'](tokenId);

          if (Number(info.discountAmount) === 0) {
            this.searchError.set(`Voucher NFT ID ${tokenId} chưa được mint hoặc không tồn tại.`);
            this.isSearching.set(false);
            return;
          }

          let owner = '0x0000000000000000000000000000000000000000';
          if (!info.isUsed) {
            try {
              owner = await contract['ownerOf'](tokenId);
            } catch (e) {
              console.warn(`Không tìm thấy owner cho voucher active ID ${tokenId}:`, e);
            }
          }

          let tokenUri = '';
          try {
            tokenUri = await contract['tokenURI'](tokenId);
            if (tokenUri) {
              const match = tokenUri.match(/\/vouchers\/metadata\/[A-Za-z0-9\-]+/);
              if (match) {
                tokenUri = `${environment.apiBaseUrl}${match[0]}`;
              }
            }
          } catch (e) {}

          this.searchResult.set({
            type: 'voucher_detail',
            tokenId: tokenId,
            owner: owner,
            discountAmount: Number(info.discountAmount),
            minOrderAmount: Number(info.minOrderAmount),
            isUsed: info.isUsed,
            tokenUri: tokenUri,
          });
        } else {
          this.searchError.set(
            'Vui lòng nhập địa chỉ ví hợp lệ (0x...) hoặc ID NFT Voucher (số nguyên).',
          );
        }
      }
    } catch (e: any) {
      console.error('Lỗi khi tra cứu onchain:', e);
      this.searchError.set(
        `Lỗi truy vấn RPC Node: ${e.message || 'Không thể kết nối đến RPC node. Hãy kiểm tra cài đặt mạng!'}`,
      );
    } finally {
      this.isSearching.set(false);
    }
  }

  /**
   * Chuyển tab hiển thị dữ liệu onchain
   */
  public selectTab(tab: 'order' | 'transaction' | 'voucher' | 'menu') {
    // Nếu bấm trùng tab đang active thì không làm gì cả
    if (this.activeTab() === tab) {
      return;
    }

    this.activeTab.set(tab);
    if (tab === 'menu') {
      this.menuPage.set(1);
    }

    // Kiểm tra xem dữ liệu của tab được chọn đã có sẵn chưa
    let hasData = false;
    if (tab === 'order' && this.latestOrders().length > 0) {
      hasData = true;
    } else if (tab === 'transaction' && this.latestTransactions().length > 0) {
      hasData = true;
    } else if (tab === 'voucher' && this.latestVouchers().length > 0) {
      hasData = true;
    } else if (tab === 'menu' && this.menuHistory().length > 0) {
      hasData = true;
    }

    // Chỉ tải dữ liệu onchain nếu tab đó chưa có dữ liệu
    if (!hasData) {
      this.loadDataForActiveTab();
    }
  }

  public handleFeedPageChange(page: number) {
    const tab = this.activeTab();
    if (tab === 'order') {
      this.orderPage.set(page);
    } else if (tab === 'transaction') {
      this.transactionPage.set(page);
    } else if (tab === 'voucher') {
      this.voucherPage.set(page);
    } else if (tab === 'menu') {
      this.menuPage.set(page);
    }
    this.loadDataForActiveTab();
  }

  /**
   * Tải dữ liệu tương ứng cho Tab đang chọn
   */
  public async loadDataForActiveTab() {
    this.isLatestDataLoading.set(true);
    const tab = this.activeTab();

    try {
      const provider = new JsonRpcProvider(this.rpcUrl());

      if (tab === 'order') {
        this.latestOrders.set([]);
        try {
          const posContract = new Contract(this.posContractAddress(), CAFE_WEB3_POS_ABI, provider);
          const res = await posContract['getOrdersPaginated'](this.orderPage(), this.limit);
          if (res && res[0]) {
            const orders = res[0].map((o: any) => ({
              orderId: o.orderId.toString(),
              orderCode: o.orderCode,
              tableNumber: o.tableNumber,
              totalAmount: Number(o.totalAmount),
              paymentMethod: o.paymentMethod,
              itemsSummary: o.itemsSummary,
              timestamp: Number(o.timestamp) * 1000,
              recordedBy: o.recordedBy,
            }));
            this.latestOrders.set(orders);
            this.orderTotal.set(Number(res[1]));
          }
        } catch (err) {
          console.warn('Không thể load danh sách orders từ Smart Contract POS:', err);
        }
      } else if (tab === 'transaction') {
        this.latestTransactions.set([]);
        try {
          const financeContract = new Contract(
            this.financeContractAddress(),
            CAFE_WEB3_FINANCE_ABI,
            provider,
          );
          const res = await financeContract['getTransactionsPaginated'](
            this.transactionPage(),
            this.limit,
          );
          if (res && res[0]) {
            const transactions = res[0].map((t: any) => ({
              txId: t.txId.toString(),
              transactionCode: t.transactionCode,
              txType: t.txType === 1 ? 'thu' : 'chi',
              amount: Number(t.amount),
              category: t.category,
              description: t.description,
              timestamp: Number(t.timestamp) * 1000,
              recordedBy: t.recordedBy,
            }));
            this.latestTransactions.set(transactions);
            this.transactionTotal.set(Number(res[1]));
          }
        } catch (err) {
          console.warn('Không thể load danh sách transactions từ Smart Contract Tài chính:', err);
        }
      } else if (tab === 'voucher') {
        this.latestVouchers.set([]);
        try {
          const voucherContract = new Contract(
            this.voucherContractAddress(),
            CAFE_VOUCHER_NFT_ABI,
            provider,
          );
          const maxId = await this.getMaxTokenId(voucherContract);
          this.voucherTotal.set(maxId);

          if (maxId > 0) {
            const currentPage = this.voucherPage();
            const startId = maxId - (currentPage - 1) * this.limit;
            const endId = Math.max(1, startId - this.limit + 1);

            const promises: Promise<any>[] = [];
            for (let id = startId; id >= endId; id--) {
              promises.push(
                (async () => {
                  try {
                    const info = await voucherContract['vouchers'](id);
                    if (Number(info.discountAmount) > 0) {
                      let owner = '0x0000000000000000000000000000000000000000';
                      if (!info.isUsed) {
                        try {
                          owner = await voucherContract['ownerOf'](id);
                        } catch (e) {
                          console.warn(`Lỗi lấy owner cho voucher ID ${id}:`, e);
                        }
                      }
                      return {
                        tokenId: id,
                        discountAmount: Number(info.discountAmount),
                        minOrderAmount: Number(info.minOrderAmount),
                        isUsed: info.isUsed,
                        owner: owner,
                      };
                    }
                  } catch (err) {
                    console.warn(`Lỗi load voucher ID ${id}:`, err);
                  }
                  return null;
                })(),
              );
            }

            const results = await Promise.all(promises);
            const vouchersList = results.filter((v) => v !== null);
            this.latestVouchers.set(vouchersList);
          }
        } catch (err) {
          console.warn('Không thể load danh sách vouchers từ Smart Contract Voucher:', err);
        }
      } else if (tab === 'menu') {
        this.menuHistory.set([]);
        try {
          const menuRegistryContract = new Contract(
            this.menuRegistryContractAddress(),
            CAFE_MENU_REGISTRY_ABI,
            provider,
          );

          try {
            const lastUpdatedRaw = await menuRegistryContract['lastUpdated']();
            this.menuLastUpdated.set(Number(lastUpdatedRaw) * 1000);
          } catch (e) {
            console.warn('Không lấy được lastUpdated của menu registry:', e);
          }

          // 1. Thử dùng getMilestonesPaginated (phân trang onchain từ contract mới)
          try {
            const totalCount = await menuRegistryContract['getMilestonesCount']();
            const total = Number(totalCount);
            this.menuTotal.set(total);

            if (total > 0) {
              const currentPage = this.menuPage();
              const offset = (currentPage - 1) * this.limit;

              const res = await menuRegistryContract['getMilestonesPaginated'](offset, this.limit);
              const milestonesList = res[0];
              const filter = menuRegistryContract.filters['MenuUpdated']();

              // Truy vấn song song txHash cho các milestone của trang hiện tại
              const paginatedHistory = await Promise.all(
                milestonesList.map(async (m: any) => {
                  const blockNum = Number(m.blockNumber);
                  let txHash = '';
                  try {
                    // Chỉ quét đúng 1 block cụ thể chứa milestone -> Cực kỳ nhanh và an toàn
                    const events = await menuRegistryContract.queryFilter(
                      filter,
                      blockNum,
                      blockNum,
                    );
                    txHash = events.length > 0 ? events[0].transactionHash : '';
                  } catch (err) {
                    console.warn(`Lỗi lấy txHash cho milestone tại block ${blockNum}:`, err);
                  }
                  return {
                    txHash: txHash,
                    blockNumber: blockNum,
                    updatedBy: m.updatedBy,
                    timestamp: Number(m.timestamp) * 1000,
                    productCount: Number(m.productCount),
                  };
                }),
              );

              this.menuHistory.set(paginatedHistory);
            }
          } catch (contractErr) {
            // 2. Fallback: Nếu contract chưa nâng cấp (không có hàm milestones) -> dùng cách quét event log cũ
            console.warn(
              '[MenuRegistry] getMilestonesPaginated không khả dụng, fallback sang event query logs:',
              contractErr,
            );

            const filter = menuRegistryContract.filters['MenuUpdated']();
            const latestBlock = await provider.getBlockNumber();

            let allEvents: any[] = [];
            const SAFE_RANGE = 200_000;
            const CHUNK_SIZE = 5_000;
            const fromBlockFull = Math.max(0, latestBlock - SAFE_RANGE);

            try {
              allEvents = await menuRegistryContract.queryFilter(
                filter,
                fromBlockFull,
                latestBlock,
              );
            } catch (rangeErr: any) {
              const errMsg = (rangeErr?.message || '').toLowerCase();
              const isRangeError =
                errMsg.includes('block range') ||
                errMsg.includes('too large') ||
                errMsg.includes('10000') ||
                errMsg.includes('exceed') ||
                errMsg.includes('limit');

              if (isRangeError) {
                console.warn(
                  '[MenuRegistry] RPC giới hạn block range, chuyển sang chunked query...',
                );
                allEvents = [];
                for (let toBlock = latestBlock; toBlock >= fromBlockFull; toBlock -= CHUNK_SIZE) {
                  const fromBlock = Math.max(fromBlockFull, toBlock - CHUNK_SIZE + 1);
                  try {
                    const chunk = await menuRegistryContract.queryFilter(
                      filter,
                      fromBlock,
                      toBlock,
                    );
                    allEvents.push(...chunk);
                  } catch (chunkErr) {
                    console.warn(`Bỏ qua block range ${fromBlock}-${toBlock}:`, chunkErr);
                  }
                }
              } else {
                throw rangeErr;
              }
            }

            const formattedHistory = allEvents
              .map((e: any) => {
                const args = e.args;
                return {
                  txHash: e.transactionHash,
                  blockNumber: e.blockNumber,
                  updatedBy: args ? args[0] : '',
                  timestamp: args ? Number(args[1]) * 1000 : 0,
                  productCount: args ? Number(args[2]) : 0,
                };
              })
              .sort((a, b) => b.timestamp - a.timestamp);

            this.menuTotal.set(formattedHistory.length);

            const currentPage = this.menuPage();
            const start = (currentPage - 1) * this.limit;
            const paginatedHistory = formattedHistory.slice(start, start + this.limit);

            this.menuHistory.set(paginatedHistory);
          }
        } catch (err) {
          console.warn('Không thể load lịch sử thực đơn từ Smart Contract Menu Registry:', err);
        }
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu từ chuỗi:', e);
    } finally {
      this.isLatestDataLoading.set(false);
    }
  }

  /**
   * Dò tìm Token ID Voucher lớn nhất bằng tìm kiếm nhị phân
   */
  private async getMaxTokenId(contract: Contract): Promise<number> {
    let low = 1;
    let high = 500; // Khoảng ước lượng ban đầu
    let maxId = 0;

    // Quét mở rộng khoảng nếu vượt quá ước lượng
    while (true) {
      try {
        const info = await contract['vouchers'](high);
        if (Number(info.discountAmount) > 0) {
          low = high;
          high = high * 2;
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }

    // Tìm kiếm nhị phân chính xác Token ID lớn nhất có discountAmount > 0
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      try {
        const info = await contract['vouchers'](mid);
        if (Number(info.discountAmount) > 0) {
          maxId = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      } catch (e) {
        high = mid - 1;
      }
    }
    return maxId;
  }

  /**
   * Chọn nhanh một hóa đơn/giao dịch/voucher từ bảng feed để tra cứu chi tiết
   */
  public selectItem(code: string, type: 'order' | 'transaction' | 'voucher') {
    this.searchQuery = code;
    this.searchType = type;
    this.searchOnChain();
  }

  public formatUuid(uint256Val: any): string {
    if (!uint256Val) return '';
    try {
      const bigVal = BigInt(uint256Val);
      if (bigVal < 1000000n) return bigVal.toString();
      let hex = bigVal.toString(16).toLowerCase();
      hex = hex.padStart(32, '0');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch {
      return uint256Val.toString();
    }
  }

  public formatUuidShort(uint256Val: any): string {
    const uuid = this.formatUuid(uint256Val);
    if (uuid.length < 15) return uuid;
    return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 4)}`;
  }

  public getTxExplorerLink(txHash: string | null | undefined): string {
    if (!txHash) return '#';
    return `${this.explorerUrl()}/tx/${txHash}`;
  }

  /**
   * Chọn nhanh một món ăn từ tab thực đơn để xem chi tiết
   */
  public selectProductItem(prod: any) {
    const displayImage = prod.image || this.getProductImage(prod.image, prod.sku);
    this.searchResult.set({
      type: 'menu_detail',
      sku: prod.sku,
      name: prod.name,
      price: prod.price,
      image: displayImage,
      status: prod.status,
    });
    this.searchError.set('');
  }

  public getProductImage(imagePath: string, sku?: string): string {
    if (!imagePath || !imagePath.trim()) {
      if (sku) {
        const localProd = this.localProducts().find((p) => p.sku === sku);
        if (localProd && localProd.image) {
          return localProd.image;
        }
      }
      return 'not-found.webp';
    }
    return imagePath;
  }

  public handleImageError(event: any) {
    event.target.src = 'not-found.webp';
  }

  /**
   * Tính tổng số trang cho chi tiết món ăn ở cột trái
   */
  public get totalDetailProductPages(): number {
    return Math.ceil(this.detailProductTotal() / this.detailProductLimit) || 1;
  }

  /**
   * Cập nhật danh sách món ăn hiển thị ở cột trái dựa trên trang hiện tại
   */
  public async updateDetailProducts() {
    const result = this.searchResult();
    if (!result) return;

    const currentPage = this.detailProductPage();
    const start = (currentPage - 1) * this.detailProductLimit;

    if (result.type === 'menu_history_detail') {
      // Phân trang client-side dựa trên dữ liệu đã giải mã sẵn ở allHistoryProducts
      const paginated = this.allHistoryProducts.slice(start, start + this.detailProductLimit);
      this.detailProducts.set(paginated);
    } else if (result.type === 'menu_current_detail') {
      // Phân trang onchain gọi trực tiếp getProductsPaginated từ blockchain, có fallback sang getAllProducts
      this.isSearching.set(true);
      try {
        const provider = new JsonRpcProvider(this.rpcUrl());
        const menuRegistryContract = new Contract(
          this.menuRegistryContractAddress(),
          CAFE_MENU_REGISTRY_ABI,
          provider,
        );

        try {
          const res = await menuRegistryContract['getProductsPaginated'](
            start,
            this.detailProductLimit,
          );
          if (res && res[0]) {
            const products = res[0].map((p: any) => ({
              sku: p.sku,
              name: p.name,
              price: Number(p.price),
              image: p.image,
              status: p.status,
            }));
            this.detailProducts.set(products);
            this.detailProductTotal.set(Number(res[1]));
          }
        } catch (paginatedErr) {
          console.warn(
            '[MenuRegistry] getProductsPaginated không khả dụng, fallback sang getAllProducts():',
            paginatedErr,
          );
          const rawProducts = await menuRegistryContract['getAllProducts']();
          const allProducts = rawProducts.map((p: any) => ({
            sku: p.sku,
            name: p.name,
            price: Number(p.price),
            image: p.image,
            status: p.status,
          }));
          this.detailProductTotal.set(allProducts.length);
          const paginated = allProducts.slice(start, start + this.detailProductLimit);
          this.detailProducts.set(paginated);
        }
      } catch (err) {
        console.warn('Lỗi lấy thực đơn hiện tại onchain:', err);
        this.searchError.set('Không thể tải thực đơn hiện tại từ Blockchain.');
      } finally {
        this.isSearching.set(false);
      }
    }
  }

  /**
   * Xem thực đơn hiện tại trực tiếp từ Blockchain (cột trái) có phân trang onchain
   */
  public async viewCurrentMenuOnChain() {
    this.isSearching.set(true);
    this.searchError.set('');
    this.searchResult.set(null);
    this.detailProductPage.set(1);
    this.detailProductTotal.set(0);
    this.detailProducts.set([]);
    this.allHistoryProducts = [];

    try {
      const provider = new JsonRpcProvider(this.rpcUrl());
      const menuRegistryContract = new Contract(
        this.menuRegistryContractAddress(),
        CAFE_MENU_REGISTRY_ABI,
        provider,
      );
      const lastUpdatedRaw = await menuRegistryContract['lastUpdated']();

      this.searchResult.set({
        type: 'menu_current_detail',
        timestamp: Number(lastUpdatedRaw) * 1000,
      });

      await this.updateDetailProducts();
    } catch (err: any) {
      console.error('Lỗi khi xem thực đơn hiện tại:', err);
      this.searchError.set(err.message || 'Lỗi khi tải thực đơn hiện tại từ blockchain.');
    } finally {
      this.isSearching.set(false);
    }
  }

  /**
   * Chọn một mốc lịch sử sửa đổi thực đơn, giải mã transaction input data và hiển thị chi tiết ở cột trái
   */
  public async selectMenuHistory(item: any) {
    this.isSearching.set(true);
    this.searchError.set('');
    this.searchResult.set(null);
    this.detailProductPage.set(1);
    this.detailProductTotal.set(0);
    this.detailProducts.set([]);
    this.allHistoryProducts = [];

    try {
      const provider = new JsonRpcProvider(this.rpcUrl());
      const tx = await provider.getTransaction(item.txHash);
      if (!tx) {
        throw new Error('Không tìm thấy dữ liệu giao dịch trên blockchain.');
      }

      // Khởi tạo Interface và giải mã input data
      const contractInterface = new Interface(CAFE_MENU_REGISTRY_ABI);
      const parsedTx = contractInterface.parseTransaction({ data: tx.data });
      if (!parsedTx || !parsedTx.args || !parsedTx.args[0]) {
        throw new Error('Giao dịch không chứa dữ liệu thực đơn hợp lệ.');
      }

      // parsedTx.args[0] là danh sách Product struct
      const products = parsedTx.args[0].map((p: any) => ({
        sku: p.sku,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        status: p.status,
      }));

      this.allHistoryProducts = products;
      this.detailProductTotal.set(products.length);

      this.searchResult.set({
        type: 'menu_history_detail',
        timestamp: item.timestamp,
        updatedBy: item.updatedBy,
        txHash: item.txHash,
      });

      await this.updateDetailProducts();
    } catch (err: any) {
      console.error('Lỗi giải mã lịch sử thực đơn:', err);
      this.searchError.set(err.message || 'Lỗi khi giải mã thực đơn từ blockchain.');
    } finally {
      this.isSearching.set(false);
    }
  }
}
