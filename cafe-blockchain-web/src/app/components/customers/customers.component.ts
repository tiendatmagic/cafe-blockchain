import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers.component.html'
})
export class CustomersComponent {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  // Bộ lọc, phân trang khách hàng
  public readonly customerCurrentPage = signal<number>(1);
  public readonly customerItemsPerPage = 9;
  public readonly customerGroupCurrentPage = signal<number>(1);
  public readonly customerGroupItemsPerPage = 9;
  
  // Bộ tìm kiếm khách hàng
  public readonly customerSearchQuery = signal<string>('');

  // Form & Modals Khách hàng
  public readonly isCustomerModalOpen = signal<boolean>(false);
  public readonly isCustomerGroupModalOpen = signal<boolean>(false);
  public readonly customerModalType = signal<'add' | 'edit'>('add');
  public readonly customerGroupModalType = signal<'add' | 'edit'>('add');
  public readonly editingCustomer = signal<any>(null);
  public readonly editingCustomerGroup = signal<any>(null);
  public readonly isCustomerSaving = signal<boolean>(false);
  public readonly isCustomerGroupSaving = signal<boolean>(false);
  public readonly isCustomerDropdownOpen = signal<boolean>(false);

  // Trạng thái modal xác nhận xóa khách hàng & nhóm
  public readonly isDeleteCustomerConfirmOpen = signal<boolean>(false);
  public readonly deletingCustomer = signal<any>(null);
  public readonly isDeleteGroupConfirmOpen = signal<boolean>(false);
  public readonly deletingGroup = signal<any>(null);

  // Tra cứu mã số thuế (VietQR API)
  public readonly isSearchingTax = signal<boolean>(false);
  private taxLookupTimeout: any = null;
  private lastSearchedTaxCode: string = '';
  private taxLookupCache: { [key: string]: any } = {};

  public readonly customerForm = signal<any>({
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'Nam',
    address: '',
    group_ids: [],
    type: 'individual',
    company_name: '',
    tax_code: '',
    representative_name: '',
    website: '',
    business_status: 'Đang hoạt động',
    wallet_address: ''
  });

  public readonly customerGroupForm = signal<any>({
    name: ''
  });

  // Getters từ StateService
  public get customers() { return this.stateService.customers; }
  public get customerGroups() { return this.stateService.customerGroups; }
  public get isCustomersLoading() { return this.stateService.isCustomersLoading; }

