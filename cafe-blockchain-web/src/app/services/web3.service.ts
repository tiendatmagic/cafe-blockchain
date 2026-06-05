import { Injectable, signal, computed } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { CAFE_WEB3_POS_ABI } from './contract-abi';
import { CAFE_WEB3_POS_BYTECODE } from './contract-bytecode';
import { CAFE_WEB3_FINANCE_ABI } from './finance-contract-abi';
import { CAFE_WEB3_FINANCE_BYTECODE } from './finance-contract-bytecode';
import { CAFE_VOUCHER_NFT_ABI } from './voucher-contract-abi';
import { CAFE_VOUCHER_NFT_BYTECODE } from './voucher-contract-bytecode';
import { Subject } from 'rxjs';

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
  public readonly rpcUrl = signal<string>('https://ethereum-sepolia.publicnode.com');
  public readonly explorerUrl = signal<string>('https://sepolia.etherscan.io');
  public readonly explorerApiKey = signal<string>('');
  public readonly configuredChainId = signal<string>('11155111');

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

  // Địa chỉ ví rút gọn
  public readonly shortAddress = computed(() => {
    const addr = this.currentAccount();
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
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
        return 'BNB Smart Chain (BSC)';
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

  constructor() {
    this.checkWalletConnection();
    this.listenToWalletChanges();
  }

  /**
   * Cập nhật cấu hình Blockchain từ API
   */
  public updateConfig(config: { contract_address?: string, finance_contract_address?: string, voucher_contract_address?: string, rpc_url?: string, explorer_url?: string, chain_id?: string, explorer_api_key?: string }) {
    this.contractAddress.set(config.contract_address || '');
    if (config.finance_contract_address !== undefined) this.financeContractAddress.set(config.finance_contract_address || '');
    if (config.voucher_contract_address !== undefined) this.voucherContractAddress.set(config.voucher_contract_address || '');
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
   * Kiểm tra xem ví đã được kết nối trước đó hay chưa
   */
  private async checkWalletConnection() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        this.provider = new BrowserProvider((window as any).ethereum);
        const accounts = await this.provider.listAccounts();
        if (accounts.length > 0) {
          const account = accounts[0].address;
          this.currentAccount.set(account);
          this.walletConnected.set(true);
          await this.updateBalanceAndStatus(account);
        }
      } catch (err) {
        console.error('Loi kiem tra ket noi vi:', err);
      }
    }
  }

  /**
   * Lắng nghe sự thay đổi tài khoản hoặc mạng trong ví
   */
  private listenToWalletChanges() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      
      eth.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          this.currentAccount.set(accounts[0]);
          this.walletConnected.set(true);
          await this.updateBalanceAndStatus(accounts[0]);
          this.accountsChanged$.next(accounts[0]);
        } else {
          this.resetWalletState();
          this.accountsChanged$.next('');
        }
      });

      eth.on('chainChanged', async (newChainId: string) => {
        this.provider = new BrowserProvider(eth);
        this.walletError.set('');
        this.chainId.set(BigInt(newChainId).toString());

        if (this.walletConnected() && this.currentAccount()) {
          await this.updateBalanceAndStatus(this.currentAccount());
        }
      });
    }
  }

  /**
   * Cập nhật số dư và kiểm tra xem ví có phải owner không
   */
  private async updateBalanceAndStatus(account: string) {
    if (!this.provider) return;
    try {
      // 1. Lấy số dư
      const balanceObj = await this.provider.getBalance(account);
      this.walletBalance.set(parseFloat(formatEther(balanceObj)).toFixed(4));

      // 2. Lấy chainId
      const network = await this.provider.getNetwork();
      this.chainId.set(network.chainId.toString());

      // 3. Kiểm tra xem có phải Owner của Smart Contract không
      if (!this.contractAddress() || this.contractAddress().trim() === '') {
        // Nếu chưa deploy contract, bất kỳ ví nào đã kết nối đều được coi là Admin/Owner để cấu hình & deploy
        this.isOwnerContract.set(true);
      } else {
        const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, this.provider);
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

  /**
   * Kết nối ví Web3
   */
  public async connectWallet(): Promise<boolean> {
    this.walletError.set('');
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      this.walletError.set('Vui lòng cài đặt ví Metamask để sử dụng tính năng Web3!');
      return false;
    }

    try {
      this.provider = new BrowserProvider((window as any).ethereum);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        this.currentAccount.set(account);
        this.walletConnected.set(true);
        await this.updateBalanceAndStatus(account);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Loi ket noi vi:', err);
      this.walletError.set(err.message || 'Lỗi kết nối ví Web3.');
      return false;
    }
  }

  /**
   * Đảm bảo ví đang kết nối đúng mạng được cấu hình.
   * Nếu sai mạng, sẽ tự động yêu cầu chuyển mạng hoặc thêm mạng mới vào ví.
   */
  public async ensureCorrectNetwork(targetChainId?: string): Promise<boolean> {
    this.walletError.set('');
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      this.walletError.set('Vui lòng cài đặt ví Metamask!');
      return false;
    }

    try {
      if (!this.walletConnected() || !this.currentAccount()) {
        const connected = await this.connectWallet();
        if (!connected) return false;
      }

      // Khởi tạo lại provider mới để xóa cache thông tin mạng cũ của Ethers v6!
      this.provider = new BrowserProvider((window as any).ethereum);

      const network = await this.provider.getNetwork();
      const chainIdToUse = targetChainId || this.configuredChainId();
      const configuredChain = BigInt(chainIdToUse);
      
      console.log('DEBUG ENSURE NETWORK:', {
        networkChainId: network.chainId.toString(),
        targetChainId: targetChainId,
        configuredChainIdSignal: this.configuredChainId(),
        chainIdToUse: chainIdToUse,
        isDifferent: network.chainId !== configuredChain
      });
      
      if (network.chainId !== configuredChain) {
        const chainIdHex = `0x${configuredChain.toString(16)}`;
        try {
          // Yêu cầu chuyển mạng
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          });
          
          // Khởi tạo lại provider sau khi chuyển mạng thành công
          this.provider = new BrowserProvider((window as any).ethereum);

          // Cập nhật lại số dư và trạng thái sau khi chuyển mạng thành công
          if (this.currentAccount()) {
            await this.updateBalanceAndStatus(this.currentAccount());
          }
          return true;
        } catch (switchError: any) {
          // Lỗi 4902 hoặc lỗi trong message: Mạng chưa được thêm vào ví
          const isNetworkNotAdded = switchError.code === 4902 || 
                                    switchError.data?.originalError?.code === 4902 ||
                                    switchError.message?.includes('wallet_switchEthereumChain') ||
                                    switchError.message?.includes('4902');
          
          if (isNetworkNotAdded) {
            try {
              const tokenSymbol = this.getNativeTokenSymbolByChainId(chainIdToUse);
              const netName = this.getNetworkNameByChainId(chainIdToUse);
              
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: chainIdHex,
                  chainName: netName || `Mạng EVM Custom (ID: ${chainIdToUse})`,
                  rpcUrls: [this.rpcUrl()],
                  blockExplorerUrls: [this.explorerUrl()],
                  nativeCurrency: {
                    name: tokenSymbol,
                    symbol: tokenSymbol,
                    decimals: 18
                  }
                }],
              });
              
              // Khởi tạo lại provider sau khi thêm mạng thành công
              this.provider = new BrowserProvider((window as any).ethereum);

              // Cập nhật lại số dư sau khi thêm và chuyển mạng thành công
              if (this.currentAccount()) {
                await this.updateBalanceAndStatus(this.currentAccount());
              }
              return true;
            } catch (addError: any) {
              console.error('Loi them mang vao vi:', addError);
              this.walletError.set('Không thể tự động thêm mạng mới vào ví của bạn!');
              return false;
            }
          } else {
            console.error('Loi chuyen mang:', switchError);
            this.walletError.set('Vui lòng chuyển ví sang mạng được cấu hình để tiếp tục!');
            return false;
          }
        }
      }
      return true;
    } catch (err: any) {
      console.error('Loi kiem tra mang:', err);
      this.walletError.set(err.message || 'Lỗi kiểm tra mạng lưới.');
      return false;
    }
  }

  /**
   * Ngắt kết nối ví (Client-side reset)
   */
  public disconnectWallet() {
    this.resetWalletState();
  }

  private resetWalletState() {
    this.currentAccount.set('');
    this.walletBalance.set('0.00');
    this.walletConnected.set(false);
    this.isOwnerContract.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_address');
    }
  }

  /**
   * Yêu cầu ví ký một thông điệp (Sign Message)
   */
  public async signMessage(message: string): Promise<string> {
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
   * Ghi nhận đơn hàng lên Smart Contract Blockchain
   */
  public async recordOrderOnChain(
    orderId: number,
    orderCode: string,
    tableNumber: string,
    totalAmount: number,
    paymentMethod: string,
    itemsSummary: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    if (!this.provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    // Đảm bảo đúng mạng trước khi tương tác contract
    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển sang đúng mạng được cấu hình!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, signer);

      // Kích hoạt giao dịch ghi đơn hàng
      const tx = await contract['recordOrder'](
        orderId,
        orderCode || '',
        tableNumber || 'Mang ve',
        Math.round(totalAmount), // Lưu trữ dạng số nguyên lớn (VND)
        paymentMethod,
        itemsSummary
      );

      return {
        txHash: tx.hash,
        success: true
      };

    } catch (err: any) {
      console.error('Loi ky giao dich blockchain:', err);
      return {
        txHash: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Thêm các Owner ví thu ngân khác trên Smart Contract
   */
  public async addOwnersOnChain(newOwners: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.provider) return { txHash: '', success: false, error: 'Chưa kết nối ví!' };

    // Đảm bảo đúng mạng trước khi tương tác contract
    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, signer);

      const tx = await contract['addOwners'](newOwners);
      return { txHash: tx.hash, success: true };
    } catch (err: any) {
      return { txHash: '', success: false, error: err.reason || err.message };
    }
  }

  /**
   * Xóa các Owner ví thu ngân khác trên Smart Contract
   */
  public async removeOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.provider) return { txHash: '', success: false, error: 'Chưa kết nối ví!' };

    // Đảm bảo đúng mạng trước khi tương tác contract
    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, signer);

      const tx = await contract['removeOwners'](ownersToRemove);
      return { txHash: tx.hash, success: true };
    } catch (err: any) {
      return { txHash: '', success: false, error: err.reason || err.message };
    }
  }

  /**
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract
   */
  public async getOwnersFromChain(): Promise<string[]> {
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
  public async getOriginalTxHashForOrder(orderId: number): Promise<string | null> {
    if (!this.provider || !this.contractAddress()) return null;
    try {
      const contract = new Contract(this.contractAddress(), CAFE_WEB3_POS_ABI, this.provider);

      // ===== BƯỚC 1: Xác minh đơn hàng tồn tại + lấy timestamp =====
      let orderTimestamp = 0;
      try {
        const orderData = await contract['getOrder'](orderId);
        if (!orderData || Number(orderData[0]) === 0) {
          console.warn('[Blockchain] Order', orderId, 'khong ton tai tren Smart Contract.');
          return null;
        }
        orderTimestamp = Number(orderData[6]); // timestamp field
        console.log('[Blockchain] Order', orderId, 'xac minh OK. Timestamp:', new Date(orderTimestamp * 1000).toISOString());
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
          const topic1 = '0x' + orderId.toString(16).padStart(64, '0');
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

          const filter = backupContract.filters['OrderRecorded'](orderId);
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
      case '97':        return 'https://api-testnet.bscscan.com/api';
      case '56':        return 'https://api.bscscan.com/api';
      case '1':         return 'https://api.etherscan.io/api';
      case '11155111':  return 'https://api-sepolia.etherscan.io/api';
      case '137':       return 'https://api.polygonscan.com/api';
      case '80002':     return 'https://api-amoy.polygonscan.com/api';
      case '42161':     return 'https://api.arbiscan.io/api';
      case '421614':    return 'https://api-sepolia.arbiscan.io/api';
      case '8453':      return 'https://api.basescan.org/api';
      case '84532':     return 'https://api-sepolia.basescan.org/api';
      case '10':        return 'https://api-optimistic.etherscan.io/api';
      case '11155420':  return 'https://api-sepolia-optimistic.etherscan.io/api';
      default:          return null;
    }
  }

  /**
   * Lấy danh sách backup RPC URL đáng tin cậy cho event log query và auto-switch.
   */
  private getBackupRpcUrls(chainId: string): string[] {
    const id = chainId.toString().trim();
    switch (id) {
      case '97':        return ['https://bnb-testnet.api.onfinality.io/public', 'https://bsc-testnet-rpc.publicnode.com', 'https://bsc-testnet.blockpi.network/v1/rpc/public'];
      case '56':        return ['https://bsc-rpc.publicnode.com', 'https://binance.llamarpc.com', 'https://rpc.ankr.com/bsc'];
      case '1':         return ['https://ethereum-rpc.publicnode.com', 'https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'];
      case '11155111':  return ['https://ethereum-sepolia-rpc.publicnode.com', 'https://sepolia.gateway.tenderly.co', 'https://rpc.ankr.com/eth_sepolia'];
      case '137':       return ['https://polygon-bor-rpc.publicnode.com', 'https://polygon.llamarpc.com', 'https://rpc.ankr.com/polygon'];
      case '80002':     return ['https://polygon-amoy-bor-rpc.publicnode.com', 'https://polygon-amoy.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/polygon_amoy'];
      case '42161':     return ['https://arbitrum-one-rpc.publicnode.com', 'https://arbitrum.llamarpc.com', 'https://rpc.ankr.com/arbitrum'];
      case '421614':    return ['https://arbitrum-sepolia-rpc.publicnode.com', 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/arbitrum_sepolia'];
      case '8453':      return ['https://base-rpc.publicnode.com', 'https://base.llamarpc.com', 'https://rpc.ankr.com/base'];
      case '84532':     return ['https://base-sepolia-rpc.publicnode.com', 'https://base-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/base_sepolia'];
      case '10':        return ['https://optimism-rpc.publicnode.com', 'https://optimism.llamarpc.com', 'https://rpc.ankr.com/optimism'];
      case '11155420':  return ['https://optimism-sepolia-rpc.publicnode.com', 'https://optimism-sepolia.blockpi.network/v1/rpc/public', 'https://rpc.ankr.com/optimism_sepolia'];
      default:          return [];
    }
  }

  /**
   * Lấy block time trung bình (giây) theo chain.
   */
  private getAvgBlockTime(chainId: string): number {
    switch (chainId) {
      case '56':
      case '97':        return 3;   // BSC ~3s
      case '137':
      case '80002':     return 2;   // Polygon ~2s
      case '1':
      case '11155111':  return 12;  // Ethereum ~12s
      default:          return 3;   // Default 3s
    }
  }



  /**
   * Tự động Deploy Smart Contract mới lên Blockchain EVM
   */
  public async deployContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
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
    txId: number,
    transactionCode: string,
    type: 'thu' | 'chi',
    amount: number,
    category: string,
    description: string
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.walletConnected() || !this.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    if (!this.provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển sang đúng mạng được cấu hình!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, signer);

      const txType = type === 'thu' ? 1 : 0;

      const tx = await contract['recordTransaction'](
        txId,
        transactionCode || '',
        txType,
        Math.round(amount),
        category,
        description || ''
      );

      return {
        txHash: tx.hash,
        success: true
      };

    } catch (err: any) {
      console.error('Loi ky giao dich blockchain thu chi:', err);
      return {
        txHash: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Truy vấn tx_hash gốc của giao dịch thu chi đã tồn tại trên Blockchain.
   */
  public async getOriginalTxHashForTransaction(txId: number): Promise<string | null> {
    if (!this.provider || !this.financeContractAddress()) return null;
    try {
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, this.provider);

      let orderTimestamp = 0;
      try {
        const txData = await contract['getTransaction'](txId);
        if (!txData || Number(txData[0]) === 0) {
          console.warn('[Blockchain] Transaction', txId, 'khong ton tai tren Smart Contract.');
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
          const topic1 = '0x' + txId.toString(16).padStart(64, '0');
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

          const filter = backupContract.filters['TransactionRecorded'](txId);
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
    if (!this.provider || !this.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví hoặc chưa cấu hình hợp đồng Tài chính!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, signer);

      const tx = await contract['addOwners'](newOwners);
      return { txHash: tx.hash, success: true };
    } catch (err: any) {
      return { txHash: '', success: false, error: err.reason || err.message };
    }
  }

  /**
   * Xóa các Owner ví kế toán khác trên Smart Contract Tài chính
   */
  public async removeFinanceOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.provider || !this.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví hoặc chưa cấu hình hợp đồng Tài chính!' };
    }

    const hasCorrectNetwork = await this.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await this.provider.getSigner();
      const contract = new Contract(this.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, signer);

      const tx = await contract['removeOwners'](ownersToRemove);
      return { txHash: tx.hash, success: true };
    } catch (err: any) {
      return { txHash: '', success: false, error: err.reason || err.message };
    }
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

      // 1. Đọc số dư NFT thực tế của ví khách hàng
      const balance = await contract['balanceOf'](customerAddress);
      const targetCount = Number(balance);
      if (targetCount === 0) {
        return [];
      }

      // 2. Quét ngược sự kiện Transfer theo từng chunk 99,000 blocks cho đến khi tìm đủ N tokens
      const currentBlock = await activeProvider.getBlockNumber();
      let toBlock = currentBlock;
      const chunkSize = 99000; // Giới hạn RPC < 100,000
      const maxScanBlocks = 1000000; // Quét tối đa 1 triệu block gần đây (~17 ngày)
      const limitBlock = Math.max(0, currentBlock - maxScanBlocks);

      const filter = contract.filters['Transfer'](null, customerAddress);
      const foundTokenIds = new Set<string>();

      while (toBlock > limitBlock && foundTokenIds.size < targetCount) {
        const fromBlock = Math.max(limitBlock, toBlock - chunkSize);
        try {
          const events = await contract.queryFilter(filter, fromBlock, toBlock);
          for (const event of events) {
            const ev = event as any;
            if (ev.args && ev.args[2]) {
              foundTokenIds.add(ev.args[2].toString());
            }
          }
        } catch (scanErr) {
          console.warn('[Blockchain] Loi quet chunk logs voucher:', scanErr);
          break; // Dừng quét nếu gặp sự cố RPC
        }
        toBlock = fromBlock - 1;
      }

      const tokenIds = Array.from(foundTokenIds);
      const vouchersList: any[] = [];

      // 3. Kiểm tra trạng thái hiện tại của từng token
      for (const tokenIdStr of tokenIds) {
        const tokenId = BigInt(tokenIdStr);
        try {
          const owner = await contract['ownerOf'](tokenId);
          
          if (owner.toLowerCase() === customerAddress.toLowerCase()) {
            const info = await contract['vouchers'](tokenId);
            
            if (info && !info.isUsed) {
              const tokenUri = await contract['tokenURI'](tokenId);
              const parts = tokenUri.split('/');
              const code = parts[parts.length - 1] || `NFT-${tokenId}`;

              vouchersList.push({
                tokenId: Number(tokenId),
                code: code,
                discount_amount: Number(info.discountAmount),
                min_order_amount: Number(info.minOrderAmount),
                tokenUri: tokenUri,
                isNft: true,
                status: 'active'
              });
            }
          }
        } catch (e) {
          // Token đã bị burn hoặc lỗi đọc
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
}
