import { Injectable, signal, computed } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, formatEther, parseEther } from 'ethers';
import { CAFE_WEB3_POS_ABI } from './contract-abi';
import { CAFE_WEB3_POS_BYTECODE } from './contract-bytecode';
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
  public readonly rpcUrl = signal<string>('https://ethereum-sepolia.publicnode.com');
  public readonly explorerUrl = signal<string>('https://sepolia.etherscan.io');
  public readonly configuredChainId = signal<string>('11155111');

  // Địa chỉ ví rút gọn
  public readonly shortAddress = computed(() => {
    const addr = this.currentAccount();
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
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

  private provider: BrowserProvider | null = null;

  constructor() {
    this.checkWalletConnection();
    this.listenToWalletChanges();
  }

  /**
   * Cập nhật cấu hình Blockchain từ API
   */
  public updateConfig(config: { contract_address?: string, rpc_url?: string, explorer_url?: string, chain_id?: string }) {
    this.contractAddress.set(config.contract_address || '');
    if (config.rpc_url) this.rpcUrl.set(config.rpc_url);
    if (config.explorer_url) this.explorerUrl.set(config.explorer_url);
    if (config.chain_id) this.configuredChainId.set(config.chain_id);

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
   * Ghi nhận đơn hàng lên Smart Contract Blockchain
   */
  public async recordOrderOnChain(
    orderId: number,
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
}
