import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    ConfirmModalComponent,
    PageHeaderComponent,
    ModalComponent,
    CustomSelectComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent
  ],
  templateUrl: './tables.component.html'
})
export class TablesComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  // Bộ lọc phòng bàn
  public readonly activeAreaFilter = signal<string>('all');
  public readonly tableStatusFilter = signal<string>('all');
  public readonly tableSearchQuery = signal<string>('');

  public readonly areaFilterOptions = computed<TabOption[]>(() => [
    { value: 'all', label: 'Tất cả khu vực' },
    ...this.areas().map(area => ({
      value: area.id.toString(),
      label: area.name,
      badge: area.tables_count
    }))
  ]);

  public readonly tableStatusFilterOptions: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'empty', label: 'Bàn trống', dotClass: 'bg-emerald-500' },
    { value: 'using', label: 'Đang sử dụng', dotClass: 'bg-amber-500' }
  ];

  // Modals & Form Khu vực
  public readonly isAreaModalOpen = signal<boolean>(false);
  public readonly areaModalType = signal<'add' | 'edit'>('add');
  public readonly editingArea = signal<any>(null);
  public readonly isAreaSaving = signal<boolean>(false);
  public readonly areaForm = signal<any>({
    name: ''
  });

  // Modals & Form Bàn ăn
  public readonly isTableModalOpen = signal<boolean>(false);
  public readonly tableModalType = signal<'add' | 'edit'>('add');
  public readonly editingTable = signal<any>(null);
  public readonly isTableSaving = signal<boolean>(false);
  public readonly isUpdatingTableStatus = signal<boolean>(false);
  public readonly tableForm = signal<any>({
    name: '',
    area_id: 0,
    status: 'empty'
  });

  // Trạng thái modal xác nhận xóa
  public readonly isDeleteAreaConfirmOpen = signal<boolean>(false);
  public readonly deletingArea = signal<any>(null);
  public readonly isDeleteTableConfirmOpen = signal<boolean>(false);
  public readonly deletingTable = signal<any>(null);

  // Trạng thái menu ba chấm
  public readonly activeDropdownTableId = signal<number | null>(null);

  // Trạng thái modal QR code thực tế
  public readonly isQrModalOpen = signal<boolean>(false);
  public readonly selectedTableForQr = signal<any>(null);

  // Getters từ StateService
  public get areas() { return this.stateService.areas; }
  public get diningTables() { return this.stateService.diningTables; }
  public get isTablesLoading() { return this.stateService.isTablesLoading; }

  // Danh sách khu vực bao gồm tùy chọn mặc định cho dropdown
  public readonly tableAreaOptions = computed(() => [
    { id: 0, name: '-- Chọn khu vực --' },
    ...this.areas()
  ]);

  // Computed Properties lọc phòng bàn
  public readonly filteredDiningTables = computed(() => {
    const tables = this.diningTables();
    const areaId = this.activeAreaFilter();
    const status = this.tableStatusFilter();
    const search = this.tableSearchQuery().trim().toLowerCase();

    return tables.filter(t => {
      const matchArea = areaId === 'all' || t.area_id?.toString() === areaId;
      const matchStatus = status === 'all' || t.status === status;
      const matchSearch = !search || t.name.toLowerCase().includes(search);
      return matchArea && matchStatus && matchSearch;
    });
  });

  public toggleDropdown(tableId: number, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownTableId() === tableId) {
      this.activeDropdownTableId.set(null);
    } else {
      this.activeDropdownTableId.set(tableId);
    }
  }

  public openQrModal(table: any) {
    this.selectedTableForQr.set(table);
    this.isQrModalOpen.set(true);
    this.activeDropdownTableId.set(null);
  }

  public closeQrModal() {
    this.isQrModalOpen.set(false);
    this.selectedTableForQr.set(null);
  }

  public getDiningTableQrUrl(table: any): string {
    if (!table) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const slug = this.stateService.settings()?.website_slug || '';
    const url = `${origin}/store/${slug}?table=${encodeURIComponent(table.name)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }

  public getTableStorefrontUrl(table: any): string {
    if (!table) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const slug = this.stateService.settings()?.website_slug || '';
    return `${origin}/store/${slug}?table=${encodeURIComponent(table.name)}`;
  }

  public copyTableLink(table: any) {
    if (!table) return;
    const url = this.getTableStorefrontUrl(table);
    navigator.clipboard.writeText(url).then(() => {
      this.stateService.showToast('Đã sao chép liên kết gọi món trực tuyến của bàn!', 'success');
    }).catch(() => {
      this.stateService.showToast('Sao chép liên kết thất bại, vui lòng thử lại!', 'error');
    });
  }

  public downloadTableQrCode(table: any) {
    if (!table) return;
    const url = this.getDiningTableQrUrl(table);
    const filename = `qr-${table.name.toLowerCase().replace(/\s+/g, '-')}.png`;

    this.stateService.showToast('Đang chuẩn bị tải file QR...', 'success');
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  }

  public openPosForTable(table: any) {
    this.activeDropdownTableId.set(null);
    if (!this.stateService.currentShift() || !this.stateService.currentShift()?.id) {
      this.stateService.showToast('Vui lòng mở ca làm việc trước khi thực hiện nghiệp vụ bán hàng POS!', 'error');
      return;
    }

    if (table.status === 'empty') {
      this.isUpdatingTableStatus.set(true);
      this.apiService.updateDiningTableStatus(table.id, 'using').subscribe({
        next: () => {
          this.stateService.tableNumber.set(table.name);
          this.stateService.updateTableStatusLocal(table.id, 'using');
          this.isUpdatingTableStatus.set(false);
          this.stateService.showToast(`Đã mở ${table.name} và chuyển sang giao diện POS.`, 'success');
          this.router.navigate(['/pos']);
        },
        error: () => {
          this.stateService.tableNumber.set(table.name);
          this.isUpdatingTableStatus.set(false);
          this.router.navigate(['/pos']);
        }
      });
    } else {
      this.stateService.tableNumber.set(table.name);
      this.stateService.showToast(`Chuyển sang giao diện POS của ${table.name}.`, 'success');
      this.router.navigate(['/pos']);
    }
  }

  public triggerFilter() {
    const count = this.filteredDiningTables().length;
    this.stateService.showToast(`Đã áp dụng bộ lọc, tìm thấy ${count} bàn ăn phù hợp!`, 'success');
  }

  ngOnInit() {
  }

  // Tải lại dữ liệu khu vực & bàn
  public refreshTablesAndAreas() {
    this.stateService.refreshTablesAndAreas();
  }

  // --- Area CRUD ---
  public openAddAreaModal() {
    this.areaModalType.set('add');
    this.editingArea.set(null);
    this.areaForm.set({ name: '' });
    this.isAreaModalOpen.set(true);
  }

  public openEditAreaModal(area: any) {
    this.areaModalType.set('edit');
    this.editingArea.set(area);
    this.areaForm.set({ name: area.name });
    this.isAreaModalOpen.set(true);
  }

  public closeAreaModal() {
    this.isAreaModalOpen.set(false);
    this.editingArea.set(null);
  }

  public saveArea() {
    const form = this.areaForm();
    if (!form.name || !form.name.trim()) {
      this.stateService.showToast('Tên khu vực là bắt buộc!', 'error');
      return;
    }

    this.isAreaSaving.set(true);
    if (this.areaModalType() === 'add') {
      this.apiService.createArea(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm khu vực thành công!', 'success');
          this.closeAreaModal();
          this.refreshTablesAndAreas();
          this.isAreaSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Thêm khu vực thất bại hoặc tên đã tồn tại!', 'error');
          this.isAreaSaving.set(false);
        }
      });
    } else {
      const id = this.editingArea().id;
      this.apiService.updateArea(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật khu vực thành công!', 'success');
          this.closeAreaModal();
          this.refreshTablesAndAreas();
          this.isAreaSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Cập nhật khu vực thất bại!', 'error');
          this.isAreaSaving.set(false);
        }
      });
    }
  }

  public deleteArea(area: any) {
    this.deletingArea.set(area);
    this.isDeleteAreaConfirmOpen.set(true);
  }

  public confirmDeleteArea() {
    const area = this.deletingArea();
    if (!area) return;
    const id = area.id;

    this.isDeleteAreaConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteArea(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa khu vực thành công!', 'success');
        this.refreshTablesAndAreas();
        this.deletingArea.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa khu vực thất bại!', 'error');
        this.deletingArea.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  // --- Dining Table CRUD ---
  public openAddTableModal() {
    this.tableModalType.set('add');
    this.editingTable.set(null);
    this.tableForm.set({
      name: '',
      area_id: this.areas().length > 0 ? this.areas()[0].id : 0,
      status: 'empty'
    });
    this.isTableModalOpen.set(true);
  }

  public openEditTableModal(table: any) {
    this.tableModalType.set('edit');
    this.editingTable.set(table);
    this.tableForm.set({
      name: table.name,
      area_id: table.area_id,
      status: table.status
    });
    this.isTableModalOpen.set(true);
  }

  public closeTableModal() {
    this.isTableModalOpen.set(false);
    this.editingTable.set(null);
  }

  public saveTable() {
    const form = this.tableForm();
    if (!form.name || !form.name.trim() || form.area_id <= 0) {
      this.stateService.showToast('Vui lòng nhập tên bàn và chọn khu vực hợp lệ!', 'error');
      return;
    }

    this.isTableSaving.set(true);
    if (this.tableModalType() === 'add') {
      this.apiService.createDiningTable(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm bàn ăn thành công!', 'success');
          this.closeTableModal();
          this.refreshTablesAndAreas();
          this.isTableSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Thêm bàn thất bại!', 'error');
          this.isTableSaving.set(false);
        }
      });
    } else {
      const id = this.editingTable().id;
      this.apiService.updateDiningTable(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật bàn ăn thành công!', 'success');
          this.closeTableModal();
          this.refreshTablesAndAreas();
          this.isTableSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Cập nhật bàn thất bại!', 'error');
          this.isTableSaving.set(false);
        }
      });
    }
  }

  public toggleTableStatusDirect(table: any) {
    if (this.isUpdatingTableStatus()) return;
    this.isUpdatingTableStatus.set(true);
    const newStatus = table.status === 'empty' ? 'using' : 'empty';
    this.apiService.updateDiningTableStatus(table.id, newStatus).subscribe({
      next: () => {
        this.stateService.showToast(`Đã chuyển trạng thái bàn ${table.name} sang ${newStatus === 'empty' ? 'Trống' : 'Đang sử dụng'}!`, 'success');
        this.stateService.updateTableStatusLocal(table.id, newStatus);
        this.isUpdatingTableStatus.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể thay đổi trạng thái bàn!', 'error');
        this.isUpdatingTableStatus.set(false);
      }
    });
  }

  public deleteTable(table: any) {
    this.deletingTable.set(table);
    this.isDeleteTableConfirmOpen.set(true);
  }

  public confirmDeleteTable() {
    const table = this.deletingTable();
    if (!table) return;
    const id = table.id;

    this.isDeleteTableConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteDiningTable(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa bàn ăn thành công!', 'success');
        this.refreshTablesAndAreas();
        this.deletingTable.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa bàn thất bại!', 'error');
        this.deletingTable.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  // Tiện ích lấy tên khu vực từ id
  public getAreaName(areaId: number): string {
    const area = this.areas().find(a => a.id === areaId);
    return area ? area.name : 'Chưa có';
  }
}
