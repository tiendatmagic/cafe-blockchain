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

  // Computed properties
  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => {
      const price = item.variant ? item.variant.price : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  });

  // Methods
  public clearCart() {
    this.cart.set([]);
    this.tableNumber.set('');
    this.paymentMethod.set('cash');
    this.posSelectedCustomer.set(null);
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
