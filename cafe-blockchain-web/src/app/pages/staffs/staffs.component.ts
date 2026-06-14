import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '@services/state.service';
import { ApiService } from '@services/api.service';
import { ConfirmModalComponent } from '@components/shared/confirm-modal/confirm-modal.component';
import { CustomSelectComponent } from '@components/shared/custom-select/custom-select.component';
import { AccessRestrictedComponent } from '@components/shared/access-restricted/access-restricted.component';
import { PageHeaderComponent } from '@components/shared/page-header/page-header.component';
import { Web3ConnectPromptComponent } from '@components/shared/web3-connect-prompt/web3-connect-prompt.component';
import { TableComponent, TableColumn, TableCellDirective } from '@components/shared/table/table.component';
import { ModalComponent } from '@components/shared/modal/modal.component';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalComponent,
    CustomSelectComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    Web3ConnectPromptComponent,
    TableComponent,
    TableCellDirective,
    ModalComponent
  ],
  templateUrl: './staffs.component.html'
})
export class StaffsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  public readonly staffColumns: TableColumn[] = [
    { key: 'name', header: 'Nhân viên', sortable: false, class: 'pl-6 whitespace-nowrap' },
    { key: 'phone', header: 'Số điện thoại', sortable: false, class: 'whitespace-nowrap font-medium' },
    { key: 'wallet_address', header: 'Địa chỉ ví (Kết nối ví)', sortable: false, class: 'whitespace-nowrap' },
    { key: 'role', header: 'Vai trò', sortable: false, class: 'whitespace-nowrap' },
    { key: 'created_at', header: 'Ngày tham gia', sortable: false, class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6 whitespace-nowrap', headerClass: 'text-right pr-6' }
  ];

  public readonly roleColumns: TableColumn[] = [
    { key: 'name', header: 'Vai trò', sortable: false, class: 'pl-6 whitespace-nowrap' },
    { key: 'permissions', header: 'Quyền truy cập Web POS', sortable: false, class: 'whitespace-nowrap max-w-lg truncate' },
    { key: 'created_at', header: 'Ngày tạo', sortable: false, class: 'whitespace-nowrap' },
    { key: 'actions', header: 'Thao tác', sortable: false, class: 'text-right pr-6 whitespace-nowrap', headerClass: 'text-right pr-6' }
  ];

  // Tab hoạt động: 'staffs' (Nhân viên) hoặc 'roles' (Vai trò)
  public readonly activeSubTab = signal<'staffs' | 'roles'>('staffs');

  // Phân trang cho Nhân viên và Vai trò
  public readonly staffCurrentPage = signal<number>(1);
  public readonly roleCurrentPage = signal<number>(1);
  public readonly staffsPerPage = 10;
  public readonly rolesPerPage = 10;

  // Dữ liệu đã phân trang
  public readonly paginatedStaffs = computed(() => {
    const staffs = this.stateService.staffs() || [];
    const startIndex = (this.staffCurrentPage() - 1) * this.staffsPerPage;
    return staffs.slice(startIndex, startIndex + this.staffsPerPage);
  });

  public readonly paginatedRoles = computed(() => {
    const roles = this.stateService.roles() || [];
    const startIndex = (this.roleCurrentPage() - 1) * this.rolesPerPage;
    return roles.slice(startIndex, startIndex + this.rolesPerPage);
  });

  // Quản lý Nhân viên
  public staffForm!: FormGroup;
  public readonly isStaffFormOpen = signal<boolean>(false);
  public readonly editingStaff = signal<any | null>(null);
  public readonly isSavingStaff = signal<boolean>(false);

  // Quản lý Vai trò
  public roleForm!: FormGroup;
  public readonly isRoleFormOpen = signal<boolean>(false);
  public readonly editingRole = signal<any | null>(null);
  public readonly isSavingRole = signal<boolean>(false);

  // Modal xác nhận xóa
  public readonly confirmDeleteData = signal<{ type: 'staff' | 'role'; id: number; title: string; desc: string } | null>(null);

  // Danh sách các module trong Web POS hỗ trợ phân quyền
  public readonly modules = [
    { key: 'dashboard', name: 'Tổng quan (Dashboard)', desc: 'Xem biểu đồ thống kê, doanh thu, lợi nhuận, ca trực' },
    { key: 'pos', name: 'Bán hàng (POS)', desc: 'Lập đơn hàng, chọn món, in hóa đơn tạm, thanh toán' },
    { key: 'menu', name: 'Thực đơn (Menu)', desc: 'Thêm, sửa, xóa món ăn, đồ uống và các biến thể' },
    { key: 'orders', name: 'Đơn hàng (Orders)', desc: 'Quản lý lịch sử đơn hàng, cập nhật trạng thái, đồng bộ blockchain' },
    { key: 'financials', name: 'Sổ thu chi (Financials)', desc: 'Lập phiếu thu, phiếu chi, quản lý dòng tiền mặt/on-chain' },
    { key: 'customers', name: 'Khách hàng (Customers)', desc: 'Quản lý thông tin khách hàng và nhóm khách hàng' },
    { key: 'debts', name: 'Sổ nợ (Debts)', desc: 'Xem danh sách nợ khách hàng, lập phiếu thu nợ, xóa nợ' },
    { key: 'inventory', name: 'Kho hàng (Inventory)', desc: 'Quản lý nhập kho, xuất kho, kiểm kho hàng hóa' },
    { key: 'tables', name: 'Sơ đồ bàn (Tables)', desc: 'Quản lý khu vực, bàn ăn và trạng thái sử dụng' },
    { key: 'reports', name: 'Báo cáo (Reports)', desc: 'Xem chi tiết báo cáo doanh thu, lãi lỗ, xuất file Excel' },
    { key: 'settings', name: 'Cấu hình quán (Settings)', desc: 'Thiết lập thông tin quán, màu sắc dynamic, địa chỉ ví hợp đồng' },
    { key: 'staffs', name: 'Nhân viên (Staffs)', desc: 'Quản lý nhân viên, phân quyền truy cập hệ thống' }
  ];

  // Map các tùy chọn vai trò cho CustomSelect
  public get roleOptions() {
    return this.stateService.roles().map(r => ({
      value: r.id,
      label: r.name
    }));
  }

  ngOnInit() {
    this.initStaffForm();
    this.initRoleForm();
    this.stateService.refreshStaffsAndRoles();
  }

  // Khởi tạo form Nhân viên
  private initStaffForm() {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      wallet_address: ['', [
        Validators.required,
        Validators.pattern(/^0x[a-fA-F0-9]{40}$/i)
      ]],
      role_id: [null, [Validators.required]]
    });
  }

  // Khởi tạo form Vai trò
  private initRoleForm() {
    // Tạo group permissions động cho checkbox
    const permissionsGroup: any = {};
    this.modules.forEach(mod => {
      permissionsGroup[mod.key] = [false];
    });

    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      permissions: this.fb.group(permissionsGroup)
    });
  }

  public setSubTab(tab: 'staffs' | 'roles') {
    this.activeSubTab.set(tab);
  }

  // Mở form thêm nhân viên
  public openAddStaff() {
    this.editingStaff.set(null);
    this.staffForm.reset();
    this.isStaffFormOpen.set(true);
  }

  // Mở form sửa nhân viên
  public openEditStaff(staff: any) {
    this.editingStaff.set(staff);
    this.staffForm.patchValue({
      name: staff.name,
      phone: staff.phone,
      wallet_address: staff.wallet_address,
      role_id: staff.role_id
    });
    this.isStaffFormOpen.set(true);
  }

  // Mở form thêm vai trò
  public openAddRole() {
    this.editingRole.set(null);
    this.roleForm.reset();
    
    // Đặt mặc định false cho tất cả checkbox quyền
    const defaultPerms: any = {};
    this.modules.forEach(mod => {
      defaultPerms[mod.key] = false;
    });
    this.roleForm.patchValue({ name: '', permissions: defaultPerms });
    this.isRoleFormOpen.set(true);
  }

  // Mở form sửa vai trò
  public openEditRole(role: any) {
    this.editingRole.set(role);
    
    const perms = role.permissions || {};
    const formattedPerms: any = {};
    this.modules.forEach(mod => {
      formattedPerms[mod.key] = !!perms[mod.key];
    });

    this.roleForm.patchValue({
      name: role.name,
      permissions: formattedPerms
    });
    this.isRoleFormOpen.set(true);
  }

  // Lưu thông tin nhân viên (Thêm hoặc Cập nhật)
  public saveStaff() {
    if (this.isSavingStaff()) return;

    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.isSavingStaff.set(true);
    const data = this.staffForm.value;
    const staffId = this.editingStaff()?.id;

    const request = staffId
      ? this.apiService.updateStaff(staffId, data)
      : this.apiService.createStaff(data);

    request.subscribe({
      next: (res) => {
        this.stateService.showToast(
          staffId ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên mới thành công!',
          'success'
        );
        this.isStaffFormOpen.set(false);
        if (!staffId) {
          this.staffCurrentPage.set(1);
        }
        this.stateService.refreshStaffsAndRoles();
        this.isSavingStaff.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(errorMsg, 'error');
        this.isSavingStaff.set(false);
      }
    });
  }

  // Lưu thông tin vai trò
  public saveRole() {
    if (this.isSavingRole()) return;

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isSavingRole.set(true);
    const data = this.roleForm.value;
    const roleId = this.editingRole()?.id;

    const request = roleId
      ? this.apiService.updateRole(roleId, data)
      : this.apiService.createRole(data);

    request.subscribe({
      next: (res) => {
        this.stateService.showToast(
          roleId ? 'Cập nhật vai trò thành công!' : 'Thêm vai trò mới thành công!',
          'success'
        );
        this.isRoleFormOpen.set(false);
        if (!roleId) {
          this.roleCurrentPage.set(1);
        }
        this.stateService.refreshStaffsAndRoles();
        this.isSavingRole.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(errorMsg, 'error');
        this.isSavingRole.set(false);
      }
    });
  }

  // Trigger xác nhận xóa
  public triggerDeleteStaff(staff: any) {
    this.confirmDeleteData.set({
      type: 'staff',
      id: staff.id,
      title: 'Xóa nhân viên',
      desc: `Bạn có chắc chắn muốn xóa nhân viên "${staff.name}" không? Ví của nhân viên này sẽ bị ngắt kết nối khỏi hệ thống của quán ngay lập tức.`
    });
  }

  public triggerDeleteRole(role: any) {
    this.confirmDeleteData.set({
      type: 'role',
      id: role.id,
      title: 'Xóa vai trò',
      desc: `Bạn có chắc chắn muốn xóa vai trò "${role.name}" không? Thao tác này không thể hoàn tác nếu không có nhân viên nào đang sử dụng.`
    });
  }

  // Xử lý xác nhận xóa từ ConfirmModal
  public onDeleteConfirm() {
    const data = this.confirmDeleteData();
    if (!data) return;

    const request = data.type === 'staff'
      ? this.apiService.deleteStaff(data.id)
      : this.apiService.deleteRole(data.id);

    request.subscribe({
      next: () => {
        this.stateService.showToast(
          data.type === 'staff' ? 'Đã xóa nhân viên thành công!' : 'Đã xóa vai trò thành công!',
          'success'
        );
        this.confirmDeleteData.set(null);
        this.stateService.refreshStaffsAndRoles();

        // Điều chỉnh trang hiện tại nếu vượt quá số lượng trang tối đa sau khi xóa
        setTimeout(() => {
          if (data.type === 'staff') {
            const total = this.stateService.staffs().length;
            const maxPage = Math.max(1, Math.ceil(total / this.staffsPerPage));
            if (this.staffCurrentPage() > maxPage) {
              this.staffCurrentPage.set(maxPage);
            }
          } else {
            const total = this.stateService.roles().length;
            const maxPage = Math.max(1, Math.ceil(total / this.rolesPerPage));
            if (this.roleCurrentPage() > maxPage) {
              this.roleCurrentPage.set(maxPage);
            }
          }
        }, 300);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Không thể xóa tài nguyên này.';
        this.stateService.showToast(errorMsg, 'error');
        this.confirmDeleteData.set(null);
      }
    });
  }

  // Trả về danh sách tên module được kích hoạt quyền để hiển thị tóm tắt
  public getRolePermissionsSummary(role: any): string {
    const perms = role.permissions || {};
    const activeModules = this.modules
      .filter(m => !!perms[m.key])
      .map(m => m.name.split(' ')[0]); // Lấy chữ đầu (Tổng, Bán, Thực...)
    
    if (activeModules.length === this.modules.length) {
      return 'Tất cả các quyền';
    }
    if (activeModules.length === 0) {
      return 'Không có quyền truy cập';
    }
    return activeModules.join(', ');
  }

  // Rút gọn địa chỉ ví để hiển thị cho đẹp
  public shortAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}
