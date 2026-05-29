import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tables.component.html'
})
export class TablesComponent {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Bộ lọc phòng bàn
  public readonly activeAreaFilter = signal<string>('all');
  public readonly tableStatusFilter = signal<string>('all');

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

  // Getters từ StateService
  public get areas() { return this.stateService.areas; }
  public get diningTables() { return this.stateService.diningTables; }
  public get isTablesLoading() { return this.stateService.isTablesLoading; }

  // Computed Properties lọc phòng bàn
  public readonly filteredDiningTables = computed(() => {
    const tables = this.diningTables();
    const areaId = this.activeAreaFilter();
    const status = this.tableStatusFilter();

    return tables.filter(t => {
      const matchArea = areaId === 'all' || t.area_id?.toString() === areaId;
      const matchStatus = status === 'all' || t.status === status;
      return matchArea && matchStatus;
    });
  });

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

  public deleteArea(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa khu vực này? Tất cả các bàn trong khu vực cũng sẽ bị xóa.')) {
      this.stateService.isLoading.set(true);
      this.apiService.deleteArea(id).subscribe({
        next: () => {
          this.stateService.showToast('Xóa khu vực thành công!', 'success');
          this.refreshTablesAndAreas();
          this.stateService.isLoading.set(false);
        },
        error: () => {
          this.stateService.showToast('Xóa khu vực thất bại!', 'error');
          this.stateService.isLoading.set(false);
        }
      });
    }
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
        this.refreshTablesAndAreas();
        this.isUpdatingTableStatus.set(false);
      },
      error: () => {
        this.stateService.showToast('Không thể thay đổi trạng thái bàn!', 'error');
        this.isUpdatingTableStatus.set(false);
      }
    });
  }

  public deleteTable(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bàn ăn này?')) {
      this.stateService.isLoading.set(true);
      this.apiService.deleteDiningTable(id).subscribe({
        next: () => {
          this.stateService.showToast('Xóa bàn ăn thành công!', 'success');
          this.refreshTablesAndAreas();
          this.stateService.isLoading.set(false);
        },
        error: () => {
          this.stateService.showToast('Xóa bàn ăn thất bại!', 'error');
          this.stateService.isLoading.set(false);
        }
      });
    }
  }

  // Tiện ích lấy tên khu vực từ id
  public getAreaName(areaId: number): string {
    const area = this.areas().find(a => a.id === areaId);
    return area ? area.name : 'Chưa có';
  }
}
