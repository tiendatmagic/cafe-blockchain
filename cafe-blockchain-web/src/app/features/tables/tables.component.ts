import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ShiftService } from '@core/services/shift.service';
import { ApiService } from '@core/services/api.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { CustomSearchInputComponent } from '@shared/components/custom-search-input/custom-search-input.component';
import { ModalService } from '@core/services/modal.service';
import { AreaFormModalComponent } from './components/area-form-modal/area-form-modal.component';
import { TableFormModalComponent } from './components/table-form-modal/table-form-modal.component';
import { TableQrModalComponent } from './components/table-qr-modal/table-qr-modal.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    CustomSearchInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tables.component.html',
})
export class TablesComponent implements OnInit {
  public readonly stateService = inject(StateService);
  public readonly shiftService = inject(ShiftService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  // Bộ lọc phòng bàn
  public readonly activeAreaFilter = signal<string>('all');
  public readonly tableStatusFilter = signal<string>('all');
  public readonly tableSearchQuery = signal<string>('');

  public readonly areaFilterOptions = computed<TabOption[]>(() => [
    { value: 'all', label: 'Tất cả khu vực' },
    ...this.areas().map((area) => ({
      value: area.id.toString(),
      label: area.name,
      badge: area.tables_count,
    })),
  ]);

  public readonly tableStatusFilterOptions: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'empty', label: 'Bàn trống', dotClass: 'bg-emerald-500' },
    { value: 'using', label: 'Đang sử dụng', dotClass: 'bg-amber-500' },
  ];

  // State menu ba chấm & cập nhật bàn
  public readonly activeDropdownTableId = signal<number | null>(null);
  public readonly isUpdatingTableStatus = signal<boolean>(false);


  // Getters từ StateService
  public get areas() {
    return this.stateService.areas;
  }
  public get diningTables() {
    return this.stateService.diningTables;
  }
  public get isTablesLoading() {
    return this.stateService.isTablesLoading;
  }

  // Danh sách khu vực bao gồm tùy chọn mặc định cho dropdown
  public readonly tableAreaOptions = computed(() => [
    { id: 0, name: '-- Chọn khu vực --' },
    ...this.areas(),
  ]);

  // Computed Properties lọc phòng bàn
  public readonly filteredDiningTables = computed(() => {
    const tables = this.diningTables();
    const areaId = this.activeAreaFilter();
    const status = this.tableStatusFilter();
    const search = this.tableSearchQuery().trim().toLowerCase();

    return tables.filter((t) => {
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
    this.activeDropdownTableId.set(null);
    this.modalService.open(TableQrModalComponent, {
      title: 'Mã QR Gọi món trực tuyến - ' + table.name,
      size: 'sm',
      data: { table }
    });
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.stateService.showToast('Đã sao chép liên kết gọi món trực tuyến của bàn!', 'success');
      })
      .catch(() => {
        this.stateService.showToast('Sao chép liên kết thất bại, vui lòng thử lại!', 'error');
      });
  }

  public downloadTableQrCode(table: any) {
    if (!table) return;
    const url = this.getDiningTableQrUrl(table);
    const filename = `qr-${table.name.toLowerCase().replace(/\s+/g, '-')}.png`;

    this.stateService.showToast('Đang chuẩn bị tải file QR...', 'success');
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
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
    const hasActiveShift = (this.shiftService.currentShift() && this.shiftService.currentShift()?.id) || this.shiftService.isShiftSkipped();
    if (!hasActiveShift) {
      this.stateService.showToast(
        'Vui lòng mở ca làm việc trước khi thực hiện nghiệp vụ bán hàng POS!',
        'error',
      );
      return;
    }

    if (table.status === 'empty') {
      this.isUpdatingTableStatus.set(true);
      this.apiService.updateDiningTableStatus(table.id, 'using').subscribe({
        next: () => {
          this.stateService.tableNumber.set(table.name);
          this.stateService.updateTableStatusLocal(table.id, 'using');
          this.isUpdatingTableStatus.set(false);
          this.stateService.showToast(
            `Đã mở ${table.name} và chuyển sang giao diện POS.`,
            'success',
          );
          this.router.navigate(['/pos']);
        },
        error: () => {
          this.stateService.tableNumber.set(table.name);
          this.isUpdatingTableStatus.set(false);
          this.router.navigate(['/pos']);
        },
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

  ngOnInit() {}

  public refreshTablesAndAreas() {
    this.stateService.refreshTablesAndAreas();
  }

  // --- Area CRUD ---
  public openAddAreaModal() {
    this.modalService.open(AreaFormModalComponent, {
      title: 'Thêm khu vực mới',
      size: 'sm',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshTablesAndAreas();
      }
    });
  }

  public openEditAreaModal(area: any) {
    this.modalService.open(AreaFormModalComponent, {
      title: 'Cập nhật khu vực',
      size: 'sm',
      data: { area },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshTablesAndAreas();
      }
    });
  }

  public deleteArea(area: any) {
    this.modalService.confirm({
      title: 'Xác nhận xóa khu vực',
      description: `Bạn có chắc chắn muốn xóa khu vực "${area.name}"? Tất cả các bàn trong khu vực cũng sẽ bị xóa vĩnh viễn khỏi hệ thống.`,
      confirmText: 'Xác nhận xóa',
      cancelText: 'Hủy bỏ',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.confirmDeleteArea(area);
      }
    });
  }

  private confirmDeleteArea(area: any) {
    this.stateService.isLoading.set(true);
    this.apiService.deleteArea(area.id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa khu vực thành công!', 'success');
        this.refreshTablesAndAreas();
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa khu vực thất bại!', 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }

  // --- Dining Table CRUD ---
  public openAddTableModal() {
    this.modalService.open(TableFormModalComponent, {
      title: 'Thêm bàn ăn mới',
      size: 'sm',
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshTablesAndAreas();
      }
    });
  }

  public openEditTableModal(table: any) {
    this.modalService.open(TableFormModalComponent, {
      title: 'Cập nhật bàn ăn',
      size: 'sm',
      data: { table },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.refreshTablesAndAreas();
      }
    });
  }

  public toggleTableStatusDirect(table: any) {
    if (this.isUpdatingTableStatus()) return;
    this.isUpdatingTableStatus.set(true);
    const newStatus = table.status === 'empty' ? 'using' : 'empty';
    this.apiService.updateDiningTableStatus(table.id, newStatus).subscribe({
      next: () => {
        this.stateService.showToast(
          `Đã chuyển trạng thái bàn ${table.name} sang ${newStatus === 'empty' ? 'Trống' : 'Đang sử dụng'}!`,
          'success',
        );
        this.stateService.updateTableStatusLocal(table.id, newStatus);
        this.isUpdatingTableStatus.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể thay đổi trạng thái bàn!', 'error');
        this.isUpdatingTableStatus.set(false);
      },
    });
  }

  public deleteTable(table: any) {
    this.modalService.confirm({
      title: 'Xác nhận xóa bàn ăn',
      description: `Bạn có chắc chắn muốn xóa bàn ăn "${table.name}" khỏi hệ thống? Hành động này không thể hoàn tác.`,
      confirmText: 'Xác nhận xóa',
      cancelText: 'Hủy bỏ',
    }).afterClosed$.subscribe((confirmed) => {
      if (confirmed) {
        this.confirmDeleteTable(table);
      }
    });
  }

  private confirmDeleteTable(table: any) {
    this.stateService.isLoading.set(true);
    this.apiService.deleteDiningTable(table.id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa bàn ăn thành công!', 'success');
        this.refreshTablesAndAreas();
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa bàn thất bại!', 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }

  // Tiện ích lấy tên khu vực từ id
  public getAreaName(areaId: number): string {
    const area = this.areas().find((a) => a.id === areaId);
    return area ? area.name : 'Chưa có';
  }
}
