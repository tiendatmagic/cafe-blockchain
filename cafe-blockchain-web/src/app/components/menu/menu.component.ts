import { Web3ConnectPromptComponent } from '../web3-connect-prompt/web3-connect-prompt.component';
import { Component, inject, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ShortAddressPipe } from '../../pipes/short-address.pipe';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    PaginationComponent,
    ShortAddressPipe,
    ConfirmModalComponent,
    PageHeaderComponent,
    ModalComponent
  ],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

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

  // Bộ lọc & Tìm kiếm Thực đơn cục bộ
  public readonly menuSearchQuery = signal<string>('');
  public readonly menuCategoryFilter = signal<string>('Tất cả');

  // Form Quản lý Thực đơn (Món ăn)
  public readonly isMenuModalOpen = signal<boolean>(false);
  public readonly menuModalType = signal<'add' | 'edit'>('add');
  public readonly editingProduct = signal<any>(null);
  public readonly isProductSaving = signal<boolean>(false);
  public readonly isProductDeleting = signal<boolean>(false);
  public readonly deletingProductData = signal<any>(null);
  public readonly isDeleteProductConfirmOpen = signal<boolean>(false);

  // Đồng bộ Blockchain Menu signals
  public readonly isMenuSyncing = signal<boolean>(false);
  public readonly isOwnerMenuRegistry = signal<boolean>(false);
  private accountSubscription: any;

  // Lịch sử đồng bộ thực đơn
  public readonly menuSyncLogs = signal<any[]>([]);
  public readonly isMenuSyncLogsLoading = signal<boolean>(false);
  public readonly menuSyncLogsError = signal<string>('');

  public readonly menuForm = signal<any>({
    sku: '',
    name: '',
    price: 0,
    cost_price: 0,
    category_ids: [],
    image: '',
    status: true,
    short_description: '',
    description: '',
    variants: []
  });

  // Form Quản lý Danh mục
  public readonly isCategoryModalOpen = signal<boolean>(false);
  public readonly isCategoryLoading = signal<boolean>(false);
  public readonly isDeleteCategoryConfirmOpen = signal<boolean>(false);
  public readonly deletingCategoryData = signal<any>(null);

  public readonly categoryForm = signal<any>({
    id: null,
    name: ''
  });

  // Getters từ StateService để liên kết mượt mà
  public get web3Service() { return this.stateService.web3Service; }
  public get products() { return this.stateService.products; }
  public get categoriesList() { return this.stateService.categoriesList; }
  public get isProductsLoading() { return this.stateService.isProductsLoading; }

  // Danh mục có 'Tất cả' ở đầu
  public readonly categories = computed(() => {
    const list = this.categoriesList().map(c => c.name);
    return ['Tất cả', ...list];
  });

  // Lọc sản phẩm cục bộ tức thời tại client
  public readonly filteredProducts = computed(() => {
    return this.products().filter(p => {
      const category = this.menuCategoryFilter();
      const matchCategory = category === 'Tất cả' || 
                            (p.categories && p.categories.some((c: any) => c.name === category)) || 
                            p.category_name === category || 
                            p.category?.category_name === category;
                            
      const search = this.menuSearchQuery().trim().toLowerCase();
      const matchSearch = !search || 
                          p.name.toLowerCase().includes(search) || 
                          p.sku?.toLowerCase().includes(search) || 
                          (p.short_description && p.short_description.toLowerCase().includes(search));
                          
      return matchCategory && matchSearch;
    });
  });

  // Computed properties phục vụ phân trang client dựa trên sản phẩm đã lọc
  public readonly menuTotalPages = computed(() => Math.ceil(this.filteredProducts().length / this.menuItemsPerPage));
  public readonly paginatedProducts = computed(() => {
    const start = (this.menuCurrentPage() - 1) * this.menuItemsPerPage;
    return this.filteredProducts().slice(start, start + this.menuItemsPerPage);
  });

  // Cập nhật giá trị một trường trong menuForm
  public updateMenuForm(field: string, value: any) {
    this.menuForm.update(form => ({
      ...form,
      [field]: (field === 'price' || field === 'cost_price') ? Number(value) : value
    }));
  }

  // Toggle switch trạng thái hoạt động món ăn
  public toggleMenuFormStatus() {
    this.menuForm.update(form => ({
      ...form,
      status: !form.status
    }));
  }

  // Mở modal thêm món
  public openAddMenuModal() {
    this.menuModalType.set('add');
    this.menuForm.set({
      sku: '',
      name: '',
      price: 0,
      cost_price: 0,
      category_ids: [],
      image: '',
      status: true,
      short_description: '',
      description: '',
      variants: []
    });
    this.isMenuModalOpen.set(true);
  }

  // Mở modal sửa món
  public openEditMenuModal(product: any) {
    this.menuModalType.set('edit');
    this.editingProduct.set(product);
    this.menuForm.set({
      sku: product.sku || '',
      name: product.name,
      price: product.price,
      cost_price: product.cost_price || 0,
      category_ids: product.categories ? product.categories.map((c: any) => c.id) : [],
      image: product.image,
      status: product.status,
      short_description: product.short_description || '',
      description: product.description || '',
      variants: product.variants ? product.variants.map((v: any) => ({ ...v })) : []
    });
    this.isMenuModalOpen.set(true);
  }

  // Đóng modal thêm/sửa món
  public closeMenuModal() {
    this.isMenuModalOpen.set(false);
    this.editingProduct.set(null);
  }

  // Biến thể sản phẩm (Kích thước / Size) trong form
  public addVariantRow() {
    this.menuForm.update(form => ({
      ...form,
      variants: [...(form.variants || []), { variant_name: '', price: 0, cost_price: 0, status: true }]
    }));
  }

  public removeVariantRow(index: number) {
    this.menuForm.update(form => {
      const list = [...(form.variants || [])];
      list.splice(index, 1);
      return { ...form, variants: list };
    });
  }

  public updateVariantField(index: number, field: string, value: any) {
    this.menuForm.update(form => {
      const list = [...(form.variants || [])];
      if (list[index]) {
        list[index] = {
          ...list[index],
          [field]: (field === 'price' || field === 'cost_price') ? Number(value) : value
        };
      }
      return { ...form, variants: list };
    });
  }

  // Lưu món ăn qua API
  public saveProduct() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const formData = this.menuForm();
    const hasVariants = formData.variants && formData.variants.length > 0;
    if (!formData.name || (!hasVariants && formData.price <= 0)) {
      this.stateService.showToast('Vui lòng điền tên và đơn giá hợp lệ!', 'error');
      return;
    }

    this.isProductSaving.set(true);
    if (this.menuModalType() === 'add') {
      this.apiService.createProduct(formData).subscribe({
        next: (res) => {
          this.stateService.showToast('Thêm món ăn thành công!', 'success');
          this.closeMenuModal();
          this.stateService.clearPosProductsCache();
          this.stateService.refreshProducts();
          this.isProductSaving.set(false);
        },
        error: (err) => {
          this.stateService.showToast('Thêm món thất bại!', 'error');
          this.isProductSaving.set(false);
        }
      });
    } else {
      const id = this.editingProduct().id;
      this.apiService.updateProduct(id, formData).subscribe({
        next: (res) => {
          this.stateService.showToast('Cập nhật món ăn thành công!', 'success');
          this.closeMenuModal();
          this.stateService.clearPosProductsCache();
          this.stateService.refreshProducts();
          this.isProductSaving.set(false);
        },
        error: (err) => {
          this.stateService.showToast('Cập nhật món thất bại!', 'error');
          this.isProductSaving.set(false);
        }
      });
    }
  }

  // Xóa món ăn
  public deleteProduct(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const product = this.products().find(p => p.id === id);
    if (product) {
      this.triggerDeleteProduct(product);
    }
  }

  public triggerDeleteProduct(product: any) {
    this.deletingProductData.set(product);
    this.isDeleteProductConfirmOpen.set(true);
  }

  public confirmDeleteProduct() {
    if (this.isProductDeleting()) return;

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const product = this.deletingProductData();
    if (!product) return;

    this.isProductDeleting.set(true);
    this.apiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa món ăn khỏi thực đơn thành công!', 'success');
        this.isDeleteProductConfirmOpen.set(false);
        this.deletingProductData.set(null);
        this.stateService.clearPosProductsCache();
        this.stateService.refreshProducts();
        this.isProductDeleting.set(false);
      },
      error: (err) => {
        console.error(err);
        const errMsg = err.error?.message || 'Xóa món thất bại!';
        this.stateService.showToast(errMsg, 'error');
        this.isProductDeleting.set(false);
      }
    });
  }

  // Chọn/gỡ danh mục trong Form
  public toggleFormCategory(categoryId: number) {
    const form = this.menuForm();
    const currentIds: number[] = form.category_ids || [];
    const index = currentIds.indexOf(categoryId);
    if (index > -1) {
      const updated = currentIds.filter(id => id !== categoryId);
      this.menuForm.set({ ...form, category_ids: updated });
    } else {
      const updated = [...currentIds, categoryId];
      this.menuForm.set({ ...form, category_ids: updated });
    }
  }

  public isCategorySelected(categoryId: number): boolean {
    const ids = this.menuForm().category_ids || [];
    return ids.includes(categoryId);
  }

  // Quản lý danh mục động
  public openAddCategoryModal() {
    this.resetCategoryForm();
    this.isCategoryModalOpen.set(true);
  }

  public openEditCategoryModal(category: any) {
    this.categoryForm.set({
      id: category.id,
      name: category.name
    });
    this.isCategoryModalOpen.set(true);
  }

  public closeCategoryModal() {
    this.isCategoryModalOpen.set(false);
    this.resetCategoryForm();
  }

  public editCategory(category: any) {
    this.openEditCategoryModal(category);
  }

  public resetCategoryForm() {
    this.categoryForm.set({
      id: null,
      name: ''
    });
  }

  public saveCategory() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const form = this.categoryForm();
    if (!form.name.trim()) {
      this.stateService.showToast('Vui lòng nhập tên danh mục!', 'error');
      return;
    }

    this.isCategoryLoading.set(true);
    if (form.id) {
      this.apiService.updateCategory(form.id, { name: form.name.trim() }).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật danh mục thành công!', 'success');
          this.closeCategoryModal();
          this.stateService.refreshProducts();
          this.stateService.clearPosProductsCache();
          this.isCategoryLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.stateService.showToast('Cập nhật danh mục thất bại! Tên danh mục có thể đã tồn tại.', 'error');
          this.isCategoryLoading.set(false);
        }
      });
    } else {
      this.apiService.createCategory({ name: form.name.trim() }).subscribe({
        next: () => {
          this.stateService.showToast('Tạo danh mục mới thành công!', 'success');
          this.closeCategoryModal();
          this.stateService.refreshProducts();
          this.stateService.clearPosProductsCache();
          this.isCategoryLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.stateService.showToast('Tạo danh mục mới thất bại! Tên danh mục có thể đã tồn tại.', 'error');
          this.isCategoryLoading.set(false);
        }
      });
    }
  }

  public deleteCategory(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const category = this.categoriesList().find(c => c.id === id);
    if (category) {
      this.triggerDeleteCategory(category);
    }
  }

  public triggerDeleteCategory(category: any) {
    this.deletingCategoryData.set(category);
    this.isDeleteCategoryConfirmOpen.set(true);
  }

  public confirmDeleteCategory() {
    if (this.isCategoryLoading()) return;

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const category = this.deletingCategoryData();
    if (!category) return;

    this.isCategoryLoading.set(true);
    this.apiService.deleteCategory(category.id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa danh mục thành công!', 'success');
        this.isDeleteCategoryConfirmOpen.set(false);
        this.deletingCategoryData.set(null);
        this.stateService.refreshProducts();
        this.stateService.clearPosProductsCache();
        this.isCategoryLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        const errMsg = err.error?.message || 'Xóa danh mục thất bại!';
        this.stateService.showToast(errMsg, 'error');
        this.isCategoryLoading.set(false);
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
    if (this.web3Service.walletConnected() && this.web3Service.currentAccount() && this.web3Service.menuRegistryContractAddress()) {
      const isOwner = await this.web3Service.checkIsOwnerOfMenuRegistry(this.web3Service.currentAccount());
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
      this.stateService.showToast('Hợp đồng Menu Registry chưa được deploy hoặc chưa cấu hình! Vui lòng vào Cài đặt thiết lập trước.', 'error');
      return;
    }

    const productList = this.products();
    if (productList.length === 0) {
      this.stateService.showToast('Thực đơn hiện tại của quán đang trống, không có gì để đồng bộ!', 'error');
      return;
    }

    // Khóa nút ngay lập tức trước khi bất kỳ await nào
    this.isMenuSyncing.set(true);

    try {
      // Kiểm tra quyền owner (async - blockchain call)
      await this.checkMenuRegistryOwnerPermission();
      if (!this.isOwnerMenuRegistry()) {
        this.stateService.showToast('Ví của bạn không có quyền quản trị (Owner) hợp đồng Menu Registry này!', 'error');
        this.isMenuSyncing.set(false);
        return;
      }

      this.stateService.showToast('Đang kiểm tra dữ liệu thực đơn so với Blockchain...', 'success');

      try {
        const chainData = await this.web3Service.getAllMenuProductsFromChain();
        const chainProducts = chainData?.products || [];

        // Tạo fingerprint cho sản phẩm local (chỉ so sánh các thông tin có lưu trên Blockchain để tránh bug luôn báo lệch khi có variants)
        const getLocalFingerprint = (p: any): string => {
          const basePrice = (p.variants && p.variants.length > 0)
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
          this.stateService.showToast('Thực đơn trên Blockchain đã trùng khớp hoàn toàn với thực đơn hiện tại. Không cần đồng bộ!', 'success');
          this.isMenuSyncing.set(false);
          return;
        }
      } catch (err) {
        console.warn('Không thể so sánh thực đơn onchain, bỏ qua và tiến hành đồng bộ:', err);
      }

      this.stateService.showToast('Vui lòng xác nhận giao dịch đồng bộ Thực đơn trên ví của bạn...', 'success');

      const res = await this.web3Service.updateMenuOnChain(productList);

      if (res.success && res.txHash) {
        this.stateService.showToast(`Đồng bộ thực đơn lên Blockchain thành công! Hash: ${res.txHash}`, 'success');

        // Ghi nhận lịch sử đồng bộ vào Backend (offchain log)
        this.apiService.createMenuSyncLog({
          synced_by: this.web3Service.currentAccount(),
          tx_hash: res.txHash,
          product_count: productList.length,
          chain_id: this.web3Service.configuredChainId()
        }).subscribe({
          next: () => {
            console.log('Đã ghi nhận lịch sử đồng bộ thực đơn.');
            this.loadMenuSyncLogs();
          },
          error: (err) => console.error('Lỗi ghi nhận lịch sử đồng bộ:', err)
        });

        // Cập nhật cấu hình đã đồng bộ menu vào Laravel Backend
        this.apiService.updateSettings({
          ...this.stateService.settings(),
          has_synced_menu: '1'
        }).subscribe({
          next: (settingsRes) => {
            this.stateService.settings.set(settingsRes.data);
            console.log('Đã cập nhật trạng thái has_synced_menu lên backend.');
          },
          error: (err) => {
            console.error('Lỗi cập nhật trạng thái has_synced_menu lên backend:', err);
          }
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
      }
    });
  }



  /**
   * Định dạng ngày giờ hiển thị
   */
  public formatSyncDate(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}
