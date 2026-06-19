import { inject } from '@angular/core';
import { BrowserProvider, Contract } from 'ethers';
import { Web3Service } from '../web3.service';

export abstract class BaseContractService {
  protected readonly web3Service = inject(Web3Service);

  /**
   * Helper chạy giao dịch ghi (write) contract, xử lý kết nối, mạng lưới và bắt lỗi tập trung
   */
  protected async runContractWriteTx(
    contractAddress: string,
    abi: any,
    methodName: string,
    args: any[]
  ): Promise<{ txHash: string; success: boolean; error?: string }> {
    if (!this.web3Service.walletConnected() || !this.web3Service.currentAccount()) {
      return { txHash: '', success: false, error: 'Chưa kết nối ví Web3!' };
    }

    const provider = this.web3Service.getBrowserProvider();
    if (!provider) {
      return { txHash: '', success: false, error: 'Không tìm thấy provider ví!' };
    }

    const hasCorrectNetwork = await this.web3Service.ensureCorrectNetwork();
    if (!hasCorrectNetwork) {
      return { txHash: '', success: false, error: this.web3Service.walletError() || 'Vui lòng chuyển mạng!' };
    }

    try {
      const signer = await provider.getSigner();
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
        error: this.web3Service.translateBlockchainError(err)
      };
    }
  }

  /**
   * Helper đọc (read) dữ liệu từ contract
   */
  protected getReadOnlyContract(contractAddress: string, abi: any): Contract | null {
    const provider = this.web3Service.getBrowserProvider();
    if (!provider || !contractAddress) return null;
    return new Contract(contractAddress, abi, provider);
  }
}
