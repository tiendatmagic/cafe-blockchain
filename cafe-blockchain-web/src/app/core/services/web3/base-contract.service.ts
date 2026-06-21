import { inject } from '@angular/core';
import { BrowserProvider, Contract, JsonRpcProvider, keccak256, toUtf8Bytes } from 'ethers';
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
   * Tìm kiếm block có timestamp gần nhất với targetTimestamp bằng thuật toán Binary Search
   */
  private async findBlockByTimestamp(
    targetTimestamp: number,
    provider: JsonRpcProvider,
    approxBlock: number,
    currentBlock: number
  ): Promise<number> {
    let low = 0;
    let high = currentBlock;
    
    // Thử dải hẹp trước để tối ưu hóa tốc độ và giảm số lượng request getBlock (khoảng +-100,000 block)
    const searchLow = Math.max(0, approxBlock - 100000);
    const searchHigh = Math.min(currentBlock, approxBlock + 100000);
    
    try {
      const [lowBlock, highBlock] = await Promise.all([
        provider.getBlock(searchLow),
        provider.getBlock(searchHigh)
      ]);
      
      if (lowBlock && highBlock) {
        const lowTime = Number(lowBlock.timestamp);
        const highTime = Number(highBlock.timestamp);
        if (targetTimestamp >= lowTime && targetTimestamp <= highTime) {
          low = searchLow;
          high = searchHigh;
          console.info(`[Blockchain] Binary Search gioi han trong phan vung hep: [${low}, ${high}]`);
        }
      }
    } catch (err) {
      console.warn('[Blockchain] Loi lay block tim kiem phan vung hep, fallback ve tim kiem toan dai:', err);
    }

    let iterations = 0;
    const maxIterations = 30; // Tránh loop vô tận

    while (low <= high && iterations < maxIterations) {
      iterations++;
      const mid = Math.floor((low + high) / 2);
      try {
        const block = await provider.getBlock(mid);
        if (!block) {
          high = mid - 1;
          continue;
        }
        const blockTime = Number(block.timestamp);
        if (blockTime === targetTimestamp) {
          return mid;
        } else if (blockTime < targetTimestamp) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      } catch (err) {
        high = mid - 1;
      }
    }
    
    return low;
  }

  /**
   * Hàm dùng chung đối soát lấy transactionHash gốc của một thực thể (Order hoặc Transaction) trên blockchain.
   * Tối ưu hóa hiệu năng bằng thuật toán Binary Search tìm kiếm block chính xác, quét logs khoảng cực hẹp.
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

    let hasRecordOnChain = false;
    if (targetTimestamp > 0) {
      hasRecordOnChain = true;
    }

    // Chuyển đổi ID (có thể là decimal string, hexadecimal string hoặc number) sang hex 32-byte chuẩn xác bằng BigInt
    let cleanHexId = '';
    let topic1 = '';
    try {
      const bigId = BigInt(finalId);
      cleanHexId = bigId.toString(16);
      topic1 = '0x' + cleanHexId.padStart(64, '0');
    } catch (err) {
      console.warn('[Blockchain] Khong the convert finalId sang BigInt, fallback dung string replace:', err);
      cleanHexId = typeof finalId === 'string' ? finalId.replace('0x', '') : finalId.toString(16);
      topic1 = '0x' + cleanHexId.padStart(64, '0');
    }

    // 1. Thử gọi qua Explorer API trước
    const explorerApiUrl = this.web3Service.getExplorerApiUrl(configuredChainId);
    if (explorerApiUrl) {
      try {
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
        try {
          const backupContract = new Contract(contractAddress, abi, backupProvider);
          const getMethod = eventName === 'OrderRecorded' ? 'getOrder' : 'getTransaction';
          const data = await backupContract[getMethod](finalId);
          if (data && Number(data[0]) !== 0) {
            hasRecordOnChain = true;
            if (timestamp === 0) {
              timestamp = Number(data[6]);
            }
          }
        } catch (err) {
          console.warn(`[Blockchain] Khong the doc record/timestamp tu backup RPC ${currentRpc}:`, err);
        }

        if (timestamp === 0) {
          continue;
        }

        const currentBlock = await backupProvider.getBlockNumber();
        const blockTime = this.web3Service.getAvgBlockTime(configuredChainId);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDiff = currentTime - timestamp;
        const blockDiff = Math.floor(timeDiff / blockTime);
        const approxBlock = currentBlock - blockDiff;

        // Tìm kiếm block chính xác qua Binary Search
        console.info(`[Blockchain] Dang tim block cho timestamp ${timestamp} bang Binary Search tren RPC ${currentRpc}...`);
        const exactBlock = await this.findBlockByTimestamp(timestamp, backupProvider, approxBlock, currentBlock);
        console.info(`[Blockchain] Ket qua Binary Search block: ${exactBlock} (approxBlock goc: ${approxBlock})`);

        // Quét logs trong khoảng cực kỳ hẹp xung quanh block tìm được (exactBlock ± 10 blocks)
        const fromBlock = Math.max(0, exactBlock - 10);
        const toBlock = Math.min(currentBlock, exactBlock + 10);

        const tempContract = new Contract(contractAddress, abi);
        const topic0 = tempContract.interface.getEvent(eventName)?.topicHash;

        console.info(`[Blockchain] Quet logs tu block ${fromBlock} den ${toBlock} tren RPC ${currentRpc} cho ID decimal ${finalId} (hex ${cleanHexId})...`);

        const filter = {
          address: contractAddress,
          fromBlock: fromBlock,
          toBlock: toBlock,
          topics: [topic0 || null, topic1]
        };

        const events = await backupProvider.getLogs(filter);
        if (events && events.length > 0) {
          console.info(`[Blockchain] Tim thay transactionHash that: ${events[0].transactionHash}`);
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
