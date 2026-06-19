import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { Component, inject, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';

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
    ConfirmModalComponent,
    PageHeaderComponent,
    ModalComponent,
    CustomSwitchComponent,
    CustomSelectComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  public readonly productTypeOptions: TabOption[] = [
    { value: 'product', label: 'Món ăn' },
    { value: 'ingredient', label: 'Nguyên vật liệu' }
  ];

  public readonly mainProductTypeOptions: TabOption[] = [
    { value: 'product', label: 'Món ăn', icon: 'menu' },
    { value: 'ingredient', label: 'Nguyên vật liệu', icon: 'scale' }
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

  // Cấu hình gợi ý đơn vị tính
  public readonly unitSuggestions = [
    { value: '', label: 'Trống' },
    { value: 'Cái', label: 'Cái' },
    { value: 'Hộp', label: 'Hộp' }
  ];

  // Cấu hình View Mode & Phân trang Thực đơn
  public readonly menuViewMode = signal<'table' | 'card'>('card');
  public readonly menuCurrentPage = signal<number>(1);
  public readonly menuItemsPerPage = 9;

  public readonly menuViewModeOptions: TabOption[] = [
    { value: 'card', label: 'Dạng thẻ', icon: 'grid' },
    { value: 'table', label: 'Dạng bảng', icon: 'list' }
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

  // Trạng thái quét barcode bằng camera
  public readonly isBarcodeScannerOpen = signal<boolean>(false);
  public readonly isScannerLoading = signal<boolean>(false);
  public readonly scannerError = signal<string>('');
  private html5Qrcode: any = null;

  public readonly menuForm = signal<any>({
    type: 'product',
    sku: '',
    barcode: '',
    unit: '',
    name: '',
    price: 0,
    cost_price: 0,
    category_ids: [],
    image: '',
    status: true,
    short_description: '',
    description: '',
    variants: [],
    recipes: []
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
      const type = this.menuProductTypeFilter();
      const matchType = (p.type || 'product') === type;

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
        matchVarPrice = p.variants && p.variants.length > 0 && p.variants.some((v: any) => {
          const matchMin = minVarPrice === null || minVarPrice === undefined || v.price >= minVarPrice;
          const matchMax = maxVarPrice === null || maxVarPrice === undefined || v.price <= maxVarPrice;
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

      return matchType && matchCategory && matchSearch && matchMinPrice && matchMaxPrice && matchVarPrice && matchStatus;
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
  public readonly menuTotalPages = computed(() => Math.ceil(this.filteredProducts().length / this.menuItemsPerPage));
  public readonly paginatedProducts = computed(() => {
    const start = (this.menuCurrentPage() - 1) * this.menuItemsPerPage;
    return this.filteredProducts().slice(start, start + this.menuItemsPerPage);
  });

  public readonly isProductLimitReached = computed(() => {
    const maxProducts = this.stateService.getFeatureLimit('max_products');
    return maxProducts >= 0 && this.products().length >= maxProducts;
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
    const maxProducts = this.stateService.getFeatureLimit('max_products');
    if (maxProducts >= 0 && this.products().length >= maxProducts) {
      this.stateService.showToast(`Gói cước hiện tại chỉ hỗ trợ tối đa ${maxProducts} sản phẩm/nguyên vật liệu. Vui lòng nâng cấp gói cước!`, 'error');
      return;
    }
    this.menuModalType.set('add');
    this.menuForm.set({
      type: this.menuProductTypeFilter(),
      sku: '',
      barcode: '',
      unit: '',
      name: '',
      price: 0,
      cost_price: 0,
      category_ids: [],
      image: '',
      status: true,
      short_description: '',
      description: '',
      variants: [],
      recipes: []
    });
    this.isMenuModalOpen.set(true);
  }

  // Mở modal sửa món
  public openEditMenuModal(product: any) {
    this.menuModalType.set('edit');
    this.editingProduct.set(product);
    this.menuForm.set({
      type: product.type || 'product',
      sku: product.sku || '',
      barcode: product.barcode || '',
      unit: product.unit || '',
      name: product.name,
      price: product.price,
      cost_price: product.cost_price || 0,
      category_ids: product.categories ? product.categories.map((c: any) => c.id) : [],
      image: product.image,
      status: product.status,
      short_description: product.short_description || '',
      description: product.description || '',
      variants: product.variants ? product.variants.map((v: any) => ({ ...v })) : [],
      recipes: product.recipes ? product.recipes.map((r: any) => ({ ...r })) : []
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

  // Cấu hình Recipe (Định lượng nguyên vật liệu) trong form
  public addRecipeRow() {
    this.menuForm.update(form => ({
      ...form,
      recipes: [...(form.recipes || []), { ingredient_id: 0, product_variant_id: null, quantity: 1 }]
    }));
  }

  public removeRecipeRow(index: number) {
    this.menuForm.update(form => {
      const list = [...(form.recipes || [])];
      list.splice(index, 1);
      return { ...form, recipes: list };
    });
  }

  public updateRecipeField(index: number, field: string, value: any) {
    this.menuForm.update(form => {
      const list = [...(form.recipes || [])];
      if (list[index]) {
        list[index] = {
          ...list[index],
          [field]: field === 'quantity' ? Number(value) : (value ? Number(value) : null)
        };
      }
      return { ...form, recipes: list };
    });
  }

  // Danh sách các nguyên vật liệu có sẵn (để chọn trong dropdown định lượng)
  public readonly ingredientOptions = computed(() => {
    return this.products().filter(p => p.type === 'ingredient');
  });

  public getIngredientUnit(ingredientId: number): string {
    const ing = this.products().find(p => p.id === Number(ingredientId));
    return ing ? (ing.unit || 'g/ml') : 'g/ml';
  }

  // Lưu món ăn qua API
  public saveProduct() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const formData = this.menuForm();
    const isIngredient = formData.type === 'ingredient';
    const hasVariants = !isIngredient && formData.variants && formData.variants.length > 0;

    if (!formData.name) {
      this.stateService.showToast('Vui lòng điền tên món ăn!', 'error');
      return;
    }

    if (!isIngredient && !hasVariants && formData.price <= 0) {
      this.stateService.showToast('Vui lòng điền đơn giá hợp lệ!', 'error');
      return;
    }

    // Validate recipes nếu là product
    if (formData.type === 'product' && formData.recipes && formData.recipes.length > 0) {
      const hasInvalidRecipe = formData.recipes.some((r: any) => !r.ingredient_id || r.quantity <= 0);
      if (hasInvalidRecipe) {
        this.stateService.showToast('Vui lòng chọn nguyên vật liệu và nhập định lượng lớn hơn 0!', 'error');
        return;
      }
    }

    this.isProductSaving.set(true);
    if (this.menuModalType() === 'add') {
      const maxProducts = this.stateService.getFeatureLimit('max_products');
      if (maxProducts >= 0 && this.products().length >= maxProducts) {
        this.stateService.showToast(`Gói cước hiện tại chỉ hỗ trợ tối đa ${maxProducts} sản phẩm/nguyên vật liệu. Vui lòng nâng cấp gói cước!`, 'error');
        this.isProductSaving.set(false);
        return;
      }
      this.apiService.createProduct(formData).subscribe({
        next: (res) => {
          this.stateService.showToast('Thêm món thành công!', 'success');
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
          this.stateService.showToast('Cập nhật món thành công!', 'success');
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
    if (this.html5Qrcode && this.html5Qrcode.isScanning) {
      this.html5Qrcode.stop().catch((err: any) => console.error(err));
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

  /**
   * Các phương thức quét mã vạch (Barcode) qua Camera
   */
  public startBarcodeScan() {
    this.isBarcodeScannerOpen.set(true);
    this.isScannerLoading.set(true);
    this.scannerError.set('');

    setTimeout(() => {
      this.initScanner();
    }, 300);
  }

  private initScanner() {
    try {
      this.html5Qrcode = new Html5Qrcode("barcode-scanner-reader", {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        verbose: false
      });

      const config = {
        fps: 10,
        qrbox: (width: number, height: number) => {
          return { width: Math.min(width * 0.8, 250), height: Math.min(height * 0.4, 100) };
        },
        aspectRatio: 1.777778
      };

      this.html5Qrcode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string, decodedResult: any) => {
          this.updateMenuForm('barcode', decodedText);
          this.stateService.showToast(`Đã quét mã vạch: ${decodedText}`, 'success');
          this.stopBarcodeScan();
        },
        (errorMessage: string) => {
          // Bỏ qua các lỗi quét định kỳ khi chưa nhận diện
        }
      ).then(() => {
        this.isScannerLoading.set(false);
      }).catch((err: any) => {
        console.error('Không khởi động được camera:', err);
        this.scannerError.set('Không thể truy cập camera. Vui lòng cấp quyền camera cho trình duyệt.');
        this.isScannerLoading.set(false);
      });
    } catch (e: any) {
      console.error('Lỗi khởi tạo quét:', e);
      this.scannerError.set('Có lỗi xảy ra: ' + e.message);
      this.isScannerLoading.set(false);
    }
  }

  public onBarcodeFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.isScannerLoading.set(true);
    this.scannerError.set('');

    const runFileScan = async (fileToScan: File) => {
      try {
        // Tắt camera nếu đang chạy
        if (this.html5Qrcode && this.html5Qrcode.isScanning) {
          await this.html5Qrcode.stop();
        }

        // Tạo thực thể mới nếu chưa có
        if (!this.html5Qrcode) {
          this.html5Qrcode = new Html5Qrcode("barcode-scanner-reader", {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.QR_CODE
            ],
            verbose: false
          });
        }

        const decodedText = await this.html5Qrcode.scanFile(fileToScan, false);
        this.updateMenuForm('barcode', decodedText);
        this.stateService.showToast(`Đã nhận diện mã vạch từ ảnh: ${decodedText}`, 'success');
        this.stopBarcodeScan();
      } catch (err: any) {
        console.error('Lỗi quét file ảnh:', err);
        this.scannerError.set('Không tìm thấy mã vạch hợp lệ trong ảnh này. Vui lòng chụp rõ nét hơn!');
        this.isScannerLoading.set(false);
      }
    };

    // Tự động vẽ thêm viền trắng (Quiet Zone) xung quanh ảnh mã vạch trước khi giải mã
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const padding = 40; // Quiet Zone 40px ở mỗi phía
          canvas.width = img.width + padding * 2;
          canvas.height = img.height + padding * 2;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Không thể khởi tạo Canvas 2D Context');
          }

          // Tô màu nền trắng
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Vẽ ảnh gốc vào chính giữa canvas
          ctx.drawImage(img, padding, padding);

          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: file.type || 'image/jpeg',
                lastModified: Date.now()
              });
              runFileScan(processedFile);
            } else {
              runFileScan(file); // Fallback quét file gốc nếu tạo blob lỗi
            }
          }, file.type || 'image/jpeg');
        } catch (canvasErr) {
          console.error('Lỗi xử lý canvas Quiet Zone:', canvasErr);
          runFileScan(file); // Fallback
        }
      };
      img.onerror = () => runFileScan(file);
      img.src = e.target.result;
    };
    reader.onerror = () => runFileScan(file);
    reader.readAsDataURL(file);
  }

  public stopBarcodeScan() {
    if (this.html5Qrcode && this.html5Qrcode.isScanning) {
      this.html5Qrcode.stop().then(() => {
        this.html5Qrcode.clear();
        this.html5Qrcode = null;
        this.isBarcodeScannerOpen.set(false);
      }).catch((err: any) => {
        console.error('Lỗi tắt camera:', err);
        this.html5Qrcode = null;
        this.isBarcodeScannerOpen.set(false);
      });
    } else {
      this.html5Qrcode = null;
      this.isBarcodeScannerOpen.set(false);
    }
  }
}
