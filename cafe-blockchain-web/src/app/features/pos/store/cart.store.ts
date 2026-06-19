import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly router = inject(Router);

  // States của Giỏ hàng POS
  public readonly cart = signal<{ product: any, variant: any | null, quantity: number, note?: string }[]>([]);
  public readonly tableNumber = signal<string>('');
  public readonly paymentMethod = signal<string>('cash');
  public readonly posSelectedCustomer = signal<any | null>(null);
  public readonly editingOrderId = signal<number | null>(null);
  public readonly isOrderSubmitting = signal<boolean>(false);

  // Bộ lọc sản phẩm tại POS
  public readonly posCategoryFilter = signal<string>('Tất cả');
  public readonly posSearchQuery = signal<string>('');
  public readonly posMinPrice = signal<number | null>(null);
  public readonly posMaxPrice = signal<number | null>(null);
  public readonly posMinVariantPrice = signal<number | null>(null);
  public readonly posMaxVariantPrice = signal<number | null>(null);
  public readonly posFilterStatus = signal<string>('all'); // 'all' | 'active' | 'inactive'

  // Phân trang sản phẩm POS
  public readonly posItemsPerPage = 20;
  public readonly posCurrentPage = signal<number>(1);
  public readonly posProductsList = signal<any[]>([]);
  public readonly posTotalPages = signal<number>(1);
  public readonly posTotalItems = signal<number>(0);

  // Bộ nhớ đệm cache sản phẩm POS
  public readonly posProductsCache = new Map<string, { data: any[], totalPages: number, totalItems: number, timestamp: number }>();
  public readonly cacheTTL = 5 * 60 * 1000;

  // Computed properties
  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  });

  public readonly paginatedPosProducts = computed(() => this.posProductsList());

  // Methods
  public clearCart() {
    this.cart.set([]);
    this.tableNumber.set('');
    this.paymentMethod.set('cash');
    this.posSelectedCustomer.set(null);
  }

  public clearPosProductsCache() {
    this.posProductsCache.clear();
  }

  public resetPosFilters(loadProductsCallback: () => void) {
    this.posMinPrice.set(null);
    this.posMaxPrice.set(null);
    this.posMinVariantPrice.set(null);
    this.posMaxVariantPrice.set(null);
    this.posFilterStatus.set('all');
    this.posCategoryFilter.set('Tất cả');
    this.posCurrentPage.set(1);
    loadProductsCallback();
  }

  public editOrder(order: any, productsList: any[], showToastCallback: (msg: string, type: 'success' | 'error') => void) {
    if (!order) return;

    this.isOrderSubmitting.set(true);
    this.posSelectedCustomer.set(order.customer || null);

    const loadedCart: { product: any, variant: any | null, quantity: number, note?: string }[] = [];

    order.items.forEach((item: any) => {
      const product = productsList.find(p => Number(p.id) === Number(item.product_id));
      if (product) {
        let variant: any = null;
        if (item.product_variant_id && product.variants) {
          variant = product.variants.find((v: any) => Number(v.id) === Number(item.product_variant_id)) || null;
        }
        loadedCart.push({
          product,
          variant,
          quantity: Number(item.quantity) || 1,
          note: item.note || ''
        });
      }
    });

    this.cart.set(loadedCart);
    this.tableNumber.set(order.table_number || '');
    this.paymentMethod.set(order.payment_method || 'cash');
    this.editingOrderId.set(order.id);

    this.router.navigate(['/pos']);
    showToastCallback(`Đang chỉnh sửa đơn hàng ${order.order_code || ('#' + order.id)}`, 'success');
    this.isOrderSubmitting.set(false);
  }

  public cancelEditOrder(showToastCallback: (msg: string, type: 'success' | 'error') => void) {
    this.clearCart();
    this.editingOrderId.set(null);
    this.router.navigate(['/orders']);
    showToastCallback('Đã hủy chỉnh sửa đơn hàng', 'success');
  }
}
