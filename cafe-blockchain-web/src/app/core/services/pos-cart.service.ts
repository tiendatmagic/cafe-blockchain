import { Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductStore } from '@features/menu/store/product.store';
import { CartStore } from '@features/pos/store/cart.store';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PosCartService {
  private readonly productStore = inject(ProductStore);
  private readonly cartStore = inject(CartStore);
  private readonly toastService = inject(ToastService);

  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Cần expose các signal/state từ store ra ngoài để dễ truy cập
  public readonly products = this.productStore.products;
  public readonly posSearchQuery = this.productStore.posSearchQuery;
  public readonly posCurrentPage = this.productStore.posCurrentPage;

  constructor() {
    this.initSearchDebounce();
  }

  private initSearchDebounce() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((val) => {
      this.posSearchQuery.set(val);
      this.posCurrentPage.set(1);
      this.productStore.loadPosProducts();
    });
  }

  public onSearchQueryChange(query: string) {
    this.searchSubject.next(query);
  }

  public loadPosProducts() {
    this.productStore.loadPosProducts();
  }

  public resetPosFilters() {
    this.productStore.resetPosFilters();
  }

  public clearPosProductsCache() {
    this.productStore.clearPosProductsCache();
  }

  public clearCart() {
    this.cartStore.clearCart();
  }

  public editOrder(order: any) {
    this.cartStore.editOrder(order, this.products(), (msg, type) => this.toastService.showToast(msg, type));
  }

  public cancelEditOrder() {
    this.cartStore.cancelEditOrder((msg, type) => this.toastService.showToast(msg, type));
  }

  public destroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
