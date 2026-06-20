import { Injectable } from '@angular/core';
import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider } from 'ethers';
import { BaseContractService } from './base-contract.service';
import { CAFE_WEB3_FINANCE_ABI } from '../finance-contract-abi';
import { CAFE_WEB3_FINANCE_BYTECODE } from '../finance-contract-bytecode';

@Injectable({
  providedIn: 'root'
})
export class FinanceContractService extends BaseContractService {

  /**
   * Tự động Deploy Smart Contract Tài chính mới lên Blockchain EVM
   */
  public async deployFinanceContractOnChain(targetChainId?: string): Promise<{ contractAddress: string; success: boolean; error?: string }> {
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
      const factory = new ContractFactory(CAFE_WEB3_FINANCE_ABI, CAFE_WEB3_FINANCE_BYTECODE, signer);

      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const newAddress = await contract.getAddress();
      this.web3Service.financeContractAddress.set(newAddress);

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
    if (!this.web3Service.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    const finalTxId = typeof txId === 'string' ? this.web3Service.convertUuidToUint256(txId) : txId;
    const txType = type === 'thu' ? 1 : 0;
    return this.runContractWriteTx(
      this.web3Service.financeContractAddress(),
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
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.financeContractAddress()) return null;
    try {
      const contract = new Contract(this.web3Service.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, provider);
      const finalTxId = typeof txId === 'string' ? this.web3Service.convertUuidToUint256(txId) : txId;

      let orderTimestamp = 0;
      try {
        const txData = await contract['getTransaction'](finalTxId);
        if (!txData || Number(txData[0]) === 0) {
          console.warn('[Blockchain] Transaction', finalTxId, 'khong ton tai tren Smart Contract.');
          return null;
        }
        orderTimestamp = Number(txData[6]);
      } catch {
        console.warn('[Blockchain] Khong the goi getTransaction() - transaction co the khong ton tai.');
        return null;
      }

      const chainId = this.web3Service.chainId() || this.web3Service.configuredChainId();

      const explorerApiUrl = this.web3Service.getExplorerApiUrl(chainId);
      const apiKey = this.web3Service.explorerApiKey();
      if (explorerApiUrl) {
        try {
          const cleanHexId = typeof finalTxId === 'string' ? finalTxId.replace('0x', '') : finalTxId.toString(16);
          const topic1 = '0x' + cleanHexId.padStart(64, '0');
          const topic0 = contract.interface.getEvent('TransactionRecorded')?.topicHash;

          if (topic0) {
            let url = `${explorerApiUrl}?chainid=${chainId}&module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${this.web3Service.financeContractAddress()}&topic0=${topic0}&topic1=${topic1}`;
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
      console.error('[Blockchain] Loi lay txHash giao dich thu chi:', err);
      return null;
    }
  }

  /**
   * Truy vấn danh sách ví Kế toán hiện tại trực tiếp từ Smart Contract Tài chính
   */
  public async getFinanceOwnersFromChain(): Promise<string[]> {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !this.web3Service.financeContractAddress()) return [];
    try {
      const contract = new Contract(this.web3Service.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, provider);
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
    if (!this.web3Service.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    return this.runContractWriteTx(
      this.web3Service.financeContractAddress(),
      CAFE_WEB3_FINANCE_ABI,
      'addOwners',
      [newOwners]
    );
  }

  /**
   * Xóa các Owner ví kế toán khác trên Smart Contract Tài chính
   */
  public async removeFinanceOwnersOnChain(ownersToRemove: string[]): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.financeContractAddress()) {
      return { txHash: '', success: false, error: 'Chưa cấu hình hợp đồng Tài chính!' };
    }
    return this.runContractWriteTx(
      this.web3Service.financeContractAddress(),
      CAFE_WEB3_FINANCE_ABI,
      'removeOwners',
      [ownersToRemove]
    );
  }

  /**
   * Truy vấn danh sách phiếu thu chi phân trang trực tiếp từ Blockchain (Finance Contract)
   */
  public async getTransactionsPaginatedFromChain(page: number, limit: number): Promise<{ transactions: any[], total: number }> {
    if (!this.web3Service.financeContractAddress()) return { transactions: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

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
    if (!this.web3Service.financeContractAddress() || !user) return { transactions: [], total: 0 };
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

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
    if (!this.web3Service.financeContractAddress() || !txCode) return null;
    try {
      const activeProvider = new JsonRpcProvider(this.web3Service.rpcUrl());
      const contract = new Contract(this.web3Service.financeContractAddress(), CAFE_WEB3_FINANCE_ABI, activeProvider);

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
