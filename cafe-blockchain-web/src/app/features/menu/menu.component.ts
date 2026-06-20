import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalService } from '@core/services/modal.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ProductFormModalComponent } from './components/product-form-modal/product-form-modal.component';
import { CategoryFormModalComponent } from './components/category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PaginationComponent,
    ShortAddressPipe,
    PageHeaderComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly modalService = inject(ModalService);

  public readonly productTypeOptions: TabOption[] = [
    { value: 'product', label: 'Món ăn' },
    { value: 'ingredient', label: 'Nguyên vật liệu' },
  ];

  public readonly mainProductTypeOptions: TabOption[] = [
    { value: 'product', label: 'Món ăn', icon: 'menu' },
    { value: 'ingredient', label: 'Nguyên vật liệu', icon: 'scale' },
  ];

  constructor() {
    // Re-check quyền khi settings (menuRegistryContractAddress) vừa được load xong
    effect(() => {
      const addr = this.web3Service.menuRegistryContractAddress();
      if (addr) {
        this.checkMenuRegistryOwnerPermission();
      }
    });

    // Re-check quyền khi ví vừa đăng nhập/xác thực xong (walletConnected thay đổi sang true)
    effect(() => {
      const connected = this.web3Service.walletConnected();
      if (connected) {
        this.checkMenuRegistryOwnerPermission();
      }
    });
  }

  // Cấu hình View Mode & Phân trang Thực đơn
  public readonly menuViewMode = signal<'table' | 'card'>('card');
  public readonly menuCurrentPage = signal<number>(1);
  public readonly menuItemsPerPage = 9;

  public readonly menuViewModeOptions: TabOption[] = [
    { value: 'card', label: 'Dạng thẻ', icon: 'grid' },
    { value: 'table', label: 'Dạng bảng', icon: 'list' },
  ];

  // Bộ lọc & Tìm kiếm Thực đơn cục bộ
  public readonly menuSearchQuery = signal<string>('');
  public readonly menuCategoryFilter = signal<string>('Tất cả');
  public readonly menuProductTypeFilter = signal<'product' | 'ingredient'>('product');
  public readonly menuMinPrice = signal<number | null>(null);
  public readonly menuMaxPrice = signal<number | null>(null);
  public readonly menuMinVariantPrice = signal<number | null>(null);
  public readonly menuMaxVariantPrice = signal<number | null>(null);
  public readonly menuFilterStatus = signal<string>('all'); // 'all' | 'active' | 'inactive'
  public readonly isFilterPanelOpen = signal<boolean>(false);

  // Đồng bộ Blockchain Menu signals
  public readonly isMenuSyncing = signal<boolean>(false);
  public readonly isOwnerMenuRegistry = signal<boolean>(false);
  private accountSubscription: any;

  // Lịch sử đồng bộ thực đơn
  public readonly menuSyncLogs = signal<any[]>([]);
  public readonly isMenuSyncLogsLoading = signal<boolean>(false);
  public readonly menuSyncLogsError = signal<string>('');

  // Getters từ StateService để liên kết mượt mà
  public get web3Service() {
    return this.stateService.web3Service;
  }
  public get products() {
    return this.stateService.products;
  }
  public get categoriesList() {
    return this.stateService.categoriesList;
  }
  public get isProductsLoading() {
    return this.stateService.isProductsLoading;
  }

  // Danh mục có 'Tất cả' ở đầu
  public readonly categories = computed(() => {
    const list = this.categoriesList().map((c) => c.name);
    return ['Tất cả', ...list];
  });

  // Lọc sản phẩm cục bộ tức thời tại client
  public readonly filteredProducts = computed(() => {
    return this.products().filter((p) => {
      const type = this.menuProductTypeFilter();
      const matchType = (p.type || 'product') === type;

      const category = this.menuCategoryFilter();
      const matchCategory =
        category === 'Tất cả' ||
        (p.categories && p.categories.some((c: any) => c.name === category)) ||
        p.category_name === category ||
        p.category?.category_name === category;

      const search = this.menuSearchQuery().trim().toLowerCase();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search) ||
        (p.short_description && p.short_description.toLowerCase().includes(search));

      // Lọc theo khoảng giá sản phẩm chính
      const minPrice = this.menuMinPrice();
      const matchMinPrice = minPrice === null || minPrice === undefined || p.price >= minPrice;
      const maxPrice = this.menuMaxPrice();
      const matchMaxPrice = maxPrice === null || maxPrice === undefined || p.price <= maxPrice;

      // Lọc theo khoảng giá biến thể sản phẩm
      const minVarPrice = this.menuMinVariantPrice();
      const maxVarPrice = this.menuMaxVariantPrice();
      let matchVarPrice = true;
      if (minVarPrice !== null || maxVarPrice !== null) {
        matchVarPrice =
          p.variants &&
          p.variants.length > 0 &&
          p.variants.some((v: any) => {
            const matchMin =
              minVarPrice === null || minVarPrice === undefined || v.price >= minVarPrice;
            const matchMax =
              maxVarPrice === null || maxVarPrice === undefined || v.price <= maxVarPrice;
            return matchMin && matchMax;
          });
      }

      // Lọc theo trạng thái bật/tắt (Đang bán/Ngừng bán)
      const statusFilter = this.menuFilterStatus();
      let matchStatus = true;
      if (statusFilter === 'active') {
        matchStatus = p.status === true || Number(p.status) === 1;
      } else if (statusFilter === 'inactive') {
        matchStatus = p.status === false || Number(p.status) === 0;
      }

      return (
        matchType &&
        matchCategory &&
        matchSearch &&
        matchMinPrice &&
        matchMaxPrice &&
        matchVarPrice &&
        matchStatus
      );
    });
  });

  public resetMenuFilters() {
    this.menuMinPrice.set(null);
    this.menuMaxPrice.set(null);
    this.menuMinVariantPrice.set(null);
    this.menuMaxVariantPrice.set(null);
    this.menuFilterStatus.set('all');
    this.menuCategoryFilter.set('Tất cả');
    this.menuCurrentPage.set(1);
  }

  // Computed properties phục vụ phân trang client dựa trên sản phẩm đã lọc
  public readonly menuTotalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.menuItemsPerPage),
  );
  public readonly paginatedProducts = computed(() => {
    const start = (this.menuCurrentPage() - 1) * this.menuItemsPerPage;
    return this.filteredProducts().slice(start, start + this.menuItemsPerPage);
  });

  public readonly isProductLimitReached = computed(() => {
    const maxProducts = this.stateService.getFeatureLimit('max_products');
    return maxProducts >= 0 && this.products().length >= maxProducts;
  });

  // Mở modal thêm món
  public openAddMenuModal() {
    this.modalService
      .open(ProductFormModalComponent, {
        title: 'Thêm món ăn mới',
        size: 'lg',
        data: {
          product: null,
          typeFilter: this.menuProductTypeFilter(),
        },
      })
      .afterClosed$.subscribe((success) => {
        if (success) {
          this.stateService.clearPosProductsCache();
          this.stateService.refreshProducts();
        }
      });
  }

  // Mở modal sửa món
  public openEditMenuModal(product: any) {
    this.modalService
      .open(ProductFormModalComponent, {
        title: 'Chỉnh sửa món ăn',
        size: 'lg',
        data: {
          product,
          typeFilter: this.menuProductTypeFilter(),
        },
      })
      .afterClosed$.subscribe((success) => {
        if (success) {
          this.stateService.clearPosProductsCache();
          this.stateService.refreshProducts();
        }
      });
  }

  // Xóa món ăn
  public deleteProduct(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const product = this.products().find((p) => p.id === id);
    if (!product) return;

    this.modalService
      .confirm({
        title: 'Xóa món ăn',
        description: `Bạn có chắc chắn muốn xóa món "${product.name}" khỏi thực đơn không?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy',
      })
      .afterClosed$.subscribe((confirmed) => {
        if (confirmed) {
          this.apiService.deleteProduct(product.id).subscribe({
            next: () => {
              this.stateService.showToast('Xóa món ăn khỏi thực đơn thành công!', 'success');
              this.stateService.clearPosProductsCache();
              this.stateService.refreshProducts();
            },
            error: (err) => {
              const errMsg = err.error?.message || 'Xóa món thất bại!';
              this.stateService.showToast(errMsg, 'error');
            },
          });
        }
      });
  }

  // Quản lý danh mục động
  public openAddCategoryModal() {
    this.modalService
      .open(CategoryFormModalComponent, {
        title: 'Thêm danh mục mới',
        size: 'md',
        data: { category: null },
      })
      .afterClosed$.subscribe((success) => {
        if (success) {
          this.stateService.refreshProducts();
          this.stateService.clearPosProductsCache();
        }
      });
  }

  public editCategory(category: any) {
    this.modalService
      .open(CategoryFormModalComponent, {
        title: 'Chỉnh sửa danh mục',
        size: 'md',
        data: { category },
      })
      .afterClosed$.subscribe((success) => {
        if (success) {
          this.stateService.refreshProducts();
          this.stateService.clearPosProductsCache();
        }
      });
  }

  public deleteCategory(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const category = this.categoriesList().find((c) => c.id === id);
    if (!category) return;

    this.modalService
      .confirm({
        title: 'Xóa danh mục',
        description: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy',
      })
      .afterClosed$.subscribe((confirmed) => {
        if (confirmed) {
          this.apiService.deleteCategory(category.id).subscribe({
            next: () => {
              this.stateService.showToast('Xóa danh mục thành công!', 'success');
              this.stateService.refreshProducts();
              this.stateService.clearPosProductsCache();
            },
            error: (err) => {
              const errMsg = err.error?.message || 'Xóa danh mục thất bại!';
              this.stateService.showToast(errMsg, 'error');
            },
          });
        }
      });
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

  // Set MenuViewMode
  public setMenuViewMode(mode: 'table' | 'card') {
    this.menuViewMode.set(mode);
  }

  public ngOnInit() {
    if (!this.stateService.hasFeature('enable_menu')) {
      return;
    }
    this.checkMenuRegistryOwnerPermission();
    this.loadMenuSyncLogs();

    // Lắng nghe ví thay đổi tài khoản
    this.accountSubscription = this.web3Service.accountsChanged$.subscribe(() => {
      this.checkMenuRegistryOwnerPermission();
    });
  }

  public ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  /**
   * Kiểm tra quyền quản trị Menu Registry của ví hiện tại
   */
  public async checkMenuRegistryOwnerPermission() {
    if (
      this.web3Service.walletConnected() &&
      this.web3Service.currentAccount() &&
      this.web3Service.menuRegistryContractAddress()
    ) {
      const isOwner = await this.web3Service.checkIsOwnerOfMenuRegistry(
        this.web3Service.currentAccount(),
      );
      this.isOwnerMenuRegistry.set(isOwner);
    } else {
      this.isOwnerMenuRegistry.set(false);
    }
  }

  /**
   * Đồng bộ toàn bộ thực đơn hiện tại của quán lên Blockchain (Menu Registry)
   */

  public async syncMenuToBlockchain() {
    // Guard ngay lập tức: nếu đang syncing thì bỏ qua để chống spam click
    if (this.isMenuSyncing()) return;

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 trước!', 'error');
      return;
    }

    if (!this.web3Service.menuRegistryContractAddress()) {
      this.stateService.showToast(
        'Hợp đồng Menu Registry chưa được deploy hoặc chưa cấu hình! Vui lòng vào Cài đặt thiết lập trước.',
        'error',
      );
      return;
    }

    const productList = this.products();
    if (productList.length === 0) {
      this.stateService.showToast(
        'Thực đơn hiện tại của quán đang trống, không có gì để đồng bộ!',
        'error',
      );
      return;
    }

    // Khóa nút ngay lập tức trước khi bất kỳ await nào
    this.isMenuSyncing.set(true);

    try {
      // Kiểm tra quyền owner (async - blockchain call)
      await this.checkMenuRegistryOwnerPermission();
      if (!this.isOwnerMenuRegistry()) {
        this.stateService.showToast(
          'Ví của bạn không có quyền quản trị (Owner) hợp đồng Menu Registry này!',
          'error',
        );
        this.isMenuSyncing.set(false);
        return;
      }

      this.stateService.showToast('Đang kiểm tra dữ liệu thực đơn so với Blockchain...', 'success');

      try {
        const chainData = await this.web3Service.getAllMenuProductsFromChain();
        const chainProducts = chainData?.products || [];

        // Tạo fingerprint cho sản phẩm local (chỉ so sánh các thông tin có lưu trên Blockchain để tránh bug luôn báo lệch khi có variants)
        const getLocalFingerprint = (p: any): string => {
          const basePrice =
            p.variants && p.variants.length > 0
              ? Math.min(...p.variants.map((v: any) => Number(v.price) || 0))
              : Number(p.price) || 0;
          const status = p.status === undefined ? true : !!p.status;
          return `${p.sku}||${p.name}||${basePrice}||${status}||`;
        };

        // Tạo fingerprint cho sản phẩm chain
        const getChainFingerprint = (p: any): string => {
          const status = p.status === undefined ? true : !!p.status;
          return `${p.sku}||${p.name}||${Number(p.price) || 0}||${status}||`;
        };

        let hasChanged = false;
        if (productList.length !== chainProducts.length) {
          hasChanged = true;
        } else {
          // So sánh theo sku (không phụ thuộc vị trí index)
          const chainMap = new Map<string, any>();
          for (const cp of chainProducts) {
            chainMap.set(cp.sku, cp);
          }

          for (const local of productList) {
            const chain = chainMap.get(local.sku);
            if (!chain) {
              hasChanged = true;
              break;
            }
            const localFp = getLocalFingerprint(local);
            const chainFp = getChainFingerprint(chain);
            if (localFp !== chainFp) {
              hasChanged = true;
              break;
            }
          }
        }

        if (!hasChanged) {
          this.stateService.showToast(
            'Thực đơn trên Blockchain đã trùng khớp hoàn toàn với thực đơn hiện tại. Không cần đồng bộ!',
            'success',
          );
          this.isMenuSyncing.set(false);
          return;
        }
      } catch (err) {
        console.warn('Không thể so sánh thực đơn onchain, bỏ qua và tiến hành đồng bộ:', err);
      }

      this.stateService.showToast(
        'Vui lòng xác nhận giao dịch đồng bộ Thực đơn trên ví của bạn...',
        'success',
      );

      const res = await this.web3Service.updateMenuOnChain(productList);

      if (res.success && res.txHash) {
        this.stateService.showToast(
          `Đồng bộ thực đơn lên Blockchain thành công! Hash: ${res.txHash}`,
          'success',
        );

        // Ghi nhận lịch sử đồng bộ vào Backend (offchain log)
        this.apiService
          .createMenuSyncLog({
            synced_by: this.web3Service.currentAccount(),
            tx_hash: res.txHash,
            product_count: productList.length,
            chain_id: this.web3Service.configuredChainId(),
          })
          .subscribe({
            next: () => {
              this.loadMenuSyncLogs();
            },
            error: (err) => console.error('Lỗi ghi nhận lịch sử đồng bộ:', err),
          });

        // Cập nhật cấu hình đã đồng bộ menu vào Laravel Backend
        this.apiService
          .updateSettings({
            ...this.stateService.settings(),
            has_synced_menu: '1',
          })
          .subscribe({
            next: (settingsRes) => {
              this.stateService.settings.set(settingsRes.data);
            },
            error: (err) => {
              console.error('Lỗi cập nhật trạng thái has_synced_menu lên backend:', err);
            },
          });
      } else {
        this.stateService.showToast(res.error || 'Đồng bộ thực đơn thất bại!', 'error');
      }
    } finally {
      // Luôn reset trạng thái loading dù thành công hay lỗi
      this.isMenuSyncing.set(false);
    }
  }

  /**
   * Tải lịch sử đồng bộ thực đơn từ Backend
   */
  public loadMenuSyncLogs() {
    if (!this.web3Service.walletConnected()) return;
    this.isMenuSyncLogsLoading.set(true);
    this.menuSyncLogsError.set('');
    this.apiService.getMenuSyncLogs().subscribe({
      next: (logs) => {
        this.menuSyncLogs.set(logs);
        this.isMenuSyncLogsLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải lịch sử đồng bộ:', err);
        this.menuSyncLogsError.set('Không thể tải lịch sử. Vui lòng thử lại.');
        this.isMenuSyncLogsLoading.set(false);
      },
    });
  }

  /**
   * Định dạng ngày giờ hiển thị
   */
  public formatSyncDate(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // Note: Các hàm quét mã vạch đã được tách biệt vào BarcodeScannerModalComponent
}
