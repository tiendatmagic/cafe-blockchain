import { Injectable } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider } from 'ethers';
import { BaseContractService } from './base-contract.service';
import { CAFE_WEB3_POS_ABI } from '../contract-abi';
import { CAFE_WEB3_POS_BYTECODE } from '../contract-bytecode';
import { CAFE_MENU_REGISTRY_ABI } from '../menu-registry-contract-abi';
import { CAFE_MENU_REGISTRY_BYTECODE } from '../menu-registry-contract-bytecode';

@Injectable({
  providedIn: 'root'
})
export class PosContractService extends BaseContractService {

  /**
   * Tự động Deploy Smart Contract POS mới lên Blockchain EVM
   */
  public async deployContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
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
      const factory = new ContractFactory(CAFE_WEB3_POS_ABI, CAFE_WEB3_POS_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.contractAddress.set(newAddress);
      this.web3Service.isOwnerContract.set(true);

      return {
        contractAddress: newAddress,
        success: true
      };
    } catch (err: any) {
      console.error('Loi deploy Smart Contract POS:', err);
      return {
        contractAddress: '',
        success: false,
        error: err.reason || err.message || 'Giao dịch deploy bị từ chối hoặc lỗi chuỗi.'
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
    const finalOrderId = typeof orderId === 'string' ? this.web3Service.convertUuidToUint256(orderId) : orderId;
    return this.runContractWriteTx(
      this.web3Service.contractAddress(),
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
      this.web3Service.contractAddress(),
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
      this.web3Service.contractAddress(),
      CAFE_WEB3_POS_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract
   */
  public async getOwnersFromChain(): Promise<string[]> {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.contractAddress()) return [];
    try {
      const contract = new Contract(this.web3Service.contractAddress(), CAFE_WEB3_POS_ABI, provider);
      return await contract['getOwners']();
    } catch (e) {
      console.error('Loi doc danh sach owners tu chuoi:', e);
      return [];
    }
  }

  /**
   * Truy vấn tx_hash gốc của đơn hàng đã tồn tại trên Blockchain.
   */
  public async getOriginalTxHashForOrder(orderId: string | number): Promise<string | null> {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.contractAddress()) return null;
    try {
      const contract = new Contract(this.web3Service.contractAddress(), CAFE_WEB3_POS_ABI, provider);
      const finalOrderId = typeof orderId === 'string' ? this.web3Service.convertUuidToUint256(orderId) : orderId;

      let orderTimestamp = 0;
      try {
        const orderData = await contract['getOrder'](finalOrderId);
        if (!orderData || Number(orderData[0]) === 0) {
          console.warn('[Blockchain] Order', finalOrderId, 'khong ton tai tren Smart Contract.');
          return null;
        }
        orderTimestamp = Number(orderData[6]);
      } catch {
        console.warn('[Blockchain] Khong the goi getOrder() - order co the khong ton tai.');
        return null;
      }

      const chainId = this.web3Service.chainId() || this.web3Service.configuredChainId();

      const explorerApiUrl = this.web3Service.getExplorerApiUrl(chainId);
      const apiKey = this.web3Service.explorerApiKey();
      if (explorerApiUrl) {
        try {
          const cleanHexId = typeof finalOrderId === 'string' ? finalOrderId.replace('0x', '') : finalOrderId.toString(16);
          const topic1 = '0x' + cleanHexId.padStart(64, '0');
          const topic0 = contract.interface.getEvent('OrderRecorded')?.topicHash;

          if (topic0) {
            let url = `${explorerApiUrl}?chainid=${chainId}&module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${this.web3Service.contractAddress()}&topic0=${topic0}&topic1=${topic1}`;
            if (apiKey && apiKey.trim() !== '') {
              url += `&apikey=${apiKey}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === '1' && data.result && data.result.length > 0) {
              return data.result[0].transactionHash;
            }
          }
        } catch (apiErr) {
          console.error('[Blockchain] Explorer API Error:', apiErr);
        }
      }

      return null;
    } catch (err) {
      console.error('[Blockchain] Loi lay txHash don hang:', err);
      return null;
    }
  }

  /**
   * Truy vấn danh sách đơn hàng phân trang trực tiếp từ Blockchain (POS Contract)
   */
  public async getOrdersPaginatedFromChain(page: number, limit: number): Promise<{ orders: any[], total: number }> {
    if (!this.web3Service.contractAddress()) return { orders: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

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
    if (!this.web3Service.contractAddress() || !user) return { orders: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

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
    if (!this.web3Service.contractAddress() || !orderCode) return null;
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.contractAddress(), CAFE_WEB3_POS_ABI, activeProvider);

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
   * Tự động Deploy Smart Contract Menu Registry mới lên Blockchain EVM
   */
  public async deployMenuRegistryContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
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
      const factory = new ContractFactory(CAFE_MENU_REGISTRY_ABI, CAFE_MENU_REGISTRY_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.menuRegistryContractAddress.set(newAddress);

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
   * Kiểm tra xem địa chỉ ví có phải là Owner của Menu Registry không
   */
  public async checkIsOwnerOfMenuRegistry(address: string): Promise<boolean> {
    if (!this.web3Service.menuRegistryContractAddress()) return false;
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, activeProvider);
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
    if (!this.web3Service.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }

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
      this.web3Service.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'updateMenu',
      [formattedProducts]
    );
  }

  /**
   * Tải toàn bộ danh sách thực đơn trực tiếp từ Blockchain (Menu Registry Contract)
   */
  public async getAllMenuProductsFromChain(): Promise<{ products: any[], lastUpdated: number }> {
    if (!this.web3Service.menuRegistryContractAddress()) {
      return { products: [], lastUpdated: 0 };
    }

    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, activeProvider);

      const lastUpdatedRaw = await contract['lastUpdated']();
      let allProducts: any[] = [];
      try {
        const total = Number(await contract['getProductsCount']());
        if (total === 0) {
          return { products: [], lastUpdated: Number(lastUpdatedRaw) * 1000 };
        }

        const CHUNK_SIZE = 100;
        for (let offset = 0; offset < total; offset += CHUNK_SIZE) {
          const result = await contract['getProductsPaginated'](offset, CHUNK_SIZE);
          const chunk = result[0];
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
   * Truy vấn danh sách Owners hiện tại trực tiếp từ Smart Contract Menu Registry
   */
  public async getMenuRegistryOwnersFromChain(): Promise<string[]> {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.menuRegistryContractAddress()) return [];
    try {
      const contract = new Contract(this.web3Service.menuRegistryContractAddress(), CAFE_MENU_REGISTRY_ABI, provider);
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
    if (!this.web3Service.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }
    return this.runContractWriteTx(
      this.web3Service.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner trên Smart Contract Menu Registry
   */
  public async removeMenuRegistryOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.menuRegistryContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Menu Registry!' };
    }
    return this.runContractWriteTx(
      this.web3Service.menuRegistryContractAddress(),
      CAFE_MENU_REGISTRY_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }
}
