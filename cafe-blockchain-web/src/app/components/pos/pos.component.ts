import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pos.component.html'
})
export class PosComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Trạng thái UI cục bộ của POS
  public readonly isPaymentDropdownOpen = signal<boolean>(false);
  public readonly posCheckoutMode = signal<'quick' | 'confirm'>('quick');
  public readonly isTableDropdownOpen = signal<boolean>(false);
  public readonly isPosConfirmModalOpen = signal<boolean>(false);
  public readonly customerCashGiven = signal<number>(0);
  public readonly isDebtPayment = signal<boolean>(false);
  public readonly posPaymentMethod = signal<'cash' | 'bank_transfer' | 'crypto'>('cash');

  // Trạng thái chọn kích thước/biến thể
  public readonly activeSelectingProduct = signal<any>(null);
  public readonly selectedVariantForCart = signal<any>(null);
  public readonly isVariantSelectModalOpen = signal<boolean>(false);

  // Trạng thái Tìm kiếm & Chọn Khách hàng tại POS
  public readonly posCustomerSearchQuery = signal<string>('');
  public readonly isCustomerDropdownOpen = signal<boolean>(false);
  public readonly posSearchedCustomers = signal<any[]>([]);
  public readonly isCustomerSearching = signal<boolean>(false);
  
  // Trạng thái Voucher tại POS
  public readonly posActiveVouchers = signal<any[]>([]);
  public readonly posSelectedVoucher = signal<any | null>(null);

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

  public ngOnInit() {
    this.customerSearchSubscription = this.customerSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performCustomerSearch(query);
    });
  }

  public ngOnDestroy() {
    if (this.customerSearchSubscription) {
      this.customerSearchSubscription.unsubscribe();
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
      this.posSearchedCustomers.set([{
        id: -98,
        name: `Đang nhập ví EVM... (${cleanQuery.length}/42 ký tự)`,
        customer_code: 'CHỜ',
        is_pending_wallet: true
      }]);
      this.isCustomerSearching.set(false);
      return;
    }
    
    const isEvmWallet = /^0x[a-fA-F0-9]{40}$/.test(cleanQuery);
    
    this.apiService.getCustomers(cleanQuery, 15).subscribe({
      next: (res) => {
        const results = res || [];
        
        if (isEvmWallet) {
          const hasWallet = results.some(c => c.wallet_address && c.wallet_address.toLowerCase() === cleanQuery.toLowerCase());
          if (!hasWallet) {
            const autoCreateOption = {
              id: -99,
              name: `Khách ví Web3 (${cleanQuery.substring(0, 6)}...${cleanQuery.substring(38)})`,
              wallet_address: cleanQuery,
              customer_code: 'TẠO MỚI',
              is_auto_create: true
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
      }
    });
  }


  // Getters từ StateService để sử dụng trực tiếp trong template HTML
  public get web3Service() { return this.stateService.web3Service; }
  public get cart() { return this.stateService.cart; }
  public get cartTotal() { return this.stateService.cartTotal; }
  public get tableNumber() { return this.stateService.tableNumber; }
  public get paymentMethod() { return this.stateService.paymentMethod; }
  public get posSelectedCustomer() { return this.stateService.posSelectedCustomer; }
  public get posCategoryFilter() { return this.stateService.posCategoryFilter; }
  public get posSearchQuery() { return this.stateService.posSearchQuery; }
  
  public get posItemsPerPage() { return this.stateService.posItemsPerPage; }
  public get posCurrentPage() { return this.stateService.posCurrentPage; }
  public get posProductsList() { return this.stateService.posProductsList; }
  public get paginatedPosProducts() { return this.stateService.paginatedPosProducts; }
  public get posTotalPages() { return this.stateService.posTotalPages; }
  public get posTotalItems() { return this.stateService.posTotalItems; }

  public get editingOrderId() { return this.stateService.editingOrderId; }
  public get isOrderSubmitting() { return this.stateService.isOrderSubmitting; }

  public get products() { return this.stateService.products; }
  public get categoriesList() { return this.stateService.categoriesList; }
  public get areas() { return this.stateService.areas; }
  public get diningTables() { return this.stateService.diningTables; }

  public get isProductsLoading() { return this.stateService.isProductsLoading; }

  // Computed properties cho Confirm Modal
  public readonly posTotalQuantity = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
  public readonly posCashReturn = computed(() => Math.max(0, this.customerCashGiven() - this.posFinalTotal()));
  public readonly posDebtAmount = computed(() => this.isDebtPayment() ? Math.max(0, this.posFinalTotal() - this.customerCashGiven()) : 0);
  public readonly customerCashGivenFormatted = computed(() => {
    const val = this.customerCashGiven();
    if (val === 0) return '';
    return val.toLocaleString('en-US');
  });

  // Danh mục có 'Tất cả' ở đầu
  public readonly categories = computed(() => {
    const list = this.categoriesList().map(c => c.name);
    return ['Tất cả', ...list];
  });

  // Lọc sản phẩm cục bộ để hiển thị (phục vụ kiểm tra lỗi hoặc fallback client filter)
  public readonly filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchCategory = this.posCategoryFilter() === 'Tất cả' || (p.categories && p.categories.some((c: any) => c.name === this.posCategoryFilter()));
      const matchSearch = p.name.toLowerCase().includes(this.posSearchQuery().toLowerCase());
      return matchCategory && matchSearch && p.status;
    });
  });

  // Thêm sản phẩm vào giỏ
  public addToCart(product: any, variant: any = null) {
    if (product.variants && product.variants.length > 0 && !variant) {
      this.activeSelectingProduct.set(product);
      this.selectedVariantForCart.set(product.variants[0]);
      this.isVariantSelectModalOpen.set(true);
      return;
    }

    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item =>
      item.product.id === product.id &&
      ((!item.variant && !variant) || (item.variant && variant && item.variant.id === variant.id))
    );

    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].quantity += 1;
      this.cart.set(updated);
    } else {
      this.cart.set([...currentCart, { product, variant, quantity: 1 }]);
    }

    this.stateService.showToast(`Đã thêm: ${product.name}${variant ? ' (' + variant.variant_name + ')' : ''}`, 'success');
  }

  // Tăng số lượng trong giỏ
  public increaseQuantity(productId: number, variantId: number | null = null) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item =>
      item.product.id === productId &&
      ((!item.variant && !variantId) || (item.variant && variantId && item.variant.id === variantId))
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
    const existIndex = currentCart.findIndex(item =>
      item.product.id === productId &&
      ((!item.variant && !variantId) || (item.variant && variantId && item.variant.id === variantId))
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
  }

  public cancelEditOrder() {
    this.stateService.cancelEditOrder();
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
    this.customerCashGiven.set(this.posFinalTotal());
    this.isDebtPayment.set(false);
    
    const currentMethod = this.paymentMethod();
    if (currentMethod === 'cash' || currentMethod === 'bank_transfer' || currentMethod === 'crypto') {
      this.posPaymentMethod.set(currentMethod);
    } else {
      this.posPaymentMethod.set('cash');
    }
    
    this.isPosConfirmModalOpen.set(true);
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
        wallet_address: customer.wallet_address
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
          this.stateService.showToast('Đã tự động tạo hồ sơ khách hàng off-chain cho ví này!', 'success');
        },
        error: (err) => {
          console.error('Lỗi tự động tạo khách hàng từ ví Web3:', err);
          
          // Kiểm tra xem lỗi có phải do ví đã tồn tại hay không (lỗi validation 422 trùng ví)
          const isWalletExistsError = err.status === 422 && (
            (err.error?.errors && err.error.errors.wallet_address) ||
            (err.error?.message && err.error.message.includes('ví Web3 này đã tồn tại'))
          );
          
          if (isWalletExistsError) {
            // Nếu đã tồn tại ví này, tự động tìm kiếm lại khách hàng đó và chọn
            this.apiService.getCustomers(customer.wallet_address, 1).subscribe({
              next: (results) => {
                const foundCustomer = results && results.find(
                  (c: any) => c.wallet_address && c.wallet_address.toLowerCase() === customer.wallet_address.toLowerCase()
                );
                
                if (foundCustomer) {
                  this.stateService.posSelectedCustomer.set(foundCustomer);
                  this.posCustomerSearchQuery.set('');
                  this.isCustomerDropdownOpen.set(false);
                  this.posSelectedVoucher.set(null);
                  this.loadActiveVouchers(foundCustomer.id);
                  this.stateService.showToast('Địa chỉ ví đã tồn tại! Đã tự động chọn khách hàng này.', 'success');
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
              }
            });
          } else {
            this.stateService.showToast('Không thể tự động tạo khách hàng!', 'error');
            this.isCustomerSearching.set(false);
            this.stateService.isLoading.set(false);
          }
        }
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

    // 1. Nếu khách hàng có ví Web3 và quán đã cấu hình NFT Voucher contract, tiến hành kiểm tra trên chuỗi trước
    if (walletAddress && this.web3Service.voucherContractAddress()) {
      this.web3Service.getCustomerVouchersFromChain(walletAddress).then(chainVouchers => {
        if (chainVouchers && chainVouchers.length > 0) {
          // 2. Gửi danh sách voucher on-chain lên backend để đồng bộ quyền sở hữu (customer_id và wallet_address)
          const syncData = chainVouchers.map(cv => ({ code: cv.code, token_id: cv.tokenId }));
          this.apiService.syncVouchersOwnership(customerId, walletAddress, syncData).subscribe({
            next: () => {
              // 3. Sau khi đồng bộ thành công, lấy toàn bộ danh sách voucher hoạt động mới nhất từ DB
              this.apiService.getVouchers(customerId, 'active').subscribe({
                next: (dbVouchers) => {
                  const merged = (dbVouchers || []).map(dv => {
                    const cv = chainVouchers.find(c => c.code === dv.code);
                    return {
                      ...dv,
                      isNft: cv ? true : dv.isNft,
                      tokenId: cv ? cv.tokenId : dv.tokenId
                    };
                  });
                  this.setAndFilterActiveVouchers(merged);
                },
                error: (err) => {
                  console.error('Lỗi tải voucher từ DB sau khi đồng bộ:', err);
                  this.setAndFilterActiveVouchers(chainVouchers);
                }
              });
            },
            error: (syncErr) => {
              console.error('Lỗi đồng bộ sở hữu voucher NFT:', syncErr);
              // Fallback: Nếu đồng bộ lỗi, chạy quy trình cũ không đồng bộ DB
              this.loadActiveVouchersFallback(customerId, walletAddress, chainVouchers);
            }
          });
        } else {
          // Không có voucher nào trên chain, chỉ tải từ DB
          this.loadVouchersFromDbOnly(customerId);
        }
      }).catch(err => {
        console.error('Lỗi quét voucher NFT từ blockchain:', err);
        this.loadVouchersFromDbOnly(customerId);
      });
    } else {
      // Khách hàng không có ví hoặc quán không cấu hình NFT contract
      this.loadVouchersFromDbOnly(customerId);
    }
  }

  private loadVouchersFromDbOnly(customerId: number) {
    this.apiService.getVouchers(customerId, 'active').subscribe({
      next: (dbVouchers) => {
        this.setAndFilterActiveVouchers(dbVouchers || []);
      },
      error: (err) => {
        console.error('Lỗi tải voucher của khách hàng:', err);
      }
    });
  }

  private loadActiveVouchersFallback(customerId: number, walletAddress: string, chainVouchers: any[]) {
    this.apiService.getVouchers(customerId, 'active').subscribe({
      next: (dbVouchers) => {
        const vouchers = dbVouchers || [];
        const merged = [...vouchers];
        const missingCodes: string[] = [];
        const chainVoucherMap = new Map<string, any>();

        chainVouchers.forEach(cv => {
          chainVoucherMap.set(cv.code, cv);
          const idx = merged.findIndex(mv => mv.code === cv.code);
          if (idx > -1) {
            merged[idx].isNft = true;
            merged[idx].tokenId = cv.tokenId;
          } else {
            missingCodes.push(cv.code);
          }
        });

        if (missingCodes.length > 0) {
          this.apiService.getVouchers(undefined, undefined, missingCodes).subscribe({
            next: (missingDbVouchers) => {
              missingDbVouchers.forEach(mv => {
                const cv = chainVoucherMap.get(mv.code);
                if (cv) {
                  merged.push({
                    ...mv,
                    isNft: true,
                    tokenId: cv.tokenId
                  });
                }
              });

              missingCodes.forEach(code => {
                const alreadyAdded = merged.some(mv => mv.code === code);
                if (!alreadyAdded) {
                  const cv = chainVoucherMap.get(code);
                  if (cv) merged.push(cv);
                }
              });

              this.setAndFilterActiveVouchers(merged);
            },
            error: (err) => {
              console.error('Lỗi lấy voucher chi tiết từ DB (fallback):', err);
              missingCodes.forEach(code => {
                const cv = chainVoucherMap.get(code);
                if (cv) merged.push(cv);
              });
              this.setAndFilterActiveVouchers(merged);
            }
          });
        } else {
          this.setAndFilterActiveVouchers(merged);
        }
      },
      error: (err) => {
        console.error('Lỗi tải voucher (fallback):', err);
      }
    });
  }

  private setAndFilterActiveVouchers(vouchers: any[]) {
    const now = new Date();
    // Lọc bỏ voucher đã hết hạn hoặc đã được sử dụng
    const activeVouchers = vouchers.filter(v => {
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
        this.stateService.showToast(`Đơn hàng tối thiểu phải đạt ${voucher.min_order_amount.toLocaleString('vi-VN')}đ để áp dụng voucher này!`, 'error');
        return;
      }
      this.posSelectedVoucher.set(voucher);
      this.stateService.showToast(`Đã áp dụng mã giảm giá ${voucher.discount_amount.toLocaleString('vi-VN')}đ!`, 'success');
    }
  }

  public updateItemNote(productId: number, variantId: number | null, note: string) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item =>
      item.product.id === productId &&
      ((!item.variant && !variantId) || (item.variant && variantId && item.variant.id === variantId))
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
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!', 'error');
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
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!', 'error');
      return;
    }

    if (this.cart().length === 0) {
      this.stateService.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    this.isOrderSubmitting.set(true);
    
    // Khởi tạo thông tin đơn hàng
    const orderData: any = {
      table_number: this.tableNumber(),
      customer_id: this.stateService.posSelectedCustomer()?.id || null,
      payment_method: this.paymentMethod(),
      voucher_id: this.posSelectedVoucher()?.id || null,
      items: this.cart().map(item => ({
        product_id: item.product.id,
        product_variant_id: item.variant ? item.variant.id : null,
        quantity: item.quantity,
        note: item.note || null
      }))
    };

    const selectedVoucher = this.posSelectedVoucher();

    // Nếu chọn Voucher NFT, kích hoạt quy trình ký số offline EIP-712 qua MetaMask
    if (selectedVoucher && selectedVoucher.isNft) {
      try {
        this.stateService.showToast('Yêu cầu khách hàng xác nhận ký ví để sử dụng NFT Voucher...', 'success');
        
        // 1. Tự sinh mã hóa đơn duy nhất ở frontend để khớp với chữ ký EIP-712
        const orderCode = 'HD-' + Date.now().toString(36).substring(3).toUpperCase() + Math.floor(10 + Math.random() * 90);
        
        // 2. Gọi MetaMask yêu cầu khách hàng ký EIP-712 offline (miễn phí gas)
        const signature = await this.web3Service.signVoucherUsageEIP712(selectedVoucher.tokenId, orderCode);
        
        // 3. Gắn thông tin chữ ký và mã đơn hàng vào dữ liệu gửi đi
        orderData.order_code = orderCode;
        orderData.voucher_nft_token_id = selectedVoucher.tokenId;
        orderData.voucher_nft_signature = signature;
        orderData.voucher_id = selectedVoucher.id || null;

      } catch (signErr: any) {
        console.error('Lỗi ký số NFT Voucher:', signErr);
        const errMsg = signErr.reason || signErr.message || 'Khách hàng từ chối ký ví hoặc lỗi kết nối ví!';
        this.stateService.showToast('Ký xác thực NFT Voucher thất bại: ' + errMsg, 'error');
        this.isOrderSubmitting.set(false);
        return;
      }
    }

    const editId = this.editingOrderId();

    if (editId !== null) {
      this.apiService.updateOrder(editId, orderData).subscribe({
        next: (res) => {
          this.stateService.showToast('Cập nhật đơn hàng thành công!', 'success');
          this.stateService.clearCart();
          this.editingOrderId.set(null);
          this.isOrderSubmitting.set(false);
          this.stateService.refreshOrders();
          this.stateService.activeTab.set('orders');
        },
        error: (err) => {
          console.error('Lỗi cập nhật đơn:', err);
          const errorMsg = err.error?.message || 'Không thể cập nhật đơn hàng. Vui lòng kiểm tra lại!';
          this.stateService.showToast(errorMsg, 'error');
          this.isOrderSubmitting.set(false);
        }
      });
    } else {
      this.apiService.createOrder(orderData).subscribe({
        next: (res) => {
          this.stateService.showToast('Đã ghi nhận đơn hàng thành công! Trạng thái: Đang chờ xác nhận.', 'success');
          this.stateService.clearCart();
          this.isOrderSubmitting.set(false);
          this.stateService.refreshOrders();
          this.stateService.activeTab.set('orders');
        },
        error: (err) => {
          console.error('Lỗi đặt đơn:', err);
          const errorMsg = err.error?.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại!';
          this.stateService.showToast(errorMsg, 'error');
          this.isOrderSubmitting.set(false);
        }
      });
    }
  }

  // Helpers cho template HTML
  public getPagesArray(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Luôn thêm trang 1
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Luôn thêm trang cuối
    pages.push(totalPages);
    
    return pages;
  }

  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
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
}
