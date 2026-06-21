import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ShiftService } from '@core/services/shift.service';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { MiniButtonsComponent } from '@shared/components/mini-buttons/mini-buttons.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ModalService } from '@core/services/modal.service';
import { BarcodeScannerModalComponent } from '@shared/components/barcode-scanner-modal/barcode-scanner-modal.component';
import { VariantSelectModalComponent } from '../../components/variant-select-modal/variant-select-modal.component';
import { PosConfirmModalComponent } from '../../components/pos-confirm-modal/pos-confirm-modal.component';
import { SignQrModalComponent } from '../../components/sign-qr-modal/sign-qr-modal.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AccessRestrictedComponent,
    PaginationComponent,
    PageHeaderComponent,
    VNDCurrencyPipe,
    MiniButtonsComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pos.component.html',
})
export class PosComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly shiftService = inject(ShiftService);
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly modalService = inject(ModalService);

  private signQrModalRef: any = null;

  // Trạng thái quét barcode tại POS
  public readonly isBarcodeScannerOpen = signal<boolean>(false);
  public readonly isScannerLoading = signal<boolean>(false);
  public readonly scannerError = signal<string>('');
  private html5Qrcode: any = null;

  // Trạng thái quét QR ký số NFT Voucher
  public readonly showSignQrModal = signal<boolean>(false);
  public readonly showCancelSignConfirmModal = signal<boolean>(false);
  public readonly signQrCodeUrl = signal<string>('');
  public readonly signLink = signal<string>('');
  public readonly signOrderCode = signal<string>('');
  public readonly signTokenId = signal<number | null>(null);
  private signaturePollingInterval: any = null;

  // Hỗ trợ nhập ID NFT Voucher thủ công
  public readonly nftVoucherInputId = signal<string>('');
  public readonly isNftVoucherLoading = signal<boolean>(false);

  // Trạng thái UI cục bộ của POS
  public readonly isPaymentDropdownOpen = signal<boolean>(false);
  public readonly posCheckoutMode = signal<'quick' | 'confirm'>('quick');
  public readonly posCheckoutModeOptions: TabOption[] = [
    { value: 'quick', label: 'Nhanh', icon: 'bolt' },
    { value: 'confirm', label: 'Xác nhận', icon: 'check-circle' },
  ];
  public readonly isTableDropdownOpen = signal<boolean>(false);
  public readonly isPosConfirmModalOpen = signal<boolean>(false);
  public readonly customerCashGiven = signal<number>(0);
  public readonly isDebtPayment = signal<boolean>(false);
  public readonly posPaymentMethod = signal<
    'cash' | 'bank_transfer' | 'crypto' | 'e_wallet' | 'debt'
  >('cash');

  // Trạng thái chọn kích thước/biến thể
  public readonly activeSelectingProduct = signal<any>(null);
  public readonly selectedVariantForCart = signal<any>(null);
  public readonly isVariantSelectModalOpen = signal<boolean>(false);
  public readonly isFilterPanelOpen = signal<boolean>(false);
  public readonly isMobileCartOpen = signal<boolean>(false);

  // Trạng thái Tìm kiếm & Chọn Khách hàng tại POS
  public readonly posCustomerSearchQuery = signal<string>('');
  public readonly isCustomerDropdownOpen = signal<boolean>(false);
  public readonly posSearchedCustomers = signal<any[]>([]);
  public readonly isCustomerSearching = signal<boolean>(false);

  // Trạng thái Voucher tại POS
  public readonly posActiveVouchers = signal<any[]>([]);
  public readonly posSelectedVoucher = signal<any | null>(null);

  // Quản lý Ca làm việc (Mở ca)
  public readonly initialCashInput = signal<number>(0);
  public readonly initialCashFormatted = computed(() => {
    const val = this.initialCashInput();
    return val > 0 ? val.toLocaleString('en-US') : '';
  });

  public onInitialCashInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.initialCashInput.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  public startShift() {
    if (this.stateService.isLoading() || this.shiftService.isLoading()) return;
    const cash = this.initialCashInput();
    this.shiftService.openShift(cash, () => {
      this.initialCashInput.set(0);
    });
  }

  // Computed properties cho tổng tiền cuối cùng sau giảm giá
  public readonly posFinalTotal = computed(() => {
    const total = this.cartTotal();
    const voucher = this.posSelectedVoucher();
    if (!voucher) return total;
    return Math.max(0, total - voucher.discount_amount);
  });

  private customerSearchSubject = new Subject<string>();
  private customerSearchSubscription?: Subscription;

  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  public formatVoucherCode(code: string | undefined | null): string {
    if (!code) return '';
    if (code.startsWith('NFT-') && code.length > 15) {
      const parts = code.split('-');
      if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];
        return `NFT-...-${lastPart}`;
      }
    }
    return code;
  }

  public ngOnInit() {
    this.customerSearchSubscription = this.customerSearchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.performCustomerSearch(query);
      });
  }

  public ngOnDestroy() {
    if (this.customerSearchSubscription) {
      this.customerSearchSubscription.unsubscribe();
    }
    this.stopSignaturePolling();
    if (this.html5Qrcode && this.html5Qrcode.isScanning) {
      this.html5Qrcode.stop().catch((err: any) => console.error(err));
    }
  }

  public onCustomerSearchChange(query: string) {
    this.posCustomerSearchQuery.set(query);
    if (!query.trim()) {
      this.posSearchedCustomers.set([]);
      this.isCustomerDropdownOpen.set(false);
      this.isCustomerSearching.set(false);
      return;
    }
    this.isCustomerDropdownOpen.set(true);
    this.isCustomerSearching.set(true);
    this.customerSearchSubject.next(query);
  }

  private performCustomerSearch(query: string) {
    if (!query.trim()) {
      this.posSearchedCustomers.set([]);
      this.isCustomerSearching.set(false);
      return;
    }

    const cleanQuery = query.trim();

    // Kiểm tra nếu chuỗi bắt đầu bằng "0x" (dạng ví EVM) nhưng chưa đủ 42 ký tự
    // thì KHÔNG gọi API search, chờ người dùng nhập đủ
    const looksLikeEvmWallet = /^0x[a-fA-F0-9]*$/i.test(cleanQuery);
    if (looksLikeEvmWallet && cleanQuery.length < 42) {
      this.posSearchedCustomers.set([
        {
          id: -98,
          name: `Đang nhập ví EVM... (${cleanQuery.length}/42 ký tự)`,
          customer_code: 'CHỜ',
          is_pending_wallet: true,
        },
      ]);
      this.isCustomerSearching.set(false);
      return;
    }

    const isEvmWallet = /^0x[a-fA-F0-9]{40}$/.test(cleanQuery);

    this.apiService.getCustomers(cleanQuery, 15).subscribe({
      next: (res) => {
        const results = res || [];

        if (isEvmWallet) {
          const hasWallet = results.some(
            (c) => c.wallet_address && c.wallet_address.toLowerCase() === cleanQuery.toLowerCase(),
          );
          if (!hasWallet) {
            const autoCreateOption = {
              id: -99,
              name: `Khách ví Web3 (${cleanQuery.substring(0, 6)}...${cleanQuery.substring(38)})`,
              wallet_address: cleanQuery,
              customer_code: 'TẠO MỚI',
              is_auto_create: true,
            };
            this.posSearchedCustomers.set([autoCreateOption, ...results]);
            this.isCustomerSearching.set(false);
            return;
          }
        }

        this.posSearchedCustomers.set(results);
        this.isCustomerSearching.set(false);
      },
      error: (err) => {
        console.error('Lỗi tìm kiếm khách hàng động:', err);
        this.isCustomerSearching.set(false);
      },
    });
  }

  // Getters từ StateService để sử dụng trực tiếp trong template HTML
  public get cart() {
    return this.stateService.cart;
  }
  public get cartTotal() {
    return this.stateService.cartTotal;
  }
  public get tableNumber() {
    return this.stateService.tableNumber;
  }
  public get paymentMethod() {
    return this.stateService.paymentMethod;
  }
  public get posSelectedCustomer() {
    return this.stateService.posSelectedCustomer;
  }
  public get posCategoryFilter() {
    return this.stateService.posCategoryFilter;
  }
  public get posSearchQuery() {
    return this.stateService.posSearchQuery;
  }

  public get posItemsPerPage() {
    return this.stateService.posItemsPerPage;
  }
  public get posCurrentPage() {
    return this.stateService.posCurrentPage;
  }
  public get posProductsList() {
    return this.stateService.posProductsList;
  }
  public get paginatedPosProducts() {
    return this.stateService.paginatedPosProducts;
  }
  public get posTotalPages() {
    return this.stateService.posTotalPages;
  }
  public get posTotalItems() {
    return this.stateService.posTotalItems;
  }

  public get editingOrderId() {
    return this.stateService.editingOrderId;
  }
  public get isOrderSubmitting() {
    return this.stateService.isOrderSubmitting;
  }

  public get settings() {
    return this.stateService.settings;
  }
  public get products() {
    return this.stateService.products;
  }
  public get categoriesList() {
    return this.stateService.categoriesList;
  }
  public get areas() {
    return this.stateService.areas;
  }
  public get diningTables() {
    return this.stateService.diningTables;
  }

  public get isProductsLoading() {
    return this.stateService.isProductsLoading;
  }

  // Computed properties cho Confirm Modal
  public readonly posTotalQuantity = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0),
  );
  public readonly posCashReturn = computed(() =>
    Math.max(0, this.customerCashGiven() - this.posFinalTotal()),
  );
  public readonly posDebtAmount = computed(() =>
    this.isDebtPayment() ? Math.max(0, this.posFinalTotal() - this.customerCashGiven()) : 0,
  );
  public readonly customerCashGivenFormatted = computed(() => {
    const val = this.customerCashGiven();
    if (val === 0) return '';
    return val.toLocaleString('en-US');
  });

  // Danh mục có 'Tất cả' ở đầu
  public readonly categories = computed(() => {
    const list = this.categoriesList().map((c) => c.name);
    return ['Tất cả', ...list];
  });

  public readonly categoryOptions = computed(() => {
    return this.categories().map((cat) => ({ value: cat, label: cat }));
  });

  // Lọc sản phẩm cục bộ để hiển thị (phục vụ kiểm tra lỗi hoặc fallback client filter)
  public readonly filteredProducts = computed(() => {
    return this.products().filter((p) => {
      const matchCategory =
        this.posCategoryFilter() === 'Tất cả' ||
        (p.categories && p.categories.some((c: any) => c.name === this.posCategoryFilter()));
      const matchSearch = p.name.toLowerCase().includes(this.posSearchQuery().toLowerCase());
      return matchCategory && matchSearch && p.status;
    });
  });

  public connectWalletAndSign() {
    this.stateService.connectWalletAndSign();
  }

  // Thêm sản phẩm vào giỏ
  public addToCart(product: any, variant: any = null) {
    if (!this.web3Service.walletConnected()) return;
    if (!this.shiftService.currentShift() || !this.shiftService.currentShift()?.id) {
      this.stateService.showToast('Vui lòng mở ca trực trước khi chọn món bán hàng!', 'error');
      return;
    }

    if (product.variants && product.variants.length > 0 && !variant) {
      this.modalService.open(VariantSelectModalComponent, {
        title: `Chọn size: ${product.name}`,
        size: 'sm',
        data: {
          product,
          selectedVariant: product.variants[0]
        }
      }).afterClosed$.subscribe((chosenVariant) => {
        if (chosenVariant) {
          this.addToCart(product, chosenVariant);
        }
      });
      return;
    }

    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === product.id &&
        ((!item.variant && !variant) ||
          (item.variant && variant && item.variant.id === variant.id)),
    );

    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].quantity += 1;
      this.cart.set(updated);
    } else {
      this.cart.set([...currentCart, { product, variant, quantity: 1 }]);
    }

    this.stateService.showToast(
      `Đã thêm: ${product.name}${variant ? ' (' + variant.variant_name + ')' : ''}`,
      'success',
    );
  }

  // Tăng số lượng trong giỏ
  public increaseQuantity(productId: number, variantId: number | null = null) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === productId &&
        ((!item.variant && !variantId) ||
          (item.variant && variantId && item.variant.id === variantId)),
    );
    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].quantity += 1;
      this.cart.set(updated);
    }
  }

  // Giảm số lượng / Xóa khỏi giỏ
  public removeFromCart(productId: number, variantId: number | null = null) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === productId &&
        ((!item.variant && !variantId) ||
          (item.variant && variantId && item.variant.id === variantId)),
    );

    if (existIndex > -1) {
      const updated = [...currentCart];
      if (updated[existIndex].quantity > 1) {
        updated[existIndex].quantity -= 1;
        this.cart.set(updated);
      } else {
        updated.splice(existIndex, 1);
        this.cart.set(updated);
      }
    }
  }

  // Xác nhận chọn size từ modal
  public confirmVariantAndAddToCart() {
    const product = this.activeSelectingProduct();
    const variant = this.selectedVariantForCart();
    if (product && variant) {
      this.addToCart(product, variant);
    }
    this.closeVariantSelectModal();
  }

  public selectVariantForCart(variant: any) {
    this.selectedVariantForCart.set(variant);
  }

  public closeVariantSelectModal() {
    this.isVariantSelectModalOpen.set(false);
    this.activeSelectingProduct.set(null);
    this.selectedVariantForCart.set(null);
  }

  public clearCart() {
    this.stateService.clearCart();
    this.closeVariantSelectModal();
    this.isMobileCartOpen.set(false);
  }

  public cancelEditOrder() {
    this.stateService.cancelEditOrder();
    this.isMobileCartOpen.set(false);
  }

  public togglePaymentDropdown() {
    this.isPaymentDropdownOpen.set(!this.isPaymentDropdownOpen());
  }

  public selectPaymentMethod(method: string) {
    this.paymentMethod.set(method);
    this.isPaymentDropdownOpen.set(false);
  }

  public toggleTableDropdown() {
    this.isTableDropdownOpen.set(!this.isTableDropdownOpen());
  }

  public selectTable(tableName: string) {
    this.tableNumber.set(tableName);
    this.isTableDropdownOpen.set(false);
  }

  public onSearchQueryChange(query: string) {
    this.stateService.onSearchQueryChange(query);
  }

  // Mở modal xác nhận thanh toán nâng cao
  public openPosConfirmModal() {
    this.modalService.open(PosConfirmModalComponent, {
      title: 'Xác nhận thanh toán',
      size: 'md',
      data: {
        cartTotal: this.cartTotal(),
        posTotalQuantity: this.posTotalQuantity(),
        posSelectedVoucher: this.posSelectedVoucher(),
        posFinalTotal: this.posFinalTotal(),
        tableNumber: this.tableNumber(),
        settings: this.stateService.settings,
        paymentMethod: this.paymentMethod(),
        posSelectedCustomer: this.posSelectedCustomer()
      }
    }).afterClosed$.subscribe((res: any) => {
      if (res) {
        this.paymentMethod.set(res.paymentMethod);
        this.customerCashGiven.set(res.customerCashGiven);
        this.submitOrder();
      }
    });
  }

  // Chọn nhanh số tiền khách đưa
  public selectCashGivenQuick(amount: number) {
    this.customerCashGiven.set(amount);
  }

  // Xử lý sự kiện gõ số tiền khách đưa (format tự động dấu phẩy)
  public onCustomerCashGivenInput(event: any) {
    const inputVal = event.target.value;
    const cleanVal = inputVal.replace(/[^0-9]/g, '');
    const numVal = Number(cleanVal) || 0;
    this.customerCashGiven.set(numVal);
    event.target.value = numVal > 0 ? numVal.toLocaleString('en-US') : '';
  }

  // Xác nhận và thực hiện đặt hàng từ modal
  public confirmAndSubmitOrder() {
    this.paymentMethod.set(this.posPaymentMethod());
    this.isPosConfirmModalOpen.set(false);
    this.submitOrder();
  }

  public selectCustomerForOrder(customer: any) {
    if (this.isCustomerSearching() || this.stateService.isLoading()) {
      return; // Chặn click trùng lặp khi đang xử lý
    }

    if (customer.id === -99 || customer.is_auto_create) {
      const payload = {
        name: customer.name,
        type: 'individual',
        wallet_address: customer.wallet_address,
      };

      this.isCustomerSearching.set(true);
      this.stateService.isLoading.set(true);

      this.apiService.createCustomer(payload).subscribe({
        next: (createdRes) => {
          const newCust = createdRes.customer;
          this.stateService.posSelectedCustomer.set(newCust);
          this.posCustomerSearchQuery.set('');
          this.isCustomerDropdownOpen.set(false);
          this.posSelectedVoucher.set(null);
          this.loadActiveVouchers(newCust.id);
          this.isCustomerSearching.set(false);
          this.stateService.isLoading.set(false);
          this.stateService.showToast(
            'Đã tự động tạo hồ sơ khách hàng off-chain cho ví này!',
            'success',
          );
        },
        error: (err) => {
          console.error('Lỗi tự động tạo khách hàng từ ví Web3:', err);

          // Kiểm tra xem lỗi có phải do ví đã tồn tại hay không (lỗi validation 422 trùng ví)
          const isWalletExistsError =
            err.status === 422 &&
            ((err.error?.errors && err.error.errors.wallet_address) ||
              (err.error?.message && err.error.message.includes('ví Web3 này đã tồn tại')));

          if (isWalletExistsError) {
            // Nếu đã tồn tại ví này, tự động tìm kiếm lại khách hàng đó và chọn
            this.apiService.getCustomers(customer.wallet_address, 1).subscribe({
              next: (results) => {
                const foundCustomer =
                  results &&
                  results.find(
                    (c: any) =>
                      c.wallet_address &&
                      c.wallet_address.toLowerCase() === customer.wallet_address.toLowerCase(),
                  );

                if (foundCustomer) {
                  this.stateService.posSelectedCustomer.set(foundCustomer);
                  this.posCustomerSearchQuery.set('');
                  this.isCustomerDropdownOpen.set(false);
                  this.posSelectedVoucher.set(null);
                  this.loadActiveVouchers(foundCustomer.id);
                  this.stateService.showToast(
                    'Địa chỉ ví đã tồn tại! Đã tự động chọn khách hàng này.',
                    'success',
                  );
                } else {
                  this.stateService.showToast('Không thể tự động tạo khách hàng!', 'error');
                }
                this.isCustomerSearching.set(false);
                this.stateService.isLoading.set(false);
              },
              error: (searchErr) => {
                console.error('Lỗi tìm kiếm khách hàng sau khi trùng ví:', searchErr);
                this.stateService.showToast('Không thể tự động tạo khách hàng!', 'error');
                this.isCustomerSearching.set(false);
                this.stateService.isLoading.set(false);
              },
            });
          } else {
            this.stateService.showToast('Không thể tự động tạo khách hàng!', 'error');
            this.isCustomerSearching.set(false);
            this.stateService.isLoading.set(false);
          }
        },
      });
    } else {
      this.stateService.posSelectedCustomer.set(customer);
      this.posCustomerSearchQuery.set('');
      this.isCustomerDropdownOpen.set(false);
      this.posSelectedVoucher.set(null); // Reset voucher đã chọn
      this.loadActiveVouchers(customer.id);
    }
  }

  public deselectCustomer() {
    this.stateService.posSelectedCustomer.set(null);
    this.posActiveVouchers.set([]);
    this.posSelectedVoucher.set(null);
  }

  public loadActiveVouchers(customerId: number) {
    const customer = this.stateService.posSelectedCustomer();
    const walletAddress = customer?.wallet_address;

    // Chỉ đọc thông tin NFT Voucher khả dụng trực tiếp từ blockchain thông qua Web3Service
    if (walletAddress && this.web3Service.voucherContractAddress()) {
      this.web3Service
        .getCustomerVouchersFromChain(walletAddress)
        .then((chainVouchers) => {
          this.setAndFilterActiveVouchers(chainVouchers || []);
        })
        .catch((err) => {
          console.error('Lỗi quét voucher NFT từ blockchain:', err);
          this.posActiveVouchers.set([]);
        });
    } else {
      this.posActiveVouchers.set([]);
    }
  }

  private setAndFilterActiveVouchers(vouchers: any[]) {
    const now = new Date();
    // Lọc bỏ voucher đã hết hạn hoặc đã được sử dụng
    const activeVouchers = vouchers.filter((v) => {
      // Bỏ qua nếu voucher không active
      if (v.status && v.status !== 'active') return false;

      // Kiểm tra hạn sử dụng
      if (v.expired_at) {
        const expiry = new Date(v.expired_at);
        return expiry > now;
      }
      return true;
    });

    this.posActiveVouchers.set(activeVouchers);
  }

  public selectVoucher(voucher: any) {
    if (this.posSelectedVoucher()?.code === voucher?.code) {
      this.posSelectedVoucher.set(null);
      this.stateService.showToast('Đã hủy áp dụng mã giảm giá.', 'success');
    } else {
      const total = this.cartTotal();
      if (total < voucher.min_order_amount) {
        this.stateService.showToast(
          `Đơn hàng tối thiểu phải đạt ${voucher.min_order_amount.toLocaleString('vi-VN')}đ để áp dụng voucher này!`,
          'error',
        );
        return;
      }
      this.posSelectedVoucher.set(voucher);
      this.stateService.showToast(
        `Đã áp dụng mã giảm giá ${voucher.discount_amount.toLocaleString('vi-VN')}đ!`,
        'success',
      );
    }
  }

  public async applyNftVoucherById() {
    const customer = this.stateService.posSelectedCustomer();
    const walletAddress = customer?.wallet_address;
    const tokenIdStr = this.nftVoucherInputId().trim();

    if (!customer || !walletAddress) {
      this.stateService.showToast(
        'Vui lòng chọn khách hàng có ví Web3 để áp dụng Voucher NFT!',
        'error',
      );
      return;
    }

    if (!tokenIdStr) {
      this.stateService.showToast('Vui lòng nhập ID NFT Voucher!', 'error');
      return;
    }

    const tokenId = Number(tokenIdStr);
    if (isNaN(tokenId) || tokenId <= 0) {
      this.stateService.showToast('ID NFT Voucher phải là số nguyên dương!', 'error');
      return;
    }

    this.isNftVoucherLoading.set(true);
    this.stateService.showToast(`Đang truy vấn NFT Voucher #${tokenId} từ Blockchain...`);

    try {
      const res = await this.web3Service.getSingleVoucherFromChain(tokenId);

      if (!res) {
        this.stateService.showToast(
          `Không tìm thấy NFT Voucher #${tokenId} trên Blockchain!`,
          'error',
        );
        this.isNftVoucherLoading.set(false);
        return;
      }

      if (res.status === 'used') {
        this.stateService.showToast(
          `NFT Voucher #${tokenId} đã được sử dụng hoặc tiêu hủy!`,
          'error',
        );
        this.isNftVoucherLoading.set(false);
        return;
      }

      if (res.ownerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        this.stateService.showToast(
          `Voucher #${tokenId} thuộc ví khác, không phải của khách hàng đang chọn!`,
          'error',
        );
        this.isNftVoucherLoading.set(false);
        return;
      }

      const newVoucher = {
        id: null,
        code: res.code,
        discount_amount: res.discount_amount,
        min_order_amount: res.min_order_amount,
        isNft: true,
        tokenId: res.tokenId,
        status: 'active',
      };

      const currentVouchers = this.posActiveVouchers();
      const exists = currentVouchers.some((v) => v.tokenId === res.tokenId);
      if (!exists) {
        this.posActiveVouchers.set([newVoucher, ...currentVouchers]);
      }

      this.selectVoucher(newVoucher);
      this.stateService.showToast(`Đã áp dụng thành công NFT Voucher #${tokenId}!`);
      this.nftVoucherInputId.set('');
      this.isNftVoucherLoading.set(false);
    } catch (err: any) {
      console.error('Lỗi khi áp dụng NFT Voucher thủ công:', err);
      this.stateService.showToast(err.message || 'Lỗi truy vấn blockchain.', 'error');
      this.isNftVoucherLoading.set(false);
    }
  }

  public updateItemNote(productId: number, variantId: number | null, note: string) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === productId &&
        ((!item.variant && !variantId) ||
          (item.variant && variantId && item.variant.id === variantId)),
    );
    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].note = note;
      this.cart.set(updated);
    }
  }

  // Phân luồng click nút Đặt hàng ở POS (Nhanh / Nâng cao)
  public handlePosOrderClick() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast(
        'Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!',
        'error',
      );
      return;
    }

    if (this.cart().length === 0) {
      this.stateService.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    if (this.posCheckoutMode() === 'quick') {
      this.submitOrder();
    } else {
      this.openPosConfirmModal();
    }
  }

  // Tạo hoặc Cập nhật đơn hàng từ POS (Hỗ trợ ký số EIP-712 & Relayer)
  public async submitOrder() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast(
        'Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!',
        'error',
      );
      return;
    }

    if (this.cart().length === 0) {
      this.stateService.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    if (this.paymentMethod() === 'debt' && !this.stateService.posSelectedCustomer()) {
      this.stateService.showToast('Đơn hàng ghi nợ bắt buộc phải chọn khách hàng!', 'error');
      return;
    }

    // Kiểm tra trạng thái hoạt động của sản phẩm và biến thể trong giỏ hàng trước khi thanh toán
    for (const item of this.cart()) {
      const liveProduct = this.products().find((p) => p.id === item.product.id);
      if (!liveProduct || !liveProduct.status) {
        this.stateService.showToast(
          `Món ăn "${item.product.name}" đã ngừng phục vụ! Vui lòng xóa khỏi giỏ.`,
          'error',
        );
        return;
      }
      if (item.variant) {
        const liveVariant =
          liveProduct.variants && liveProduct.variants.find((v: any) => v.id === item.variant.id);
        if (!liveVariant || !liveVariant.status) {
          this.stateService.showToast(
            `Biến thể "${item.variant.variant_name || liveVariant.name}" của "${item.product.name}" đã ngừng phục vụ! Vui lòng xóa khỏi giỏ.`,
            'error',
          );
          return;
        }
      }
    }

    this.isOrderSubmitting.set(true);

    // Khởi tạo thông tin đơn hàng
    const orderData: any = {
      table_number: this.tableNumber(),
      customer_id: this.stateService.posSelectedCustomer()?.id || null,
      payment_method: this.paymentMethod(),
      voucher_nft_token_id: this.posSelectedVoucher()?.isNft
        ? this.posSelectedVoucher()?.tokenId
        : null,
      voucher_nft_signature: null,
      items: this.cart().map((item) => ({
        product_id: item.product.id,
        product_variant_id: item.variant ? item.variant.id : null,
        quantity: item.quantity,
        note: item.note || null,
      })),
    };

    const selectedVoucher = this.posSelectedVoucher();

    // Nếu chọn Voucher NFT, kích hoạt quy trình ký số di động qua QR Code (Phương án 1)
    if (selectedVoucher && selectedVoucher.isNft) {
      try {
        this.stateService.showToast('Đang khởi tạo yêu cầu ký số NFT Voucher...', 'success');

        // 1. Tự sinh mã hóa đơn duy nhất ở frontend để khớp với chữ ký EIP-712
        const orderCode =
          'HD-' +
          Date.now().toString(36).substring(3).toUpperCase() +
          Math.floor(10 + Math.random() * 90);

        // 2. Đăng ký yêu cầu ký lên Backend cùng thông tin đơn hàng tạm thời
        const tempOrderData = {
          table_number: orderData.table_number,
          payment_method: orderData.payment_method,
          customer_id: orderData.customer_id,
          total_amount: this.cartTotal(),
          discount_amount: this.posSelectedVoucher()?.discount_amount || 0,
          final_amount: this.posFinalTotal(),
          items: this.cart().map((item) => ({
            product_id: item.product.id,
            product_variant_id: item.variant ? item.variant.id : null,
            product_name: item.product.name,
            variant_name: item.variant ? item.variant.variant_name || item.variant.name : null,
            quantity: item.quantity,
            price: item.variant ? item.variant.price : item.product.price,
            note: item.note || null,
          })),
        };

        this.apiService
          .requestVoucherSignature(orderCode, selectedVoucher.tokenId, tempOrderData)
          .subscribe({
            next: () => {
              // 3. Tạo link QR trỏ tới trang ký số di động
              const currentUrl = window.location.origin;
              const qrData = `${currentUrl}/mobile-sign?order_code=${orderCode}&token_id=${selectedVoucher.tokenId}`;
              const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=250`;

              // 4. Cập nhật signal để hiển thị modal QR
              this.signOrderCode.set(orderCode);
              this.signTokenId.set(selectedVoucher.tokenId);
              this.signQrCodeUrl.set(qrApiUrl);
              this.signLink.set(qrData);

              this.signQrModalRef = this.modalService.open(SignQrModalComponent, {
                title: 'Ký số NFT Voucher',
                size: 'sm',
                data: {
                  signQrCodeUrlSignal: this.signQrCodeUrl,
                  signLinkSignal: this.signLink,
                  signOrderCode: orderCode,
                  signTokenId: selectedVoucher.tokenId
                }
              });

              this.signQrModalRef.afterClosed$.subscribe((res: any) => {
                if (res === 'cancel_sign') {
                  this.closeSignQrModal();
                } else {
                  this.stopSignaturePolling();
                  this.signQrModalRef = null;
                  this.isOrderSubmitting.set(false);
                }
              });

              // 5. Bắt đầu polling
              this.startSignaturePolling(orderCode, orderData);
            },
            error: (err) => {
              console.error('Lỗi đăng ký yêu cầu ký số:', err);
              const errMsg = err.error?.message || 'Không thể đăng ký yêu cầu ký số với máy chủ!';
              this.stateService.showToast('Lỗi: ' + errMsg, 'error');
              this.isOrderSubmitting.set(false);
            },
          });

        return; // Dừng tiến trình nộp đơn để chờ chữ ký từ QR code
      } catch (err: any) {
        console.error('Lỗi khởi tạo luồng ký số QR:', err);
        this.stateService.showToast('Khởi tạo ký số thất bại!', 'error');
        this.isOrderSubmitting.set(false);
        return;
      }
    }

    this.submitFinalOrder(orderData);
  }

  // Bắt đầu vòng lặp polling kiểm tra chữ ký số từ backend
  public startSignaturePolling(orderCode: string, orderData: any) {
    this.stopSignaturePolling();
    this.signaturePollingInterval = setInterval(() => {
      this.apiService.checkVoucherSignature(orderCode).subscribe({
        next: (res) => {
          if (res && res.status === 'signed' && res.signature) {
            this.stopSignaturePolling();
            if (this.signQrModalRef) {
              this.signQrModalRef.close();
              this.signQrModalRef = null;
            }
            this.stateService.showToast(
              'Khách hàng đã ký số và chốt đơn hàng thành công!',
              'success',
            );

            // Vì Backend đã tự động tạo đơn hàng chính thức từ temp_order_data khi nhận chữ ký,
            // POS thu ngân chỉ cần dọn dẹp giỏ hàng và tải lại danh sách đơn hàng
            this.stateService.clearCart();
            this.isOrderSubmitting.set(false);
            this.isMobileCartOpen.set(false);
            this.stateService.refreshOrders();
            if (orderData.payment_method === 'debt') {
              this.stateService.refreshCustomers(true);
            }
            this.stateService.activeTab.set('orders');
          }
        },
        error: (err) => {
          console.error('Lỗi kiểm tra trạng thái chữ ký:', err);
        },
      });
    }, 2000);
  }

  // Dừng vòng lặp polling
  public stopSignaturePolling() {
    if (this.signaturePollingInterval) {
      clearInterval(this.signaturePollingInterval);
      this.signaturePollingInterval = null;
    }
  }

  // Đóng modal QR ký số và hủy bỏ luồng
  public closeSignQrModal() {
    this.stopSignaturePolling();
    if (this.signQrModalRef) {
      this.signQrModalRef.close();
      this.signQrModalRef = null;
    }

    // Gọi API để hủy và xóa yêu cầu ký số cùng đơn hàng tạm thời trên Backend
    const code = this.signOrderCode();
    if (code) {
      this.apiService.cancelVoucherSignature(code).subscribe({
        error: (err) => console.error('Lỗi khi hủy chữ ký tạm thời:', err),
      });
    }

    this.signLink.set('');
    this.isOrderSubmitting.set(false);
    this.stateService.showToast('Đã hủy áp dụng ký số voucher NFT.');
  }

  // Sao chép liên kết ký số
  public copySignLink() {
    const link = this.signLink();
    if (!link) return;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.stateService.showToast('Đã copy đường link ký số!', 'success');
      })
      .catch((err) => {
        console.error('Không thể copy link:', err);
        this.stateService.showToast('Không thể copy link, vui lòng thử lại!', 'error');
      });
  }

  // Thực hiện gọi API nộp đơn hàng cuối cùng
  private submitFinalOrder(orderData: any) {
    this.isOrderSubmitting.set(true);
    const editId = this.editingOrderId();

    if (editId !== null) {
      this.apiService.updateOrder(editId, orderData).subscribe({
        next: (res) => {
          this.stateService.showToast('Cập nhật đơn hàng thành công!', 'success');
          this.stateService.clearCart();
          this.editingOrderId.set(null);
          this.isOrderSubmitting.set(false);
          this.isMobileCartOpen.set(false);
          this.stateService.refreshOrders();
          if (orderData.payment_method === 'debt') {
            this.stateService.refreshCustomers(true);
          }
          this.stateService.activeTab.set('orders');
        },
        error: (err) => {
          console.error('Lỗi cập nhật đơn:', err);
          const errorMsg =
            err.error?.message || 'Không thể cập nhật đơn hàng. Vui lòng kiểm tra lại!';
          this.stateService.showToast(errorMsg, 'error');
          this.isOrderSubmitting.set(false);
        },
      });
    } else {
      this.apiService.createOrder(orderData).subscribe({
        next: (res) => {
          this.stateService.showToast(
            'Đã ghi nhận đơn hàng thành công! Trạng thái: Đang chờ xác nhận.',
            'success',
          );
          this.stateService.clearCart();
          this.isOrderSubmitting.set(false);
          this.stateService.refreshOrders();
          if (orderData.payment_method === 'debt') {
            this.stateService.refreshCustomers(true);
          }
          this.stateService.activeTab.set('orders');
        },
        error: (err) => {
          console.error('Lỗi đặt đơn:', err);
          const errorMsg = err.error?.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại!';
          this.stateService.showToast(errorMsg, 'error');
          this.isOrderSubmitting.set(false);
        },
      });
    }
  }

  public getProductImage(imagePath: string): string {
    if (!imagePath || !imagePath.trim()) {
      return 'not-found.webp';
    }
    return imagePath;
  }

  public handleImageError(event: any) {
    event.target.src = 'not-found.webp';
  }

  public getProductPriceDisplay(product: any): string {
    if (!product) return '0';
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v: any) => Number(v.price) || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return `${minPrice.toLocaleString('vi-VN')}`;
      }
      return `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')}`;
    }
    return `${(Number(product.price) || 0).toLocaleString('vi-VN')}`;
  }

  /**
   * Quét mã vạch sản phẩm bằng camera tại POS bán hàng
   */
  public startPosBarcodeScan() {
    this.modalService.open(BarcodeScannerModalComponent, {
      title: 'Quét mã vạch sản phẩm',
      size: 'sm'
    }).afterClosed$.subscribe((decodedText: string | null) => {
      if (decodedText) {
        const barcode = decodedText.trim();
        const foundProduct = this.products().find(
          (p: any) => p.barcode && p.barcode.trim() === barcode,
        );
        if (foundProduct) {
          this.addToCart(foundProduct);
        } else {
          this.stateService.showToast(
            `Không tìm thấy sản phẩm có mã vạch: ${barcode}`,
            'error',
          );
          this.stateService.onSearchQueryChange(barcode);
        }
      }
    });
  }
}
