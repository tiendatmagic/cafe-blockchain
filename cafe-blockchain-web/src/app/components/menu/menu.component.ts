import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Cấu hình View Mode & Phân trang Thực đơn
  public readonly menuViewMode = signal<'table' | 'card'>('card');
  public readonly menuCurrentPage = signal<number>(1);
  public readonly menuItemsPerPage = 9;

  // Form Quản lý Thực đơn (Món ăn)
  public readonly isMenuModalOpen = signal<boolean>(false);
  public readonly menuModalType = signal<'add' | 'edit'>('add');
  public readonly editingProduct = signal<any>(null);
  public readonly isProductSaving = signal<boolean>(false);
  public readonly isProductDeleting = signal<boolean>(false);
  public readonly deletingProductData = signal<any>(null);
  public readonly isDeleteProductConfirmOpen = signal<boolean>(false);

  public readonly menuForm = signal<any>({
    sku: '',
    name: '',
    price: 0,
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

  // Computed properties phục vụ phân trang client
  public readonly menuTotalPages = computed(() => Math.ceil(this.products().length / this.menuItemsPerPage));
  public readonly paginatedProducts = computed(() => {
    const start = (this.menuCurrentPage() - 1) * this.menuItemsPerPage;
    return this.products().slice(start, start + this.menuItemsPerPage);
  });

  // Cập nhật giá trị một trường trong menuForm
  public updateMenuForm(field: string, value: any) {
    this.menuForm.update(form => ({
      ...form,
      [field]: field === 'price' ? Number(value) : value
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
      variants: [...(form.variants || []), { variant_name: '', price: 0, status: true }]
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
          [field]: field === 'price' ? Number(value) : value
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

  // Helpers cho template HTML
  public getPagesArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  // Set MenuViewMode
  public setMenuViewMode(mode: 'table' | 'card') {
    this.menuViewMode.set(mode);
  }
}
