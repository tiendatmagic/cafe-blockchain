import { inject } from '@angular/core';
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
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

  /**
   * Hàm dùng chung đối soát lấy transactionHash gốc của một thực thể (Order hoặc Transaction) trên blockchain.
   * Tối ưu hóa hiệu năng: Ước lượng block thông minh, không dùng nhị phân, chỉ quét RPC Fallback cho giao dịch < 3 ngày.
   */
  protected async getOriginalTxHashWithFallback(params: {
    contractAddress: string;
    abi: any;
    eventName: string;
    finalId: string | number;
    targetTimestamp: number;
    configuredChainId: string | number;
    explorerApiKey: string;
    rpcUrl: string;
    backupRpcUrls: string[];
  }): Promise<string | null> {
    const {
      contractAddress,
      abi,
      eventName,
      finalId,
      targetTimestamp,
      configuredChainId,
      explorerApiKey,
      rpcUrl,
      backupRpcUrls
    } = params;

    // 1. Thử gọi qua Explorer API trước
    const explorerApiUrl = this.web3Service.getExplorerApiUrl(configuredChainId);
    if (explorerApiUrl) {
      try {
        const cleanHexId = typeof finalId === 'string' ? finalId.replace('0x', '') : finalId.toString(16);
        const topic1 = '0x' + cleanHexId.padStart(64, '0');
        
        // Tạo interface ảo để lấy topic0
        const tempContract = new Contract(contractAddress, abi);
        const topic0 = tempContract.interface.getEvent(eventName)?.topicHash;

        if (topic0) {
          let url = `${explorerApiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contractAddress}&topic0=${topic0}&topic1=${topic1}`;
          if (explorerApiKey && explorerApiKey.trim() !== '') {
            url += `&apikey=${explorerApiKey}`;
          }
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === '1' && data.result && data.result.length > 0) {
            return data.result[0].transactionHash;
          } else if (data.message === 'NOTOK' || data.status === '0') {
            console.warn('[Blockchain] Explorer API error response:', data.result || data.message);
          }
        }
      } catch (apiErr) {
        console.error('[Blockchain] Explorer API Error:', apiErr);
      }
    }

    // 2. RPC Fallback
    const rpcUrlsToTry = [rpcUrl, ...backupRpcUrls].filter(url => !!url);
    for (const currentRpc of rpcUrlsToTry) {
      try {
        const backupProvider = new JsonRpcProvider(currentRpc);
        
        let timestamp = targetTimestamp;
        if (timestamp === 0) {
          try {
            const backupContract = new Contract(contractAddress, abi, backupProvider);
            const getMethod = eventName === 'OrderRecorded' ? 'getOrder' : 'getTransaction';
            const data = await backupContract[getMethod](finalId);
            if (data && Number(data[0]) !== 0) {
              timestamp = Number(data[6]);
            }
          } catch (err) {
            console.warn(`[Blockchain] Khong the doc timestamp tu backup RPC ${currentRpc}:`, err);
            continue;
          }
        }

        if (timestamp === 0) {
          continue;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const threeDaysInSeconds = 3 * 24 * 3600;
        if (currentTime - timestamp > threeDaysInSeconds) {
          console.warn(`[Blockchain] Giao dich tai timestamp ${timestamp} da qua cu (> 3 ngay) tren ${currentRpc}. Bo qua RPC fallback.`);
          continue;
        }

        const currentBlock = await backupProvider.getBlockNumber();
        const blockTime = this.web3Service.getAvgBlockTime(configuredChainId);
        
        const timeDiff = currentTime - timestamp;
        const blockDiff = Math.floor(timeDiff / blockTime);
        const approxBlock = currentBlock - blockDiff;

        // Quét trong khoảng approxBlock +- 2000 block
        const fromBlock = Math.max(0, approxBlock - 2000);
        const toBlock = Math.min(currentBlock, approxBlock + 2000);

        const tempContract = new Contract(contractAddress, abi);
        const topic0 = tempContract.interface.getEvent(eventName)?.topicHash;
        const cleanHexId = typeof finalId === 'string' ? finalId.replace('0x', '') : finalId.toString(16);
        const topic1 = '0x' + cleanHexId.padStart(64, '0');

        const filter = {
          address: contractAddress,
          fromBlock: fromBlock,
          toBlock: toBlock,
          topics: [topic0 || null, topic1]
        };

        const events = await backupProvider.getLogs(filter);
        if (events && events.length > 0) {
          return events[0].transactionHash;
        }
      } catch (rpcErr) {
        console.warn(`[Blockchain] Fallback RPC error on ${currentRpc}:`, rpcErr);
        continue;
      }
    }

    return null;
  }
}
