import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Title } from '@angular/platform-browser';
import { StateService } from '../../services/state.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { VNDCurrencyPipe } from '../../pipes/vnd.pipe';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { MiniButtonsComponent } from '../mini-buttons/mini-buttons.component';

interface CartItem {
  product: any;
  variant: any | null;
  quantity: number;
  note: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent, VNDCurrencyPipe, ThemeToggleComponent, MiniButtonsComponent],
  templateUrl: './store.component.html',
  styleUrls: []
})
export class StoreComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly titleService = inject(Title);
  private readonly stateService = inject(StateService);

  // Dữ liệu quán
  public readonly storeSettings = signal<any>(null);
  public readonly categories = signal<any[]>([]);
  public readonly products = signal<any[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isError = signal<boolean>(false);
  public readonly errorMessage = signal<string>('');

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
    note: ''
  });
  public readonly isSubmittingOrder = signal<boolean>(false);

  // Computed values
  public readonly categoryOptions = computed(() => {
    const list = this.categories().map(cat => ({ value: cat.id, label: cat.name }));
    return [{ value: null, label: 'Tất cả' }, ...list];
  });

  public readonly cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  });

  // Lấy các sản phẩm thuộc danh mục đang hoạt động và lọc theo tìm kiếm
  public readonly filteredProducts = computed(() => {
    let list = this.products();
    const favs = this.favorites();
    
    // Nếu chỉ xem yêu thích
    if (this.showFavoritesOnly()) {
      list = list.filter(p => favs.includes(p.id));
    } else {
      const activeCatId = this.activeCategoryId();
      if (activeCatId !== null) {
        list = list.filter(product => {
          return product.categories.some((cat: any) => cat.id === activeCatId);
        });
      }
    }

    // Lọc theo tìm kiếm
    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        (p.short_description && p.short_description.toLowerCase().includes(search))
      );
    }

    return list;
  });

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
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadStoreData(slug);
      } else {
        this.isError.set(true);
        this.errorMessage.set('Đường dẫn không hợp lệ!');
        this.isLoading.set(false);
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

          // Cập nhật Title trang web theo tên quán
          const storeName = res.store.store_name || 'Cafe Web3 POS';
          this.titleService.setTitle(storeName);

          // Áp dụng màu sắc động từ settings của quán cho storefront
          this.applyDynamicColors(res.store.primary_color, res.store.secondary_color);

          // Mặc định chọn Tất cả danh mục
          this.activeCategoryId.set(null);
        } else {
          this.isError.set(true);
          this.errorMessage.set('Không tìm thấy thông tin cửa hàng!');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isError.set(true);
        this.errorMessage.set(err.error?.message || 'Lỗi kết nối máy chủ!');
        this.isLoading.set(false);
      }
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
      this.selectedProductForVariant.set(product);
      this.selectedVariantId.set(product.variants[0].id);
      this.variantQuantity.set(1);
      this.variantNote.set('');
      return;
    }

    // Nếu không có biến thể, thêm trực tiếp vào giỏ hàng
    const currentCart = [...this.cart()];
    const existIndex = currentCart.findIndex(item => item.product.id === product.id && !item.variant);

    if (existIndex > -1) {
      currentCart[existIndex].quantity += 1;
    } else {
      currentCart.push({
        product,
        variant: null,
        quantity: 1,
        note: ''
      });
    }

    this.cart.set(currentCart);
    this.saveCartToStorage(currentCart);
    this.showFloatingToastSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  public submitVariantSelection() {
    const product = this.selectedProductForVariant();
    const variantId = this.selectedVariantId();
    if (!product || !variantId) return;

    const variant = product.variants.find((v: any) => v.id === variantId);
    if (!variant) return;

    const currentCart = [...this.cart()];
    const existIndex = currentCart.findIndex(item => 
      item.product.id === product.id && 
      item.variant && 
      item.variant.id === variant.id &&
      item.note === this.variantNote()
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
        note
      });
    }

    this.cart.set(currentCart);
    this.saveCartToStorage(currentCart);
    this.selectedProductForVariant.set(null); // Đóng modal
    this.showFloatingToastSuccess(`Đã thêm ${product.name} (${variant.variant_name}) vào giỏ hàng!`);
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

  // --- Đặt hàng ---
  public placeOrder() {
    if (this.cart().length === 0) return;

    const form = this.orderForm();
    if (!form.customer_name.trim()) {
      alert('Vui lòng nhập Tên của bạn!');
      return;
    }
    if (!form.customer_phone.trim()) {
      alert('Vui lòng nhập Số điện thoại liên hệ!');
      return;
    }
    if (!form.table_number.trim()) {
      alert('Vui lòng nhập Địa chỉ giao hàng!');
      return;
    }

    this.isSubmittingOrder.set(true);

    // Chuẩn bị danh sách món
    const items = this.cart().map(item => ({
      product_id: item.product.id,
      product_variant_id: item.variant ? item.variant.id : null,
      quantity: item.quantity,
      note: item.note
    }));

    // Gộp ghi chú chung của đơn hàng vào table_number hoặc truyền riêng
    let tableInfo = form.table_number.trim();
    if (form.note && form.note.trim()) {
      tableInfo += ` (Ghi chú: ${form.note.trim()})`;
    }

    const payload = {
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      table_number: tableInfo,
      payment_method: form.payment_method,
      items
    };

    const slug = this.storeSettings().website_slug;
    this.apiService.createPublicOrder(slug, payload).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.lastOrderCode.set(res.data.order_code || 'HD-XXXXXX');
          this.isOrderSuccess.set(true);
          this.clearCart();
          this.isCartOpen.set(false);
          // Reset form
          this.orderForm.set({
            customer_name: '',
            customer_phone: '',
            table_number: '',
            payment_method: 'cash',
            note: ''
          });
        }
        this.isSubmittingOrder.set(false);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        this.isSubmittingOrder.set(false);
      }
    });
  }

  // Helper hiển thị thông báo góc màn hình
  private toastMessage = signal<string>('');
  public get floatingToastMessage() { return this.toastMessage; }

  private showFloatingToastSuccess(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set('');
      }
    }, 2500);
  }
}
