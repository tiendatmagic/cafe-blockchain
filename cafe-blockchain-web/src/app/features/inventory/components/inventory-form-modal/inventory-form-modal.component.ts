import { Component, inject, signal, computed, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-inventory-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabGroupComponent,
    CustomDatePickerComponent,
    CustomSelectComponent,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './inventory-form-modal.component.html',
})
export class InventoryFormModalComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isInventorySaving = signal<boolean>(false);

  public readonly inventoryFormTypeOptions: TabOption[] = [
    { value: 'nhap', label: 'Nhập' },
    { value: 'xuat', label: 'Xuất' },
    { value: 'kiem', label: 'Kiểm' },
  ];

  public readonly inventoryForm = signal<any>({
    type: 'nhap',
    note: '',
    record_date: '',
    items: [],
  });

  public get products() {
    return this.stateService.products;
  }

  // Danh sách sản phẩm bao gồm tùy chọn mặc định cho dropdown
  public readonly inventoryProductOptions = computed(() => [
    { id: 0, name: '-- Chọn món --' },
    ...this.products(),
  ]);

  ngOnInit(): void {
    const initialType = this.modalData?.type || 'nhap';
    this.inventoryForm.set({
      type: initialType,
      note: '',
      record_date: new Date().toISOString().split('T')[0],
      items: [{ product_id: 0, product_variant_id: null, quantity: 1, price: 0 }],
    });
  }

  public addInventoryItemRow(): void {
    this.inventoryForm.update((form) => ({
      ...form,
      items: [...form.items, { product_id: 0, product_variant_id: null, quantity: 1, price: 0 }],
    }));
  }

  public removeInventoryItemRow(index: number): void {
    this.inventoryForm.update((form) => {
      const items = [...form.items];
      items.splice(index, 1);
      return { ...form, items };
    });
  }

  public updateInventoryItemField(index: number, field: string, value: any): void {
    this.inventoryForm.update((form) => {
      const items = [...form.items];
      if (items[index]) {
        let parsedValue = value;
        if (field === 'product_id') {
          parsedValue = Number(value);
          const prod = this.products().find((p) => p.id === parsedValue);
          items[index] = {
            ...items[index],
            product_id: parsedValue,
            product_variant_id:
              prod && prod.variants && prod.variants.length > 0 ? prod.variants[0].id : null,
            price: prod ? prod.price : 0,
          };
        } else if (field === 'product_variant_id') {
          parsedValue = value ? Number(value) : null;
          const prodId = items[index].product_id;
          const prod = this.products().find((p) => p.id === prodId);
          if (prod && prod.variants && parsedValue) {
            const variant = prod.variants.find((v: any) => v.id === parsedValue);
            items[index] = {
              ...items[index],
              product_variant_id: parsedValue,
              price: variant ? variant.price : prod.price,
            };
          } else {
            items[index] = { ...items[index], product_variant_id: parsedValue };
          }
        } else {
          items[index] = {
            ...items[index],
            [field]: field === 'price' || field === 'quantity' ? Number(value) : value,
          };
        }
      }
      return { ...form, items };
    });
  }

  public saveInventoryRecord(): void {
    const form = this.inventoryForm();
    if (!form.record_date || form.items.length === 0) {
      this.stateService.showToast('Vui lòng nhập ngày lập và chọn ít nhất một sản phẩm!', 'error');
      return;
    }

    const invalidItem = form.items.some((item: any) => item.product_id <= 0 || item.quantity <= 0);
    if (invalidItem) {
      this.stateService.showToast(
        'Vui lòng chọn sản phẩm và nhập số lượng hợp lệ cho tất cả các dòng!',
        'error',
      );
      return;
    }

    this.isInventorySaving.set(true);
    this.apiService.createInventoryRecord(form).subscribe({
      next: () => {
        this.stateService.showToast('Tạo phiếu kho thành công!', 'success');
        this.isInventorySaving.set(false);
        this.modalRef.close(true);
      },
      error: () => {
        this.stateService.showToast('Tạo phiếu kho thất bại!', 'error');
        this.isInventorySaving.set(false);
      },
    });
  }

  public getProductVariants(productId: number): any[] {
    const prod = this.products().find((p) => p.id === Number(productId));
    return prod && prod.variants ? prod.variants : [];
  }

  public getProductVariantsOptions(productId: number): any[] {
    const variants = this.getProductVariants(productId);
    return variants.map((v: any) => {
      const formattedPrice = new Intl.NumberFormat('en-US').format(v.price) + 'đ';
      return {
        id: v.id,
        label: `${v.variant_name} (${formattedPrice})`,
      };
    });
  }
}
