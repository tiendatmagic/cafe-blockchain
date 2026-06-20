export const POPULAR_CHAINS = [
  { name: 'Arbitrum One Mainnet', chainId: '42161', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io' },
  { name: 'Base Mainnet', chainId: '8453', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org' },
  { name: 'BNB Smart Chain', chainId: '56', rpcUrl: 'https://bsc-dataseed.binance.org', explorerUrl: 'https://bscscan.com' },
  { name: 'Arbitrum Sepolia', chainId: '421614', rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc', explorerUrl: 'https://sepolia.arbiscan.io/' },
  { name: 'BSC Testnet', chainId: '97', rpcUrl: 'https://bsc-testnet-rpc.publicnode.com', explorerUrl: 'https://testnet.bscscan.com' },
];

/**
 * Lấy API URL của Block Explorer tương ứng với chainId.
 */
export function getExplorerApiUrl(chainId: string | number): string | null {
  const id = chainId.toString().trim();
  const supportedChains = ['97', '56', '1', '11155111', '137', '80002', '42161', '421614', '8453', '84532', '10', '11155420'];
  if (supportedChains.includes(id)) {
    return 'https://api.etherscan.io/v2/api';
  }
  return null;
}

/**
 * Lấy danh sách backup RPC URL đáng tin cậy cho event log query và auto-switch.
 */
export function getBackupRpcUrls(chainId: string | number): string[] {
  const id = chainId.toString().trim();
  switch (id) {
    case '97': return ['https://bsc-testnet-rpc.publicnode.com', 'https://bsc-testnet-rpc.publicnode.com', 'https://bsc-testnet.blockpi.network/v1/rpc/public'];
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
export function getAvgBlockTime(chainId: string | number): number {
  const id = chainId.toString().trim();
  switch (id) {
    case '56':
    case '97': return 3;   // BSC ~3s
    case '137':
    case '80002': return 2;   // Polygon ~2s
    case '1':
    case '11155111': return 12;  // Ethereum ~12s
    default: return 3;   // Default 3s
  }
}
