import { Injectable, signal, computed, inject, Injector, effect, untracked } from '@angular/core';
import { BrowserProvider, Contract, JsonRpcProvider, parseEther, formatEther, parseUnits } from 'ethers';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { PosContractService } from './web3/pos-contract.service';
import { FinanceContractService } from './web3/finance-contract.service';
import { VoucherContractService } from './web3/voucher-contract.service';
import { CAFE_WEB3_POS_ABI } from './contract-abi';
import { getExplorerApiUrl, getBackupRpcUrls, getAvgBlockTime, POPULAR_CHAINS } from '../utils/blockchain.utils';

// Tích hợp Reown AppKit cho WalletConnect
import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createSIWEConfig } from '@reown/appkit-siwe';
import { arbitrum, bsc, base, bscTestnet, arbitrumSepolia } from '@reown/appkit/networks';
import { ApiController } from '@reown/appkit-controllers';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private readonly injector = inject(Injector);
  private get posContractService() { return this.injector.get(PosContractService); }
  private get financeContractService() { return this.injector.get(FinanceContractService); }
  private get voucherContractService() { return this.injector.get(VoucherContractService); }
  // Trạng thái kết nối ví
  public readonly walletConnected = signal<boolean>(false);
  public readonly currentAccount = signal<string>('');
  public readonly walletBalance = signal<string>('0.00');
  public readonly isOwnerContract = signal<boolean>(false);
  public readonly walletError = signal<string>('');
  public readonly chainId = signal<string>('');
  public readonly gasPriceGwei = signal<string>('0.0');
  public readonly networkStatus = signal<string>('Đang kiểm tra...');

  // Signals quản lý tốc độ giao dịch và phí Gas
  public readonly txSpeed = signal<'default' | 'fast' | 'custom'>(
    (typeof window !== 'undefined' ? localStorage.getItem('web3_tx_speed') as any : null) || 'default'
  );
  public readonly gasMultiplier = signal<number>(
    Number((typeof window !== 'undefined' ? localStorage.getItem('web3_gas_multiplier') : null) || '2')
  );

  // Sự kiện thay đổi tài khoản hoặc ngắt kết nối ví
  public readonly accountsChanged$ = new Subject<string>();

  // Cấu hình blockchain (sẽ được cập nhật từ database thông qua ApiService)
  public readonly contractAddress = signal<string>('');
  public readonly financeContractAddress = signal<string>('');
  public readonly voucherContractAddress = signal<string>('');
  public readonly menuRegistryContractAddress = signal<string>('');
  public readonly loyaltyTokenContractAddress = signal<string>('');
  public readonly voucherShopContractAddress = signal<string>('');
  public readonly voucherMarketplaceContractAddress = signal<string>('');
  public readonly rpcUrl = signal<string>(environment.defaultRpcUrl || 'https://arb1.arbitrum.io/rpc');
  public readonly explorerUrl = signal<string>(environment.defaultExplorerUrl || 'https://arbiscan.io');
  public readonly explorerApiKey = signal<string>('');
  public readonly configuredChainId = signal<string>(
    (typeof window !== 'undefined' ? localStorage.getItem('configured_chain_id') : null) ||
    environment.defaultChainId ||
    '42161'
  );

  public readonly POPULAR_CHAINS = POPULAR_CHAINS;

  // Mạng được hỗ trợ (cấu hình động RPC & Explorer từ POPULAR_CHAINS)
  public readonly supportedChains = [arbitrum, base, bsc, bscTestnet, arbitrumSepolia].map(chain => {
    const popular = POPULAR_CHAINS.find(c => Number(c.chainId) === Number(chain.id));
    if (popular) {
      return {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: { http: [popular.rpcUrl] }
        },
        blockExplorers: {
          ...chain.blockExplorers,
          default: { name: popular.name, url: popular.explorerUrl }
        }
      };
    }
    return chain;
  });

  // Địa chỉ ví rút gọn
  public readonly shortAddress = computed(() => {
    const addr = this.currentAccount();
    if (!addr || !addr.startsWith('0x') || addr.length < 42) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  });

  // Kiểm tra ví đang kết nối có sai chain so với cấu hình không
  public readonly isWrongChain = computed(() => {
    const connected = !!this.currentAccount();
    const contract = this.contractAddress();
    const activeChain = this.chainId();
    const configChain = this.configuredChainId();
    return connected && !!contract && contract.trim() !== '' && activeChain.toString().trim() !== configChain.toString().trim();
  });


  // Kiểm tra số dư ví thu ngân có ở mức báo động cạn gas hay không
  public readonly isGasLow = computed(() => {
    if (!this.walletConnected()) return false;
    const balance = parseFloat(this.walletBalance());
    const symbol = this.nativeTokenSymbol();
    if (symbol === 'MATIC' || symbol === 'POL') {
      return balance < 0.2;
    }
    return balance < 0.005;
  });

  /**
   * Lấy tên mạng EVM dựa vào chainId
   */
  public getNetworkNameByChainId(chainId: string | number): string {
    if (!chainId) return 'Sepolia Testnet';
    const id = chainId.toString().trim();
    switch (id) {
      case '1':
        return 'Ethereum Mainnet';
      case '11155111':
        return 'Sepolia Testnet';
      case '5':
        return 'Goerli Testnet';
      case '56':
        return 'BNB Smart Chain';
      case '97':
        return 'BSC Testnet';
      case '137':
        return 'Polygon PoS Mainnet';
      case '80001':
        return 'Polygon Mumbai';
      case '80002':
        return 'Polygon Amoy';
      case '42161':
        return 'Arbitrum One Mainnet';
      case '421614':
        return 'Arbitrum Sepolia';
      case '421613':
        return 'Arbitrum Goerli';
      case '10':
        return 'Optimism Mainnet';
      case '11155420':
        return 'Optimism Sepolia';
      case '8453':
        return 'Base Mainnet';
      case '84532':
        return 'Base Sepolia';
      case '43114':
        return 'Avalanche C-Chain';
      case '43113':
        return 'Avalanche Fuji';
      case '31337':
      case '1337':
        return 'Localhost EVM';
      default:
        return `EVM Chain (ID: ${id})`;
    }
  }

  /**
   * Lấy ký hiệu Native Token của mạng EVM dựa vào chainId
   */
  public getNativeTokenSymbolByChainId(chainId: string | number): string {
    if (!chainId) return 'ETH';
    const id = chainId.toString().trim();
    switch (id) {
      case '1':
      case '11155111':
      case '5':
      case '42161': // Arbitrum One
      case '10':    // Optimism
      case '8453':  // Base
        return 'ETH';
      case '56':
      case '97':
        return 'BNB';
      case '137':
      case '80001':
        return 'MATIC';
      case '80002':
        return 'POL';
      case '43114':
      case '43113':
        return 'AVAX';
      default:
        return 'ETH';
    }
  }

  // Tự động nhận diện ký hiệu Native Token của Chain EVM đang kết nối
  public readonly nativeTokenSymbol = computed(() => {
    const activeChainId = this.walletConnected() ? this.chainId() : this.configuredChainId();
    return this.getNativeTokenSymbolByChainId(activeChainId);
  });

  // Ký hiệu Native Token được cấu hình cho quán
  public readonly configuredNativeTokenSymbol = computed(() => {
    return this.getNativeTokenSymbolByChainId(this.configuredChainId());
  });

  // Tự động nhận diện tên Mạng EVM đang kết nối
  public readonly networkName = computed(() => {
    const activeChainId = this.walletConnected() ? this.chainId() : this.configuredChainId();
    return this.getNetworkNameByChainId(activeChainId);
  });

  // Tên mạng được cấu hình cho quán
  public readonly configuredNetworkName = computed(() => {
    return this.getNetworkNameByChainId(this.configuredChainId());
  });

  // Tự động nhận diện explorer link cho địa chỉ ví đang kết nối
  public readonly addressExplorerLink = computed(() => {
    const account = this.currentAccount();
    if (!account) return '#';
    const activeChainId = this.walletConnected() ? this.chainId() : this.configuredChainId();
    const chain = this.POPULAR_CHAINS.find(c => c.chainId === activeChainId.toString().trim());
    if (chain) {
      return `${chain.explorerUrl}/address/${account}`;
    }
    return `${this.explorerUrl()}/address/${account}`;
  });

  public getAddressExplorerLink(account: string | null | undefined, chainId: string | number | null | undefined): string {
    if (!account) return '#';
    if (chainId) {
      const idStr = chainId.toString().trim();
      const chain = this.POPULAR_CHAINS.find(c => c.chainId === idStr);
      if (chain) {
        return `${chain.explorerUrl}/address/${account}`;
      }
    }
    return `${this.explorerUrl()}/address/${account}`;
  }

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    if (!txHash) return '#';
    if (chainId) {
      const idStr = chainId.toString().trim();
      const chain = this.POPULAR_CHAINS.find(c => c.chainId === idStr);
      if (chain) {
        return `${chain.explorerUrl}/tx/${txHash}`;
      }
    }
    return `${this.explorerUrl()}/tx/${txHash}`;
  }

  private provider: BrowserProvider | null = null;
  private modal: any = null;
  private appKitAddress: string | null = null;
  private appKitIsConnected = false;
  private isAppKitInitializing = true;
  private isSwitchingNetwork = false;
  private lastEmittedAccount = '';

  constructor() {
    this.initAppKit();
    this.restoreSessionFromStorage();

    // Đồng bộ trạng thái ban đầu của ví đã kết nối để tránh phát ra sự kiện trùng lặp
    const savedAddress = this.currentAccount();
    this.lastEmittedAccount = savedAddress ? savedAddress.toLowerCase() : '';

    // Đánh dấu hoàn tất giai đoạn khởi tạo AppKit sau 2 giây để tránh race condition lúc F5
    setTimeout(() => {
      this.isAppKitInitializing = false;
    }, 2000);

    // Định kỳ 30 giây cập nhật tình trạng mạng lưới blockchain và phí Gas
    this.updateNetworkHealth();
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.updateNetworkHealth();
      }, 30000);
    }

    let previousChainId = this.configuredChainId();
    effect(() => {
      const currentChainId = this.configuredChainId();
      if (currentChainId !== previousChainId) {
        previousChainId = currentChainId;
      }
    });

    // Tự động lưu txSpeed vào localStorage khi thay đổi
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('web3_tx_speed', this.txSpeed());
      }
    });

    // Tự động lưu gasMultiplier vào localStorage khi thay đổi
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('web3_gas_multiplier', this.gasMultiplier().toString());
      }
    });
  }

  /**
   * Định kỳ kiểm tra sức khỏe mạng lưới và lấy Gas Price thực tế
   */
  public async updateNetworkHealth() {
    try {
      const rpc = this.rpcUrl();
      if (!rpc) {
        this.networkStatus.set('Chưa cấu hình RPC');
        return;
      }

      // Thay vì dùng JsonRpcProvider của Ethers (gây ra nhiều request handshake ngầm),
      // ta gửi duy nhất 1 HTTP request POST JSON-RPC lấy gas price để test kết nối RPC.
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1
        })
      });
      const resData = await response.json();

      if (resData && resData.result) {
        const gasPriceHex = resData.result;
        const gasPriceWei = BigInt(gasPriceHex);
        const gwei = Number(gasPriceWei) / 1e9;
        this.gasPriceGwei.set(gwei.toFixed(1));
        this.networkStatus.set('Hoạt động');
      } else {
        this.networkStatus.set('Hoạt động');
        this.gasPriceGwei.set('0.0');
      }
    } catch (err) {
      console.warn('[Web3] Lỗi kết nối RPC check network health:', err);
      this.networkStatus.set('Mất kết nối');
      this.gasPriceGwei.set('—');
    }
  }


  /**
   * Lấy đối tượng mạng của Reown AppKit tương ứng với chainId cấu hình
   */
  private getAppKitNetworkByChainId(chainId: string | number): any {
    const id = chainId.toString().trim();
    switch (id) {
      case '56': return bsc;
      case '97': return bscTestnet;
      case '42161': return arbitrum;
      case '421614': return arbitrumSepolia;
      case '8453': return base;
      default: return arbitrum;
    }
  }

  /**
   * Khởi tạo Reown AppKit modal với cấu hình được yêu cầu
   */
  private async initAppKit() {
    if (typeof window === 'undefined') return;

    try {
      const projectId = environment.walletConnectProjectId;
      if (!projectId) {
        console.warn('[Web3] walletConnectProjectId is missing in environment configuration.');
        return;
      }

      // Nếu chưa đăng nhập, tự động dọn rác session/proposal treo cũ trong storage
      if (!this.walletConnected()) {
        await this.clearWalletConnectStorage();
      }

      try {
        (ApiController as any).fetchProjectConfig = async () => null;
      } catch (e) {
        // ignore
      }

      const ethersAdapter = new EthersAdapter();
      const defaultNet = arbitrum;

      let initialTheme: 'light' | 'dark' = 'light';
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          initialTheme = 'dark';
        } else if (savedTheme === 'auto') {
          const hour = new Date().getHours();
          if (hour >= 18 || hour < 6) {
            initialTheme = 'dark';
          }
        }
      }

      this.modal = createAppKit({
        adapters: [ethersAdapter],
        networks: this.supportedChains as any,
        defaultNetwork: defaultNet,
        allowUnsupportedChain: false,
        themeMode: initialTheme,
        metadata: {
          name: 'Cafe Blockchain',
          description: 'Cafe Blockchain POS & Storefront DApp',
          url: window.location.origin,
          icons: [window.location.origin + '/assets/logo.png']
        },
        projectId,
        features: {
          email: false,
          socials: false,
          analytics: false,
          reownAuthentication: false
        },
        enableCoinbase: false
      } as any);

      // Lắng nghe thay đổi tài khoản
      this.modal.subscribeAccount(async (accountState: any) => {
        const address = accountState.address;
        const isConnected = accountState.isConnected;
        this.appKitAddress = address || null;
        this.appKitIsConnected = isConnected || false;

        if (isConnected && address) {
          const oldAccount = this.currentAccount();
          this.currentAccount.set(address);

          if (this.hasValidAuthToken(address)) {
            this.walletConnected.set(true);
          } else {
            this.walletConnected.set(false);
          }

          await this.updateBalanceAndStatus(address);

          // Tự động chuyển ví sang mạng mong muốn sau khi kết nối thành công để ví không bị lỗi treo unknown network lúc chưa connect
          const currentChainId = this.chainId();
          const targetChainId = this.configuredChainId();
          if (currentChainId && currentChainId.toString() !== targetChainId.toString()) {
            setTimeout(async () => {
              await this.ensureCorrectNetwork(targetChainId);
            }, 500);
          }

          if (oldAccount && oldAccount.toLowerCase() !== address.toLowerCase()) {
            this.emitAccountChange(address);
          }
        } else {
          // Thực sự ngắt kết nối khi không còn address
          if (!this.isAppKitInitializing && !this.isSwitchingNetwork && this.currentAccount()) {
            this.resetWalletState(true);
            this.emitAccountChange('');
          } else {
            const savedAddress = localStorage.getItem('auth_address');
            if (!savedAddress || !this.hasValidAuthToken(savedAddress)) {
              this.resetWalletState(false);
            }
          }
        }
      });

      this.modal.subscribeNetwork((networkState: any) => {
        if (networkState.chainId) {
          const newChainId = Number(networkState.chainId);
          this.chainId.set(newChainId.toString());

          // Tự động đóng modal nếu chuyển mạng thành công
          const supportedChainIds = this.POPULAR_CHAINS.map(c => c.chainId.toString().trim());
          if (supportedChainIds.includes(newChainId.toString().trim())) {
            try {
              this.modal.close();
            } catch (e) {}
          }

          if (this.currentAccount()) {
            this.updateBalanceAndStatus(this.currentAccount());
          }
        }
      });

      this.modal.subscribeEvents(async (event: any) => {
        const eventName = event.data?.event;
        const errorMsg = event.data?.properties?.message || event.data?.error || '';
        const isConnectionError = eventName === 'CONNECT_ERROR' || errorMsg.toString().toLowerCase().includes('declined') || errorMsg.toString().toLowerCase().includes('active');
        
        if (isConnectionError) {
          console.warn('[Web3] Phát hiện lỗi kết nối hoặc treo session từ AppKit, tự động giải phóng...');
          try {
            await this.modal.disconnect();
            await this.clearWalletConnectStorage();
          } catch (e) {}
        }
      });

    } catch (error) {
      console.error('[Web3] Error initializing Reown AppKit:', error);
    }
  }

  /**
   * Cập nhật theme mode cho WalletConnect modal
   */
  public updateAppKitTheme(theme: 'light' | 'dark') {
    try {
      if (this.modal) {
        this.modal.setThemeMode(theme);
      }
    } catch (e) {
      console.warn('[Web3] Lỗi cập nhật theme cho AppKit:', e);
    }
  }

  /**
   * Lấy BrowserProvider tương ứng từ ví đã kết nối (ưu tiên AppKit provider)
   */
  public getBrowserProvider(): BrowserProvider | null {
    if (typeof window === 'undefined') return null;

    // Nếu có AppKit modal và đã kết nối, lấy provider từ AppKit
    if (this.modal && this.appKitIsConnected) {
      const walletProvider = this.modal.getWalletProvider();
      if (walletProvider) {
        return new BrowserProvider(walletProvider);
      }
    }

    // Fallback về window.ethereum
    if ((window as any).ethereum) {
      return new BrowserProvider((window as any).ethereum);
    }

    return null;
  }

  /**
   * Cập nhật cấu hình Blockchain từ API
   */
  public updateConfig(config: { contract_address?: string, finance_contract_address?: string, voucher_contract_address?: string, menu_registry_contract_address?: string, loyalty_token_contract_address?: string, voucher_shop_contract_address?: string, voucher_marketplace_contract_address?: string, rpc_url?: string, explorer_url?: string, chain_id?: string, explorer_api_key?: string }) {
    this.contractAddress.set(config.contract_address || '');
    if (config.finance_contract_address !== undefined) this.financeContractAddress.set(config.finance_contract_address || '');
    if (config.voucher_contract_address !== undefined) this.voucherContractAddress.set(config.voucher_contract_address || '');
    if (config.menu_registry_contract_address !== undefined) this.menuRegistryContractAddress.set(config.menu_registry_contract_address || '');
    if (config.loyalty_token_contract_address !== undefined) this.loyaltyTokenContractAddress.set(config.loyalty_token_contract_address || '');
    if (config.voucher_shop_contract_address !== undefined) this.voucherShopContractAddress.set(config.voucher_shop_contract_address || '');
    if (config.voucher_marketplace_contract_address !== undefined) this.voucherMarketplaceContractAddress.set(config.voucher_marketplace_contract_address || '');
    if (config.rpc_url) this.rpcUrl.set(config.rpc_url);
    if (config.explorer_url) this.explorerUrl.set(config.explorer_url);
    if (config.chain_id) this.configuredChainId.set(config.chain_id);
    if (config.explorer_api_key !== undefined) this.explorerApiKey.set(config.explorer_api_key || '');

    // Nếu ví đang kết nối, cập nhật lại trạng thái isOwnerContract dựa trên contract_address mới nhận được
    if (this.walletConnected() && this.currentAccount()) {
      this.updateBalanceAndStatus(this.currentAccount());
    }
  }

  /**
   * Kiểm tra xem session xác thực có tồn tại và khớp với ví hiện tại không (dựa vào auth_address, localStorage và cookie auth_logged_in)
   */
  private hasValidAuthToken(account: string): boolean {
    if (typeof window === 'undefined') return false;
    const savedAddress = localStorage.getItem('auth_address');
    const isLoggedIn = localStorage.getItem('auth_logged_in') === 'true';

    // Kiểm tra thêm sự tồn tại của cookie auth_logged_in (được backend set khi đăng nhập thành công và không phải httpOnly)
    let hasLoggedCookie = false;
    if (typeof document !== 'undefined') {
      hasLoggedCookie = document.cookie.split(';').some(c => c.trim().startsWith('auth_logged_in='));
    }

    return !!savedAddress && savedAddress.toLowerCase() === account.toLowerCase() && (isLoggedIn || hasLoggedCookie);
  }

  /**
   * Khôi phục phiên kết nối ví và đăng nhập tạm thời từ localStorage nếu hợp lệ
   */
  private restoreSessionFromStorage() {
    if (typeof window === 'undefined') return;
    const savedAddress = localStorage.getItem('auth_address');
    if (savedAddress && this.hasValidAuthToken(savedAddress)) {
      this.currentAccount.set(savedAddress);
      this.walletConnected.set(true);
      this.appKitAddress = savedAddress;
      this.appKitIsConnected = true;
      this.updateBalanceAndStatus(savedAddress);
    }
  }

  /**
   * Cập nhật số dư và kiểm tra xem ví có phải owner không
   */
  private async updateBalanceAndStatus(account: string) {
    const provider = this.getBrowserProvider();
    if (!provider) {
      // Không có provider nhưng chưa deploy contract → vẫn cho phép cấu hình
      if (!this.contractAddress() || this.contractAddress().trim() === '') {
        this.isOwnerContract.set(true);
      }
      return;
    }

    // 1. Lấy số dư (lỗi không block các bước sau)
    try {
      const balanceObj = await provider.getBalance(account);
      this.walletBalance.set(parseFloat(formatEther(balanceObj)).toFixed(4));
    } catch (err) {
      console.warn('Không thể lấy số dư ví:', err);
    }

    // 2. Lấy chainId (lỗi không block bước sau)
    try {
      const network = await provider.getNetwork();
      this.chainId.set(network.chainId.toString());
    } catch (err) {
      console.warn('Không thể lấy chainId từ provider:', err);
    }

    // 3. Kiểm tra xem có phải Owner của Smart Contract không
    if (!this.contractAddress() || this.contractAddress().trim() === '') {
      // Chưa deploy contract → bất kỳ ví nào đã kết nối đều được coi là Admin/Owner để cấu hình & deploy
      this.isOwnerContract.set(true);
    } else {
      try {
        const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, provider);
        const isOwner = await contract['isOwner'](account);
        this.isOwnerContract.set(isOwner);
      } catch (e) {
        console.warn('Smart Contract chua duoc deploy tren mang nay hoac loi dia chi:', e);
        this.isOwnerContract.set(false);
      }
    }
  }


  public async connectWallet(): Promise<boolean> {
    this.walletError.set('');

    if (!this.modal) {
      this.walletError.set('WalletConnect AppKit chưa được khởi tạo!');
      return false;
    }

    try {
      const defaultChain = this.supportedChains.find(c => !(c as any).testnet && !c.name.toLowerCase().includes('sepolia') && !c.name.toLowerCase().includes('testnet')) || this.supportedChains[0];
      if (defaultChain) {
        try {
          await this.modal.switchNetwork(defaultChain as any);
        } catch (e) {
          console.warn('[Web3] Ép mạng mặc định trước khi mở modal thất bại:', e);
        }
      }

      const isConnected = this.appKitIsConnected;
      const address = this.appKitAddress;
      if (isConnected && address) {
        this.currentAccount.set(address);

        if (this.hasValidAuthToken(address)) {
          this.walletConnected.set(true);
        } else {
          this.walletConnected.set(false);
        }

        await this.updateBalanceAndStatus(address);
        return true;
      }

      // Ngắt kết nối phiên treo cũ nếu người dùng chưa kết nối active để tránh lỗi "Connection can be declined"
      if (!this.walletConnected()) {
        try {
          await this.modal.disconnect();
        } catch (e) {}
      }

      this.resetWalletState(true);
      await this.modal.open();

      return new Promise<boolean>((resolve) => {
        let resolved = false;

        const unsubscribeAccount = this.modal.subscribeAccount(async (accountState: any) => {
          if (accountState.isConnected && accountState.address) {
            if (!resolved) {
              resolved = true;
              this.currentAccount.set(accountState.address);
              this.appKitAddress = accountState.address || null;
              this.appKitIsConnected = accountState.isConnected || false;

              if (this.hasValidAuthToken(accountState.address)) {
                this.walletConnected.set(true);
              } else {
                this.walletConnected.set(false);
              }

              await this.updateBalanceAndStatus(accountState.address);

              // Tự động chuyển ví sang mạng mong muốn sau khi kết nối thành công để ví không bị lỗi treo unknown network lúc chưa connect
              const currentChainId = this.chainId();
              const targetChainId = this.configuredChainId();
              if (currentChainId && currentChainId.toString() !== targetChainId.toString()) {
                setTimeout(async () => {
                  await this.ensureCorrectNetwork(targetChainId);
                }, 500);
              }

              unsubscribeAccount();
              unsubscribeEvents();
              try {
                this.modal.close();
              } catch (e) {}
              resolve(true);
            }
          }
        });

        const unsubscribeEvents = this.modal.subscribeEvents(async (event: any) => {
          if (event.data?.event === 'MODAL_CLOSE') {
            setTimeout(async () => {
              if (!resolved) {
                const conn = this.appKitIsConnected;
                const addr = this.appKitAddress;
                if (conn && addr) {
                  resolved = true;
                  this.currentAccount.set(addr);

                  if (this.hasValidAuthToken(addr)) {
                    this.walletConnected.set(true);
                  } else {
                    this.walletConnected.set(false);
                  }

                  await this.updateBalanceAndStatus(addr);
                  unsubscribeAccount();
                  unsubscribeEvents();
                  resolve(true);
                } else {
                  resolved = true;
                  unsubscribeAccount();
                  unsubscribeEvents();
                  this.resetWalletState(true);
                  resolve(false);
                }
              }
            }, 100);
          }
        });
      });
    } catch (err: any) {
      console.error('Lỗi khi mở modal kết nối:', err);
      // Nếu dính lỗi Connection declined do request cũ active, tự động ngắt phiên treo và mở lại
      if (err?.message?.includes('declined') || err?.message?.includes('active')) {
        try {
          await this.modal.disconnect();
          await this.modal.open();
        } catch (e) {}
      }
      this.walletError.set(err.message || 'Lỗi kết nối ví.');
      this.resetWalletState(true);
      return false;
    }
  }

  /**
   * Kiểm tra và yêu cầu chuyển sang đúng mạng lưới được cấu hình
   */
  public async ensureCorrectNetwork(targetChainId?: string): Promise<boolean> {
    this.walletError.set('');
    this.isSwitchingNetwork = true;
    const chainIdToUse = targetChainId || this.configuredChainId();

    try {
      if (this.modal) {
        const net = this.getAppKitNetworkByChainId(chainIdToUse);
        if (net) {
          try {
            await this.modal.switchNetwork(net);
          } catch (switchErr: any) {
            console.warn(`[Web3] AppKit switchNetwork thất bại cho chain ${chainIdToUse}, thử addNetworkToWallet:`, switchErr);
            const added = await this.addNetworkToWallet(chainIdToUse);
            if (added) {
              await this.modal.switchNetwork(net);
            } else {
              throw switchErr;
            }
          }
          this.chainId.set(chainIdToUse);
          this.configuredChainId.set(chainIdToUse);
          if (typeof window !== 'undefined') {
            localStorage.setItem('configured_chain_id', chainIdToUse);
          }
          if (this.currentAccount()) {
            await this.updateBalanceAndStatus(this.currentAccount());
          }
          return true;
        }
      }
      this.walletError.set('Không khởi tạo được modal chuyển mạng.');
      return false;
    } catch (err: any) {
      console.error('[Web3] Chuyển mạng thất bại:', err);
      this.walletError.set(err.message || 'Lỗi chuyển mạng.');
      return false;
    } finally {
      setTimeout(() => {
        this.isSwitchingNetwork = false;
      }, 2500);
    }
  }

  /**
   * Chuyển đổi UUID dạng chuỗi sang số Hex 256-bit (tương thích uint256 Solidity)
   */
  public convertUuidToUint256(uuid: string): string {
    if (!uuid) return '0';
    const hex = uuid.replace(/-/g, '').toLowerCase();
    return '0x' + hex;
  }

  /**
   * Ngắt kết nối ví (Client-side reset và ngắt kết nối AppKit)
   */
  public disconnectWallet() {
    if (this.modal) {
      try {
        this.modal.disconnect();
      } catch (err) {
        console.warn('Lỗi ngắt kết nối AppKit:', err);
      }
    }
    this.resetWalletState(true);
    this.emitAccountChange('');
  }

  public async addNetworkToWallet(chainId: number | string): Promise<boolean> {
    if (typeof window === 'undefined' || !(window as any).ethereum) return false;
    const idNum = Number(chainId);
    const idStr = idNum.toString();
    const hexChainId = '0x' + idNum.toString(16);

    const chainInfo = this.POPULAR_CHAINS.find(c => c.chainId === idStr);
    if (!chainInfo) {
      console.warn(`[Web3] Không tìm thấy thông tin mạng trong POPULAR_CHAINS cho chainId: ${chainId}`);
      return false;
    }

    let symbol = 'ETH';
    let currencyName = 'Ether';
    if (idStr === '56' || idStr === '97') {
      symbol = 'BNB';
      currencyName = 'BNB';
    }

    const params = {
      chainId: hexChainId,
      chainName: chainInfo.name,
      nativeCurrency: { name: currencyName, symbol: symbol, decimals: 18 },
      rpcUrls: [chainInfo.rpcUrl],
      blockExplorerUrls: [chainInfo.explorerUrl]
    };

    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params]
      });
      return true;
    } catch (e) {
      console.warn('[Web3] Thêm mạng vào ví thất bại:', e);
      return false;
    }
  }

  private async clearWalletConnectStorage() {
    if (typeof window === 'undefined') return;

    try {
      if ('indexedDB' in window) {
        const dbs = (await indexedDB.databases?.()) || [];
        for (const db of dbs) {
          if (db.name && (db.name.includes('WALLET_CONNECT') || db.name.includes('walletconnect') || db.name.includes('reown') || db.name.includes('appkit'))) {
            indexedDB.deleteDatabase(db.name);
          }
        }
      }
    } catch (e) {
      console.warn('[Web3] Lỗi khi dọn dẹp IndexedDB:', e);
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('wc@2') || key.startsWith('@w3m') || key.startsWith('@appkit'))) {
          if (key.includes('proposal') || key.includes('request') || key.includes('pending')) {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  private resetWalletState(forceLogout = false) {
    this.currentAccount.set('');
    this.walletBalance.set('0.00');
    this.walletConnected.set(false);
    this.isOwnerContract.set(false);
    if (forceLogout && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_address');
      localStorage.removeItem('auth_logged_in');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_permissions');
      localStorage.removeItem('auth_is_super_admin');
      localStorage.removeItem('auth_subscription_plan_code');
      localStorage.removeItem('auth_subscription_expires_at');
      localStorage.removeItem('auth_subscription_status');
      localStorage.removeItem('auth_plan_features');
      localStorage.removeItem('auth_system_contacts');
      localStorage.removeItem('auth_user_name');
      localStorage.removeItem('auth_user_email');
      localStorage.removeItem('auth_user_phone');
      localStorage.removeItem('appkit_siwe_signed');
      localStorage.removeItem('dapp_dynamic_colors');
    }
  }

  /**
   * Phát sự kiện thay đổi tài khoản và bảo vệ chống trùng lặp do nhiều nguồn listener (AppKit & window.ethereum) phát ra đồng thời
   */
  private emitAccountChange(account: string) {
    const normalizedAccount = account ? account.toLowerCase() : '';
    if (normalizedAccount === this.lastEmittedAccount) {
      return;
    }
    this.lastEmittedAccount = normalizedAccount;
    this.accountsChanged$.next(account);
  }

  /**
   * Yêu cầu ví ký một thông điệp (Sign Message)
   */
  public async signMessage(message: string): Promise<string> {
    this.provider = this.getBrowserProvider();
    if (!this.provider) throw new Error('Không có provider ví');
    const signer = await this.provider.getSigner();
    return await signer.signMessage(message);
  }

  /**
   * Ký số thông điệp EIP-712 cho phép sử dụng Voucher NFT (Miễn phí Gas)
   */
  public async signVoucherUsageEIP712(tokenId: number, orderCode: string): Promise<string> {
    if (!this.currentAccount()) {
      throw new Error('Chưa kết nối ví Web3!');
    }
    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      throw new Error('Không tìm thấy provider ví Web3!');
    }

    const signer = await this.provider.getSigner();
    const chainId = await this.provider.getNetwork().then(n => n.chainId);

    // Cấu hình EIP-712 Domain
    const domain = {
      name: 'CafeVoucher',
      version: '1',
      chainId: chainId,
      verifyingContract: this.voucherContractAddress()
    };

    // Cấu hình Struct Types
    const types = {
      UseVoucher: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'orderCode', type: 'string' }
      ]
    };

    // Giá trị thực tế ký
    const value = {
      tokenId: tokenId,
      orderCode: orderCode
    };

    // Thực hiện ký bằng signTypedData
    return await signer.signTypedData(domain, types, value);
  }

  /**
   * Tính toán phí gas overrides dựa vào tốc độ giao dịch thiết lập
   */
  private async getGasOverrides(): Promise<any> {
    const overrides: any = {};
    if (!this.provider) return overrides;

    try {
      const feeData = await this.provider.getFeeData();
      const speed = this.txSpeed();

      if (speed === 'fast') {
        if (feeData.maxFeePerGas) {
          overrides.maxFeePerGas = (feeData.maxFeePerGas * 150n) / 100n;
        }
        if (feeData.maxPriorityFeePerGas) {
          overrides.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 150n) / 100n;
        }
      } else if (speed === 'custom') {
        const multiplier = this.gasMultiplier() || 2.0;
        const multiplierBigInt = BigInt(Math.round(multiplier * 100));
        if (feeData.maxFeePerGas) {
          overrides.maxFeePerGas = (feeData.maxFeePerGas * multiplierBigInt) / 100n;
        }
        if (feeData.maxPriorityFeePerGas) {
          overrides.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * multiplierBigInt) / 100n;
        }
      }
    } catch (gasErr) {
      console.warn('[Web3] Không thể cấu hình phí gas nâng cao:', gasErr);
    }
    return overrides;
  }

  /**
   * Gửi native token tới một địa chỉ xác định
   */
  public async sendNativeToken(
    recipientAddress: string,
    amount: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const overrides = await this.getGasOverrides();
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: parseEther(amount),
        ...overrides
      });

      // Theo dõi và cập nhật lại số dư ví sau khi giao dịch hoàn tất trên mạng lưới
      tx.wait().then(() => {
        if (this.currentAccount()) {
          this.updateBalanceAndStatus(this.currentAccount());
        }
      }).catch(e => console.error('Lỗi cập nhật số dư sau giao dịch:', e));

      return {
        txHash: tx.hash,
        success: true
      };
    } catch (err: any) {
      console.error('Lỗi gửi native token:', err);
      return {
        txHash: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Lấy địa chỉ USDT contract theo chainId
   */
  public getUSDTAddressByChainId(chainId: string | number): string {
    const id = chainId.toString().trim();
    switch (id) {
      case '1': // Ethereum Mainnet
        return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
      case '11155111': // Sepolia Testnet
        return '0xaA8E23Fb1079EA71e0a56F48a2AA51851D8433D0';
      case '56': // BSC Mainnet
        return '0x55d398326f99059fF775485246999027B3197955';
      case '97': // BSC Testnet
        return '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
      case '137': // Polygon Mainnet
        return '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
      default:
        return '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
    }
  }

  /**
   * Lấy decimals của USDT theo chainId
   */
  public getUSDTDecimalsByChainId(chainId: string | number): number {
    const id = chainId.toString().trim();
    if (id === '1' || id === '137') return 6;
    return 18;
  }

  /**
   * Gửi USDT tới một địa chỉ
   */
  public async sendUSDT(
    recipientAddress: string,
    amount: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const chainId = this.chainId() || this.configuredChainId();
      const usdtAddress = this.getUSDTAddressByChainId(chainId);
      const decimals = this.getUSDTDecimalsByChainId(chainId);

      const abi = [
        'function transfer(address to, uint256 amount) public returns (bool)'
      ];
      const contract = new Contract(usdtAddress, abi, signer);
      const parsedAmount = parseUnits(amount, decimals);

      const overrides = await this.getGasOverrides();
      const tx = await contract['transfer'](recipientAddress, parsedAmount, overrides);

      tx.wait().then(() => {
        if (this.currentAccount()) {
          this.updateBalanceAndStatus(this.currentAccount());
        }
      }).catch((e: any) => console.error('Lỗi cập nhật số dư sau giao dịch USDT:', e));

      return {
        txHash: tx.hash,
        success: true
      };
    } catch (err: any) {
      console.error('Lỗi gửi USDT:', err);
      return {
        txHash: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Dịch lỗi từ blockchain sang tiếng Việt thân thiện
   */
  public translateBlockchainError(err: any): string {
    const errMsg = (err.reason || err.message || '').toString();
    const errCode = err.code;

    if (errCode === 4001 || errMsg.toLowerCase().includes('user rejected') || errMsg.toLowerCase().includes('rejected')) {
      return 'Giao dịch bị hủy bởi người dùng (User rejected).';
    }

    if (errMsg.toLowerCase().includes('out of gas') || errMsg.toLowerCase().includes('exceeds')) {
      return 'Lỗi vượt giới hạn Gas (Out of Gas) khi ghi dữ liệu. Vui lòng liên hệ quản trị viên.';
    }

    if (errMsg.toLowerCase().includes('ownable') || errMsg.toLowerCase().includes('not an owner') || errMsg.toLowerCase().includes('not owner') || errMsg.toLowerCase().includes('caller is not')) {
      return 'Tài khoản ví của bạn không có quyền thực hiện giao dịch này (Yêu cầu quyền Owner).';
    }

    return err.reason || err.message || 'Giao dịch bị từ chối hoặc lỗi chuỗi.';
  }

  /**
   * Helper chạy giao dịch ghi (write) contract, xử lý kết nối, mạng lưới và bắt lỗi tập trung (bảo toàn cho các hàm internal trong file)
   */
  public async runContractWriteTx(
    contractAddress: string,
    abi: any,
    methodName: string,
    args: any[]
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      const overrides = await this.getGasOverrides();
      const tx = await contract[methodName](...args, overrides);
      return {
        txHash: tx.hash,
        success: true
      };
    } catch (err: any) {
      console.error(`Loi thuc thi giao dich [${methodName}]:`, err);
      return {
        txHash: '',
        success: false,
        error: this.translateBlockchainError(err)
      };
    }
  }

  // ==========================================
  // DELEGATED SMART CONTRACT METHODS
  // ==========================================

  public async recordOrderOnChain(
    orderId: string | number,
    orderCode: string,
    tableNumber: string,
    totalAmount: number,
    paymentMethod: string,
    itemsSummary: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.recordOrderOnChain(orderId, orderCode, tableNumber, totalAmount, paymentMethod, itemsSummary);
  }

  public async addOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.addOwnersOnChain(newOwners);
  }

  public async removeOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.removeOwnersOnChain(ownersToRemove);
  }

  public async getOwnersFromChain(): Promise<string[]> {
    return this.posContractService.getOwnersFromChain();
  }

  public async getOriginalTxHashForOrder(orderId: string | number, orderCode?: string): Promise<string | null> {
    return this.posContractService.getOriginalTxHashForOrder(orderId, orderCode);
  }

  public async getOrdersPaginatedFromChain(page: number, limit: number): Promise<{ orders: any[], total: number }> {
    return this.posContractService.getOrdersPaginatedFromChain(page, limit);
  }

  public async getUserOrdersPaginatedFromChain(user: string, page: number, limit: number): Promise<{ orders: any[], total: number }> {
    return this.posContractService.getUserOrdersPaginatedFromChain(user, page, limit);
  }

  public async getOrderByCodeFromChain(orderCode: string): Promise<any | null> {
    return this.posContractService.getOrderByCodeFromChain(orderCode);
  }

  public async deployMenuRegistryContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.posContractService.deployMenuRegistryContractOnChain(targetChainId);
  }

  public async checkIsOwnerOfMenuRegistry(address: string): Promise<boolean> {
    return this.posContractService.checkIsOwnerOfMenuRegistry(address);
  }

  public async updateMenuOnChain(products: any[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.updateMenuOnChain(products);
  }

  public async getAllMenuProductsFromChain(): Promise<{ products: any[], lastUpdated: number }> {
    return this.posContractService.getAllMenuProductsFromChain();
  }

  public async getMenuRegistryOwnersFromChain(): Promise<string[]> {
    return this.posContractService.getMenuRegistryOwnersFromChain();
  }

  public async addMenuRegistryOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.addMenuRegistryOwnersOnChain(newOwners);
  }

  public async removeMenuRegistryOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.posContractService.removeMenuRegistryOwnersOnChain(ownersToRemove);
  }

  public async deployContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.posContractService.deployContractOnChain(targetChainId);
  }

  // FINANCE CONTRACT DELEGATION
  public async deployFinanceContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.financeContractService.deployFinanceContractOnChain(targetChainId);
  }

  public async recordTransactionOnChain(
    txId: string | number,
    transactionCode: string,
    type: 'thu' | 'chi',
    amount: number,
    category: string,
    description: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.financeContractService.recordTransactionOnChain(txId, transactionCode, type, amount, category, description);
  }

  public async getOriginalTxHashForTransaction(txId: string | number, txCode?: string): Promise<string | null> {
    return this.financeContractService.getOriginalTxHashForTransaction(txId, txCode);
  }

  public async getFinanceOwnersFromChain(): Promise<string[]> {
    return this.financeContractService.getFinanceOwnersFromChain();
  }

  public async addFinanceOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.financeContractService.addFinanceOwnersOnChain(newOwners);
  }

  public async removeFinanceOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.financeContractService.removeFinanceOwnersOnChain(ownersToRemove);
  }

  public async getTransactionsPaginatedFromChain(page: number, limit: number): Promise<{ transactions: any[], total: number }> {
    return this.financeContractService.getTransactionsPaginatedFromChain(page, limit);
  }

  public async getUserTransactionsPaginatedFromChain(user: string, page: number, limit: number): Promise<{ transactions: any[], total: number }> {
    return this.financeContractService.getUserTransactionsPaginatedFromChain(user, page, limit);
  }

  public async getTransactionByCodeFromChain(txCode: string): Promise<any | null> {
    return this.financeContractService.getTransactionByCodeFromChain(txCode);
  }

  // VOUCHER CONTRACT DELEGATION
  public async deployVoucherContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.voucherContractService.deployVoucherContractOnChain(targetChainId);
  }

  public async deployLoyaltyTokenContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.voucherContractService.deployLoyaltyTokenContractOnChain(targetChainId);
  }

  public async deployVoucherShopContractOnChain(
    targetChainId?: string,
    cafeToken?: string,
    voucherNft?: string
  ): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.voucherContractService.deployVoucherShopContractOnChain(targetChainId, cafeToken, voucherNft);
  }

  public async deployVoucherMarketplaceContractOnChain(
    targetChainId?: string,
    cafeToken?: string,
    voucherNft?: string,
    feeRecipient?: string
  ): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    return this.voucherContractService.deployVoucherMarketplaceContractOnChain(targetChainId, cafeToken, voucherNft, feeRecipient);
  }

  public async getCustomerVouchersFromChain(customerAddress: string): Promise<any[]> {
    return this.voucherContractService.getCustomerVouchersFromChain(customerAddress);
  }

  public async getSingleVoucherFromChain(tokenId: number): Promise<any | null> {
    return this.voucherContractService.getSingleVoucherFromChain(tokenId);
  }

  public async getVoucherOwnersFromChain(): Promise<string[]> {
    return this.voucherContractService.getVoucherOwnersFromChain();
  }

  public async addVoucherOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.addVoucherOwnersOnChain(newOwners);
  }

  public async removeVoucherOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.removeVoucherOwnersOnChain(ownersToRemove);
  }

  public async getCafeTokenBalance(account: string): Promise<string> {
    return this.voucherContractService.getCafeTokenBalance(account);
  }

  public async getVoucherTypesFromShop(): Promise<any[]> {
    return this.voucherContractService.getVoucherTypesFromShop();
  }

  public async buyVoucherFromShop(voucherTypeId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.buyVoucherFromShop(voucherTypeId, priceInCafeToken);
  }

  public async getActiveListingsFromMarket(): Promise<any[]> {
    return this.voucherContractService.getActiveListingsFromMarket();
  }

  public async listVoucherOnMarket(tokenId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.listVoucherOnMarket(tokenId, priceInCafeToken);
  }

  public async buyVoucherFromMarket(tokenId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.buyVoucherFromMarket(tokenId, priceInCafeToken);
  }

  public async cancelListingOnMarket(tokenId: number): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.voucherContractService.cancelListingOnMarket(tokenId);
  }

  /**
   * Lấy API URL của Block Explorer tương ứng với chainId.
   */
  public getExplorerApiUrl(chainId: string | number): string | null {
    return getExplorerApiUrl(chainId);
  }

  /**
   * Lấy danh sách backup RPC URL đáng tin cậy cho event log query và auto-switch.
   */
  public getBackupRpcUrls(chainId: string | number): string[] {
    return getBackupRpcUrls(chainId);
  }

  /**
   * Lấy block time trung bình (giây) theo chain.
   */
  public getAvgBlockTime(chainId: string | number): number {
    return getAvgBlockTime(chainId);
  }
}