  private removeSign(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Lọc danh sách khách hàng cục bộ tức thời tại client
  public readonly filteredCustomers = computed(() => {
    let list = this.customers();
    const search = this.customerSearchQuery().trim().toLowerCase();
    if (search) {
      const searchClean = this.removeSign(search);
      list = list.filter(c => {
        const nameClean = c.name ? this.removeSign(c.name.toLowerCase()) : '';
        const phoneClean = c.phone ? c.phone.toLowerCase() : '';
        const emailClean = c.email ? this.removeSign(c.email.toLowerCase()) : '';
        const codeClean = c.customer_code ? c.customer_code.toLowerCase() : '';
        const companyClean = c.company_name ? this.removeSign(c.company_name.toLowerCase()) : '';
        const repClean = c.representative_name ? this.removeSign(c.representative_name.toLowerCase()) : '';
        const taxClean = c.tax_code ? c.tax_code.toLowerCase() : '';
        const idClean = c.id ? c.id.toString() : '';

        return nameClean.includes(searchClean) ||
               phoneClean.includes(searchClean) ||
               emailClean.includes(searchClean) ||
               codeClean.includes(searchClean) ||
               companyClean.includes(searchClean) ||
               repClean.includes(searchClean) ||
               taxClean.includes(searchClean) ||
               idClean.includes(searchClean);
      });
    }
    return list;
  });

  // Computed phân trang Khách hàng dựa trên danh sách đã lọc
  public readonly paginatedCustomers = computed(() => {
    const list = this.filteredCustomers();
    const startIndex = (this.customerCurrentPage() - 1) * this.customerItemsPerPage;
    return list.slice(startIndex, startIndex + this.customerItemsPerPage);
  });

  public readonly customerTotalPages = computed(() => {
    return Math.ceil(this.filteredCustomers().length / this.customerItemsPerPage) || 1;
  });

  // Computed phân trang Nhóm Khách hàng
  public readonly paginatedCustomerGroups = computed(() => {
    const list = this.customerGroups();
    const startIndex = (this.customerGroupCurrentPage() - 1) * this.customerGroupItemsPerPage;
    return list.slice(startIndex, startIndex + this.customerGroupItemsPerPage);
  });

  public readonly customerGroupTotalPages = computed(() => {
    return Math.ceil(this.customerGroups().length / this.customerGroupItemsPerPage) || 1;
  });

  // Tải lại dữ liệu
  public refreshCustomers() {
    this.stateService.refreshCustomers();
  }

  // --- Tra cứu mã số thuế ---
  public onTaxCodeChange(taxCode: string) {
    if (!taxCode) return;
    const cleanTax = taxCode.replace(/\s+/g, '');

    // Chỉ xử lý khi độ dài chính xác là 10 hoặc 13 ký tự (MST Việt Nam)
    if (cleanTax.length !== 10 && cleanTax.length !== 13) {
      return;
    }

    // Nếu trùng với mã số thuế vừa tìm kiếm gần nhất thì không gọi lại
    if (cleanTax === this.lastSearchedTaxCode) {
      return;
    }

    // Hủy timeout cũ nếu người dùng vẫn đang tiếp tục gõ
    if (this.taxLookupTimeout) {
      clearTimeout(this.taxLookupTimeout);
    }

    // Thiết lập debounce 1s (1000ms)
    this.taxLookupTimeout = setTimeout(() => {
      // 1. Kiểm tra kết quả trong bộ nhớ đệm (Local Cache) trước
      if (this.taxLookupCache[cleanTax]) {
        const cachedData = this.taxLookupCache[cleanTax];
        this.customerForm.update(form => ({
          ...form,
          company_name: cachedData.name || form.company_name,
          address: cachedData.address || form.address,
          representative_name: cachedData.representative || form.representative_name,
          business_status: cachedData.status || 'Đang hoạt động'
        }));
        this.lastSearchedTaxCode = cleanTax;
        this.stateService.showToast('Đã khôi phục thông tin từ bộ nhớ đệm!', 'success');
        return;
      }

      // 2. Nếu không có trong cache, tiến hành gọi API mạng
      this.isSearchingTax.set(true);
      fetch(`https://api.vietqr.io/v2/business/${cleanTax}`)
        .then(res => res.json())
        .then(res => {
          this.isSearchingTax.set(false);
          if (res && res.code === '00' && res.data) {
            // Lưu dữ liệu vào cache để tái sử dụng
            this.taxLookupCache[cleanTax] = res.data;
            this.lastSearchedTaxCode = cleanTax;

            this.customerForm.update(form => ({
              ...form,
              company_name: res.data.name || form.company_name,
              address: res.data.address || form.address,
              representative_name: res.data.representative || form.representative_name,
              business_status: res.data.status || 'Đang hoạt động'
            }));
            this.stateService.showToast('Đã tìm thấy thông tin doanh nghiệp!', 'success');
          } else {
            this.stateService.showToast('Không tìm thấy thông tin doanh nghiệp cho mã số thuế này.', 'error');
          }
        })
        .catch(err => {
          this.isSearchingTax.set(false);
          console.error('Lỗi tra cứu mã số thuế:', err);
          this.stateService.showToast('Lỗi kết nối khi tra cứu mã số thuế!', 'error');
        });
    }, 1000);
  }

  public getBusinessStatusColor(status: string): 'emerald' | 'amber' | 'rose' {
    if (!status) return 'emerald';
    const s = status.toLowerCase();
    if (s.includes('ngừng') || s.includes('chấm dứt') || s.includes('không hoạt động') || s.includes('đóng cửa') || s.includes('nguong')) {
      return 'rose';
    }
    if (s.includes('tạm nghỉ') || s.includes('tạm ngưng') || s.includes('tam nghi') || s.includes('tam ngung')) {
      return 'amber';
    }
    return 'emerald';
  }

  // --- Customer CRUD ---
  public openAddCustomerModal(type: 'individual' | 'business' = 'individual') {
    this.customerModalType.set('add');
    this.editingCustomer.set(null);
    this.customerForm.set({
      name: '',
      phone: '',
      email: '',
      dob: '',
      gender: 'Nam',
      address: '',
      group_ids: [],
      type: type,
      company_name: '',
      tax_code: '',
      representative_name: '',
      website: '',
      business_status: 'Đang hoạt động',
      wallet_address: ''
    });
    this.isCustomerModalOpen.set(true);
    this.isCustomerDropdownOpen.set(false);
  }

  public openEditCustomerModal(customer: any) {
    this.customerModalType.set('edit');
    this.editingCustomer.set(customer);
    this.customerForm.set({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      dob: customer.dob || '',
      gender: customer.gender || 'Nam',
      address: customer.address || '',
      group_ids: customer.groups ? customer.groups.map((g: any) => g.id) : [],
      type: customer.type || 'individual',
      company_name: customer.company_name || '',
      tax_code: customer.tax_code || '',
      representative_name: customer.representative_name || '',
      website: customer.website || '',
      business_status: customer.business_status || 'Đang hoạt động',
      wallet_address: customer.wallet_address || ''
    });
    this.isCustomerModalOpen.set(true);
  }

  public closeCustomerModal() {
    this.isCustomerModalOpen.set(false);
    this.editingCustomer.set(null);
  }

  public toggleCustomerFormGroup(groupId: number) {
    this.customerForm.update(form => {
      const ids = [...(form.group_ids || [])];
      const index = ids.indexOf(groupId);
      if (index > -1) {
        ids.splice(index, 1);
      } else {
        ids.push(groupId);
      }
      return { ...form, group_ids: ids };
    });
  }

  public saveCustomer() {
    const form = { ...this.customerForm() };
    
    // Nếu là doanh nghiệp và người đại diện trống, tự động lấy tên công ty
    if (form.type === 'business') {
      if (!form.company_name || !form.company_name.trim()) {
        this.stateService.showToast('Tên công ty / Doanh nghiệp là bắt buộc!', 'error');
        return;
      }
      if (!form.name || !form.name.trim()) {
        form.name = form.company_name;
      }
    } else {
      // Cá nhân bắt buộc có tên
      if (!form.name || !form.name.trim()) {
        this.stateService.showToast('Tên khách hàng là bắt buộc!', 'error');
        return;
      }
    }

    this.isCustomerSaving.set(true);

    // Validate địa chỉ ví EVM nếu có nhập: phải đúng 42 ký tự (0x + 40 hex)
    if (form.wallet_address && form.wallet_address.trim()) {
      const walletTrimmed = form.wallet_address.trim();
      const isValidEvmWallet = /^0x[a-fA-F0-9]{40}$/.test(walletTrimmed);
      if (!isValidEvmWallet) {
        this.stateService.showToast(`Địa chỉ ví Web3 không hợp lệ! Phải đúng 42 ký tự (hiện ${walletTrimmed.length}/42), bắt đầu bằng 0x.`, 'error');
        this.isCustomerSaving.set(false);
        return;
      }
    }

    if (this.customerModalType() === 'add') {
      this.apiService.createCustomer(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm khách hàng thành công!', 'success');
          this.closeCustomerModal();
          this.refreshCustomers();
          this.isCustomerSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Thêm khách hàng thất bại!', 'error');
          this.isCustomerSaving.set(false);
        }
      });
    } else {
      const id = this.editingCustomer().id;
      this.apiService.updateCustomer(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật khách hàng thành công!', 'success');
          this.closeCustomerModal();
          this.refreshCustomers();
          this.isCustomerSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Cập nhật khách hàng thất bại!', 'error');
          this.isCustomerSaving.set(false);
        }
      });
    }
  }

  public deleteCustomer(cust: any) {
    this.deletingCustomer.set(cust);
    this.isDeleteCustomerConfirmOpen.set(true);
  }

  public confirmDeleteCustomer() {
    const cust = this.deletingCustomer();
    if (!cust) return;
    const id = cust.id;

    this.isDeleteCustomerConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteCustomer(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa khách hàng thành công!', 'success');
        this.refreshCustomers();
        this.deletingCustomer.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa khách hàng thất bại!', 'error');
        this.deletingCustomer.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  // --- Customer Group CRUD ---
  public openAddCustomerGroupModal() {
    this.customerGroupModalType.set('add');
    this.editingCustomerGroup.set(null);
    this.customerGroupForm.set({ name: '' });
    this.isCustomerGroupModalOpen.set(true);
  }

  public openEditCustomerGroupModal(group: any) {
    this.customerGroupModalType.set('edit');
    this.editingCustomerGroup.set(group);
    this.customerGroupForm.set({ name: group.name });
    this.isCustomerGroupModalOpen.set(true);
  }

  public closeCustomerGroupModal() {
    this.isCustomerGroupModalOpen.set(false);
    this.editingCustomerGroup.set(null);
  }

  public saveCustomerGroup() {
    const form = this.customerGroupForm();
    if (!form.name || !form.name.trim()) {
      this.stateService.showToast('Tên nhóm khách hàng là bắt buộc!', 'error');
      return;
    }

    this.isCustomerGroupSaving.set(true);
    if (this.customerGroupModalType() === 'add') {
      this.apiService.createCustomerGroup(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm nhóm khách hàng thành công!', 'success');
          this.closeCustomerGroupModal();
          this.refreshCustomers();
          this.isCustomerGroupSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Thêm nhóm thất bại hoặc tên nhóm đã tồn tại!', 'error');
          this.isCustomerGroupSaving.set(false);
        }
      });
    } else {
      const id = this.editingCustomerGroup().id;
      this.apiService.updateCustomerGroup(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật nhóm khách hàng thành công!', 'success');
          this.closeCustomerGroupModal();
          this.refreshCustomers();
          this.isCustomerGroupSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Cập nhật nhóm thất bại!', 'error');
          this.isCustomerGroupSaving.set(false);
        }
      });
    }
  }

  public deleteCustomerGroup(group: any) {
    this.deletingGroup.set(group);
    this.isDeleteGroupConfirmOpen.set(true);
  }

  public confirmDeleteCustomerGroup() {
    const group = this.deletingGroup();
    if (!group) return;
    const id = group.id;

    this.isDeleteGroupConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteCustomerGroup(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa nhóm khách hàng thành công!', 'success');
        this.refreshCustomers();
        this.deletingGroup.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa nhóm thất bại!', 'error');
        this.deletingGroup.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  // Helpers cho template
  public getPagesArray(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    pages.push(totalPages);
    
    return pages;
  }

  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
