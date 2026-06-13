import { Web3ConnectPromptComponent } from '../web3-connect-prompt/web3-connect-prompt.component';
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { VNDCurrencyPipe } from '../../pipes/vnd.pipe';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    PaginationComponent,
    ConfirmModalComponent,
    PageHeaderComponent,
    VNDCurrencyPipe,
    CustomDatePickerComponent
  ],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Bộ lọc, phân trang kho
  public readonly inventoryTypeFilter = signal<string>('all');
  public readonly inventoryCurrentPage = signal<number>(1);
  public readonly inventoryItemsPerPage = 9;

  // Bộ tìm kiếm Kho hàng
  public readonly inventorySearchQuery = signal<string>('');

  // Form & Modals Kho hàng
  public readonly isInventoryModalOpen = signal<boolean>(false);
  public readonly isInventoryDetailModalOpen = signal<boolean>(false);
  public readonly isInventorySaving = signal<boolean>(false);
  public readonly isInventoryDropdownOpen = signal<boolean>(false);
  public readonly selectedInventoryRecord = signal<any>(null);
  public readonly isDeleteRecordConfirmOpen = signal<boolean>(false);
  public readonly deletingRecord = signal<any>(null);

  public readonly inventoryForm = signal<any>({
    type: 'nhap',
    note: '',
    record_date: '',
    items: []
  });

  // Getters từ StateService
  public get products() { return this.stateService.products; }
  public get orders() { return this.stateService.orders; }
  public get inventoryRecords() { return this.stateService.inventoryRecords; }
  public get isInventoryLoading() { return this.stateService.isInventoryLoading; }

  // --- Computed Properties Kho hàng ---
  public readonly filteredInventoryRecords = computed(() => {
    let list = this.inventoryRecords();
    const type = this.inventoryTypeFilter();
    if (type !== 'all') {
      list = list.filter(r => r.type === type);
    }

    // Thêm tìm kiếm cục bộ (note, record_code, tên món trong record items)
    const search = this.inventorySearchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(r => 
        (r.note && r.note.toLowerCase().includes(search)) ||
        (r.record_code && r.record_code.toLowerCase().includes(search)) ||
        (r.id && r.id.toString().includes(search)) ||
        (r.items && r.items.some((item: any) => {
          const prod = this.products().find(p => p.id === item.product_id);
          return prod && prod.name.toLowerCase().includes(search);
        }))
      );
    }
    return list;
  });

  public readonly paginatedInventoryRecords = computed(() => {
    const list = this.filteredInventoryRecords();
    const startIndex = (this.inventoryCurrentPage() - 1) * this.inventoryItemsPerPage;
    return list.slice(startIndex, startIndex + this.inventoryItemsPerPage);
  });

  public readonly inventoryTotalPages = computed(() => {
    return Math.ceil(this.filteredInventoryRecords().length / this.inventoryItemsPerPage) || 1;
  });

  // Tính toán số lượng tồn kho của tất cả sản phẩm
  public readonly productStocks = computed(() => {
    const productsList = this.products();
    const records = this.inventoryRecords();
    const ordersList = this.orders();

    const stocks: { [key: string]: number } = {};

    productsList.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v: any) => {
          stocks[`${p.id}_${v.id}`] = 0;
        });
      } else {
        stocks[`${p.id}_null`] = 0;
      }
    });

    productsList.forEach(p => {
      const processItem = (variantId: number | null) => {
        const key = `${p.id}_${variantId}`;

        let latestKiemDate: Date | null = null;
        let latestKiemQty = 0;

        records.forEach(r => {
          if (r.type === 'kiem') {
            const item = r.items?.find((i: any) => i.product_id === p.id && i.product_variant_id === variantId);
            if (item) {
              const rDate = new Date(r.record_date);
              if (!latestKiemDate || rDate > latestKiemDate) {
                latestKiemDate = rDate;
                latestKiemQty = Number(item.quantity) || 0;
              }
            }
          }
        });

        let totalIn = 0;
        let totalOut = 0;
        let totalSold = 0;

        records.forEach(r => {
          const rDate = new Date(r.record_date);
          if (!latestKiemDate || rDate > latestKiemDate) {
            const item = r.items?.find((i: any) => i.product_id === p.id && i.product_variant_id === variantId);
            if (item) {
              const qty = Number(item.quantity) || 0;
              if (r.type === 'nhap') {
                totalIn += qty;
              } else if (r.type === 'xuat') {
                totalOut += qty;
              }
            }
          }
        });

        ordersList.forEach(o => {
          if (o.status === 'completed') {
            const oDate = new Date(o.created_at);
            if (!latestKiemDate || oDate > latestKiemDate) {
              const item = o.items?.find((i: any) => i.product_id === p.id && i.product_variant_id === variantId);
              if (item) {
                totalSold += Number(item.quantity) || 0;
              }
            }
          }
        });

        const baseQty = latestKiemDate ? latestKiemQty : 0;
        stocks[key] = baseQty + totalIn - totalOut - totalSold;
      };

      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v: any) => processItem(v.id));
      } else {
        processItem(null);
      }
    });

    return stocks;
  });

  // ===================== BÁO CÁO TỒN KHO: Flatten + Tìm kiếm + Phân trang =====================
  public readonly stockReportSearch = signal<string>('');
  public readonly stockReportCurrentPage = signal<number>(1);
  public readonly stockReportItemsPerPage = 20;

  /** Danh sách phẳng tất cả rows (product + variant hoặc product solo) */
  public readonly flatStockRows = computed(() => {
    const rows: { product: any; variant: any | null }[] = [];
    for (const p of this.products()) {
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          rows.push({ product: p, variant: v });
        }
      } else {
        rows.push({ product: p, variant: null });
      }
    }
    return rows;
  });

  /** Lọc theo từ khoá tìm kiếm */
  public readonly filteredStockRows = computed(() => {
    const q = this.stockReportSearch().trim().toLowerCase();
    if (!q) return this.flatStockRows();
    return this.flatStockRows().filter(r =>
      r.product.name.toLowerCase().includes(q) ||
      (r.variant?.variant_name && r.variant.variant_name.toLowerCase().includes(q)) ||
      (r.variant?.sku && r.variant.sku.toLowerCase().includes(q)) ||
      (r.product.sku && r.product.sku.toLowerCase().includes(q))
    );
  });

  /** Cắt theo trang hiện tại */
  public readonly paginatedStockRows = computed(() => {
    const start = (this.stockReportCurrentPage() - 1) * this.stockReportItemsPerPage;
    return this.filteredStockRows().slice(start, start + this.stockReportItemsPerPage);
  });

  public readonly stockReportTotalPages = computed(() =>
    Math.ceil(this.filteredStockRows().length / this.stockReportItemsPerPage) || 1
  );



  public getProductStock(productId: number, variantId: number | null = null): number {
    const key = `${productId}_${variantId}`;
    return this.productStocks()[key] !== undefined ? this.productStocks()[key] : 0;
  }

  // Tải lại dữ liệu kho
  public refreshInventory() {
    this.stateService.refreshInventory();
  }

  // --- Inventory CRUD ---
  public openAddInventoryModal(type: 'nhap' | 'xuat' | 'kiem' = 'nhap') {
    this.inventoryForm.set({
      type: type,
      note: '',
      record_date: new Date().toISOString().split('T')[0],
      items: [{ product_id: 0, product_variant_id: null, quantity: 1, price: 0 }]
    });
    this.isInventoryModalOpen.set(true);
    this.isInventoryDropdownOpen.set(false);
  }

  public closeInventoryModal() {
    this.isInventoryModalOpen.set(false);
  }

  public addInventoryItemRow() {
    this.inventoryForm.update(form => ({
      ...form,
      items: [...form.items, { product_id: 0, product_variant_id: null, quantity: 1, price: 0 }]
    }));
  }

  public removeInventoryItemRow(index: number) {
    this.inventoryForm.update(form => {
      const items = [...form.items];
      items.splice(index, 1);
      return { ...form, items };
    });
  }

  public updateInventoryItemField(index: number, field: string, value: any) {
    this.inventoryForm.update(form => {
      const items = [...form.items];
      if (items[index]) {
        let parsedValue = value;
        if (field === 'product_id') {
          parsedValue = Number(value);
          const prod = this.products().find(p => p.id === parsedValue);
          items[index] = {
            ...items[index],
            product_id: parsedValue,
            product_variant_id: prod && prod.variants && prod.variants.length > 0 ? prod.variants[0].id : null,
            price: prod ? prod.price : 0
          };
        } else if (field === 'product_variant_id') {
          parsedValue = value ? Number(value) : null;
          const prodId = items[index].product_id;
          const prod = this.products().find(p => p.id === prodId);
          if (prod && prod.variants && parsedValue) {
            const variant = prod.variants.find((v: any) => v.id === parsedValue);
            items[index] = {
              ...items[index],
              product_variant_id: parsedValue,
              price: variant ? variant.price : prod.price
            };
          } else {
            items[index] = { ...items[index], product_variant_id: parsedValue };
          }
        } else {
          items[index] = { ...items[index], [field]: field === 'price' || field === 'quantity' ? Number(value) : value };
        }
      }
      return { ...form, items };
    });
  }

  public saveInventoryRecord() {
    const form = this.inventoryForm();
    if (!form.record_date || form.items.length === 0) {
      this.stateService.showToast('Vui lòng nhập ngày lập và chọn ít nhất một sản phẩm!', 'error');
      return;
    }

    const invalidItem = form.items.some((item: any) => item.product_id <= 0 || item.quantity <= 0);
    if (invalidItem) {
      this.stateService.showToast('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ cho tất cả các dòng!', 'error');
      return;
    }

    this.isInventorySaving.set(true);
    this.apiService.createInventoryRecord(form).subscribe({
      next: () => {
        this.stateService.showToast('Tạo phiếu kho thành công!', 'success');
        this.closeInventoryModal();
        this.refreshInventory();
        this.isInventorySaving.set(false);
      },
      error: () => {
        this.stateService.showToast('Tạo phiếu kho thất bại!', 'error');
        this.isInventorySaving.set(false);
      }
    });
  }

  public deleteInventoryRecord(record: any) {
    this.deletingRecord.set(record);
    this.isDeleteRecordConfirmOpen.set(true);
  }

  public confirmDeleteInventoryRecord() {
    const record = this.deletingRecord();
    if (!record) return;
    const id = record.id;

    this.isDeleteRecordConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteInventoryRecord(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa phiếu kho thành công!', 'success');
        this.refreshInventory();
        this.deletingRecord.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa phiếu kho thất bại!', 'error');
        this.deletingRecord.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  public viewInventoryRecordDetails(record: any) {
    this.selectedInventoryRecord.set(record);
    this.isInventoryDetailModalOpen.set(true);
  }

  public closeInventoryDetailModal() {
    this.isInventoryDetailModalOpen.set(false);
    this.selectedInventoryRecord.set(null);
  }

  // Helpers cho template

  // Tiện ích lấy variants của một sản phẩm
  public getProductVariants(productId: number): any[] {
    const prod = this.products().find(p => p.id === Number(productId));
    return prod && prod.variants ? prod.variants : [];
  }
}
