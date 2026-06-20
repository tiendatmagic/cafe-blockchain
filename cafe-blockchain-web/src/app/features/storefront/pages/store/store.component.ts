import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  HostListener,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Title } from '@angular/platform-browser';
import { StateService } from '@core/services/state.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ModalService } from '@core/services/modal.service';
import { StoreVariantSelectModalComponent } from '../../components/store-variant-select-modal/store-variant-select-modal.component';
import { OrderSuccessModalComponent } from '../../components/order-success-modal/order-success-modal.component';

interface CartItem {
  product: any;
  variant: any | null;
  quantity: number;
  note: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginationComponent,
    VNDCurrencyPipe,
    ThemeToggleComponent,
    DrawerComponent,
    Web3ConnectPromptComponent,
    IconComponent,
    TabGroupComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
  ],
  templateUrl: './store.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: [],
})
export class StoreComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly titleService = inject(Title);
  private readonly stateService = inject(StateService);
  private readonly modalService = inject(ModalService);

  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('categoryBtn') categoryButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  // Dữ liệu quán
  public readonly storeSettings = signal<any>(null);
  public readonly categories = signal<any[]>([]);
  public readonly products = signal<any[]>([]);
  public readonly paymentMethods = signal<any[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isError = signal<boolean>(false);
  public readonly errorMessage = signal<string>('');
  public readonly alertModalMessage = signal<string>('');

  public readonly sliderLeft = signal<string>('0px');
  public readonly sliderWidth = signal<string>('0px');
  public readonly sliderTop = signal<string>('0px');
  public readonly sliderHeight = signal<string>('0px');
  public readonly sliderOpacity = signal<number>(0);

  // UI States
  public readonly activeCategoryId = signal<number | null>(null);
  public readonly showFavoritesOnly = signal<boolean>(false);
  public readonly isCartOpen = signal<boolean>(false);
  public readonly isOrderSuccess = signal<boolean>(false);
  public readonly lastOrderCode = signal<string>('');
  public readonly displayMode = signal<'grid' | 'list'>('grid');
  public readonly searchQuery = signal<string>('');
  public readonly currentPage = signal<number>(1);
  public readonly itemsPerPage = 20;
  // Thiết lập hiệu ứng trượt danh mục - persist vào localStorage (dùng chung key với Sidebar)
  public readonly useSlidingEffect = signal<boolean>(
    typeof window !== 'undefined'
      ? localStorage.getItem('ui_sliding_effect') !== 'false'
      : true,
  );

  constructor() {
    effect(() => {
      this.activeCategoryId();
      this.categoryOptions();
      this.useSlidingEffect(); // Lắng nghe để cập nhật khi người dùng bật tắt hiệu ứng trượt
      setTimeout(() => this.updateSliderPosition(), 50);
    });
  }

  // Bộ lọc storefront nâng cao
  public readonly storeMinPrice = signal<number | null>(null);
  public readonly storeMaxPrice = signal<number | null>(null);
  public readonly storeMinVariantPrice = signal<number | null>(null);
  public readonly storeMaxVariantPrice = signal<number | null>(null);
  public readonly isFilterPanelOpen = signal<boolean>(false);

  // Trạng thái chọn biến thể sản phẩm (Variant Selection Modal)
  public readonly selectedProductForVariant = signal<any>(null);
  public readonly selectedVariantId = signal<number | null>(null);
  public readonly variantNote = signal<string>('');
  public readonly variantQuantity = signal<number>(1);

  // Giỏ hàng & Yêu thích (Lưu localStorage)
  public readonly cart = signal<CartItem[]>([]);
  public readonly favorites = signal<number[]>([]);

  // Form đặt hàng
  public readonly orderForm = signal<any>({
    customer_name: '',
    customer_phone: '',
    table_number: '',
    payment_method: 'cash',
    note: '',
    selected_payment_method_id: null,
  });
  public readonly isSubmittingOrder = signal<boolean>(false);
  public readonly isQrTable = signal<boolean>(false);

  // Computed values
  public readonly categoryOptions = computed(() => {
    const list = this.categories().map((cat) => ({ value: cat.id, label: cat.name }));
    return [{ value: null, label: 'Tất cả' }, ...list];
  });

  public readonly storeViewModeOptions = computed<TabOption[]>(() => [
    { value: false, label: 'Thực đơn', icon: 'menu' },
    { value: true, label: 'Yêu thích', icon: 'heart', badge: this.favorites().length || undefined },
  ]);

  public readonly displayModeOptions: TabOption[] = [
    { value: 'grid', label: 'Lưới', icon: 'grid' },
    { value: 'list', label: 'Danh sách', icon: 'list' },
  ];

  public readonly cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + price * item.quantity;
    }, 0);
  });

  public readonly shippingFee = computed(() => {
    const settings = this.storeSettings();
    if (!settings || settings.shipping_fee_flat_enabled !== '1') {
      return 0;
    }
    const flatAmount = parseFloat(settings.shipping_fee_flat_amount) || 0;
    const freeEnabled = settings.shipping_fee_free_enabled === '1';
    if (freeEnabled) {
      const minAmount = parseFloat(settings.shipping_fee_free_min_amount) || 0;
      if (this.cartTotal() >= minAmount) {
        return 0;
      }
    }
    return flatAmount;
  });

  public readonly cartTotalWithShipping = computed(() => {
    return this.cartTotal() + this.shippingFee();
  });

  // Lấy các sản phẩm thuộc danh mục đang hoạt động và lọc theo tìm kiếm
  public readonly filteredProducts = computed(() => {
    let list = this.products();
    const favs = this.favorites();

    // Nếu chỉ xem yêu thích
    if (this.showFavoritesOnly()) {
      list = list.filter((p) => favs.includes(p.id));
    } else {
      const activeCatId = this.activeCategoryId();
      if (activeCatId !== null) {
        list = list.filter((product) => {
          return product.categories.some((cat: any) => cat.id === activeCatId);
        });
      }
    }

    // Lọc theo tìm kiếm
    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.short_description && p.short_description.toLowerCase().includes(search)) ||
          (p.barcode && p.barcode.toLowerCase() === search),
      );
    }

    // Lọc theo khoảng giá sản phẩm chính
    const minPrice = this.storeMinPrice();
    if (minPrice !== null && minPrice !== undefined) {
      list = list.filter((p) => p.price >= minPrice);
    }
    const maxPrice = this.storeMaxPrice();
    if (maxPrice !== null && maxPrice !== undefined) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // Lọc theo khoảng giá biến thể sản phẩm
    const minVarPrice = this.storeMinVariantPrice();
    const maxVarPrice = this.storeMaxVariantPrice();
    if (minVarPrice !== null || maxVarPrice !== null) {
      list = list.filter(
        (p) =>
          p.variants &&
          p.variants.length > 0 &&
          p.variants.some((v: any) => {
            const matchMin =
              minVarPrice === null || minVarPrice === undefined || v.price >= minVarPrice;
            const matchMax =
              maxVarPrice === null || maxVarPrice === undefined || v.price <= maxVarPrice;
            return matchMin && matchMax;
          }),
      );
    }

    return list;
  });

  public resetStoreFilters() {
    this.storeMinPrice.set(null);
    this.storeMaxPrice.set(null);
    this.storeMinVariantPrice.set(null);
    this.storeMaxVariantPrice.set(null);
    this.currentPage.set(1);
  }

  // Phân trang sản phẩm hiển thị thực tế
  public readonly paginatedProducts = computed(() => {
    const list = this.filteredProducts();
    const limit = this.itemsPerPage;
    const page = this.currentPage();
    const startIndex = (page - 1) * limit;
    return list.slice(startIndex, startIndex + limit);
  });

  public readonly totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage) || 1;
  });

  ngOnInit() {
    // Đọc slug từ route
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadStoreData(slug);
      } else {
        this.isError.set(true);
        this.errorMessage.set('Đường dẫn không hợp lệ!');
        this.isLoading.set(false);
      }
    });

    // Đọc query parameters (ví dụ: table từ QR code)
    this.route.queryParams.subscribe((params) => {
      const table = params['table'];
      if (table) {
        this.orderForm.update((f) => ({ ...f, table_number: table }));
        this.isQrTable.set(true);
      } else {
        this.isQrTable.set(false);
      }
    });

    // Load giỏ hàng & yêu thích từ localStorage
    this.loadCartFromStorage();
    this.loadFavoritesFromStorage();
  }

  // Tải dữ liệu quán từ API
  private loadStoreData(slug: string) {
    this.isLoading.set(true);
    this.isError.set(false);

    this.apiService.getPublicStoreBySlug(slug).subscribe({
      next: (res) => {
        if (res && res.store) {
          this.storeSettings.set(res.store);
          this.categories.set(res.categories || []);
          this.products.set(res.products || []);
          this.paymentMethods.set(res.payment_methods || []);

          // Cập nhật Title trang web theo tên quán
          const storeName = res.store.store_name || 'Cafe Web3 POS';
          this.titleService.setTitle(storeName);

          // Áp dụng màu sắc động từ settings của quán cho storefront
          this.applyDynamicColors(res.store.primary_color, res.store.secondary_color);

          // Mặc định chọn Tất cả danh mục
          this.activeCategoryId.set(null);

          // Lọc sạch giỏ hàng đối chiếu với danh sách món ăn đang phục vụ
          const activeProducts = res.products || [];
          const currentCart = [...this.cart()];
          let cartChanged = false;
          const updatedCart = currentCart.filter((item) => {
            const activeProd = activeProducts.find((p: any) => p.id === item.product.id);
            if (!activeProd) {
              cartChanged = true;
              return false;
            }
            if (item.variant) {
              const activeVar =
                activeProd.variants &&
                activeProd.variants.find((v: any) => v.id === item.variant.id && v.status);
              if (!activeVar) {
                cartChanged = true;
                return false;
              }
            }
            return true;
          });

          if (cartChanged) {
            this.cart.set(updatedCart);
            this.saveCartToStorage(updatedCart);
            setTimeout(() => {
              this.showFloatingToastSuccess(
                'Một số món ăn trong giỏ hàng đã ngừng phục vụ và được tự động loại bỏ.',
              );
            }, 1000);
          }
        } else {
          this.isError.set(true);
          this.errorMessage.set('Không tìm thấy thông tin cửa hàng!');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isError.set(true);
        const translatedMsg = this.translateErrorMessage(
          err.error?.message || 'Lỗi kết nối máy chủ!',
        );
        this.errorMessage.set(translatedMsg);
        this.isLoading.set(false);
      },
    });
  }

  // Áp dụng biến màu css động
  private applyDynamicColors(primary: string, secondary: string) {
    const root = document.documentElement;
    root.style.setProperty('--dynamic-primary', primary || '#7c3aed');
    root.style.setProperty('--dynamic-secondary', secondary || '#c084fc');
  }

  // --- Quản lý Giỏ hàng ---
  private loadCartFromStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('store_cart');
      if (data) {
        try {
          this.cart.set(JSON.parse(data));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  private saveCartToStorage(cartData: CartItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_cart', JSON.stringify(cartData));
    }
  }

  public addToCart(product: any) {
    // Nếu sản phẩm có biến thể, mở modal chọn biến thể
    if (product.variants && product.variants.length > 0) {
      this.modalService.open(StoreVariantSelectModalComponent, {
        title: `Chọn size: ${product.name}`,
        size: 'sm',
        data: {
          product,
          selectedVariant: product.variants[0],
          variantQuantity: 1,
          variantNote: ''
        }
      }).afterClosed$.subscribe((res: any) => {
        if (res) {
          this.addVariantItemToCart(product, res.variant, res.quantity, res.note);
        }
      });
      return;
    }

    // Nếu không có biến thể, thêm trực tiếp vào giỏ hàng
    const currentCart = [...this.cart()];
    const existIndex = currentCart.findIndex(
      (item) => item.product.id === product.id && !item.variant,
    );

    if (existIndex > -1) {
      currentCart[existIndex].quantity += 1;
    } else {
      currentCart.push({
        product,
        variant: null,
        quantity: 1,
        note: '',
      });
    }

    this.cart.set(currentCart);
    this.saveCartToStorage(currentCart);
    this.showFloatingToastSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  private addVariantItemToCart(product: any, variant: any, qty: number, note: string) {
    const currentCart = [...this.cart()];
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.variant &&
        item.variant.id === variant.id &&
        item.note === note,
    );

    if (existIndex > -1) {
      currentCart[existIndex].quantity += qty;
    } else {
      currentCart.push({
        product,
        variant,
        quantity: qty,
        note,
      });
    }

    this.cart.set(currentCart);
    this.saveCartToStorage(currentCart);
    this.showFloatingToastSuccess(
      `Đã thêm ${product.name} (${variant.variant_name}) vào giỏ hàng!`,
    );
  }

  public submitVariantSelection() {
    const product = this.selectedProductForVariant();
    const variantId = this.selectedVariantId();
    if (!product || !variantId) return;

    const variant = product.variants.find((v: any) => v.id === variantId);
    if (!variant) return;

    const currentCart = [...this.cart()];
    const existIndex = currentCart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.variant &&
        item.variant.id === variant.id &&
        item.note === this.variantNote(),
    );

    const qty = this.variantQuantity();
    const note = this.variantNote().trim();

    if (existIndex > -1) {
      currentCart[existIndex].quantity += qty;
    } else {
      currentCart.push({
        product,
        variant,
        quantity: qty,
        note,
      });
    }

    this.cart.set(currentCart);
    this.saveCartToStorage(currentCart);
    this.selectedProductForVariant.set(null); // Đóng modal
    this.showFloatingToastSuccess(
      `Đã thêm ${product.name} (${variant.variant_name}) vào giỏ hàng!`,
    );
  }

  public updateCartQty(index: number, change: number) {
    const currentCart = [...this.cart()];
    if (index > -1 && index < currentCart.length) {
      currentCart[index].quantity += change;
      if (currentCart[index].quantity <= 0) {
        currentCart.splice(index, 1);
      }
      this.cart.set(currentCart);
      this.saveCartToStorage(currentCart);
    }
  }

  public onCartItemNoteChange() {
    this.saveCartToStorage(this.cart());
  }

  public clearCart() {
    this.cart.set([]);
    this.saveCartToStorage([]);
  }

  // --- Quản lý Yêu thích ---
  private loadFavoritesFromStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('store_favorites');
      if (data) {
        try {
          this.favorites.set(JSON.parse(data));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  public toggleFavorite(productId: number) {
    const current = [...this.favorites()];
    const idx = current.indexOf(productId);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(productId);
    }
    this.favorites.set(current);
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_favorites', JSON.stringify(current));
    }
  }

  public isFavorite(productId: number): boolean {
    return this.favorites().includes(productId);
  }

  public onPhoneInputChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, '');
    this.orderForm.update((f) => ({ ...f, customer_phone: cleaned }));
  }

  // --- Đặt hàng ---
  public placeOrder() {
    if (this.cart().length === 0) return;

    const form = this.orderForm();
    if (!form.customer_name.trim()) {
      this.modalService.confirm({
        title: 'Thông báo',
        description: 'Vui lòng nhập Tên của bạn!',
        confirmText: 'Đóng',
        cancelText: '',
        confirmButtonClass: 'btn-primary'
      });
      return;
    }
    if (!form.customer_phone.trim()) {
      this.modalService.confirm({
        title: 'Thông báo',
        description: 'Vui lòng nhập Số điện thoại liên hệ!',
        confirmText: 'Đóng',
        cancelText: '',
        confirmButtonClass: 'btn-primary'
      });
      return;
    }
    if (!form.table_number.trim()) {
      this.modalService.confirm({
        title: 'Thông báo',
        description: 'Vui lòng nhập Địa chỉ giao hàng!',
        confirmText: 'Đóng',
        cancelText: '',
        confirmButtonClass: 'btn-primary'
      });
      return;
    }
    if (form.payment_method === 'bank_transfer' && !form.selected_payment_method_id) {
      this.modalService.confirm({
        title: 'Thông báo',
        description: 'Vui lòng chọn tài khoản ngân hàng hoặc ví điện tử để chuyển khoản!',
        confirmText: 'Đóng',
        cancelText: '',
        confirmButtonClass: 'btn-primary'
      });
      return;
    }

    this.isSubmittingOrder.set(true);

    // Chuẩn bị danh sách món
    const items = this.cart().map((item) => ({
      product_id: item.product.id,
      product_variant_id: item.variant ? item.variant.id : null,
      quantity: item.quantity,
      note: item.note,
    }));

    // Gộp ghi chú chung của đơn hàng vào table_number hoặc truyền riêng
    const selectedPM = this.getSelectedPaymentMethod();
    let tableInfo = form.table_number.trim();
    if (form.note && form.note.trim()) {
      tableInfo += ` (Ghi chú: ${form.note.trim()})`;
    }
    if (form.payment_method === 'bank_transfer' && selectedPM) {
      tableInfo += ` [Đã CK: ${selectedPM.name} - ${selectedPM.account_number}]`;
    }

    const payload = {
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      table_number: tableInfo,
      payment_method: form.payment_method === 'e_wallet' ? 'bank_transfer' : form.payment_method,
      items,
    };

    const slug = this.storeSettings().website_slug;
    this.apiService.createPublicOrder(slug, payload).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.lastOrderCode.set(res.data.order_code || 'HD-XXXXXX');
          this.clearCart();
          this.isCartOpen.set(false);
          // Reset form
          this.orderForm.set({
            customer_name: '',
            customer_phone: '',
            table_number: '',
            payment_method: 'cash',
            note: '',
            selected_payment_method_id: null,
          });

          this.modalService.open(OrderSuccessModalComponent, {
            title: 'Đặt đơn hàng thành công',
            size: 'sm',
            data: {
              orderCode: this.lastOrderCode()
            }
          });
        }
        this.isSubmittingOrder.set(false);
      },
      error: (err) => {
        console.error(err);
        const translatedMsg = this.translateErrorMessage(err.error?.message);
        this.modalService.confirm({
          title: 'Thông báo',
          description: translatedMsg,
          confirmText: 'Đóng',
          cancelText: '',
          confirmButtonClass: 'btn-primary'
        });
        this.isSubmittingOrder.set(false);
      },
    });
  }

  // Dịch thông báo lỗi tiếng Anh từ API backend sang tiếng Việt cho giao diện frontend storefront
  private translateErrorMessage(msg: string): string {
    if (!msg) return 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';

    const lowerMsg = msg.toLowerCase();

    // Dịch các lỗi phân quyền truy cập website cửa hàng (storefront)
    if (lowerMsg.includes('this store website is currently suspended')) {
      return 'Website cửa hàng này hiện đang bị tạm ngưng hoạt động.';
    }
    if (lowerMsg.includes('this store website service has expired')) {
      return 'Website cửa hàng này đã hết hạn gói dịch vụ.';
    }
    if (lowerMsg.includes("storefront feature is not enabled for this store's subscription plan")) {
      return 'Tính năng Website cửa hàng chưa được kích hoạt cho gói dịch vụ của quán.';
    }

    // Dịch các lỗi phổ biến liên quan đến sản phẩm ngừng phục vụ
    if (lowerMsg.includes('is currently disabled and not available for purchase')) {
      const match = msg.match(/Product '(.*)' is currently disabled/i);
      const prodName = match ? match[1] : 'sản phẩm';
      return `Đặt hàng thất bại: Sản phẩm '${prodName}' hiện đã ngừng phục vụ và không thể chọn mua!`;
    }
    if (lowerMsg.includes('is currently disabled')) {
      const match = msg.match(/Variant '(.*)' of product '(.*)' is currently disabled/i);
      if (match) {
        return `Biến thể '${match[1]}' của sản phẩm '${match[2]}' đã ngừng phục vụ!`;
      }
      return 'Sản phẩm hoặc biến thể này đã ngừng phục vụ!';
    }
    if (lowerMsg.includes('invalid product variant for item')) {
      const match = msg.match(/Invalid product variant for item: (.*)/i);
      const prodName = match ? match[1] : 'sản phẩm';
      return `Biến thể sản phẩm không hợp lệ: ${prodName}`;
    }
    if (lowerMsg.includes("the store's nft voucher program is currently disabled")) {
      return 'Chương trình NFT Voucher của cửa hàng hiện đang tạm dừng!';
    }
    if (lowerMsg.includes('nft vouchers only apply to customers with linked evm wallets')) {
      return 'NFT Voucher chỉ áp dụng cho khách hàng đã liên kết ví EVM!';
    }
    if (lowerMsg.includes('cannot validate nft voucher from the blockchain')) {
      return 'Không thể xác thực NFT Voucher trên blockchain!';
    }
    if (lowerMsg.includes('this nft voucher has already been used or burned on-chain')) {
      return 'NFT Voucher này đã được sử dụng hoặc tiêu hủy trên blockchain!';
    }
    if (lowerMsg.includes('this nft voucher does not belong to the selected customer')) {
      return 'NFT Voucher này không thuộc sở hữu của khách hàng đã chọn!';
    }
    if (lowerMsg.includes('the order total has not reached the minimum value')) {
      return 'Tổng giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng NFT Voucher!';
    }
    if (lowerMsg.includes('cannot redeem nft voucher on the blockchain')) {
      return 'Không thể sử dụng NFT Voucher trên blockchain!';
    }
    if (lowerMsg.includes('failed to place order')) {
      return 'Đặt đơn hàng không thành công. Vui lòng kiểm tra lại!';
    }

    return msg;
  }

  // Helper hiển thị thông báo góc màn hình
  private toastMessage = signal<string>('');
  public get floatingToastMessage() {
    return this.toastMessage;
  }

  private showFloatingToastSuccess(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set('');
      }
    }, 2500);
  }

  public selectStorePaymentMethod(id: number) {
    this.orderForm.update((f) => ({ ...f, selected_payment_method_id: id }));
  }

  public getSelectedPaymentMethod(): any {
    const id = this.orderForm().selected_payment_method_id;
    if (!id) return null;
    return this.paymentMethods().find((pm) => pm.id === id);
  }

  public downloadQrCode(item: any) {
    if (!item) return;
    const url = this.getStoreQrUrl(item);
    const filename = `qrcode-${item.bank_code || item.name}-${item.account_number}.jpg`;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  }

  public getStoreQrUrl(item: any): string {
    if (!item) return '';
    if (item.type === 'bank') {
      return `https://img.vietqr.io/image/${item.bank_code}-${item.account_number}-compact.jpg?accountName=${encodeURIComponent(item.account_holder)}`;
    } else if (item.type === 'wallet' && item.name.toLowerCase() === 'momo') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fnhantien.momo.vn%2F${item.account_number}`;
    } else {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(item.account_number)}`;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateSliderPosition(), 150);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSliderPosition();
  }

  public updateSliderPosition(): void {
    if (!this.categoryButtons || !this.categoriesContainer) return;

    const buttons = this.categoryButtons.toArray();
    const activeIdx = this.categoryOptions().findIndex((opt) => opt.value === this.activeCategoryId());

    if (activeIdx !== -1 && buttons[activeIdx]) {
      const activeEl = buttons[activeIdx].nativeElement;
      this.sliderLeft.set(`${activeEl.offsetLeft}px`);
      this.sliderWidth.set(`${activeEl.offsetWidth}px`);
      this.sliderTop.set(`${activeEl.offsetTop}px`);
      this.sliderHeight.set(`${activeEl.offsetHeight}px`);
      this.sliderOpacity.set(1);

      // Tự động cuộn container để hiển thị tab active nếu bị che khuất
      const container = this.categoriesContainer.nativeElement;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const buttonLeft = activeEl.offsetLeft;
      const buttonWidth = activeEl.offsetWidth;

      if (buttonLeft < scrollLeft) {
        container.scrollTo({ left: buttonLeft - 8, behavior: 'smooth' });
      } else if (buttonLeft + buttonWidth > scrollLeft + containerWidth) {
        container.scrollTo({
          left: buttonLeft + buttonWidth - containerWidth + 8,
          behavior: 'smooth',
        });
      }
    } else {
      this.sliderOpacity.set(0);
    }
  }

  // Bật/tắt hiệu ứng trượt danh mục và lưu vào localStorage (đồng bộ với Sidebar)
  public toggleSlidingEffect() {
    const next = !this.useSlidingEffect();
    this.useSlidingEffect.set(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ui_sliding_effect', String(next));
    }
  }
}
