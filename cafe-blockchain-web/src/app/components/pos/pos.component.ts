import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pos.component.html'
})
export class PosComponent {
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

  // Getters từ StateService để sử dụng trực tiếp trong template HTML
  public get web3Service() { return this.stateService.web3Service; }
  public get cart() { return this.stateService.cart; }
  public get cartTotal() { return this.stateService.cartTotal; }
  public get tableNumber() { return this.stateService.tableNumber; }
  public get paymentMethod() { return this.stateService.paymentMethod; }
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
  public readonly posCashReturn = computed(() => Math.max(0, this.customerCashGiven() - this.cartTotal()));
  public readonly posDebtAmount = computed(() => this.isDebtPayment() ? Math.max(0, this.cartTotal() - this.customerCashGiven()) : 0);
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
    this.customerCashGiven.set(this.cartTotal());
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

  // Tạo hoặc Cập nhật đơn hàng từ POS
  public submitOrder() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!', 'error');
      return;
    }

    if (this.cart().length === 0) {
      this.stateService.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    this.isOrderSubmitting.set(true);
    const orderData = {
      table_number: this.tableNumber(),
      payment_method: this.paymentMethod(),
      items: this.cart().map(item => ({
        product_id: item.product.id,
        product_variant_id: item.variant ? item.variant.id : null,
        quantity: item.quantity
      }))
    };

    const editId = this.editingOrderId();

    if (editId !== null) {
      this.apiService.updateOrder(editId, orderData).subscribe({
        next: (res) => {
          this.stateService.showToast('Cập nhật đơn hàng thành công!', 'success');
          this.stateService.clearCart();
          this.editingOrderId.set(null);
          this.isOrderSubmitting.set(false);
          this.stateService.refreshOrders();
          this.stateService.activeTab.set('orders'); // Chuyển sang orders
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
          this.stateService.activeTab.set('orders'); // Chuyển sang orders
        },
        error: (err) => {
          console.error('Lỗi đặt đơn:', err);
          this.stateService.showToast('Không thể tạo đơn hàng. Vui lòng kiểm tra lại!', 'error');
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
