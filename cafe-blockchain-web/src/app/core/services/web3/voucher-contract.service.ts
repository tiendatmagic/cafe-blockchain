import { Injectable } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider, formatEther, parseEther } from 'ethers';
import { BaseContractService } from './base-contract.service';
import { CAFE_VOUCHER_NFT_ABI } from '../voucher-contract-abi';
import { CAFE_VOUCHER_NFT_BYTECODE } from '../voucher-contract-bytecode';
import { CAFE_TOKEN_ABI } from '../cafe-token-abi';
import { CAFE_TOKEN_BYTECODE } from '../cafe-token-bytecode';
import { VOUCHER_SHOP_ABI } from '../voucher-shop-abi';
import { VOUCHER_SHOP_BYTECODE } from '../voucher-shop-bytecode';
import { VOUCHER_MARKETPLACE_ABI } from '../voucher-marketplace-abi';
import { VOUCHER_MARKETPLACE_BYTECODE } from '../voucher-marketplace-bytecode';

@Injectable({
  providedIn: 'root'
})
export class VoucherContractService extends BaseContractService {

  /**
   * Tự động Deploy Smart Contract NFT Voucher mới lên Blockchain EVM
   */
  public async deployVoucherContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const hasCorrectNetwork = await this.web3Service.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.web3Service.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const providerWithEth = new BrowserProvider((window as any).ethereum);
      const signer = await providerWithEth.getSigner();
      const factory = new ContractFactory(CAFE_VOUCHER_NFT_ABI, CAFE_VOUCHER_NFT_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.voucherContractAddress.set(newAddress);

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
   * Tự động Deploy Smart Contract CafeToken ($CAFE) mới lên Blockchain EVM
   */
  public async deployLoyaltyTokenContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const hasCorrectNetwork = await this.web3Service.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.web3Service.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const providerWithEth = new BrowserProvider((window as any).ethereum);
      const signer = await providerWithEth.getSigner();
      const factory = new ContractFactory(CAFE_TOKEN_ABI, CAFE_TOKEN_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.loyaltyTokenContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy CafeToken Contract:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Tự động Deploy Smart Contract VoucherShop mới lên Blockchain EVM
   */
  public async deployVoucherShopContractOnChain(
    targetChainId?: string,
    cafeToken?: string,
    voucherNft?: string
  ): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const tokenAddr = (cafeToken || this.web3Service.loyaltyTokenContractAddress() || '').trim();
    const nftAddr = (voucherNft || this.web3Service.voucherContractAddress() || '').trim();

    if (!tokenAddr.startsWith('0x') || tokenAddr.length !== 42) {
      return { contractAddress: '', success: false, error: 'Địa chỉ CafeToken ($CAFE) không hợp lệ!' };
    }
    if (!nftAddr.startsWith('0x') || nftAddr.length !== 42) {
      return { contractAddress: '', success: false, error: 'Địa chỉ Voucher NFT không hợp lệ!' };
    }

    const hasCorrectNetwork = await this.web3Service.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.web3Service.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const providerWithEth = new BrowserProvider((window as any).ethereum);
      const signer = await providerWithEth.getSigner();
      const factory = new ContractFactory(VOUCHER_SHOP_ABI, VOUCHER_SHOP_BYTECODE, signer);

      const contract = await factory.deploy(tokenAddr, nftAddr);
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.voucherShopContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy VoucherShop Contract:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Tự động Deploy Smart Contract VoucherMarketplace mới lên Blockchain EVM
   */
  public async deployVoucherMarketplaceContractOnChain(
    targetChainId?: string,
    cafeToken?: string,
    voucherNft?: string,
    feeRecipient?: string
  ): Promise<{ contractAddress: string; success: boolean; error?: string }> {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      return { contractAddress: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }
    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      return { contractAddress: '', success: false, error: 'Không tìm thấy provider ví Web3!' };
    }

    const tokenAddr = (cafeToken || this.web3Service.loyaltyTokenContractAddress() || '').trim();
    const nftAddr = (voucherNft || this.web3Service.voucherContractAddress() || '').trim();
    const recipientAddr = (feeRecipient || this.web3Service.currentAccount() || '').trim();

    if (!tokenAddr.startsWith('0x') || tokenAddr.length !== 42) {
      return { contractAddress: '', success: false, error: 'Địa chỉ CafeToken ($CAFE) không hợp lệ!' };
    }
    if (!nftAddr.startsWith('0x') || nftAddr.length !== 42) {
      return { contractAddress: '', success: false, error: 'Địa chỉ Voucher NFT không hợp lệ!' };
    }
    if (!recipientAddr.startsWith('0x') || recipientAddr.length !== 42) {
      return { contractAddress: '', success: false, error: 'Địa chỉ ví nhận phí không hợp lệ!' };
    }

    const hasCorrectNetwork = await this.web3Service.ensureCorrectNetwork(targetChainId);
    if (!hasCorrectNetwork) {
      return { contractAddress: '', success: false, error: this.web3Service.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const providerWithEth = new BrowserProvider((window as any).ethereum);
      const signer = await providerWithEth.getSigner();
      const factory = new ContractFactory(VOUCHER_MARKETPLACE_ABI, VOUCHER_MARKETPLACE_BYTECODE, signer);

      const contract = await factory.deploy(tokenAddr, nftAddr, recipientAddr);
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.voucherMarketplaceContractAddress.set(newAddress);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy VoucherMarketplace Contract:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
      };
    }
  }

  /**
   * Ký số thông điệp EIP-712 cho phép sử dụng Voucher NFT (Miễn phí Gas)
   */
  public async signVoucherUsageEIP712(tokenId: number, orderCode: string): Promise<string> {
    if (!this.web3Service.currentAccount()) {
      throw new Error('Chưa kết nối ví Web3!');
    }
    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      throw new Error('Không tìm thấy provider ví Web3!');
    }

    const signer = await provider.getSigner();
    const chainId = await provider.getNetwork().then(n => n.chainId);

    const domain = {
      name: 'CafeVoucher',
      version: '1',
      chainId: chainId,
      verifyingContract: this.web3Service.voucherContractAddress()
    };

    const types = {
      UseVoucher: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'orderCode', type: 'string' }
      ]
    };

    const value = {
      tokenId: tokenId,
      orderCode: orderCode
    };

    return await signer.signTypedData(domain, types, value);
  }

  /**
   * Truy vấn danh sách NFT Voucher khả dụng của khách hàng trực tiếp từ Blockchain
   */
  public async getCustomerVouchersFromChain(customerAddress: string): Promise<any[]> {
    if (!this.web3Service.voucherContractAddress() || this.web3Service.voucherContractAddress().trim() === '') {
      return [];
    }

    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, activeProvider);

      const tokenIds = await contract['getTokensOfOwner'](customerAddress);
      if (!tokenIds || tokenIds.length === 0) {
        return [];
      }

      const vouchersList: any[] = [];
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
        }
      }

      return vouchersList;
    } catch (err) {
      console.error('Lỗi lấy danh sách voucher NFT của khách hàng:', err);
      return [];
    }
  }

  /**
   * Truy vấn trực tiếp một NFT Voucher theo ID từ Blockchain
   */
  public async getSingleVoucherFromChain(tokenId: number): Promise<any | null> {
    if (!this.web3Service.voucherContractAddress() || this.web3Service.voucherContractAddress().trim() === '') {
      return null;
    }

    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, activeProvider);

      const owner = await contract['ownerOf'](tokenId);
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
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract Voucher NFT
   */
  public async getVoucherOwnersFromChain(): Promise<string[]> {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.voucherContractAddress()) return [];
    try {
      const contract = new Contract(this.web3Service.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, provider);
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
    if (!this.web3Service.voucherContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher NFT!' };
    }
    return this.runContractWriteTx(
      this.web3Service.voucherContractAddress(),
      CAFE_VOUCHER_NFT_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner trên Smart Contract Voucher NFT
   */
  public async removeVoucherOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.voucherContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher NFT!' };
    }
    return this.runContractWriteTx(
      this.web3Service.voucherContractAddress(),
      CAFE_VOUCHER_NFT_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Lấy số dư CafeToken ($CAFE) của một ví khách hàng
   */
  public async getCafeTokenBalance(account: string): Promise<string> {
    if (!this.web3Service.loyaltyTokenContractAddress()) return '0.00';
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.loyaltyTokenContractAddress(), CAFE_TOKEN_ABI, activeProvider);
      const balanceObj = await contract['balanceOf'](account);
      return parseFloat(formatEther(balanceObj)).toFixed(2);
    } catch (e) {
      console.error('Lỗi lấy số dư token $CAFE:', e);
      return '0.00';
    }
  }

  /**
   * Truy vấn danh sách các loại voucher đổi bằng điểm từ VoucherShop contract
   */
  public async getVoucherTypesFromShop(): Promise<any[]> {
    if (!this.web3Service.voucherShopContractAddress()) return [];
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.voucherShopContractAddress(), VOUCHER_SHOP_ABI, activeProvider);
      const rawTypes = await contract['getVoucherTypes']();
      return rawTypes.map((v: any) => ({
        id: Number(v.id),
        discountAmount: Number(v.discountAmount),
        minOrderAmount: Number(v.minOrderAmount),
        priceInCafeToken: parseFloat(formatEther(v.priceInCafeToken)),
        tokenURI: v.tokenURI,
        isActive: v.isActive
      }));
    } catch (e) {
      console.error('Lỗi lấy danh sách voucher types từ Shop:', e);
      return [];
    }
  }

  /**
   * Đổi điểm lấy Voucher NFT tại Voucher Shop của quán
   */
  public async buyVoucherFromShop(voucherTypeId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.voucherShopContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher Shop!' };
    }
    if (!this.web3Service.loyaltyTokenContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng token $CAFE!' };
    }

    try {
      const approveAmount = parseEther(priceInCafeToken);
      const approveResult = await this.runContractWriteTx(
        this.web3Service.loyaltyTokenContractAddress(),
        CAFE_TOKEN_ABI,
        'approve',
        [this.web3Service.voucherShopContractAddress(), approveAmount]
      );

      if (!approveResult.success) {
        return { txHash: '', success: false, error: 'Phê duyệt chi tiêu token thất bại: ' + approveResult.error };
      }

      return this.runContractWriteTx(
        this.web3Service.voucherShopContractAddress(),
        VOUCHER_SHOP_ABI,
        'buyVoucher',
        [voucherTypeId]
      );
    } catch (err: any) {
      return { txHash: '', success: false, error: err.message || 'Lỗi quy đổi voucher.' };
    }
  }

  /**
   * Truy vấn danh sách các voucher đang treo bán trên Marketplace
   */
  public async getActiveListingsFromMarket(): Promise<any[]> {
    if (!this.web3Service.voucherMarketplaceContractAddress()) return [];
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.voucherMarketplaceContractAddress(), VOUCHER_MARKETPLACE_ABI, activeProvider);
      const rawListings = await contract['getActiveListings']();
      
      const nftContract = new Contract(this.web3Service.voucherContractAddress(), CAFE_VOUCHER_NFT_ABI, activeProvider);
      
      const promises = rawListings.map(async (l: any) => {
        const tokenId = Number(l.tokenId);
        let discountAmount = 0;
        let minOrderAmount = 0;
        try {
          const vInfo = await nftContract['vouchers'](tokenId);
          discountAmount = Number(vInfo.discountAmount);
          minOrderAmount = Number(vInfo.minOrderAmount);
        } catch {
          // Bỏ qua lỗi
        }

        return {
          tokenId: tokenId,
          seller: l.seller,
          price: parseFloat(formatEther(l.price)),
          discountAmount: discountAmount,
          minOrderAmount: minOrderAmount,
          isActive: l.isActive
        };
      });

      return await Promise.all(promises);
    } catch (e) {
      console.error('Lỗi lấy danh sách listing từ Market:', e);
      return [];
    }
  }

  /**
   * Ký gửi và Treo bán NFT Voucher lên Marketplace của khách hàng
   */
  public async listVoucherOnMarket(tokenId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.voucherMarketplaceContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Marketplace!' };
    }
    if (!this.web3Service.voucherContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Voucher NFT!' };
    }

    try {
      const approveResult = await this.runContractWriteTx(
        this.web3Service.voucherContractAddress(),
        CAFE_VOUCHER_NFT_ABI,
        'approve',
        [this.web3Service.voucherMarketplaceContractAddress(), tokenId]
      );

      if (!approveResult.success) {
        return { txHash: '', success: false, error: 'Phê duyệt NFT thất bại: ' + approveResult.error };
      }

      const priceWei = parseEther(priceInCafeToken);
      return this.runContractWriteTx(
        this.web3Service.voucherMarketplaceContractAddress(),
        VOUCHER_MARKETPLACE_ABI,
        'listVoucher',
        [tokenId, priceWei]
      );
    } catch (err: any) {
      return { txHash: '', success: false, error: err.message || 'Lỗi treo bán NFT.' };
    }
  }

  /**
   * Mua Voucher NFT của khách hàng khác trên Marketplace
   */
  public async buyVoucherFromMarket(tokenId: number, priceInCafeToken: string): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.voucherMarketplaceContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Marketplace!' };
    }
    if (!this.web3Service.loyaltyTokenContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng token $CAFE!' };
    }

    try {
      const approveAmount = parseEther(priceInCafeToken);
      const approveResult = await this.runContractWriteTx(
        this.web3Service.loyaltyTokenContractAddress(),
        CAFE_TOKEN_ABI,
        'approve',
        [this.web3Service.voucherMarketplaceContractAddress(), approveAmount]
      );

      if (!approveResult.success) {
        return { txHash: '', success: false, error: 'Phê duyệt chi tiêu token thất bại: ' + approveResult.error };
      }

      return this.runContractWriteTx(
        this.web3Service.voucherMarketplaceContractAddress(),
        VOUCHER_MARKETPLACE_ABI,
        'buyVoucher',
        [tokenId]
      );
    } catch (err: any) {
      return { txHash: '', success: false, error: err.message || 'Lỗi mua voucher.' };
    }
  }

  /**
   * Hủy treo bán NFT Voucher và thu hồi về ví cá nhân
   */
  public async cancelListingOnMarket(tokenId: number): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.voucherMarketplaceContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Marketplace!' };
    }
    return this.runContractWriteTx(
      this.web3Service.voucherMarketplaceContractAddress(),
      VOUCHER_MARKETPLACE_ABI,
      'cancelListing',
      [tokenId]
    );
  }
}
