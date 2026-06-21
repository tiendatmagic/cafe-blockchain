import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Web3Service } from '@core/services/web3.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private readonly apiService = inject(ApiService);
  private readonly web3Service = inject(Web3Service);

  // States danh mục và thực đơn gốc
  public readonly products = signal<any[]>([]);
  public readonly categoriesList = signal<any[]>([]);
  public readonly isProductsLoading = signal<boolean>(false);

  // Bộ lọc sản phẩm tại POS (Di chuyển từ CartStore sang)
  public readonly posCategoryFilter = signal<string>('Tất cả');
  public readonly posSearchQuery = signal<string>('');
  public readonly posMinPrice = signal<number | null>(null);
  public readonly posMaxPrice = signal<number | null>(null);
  public readonly posMinVariantPrice = signal<number | null>(null);
  public readonly posMaxVariantPrice = signal<number | null>(null);
  public readonly posFilterStatus = signal<string>('all'); // 'all' | 'active' | 'inactive'

  // Phân trang sản phẩm POS (Di chuyển từ CartStore sang)
  public readonly posItemsPerPage = 20;
  public readonly posCurrentPage = signal<number>(1);
  public readonly posProductsList = signal<any[]>([]);
  public readonly posTotalPages = signal<number>(1);
  public readonly posTotalItems = signal<number>(0);

  // Bộ nhớ đệm cache sản phẩm POS
  public readonly posProductsCache = new Map<string, { data: any[], totalPages: number, totalItems: number, timestamp: number }>();
  public readonly cacheTTL = 5 * 60 * 1000;

  // Computed properties
  public readonly paginatedPosProducts = computed(() => this.posProductsList());

  /**
   * Tải danh sách sản phẩm và danh mục từ backend
   */
  public refreshProducts(hasPermission: boolean, ttl?: number) {
    if (!this.web3Service.walletConnected()) return;
    if (!hasPermission) return;

    if (this.isProductsLoading()) return;
    this.isProductsLoading.set(true);

    forkJoin({
      products: this.apiService.getProducts(undefined, ttl),
      categories: this.apiService.getCategories(ttl)
    }).subscribe({
      next: (res) => {
        this.products.set(res.products || []);
        this.categoriesList.set(res.categories || []);
        this.isProductsLoading.set(false);
        this.loadPosProducts();
      },
      error: (err) => {
        console.error('[ProductStore] Lỗi tải sản phẩm và danh mục:', err);
        this.isProductsLoading.set(false);
      }
    });
  }

  /**
   * Tải sản phẩm POS có phân trang và Lọc trực tiếp ở Client-side (Không gọi API)
   */
  public loadPosProducts() {
    let list = this.products();

    // 1. Lọc theo danh mục (Category)
    const category = this.posCategoryFilter();
    if (category && category !== 'Tất cả') {
      list = list.filter(p => 
        (p.categories && p.categories.some((c: any) => c.name === category)) ||
        p.category?.category_name === category || 
        p.category_name === category
      );
    }

    // 2. Lọc theo từ khóa tìm kiếm (Search Query) - không phân biệt hoa thường
    const search = this.posSearchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.sku?.toLowerCase().includes(search) ||
        p.barcode?.toLowerCase().includes(search) ||
        p.category?.category_name?.toLowerCase().includes(search)
      );
    }

    // 3. Lọc theo khoảng giá sản phẩm chính
    const minPrice = this.posMinPrice();
    if (minPrice !== null && minPrice !== undefined) {
      list = list.filter(p => p.price >= minPrice);
    }
    const maxPrice = this.posMaxPrice();
    if (maxPrice !== null && maxPrice !== undefined) {
      list = list.filter(p => p.price <= maxPrice);
    }

    // 4. Lọc theo khoảng giá biến thể sản phẩm
    const minVarPrice = this.posMinVariantPrice();
    const maxVarPrice = this.posMaxVariantPrice();
    if (minVarPrice !== null || maxVarPrice !== null) {
      list = list.filter(p => 
        p.variants && p.variants.length > 0 && p.variants.some((v: any) => {
          const matchMin = minVarPrice === null || minVarPrice === undefined || v.price >= minVarPrice;
          const matchMax = maxVarPrice === null || maxVarPrice === undefined || v.price <= maxVarPrice;
          return matchMin && matchMax;
        })
      );
    }

    // 5. Lọc theo trạng thái bật/tắt (Đang bán/Ngừng bán)
    const statusFilter = this.posFilterStatus();
    if (statusFilter === 'active') {
      list = list.filter(p => p.status === true || Number(p.status) === 1);
    } else if (statusFilter === 'inactive') {
      list = list.filter(p => p.status === false || Number(p.status) === 0);
    }

    // Cập nhật tổng số sản phẩm sau khi lọc
    const totalItems = list.length;
    this.posTotalItems.set(totalItems);

    // Tính toán tổng số trang
    const limit = this.posItemsPerPage;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    this.posTotalPages.set(totalPages);

    // 6. Phân trang danh sách sản phẩm
    let page = this.posCurrentPage();
    if (page > totalPages) {
      page = totalPages;
      this.posCurrentPage.set(totalPages);
    }
    const startIndex = (page - 1) * limit;
    const paginatedList = list.slice(startIndex, startIndex + limit);

    // Cập nhật danh sách hiển thị
    this.posProductsList.set(paginatedList);
  }

  public resetPosFilters() {
    this.posMinPrice.set(null);
    this.posMaxPrice.set(null);
    this.posMinVariantPrice.set(null);
    this.posMaxVariantPrice.set(null);
    this.posFilterStatus.set('all');
    this.posCategoryFilter.set('Tất cả');
    this.posCurrentPage.set(1);
    this.loadPosProducts();
  }

  public clearPosProductsCache() {
    this.posProductsCache.clear();
  }
}
