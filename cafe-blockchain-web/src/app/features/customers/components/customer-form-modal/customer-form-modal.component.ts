import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';

@Component({
  selector: 'app-customer-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomDatePickerComponent,
    CustomCheckboxComponent,
    IconComponent,
    ButtonComponent,
    TabGroupComponent,
  ],
  templateUrl: './customer-form-modal.component.html',
})
export class CustomerFormModalComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isCustomerSaving = signal<boolean>(false);
  public readonly isSearchingTax = signal<boolean>(false);
  public customerModalType: 'add' | 'edit' = 'add';
  private editingCustomer: any = null;

  public readonly customerTypeOptions: TabOption[] = [
    { value: 'individual', label: 'Cá nhân (B2C)' },
    { value: 'business', label: 'Doanh nghiệp (B2B)' },
  ];

  public readonly genderOptions: TabOption[] = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
  ];

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
    wallet_address: '',
  });

  public updateCustomerForm(field: string, value: any): void {
    this.customerForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  private taxLookupTimeout: any = null;
  private lastSearchedTaxCode: string = '';
  private taxLookupCache: { [key: string]: any } = {};

  public get customerGroups() {
    return this.stateService.customerGroups;
  }

  ngOnInit(): void {
    if (this.modalData && this.modalData.customer) {
      this.customerModalType = 'edit';
      this.editingCustomer = this.modalData.customer;
      this.customerForm.set({
        name: this.editingCustomer.name,
        phone: this.editingCustomer.phone || '',
        email: this.editingCustomer.email || '',
        dob: this.editingCustomer.dob || '',
        gender: this.editingCustomer.gender || 'Nam',
        address: this.editingCustomer.address || '',
        group_ids: this.editingCustomer.groups ? this.editingCustomer.groups.map((g: any) => g.id) : [],
        type: this.editingCustomer.type || 'individual',
        company_name: this.editingCustomer.company_name || '',
        tax_code: this.editingCustomer.tax_code || '',
        representative_name: this.editingCustomer.representative_name || '',
        website: this.editingCustomer.website || '',
        business_status: this.editingCustomer.business_status || 'Đang hoạt động',
        wallet_address: this.editingCustomer.wallet_address || '',
      });
    } else {
      this.customerModalType = 'add';
      const initialType = this.modalData?.type || 'individual';
      this.customerForm.set({
        name: '',
        phone: '',
        email: '',
        dob: '',
        gender: 'Nam',
        address: '',
        group_ids: [],
        type: initialType,
        company_name: '',
        tax_code: '',
        representative_name: '',
        website: '',
        business_status: 'Đang hoạt động',
        wallet_address: '',
      });
    }
  }

  public onTaxCodeChange(taxCode: string): void {
    if (!taxCode) return;
    const cleanTax = taxCode.replace(/\s+/g, '');

    if (cleanTax.length !== 10 && cleanTax.length !== 13) {
      return;
    }

    if (cleanTax === this.lastSearchedTaxCode) {
      return;
    }

    if (this.taxLookupTimeout) {
      clearTimeout(this.taxLookupTimeout);
    }

    this.taxLookupTimeout = setTimeout(() => {
      if (this.taxLookupCache[cleanTax]) {
        const cachedData = this.taxLookupCache[cleanTax];
        this.customerForm.update((form) => ({
          ...form,
          company_name: cachedData.name || form.company_name,
          address: cachedData.address || form.address,
          representative_name: cachedData.representative || form.representative_name,
          business_status: cachedData.status || 'Đang hoạt động',
        }));
        this.lastSearchedTaxCode = cleanTax;
        this.stateService.showToast('Đã khôi phục thông tin từ bộ nhớ đệm!', 'success');
        return;
      }

      this.isSearchingTax.set(true);
      fetch(`https://api.vietqr.io/v2/business/${cleanTax}`)
        .then((res) => res.json())
        .then((res) => {
          this.isSearchingTax.set(false);
          if (res && res.code === '00' && res.data) {
            this.taxLookupCache[cleanTax] = res.data;
            this.lastSearchedTaxCode = cleanTax;

            this.customerForm.update((form) => ({
              ...form,
              company_name: res.data.name || form.company_name,
              address: res.data.address || form.address,
              representative_name: res.data.representative || form.representative_name,
              business_status: res.data.status || 'Đang hoạt động',
            }));
            this.stateService.showToast('Đã tìm thấy thông tin doanh nghiệp!', 'success');
          } else {
            this.stateService.showToast(
              'Không tìm thấy thông tin doanh nghiệp cho mã số thuế này.',
              'error',
            );
          }
        })
        .catch((err) => {
          this.isSearchingTax.set(false);
          console.error('Lỗi tra cứu mã số thuế:', err);
          this.stateService.showToast('Lỗi kết nối khi tra cứu mã số thuế!', 'error');
        });
    }, 1000);
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

  public toggleCustomerFormGroup(groupId: number): void {
    this.customerForm.update((form) => {
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

  public saveCustomer(): void {
    const form = { ...this.customerForm() };

    if (form.type === 'business') {
      if (!form.company_name || !form.company_name.trim()) {
        this.stateService.showToast('Tên công ty / Doanh nghiệp là bắt buộc!', 'error');
        return;
      }
      if (!form.name || !form.name.trim()) {
        form.name = form.company_name;
      }
    } else {
      if (!form.name || !form.name.trim()) {
        this.stateService.showToast('Tên khách hàng là bắt buộc!', 'error');
        return;
      }
    }

    if (form.wallet_address && form.wallet_address.trim()) {
      const walletTrimmed = form.wallet_address.trim();
      const isValidEvmWallet = /^0x[a-fA-F0-9]{40}$/.test(walletTrimmed);
      if (!isValidEvmWallet) {
        this.stateService.showToast(
          `Địa chỉ ví Web3 không hợp lệ! Phải đúng 42 ký tự, bắt đầu bằng 0x.`,
          'error',
        );
        return;
      }
    }

    this.isCustomerSaving.set(true);

    if (this.customerModalType === 'add') {
      this.apiService.createCustomer(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm khách hàng thành công!', 'success');
          this.isCustomerSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Thêm khách hàng thất bại!', 'error');
          this.isCustomerSaving.set(false);
        },
      });
    } else {
      const id = this.editingCustomer.id;
      this.apiService.updateCustomer(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật khách hàng thành công!', 'success');
          this.isCustomerSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Cập nhật khách hàng thất bại!', 'error');
          this.isCustomerSaving.set(false);
        },
      });
    }
  }
}
