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
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ModalService } from '@core/services/modal.service';
import { CustomerFormModalComponent } from './components/customer-form-modal/customer-form-modal.component';
import { CustomerGroupModalComponent } from './components/customer-group-modal/customer-group-modal.component';
import { ShortAddressPipe } from '@shared/pipes/short-address.pipe';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  TableComponent,
  TableCellDirective,
  TableColumn,
} from '@shared/components/table/table.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { CustomSearchInputComponent } from '@shared/components/custom-search-input/custom-search-input.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PaginationComponent,
    ShortAddressPipe,
    PageHeaderComponent,
    TableComponent,
    TableCellDirective,
    IconComponent,
    SkeletonLoaderComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    CustomSearchInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  public readonly customerColumns: TableColumn[] = [
    {
      key: 'customer_code',
      header: 'Mã khách',
      sortable: false,
      class: 'font-bold whitespace-nowrap',
    },
    {
      key: 'name',
      header: 'Tên khách hàng / Doanh nghiệp',
      sortable: false,
      class: 'font-extrabold text-slate-800 dark:text-white whitespace-nowrap',
    },
    { key: 'type', header: 'Phân loại', sortable: false, class: 'whitespace-nowrap' },
    { key: 'phone', header: 'Điện thoại', sortable: false, class: 'font-bold whitespace-nowrap' },
    { key: 'dob', header: 'Ngày sinh / MST', sortable: false, class: 'whitespace-nowrap' },
    {
      key: 'wallet_address',
      header: 'Địa chỉ ví Web3',
      sortable: false,
      class: 'whitespace-nowrap font-mono',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right whitespace-nowrap',
      headerClass: 'text-right',
    },
  ];

  public readonly groupColumns: TableColumn[] = [
    { key: 'id', header: 'Mã nhóm', sortable: false, class: 'font-bold whitespace-nowrap' },
    {
      key: 'name',
      header: 'Tên nhóm khách hàng',
      sortable: false,
      class: 'font-extrabold text-slate-800 dark:text-white whitespace-nowrap',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right whitespace-nowrap',
      headerClass: 'text-right',
    },
  ];
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly modalService = inject(ModalService);

  // Bộ lọc, phân trang khách hàng
  public readonly customerGroupCurrentPage = signal<number>(1);
  public readonly customerGroupItemsPerPage = 10;

  // Bộ tìm kiếm khách hàng
  public readonly customerSearchQuery = signal<string>('');

  // Form & Modals Khách hàng
  public readonly isCustomerDropdownOpen = signal<boolean>(false);

  // Getters từ StateService
  public get customers() {
    return this.stateService.customers;
  }
  public get customerGroups() {
    return this.stateService.customerGroups;
  }
  public get isCustomersLoading() {
    return this.stateService.isCustomersLoading;
  }
  public get totalCustomers() {
    return this.stateService.totalCustomers;
  }
  public get customerCurrentPage() {
    return this.stateService.customerCurrentPage;
  }
  public get customerItemsPerPage() {
    return this.stateService.customerItemsPerPage;
  }

  // Computed Properties Khách hàng
  public readonly filteredCustomers = computed(() => {
    return this.customers();
  });

  public readonly paginatedCustomers = computed(() => {
    return this.customers();
  });

  public readonly customerTotalPages = computed(() => {
    return Math.ceil(this.totalCustomers() / this.customerItemsPerPage) || 1;
  });

  // Computed phân trang Nhóm Khách hàng (Giữ phân trang client vì danh sách nhỏ)
  public readonly paginatedCustomerGroups = computed(() => {
    const list = this.customerGroups();
    const startIndex = (this.customerGroupCurrentPage() - 1) * this.customerGroupItemsPerPage;
    return list.slice(startIndex, startIndex + this.customerGroupItemsPerPage);
  });

  public readonly customerGroupTotalPages = computed(() => {
    return Math.ceil(this.customerGroups().length / this.customerGroupItemsPerPage) || 1;
  });

  ngOnInit() {
    this.refreshCustomers(1);
  }

  // Tải lại dữ liệu từ DB (phân trang)
  public refreshCustomers(page: number = this.customerCurrentPage()) {
    this.stateService.refreshCustomers(
      true, // force load
      page,
      this.customerItemsPerPage,
      this.customerSearchQuery()
    );
  }

  public onSearchQueryChange(query: string) {
    this.customerSearchQuery.set(query);
    this.refreshCustomers(1);
  }

  public getBusinessStatusColor(status: string): 'emerald' | 'amber' | 'rose' {
    if (!status) return 'emerald';
    const s = status.toLowerCase();
    if (
      s.includes('ngừng') ||
      s.includes('chấm dứt') ||
      s.includes('không hoạt động') ||
      s.includes('đóng cửa') ||
      s.includes('nguong')
    ) {
      return 'rose';
    }
    if (
      s.includes('tạm nghỉ') ||
      s.includes('tạm ngưng') ||
      s.includes('tam nghi') ||
      s.includes('tam ngung')
    ) {
      return 'amber';
    }
    return 'emerald';
  }

  // --- Customer CRUD ---
  public openAddCustomerModal(type: 'individual' | 'business' = 'individual') {
    this.modalService.open(CustomerFormModalComponent, {
      title: 'Thêm khách hàng mới',
      size: 'md',
      data: { type }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.refreshCustomers();
      }
    });
    this.isCustomerDropdownOpen.set(false);
  }

  public openEditCustomerModal(customer: any) {
    this.modalService.open(CustomerFormModalComponent, {
      title: 'Cập nhật thông tin khách hàng',
      size: 'md',
      data: { customer }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.refreshCustomers();
      }
    });
  }

  public deleteCustomer(cust: any) {
    this.modalService.confirm({
      title: 'Xóa khách hàng?',
      description: `Bạn có chắc chắn muốn xóa khách hàng "${cust.name}" khỏi hệ thống? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy bỏ'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteCustomer(cust);
      }
    });
  }

  public confirmDeleteCustomer(cust: any) {
    if (!cust) return;
    const id = cust.id;

    this.stateService.isLoading.set(true);
    this.apiService.deleteCustomer(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa khách hàng thành công!', 'success');
        this.refreshCustomers();
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa khách hàng thất bại!', 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }

  // --- Customer Group CRUD ---
  public openAddCustomerGroupModal() {
    this.modalService.open(CustomerGroupModalComponent, {
      title: 'Thêm nhóm khách hàng',
      size: 'sm'
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.refreshCustomers();
      }
    });
  }

  public openEditCustomerGroupModal(group: any) {
    this.modalService.open(CustomerGroupModalComponent, {
      title: 'Cập nhật nhóm khách hàng',
      size: 'sm',
      data: { group }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.refreshCustomers();
      }
    });
  }

  public deleteCustomerGroup(group: any) {
    this.modalService.confirm({
      title: 'Xóa nhóm khách hàng?',
      description: `Bạn có chắc chắn muốn xóa nhóm "${group.name}"? Các khách hàng trong nhóm sẽ không bị xóa mà chỉ bị gỡ khỏi nhóm này.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy bỏ'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteCustomerGroup(group);
      }
    });
  }

  public confirmDeleteCustomerGroup(group: any) {
    if (!group) return;
    const id = group.id;

    this.stateService.isLoading.set(true);
    this.apiService.deleteCustomerGroup(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa nhóm khách hàng thành công!', 'success');
        this.refreshCustomers();
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa nhóm thất bại!', 'error');
        this.stateService.isLoading.set(false);
      },
    });
  }
}
