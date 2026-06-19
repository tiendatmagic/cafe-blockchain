import { Injectable, inject, signal, computed } from '@angular/core';
import { Web3Service } from '@core/services/web3.service';

@Injectable({
  providedIn: 'root'
})
export class PriceStore {
  private readonly web3Service = inject(Web3Service);

  // Giá VND của các coin từ CoinGecko (hoặc fallback mặc định)
  public readonly coingeckoPrices = signal<{
    tether: number;
    binancecoin: number;
    ethereum: number;
    'polygon-ecosystem-token': number;
    'avalanche-2': number;
  }>({
    tether: 25420,
    binancecoin: 15240000,
    ethereum: 92450000,
    'polygon-ecosystem-token': 12800,
    'avalanche-2': 890000
  });

  // Tự động nhận diện Token giá VND
  public readonly nativeTokenPriceVND = computed(() => {
    const symbol = this.web3Service.nativeTokenSymbol();
    const prices = this.coingeckoPrices();
    switch (symbol) {
      case 'ETH':
        return prices.ethereum || 92450000;
      case 'BNB':
        return prices.binancecoin || 15240000;
      case 'MATIC':
      case 'POL':
        return prices['polygon-ecosystem-token'] || 12800;
      case 'AVAX':
        return prices['avalanche-2'] || 890000;
      default:
        return prices.ethereum || 92450000;
    }
  });

  // Tỷ giá USDT/VND
  public readonly usdtPriceVND = computed(() => {
    return this.coingeckoPrices().tether || 25420;
  });

  /**
   * Tải giá coin thực tế từ CoinGecko có cache
   */
  public loadCoinPrices() {
    const cacheKey = 'coin_prices_cache';
    const cacheTTL = 10 * 60 * 1000; // 10 phút
    const now = Date.now();

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.timestamp && now - parsed.timestamp < cacheTTL) {
            this.coingeckoPrices.set(parsed.prices);
            return;
          }
        } catch (e) {
          console.error('[Prices] Error parsing cache:', e);
        }
      }
    }

    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,ethereum,tether,polygon-ecosystem-token,avalanche-2&vs_currencies=vnd';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const newPrices = {
            tether: data.tether?.vnd || this.coingeckoPrices().tether,
            binancecoin: data.binancecoin?.vnd || this.coingeckoPrices().binancecoin,
            ethereum: data.ethereum?.vnd || this.coingeckoPrices().ethereum,
            'polygon-ecosystem-token': data['polygon-ecosystem-token']?.vnd || this.coingeckoPrices()['polygon-ecosystem-token'],
            'avalanche-2': data['avalanche-2']?.vnd || this.coingeckoPrices()['avalanche-2']
          };
          this.coingeckoPrices.set(newPrices);

          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({
              prices: newPrices,
              timestamp: now
            }));
          }
        }
      })
      .catch(err => {
        console.warn('[Prices] CoinGecko API error, fallback to cache or defaults:', err);
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              this.coingeckoPrices.set(parsed.prices);
            } catch (e) {}
          }
        }
      });
  }
}
