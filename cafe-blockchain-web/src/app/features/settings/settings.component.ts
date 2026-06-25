import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import {
  Component,
  inject,
  signal,
  OnInit,
  effect,
  untracked,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { ModalService } from '@core/services/modal.service';
import { PaymentFormModalComponent } from './components/payment-form-modal/payment-form-modal.component';
import { QrCodeModalComponent } from './components/qr-code-modal/qr-code-modal.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import {
  TableComponent,
  TableCellDirective,
  TableColumn,
} from '@shared/components/table/table.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { POPULAR_CHAINS } from '@core/utils/blockchain.utils';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PageHeaderComponent,
    CustomSelectComponent,
    CustomSwitchComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent,
    TableComponent,
    TableCellDirective,
    ButtonComponent,
    CustomCheckboxComponent,
    CardComponent,
    BadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalService);

  public get isSettingsLoading() {
    return this.stateService.isSettingsLoading;
  }

  constructor() {
    // Tự động đồng bộ form cấu hình khi dữ liệu settings của StateService thay đổi
    effect(() => {
      const settings = this.stateService.settings();
      if (settings) {
        untracked(() => {
          this.configForm.set({
            ...settings,
            relayer_private_key: '',
          });
          this.syncSelectedCategories();

          // Parse giờ mở cửa hoạt động (HH:mm - HH:mm)
          const openingHours = settings.store_opening_hours || '';
          if (openingHours && openingHours.includes(' - ')) {
            const parts = openingHours.split(' - ');
            if (parts[0] && parts[0].includes(':')) {
              const startParts = parts[0].split(':');
              this.startHour.set(startParts[0] || '08');
              this.startMinute.set(startParts[1] || '00');
            }
            if (parts[1] && parts[1].includes(':')) {
              const endParts = parts[1].split(':');
              this.endHour.set(endParts[0] || '17');
              this.endMinute.set(endParts[1] || '00');
            }
          } else {
            this.startHour.set('08');
            this.startMinute.set('00');
            this.endHour.set('17');
            this.endMinute.set('00');
          }

          // Reset lỗi
          this.phoneError.set('');
          this.dateTimeError.set('');
          this.descriptionError.set('');

          // Đếm từ mô tả ban đầu
          const desc = settings.store_description || '';
          const words = desc.trim().split(/\s+/).filter((w: string) => w.length > 0);
          this.descriptionWordCount.set(words.length);

          // Tải danh sách owners nếu ví đã kết nối và tab hiện tại là permissions
          if (this.web3Service.walletConnected() && this.settingsSubTab() === 'permissions') {
            this.loadOwnersList();
          }
        });
      }
    });
  }

  // Tab nhỏ trong Cấu hình: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store' | 'payment' | 'tax'
  public readonly settingsSubTab = signal<
    'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store' | 'payment' | 'tax'
  >('general');

  public get settingsSubTabOptions(): TabOption[] {
    const list: TabOption[] = [
      { value: 'general', label: 'Cấu hình Quán' },
      { value: 'blockchain', label: 'Blockchain Web3' },
      { value: 'permissions', label: 'Ủy quyền ví' },
      { value: 'payment', label: 'Thanh toán' },
      { value: 'invoice', label: 'Mẫu hoá đơn' },
    ];
    if (this.stateService.hasFeature('enable_tax') && this.stateService.hasPermission('tax')) {
      list.push({ value: 'tax', label: 'Cấu hình Thuế' });
    }
    list.push(
      { value: 'store', label: 'Website' },
      { value: 'voucher', label: 'Voucher NFT' }
    );
    return list;
  }

  // Các signals quản lý lỗi và đếm số từ
  public readonly phoneError = signal<string>('');
  public readonly dateTimeError = signal<string>('');
  public readonly descriptionError = signal<string>('');
  public readonly descriptionWordCount = signal<number>(0);

  // Custom Time Picker Signals
  public readonly hoursList: string[] = Array.from({ length: 24 }, (_, i) => i < 10 ? '0' + i : '' + i);
  public readonly minutesList: string[] = Array.from({ length: 60 }, (_, i) => i < 10 ? '0' + i : '' + i);
  public readonly isOpenTimePicker = signal<boolean>(false);
  public readonly startHour = signal<string>('08');
  public readonly startMinute = signal<string>('00');
  public readonly endHour = signal<string>('17');
  public readonly endMinute = signal<string>('00');

  // Form Cấu hình hệ thống
  public readonly configForm = signal<any>({
    store_name: '',
    store_phone: '',
    tax_enabled: '0',
    tax_default_rate: 10,
    tax_inclusive: '0',
    store_opening_hours: '',
    store_address: '',
    store_description: '',
    contract_address: '',
    finance_contract_address: '',
    voucher_contract_address: '',
    menu_registry_contract_address: '',
    loyalty_token_contract_address: '',
    voucher_shop_contract_address: '',
    voucher_marketplace_contract_address: '',
    relayer_private_key: '',
    rpc_url: '',
    chain_id: '',
    explorer_url: '',
    explorer_api_key: '',
    primary_color: '#ff00dd',
    secondary_color: '#8000ff',
    default_print_size: '80mm',
    voucher_gift_min_amount: 100000,
    voucher_discount_amount: 5000,
    voucher_use_min_amount: 100000,
    show_crypto_payment: '0',
    voucher_enabled: '0',
    has_synced_menu: '0',
    website_slug: '',
    store_categories: '',
    website_cover_image: '',
    store_status: '0',
    shipping_fee_flat_enabled: '0',
    shipping_fee_flat_amount: 0,
    shipping_fee_free_enabled: '0',
    shipping_fee_free_min_amount: 0,
    website_avatar_image: '',
    has_relayer_private_key: false,
  });

  // Validate số điện thoại
  public onPhoneChange(value: string) {
    this.updateConfigForm('store_phone', value);
    if (!value) {
      this.phoneError.set('Số điện thoại là bắt buộc.');
    } else if (!/^[0-9]+$/.test(value)) {
      this.phoneError.set('Số điện thoại chỉ được chứa ký số (0-9).');
    } else {
      this.phoneError.set('');
    }
  }

  // Toggle time picker dropdown
  public toggleTimePicker(event: MouseEvent) {
    event.stopPropagation();
    if (!this.web3Service.walletConnected() || !this.web3Service.isOwnerContract()) return;
    this.isOpenTimePicker.update(v => !v);
  }

  // Chọn giá trị giờ hoặc phút trong bộ chọn custom
  public selectTimeValue(type: 'startHour' | 'startMinute' | 'endHour' | 'endMinute', value: string) {
    if (type === 'startHour') this.startHour.set(value);
    if (type === 'startMinute') this.startMinute.set(value);
    if (type === 'endHour') this.endHour.set(value);
    if (type === 'endMinute') this.endMinute.set(value);

    this.updateOpeningHoursRange();
  }

  // Hàm ghép và validate khoảng thời gian HH:mm - HH:mm
  private updateOpeningHoursRange() {
    const sh = this.startHour();
    const sm = this.startMinute();
    const eh = this.endHour();
    const em = this.endMinute();

    const startVal = parseInt(sh) * 60 + parseInt(sm);
    const endVal = parseInt(eh) * 60 + parseInt(em);

    if (endVal <= startVal) {
      this.dateTimeError.set('Thời gian đóng cửa phải sau thời gian mở cửa.');
    } else {
      this.dateTimeError.set('');
    }

    this.updateConfigForm('store_opening_hours', `${sh}:${sm} - ${eh}:${em}`);
  }

  // Lắng nghe sự kiện click ra ngoài để tự động đóng dropdown bộ chọn giờ
  @HostListener('document:click', ['$event'])
  public onClickOutsideTimePicker(event: MouseEvent): void {
    const timePickerContainer = document.getElementById('time-picker-container');
    if (timePickerContainer && !timePickerContainer.contains(event.target as Node)) {
      this.isOpenTimePicker.set(false);
    }
  }

  // Validate mô tả cửa hàng và đếm số từ
  public onDescriptionChange(value: string) {
    this.updateConfigForm('store_description', value);
    if (!value) {
      this.descriptionWordCount.set(0);
      this.descriptionError.set('');
      return;
    }

    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    this.descriptionWordCount.set(count);

    if (count > 200) {
      this.descriptionError.set('Mô tả cửa hàng không được vượt quá 200 chữ.');
    } else {
      this.descriptionError.set('');
    }
  }

  // Quản lý các danh mục cho Website Cửa hàng
  public readonly categoriesList = signal<any[]>([]);
  public readonly selectedCategories = signal<string[]>([]);

  // Trạng thái lưu cấu hình & deploy smart contracts
  public readonly isConfigSaving = signal<boolean>(false);
  public readonly isDeploying = signal<boolean>(false);
  public readonly isDeployingFinance = signal<boolean>(false);
  public readonly isDeployingVoucher = signal<boolean>(false);
  public readonly isDeployingMenuRegistry = signal<boolean>(false);
  public readonly isDeployingLoyaltyToken = signal<boolean>(false);
  public readonly isDeployingVoucherShop = signal<boolean>(false);
  public readonly isDeployingVoucherMarketplace = signal<boolean>(false);

  // Trạng thái Quản trị Owner Ví và ví Kế toán trên Blockchain
  public readonly ownersFromChain = signal<string[]>([]);
  public readonly newOwnerAddress = signal<string>('');
  public readonly isOwnerActionLoading = signal<boolean>(false);
  public readonly isOwnersLoading = signal<boolean>(false);

  public readonly financeOwnersFromChain = signal<string[]>([]);
  public readonly newFinanceOwnerAddress = signal<string>('');
  public readonly isFinanceOwnerActionLoading = signal<boolean>(false);

  public readonly menuOwnersFromChain = signal<string[]>([]);
  public readonly newMenuOwnerAddress = signal<string>('');
  public readonly isMenuOwnerActionLoading = signal<boolean>(false);

  public readonly voucherOwnersFromChain = signal<string[]>([]);
  public readonly newVoucherOwnerAddress = signal<string>('');
  public readonly isVoucherOwnerActionLoading = signal<boolean>(false);
  public readonly isFinanceOwnersLoading = signal<boolean>(false);
  public readonly isMenuOwnersLoading = signal<boolean>(false);
  public readonly isVoucherOwnersLoading = signal<boolean>(false);

  // Dropdown chọn mạng
  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly selectedChainName = signal<string>('Tùy chỉnh (Custom EVM)');

  // Danh sách các mạng EVM phổ biến để Admin chọn nhanh
  public readonly POPULAR_CHAINS = POPULAR_CHAINS;

  // Getters từ StateService
  public get web3Service() {
    return this.stateService.web3Service;
  }
  public get settings() {
    return this.stateService.settings;
  }

  public ngOnInit() {
    // Đồng bộ tab hiện tại với Query Parameter 'tab' trên URL
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (
        tab &&
        ['general', 'blockchain', 'permissions', 'invoice', 'voucher', 'store', 'payment'].includes(
          tab,
        )
      ) {
        this.settingsSubTab.set(tab as any);
        if (tab === 'permissions' && this.web3Service.walletConnected()) {
          this.loadOwnersList();
        }
        if (tab === 'store') {
          this.loadStoreCategories();
        }
        if (tab === 'payment') {
          this.loadPaymentMethods();
        }
      }
    });
  }

  public setSettingsSubTab(
    subTab: 'general' | 'blockchain' | 'permissions' | 'invoice' | 'voucher' | 'store' | 'payment',
  ) {
    this.settingsSubTab.set(subTab);

    // Cập nhật query parameter tab trên URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: subTab },
      queryParamsHandling: 'merge',
    });

    if (subTab === 'permissions' && this.web3Service.walletConnected()) {
      this.loadOwnersList();
    }
    if (subTab === 'store') {
      this.loadStoreCategories();
    }
    if (subTab === 'payment') {
      this.loadPaymentMethods();
    }
  }

  // --- Hỗ trợ cấu hình Website Cửa hàng ---
  public loadStoreCategories() {
    this.apiService.getCategories().subscribe((res) => {
      if (res) {
        this.categoriesList.set(res);
        this.syncSelectedCategories();
      }
    });
  }

  public syncSelectedCategories() {
    const csv = this.configForm().store_categories || '';
    if (csv === 'all') {
      this.selectedCategories.set(this.categoriesList().map((c) => c.id.toString()));
    } else if (csv === '') {
      this.selectedCategories.set([]);
    } else {
      this.selectedCategories.set(csv.split(','));
    }
  }

  public isCategorySelected(categoryId: any): boolean {
    return this.selectedCategories().includes(categoryId.toString());
  }

  public toggleCategorySelection(categoryId: any) {
    const idStr = categoryId.toString();
    const current = [...this.selectedCategories()];
    const index = current.indexOf(idStr);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(idStr);
    }

    this.selectedCategories.set(current);

    // Nếu chọn hết, lưu là 'all' để tiện đồng bộ sau này hoặc lưu chuỗi CSV
    if (current.length === this.categoriesList().length && current.length > 0) {
      this.updateConfigForm('store_categories', 'all');
    } else {
      this.updateConfigForm('store_categories', current.join(','));
    }
  }

  public selectAllCategories() {
    const allIds = this.categoriesList().map((c) => c.id.toString());
    this.selectedCategories.set(allIds);
    this.updateConfigForm('store_categories', 'all');
  }

  public clearAllCategories() {
    this.selectedCategories.set([]);
    this.updateConfigForm('store_categories', '');
  }

  public getFullStoreLink(): string {
    const slug = this.configForm().website_slug || '';
    if (!slug) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/store/${slug}`;
    }
    return `http://localhost:4200/store/${slug}`;
  }

  public copyStoreLink() {
    const link = this.getFullStoreLink();
    if (!link) return;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.stateService.showToast('Đã sao chép liên kết Website Cửa hàng!', 'success');
      })
      .catch((err) => {
        this.stateService.showToast('Lỗi sao chép liên kết!', 'error');
      });
  }

  public updateConfigForm(field: string, value: any) {
    this.configForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  // Lưu cấu hình
  public saveConfig() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    
    // Kiểm tra lỗi validate trước khi lưu
    if (
      this.phoneError() ||
      this.dateTimeError() ||
      this.descriptionError() ||
      !this.configForm().store_name ||
      !this.configForm().store_phone
    ) {
      this.stateService.showToast(
        'Vui lòng nhập đầy đủ và sửa các lỗi nhập liệu trước khi lưu!',
        'error',
      );
      return;
    }

    this.isConfigSaving.set(true);
    const data = this.configForm();
    this.apiService.updateSettings(data).subscribe({
      next: (res) => {
        this.stateService.showToast('Lưu cấu hình quán và Blockchain thành công!', 'success');
        this.stateService.settings.set(res.data);
        // Cập nhật form với dữ liệu phản hồi đã ẩn private key, reset relayer_private_key về trống
        this.configForm.set({
          ...this.configForm(),
          ...res.data,
          relayer_private_key: '',
        });
        // Áp dụng màu sắc động
        this.stateService.applyAndCacheDynamicColors(
          res.data.primary_color,
          res.data.secondary_color,
        );
        this.web3Service.updateConfig(res.data);
        this.isConfigSaving.set(false);
      },
      error: () => {
        this.stateService.showToast('Lưu cấu hình thất bại!', 'error');
        this.isConfigSaving.set(false);
      },
    });
  }

  // Khôi phục màu sắc giao diện về mặc định
  public resetColorsToDefault() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    this.configForm.update((form) => ({
      ...form,
      primary_color: '#ff00dd',
      secondary_color: '#8000ff',
    }));
    this.stateService.applyDynamicColors('#ff00dd', '#8000ff');
    this.stateService.showToast(
      'Đã đặt màu về mặc định. Nhấn "LƯU CẤU HÌNH HỆ THỐNG" để ghi nhận!',
      'success',
    );
  }

  // Tự động deploy Smart Contract bán hàng mới
  public async deployNewContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeploying.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy thành công! Contract mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Deploy Smart Contract thất bại!', 'error');
    }
    this.isDeploying.set(false);
  }

  // Tự động deploy Smart Contract Tài chính mới
  public async deployFinanceContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingFinance.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract Tài chính trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployFinanceContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        finance_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ finance_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy Smart Contract Tài chính thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(
        res.error || 'Deploy Smart Contract Tài chính thất bại!',
        'error',
      );
    }
    this.isDeployingFinance.set(false);
  }

  // Tự động deploy Smart Contract NFT Voucher mới
  public async deployVoucherContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingVoucher.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract NFT Voucher trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployVoucherContractOnChain(this.configForm().chain_id);
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        voucher_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ voucher_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy Smart Contract NFT Voucher thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(
        res.error || 'Deploy Smart Contract NFT Voucher thất bại!',
        'error',
      );
    }
    this.isDeployingVoucher.set(false);
  }

  // Tự động deploy Smart Contract CafeToken mới
  public async deployLoyaltyTokenContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingLoyaltyToken.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract $CAFE Token trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployLoyaltyTokenContractOnChain(
      this.configForm().chain_id,
    );
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        loyalty_token_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ loyalty_token_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy $CAFE Token thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(res.error || 'Deploy $CAFE Token thất bại!', 'error');
    }
    this.isDeployingLoyaltyToken.set(false);
  }

  // Tự động deploy Smart Contract VoucherShop mới
  public async deployVoucherShopContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingVoucherShop.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract VoucherShop trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployVoucherShopContractOnChain(
      this.configForm().chain_id,
      this.configForm().loyalty_token_contract_address,
      this.configForm().voucher_contract_address,
    );
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        voucher_shop_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ voucher_shop_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy VoucherShop thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(res.error || 'Deploy VoucherShop thất bại!', 'error');
    }
    this.isDeployingVoucherShop.set(false);
  }

  // Tự động deploy Smart Contract VoucherMarketplace mới
  public async deployVoucherMarketplaceContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingVoucherMarketplace.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract VoucherMarketplace trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployVoucherMarketplaceContractOnChain(
      this.configForm().chain_id,
      this.configForm().loyalty_token_contract_address,
      this.configForm().voucher_contract_address,
      this.web3Service.currentAccount(),
    );
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        voucher_marketplace_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ voucher_marketplace_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy VoucherMarketplace thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(res.error || 'Deploy VoucherMarketplace thất bại!', 'error');
    }
    this.isDeployingVoucherMarketplace.set(false);
  }

  // Tự động deploy Smart Contract Menu Registry mới
  public async deployMenuRegistryContract() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url,
    });

    this.isDeployingMenuRegistry.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch Deploy Smart Contract Menu Registry trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.deployMenuRegistryContractOnChain(
      this.configForm().chain_id,
    );
    if (res.success && res.contractAddress) {
      this.configForm.update((form) => ({
        ...form,
        menu_registry_contract_address: res.contractAddress,
      }));
      this.web3Service.updateConfig({ menu_registry_contract_address: res.contractAddress });
      this.stateService.showToast(
        `Deploy Smart Contract Menu Registry thành công! Địa chỉ mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`,
        'success',
      );
    } else {
      this.stateService.showToast(
        res.error || 'Deploy Smart Contract Menu Registry thất bại!',
        'error',
      );
    }
    this.isDeployingMenuRegistry.set(false);
  }

  // Tải danh sách Owners trực tiếp từ Smart Contract Blockchain
  public async loadOwnersList() {
    if (this.web3Service.walletConnected()) {
      this.isOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getOwnersFromChain();
        this.ownersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví thu ngân:', e);
        this.ownersFromChain.set([]);
      } finally {
        this.isOwnersLoading.set(false);
      }
      await this.loadFinanceOwnersList();
      await this.loadMenuOwnersList();
      await this.loadVoucherOwnersList();
    }
  }

  // Thêm Owner (ví thu ngân) mới trên Blockchain
  public async addOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast(
        'Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!',
        'error',
      );
      return;
    }

    this.isOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch thêm Owner trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.addOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch thêm Owner thành công! TxHash: ${res.txHash}`,
        'success',
      );
      this.newOwnerAddress.set('');

      // Đồng bộ đăng ký ví thu ngân vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ đăng ký thu ngân:', err),
      });

      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Tải danh sách ví Kế toán trực tiếp từ Smart Contract Blockchain
  public async loadFinanceOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.financeContractAddress()) {
      this.isFinanceOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getFinanceOwnersFromChain();
        this.financeOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví kế toán:', e);
        this.financeOwnersFromChain.set([]);
      } finally {
        this.isFinanceOwnersLoading.set(false);
      }
    } else {
      this.financeOwnersFromChain.set([]);
    }
  }

  // Thêm ví Kế toán mới trên Blockchain
  public async addFinanceOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newFinanceOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast(
        'Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!',
        'error',
      );
      return;
    }

    this.isFinanceOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch thêm ví Kế toán trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.addFinanceOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch thêm ví Kế toán thành công! TxHash: ${res.txHash}`,
        'success',
      );
      this.newFinanceOwnerAddress.set('');

      // Đồng bộ đăng ký ví kế toán vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ đăng ký kế toán:', err),
      });

      await this.loadFinanceOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Kế toán thất bại!', 'error');
    }
    this.isFinanceOwnerActionLoading.set(false);
  }

  public removeFinanceOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.modalService.confirm({
      title: 'Gỡ quyền ví Kế toán?',
      descriptionHtml: `Bạn có chắc chắn muốn gỡ bỏ quyền của ví kế toán này?<br><span class="font-mono text-xs bg-slate-100 dark:bg-slate-950 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 mt-2 block break-all font-bold">${address}</span>`,
      confirmText: 'Gỡ quyền'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteFinanceOwner(address);
      }
    });
  }

  public async confirmDeleteFinanceOwner(address: string) {
    if (this.isFinanceOwnerActionLoading()) return;

    this.isFinanceOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch xóa ví Kế toán trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.removeFinanceOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch xóa ví Kế toán thành công! TxHash: ${res.txHash}`,
        'success',
      );

      // Đồng bộ gỡ ví kế toán khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ gỡ kế toán khỏi DB:', err),
      });

      await this.loadFinanceOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Kế toán thất bại!', 'error');
    }
    this.isFinanceOwnerActionLoading.set(false);
  }

  public removeOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.modalService.confirm({
      title: 'Gỡ quyền ví Thu ngân?',
      descriptionHtml: `Bạn có chắc chắn muốn gỡ bỏ quyền của ví thu ngân này?<br><span class="font-mono text-xs bg-slate-100 dark:bg-slate-950 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 mt-2 block break-all font-bold">${address}</span>`,
      confirmText: 'Gỡ quyền'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteOwner(address);
      }
    });
  }

  public async confirmDeleteOwner(address: string) {
    if (this.isOwnerActionLoading()) return;

    this.isOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch xóa Owner trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.removeOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch xóa Owner thành công! TxHash: ${res.txHash}`,
        'success',
      );

      // Đồng bộ gỡ bỏ ví thu ngân khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ gỡ thu ngân khỏi DB:', err),
      });

      await this.loadOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Toggle đóng mở dropdown chọn mạng
  public toggleChainDropdown() {
    if (!this.web3Service.walletConnected() || !this.web3Service.isOwnerContract()) return;
    this.isChainDropdownOpen.update((val) => !val);
  }

  // Chọn nhanh mạng lưới EVM
  public selectPopularChainDirect(chain: {
    name: string;
    chainId: string;
    rpcUrl: string;
    explorerUrl: string;
  }) {
    this.configForm.update((form) => ({
      ...form,
      rpc_url: chain.rpcUrl,
      chain_id: chain.chainId,
      explorer_url: chain.explorerUrl,
    }));
    this.selectedChainName.set(`${chain.name} (ID: ${chain.chainId})`);
    this.stateService.showToast(`Đã tự động điền cấu hình mạng: ${chain.name}!`, 'success');
    this.isChainDropdownOpen.set(false);
  }

  // Khi chọn mạng EVM từ Custom Select
  public onChainChange(chainId: string) {
    if (!chainId) return;
    const chain = this.POPULAR_CHAINS.find((c) => c.chainId === chainId);
    if (chain) {
      this.selectPopularChainDirect(chain);
    }
  }

  // Tải danh sách ví Menu Registry trực tiếp từ Smart Contract Blockchain
  public async loadMenuOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.menuRegistryContractAddress()) {
      this.isMenuOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getMenuRegistryOwnersFromChain();
        this.menuOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví menu registry:', e);
        this.menuOwnersFromChain.set([]);
      } finally {
        this.isMenuOwnersLoading.set(false);
      }
    } else {
      this.menuOwnersFromChain.set([]);
    }
  }

  // Thêm ví Menu Registry mới trên Blockchain
  public async addMenuOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newMenuOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast(
        'Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!',
        'error',
      );
      return;
    }

    this.isMenuOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch thêm ví Quản trị Thực đơn trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.addMenuRegistryOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch thêm ví Quản trị Thực đơn thành công! TxHash: ${res.txHash}`,
        'success',
      );
      this.newMenuOwnerAddress.set('');

      // Đồng bộ đăng ký ví vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ đăng ký quản trị thực đơn:', err),
      });

      await this.loadMenuOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Quản trị Thực đơn thất bại!', 'error');
    }
    this.isMenuOwnerActionLoading.set(false);
  }

  public removeMenuOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.modalService.confirm({
      title: 'Gỡ quyền ví Quản trị Thực đơn?',
      descriptionHtml: `Bạn có chắc chắn muốn gỡ bỏ quyền của ví quản trị Thực đơn này?<br><span class="font-mono text-xs bg-slate-100 dark:bg-slate-950 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 mt-2 block break-all font-bold">${address}</span>`,
      confirmText: 'Gỡ quyền'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteMenuOwner(address);
      }
    });
  }

  public async confirmDeleteMenuOwner(address: string) {
    if (this.isMenuOwnerActionLoading()) return;

    this.isMenuOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch xóa ví Quản trị Thực đơn trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.removeMenuRegistryOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch xóa ví Quản trị Thực đơn thành công! TxHash: ${res.txHash}`,
        'success',
      );

      // Đồng bộ gỡ ví khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ gỡ quản trị thực đơn khỏi DB:', err),
      });

      await this.loadMenuOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Quản trị Thực đơn thất bại!', 'error');
    }
    this.isMenuOwnerActionLoading.set(false);
  }

  // Tải danh sách ví Voucher NFT trực tiếp từ Smart Contract Blockchain
  public async loadVoucherOwnersList() {
    if (this.web3Service.walletConnected() && this.web3Service.voucherContractAddress()) {
      this.isVoucherOwnersLoading.set(true);
      try {
        const list = await this.web3Service.getVoucherOwnersFromChain();
        this.voucherOwnersFromChain.set(list);
      } catch (e) {
        console.error('Lỗi nạp danh sách owners ví voucher nft:', e);
        this.voucherOwnersFromChain.set([]);
      } finally {
        this.isVoucherOwnersLoading.set(false);
      }
    } else {
      this.voucherOwnersFromChain.set([]);
    }
  }

  // Thêm ví Voucher NFT mới trên Blockchain
  public async addVoucherOwnerAddress() {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    const address = this.newVoucherOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.stateService.showToast(
        'Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!',
        'error',
      );
      return;
    }

    this.isVoucherOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch thêm ví Quản trị Voucher trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.addVoucherOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch thêm ví Quản trị Voucher thành công! TxHash: ${res.txHash}`,
        'success',
      );
      this.newVoucherOwnerAddress.set('');

      // Đồng bộ đăng ký ví vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ đăng ký quản trị voucher:', err),
      });

      await this.loadVoucherOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Thêm ví Quản trị Voucher thất bại!', 'error');
    }
    this.isVoucherOwnerActionLoading.set(false);
  }

  public removeVoucherOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.stateService.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.modalService.confirm({
      title: 'Gỡ quyền ví Quản trị Voucher?',
      descriptionHtml: `Bạn có chắc chắn muốn gỡ bỏ quyền của ví quản trị Voucher này?<br><span class="font-mono text-xs bg-slate-100 dark:bg-slate-950 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 mt-2 block break-all font-bold">${address}</span>`,
      confirmText: 'Gỡ quyền'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeleteVoucherOwner(address);
      }
    });
  }

  public async confirmDeleteVoucherOwner(address: string) {
    if (this.isVoucherOwnerActionLoading()) return;

    this.isVoucherOwnerActionLoading.set(true);
    this.stateService.showToast(
      'Vui lòng xác nhận giao dịch xóa ví Quản trị Voucher trên ví của bạn...',
      'success',
    );

    const res = await this.web3Service.removeVoucherOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.stateService.showToast(
        `Giao dịch xóa ví Quản trị Voucher thành công! TxHash: ${res.txHash}`,
        'success',
      );

      // Đồng bộ gỡ ví khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => {},
        error: (err) => console.error('Lỗi đồng bộ gỡ quản trị voucher khỏi DB:', err),
      });

      await this.loadVoucherOwnersList();
    } else {
      this.stateService.showToast(res.error || 'Xóa ví Quản trị Voucher thất bại!', 'error');
    }
    this.isVoucherOwnerActionLoading.set(false);
  }

  // --- Hỗ trợ cấu hình Phương thức thanh toán ---
  public readonly paymentColumns: TableColumn[] = [
    {
      key: 'type',
      header: 'Loại',
      sortable: false,
      class: 'font-semibold text-slate-700 dark:text-slate-300',
    },
    {
      key: 'name',
      header: 'Tên Ngân hàng / Ví',
      sortable: false,
      class: 'font-extrabold text-slate-800 dark:text-white',
    },
    {
      key: 'account_number',
      header: 'Số tài khoản / Số điện thoại',
      sortable: false,
      class: 'font-mono font-bold text-slate-700 dark:text-slate-300',
    },
    {
      key: 'account_holder',
      header: 'Chủ tài khoản',
      sortable: false,
      class: 'font-bold uppercase text-slate-700 dark:text-slate-300',
    },
    { key: 'is_active', header: 'Trạng thái', sortable: false },
    {
      key: 'actions',
      header: 'Thao tác',
      sortable: false,
      class: 'text-right',
      headerClass: 'text-right',
    },
  ];

  public get paymentMethodsList() {
    return this.stateService.paymentMethodsList;
  }
  public get paymentMethodsTotal() {
    return this.stateService.paymentMethodsTotal;
  }
  public readonly paymentMethodsPage = signal<number>(1);
  public readonly paymentMethodsPerPage = signal<number>(10);
  public readonly paymentMethodsSearch = signal<string>('');
  public readonly isPaymentMethodsLoading = signal<boolean>(false);
  public readonly isPaymentActionLoading = signal<boolean>(false);
  public readonly deletingPaymentMethodId = signal<number | null>(null);

  public loadPaymentMethods(force = false) {
    this.isPaymentMethodsLoading.set(true);
    this.apiService
      .getPaymentMethods(
        {
          page: this.paymentMethodsPage(),
          per_page: this.paymentMethodsPerPage(),
          search: this.paymentMethodsSearch(),
        },
        5 * 60 * 1000,
        force
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.stateService.paymentMethodsList.set(res.data || []);
            this.stateService.paymentMethodsTotal.set(res.total || 0);
          }
          this.isPaymentMethodsLoading.set(false);
        },
        error: () => {
          this.stateService.showToast('Không thể tải danh sách phương thức thanh toán!', 'error');
          this.isPaymentMethodsLoading.set(false);
        },
      });
  }

  public onPaymentSearchChange() {
    this.paymentMethodsPage.set(1);
    this.loadPaymentMethods(true);
  }

  public setPaymentMethodsPage(page: number) {
    if (page < 1 || page > this.getPaymentTotalPages()) return;
    this.paymentMethodsPage.set(page);
    this.loadPaymentMethods(true);
  }

  public getPaymentTotalPages(): number {
    return Math.ceil(this.paymentMethodsTotal() / this.paymentMethodsPerPage()) || 1;
  }

  public getPaymentPagesArray(): number[] {
    const total = this.getPaymentTotalPages();
    const current = this.paymentMethodsPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  public openAddPaymentModal() {
    this.modalService.open(PaymentFormModalComponent, {
      title: 'Thêm phương thức mới',
      size: 'md',
      data: {
        isEdit: false,
        form: {
          type: 'bank',
          name: '',
          account_number: '',
          account_holder: '',
          bank_code: '',
          is_active: true,
        }
      }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.loadPaymentMethods(true);
      }
    });
  }

  public openEditPaymentModal(item: any) {
    this.modalService.open(PaymentFormModalComponent, {
      title: 'Chỉnh sửa phương thức',
      size: 'md',
      data: {
        isEdit: true,
        id: item.id,
        form: {
          type: item.type,
          name: item.name,
          account_number: item.account_number,
          account_holder: item.account_holder,
          bank_code: item.bank_code || '',
          is_active: item.is_active,
        }
      }
    }).afterClosed$.subscribe(success => {
      if (success) {
        this.loadPaymentMethods(true);
      }
    });
  }

  public deletePaymentMethod(id: number) {
    this.modalService.confirm({
      title: 'Xóa phương thức thanh toán?',
      description: 'Bạn có chắc chắn muốn xóa phương thức thanh toán này khỏi hệ thống? Hành động này sẽ gỡ bỏ phương thức khỏi website Storefront ngay lập tức.',
      confirmText: 'Xác nhận xóa'
    }).afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.confirmDeletePaymentMethod(id);
      }
    });
  }

  public confirmDeletePaymentMethod(id: number) {
    if (this.isPaymentActionLoading()) return;
    this.isPaymentActionLoading.set(true);

    this.apiService.deletePaymentMethod(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thành công!', 'success');
        this.deletingPaymentMethodId.set(null);
        this.isPaymentActionLoading.set(false);
        this.loadPaymentMethods(true);
      },
      error: () => {
        this.stateService.showToast('Xóa phương thức thanh toán thất bại!', 'error');
        this.isPaymentActionLoading.set(false);
      },
    });
  }

  public showQrCode(item: any) {
    this.modalService.open(QrCodeModalComponent, {
      title: 'Mã QR chuyển khoản',
      size: 'sm',
      data: {
        payment: item
      }
    });
  }
}
