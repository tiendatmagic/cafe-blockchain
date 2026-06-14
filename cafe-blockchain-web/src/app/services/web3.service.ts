import { Injectable, signal, computed } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { CAFE_WEB3_POS_ABI } from './contract-abi';
import { CAFE_WEB3_POS_BYTECODE } from './contract-bytecode';
import { CAFE_WEB3_FINANCE_ABI } from './finance-contract-abi';
import { CAFE_WEB3_FINANCE_BYTECODE } from './finance-contract-bytecode';
import { CAFE_VOUCHER_NFT_ABI } from './voucher-contract-abi';
import { CAFE_VOUCHER_NFT_BYTECODE } from './voucher-contract-bytecode';
import { CAFE_MENU_REGISTRY_ABI } from './menu-registry-contract-abi';
import { CAFE_MENU_REGISTRY_BYTECODE } from './menu-registry-contract-bytecode';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

// Tích hợp Reown AppKit cho WalletConnect
import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, arbitrum, bsc, polygon, optimism, base, sepolia, bscTestnet, arbitrumSepolia } from '@reown/appkit/networks';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  // Trạng thái kết nối ví
  public readonly walletConnected = signal<boolean>(false);
  public readonly currentAccount = signal<string>('');
  public readonly walletBalance = signal<string>('0.00');
  public readonly isOwnerContract = signal<boolean>(false);
  public readonly walletError = signal<string>('');
  public readonly chainId = signal<string>('');

  // Sự kiện thay đổi tài khoản hoặc ngắt kết nối ví
  public readonly accountsChanged$ = new Subject<string>();

  // Cấu hình blockchain (sẽ được cập nhật từ database thông qua ApiService)
  public readonly contractAddress = signal<string>('');
  public readonly financeContractAddress = signal<string>('');
  public readonly voucherContractAddress = signal<string>('');
  public readonly menuRegistryContractAddress = signal<string>('');
  public readonly rpcUrl = signal<string>(environment.defaultRpcUrl || 'https://bnb-testnet.api.onfinality.io/public');
  public readonly explorerUrl = signal<string>(environment.defaultExplorerUrl || 'https://testnet.bscscan.com');
  public readonly explorerApiKey = signal<string>('');
  public readonly configuredChainId = signal<string>(environment.defaultChainId || '97');

  public readonly POPULAR_CHAINS = [
    { name: 'Ethereum Mainnet', chainId: '1', rpcUrl: 'https://cloudflare-eth.com', explorerUrl: 'https://etherscan.io' },
    { name: 'BNB Smart Chain ', chainId: '56', rpcUrl: 'https://bsc-dataseed.binance.org', explorerUrl: 'https://bscscan.com' },
    { name: 'Polygon PoS Mainnet', chainId: '137', rpcUrl: 'https://polygon-rpc.com', explorerUrl: 'https://polygonscan.com' },
    { name: 'Arbitrum One Mainnet', chainId: '42161', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io' },
    { name: 'Optimism Mainnet', chainId: '10', rpcUrl: 'https://mainnet.optimism.io', explorerUrl: 'https://optimistic.etherscan.io' },
    { name: 'Base Mainnet', chainId: '8453', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org' },
    { name: 'Sepolia Testnet', chainId: '11155111', rpcUrl: 'https://ethereum-sepolia.publicnode.com', explorerUrl: 'https://sepolia.etherscan.io' },
    { name: 'BSC Testnet', chainId: '97', rpcUrl: 'https://bnb-testnet.api.onfinality.io/public', explorerUrl: 'https://testnet.bscscan.com' },
    { name: 'Arbitrum Sepolia', chainId: '421614', rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc', explorerUrl: 'https://sepolia.arbiscan.io/' },
  ];

  // Địa chỉ ví rút gọn
  public readonly shortAddress = computed(() => {
    const addr = this.currentAccount();
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  });

  // Kiểm tra ví đang kết nối có sai chain so với cấu hình không
  public readonly isWrongChain = computed(() => {
    const connected = this.walletConnected();
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

  constructor() {
    this.initAppKit();
    this.setupEthereumListeners();
    this.restoreSessionFromStorage();

    // Đánh dấu hoàn tất giai đoạn khởi tạo AppKit sau 2 giây để tránh race condition lúc F5
    setTimeout(() => {
      this.isAppKitInitializing = false;
      console.log('[Web3] AppKit initialization phase completed.');
    }, 2000);
  }

  /**
   * Khởi tạo Reown AppKit modal với cấu hình được yêu cầu
   */
  private initAppKit() {
    if (typeof window === 'undefined') return;

    try {
      const projectId = environment.walletConnectProjectId;
      if (!projectId) {
        console.warn('[Web3] walletConnectProjectId is missing in environment configuration.');
        return;
      }

      const ethersAdapter = new EthersAdapter();

      this.modal = createAppKit({
        adapters: [ethersAdapter],
        networks: [arbitrum, mainnet, bsc, polygon, optimism, base, sepolia, bscTestnet, arbitrumSepolia],
        defaultNetwork: arbitrum,
        metadata: {
          name: 'Cafe Blockchain',
          description: 'Cafe Blockchain POS & Storefront DApp',
          url: window.location.origin,
          icons: [window.location.origin + '/assets/icons/icon-128x128.png']
        },
        projectId,
        features: {
          email: false,
          socials: false,
          analytics: false
        },
        enableCoinbase: false,
        excludeWalletIds: [
          'fd20a4e69d7b889311311b93f773646548d7936a575a783783451e01869e54d8',
          'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef'
        ],
        featuredWalletIds: [
          '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0' // Trust Wallet
        ]
      });

      // Lắng nghe account thay đổi từ WalletConnect modal để cập nhật state đồng bộ
      this.modal.subscribeAccount(async (accountState: any) => {
        console.log('[AppKit] Account changed:', accountState);
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

          if (oldAccount && oldAccount.toLowerCase() !== address.toLowerCase()) {
            this.accountsChanged$.next(address);
          }
        } else {
          // Chỉ xử lý ngắt kết nối thực sự sau khi kết thúc giai đoạn khởi tạo
          if (!this.isAppKitInitializing && this.currentAccount()) {
            console.log('[AppKit] Phát hiện ngắt kết nối ví thực sự sau khởi tạo');
            this.resetWalletState(true);
            this.accountsChanged$.next('');
          } else {
            // Trong lúc khởi tạo (F5), chỉ tạm thời reset state ví của DApp, giữ nguyên localStorage
            this.resetWalletState(false);
          }
        }
      });

      // Lắng nghe network thay đổi từ WalletConnect modal
      this.modal.subscribeNetwork((networkState: any) => {
        console.log('[AppKit] Network changed:', networkState);
        if (networkState.selectedNetworkId) {
          this.chainId.set(networkState.selectedNetworkId.toString());
          if (this.currentAccount()) {
            this.updateBalanceAndStatus(this.currentAccount());
          }
        }
      });

    } catch (error) {
      console.error('[Web3] Error initializing Reown AppKit:', error);
    }
  }

  /**
   * Thiết lập lắng nghe các sự kiện đổi tài khoản và mạng lưới trực tiếp từ window.ethereum
   */
  private setupEthereumListeners() {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;

    const eth = (window as any).ethereum;

    // Lắng nghe thay đổi tài khoản
    eth.on('accountsChanged', (accounts: string[]) => {
      console.log('Ethereum accountsChanged:', accounts);
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const oldAccount = this.currentAccount();
        const wasConnected = this.walletConnected();
        this.currentAccount.set(account);

        if (this.hasValidAuthToken(account)) {
          this.walletConnected.set(true);
        } else {
          this.walletConnected.set(false);
        }

        this.updateBalanceAndStatus(account);

        if (oldAccount && oldAccount.toLowerCase() !== account.toLowerCase()) {
          if (wasConnected) {
            this.accountsChanged$.next(account);
          }
        }
      } else {
        if (!this.isAppKitInitializing && this.currentAccount()) {
          this.resetWalletState(true);
          this.accountsChanged$.next('');
        } else {
          this.resetWalletState(false);
        }
      }
    });

    // Lắng nghe thay đổi mạng lưới
    eth.on('chainChanged', (chainIdHex: string) => {
      console.log('Ethereum chainChanged:', chainIdHex);
      const decimalChainId = BigInt(chainIdHex).toString();
      this.chainId.set(decimalChainId);

      const account = this.currentAccount();
      if (account) {
        this.updateBalanceAndStatus(account);
      }
    });
  }

  /**
   * Lấy BrowserProvider tương ứng từ ví đã kết nối (ưu tiên AppKit provider)
   */
  private getBrowserProvider(): BrowserProvider | null {
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
  public updateConfig(config: { contract_address?: string, finance_contract_address?: string, voucher_contract_address?: string, menu_registry_contract_address?: string, rpc_url?: string, explorer_url?: string, chain_id?: string, explorer_api_key?: string }) {
    this.contractAddress.set(config.contract_address || '');
    if (config.finance_contract_address !== undefined) this.financeContractAddress.set(config.finance_contract_address || '');
    if (config.voucher_contract_address !== undefined) this.voucherContractAddress.set(config.voucher_contract_address || '');
    if (config.menu_registry_contract_address !== undefined) this.menuRegistryContractAddress.set(config.menu_registry_contract_address || '');
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
      console.log('[Web3] Khôi phục session tạm thời từ storage:', savedAddress);
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
    if (!provider) return;
    try {
      // 1. Lấy số dư
      const balanceObj = await provider.getBalance(account);
      this.walletBalance.set(parseFloat(formatEther(balanceObj)).toFixed(4));

      // 2. Lấy chainId
      const network = await provider.getNetwork();
      this.chainId.set(network.chainId.toString());

      // 3. Kiểm tra xem có phải Owner của Smart Contract không
      if (!this.contractAddress() || this.contractAddress().trim() === '') {
        // Nếu chưa deploy contract, bất kỳ ví nào đã kết nối đều được coi là Admin/Owner để cấu hình & deploy
        this.isOwnerContract.set(true);
      } else {
        const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, provider);
        try {
          const isOwner = await contract['isOwner'](account);
          this.isOwnerContract.set(isOwner);
        } catch (e) {
          console.warn('Smart Contract chua duoc deploy tren mang nay hoac loi dia chi:', e);
          this.isOwnerContract.set(false);
        }
      }
    } catch (err) {
      console.error('Loi cap nhat trang thai vi:', err);
    }
  }

  public async connectWallet(): Promise<boolean> {
    this.walletError.set('');

    if (!this.modal) {
      this.walletError.set('WalletConnect AppKit chưa được khởi tạo!');
      return false;
    }

    try {
      // 1. Kiểm tra xem ví đã kết nối sẵn chưa. Nếu đã kết nối, trả về true ngay để chuyển sang bước ký.
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
        console.log('[AppKit] Ví đã kết nối sẵn:', address);
        return true;
      }

      // 2. Nếu chưa kết nối, mở modal chọn ví của AppKit
      await this.modal.open();

      // Chờ cho đến khi ví kết nối thành công hoặc modal đóng
      return new Promise<boolean>((resolve) => {
        let resolved = false;

        // Lắng nghe tài khoản thay đổi để phát hiện kết nối thành công
        const unsubscribeAccount = this.modal.subscribeAccount(async (accountState: any) => {
          console.log('[AppKit] subscribeAccount in connectWallet:', accountState);
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

              unsubscribeAccount();
              unsubscribeEvents();
              this.modal.close();
              resolve(true);
            }
          }
        });

        // Lắng nghe sự kiện đóng modal
        const unsubscribeEvents = this.modal.subscribeEvents(async (event: any) => {
          console.log('[AppKit] subscribeEvents in connectWallet:', event);
          if (event.data?.event === 'MODAL_CLOSE') {
            // Đợi một chút để check xem sau khi đóng modal trạng thái ví thế nào
            setTimeout(async () => {
              if (!resolved) {
                const isConnected = this.appKitIsConnected;
                const address = this.appKitAddress;
                if (isConnected && address) {
                  resolved = true;
                  this.currentAccount.set(address);

                  if (this.hasValidAuthToken(address)) {
                    this.walletConnected.set(true);
                  } else {
                    this.walletConnected.set(false);
                  }

                  await this.updateBalanceAndStatus(address);
                  unsubscribeAccount();
                  unsubscribeEvents();
                  resolve(true);
                } else {
                  resolved = true;
                  unsubscribeAccount();
                  unsubscribeEvents();
                  resolve(false);
                }
              }
            }, 100);
          }
        });
      });
    } catch (err: any) {
      console.error('Lỗi khi mở modal kết nối:', err);
      this.walletError.set(err.message || 'Lỗi kết nối ví.');
      return false;
    }
  }

  /**
   * Kiểm tra và yêu cầu chuyển sang đúng mạng lưới được cấu hình
   */
  public async ensureCorrectNetwork(targetChainId?: string): Promise<boolean> {
    this.walletError.set('');

    const chainIdToUse = targetChainId || this.configuredChainId();
    const chainIdHex = `0x${BigInt(chainIdToUse).toString(16)}`;

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      this.walletError.set('Không tìm thấy ví Web3!');
      return false;
    }

    try {
      console.log('Attempting direct window.ethereum switch to chain ID:', chainIdHex);
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      this.chainId.set(chainIdToUse);
      if (this.currentAccount()) {
        await this.updateBalanceAndStatus(this.currentAccount());
      }
      return true;
    } catch (directSwitchError: any) {
      console.warn('Direct window.ethereum switch failed, attempting to add network:', directSwitchError);
      const isNetworkNotAdded = directSwitchError.code === 4902 ||
        directSwitchError.data?.originalError?.code === 4902 ||
        directSwitchError.message?.includes('4902');
      if (isNetworkNotAdded) {
        try {
          const tokenSymbol = this.getNativeTokenSymbolByChainId(chainIdToUse);
          const netName = this.getNetworkNameByChainId(chainIdToUse);

          // Lấy RPC URL và Explorer URL từ danh sách mạng phổ biến (nếu có), ngược lại lấy từ cấu hình
          const popularChain = this.POPULAR_CHAINS.find(c => c.chainId === chainIdToUse.toString().trim());
          const rpcUrl = popularChain ? popularChain.rpcUrl : this.rpcUrl();
          const explorerUrl = popularChain ? popularChain.explorerUrl : this.explorerUrl();

          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: netName || `Mạng EVM Custom (ID: ${chainIdToUse})`,
              rpcUrls: [rpcUrl],
              blockExplorerUrls: explorerUrl ? [explorerUrl] : undefined,
              nativeCurrency: {
                name: tokenSymbol,
                symbol: tokenSymbol,
                decimals: 18
              }
            }],
          });
          this.chainId.set(chainIdToUse);
          if (this.currentAccount()) {
            await this.updateBalanceAndStatus(this.currentAccount());
          }
          return true;
        } catch (addError) {
          console.error('Direct window.ethereum add failed:', addError);
          this.walletError.set('Không thể tự động thêm mạng mới vào ví!');
          return false;
        }
      } else if (directSwitchError.code === 4001 || directSwitchError.message?.includes('user rejected') || directSwitchError.message?.includes('rejected')) {
        this.walletError.set('Giao dịch chuyển mạng bị hủy bởi người dùng.');
        return false;
      }
      this.walletError.set(directSwitchError.message || 'Lỗi chuyển mạng.');
      return false;
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
    this.accountsChanged$.next('');
  }

  private resetWalletState(forceLogout = false) {
    this.currentAccount.set('');
    this.walletBalance.set('0.00');
    this.walletConnected.set(false);
    this.isOwnerContract.set(false);
    if (forceLogout && typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
      localStorage.removeItem('auth_logged_in');
    }
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
    if (!this.walletConnected() || !this.currentAccount()) {
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
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: parseEther(amount)
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
   * Dịch lỗi từ blockchain sang tiếng Việt thân thiện
   */
  private translateBlockchainError(err: any): string {
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
   * Helper chạy giao dịch ghi (write) contract, xử lý kết nối, mạng lưới và bắt lỗi tập trung
   */
  private async runContractWriteTx(
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
      const tx = await contract[methodName](...args);
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

  /**
   * Ghi nhận đơn hàng lên Smart Contract Blockchain
   */
  public async recordOrderOnChain(
    orderId: string | number,
    orderCode: string,
    tableNumber: string,
    totalAmount: number,
    paymentMethod: string,
    itemsSummary: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    const finalOrderId = typeof orderId === 'string' ? this.convertUuidToUint256(orderId) : orderId;
    return this.runContractWriteTx(
      this.contractAddress(),
      CAFE_WEB3_POS_ABI,
      'recordOrder',
      [
        finalOrderId,
        orderCode || '',
        tableNumber || 'Mang về',
        Math.round(totalAmount),
        paymentMethod,
        itemsSummary
      ]
    );
  }

  /**
   * Thêm các Owner ví thu ngân khác trên Smart Contract
   */
  public async addOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.runContractWriteTx(
      this.contractAddress(),
      CAFE_WEB3_POS_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner ví thu ngân khác trên Smart Contract
   */
  public async removeOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    return this.runContractWriteTx(
      this.contractAddress(),
      CAFE_WEB3_POS_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract
   */
  public async getOwnersFromChain(): Promise<string[]> {
    this.provider = this.getBrowserProvider();
    if (!this.provider) return [];
    try {
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, this.provider);
      return await contract['getOwners']();
    } catch (e) {
      console.error('Loi doc danh sach owners tu chuoi:', e);
      return [];
    }
  }

  /**
   * Truy vấn tx_hash gốc của đơn hàng đã tồn tại trên Blockchain.
   * Chiến lược:
   *   1. Xác minh đơn hàng tồn tại và lấy timestamp từ getOrder()
   *   2. Tính block ước lượng từ timestamp
   *   3. Dùng backup RPC (publicnode) để query event log — vì Binance RPC
   *      default không hỗ trợ eth_getLogs, và MetaMask provider cũng thường bị giới hạn
   */
  public async getOriginalTxHashForOrder(orderId: string | number): Promise<string | null> {
    this.provider = this.getBrowserProvider();
    if (!this.provider || !this.contractAddress()) return null;
    try {
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, this.provider);
      const finalOrderId = typeof orderId === 'string' ? this.convertUuidToUint256(orderId) : orderId;

      // ===== BƯỚC 1: Xác minh đơn hàng tồn tại + lấy timestamp =====
      let orderTimestamp = 0;
      try {
        const orderData = await contract['getOrder'](finalOrderId);
        if (!orderData || Number(orderData[0]) === 0) {
          console.warn('[Blockchain] Order', finalOrderId, 'khong ton tai tren Smart Contract.');
          return null;
        }
        orderTimestamp = Number(orderData[6]); // timestamp field
        console.log('[Blockchain] Order', finalOrderId, 'xac minh OK. Timestamp:', new Date(orderTimestamp * 1000).toISOString());
      } catch {
        console.warn('[Blockchain] Khong the goi getOrder() - order co the khong ton tai.');
        return null;
      }

      const chainId = this.chainId() || this.configuredChainId();

      // ===== BƯỚC 2: Thử tìm nhanh qua API Block Explorer (BscScan/Etherscan) =====
      const explorerApiUrl = this.getExplorerApiUrl(chainId);
      const apiKey = this.explorerApiKey();
      if (explorerApiUrl && apiKey && apiKey.trim() !== '') {
        try {
          console.log('[Blockchain] Thu truy van nhanh qua API Explorer:', explorerApiUrl);
          // Tạo topic1 bằng cách pad hex orderId sang 32 bytes (64 ký tự)
          const cleanHexId = typeof finalOrderId === 'string' ? finalOrderId.replace('0x', '') : finalOrderId.toString(16);
          const topic1 = '0x' + cleanHexId.padStart(64, '0');
          // Lấy topic0 từ ABI sự kiện
          const topic0 = contract.interface.getEvent('OrderRecorded')?.topicHash;

          if (topic0) {
            const url = `${explorerApiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${this.contractAddress()}&topic0=${topic0}&topic1=${topic1}&apikey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === '1' && data.result && data.result.length > 0) {
              const txHash = data.result[0].transactionHash;
              console.log('[Blockchain] ✅ Tim thay tx_hash qua API Explorer:', txHash);
              return txHash;
            } else {
              console.warn('[Blockchain] API Explorer khong tra ve ket qua logic, thu sang RPC scan.');
            }
          }
        } catch (apiErr) {
          console.error('[Blockchain] Loi goi API Block Explorer, dang fallback ve RPC scan:', apiErr);
        }
      } else {
        console.log('[Blockchain] Khong co API Key Explorer hoặc khong ho tro chain. Chuyen sang RPC scan.');
      }

      // ===== BƯỚC 3: Quét block bằng backup RPC (Fallback có Auto-switch) =====
      const backupRpcUrls = this.getBackupRpcUrls(chainId);
      const rpcUrlsToTry = [this.rpcUrl(), ...backupRpcUrls].filter(url => !!url);

      let eventsFound: any[] = [];
      let successRpcUrl = '';

      for (const rpcUrl of rpcUrlsToTry) {
        try {
          console.log('[Blockchain] Thu quet event bang RPC:', rpcUrl);
          const backupProvider = new JsonRpcProvider(rpcUrl);
          const backupContract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, backupProvider);

          const currentBlock = await backupProvider.getBlockNumber();
          const currentTime = Math.floor(Date.now() / 1000);

          // Tính block ước lượng dựa trên timestamp và block time trung bình (~3s cho BSC)
          const blockTime = this.getAvgBlockTime(chainId);
          const timeDiff = currentTime - orderTimestamp;
          const blockDiff = Math.floor(timeDiff / blockTime);
          const approxBlock = currentBlock - blockDiff;

          // Scan range: Tối ưu ±5K blocks để tránh lỗi Rate Limit HTTP 429
          const scanStart = Math.max(0, approxBlock - 5000);
          const scanEnd = Math.min(currentBlock, approxBlock + 5000);
          const chunkSize = 5000;

          console.log(`[Blockchain] Scan blocks ${scanStart} - ${scanEnd} (approx: ${approxBlock}, chunk: ${chunkSize})`);

          const filter = backupContract.filters['OrderRecorded'](finalOrderId);
          let found = false;

          for (let start = scanStart; start <= scanEnd; start += chunkSize) {
            const end = Math.min(start + chunkSize - 1, scanEnd);
            try {
              const events = await backupContract.queryFilter(filter, start, end);
              if (events.length > 0) {
                eventsFound = events;
                successRpcUrl = rpcUrl;
                found = true;
                break;
              }
            } catch {
              continue;
            }
          }

          if (found) {
            break; // Thử thành công, dừng xoay vòng RPC
          }
        } catch (rpcErr) {
          console.warn(`[Blockchain] Node RPC ${rpcUrl} loi, dang fallback sang node khac:`, rpcErr);
          continue;
        }
      }

      if (eventsFound.length > 0) {
        console.log('[Blockchain] ✅ Tim thay tx_hash cho order', orderId, ':', eventsFound[0].transactionHash, 'qua RPC:', successRpcUrl);
        return eventsFound[0].transactionHash;
      }

      console.warn('[Blockchain] ❌ Khong tim thay event OrderRecorded cho order', orderId);
      return null;
    } catch (err) {
      console.error('[Blockchain] Loi tong quat khi truy van tx_hash goc:', err);
      return null;
    }
  }

  /**
   * Lấy API URL của Block Explorer tương ứng với chainId.
   */
  private getExplorerApiUrl(chainId: string): string | null {
    const id = chainId.toString().trim();
    switch (id) {
      case '97': return 'https://api-testnet.bscscan.com/api';
      case '56': return 'https://api.bscscan.com/api';
      case '1': return 'https://api.etherscan.io/api';
      case '11155111': return 'https://api-sepolia.etherscan.io/api';
      case '137': return 'https://api.polygonscan.com/api';
      case '80002': return 'https://api-amoy.polygonscan.com/api';
      case '42161': return 'https://api.arbiscan.io/api';
      case '421614': return 'https://api-sepolia.arbiscan.io/api';
      case '8453': return 'https://api.basescan.org/api';
      case '84532': return 'https://api-sepolia.basescan.org/api';
      case '10': return 'https://api-optimistic.etherscan.io/api';
      case '11155420': return 'https://api-sepolia-optimistic.etherscan.io/api';
      default: return null;
    }
  }

  /**
   * Lấy danh sách backup RPC URL đáng tin cậy cho event log query và auto-switch.
   */
  private getBackupRpcUrls(chainId: string): string[] {
    const id = chainId.toString().trim();
    switch (id) {
      case '97': return ['https://bnb-testnet.api.onfinality.io/public', 'https://bsc-testnet-rpc.publicnode.com', 'https://bsc-testnet.blockpi.network/v1/rpc/public'];
      case '56': return ['https://bsc-rpc.publicnode.com', 'https://binance.llamarpc.com', 'https://rpc.ankr.com/bsc'];
      case '1': return ['https://ethereum-rpc.publicnode.com', 'https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'];
      case '11155111': return ['https://ethereum-sepolia-rpc.publicnode.com', 'https://sepolia.gateway.tenderly.co', 'https://rpc.ankr.com/eth_sepolia'];
      case '137': return ['https://polygon-bor-rpc.publicnode.com', 'https://polygon.llamarpc.com', 'https://rpc.ankr.com/polygon'];
      case '80002': return ['https://polygon-amoy-bor-rpc.publicnode.com', 'https://polygon-amoy.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/polygon_amoy'];
      case '42161': return ['https://arbitrum-one-rpc.publicnode.com', 'https://arbitrum.llamarpc.com', 'https://rpc.ankr.com/arbitrum'];
      case '421614': return ['https://arbitrum-sepolia-rpc.publicnode.com', 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/arbitrum_sepolia'];
      case '8453': return ['https://base-rpc.publicnode.com', 'https://base.llamarpc.com', 'https://rpc.ankr.com/base'];
      case '84532': return ['https://base-sepolia-rpc.publicnode.com', 'https://base-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/base_sepolia'];
      case '10': return ['https://optimism-rpc.publicnode.com', 'https://optimism.llamarpc.com', 'https://rpc.ankr.com/optimism'];
      case '11155420': return ['https://optimism-sepolia-rpc.publicnode.com', 'https://optimism-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/optimism_sepolia'];
      default: return [];
    }
  }

  /**
   * Lấy block time trung bình (giây) theo chain.
   */
  private getAvgBlockTime(chainId: string): number {
    switch (chainId) {
      case '56':
      case '97': return 3;   // BSC ~3s
      case '137':
      case '80002': return 2;   // Polygon ~2s
      case '1':
      case '11155111': return 12;  // Ethereum ~12s
      default: return 3;   // Default 3s
    }
  }



  /**
   * Tự động Deploy Smart Contract mới lên Blockchain EVM
   */
  public async deployContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    // Đảm bảo đúng mạng trước khi deploy, truyền targetChainId vào trực tiếp
    const hasCorrectNetwork = await this.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      // Khởi tạo lại provider và signer mới nhất để đảm bảo giao dịch thực thi trên mạng đã cập nhật
      this.provider = new BrowserProvider((window as any).ethereum);
      const signer = await this.provider.getSigner();
      const factory = new ContractFactory(CAFE_WEB3_POS_ABI, CAFE_WEB3_POS_BYTECODE, signer);

      // Deploy contract
      const contract = await factory.deploy();

      // Đợi transaction được xác thực thành công trên Blockchain
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();

      // Cập nhật địa chỉ mới vào signal của Web3Service
      this.contractAddress.set(newAddress);
      this.isOwnerContract.set(true); // Người deploy mặc định là owner đầu tiên

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy Smart Contract:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Tự động Deploy Smart Contract Tài chính mới lên Blockchain EVM
   */
  public async deployFinanceContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      this.provider = new BrowserProvider((window as any).ethereum);
      const signer = await this.provider.getSigner();
      const factory = new ContractFactory(CAFE_WEB3_FINANCE_ABI, CAFE_WEB3_FINANCE_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.financeContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy Smart Contract Tai chinh:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Tự động Deploy Smart Contract NFT Voucher mới lên Blockchain EVM
   */
  public async deployVoucherContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      this.provider = new BrowserProvider((window as any).ethereum);
      const signer = await this.provider.getSigner();
      const factory = new ContractFactory(CAFE_VOUCHER_NFT_ABI, CAFE_VOUCHER_NFT_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.voucherContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy Smart Contract NFT Voucher:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Ghi nhận giao dịch thu chi tài chính lên Smart Contract Blockchain
   */
  public async recordTransactionOnChain(
    txId: string | number,
    transactionCode: string,
    type: 'thu' | 'chi',
    amount: number,
    category: string,
    description: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    const finalTxId = typeof txId === 'string' ? this.convertUuidToUint256(txId) : txId;
    const txType = type === 'thu' ? 1 : 0;
    return this.runContractWriteTx(
      this.financeContractAddress(),
      CAFE_WEB3_FINANCE_ABI,
      'recordTransaction',
      [
        finalTxId,
        transactionCode || '',
        txType,
        Math.round(amount),
        category,
        description || ''
      ]
    );
  }

  /**
   * Truy vấn tx_hash gốc của giao dịch thu chi đã tồn tại trên Blockchain.
   */
  public async getOriginalTxHashForTransaction(txId: string | number): Promise<string | null> {
    this.provider = this.getBrowserProvider();
    if (!this.provider || !this.financeContractAddress()) return null;
    try {
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, this.provider);
      const finalTxId = typeof txId === 'string' ? this.convertUuidToUint256(txId) : txId;

      let orderTimestamp = 0;
      try {
        const txData = await contract['getTransaction'](finalTxId);
        if (!txData || Number(txData[0]) === 0) {
          console.warn('[Blockchain] Transaction', finalTxId, 'khong ton tai tren Smart Contract.');
          return null;
        }
        orderTimestamp = Number(txData[6]); // timestamp field
      } catch {
        console.warn('[Blockchain] Khong the goi getTransaction() - transaction co the khong ton tai.');
        return null;
      }

      const chainId = this.chainId() || this.configuredChainId();

      const explorerApiUrl = this.getExplorerApiUrl(chainId);
      const apiKey = this.explorerApiKey();
      if (explorerApiUrl && apiKey && apiKey.trim() !== '') {
        try {
          const cleanHexId = typeof finalTxId === 'string' ? finalTxId.replace('0x', '') : finalTxId.toString(16);
          const topic1 = '0x' + cleanHexId.padStart(64, '0');
          const topic0 = contract.interface.getEvent('TransactionRecorded')?.topicHash;

          if (topic0) {
            const url = `${explorerApiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${this.financeContractAddress()}&topic0=${topic0}&topic1=${topic1}&apikey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === '1' && data.result && data.result.length > 0) {
              const txHash = data.result[0].transactionHash;
              return txHash;
            }
          }
        } catch (apiErr) {
          console.error('[Blockchain] Loi goi API Block Explorer, dang fallback ve RPC scan:', apiErr);
        }
      }

      const backupRpcUrls = this.getBackupRpcUrls(chainId);
      const rpcUrlsToTry = [this.rpcUrl(), ...backupRpcUrls].filter(url => !!url);

      let eventsFound: any[] = [];

      for (const rpcUrl of rpcUrlsToTry) {
        try {
          const backupProvider = new JsonRpcProvider(rpcUrl);
          const backupContract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, backupProvider);

          const currentBlock = await backupProvider.getBlockNumber();
          const currentTime = Math.floor(Date.now() / 1000);

          const blockTime = this.getAvgBlockTime(chainId);
          const timeDiff = currentTime - orderTimestamp;
          const blockDiff = Math.floor(timeDiff / blockTime);
          const approxBlock = currentBlock - blockDiff;

          const scanStart = Math.max(0, approxBlock - 5000);
          const scanEnd = Math.min(currentBlock, approxBlock + 5000);
          const chunkSize = 5000;

          const filter = backupContract.filters['TransactionRecorded'](finalTxId);
          let found = false;

          for (let start = scanStart; start <= scanEnd; start += chunkSize) {
            const end = Math.min(start + chunkSize - 1, scanEnd);
            try {
              const events = await backupContract.queryFilter(filter, start, end);
              if (events.length > 0) {
                eventsFound = events;
                found = true;
                break;
              }
            } catch {
              continue;
            }
          }

          if (found) break;
        } catch (rpcErr) {
          continue;
        }
      }

      if (eventsFound.length > 0) {
        return eventsFound[0].transactionHash;
      }

      return null;
    } catch (err) {
      console.error('[Blockchain] Loi tong quat khi truy van tx_hash goc thu chi:', err);
      return null;
    }
  }

  /**
   * Truy vấn danh sách ví Kế toán hiện tại trực tiếp từ Smart Contract Tài chính
   */
  public async getFinanceOwnersFromChain(): Promise<string[]> {
    this.provider = this.getBrowserProvider();
    if (!this.provider || !this.financeContractAddress()) return [];
    try {
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, this.provider);
      return await contract['getOwners']();
    } catch (e) {
      console.error('Loi doc danh sach finance owners tu chuoi:', e);
      return [];
    }
  }

  /**
   * Thêm các Owner ví kế toán khác trên Smart Contract Tài chính
   */
  public async addFinanceOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    return this.runContractWriteTx(
      this.financeContractAddress(),
      CAFE_WEB3_FINANCE_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner ví kế toán khác trên Smart Contract Tài chính
   */
  public async removeFinanceOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    return this.runContractWriteTx(
      this.financeContractAddress(),
      CAFE_WEB3_FINANCE_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Truy vấn danh sách NFT Voucher khả dụng của khách hàng trực tiếp từ Blockchain
   */
  public async getCustomerVouchersFromChain(customerAddress: string): Promise<any[]> {
    if (!this.voucherContractAddress() || this.voucherContractAddress().trim() === '') {
      return [];
    }

    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, activeProvider);

      // 1. Lấy toàn bộ danh sách Token ID của ví khách hàng bằng 1 cuộc gọi duy nhất
      const tokenIds = await contract['getTokensOfOwner'](customerAddress);
      if (!tokenIds || tokenIds.length === 0) {
        return [];
      }

      const vouchersList: any[] = [];

      // 2. Duyệt qua từng Token ID để lấy thông tin chi tiết
      for (const tokenId of tokenIds) {
        try {
          const tokenIdNum = Number(tokenId);
          const info = await contract['vouchers'](tokenIdNum);

          if (info && !info.isUsed) {
            const tokenUri = await contract['tokenURI'](tokenIdNum);
            const parts = tokenUri.split('/');
            const code = parts[parts.length - 1] || `NFT-${tokenIdNum}`;

            vouchersList.push({
              tokenId: tokenIdNum,
              code: code,
              discount_amount: Number(info.discountAmount),
              min_order_amount: Number(info.minOrderAmount),
              tokenUri: tokenUri,
              isNft: true,
              status: 'active'
            });
          }
        } catch (tokenErr) {
          console.warn(`[Blockchain] Lỗi đọc thông tin NFT Voucher ID ${tokenId}:`, tokenErr);
          // Tiếp tục xử lý các token tiếp theo nếu một token bị lỗi
        }
      }

      return vouchersList;
    } catch (err) {
      console.error('Lỗi lấy danh sách voucher NFT của khách hàng:', err);
      return [];
    }
  }

  /**
   * Truy vấn trực tiếp một NFT Voucher theo ID từ Blockchain không qua quét block events.
   */
  public async getSingleVoucherFromChain(tokenId: number): Promise<any | null> {
    if (!this.voucherContractAddress() || this.voucherContractAddress().trim() === '') {
      return null;
    }

    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, activeProvider);

      // 1. Kiểm tra chủ sở hữu
      const owner = await contract['ownerOf'](tokenId);

      // 2. Đọc thông tin chi tiết voucher
      const info = await contract['vouchers'](tokenId);

      if (info) {
        const tokenUri = await contract['tokenURI'](tokenId);
        const parts = tokenUri.split('/');
        const code = parts[parts.length - 1] || `NFT-${tokenId}`;

        return {
          tokenId: Number(tokenId),
          code: code,
          discount_amount: Number(info.discountAmount),
          min_order_amount: Number(info.minOrderAmount),
          tokenUri: tokenUri,
          isNft: true,
          status: info.isUsed ? 'used' : 'active',
          ownerAddress: owner
        };
      }
      return null;
    } catch (err) {
      console.error(`Lỗi đọc NFT Voucher ID ${tokenId} trực tiếp từ chain:`, err);
      return null;
    }
  }

  /**
   * Truy vấn danh sách đơn hàng phân trang trực tiếp từ Blockchain (POS Contract)
   */
  public async getOrdersPaginatedFromChain(page: number, limit: number): Promise<{ orders: any[], total: number }> {
    if (!this.contractAddress()) return { orders: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

      const res = await contract['getOrdersPaginated'](page, limit);
      const orders = res[0].map((o: any) => ({
        orderId: Number(o.orderId),
        orderCode: o.orderCode,
        tableNumber: o.tableNumber,
        totalAmount: Number(o.totalAmount),
        paymentMethod: o.paymentMethod,
        itemsSummary: o.itemsSummary,
        timestamp: Number(o.timestamp),
        recordedBy: o.recordedBy
      }));
      return { orders, total: Number(res[1]) };
    } catch (e) {
      console.error('Loi doc danh sach orders phan trang tu chuoi:', e);
      return { orders: [], total: 0 };
    }
  }

  /**
   * Truy vấn danh sách đơn hàng phân trang theo ví cashier trực tiếp từ Blockchain (POS Contract)
   */
  public async getUserOrdersPaginatedFromChain(user: string, page: number, limit: number): Promise<{ orders: any[], total: number }> {
    if (!this.contractAddress() || !user) return { orders: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

      const res = await contract['getUserOrdersPaginated'](user, page, limit);
      const orders = res[0].map((o: any) => ({
        orderId: Number(o.orderId),
        orderCode: o.orderCode,
        tableNumber: o.tableNumber,
        totalAmount: Number(o.totalAmount),
        paymentMethod: o.paymentMethod,
        itemsSummary: o.itemsSummary,
        timestamp: Number(o.timestamp),
        recordedBy: o.recordedBy
      }));
      return { orders, total: Number(res[1]) };
    } catch (e) {
      console.error('Loi doc danh sach orders phan trang theo vi tu chuoi:', e);
      return { orders: [], total: 0 };
    }
  }

  /**
   * Tìm kiếm đơn hàng theo mã đơn hàng trực tiếp từ Blockchain (POS Contract)
   */
  public async getOrderByCodeFromChain(orderCode: string): Promise<any | null> {
    if (!this.contractAddress() || !orderCode) return null;
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

      const o = await contract['getOrderByCode'](orderCode);
      return {
        orderId: Number(o.orderId),
        orderCode: o.orderCode,
        tableNumber: o.tableNumber,
        totalAmount: Number(o.totalAmount),
        paymentMethod: o.paymentMethod,
        itemsSummary: o.itemsSummary,
        timestamp: Number(o.timestamp),
        recordedBy: o.recordedBy
      };
    } catch (e) {
      console.warn('Khong tim thay don hang co ma:', orderCode, e);
      return null;
    }
  }

  /**
   * Truy vấn danh sách phiếu thu chi phân trang trực tiếp từ Blockchain (Finance Contract)
   */
  public async getTransactionsPaginatedFromChain(page: number, limit: number): Promise<{ transactions: any[], total: number }> {
    if (!this.financeContractAddress()) return { transactions: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

      const res = await contract['getTransactionsPaginated'](page, limit);
      const transactions = res[0].map((t: any) => ({
        txId: Number(t.txId),
        transactionCode: t.transactionCode,
        txType: t.txType === 1 ? 'thu' : 'chi',
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        timestamp: Number(t.timestamp),
        recordedBy: t.recordedBy
      }));
      return { transactions, total: Number(res[1]) };
    } catch (e) {
      console.error('Loi doc danh sach transactions phan trang tu chuoi:', e);
      return { transactions: [], total: 0 };
    }
  }

  /**
   * Truy vấn danh sách phiếu thu chi phân trang theo ví ghi nhận trực tiếp từ Blockchain (Finance Contract)
   */
  public async getUserTransactionsPaginatedFromChain(user: string, page: number, limit: number): Promise<{ transactions: any[], total: number }> {
    if (!this.financeContractAddress() || !user) return { transactions: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

      const res = await contract['getUserTransactionsPaginated'](user, page, limit);
      const transactions = res[0].map((t: any) => ({
        txId: Number(t.txId),
        transactionCode: t.transactionCode,
        txType: t.txType === 1 ? 'thu' : 'chi',
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        timestamp: Number(t.timestamp),
        recordedBy: t.recordedBy
      }));
      return { transactions, total: Number(res[1]) };
    } catch (e) {
      console.error('Loi doc danh sach transactions phan trang theo vi tu chuoi:', e);
      return { transactions: [], total: 0 };
    }
  }

  /**
   * Tìm kiếm phiếu thu chi theo mã trực tiếp từ Blockchain (Finance Contract)
   */
  public async getTransactionByCodeFromChain(txCode: string): Promise<any | null> {
    if (!this.financeContractAddress() || !txCode) return null;
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

      const t = await contract['getTransactionByCode'](txCode);
      return {
        txId: Number(t.txId),
        transactionCode: t.transactionCode,
        txType: t.txType === 1 ? 'thu' : 'chi',
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        timestamp: Number(t.timestamp),
        recordedBy: t.recordedBy
      };
    } catch (e) {
      console.warn('Khong tim thay giao dich co ma:', txCode, e);
      return null;
    }
  }

  /**
   * Tự động Deploy Smart Contract Menu Registry mới lên Blockchain EVM
   */
  public async deployMenuRegistryContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    this.provider = this.getBrowserProvider();
    if (!this.provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      this.provider = new BrowserProvider((window as any).ethereum);
      const signer = await this.provider.getSigner();
      const factory = new ContractFactory(CAFE_MENU_REGISTRY_ABI, CAFE_MENU_REGISTRY_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.menuRegistryContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy Menu Registry Contract:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract Menu Registry
   */
  public async getMenuRegistryOwnersFromChain(): Promise<string[]> {
    this.provider = this.getBrowserProvider();
    if (!this.provider || !this.menuRegistryContractAddress()) return [];
    try {
      const contract = new Contract(this.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, this.provider);
      return await contract['getOwners']();
    } catch (e) {
      console.error('Loi doc danh sach owners Menu Registry tu chuoi:', e);
      return [];
    }
  }

  /**
   * Thêm các Owner mới trên Smart Contract Menu Registry
   */
  public async addMenuRegistryOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }
    return this.runContractWriteTx(
      this.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner trên Smart Contract Menu Registry
   */
  public async removeMenuRegistryOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }
    return this.runContractWriteTx(
      this.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Kiểm tra xem địa chỉ ví có phải là Owner của Menu Registry không
   */
  public async checkIsOwnerOfMenuRegistry(address: string): Promise<boolean> {
    if (!this.menuRegistryContractAddress()) return false;
    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, activeProvider);
      return await contract['isOwner'](address);
    } catch (e) {
      console.error('Loi checkIsOwnerOfMenuRegistry:', e);
      return false;
    }
  }

  /**
   * Đồng bộ toàn bộ thực đơn món ăn lên Blockchain (Menu Registry Contract)
   */
  public async updateMenuOnChain(products: any[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }

    // Chuyển format sang struct Product của contract
    // Tối ưu hóa: Không gửi URL hình ảnh dài lên blockchain để tránh lỗi Out of Gas (tiết kiệm ~45% gas)
    // Sử dụng basePrice (giá nhỏ nhất của biến thể) gửi lên blockchain đồng bộ với logic so sánh
    const formattedProducts = products.map(p => {
      const basePrice = (p.variants && p.variants.length > 0)
        ? Math.min(...p.variants.map((v: any) => Number(v.price) || 0))
        : Number(p.price) || 0;
      return {
        sku: p.sku || '',
        name: p.name || '',
        price: BigInt(basePrice),
        image: '',
        status: p.status === undefined ? true : !!p.status
      };
    });

    return this.runContractWriteTx(
      this.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'updateMenu',
      [formattedProducts]
    );
  }

  /**
   * Tải toàn bộ danh sách thực đơn trực tiếp từ Blockchain (Menu Registry Contract)
   * Ưu tiên dùng getProductsPaginated() (contract mới) để an toàn với RPC,
   * fallback sang getAllProducts() nếu contract cũ chưa có hàm paginated.
   */
  public async getAllMenuProductsFromChain(): Promise<{ products: any[], lastUpdated: number }> {
    if (!this.menuRegistryContractAddress()) {
      return { products: [], lastUpdated: 0 };
    }

    try {
      const activeProvider = new JsonRpcProvider(this.rpcUrl());
      const contract = new Contract(this.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, activeProvider);

      const lastUpdatedRaw = await contract['lastUpdated']();

      // Thử dùng getProductsPaginated (contract mới) trước - an toàn hơn với RPC và số lượng lớn
      let allProducts: any[] = [];
      try {
        const total = Number(await contract['getProductsCount']());
        if (total === 0) {
          return { products: [], lastUpdated: Number(lastUpdatedRaw) * 1000 };
        }

        // Chunk 100 sản phẩm mỗi lần query để tránh timeout RPC
        const CHUNK_SIZE = 100;
        for (let offset = 0; offset < total; offset += CHUNK_SIZE) {
          const result = await contract['getProductsPaginated'](offset, CHUNK_SIZE);
          const chunk = result[0]; // tuple[0] = products
          for (const p of chunk) {
            allProducts.push({
              sku: p.sku,
              name: p.name,
              price: Number(p.price),
              image: p.image,
              status: p.status
            });
          }
        }
      } catch (paginatedErr) {
        // Fallback: contract cũ không có getProductsPaginated → dùng getAllProducts()
        console.warn('[MenuRegistry] getProductsPaginated không khả dụng, fallback sang getAllProducts():', paginatedErr);
        const rawProducts = await contract['getAllProducts']();
        allProducts = rawProducts.map((p: any) => ({
          sku: p.sku,
          name: p.name,
          price: Number(p.price),
          image: p.image,
          status: p.status
        }));
      }

      return {
        products: allProducts,
        lastUpdated: Number(lastUpdatedRaw) * 1000
      };
    } catch (e) {
      console.error('Loi doc thuc don onchain:', e);
      return { products: [], lastUpdated: 0 };
    }
  }

  /**
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract Voucher NFT
   */
  public async getVoucherOwnersFromChain(): Promise<string[]> {
    this.provider = this.getBrowserProvider();
    if (!this.provider || !this.voucherContractAddress()) return [];
    try {
      const contract = new Contract(this.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, this.provider);
      return await contract['getOwners']();
    } catch (e) {
      console.error('Loi doc danh sach voucher owners tu chuoi:', e);
      return [];
    }
  }

  /**
   * Thêm các Owner mới trên Smart Contract Voucher NFT
   */
  public async addVoucherOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.voucherContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher NFT!' };
    }
    return this.runContractWriteTx(
      this.voucherContractAddress(),
      CAFE_VOUCHER_NFT_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner trên Smart Contract Voucher NFT
   */
  public async removeVoucherOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.voucherContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher NFT!' };
    }
    return this.runContractWriteTx(
      this.voucherContractAddress(),
      CAFE_VOUCHER_NFT_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }
}

