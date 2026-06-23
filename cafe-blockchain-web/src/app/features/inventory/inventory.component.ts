import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { InventoryStore } from './store/inventory.store';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ModalService } from '@core/services/modal.service';
import { InventoryFormModalComponent } from './components/inventory-form-modal/inventory-form-modal.component';
import { InventoryDetailModalComponent } from './components/inventory-detail-modal/inventory-detail-modal.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { CustomSearchInputComponent } from '@shared/components/custom-search-input/custom-search-input.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PaginationComponent,
    PageHeaderComponent,
    VNDCurrencyPipe,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    CustomSearchInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly inventoryStore = inject(InventoryStore);

  ngOnInit() {
    this.refreshInventory(1);
  }

  // Bộ lọc, phân trang kho
  public readonly inventoryTypeFilter = signal<string>('all');

  public readonly inventoryTypeFilterOptions: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'nhap', label: 'Nhập kho' },
    { value: 'xuat', label: 'Xuất kho' },
    { value: 'kiem', label: 'Kiểm kho' },
  ];

  public readonly inventoryFormTypeOptions: TabOption[] = [
    { value: 'nhap', label: 'Nhập' },
    { value: 'xuat', label: 'Xuất' },
    { value: 'kiem', label: 'Kiểm' },
  ];

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
    items: [],
  });

  // Getters từ StateService & InventoryStore
  public get products() {
    return this.stateService.products;
  }
  public get orders() {
    return this.stateService.orders;
  }
  public get inventoryRecords() {
    return this.inventoryStore.inventoryRecords;
  }
  public get isInventoryLoading() {
    return this.inventoryStore.isInventoryLoading;
  }
  public get totalInventoryRecords() {
    return this.inventoryStore.totalInventoryRecords;
  }
  public get inventoryCurrentPage() {
    return this.inventoryStore.inventoryCurrentPage;
  }
  public get inventoryItemsPerPage() {
    return this.inventoryStore.inventoryItemsPerPage;
  }

  // Danh sách sản phẩm bao gồm tùy chọn mặc định cho dropdown
  public readonly inventoryProductOptions = computed(() => [
    { id: 0, name: '-- Chọn món --' },
    ...this.products(),
  ]);

  // --- Computed Properties Kho hàng ---
  public readonly filteredInventoryRecords = computed(() => {
    return this.inventoryRecords();
  });

  public readonly paginatedInventoryRecords = computed(() => {
    return this.inventoryRecords();
  });

  public readonly inventoryTotalPages = computed(() => {
    return Math.ceil(this.totalInventoryRecords() / this.inventoryItemsPerPage) || 1;
  });

  // Tính toán số lượng tồn kho của tất cả sản phẩm
  public readonly productStocks = computed(() => {
    const productsList = this.products();
    const records = this.inventoryRecords();
    const ordersList = this.orders();

    const stocks: { [key: string]: number } = {};

    productsList.forEach((p) => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v: any) => {
          stocks[`${p.id}_${v.id}`] = 0;
        });
      } else {
        stocks[`${p.id}_null`] = 0;
      }
    });

    productsList.forEach((p) => {
      const processItem = (variantId: number | null) => {
        const key = `${p.id}_${variantId}`;

        let latestKiemDate: Date | null = null;
        let latestKiemQty = 0;

        records.forEach((r) => {
          if (r.type === 'kiem') {
            const item = r.items?.find(
              (i: any) => i.product_id === p.id && i.product_variant_id === variantId,
            );
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

        records.forEach((r) => {
          const rDate = new Date(r.record_date);
          if (!latestKiemDate || rDate > latestKiemDate) {
            const item = r.items?.find(
              (i: any) => i.product_id === p.id && i.product_variant_id === variantId,
            );
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

        if (p.type === 'ingredient') {
          ordersList.forEach((o) => {
            if (o.status === 'completed') {
              const oDate = new Date(o.created_at);
              if (!latestKiemDate || oDate > latestKiemDate) {
                o.items?.forEach((oItem: any) => {
                  const sellProduct = productsList.find((sp) => sp.id === oItem.product_id);
                  if (sellProduct && sellProduct.recipes && sellProduct.recipes.length > 0) {
                    const recipe = sellProduct.recipes.find(
                      (r: any) =>
                        r.ingredient_id === p.id &&
                        (!r.product_variant_id ||
                          r.product_variant_id === oItem.product_variant_id),
                    );
                    if (recipe) {
                      totalSold += (Number(oItem.quantity) || 0) * (Number(recipe.quantity) || 0);
                    }
                  }
                });
              }
            }
          });
        } else {
          ordersList.forEach((o) => {
            if (o.status === 'completed') {
              const oDate = new Date(o.created_at);
              if (!latestKiemDate || oDate > latestKiemDate) {
                const item = o.items?.find(
                  (i: any) => i.product_id === p.id && i.product_variant_id === variantId,
                );
                if (item) {
                  totalSold += Number(item.quantity) || 0;
                }
              }
            }
          });
        }

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
    return this.flatStockRows().filter(
      (r) =>
        r.product.name.toLowerCase().includes(q) ||
        (r.variant?.variant_name && r.variant.variant_name.toLowerCase().includes(q)) ||
        (r.variant?.sku && r.variant.sku.toLowerCase().includes(q)) ||
        (r.product.sku && r.product.sku.toLowerCase().includes(q)),
    );
  });

  /** Cắt theo trang hiện tại */
  public readonly paginatedStockRows = computed(() => {
    const start = (this.stockReportCurrentPage() - 1) * this.stockReportItemsPerPage;
    return this.filteredStockRows().slice(start, start + this.stockReportItemsPerPage);
  });

  public readonly stockReportTotalPages = computed(
    () => Math.ceil(this.filteredStockRows().length / this.stockReportItemsPerPage) || 1,
  );

  public getProductStock(productId: number, variantId: number | null = null): number {
    const key = `${productId}_${variantId}`;
    return this.productStocks()[key] !== undefined ? this.productStocks()[key] : 0;
  }

  // Tải lại dữ liệu kho
  public refreshInventory(page: number = this.inventoryCurrentPage()) {
    this.inventoryStore.refreshInventory(
      this.stateService.hasPermission('inventory'),
      this.inventoryTypeFilter(),
      page,
      this.inventorySearchQuery()
    );
  }

  public onTypeFilterChange(type: string) {
    this.inventoryTypeFilter.set(type);
    this.refreshInventory(1);
  }

  public onSearchQueryChange(query: string) {
    this.inventorySearchQuery.set(query);
    this.refreshInventory(1);
  }

  // --- Inventory CRUD ---
  public openAddInventoryModal(type: 'nhap' | 'xuat' | 'kiem' = 'nhap') {
    this.modalService.open(InventoryFormModalComponent, {
      title: 'Lập phiếu kho mới',
      size: 'lg',
      data: { type }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.refreshInventory();
      }
    });
    this.isInventoryDropdownOpen.set(false);
  }

  public deleteInventoryRecord(record: any) {
    this.modalService.confirm({
      title: 'Xóa phiếu kho?',
      description: `Bạn có chắc chắn muốn xóa phiếu kho "${record.record_code}" không?`,
      confirmText: 'Xóa',
      cancelText: 'Hủy bỏ'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteInventoryRecord(record);
      }
    });
  }

  public confirmDeleteInventoryRecord(record: any) {
    if (!record) return;
    const id = record.id;

    this.stateService.isLoading.set(true);
    this.apiService.deleteInventoryRecord(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa phiếu kho thành công!', 'success');
        this.refreshInventory();
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa phiếu kho thất bại!', 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }

  public viewInventoryRecordDetails(record: any) {
    this.modalService.open(InventoryDetailModalComponent, {
      title: `Chi tiết phiếu kho ${record?.record_code || ''}`,
      size: 'md',
      data: record
    });
  }
}
