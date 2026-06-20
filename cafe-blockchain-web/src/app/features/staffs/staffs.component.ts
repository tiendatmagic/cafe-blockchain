import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalService } from '@core/services/modal.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from '@shared/components/table/table.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { StaffFormModalComponent } from './components/staff-form-modal/staff-form-modal.component';
import { RoleFormModalComponent } from './components/role-form-modal/role-form-modal.component';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    Web3ConnectPromptComponent,
    TableComponent,
    TableCellDirective,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CustomCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './staffs.component.html',
})
export class StaffsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalService);

  public readonly staffColumns: TableColumn[] = [
    { key: 'name', header: 'Nhân viên', sortable: false, class: 'pl-6 whitespace-nowrap' },
    {
      key: 'phone',
      header: 'Số điện thoại',
      sortable: false,
      class: 'whitespace-nowrap font-medium',
    },
    {
      key: 'wallet_address',
      header: 'Địa chỉ ví (Kết nối ví)',
      sortable: false,
      class: 'whitespace-nowrap',
    },
    { key: 'role', header: 'Vai trò', sortable: false, class: 'whitespace-nowrap' },
    { key: 'created_at', header: 'Ngày tham gia', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right pr-6 whitespace-nowrap',
      headerClass: 'text-right pr-6',
    },
  ];

  public readonly roleColumns: TableColumn[] = [
    { key: 'name', header: 'Vai trò', sortable: false, class: 'pl-6 whitespace-nowrap' },
    {
      key: 'permissions',
      header: 'Quyền truy cập Web POS',
      sortable: false,
      class: 'whitespace-nowrap max-w-lg truncate',
    },
    { key: 'created_at', header: 'Ngày tạo', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right pr-6 whitespace-nowrap',
      headerClass: 'text-right pr-6',
    },
  ];

  // Tab hoạt động: 'staffs' (Nhân viên) hoặc 'roles' (Vai trò)
  public readonly activeSubTab = signal<'staffs' | 'roles'>('staffs');

  public readonly staffsSubTabOptions: TabOption[] = [
    { value: 'staffs', label: 'Nhân viên' },
    { value: 'roles', label: 'Vai trò & Phân quyền' },
  ];

  // Bộ tìm kiếm nhân viên & vai trò
  public readonly searchQuery = signal<string>('');

  // Phân trang cho Nhân viên và Vai trò
  public readonly staffCurrentPage = signal<number>(1);
  public readonly roleCurrentPage = signal<number>(1);
  public readonly staffsPerPage = 10;
  public readonly rolesPerPage = 10;

  // Loại bỏ dấu tiếng Việt để tìm kiếm không dấu
  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Lọc danh sách nhân viên theo từ khóa tìm kiếm
  public readonly filteredStaffs = computed(() => {
    let list = this.stateService.staffs() || [];
    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter((s) => {
        const nameClean = s.name ? this.removeSign(s.name.toLowerCase()) : '';
        const phoneClean = s.phone ? s.phone.toLowerCase() : '';
        const walletClean = s.wallet_address ? s.wallet_address.toLowerCase() : '';
        const roleClean = s.role?.name ? this.removeSign(s.role.name.toLowerCase()) : '';
        const idClean = s.id ? s.id.toString() : '';

        return (
          nameClean.includes(searchClean) ||
          phoneClean.includes(searchClean) ||
          walletClean.includes(searchClean) ||
          roleClean.includes(searchClean) ||
          idClean.includes(searchClean)
        );
      });
    }
    return list;
  });

  // Lọc danh sách vai trò theo từ khóa tìm kiếm
  public readonly filteredRoles = computed(() => {
    let list = this.stateService.roles() || [];
    const search = this.searchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter((r) => {
        const nameClean = r.name ? this.removeSign(r.name.toLowerCase()) : '';
        const idClean = r.id ? r.id.toString() : '';
        return nameClean.includes(searchClean) || idClean.includes(searchClean);
      });
    }
    return list;
  });

  // Dữ liệu đã phân trang
  public readonly paginatedStaffs = computed(() => {
    const staffs = this.filteredStaffs();
    const startIndex = (this.staffCurrentPage() - 1) * this.staffsPerPage;
    return staffs.slice(startIndex, startIndex + this.staffsPerPage);
  });

  public readonly paginatedRoles = computed(() => {
    const roles = this.filteredRoles();
    const startIndex = (this.roleCurrentPage() - 1) * this.rolesPerPage;
    return roles.slice(startIndex, startIndex + this.rolesPerPage);
  });

  public readonly isStaffLimitReached = computed(() => {
    const maxStaffs = this.stateService.getFeatureLimit('max_staffs');
    return maxStaffs >= 0 && (this.stateService.staffs() || []).length >= maxStaffs;
  });

  // Danh sách các module trong Web POS hỗ trợ phân quyền
  public readonly modules = [
    {
      key: 'dashboard',
      name: 'Tổng quan',
      desc: 'Xem biểu đồ thống kê, doanh thu, lợi nhuận, ca trực',
    },
    { key: 'pos', name: 'Bán hàng', desc: 'Lập đơn hàng, chọn món, in hóa đơn tạm, thanh toán' },
    {
      key: 'orders',
      name: 'Đơn hàng',
      desc: 'Quản lý lịch sử đơn hàng, cập nhật trạng thái, đồng bộ blockchain',
    },
    { key: 'tables', name: 'Sơ đồ bàn', desc: 'Quản lý khu vực, bàn ăn và trạng thái sử dụng' },
    {
      key: 'shifts',
      name: 'Ca trực',
      desc: 'Mở ca, kết ca, khai báo két tiền mặt và đối soát chênh lệch',
    },
    { key: 'menu', name: 'Thực đơn', desc: 'Thêm, sửa, xóa món ăn, đồ uống và các biến thể' },
    { key: 'inventory', name: 'Kho hàng', desc: 'Quản lý nhập kho, xuất kho, kiểm kho hàng hóa' },
    {
      key: 'customers',
      name: 'Khách hàng',
      desc: 'Quản lý thông tin khách hàng và nhóm khách hàng',
    },
    { key: 'debts', name: 'Sổ nợ', desc: 'Xem danh sách nợ khách hàng, lập phiếu thu nợ, xóa nợ' },
    {
      key: 'financials',
      name: 'Sổ thu chi',
      desc: 'Lập phiếu thu, phiếu chi, quản lý dòng tiền mặt/on-chain',
    },
    {
      key: 'reports',
      name: 'Báo cáo',
      desc: 'Xem chi tiết báo cáo doanh thu, lãi lỗ, xuất file Excel',
    },
    { key: 'staffs', name: 'Nhân viên', desc: 'Quản lý nhân viên, phân quyền truy cập hệ thống' },
    {
      key: 'settings',
      name: 'Cấu hình quán',
      desc: 'Thiết lập thông tin quán, màu sắc dynamic, địa chỉ ví hợp đồng',
    },
  ];

  // Map các tùy chọn vai trò cho CustomSelect
  public get roleOptions() {
    return this.stateService.roles().map((r) => ({
      value: r.id,
      label: r.name,
    }));
  }

  ngOnInit() {
    this.stateService.refreshStaffsAndRoles();
  }

  public setSubTab(tab: 'staffs' | 'roles') {
    this.activeSubTab.set(tab);
    this.searchQuery.set('');
    this.staffCurrentPage.set(1);
    this.roleCurrentPage.set(1);
  }

  public onSearchQueryChange(query: string) {
    this.searchQuery.set(query);
    this.staffCurrentPage.set(1);
    this.roleCurrentPage.set(1);
  }

  // Mở form thêm nhân viên
  public openAddStaff() {
    const maxStaffs = this.stateService.getFeatureLimit('max_staffs');
    if (maxStaffs >= 0 && (this.stateService.staffs() || []).length >= maxStaffs) {
      this.stateService.showToast(
        `Gói cước hiện tại chỉ hỗ trợ tối đa ${maxStaffs} nhân viên. Vui lòng nâng cấp gói cước!`,
        'error',
      );
      return;
    }
    this.modalService.open(StaffFormModalComponent, {
      title: 'Thêm nhân viên mới',
      size: 'md',
      data: {
        editingStaff: null,
        roleOptions: this.roleOptions,
        isStaffLimitReached: this.isStaffLimitReached(),
      },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.staffCurrentPage.set(1);
        this.stateService.refreshStaffsAndRoles();
      }
    });
  }

  // Mở form sửa nhân viên
  public openEditStaff(staff: any) {
    this.modalService.open(StaffFormModalComponent, {
      title: 'Sửa thông tin nhân viên',
      size: 'md',
      data: {
        editingStaff: staff,
        roleOptions: this.roleOptions,
        isStaffLimitReached: this.isStaffLimitReached(),
      },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.stateService.refreshStaffsAndRoles();
      }
    });
  }

  // Mở form thêm vai trò
  public openAddRole() {
    this.modalService.open(RoleFormModalComponent, {
      title: 'Tạo vai trò mới',
      size: 'xl',
      data: {
        editingRole: null,
        modules: this.modules,
      },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.roleCurrentPage.set(1);
        this.stateService.refreshStaffsAndRoles();
      }
    });
  }

  // Mở form sửa vai trò
  public openEditRole(role: any) {
    this.modalService.open(RoleFormModalComponent, {
      title: 'Thiết lập vai trò & phân quyền',
      size: 'xl',
      data: {
        editingRole: role,
        modules: this.modules,
      },
    }).afterClosed$.subscribe((success) => {
      if (success) {
        this.stateService.refreshStaffsAndRoles();
      }
    });
  }

  // Trigger xác nhận xóa
  public triggerDeleteStaff(staff: any) {
    this.modalService.confirm({
      title: 'Xóa nhân viên',
      description: `Bạn có chắc chắn muốn xóa nhân viên "${staff.name}" không? Ví của nhân viên này sẽ bị ngắt kết nối khỏi hệ thống của quán ngay lập tức.`,
      confirmText: 'Xóa nhân viên',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirm) => {
      if (confirm) {
        this.apiService.deleteStaff(staff.id).subscribe({
          next: () => {
            this.stateService.showToast('Đã xóa nhân viên thành công!', 'success');
            this.stateService.refreshStaffsAndRoles();
            setTimeout(() => {
              const total = this.stateService.staffs().length;
              const maxPage = Math.max(1, Math.ceil(total / this.staffsPerPage));
              if (this.staffCurrentPage() > maxPage) {
                this.staffCurrentPage.set(maxPage);
              }
            }, 300);
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Không thể xóa tài nguyên này.';
            this.stateService.showToast(errorMsg, 'error');
          },
        });
      }
    });
  }

  public triggerDeleteRole(role: any) {
    this.modalService.confirm({
      title: 'Xóa vai trò',
      description: `Bạn có chắc chắn muốn xóa vai trò "${role.name}" không? Thao tác này không thể hoàn tác nếu không có nhân viên nào đang sử dụng.`,
      confirmText: 'Xóa vai trò',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirm) => {
      if (confirm) {
        this.apiService.deleteRole(role.id).subscribe({
          next: () => {
            this.stateService.showToast('Đã xóa vai trò thành công!', 'success');
            this.stateService.refreshStaffsAndRoles();
            setTimeout(() => {
              const total = this.stateService.roles().length;
              const maxPage = Math.max(1, Math.ceil(total / this.rolesPerPage));
              if (this.roleCurrentPage() > maxPage) {
                this.roleCurrentPage.set(maxPage);
              }
            }, 300);
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Không thể xóa tài nguyên này.';
            this.stateService.showToast(errorMsg, 'error');
          },
        });
      }
    });
  }

  // Xử lý xác nhận khôi phục vai trò mặc định
  public resetRoles() {
    this.modalService.confirm({
      title: 'Khôi phục vai trò mặc định',
      description: 'Hành động này sẽ tạo lại các vai trò mặc định bị thiếu và cập nhật lại quyền hạn của các vai trò hiện tại (Chủ quán, Quản lý, Thu ngân, Kế toán) về cấu hình ban đầu. Các vai trò tự tạo khác sẽ được giữ nguyên. Bạn có chắc chắn muốn khôi phục?',
      confirmText: 'Khôi phục',
      cancelText: 'Hủy',
    }).afterClosed$.subscribe((confirm) => {
      if (confirm) {
        this.stateService.resetDefaultRoles();
      }
    });
  }

  // Trả về danh sách tên module được kích hoạt quyền để hiển thị tóm tắt
  public getRolePermissionsSummary(role: any): string {
    const perms = role.permissions || {};
    const activeModules = this.modules
      .filter((m) => !!perms[m.key])
      .map((m) => m.name.split(' ')[0]); // Lấy chữ đầu (Tổng, Bán, Thực...)

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
