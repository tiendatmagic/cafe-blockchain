import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { StateService } from '@core/services/state.service';
import { ModalService } from '@core/services/modal.service';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BarcodeScannerModalComponent } from '@shared/components/barcode-scanner-modal/barcode-scanner-modal.component';

export interface ProductFormModalData {
  product: any | null;
  typeFilter: 'product' | 'ingredient';
}

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabGroupComponent,
    CustomSelectComponent,
    CustomCheckboxComponent,
    CustomSwitchComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './product-form-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProductFormModalComponent implements OnInit {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<ProductFormModalData>(MODAL_DATA);

  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);

  public readonly productTypeOptions: TabOption[] = [
    { value: 'product', label: 'Món ăn' },
    { value: 'ingredient', label: 'Nguyên vật liệu' },
  ];

  public readonly unitSuggestions = [
    { value: '', label: 'Trống' },
    { value: 'Cái', label: 'Cái' },
    { value: 'Hộp', label: 'Hộp' },
    { value: 'Ly', label: 'Ly' },
    { value: 'Bịch', label: 'Bịch' },
    { value: 'Kg', label: 'Kg' },
    { value: 'g', label: 'g' },
    { value: 'ml', label: 'ml' },
  ];

  public form: any = {
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
    recipes: [],
    tax_rate: '',
  };

  public readonly taxOptions = [
    { value: '', label: 'Theo cấu hình quán' },
    { value: 0, label: 'Miễn thuế (0%)' },
    { value: 8, label: 'Thuế suất 8%' },
    { value: 10, label: 'Thuế suất 10%' },
  ];

  public readonly isLoading = signal<boolean>(false);
  public readonly isUploadingImage = signal<boolean>(false);
  public readonly showUrlInput = signal<boolean>(false);

  public get categoriesList() {
    return this.stateService.categoriesList;
  }

  public get products() {
    return this.stateService.products;
  }

  public readonly isProductLimitReached = computed(() => {
    const maxProducts = this.stateService.getFeatureLimit('max_products');
    return maxProducts >= 0 && this.products().length >= maxProducts;
  });

  ngOnInit() {
    const p = this.data.product;
    if (p) {
      this.form = {
        type: p.type || 'product',
        sku: p.sku || '',
        barcode: p.barcode || '',
        unit: p.unit || '',
        name: p.name || '',
        price: p.price || 0,
        cost_price: p.cost_price || 0,
        category_ids: p.categories ? p.categories.map((c: any) => c.id) : [],
        image: p.image || '',
        status: p.status !== false && p.status !== 0,
        short_description: p.short_description || '',
        description: p.description || '',
        variants: p.variants ? p.variants.map((v: any) => ({ ...v })) : [],
        recipes: p.recipes ? p.recipes.map((r: any) => ({ ...r })) : [],
        tax_rate: p.tax_rate !== undefined && p.tax_rate !== null ? p.tax_rate : '',
      };
    } else {
      this.form.type = this.data.typeFilter || 'product';
    }
  }

  public updateField(field: string, value: any) {
    this.form[field] = field === 'price' || field === 'cost_price' ? Number(value) : value;
  }

  public toggleFormCategory(categoryId: number) {
    const currentIds: number[] = this.form.category_ids || [];
    const index = currentIds.indexOf(categoryId);
    if (index > -1) {
      this.form.category_ids = currentIds.filter((id) => id !== categoryId);
    } else {
      this.form.category_ids = [...currentIds, categoryId];
    }
  }

  public isCategorySelected(categoryId: number): boolean {
    const ids = this.form.category_ids || [];
    return ids.includes(categoryId);
  }

  public addVariantRow() {
    this.form.variants = [
      ...(this.form.variants || []),
      { variant_name: '', price: 0, cost_price: 0, status: true },
    ];
  }

  public removeVariantRow(index: number) {
    const list = [...(this.form.variants || [])];
    list.splice(index, 1);
    this.form.variants = list;
  }

  public addRecipeRow() {
    this.form.recipes = [
      ...(this.form.recipes || []),
      { ingredient_id: 0, product_variant_id: null, quantity: 1 },
    ];
  }

  public removeRecipeRow(index: number) {
    const list = [...(this.form.recipes || [])];
    list.splice(index, 1);
    this.form.recipes = list;
  }

  public updateRecipeField(index: number, field: string, value: any) {
    const list = [...(this.form.recipes || [])];
    if (list[index]) {
      list[index] = {
        ...list[index],
        [field]: field === 'quantity' ? Number(value) : value ? Number(value) : null,
      };
    }
    this.form.recipes = list;
  }

  public ingredientOptions = computed(() => {
    return this.products().filter((p) => p.type === 'ingredient');
  });

  public getIngredientUnit(ingredientId: number): string {
    const ing = this.products().find((p) => p.id === Number(ingredientId));
    return ing ? ing.unit || 'g/ml' : 'g/ml';
  }

  public startBarcodeScan() {
    this.modalService
      .open(BarcodeScannerModalComponent, {
        title: 'Quét mã vạch sản phẩm',
        size: 'sm',
      })
      .afterClosed$.subscribe((barcode) => {
        if (barcode) {
          this.form.barcode = barcode;
        }
      });
  }

  public onSubmit() {
    if (this.isLoading()) return;

    const isIngredient = this.form.type === 'ingredient';
    const hasVariants = !isIngredient && this.form.variants && this.form.variants.length > 0;

    if (!this.form.name) {
      this.toastService.showToast('Vui lòng điền tên món ăn!', 'error');
      return;
    }

    if (!isIngredient && !hasVariants && this.form.price <= 0) {
      this.toastService.showToast('Vui lòng điền đơn giá hợp lệ!', 'error');
      return;
    }

    if (this.form.type === 'product' && this.form.recipes && this.form.recipes.length > 0) {
      const hasInvalidRecipe = this.form.recipes.some((r: any) => !r.ingredient_id || r.quantity <= 0);
      if (hasInvalidRecipe) {
        this.toastService.showToast('Vui lòng chọn nguyên vật liệu và nhập định lượng lớn hơn 0!', 'error');
        return;
      }
    }

    this.isLoading.set(true);

    // Compute payload with parsed numbers and null for empty tax_rate
    const payload = { ...this.form };
    if (payload.tax_rate === '') {
      payload.tax_rate = null;
    } else if (payload.tax_rate !== null) {
      payload.tax_rate = Number(payload.tax_rate);
    }

    if (!this.data.product) {
      // Add product
      const maxProducts = this.stateService.getFeatureLimit('max_products');
      if (maxProducts >= 0 && this.products().length >= maxProducts) {
        this.toastService.showToast(
          `Gói cước hiện tại chỉ hỗ trợ tối đa ${maxProducts} sản phẩm/nguyên vật liệu. Vui lòng nâng cấp gói cước!`,
          'error'
        );
        this.isLoading.set(false);
        return;
      }
      this.apiService.createProduct(payload).subscribe({
        next: () => {
          this.toastService.showToast('Thêm món thành công!', 'success');
          this.isLoading.set(false);
          this.modalRef.close(true);
        },
        error: (err) => {
          const isLimitError = err.error?.message?.includes('subscription plan has reached the maximum limit');
          if (!isLimitError) {
            this.toastService.showToast('Thêm món thất bại!', 'error');
          }
          this.isLoading.set(false);
        },
      });
    } else {
      // Edit product
      this.apiService.updateProduct(this.data.product.id, payload).subscribe({
        next: () => {
          this.toastService.showToast('Cập nhật món thành công!', 'success');
          this.isLoading.set(false);
          this.modalRef.close(true);
        },
        error: (err) => {
          const isLimitError = err.error?.message?.includes('subscription plan has reached the maximum limit');
          if (!isLimitError) {
            this.toastService.showToast('Cập nhật món thất bại!', 'error');
          }
          this.isLoading.set(false);
        },
      });
    }
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate định dạng ảnh ở client
    if (!file.type.startsWith('image/')) {
      this.toastService.showToast('Vui lòng chọn tệp tin hình ảnh hợp lệ (PNG, JPG, WebP...)!', 'error');
      return;
    }

    // Validate dung lượng ảnh gốc tối đa 5MB trước khi nén ở server
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.toastService.showToast('Dung lượng ảnh gốc không được vượt quá 5MB!', 'error');
      return;
    }

    this.isUploadingImage.set(true);

    this.apiService.uploadProductImage(file).subscribe({
      next: (res) => {
        this.form.image = res.url;
        this.toastService.showToast('Tải ảnh lên thành công!', 'success');
        this.isUploadingImage.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Tải ảnh lên thất bại!';
        this.toastService.showToast(errorMsg, 'error');
        this.isUploadingImage.set(false);
      }
    });
  }

  public removeImage() {
    this.form.image = '';
  }

  public toggleUrlInput() {
    this.showUrlInput.set(!this.showUrlInput());
  }

  public onCancel() {
    this.modalRef.close(false);
  }
}
