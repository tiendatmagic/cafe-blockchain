import {
  Component,
  inject,
  signal,
  OnInit,
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { ApiService } from '@core/services/api.service';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { Contract, JsonRpcProvider, formatEther } from 'ethers';
import { CAFE_VOUCHER_NFT_ABI } from '@core/services/voucher-contract-abi';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, Web3ConnectPromptComponent, TabGroupComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './marketplace.component.html',
})
export class MarketplaceComponent implements OnInit {
  public readonly parseFloat = parseFloat;
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);

  // Tab: 'shop' (Đổi Voucher) | 'market' (Chợ giao dịch) | 'my-vouchers' (Voucher của tôi)
  public readonly activeTab = signal<'shop' | 'market' | 'my-vouchers'>('shop');

  // Tab options cho TabGroupComponent
  public readonly tabOptions: TabOption[] = [
    { value: 'shop', label: 'Đổi Voucher', icon: 'gift' },
    { value: 'market', label: 'Chợ Giao Dịch', icon: 'ticket' },
    { value: 'my-vouchers', label: 'Voucher của tôi', icon: 'wallet' },
  ];

  // Dữ liệu từ Blockchain
  public readonly cafeTokenBalance = signal<string>('0.00');
  public readonly shopVouchers = signal<any[]>([]); // Voucher của quán bán
  public readonly marketListings = signal<any[]>([]); // Voucher đang treo bán trên chợ
  public readonly myNFTVouchers = signal<any[]>([]); // Voucher ví hiện tại sở hữu

  // Loading Status
  public readonly isLoadingData = signal<boolean>(false);
  public readonly isActionPending = signal<boolean>(false);

  // Quản lý Modal treo bán
  public readonly isListModalOpen = signal<boolean>(false);
  public readonly listingTokenId = signal<number | null>(null);
  public readonly listingPrice = signal<string>('');

  // Computed stats cho Hero Banner
  public readonly totalOwnedNFTs = computed(() => this.myNFTVouchers().length);
  public readonly totalMarketListings = computed(() => this.marketListings().length);

  // Gradients palette cho NFT card art
  private readonly CARD_GRADIENTS = [
    'from-violet-500/80 via-fuchsia-400/60 to-pink-400/40',
    'from-blue-500/80 via-cyan-400/60 to-teal-400/40',
    'from-emerald-500/80 via-green-400/60 to-lime-400/40',
    'from-amber-500/80 via-orange-400/60 to-rose-400/40',
    'from-indigo-500/80 via-purple-400/60 to-pink-400/40',
    'from-rose-500/80 via-pink-400/60 to-fuchsia-400/40',
    'from-teal-500/80 via-emerald-400/60 to-cyan-400/40',
    'from-sky-500/80 via-blue-400/60 to-indigo-400/40',
  ];

  constructor() {
    // Tự động load lại dữ liệu khi kết nối ví thành công
    effect(() => {
      if (this.web3Service.walletConnected()) {
        this.refreshAllData();
      }
    });
  }

  public ngOnInit() {
    if (this.web3Service.walletConnected()) {
      this.refreshAllData();
    }
  }

  /**
   * Trả về class gradient dựa trên tokenId/index để tạo hiệu ứng generative art đa dạng
   */
  public getCardGradient(id: number): string {
    return this.CARD_GRADIENTS[id % this.CARD_GRADIENTS.length];
  }

  /**
   * Trả về góc rotation cho SVG pattern dựa trên id
   */
  public getPatternRotation(id: number): number {
    return (id * 37) % 360;
  }

  public onTabChange(tab: string) {
    this.setActiveTab(tab as 'shop' | 'market' | 'my-vouchers');
  }

  public async refreshAllData() {
    if (!this.web3Service.walletConnected()) return;
    this.isLoadingData.set(true);

    try {
      const address = this.web3Service.currentAccount();

      // 1. Lấy số dư CafeToken $CAFE
      const bal = await this.web3Service.getCafeTokenBalance(address);
      this.cafeTokenBalance.set(bal);

      // 2. Lấy dữ liệu từng tab tùy theo tab active
      await this.loadTabSpecificData();

      // 3. Pre-load thêm myNFTVouchers và marketListings cho Hero Stats
      if (this.activeTab() !== 'my-vouchers') {
        await this.loadMyNFTVouchers();
      }
      if (this.activeTab() !== 'market') {
        const list = await this.web3Service.getActiveListingsFromMarket();
        this.marketListings.set(list);
      }
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu Marketplace:', e);
    } finally {
      this.isLoadingData.set(false);
    }
  }

  public async loadTabSpecificData() {
    const tab = this.activeTab();
    if (tab === 'shop') {
      const list = await this.web3Service.getVoucherTypesFromShop();
      this.shopVouchers.set(list);
    } else if (tab === 'market') {
      const list = await this.web3Service.getActiveListingsFromMarket();
      this.marketListings.set(list);
    } else if (tab === 'my-vouchers') {
      await this.loadMyNFTVouchers();
    }
  }

  public async setActiveTab(tab: 'shop' | 'market' | 'my-vouchers') {
    this.activeTab.set(tab);
    this.isLoadingData.set(true);
    await this.loadTabSpecificData();
    this.isLoadingData.set(false);
  }

  /**
   * Tải danh sách NFT Voucher đang sở hữu trực tiếp từ contract ERC-721
   */
  public async loadMyNFTVouchers() {
    const address = this.web3Service.currentAccount();
    const nftContractAddress = this.web3Service.voucherContractAddress();
    const rpcUrl = this.web3Service.rpcUrl();

    if (!address || !nftContractAddress) {
      this.myNFTVouchers.set([]);
      return;
    }

    try {
      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(nftContractAddress, CAFE_VOUCHER_NFT_ABI, provider);

      // 1. Gọi hàm getTokensOfOwner để lấy danh sách IDs
      const rawIds = await contract['getTokensOfOwner'](address);
      const ids: number[] = rawIds.map((id: any) => Number(id));

      if (ids.length === 0) {
        this.myNFTVouchers.set([]);
        return;
      }

      // 2. Lấy chi tiết từng token song song
      const promises = ids.map(async (id) => {
        const info = await contract['vouchers'](id);
        return {
          tokenId: id,
          discountAmount: Number(info.discountAmount),
          minOrderAmount: Number(info.minOrderAmount),
          isUsed: info.isUsed,
        };
      });

      const list = await Promise.all(promises);
      // Chỉ giữ lại những voucher chưa sử dụng
      this.myNFTVouchers.set(list.filter((v) => !v.isUsed));
    } catch (e) {
      console.error('Lỗi lấy danh sách NFT Voucher của tôi:', e);
      this.myNFTVouchers.set([]);
    }
  }

  /**
   * Đổi điểm lấy Voucher tại Shop của Quán
   */
  public async exchangeVoucher(voucherType: any) {
    if (this.isActionPending()) return;

    const myBalance = parseFloat(this.cafeTokenBalance());
    if (myBalance < voucherType.priceInCafeToken) {
      this.stateService.showToast('Số dư token $CAFE không đủ để đổi voucher này!', 'error');
      return;
    }

    this.isActionPending.set(true);
    this.stateService.showToast('Vui lòng phê duyệt và xác nhận đổi voucher trên ví...', 'success');

    const res = await this.web3Service.buyVoucherFromShop(
      voucherType.id,
      voucherType.priceInCafeToken.toString(),
    );

    if (res.success && res.txHash) {
      this.stateService.showToast(`Đổi Voucher thành công! Giao dịch: ${res.txHash}`, 'success');
      await this.refreshAllData();
    } else {
      this.stateService.showToast(res.error || 'Quy đổi voucher thất bại!', 'error');
    }
    this.isActionPending.set(false);
  }

  /**
   * Mua Voucher của người khác trên Marketplace
   */
  public async purchaseFromMarket(listing: any) {
    if (this.isActionPending()) return;

    const myBalance = parseFloat(this.cafeTokenBalance());
    if (myBalance < listing.price) {
      this.stateService.showToast('Số dư token $CAFE không đủ để mua voucher này!', 'error');
      return;
    }

    this.isActionPending.set(true);
    this.stateService.showToast('Vui lòng phê duyệt và xác nhận mua voucher trên ví...', 'success');

    const res = await this.web3Service.buyVoucherFromMarket(
      listing.tokenId,
      listing.price.toString(),
    );

    if (res.success && res.txHash) {
      this.stateService.showToast(`Mua Voucher thành công! Giao dịch: ${res.txHash}`, 'success');
      await this.refreshAllData();
    } else {
      this.stateService.showToast(res.error || 'Mua voucher thất bại!', 'error');
    }
    this.isActionPending.set(false);
  }

  /**
   * Mở modal thiết lập giá treo bán
   */
  public openListModal(tokenId: number) {
    this.listingTokenId.set(tokenId);
    this.listingPrice.set('');
    this.isListModalOpen.set(true);
  }

  public closeListModal() {
    this.isListModalOpen.set(false);
    this.listingTokenId.set(null);
    this.listingPrice.set('');
  }

  /**
   * Gửi giao dịch treo bán NFT Voucher lên Marketplace
   */
  public async submitListing() {
    const tokenId = this.listingTokenId();
    const price = this.listingPrice().trim();

    if (tokenId === null || !price || isNaN(Number(price)) || Number(price) <= 0) {
      this.stateService.showToast('Vui lòng nhập giá treo bán hợp lệ!', 'error');
      return;
    }

    this.closeListModal();
    this.isActionPending.set(true);
    this.stateService.showToast(
      'Vui lòng phê duyệt NFT và xác nhận treo bán trên ví...',
      'success',
    );

    const res = await this.web3Service.listVoucherOnMarket(tokenId, price);

    if (res.success && res.txHash) {
      this.stateService.showToast(`Treo bán Voucher NFT #${tokenId} thành công!`, 'success');
      await this.refreshAllData();
    } else {
      this.stateService.showToast(res.error || 'Treo bán thất bại!', 'error');
    }
    this.isActionPending.set(false);
  }

  /**
   * Hủy treo bán NFT Voucher khỏi Marketplace
   */
  public async cancelListing(tokenId: number) {
    if (this.isActionPending()) return;

    this.isActionPending.set(true);
    this.stateService.showToast('Vui lòng xác nhận hủy bán trên ví...', 'success');

    const res = await this.web3Service.cancelListingOnMarket(tokenId);

    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Đã hủy bán Voucher NFT #${tokenId} thành công! NFT đã được hoàn trả về ví.`,
        'success',
      );
      await this.refreshAllData();
    } else {
      this.stateService.showToast(res.error || 'Hủy bán thất bại!', 'error');
    }
    this.isActionPending.set(false);
  }

  /**
   * Kiểm tra xem NFT tokenId này hiện tại có đang được treo bán bởi chính mình không
   */
  public isTokenListedByMe(tokenId: number, listingsList: any[]): boolean {
    const address = this.web3Service.currentAccount().toLowerCase();
    return listingsList.some((l) => l.tokenId === tokenId && l.seller.toLowerCase() === address);
  }

  public connectWallet() {
    this.web3Service.connectWallet().then((success) => {
      if (success) {
        this.refreshAllData();
      }
    });
  }
}
