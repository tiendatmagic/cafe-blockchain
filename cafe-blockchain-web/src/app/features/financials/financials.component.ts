import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';
import { AccessRestrictedComponent } from '@shared/components/access-restricted/access-restricted.component';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Web3ConnectPromptComponent,
    AccessRestrictedComponent,
    PaginationComponent,
    ConfirmModalComponent,
    PageHeaderComponent,
    VNDCurrencyPipe,
    CustomDatePickerComponent,
    IconComponent,
    TabGroupComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './financials.component.html'
})
export class FinancialsComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  ngOnInit() {
  }

  public readonly transactionTypePresets: TabOption[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'thu', label: 'Phiếu Thu (+)' },
    { value: 'chi', label: 'Phiếu Chi (-)' }
  ];

  public readonly transactionModalTypeOptions: TabOption[] = [
    { value: 'thu', label: 'Thu tiền (+)' },
    { value: 'chi', label: 'Chi tiền (-)' }
  ];

  // Bộ lọc & Phân trang tài chính
  public readonly transactionTypeFilter = signal<string>('all');
  public readonly transactionCurrentPage = signal<number>(1);
  public readonly transactionItemsPerPage = 9;

  // Bộ tìm kiếm tài chính
  public readonly transactionSearchQuery = signal<string>('');

  // Form Lập Phiếu Thu Chi
  public readonly isTransactionModalOpen = signal<boolean>(false);
  public readonly transactionModalType = signal<'add' | 'edit'>('add');
  public readonly editingTransaction = signal<any>(null);
  public readonly isTransactionSaving = signal<boolean>(false);
  public readonly isTransactionDropdownOpen = signal<boolean>(false);
  public readonly isCategoryDropdownOpen = signal<boolean>(false);
  public readonly isSyncFinanceToBlockchainChecked = signal<boolean>(false);

  public readonly transactionForm = signal<any>({
    type: 'thu',
    amount: 0,
    category: '',
    description: '',
    transaction_date: ''
  });

  // Xem chi tiết giao dịch
  public readonly selectedTransactionDetails = signal<any>(null);
  public readonly isTransactionDetailModalOpen = signal<boolean>(false);
  public readonly blockchainSyncLoading = signal<boolean>(false);
  
  // Trạng thái modal xác nhận xóa
  public readonly isDeleteTransactionConfirmOpen = signal<boolean>(false);
  public readonly deletingTransaction = signal<any>(null);

  // Getters từ StateService
  public get web3Service() { return this.stateService.web3Service; }
  public get transactions() { return this.stateService.transactions; }
  public get isTransactionsLoading() { return this.stateService.isTransactionsLoading; }

  // Các computed properties LED chỉ số
  public readonly totalIncome = computed(() => {
    return this.transactions().filter(t => t.type === 'thu').reduce((sum, t) => sum + Number(t.amount), 0);
  });

  public readonly totalExpense = computed(() => {
    return this.transactions().filter(t => t.type === 'chi').reduce((sum, t) => sum + Number(t.amount), 0);
  });

  public readonly financialBalance = computed(() => {
    return this.totalIncome() - this.totalExpense();
  });

  public readonly filteredTransactions = computed(() => {
    let list = this.transactions();
    const type = this.transactionTypeFilter();
    if (type !== 'all') {
      list = list.filter(t => t.type === type);
    }

    // Thêm bộ lọc tìm kiếm cục bộ (transaction_code, category, description, amount, blockchain_tx_hash, v.v.)
    const search = this.transactionSearchQuery().trim().toLowerCase();
    if (search) {
      list = list.filter(t => 
        (t.transaction_code && t.transaction_code.toLowerCase().includes(search)) ||
        (t.category && t.category.toLowerCase().includes(search)) ||
        (t.description && t.description.toLowerCase().includes(search)) ||
        (t.amount && t.amount.toString().includes(search)) ||
        (t.blockchain_tx_hash && t.blockchain_tx_hash.toLowerCase().includes(search)) ||
        (t.id && t.id.toString().includes(search))
      );
    }
    return list;
  });

  public readonly paginatedTransactions = computed(() => {
    const list = this.filteredTransactions();
    const startIndex = (this.transactionCurrentPage() - 1) * this.transactionItemsPerPage;
    return list.slice(startIndex, startIndex + this.transactionItemsPerPage);
  });

  public readonly transactionTotalPages = computed(() => {
    return Math.ceil(this.filteredTransactions().length / this.transactionItemsPerPage) || 1;
  });

  // Tự động lấy danh sách giao dịch chưa sync blockchain
  public readonly unsyncedTransactions = computed(() => {
    return this.transactions().filter(t => t.blockchain_status === 'none' || t.blockchain_status === 'failed');
  });

  // Làm mới sổ thu chi
  public refreshTransactions() {
    this.stateService.refreshTransactions(this.transactionTypeFilter());
  }

  // --- CRUD Transactions ---
  public openAddTransactionModal(type: 'thu' | 'chi' = 'thu') {
    this.transactionModalType.set('add');
    this.editingTransaction.set(null);
    this.isSyncFinanceToBlockchainChecked.set(false);
    this.isCategoryDropdownOpen.set(false);
    this.transactionForm.set({
      type: type,
      amount: 0,
      category: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    this.isTransactionModalOpen.set(true);
    this.isTransactionDropdownOpen.set(false);
  }

  public openEditTransactionModal(transaction: any) {
    this.transactionModalType.set('edit');
    this.editingTransaction.set(transaction);
    this.isCategoryDropdownOpen.set(false);
    this.transactionForm.set({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      transaction_date: transaction.transaction_date
    });
    this.isTransactionModalOpen.set(true);
  }

  public closeTransactionModal() {
    this.isTransactionModalOpen.set(false);
    this.editingTransaction.set(null);
    this.isCategoryDropdownOpen.set(false);
  }

  public selectCategory(category: string) {
    this.transactionForm.update(form => ({
      ...form,
      category: category
    }));
    this.isCategoryDropdownOpen.set(false);
  }

  public updateTransactionForm(field: string, value: any) {
    this.transactionForm.update(form => ({
      ...form,
      [field]: field === 'amount' ? Number(value) : value
    }));
  }

  public saveTransaction() {
    const form = this.transactionForm();
    if (form.amount <= 0 || !form.category || !form.category.trim() || !form.transaction_date) {
      this.stateService.showToast('Vui lòng nhập số tiền (>0), hạng mục và ngày giao dịch hợp lệ!', 'error');
      return;
    }

    this.isTransactionSaving.set(true);
    if (this.transactionModalType() === 'add') {
      this.apiService.createTransaction(form).subscribe({
        next: (res) => {
          if (this.isSyncFinanceToBlockchainChecked()) {
            this.syncTransactionImmediatelyAfterCreate(res.transaction);
          } else {
            this.stateService.showToast('Ghi nhận thu chi thành công!', 'success');
            this.closeTransactionModal();
            this.stateService.refreshTransactions();
            this.isTransactionSaving.set(false);
          }
        },
        error: () => {
          this.stateService.showToast('Ghi nhận thu chi thất bại!', 'error');
          this.isTransactionSaving.set(false);
        }
      });
    } else {
      const id = this.editingTransaction().id;
      this.apiService.updateTransaction(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật giao dịch thành công!', 'success');
          this.closeTransactionModal();
          this.stateService.refreshTransactions();
          this.isTransactionSaving.set(false);
        },
        error: () => {
          this.stateService.showToast('Cập nhật giao dịch thất bại!', 'error');
          this.isTransactionSaving.set(false);
        }
      });
    }
  }

  public async syncTransactionImmediatelyAfterCreate(tx: any) {
    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Ghi nhận thu chi thành công cục bộ! Chưa kết nối ví Web3 để đồng bộ Blockchain.', 'error');
      this.closeTransactionModal();
      this.stateService.refreshTransactions();
      this.isTransactionSaving.set(false);
      return;
    }

    if (!this.web3Service.financeContractAddress() || this.web3Service.financeContractAddress().trim() === '') {
      this.stateService.showToast('Ghi nhận thu chi thành công cục bộ! Chưa cấu hình Smart Contract để đồng bộ Blockchain.', 'error');
      this.closeTransactionModal();
      this.stateService.refreshTransactions();
      this.isTransactionSaving.set(false);
      return;
    }

    this.stateService.showToast('Bắt đầu đồng bộ Blockchain. Vui lòng xác nhận trên ví của bạn...', 'success');

    const result = await this.web3Service.recordTransactionOnChain(
      tx.id,
      tx.transaction_code || '',
      tx.type,
      tx.amount,
      tx.category,
      tx.description || ''
    );

    if (result.success && result.txHash) {
      this.stateService.showToast('Giao dịch Blockchain đã được gửi! Đang đồng bộ trạng thái...', 'success');

      this.apiService.syncTransactionBlockchain(tx.id, result.txHash, 'success', this.web3Service.chainId()).subscribe({
        next: () => {
          this.stateService.showToast('Ghi nhận thu chi và đồng bộ Blockchain thành công!', 'success');
          this.closeTransactionModal();
          this.stateService.refreshTransactions();
          this.isTransactionSaving.set(false);
        },
        error: (err) => {
          console.error('Loi cap nhat TxHash len DB:', err);
          this.closeTransactionModal();
          this.stateService.refreshTransactions();
          this.isTransactionSaving.set(false);
        }
      });
    } else {
      console.warn('[Blockchain] Giao dịch Blockchain thất bại hoặc bị từ chối:', result.error);
      this.stateService.showToast('Phiếu thu chi đã lưu cục bộ thành công! Giao dịch blockchain thất bại hoặc bị từ chối.', 'error');
      
      this.closeTransactionModal();
      this.stateService.refreshTransactions();
      this.isTransactionSaving.set(false);
    }
  }

  public deleteTransaction(transaction: any) {
    this.deletingTransaction.set(transaction);
    this.isDeleteTransactionConfirmOpen.set(true);
  }

  public confirmDeleteTransaction() {
    const transaction = this.deletingTransaction();
    if (!transaction) return;
    const id = transaction.id;

    this.isDeleteTransactionConfirmOpen.set(false);
    this.stateService.isLoading.set(true);
    this.apiService.deleteTransaction(id).subscribe({
      next: () => {
        this.stateService.showToast('Xóa giao dịch thành công!', 'success');
        this.stateService.refreshTransactions();
        this.deletingTransaction.set(null);
        this.stateService.isLoading.set(false);
      },
      error: () => {
        this.stateService.showToast('Xóa giao dịch thất bại!', 'error');
        this.deletingTransaction.set(null);
        this.stateService.isLoading.set(false);
      }
    });
  }

  // --- Blockchain Sync ---
  public async syncTransactionToBlockchain(tx: any) {
    if (tx.is_verified === false) {
      this.stateService.showToast('CẢNH BÁO: Dữ liệu tài chính của giao dịch này đã bị thay đổi trái phép trong Database! Không thể đồng bộ.', 'error');
      return;
    }

    if (!this.web3Service.walletConnected()) {
      this.stateService.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    if (!this.web3Service.financeContractAddress() || this.web3Service.financeContractAddress().trim() === '') {
      this.stateService.showToast('Cửa hàng chưa được cấu hình Smart Contract Tài chính! Vui lòng truy cập mục Cấu hình hệ thống để deploy contract trước.', 'error');
      return;
    }

    if (!this.web3Service.isOwnerContract()) {
      this.stateService.showToast('Địa chỉ ví thu ngân hiện tại của bạn không được phân quyền (Owner) trên Smart Contract! Hãy nhờ quản lý cấp quyền.', 'error');
      return;
    }

    this.blockchainSyncLoading.set(true);
    this.stateService.showToast('Vui lòng xác nhận giao dịch trên ví của bạn...', 'success');

    const result = await this.web3Service.recordTransactionOnChain(
      tx.id,
      tx.transaction_code || '',
      tx.type,
      tx.amount,
      tx.category,
      tx.description || ''
    );

    if (result.success && result.txHash) {
      this.stateService.showToast('Giao dịch đã được gửi! Đang đồng bộ trạng thái...', 'success');

      this.apiService.syncTransactionBlockchain(tx.id, result.txHash, 'success', this.web3Service.chainId()).subscribe({
        next: (res) => {
          this.stateService.showToast('Ghi nhận bằng chứng thu chi lên Blockchain EVM thành công!', 'success');
          this.refreshTransactions();
          this.blockchainSyncLoading.set(false);
        },
        error: (err) => {
          console.error('Loi cap nhat TxHash len DB:', err);
          this.blockchainSyncLoading.set(false);
        }
      });
    } else {
      const errorMsg = result.error || '';
      const isAlreadyExists = errorMsg.includes('transaction already exists') || errorMsg.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        this.stateService.showToast('Giao dịch đã tồn tại trên Blockchain. Đang truy vấn bằng chứng gốc...', 'success');
        const originalTxHash = await this.web3Service.getOriginalTxHashForTransaction(tx.id);

        if (originalTxHash) {
          this.apiService.syncTransactionBlockchain(tx.id, originalTxHash, 'success', this.web3Service.chainId()).subscribe({
            next: (res) => {
              this.stateService.showToast('Đối soát thành công! Đã khôi phục bằng chứng blockchain gốc cho phiếu thu chi.', 'success');
              this.refreshTransactions();
              this.blockchainSyncLoading.set(false);
            },
            error: (err) => {
              console.error('Lỗi đối soát giao dịch thu chi:', err);
              this.stateService.showToast(err.error?.message || 'Đối soát thất bại!', 'error');
              this.blockchainSyncLoading.set(false);
            }
          });
        } else {
          this.stateService.showToast('Giao dịch đã có trên blockchain nhưng không thể truy vấn tx_hash gốc. Vui lòng thử lại!', 'error');
          this.blockchainSyncLoading.set(false);
        }
      } else {
        this.stateService.showToast(result.error || 'Giao dịch thất bại hoặc bị từ chối!', 'error');
        this.blockchainSyncLoading.set(false);
      }
    }
  }

  // Đồng bộ hàng loạt
  public async syncAllUnsyncedTransactions() {
    const list = this.unsyncedTransactions();
    if (list.length === 0) {
      this.stateService.showToast('Không có giao dịch thu chi nào cần đồng bộ!', 'success');
      return;
    }

    if (this.blockchainSyncLoading()) return;

    this.stateService.showToast(`Bắt đầu đồng bộ hàng loạt ${list.length} phiếu thu chi. Vui lòng xác nhận trên ví cho từng phiếu...`, 'success');

    for (const tx of list) {
      await this.syncTransactionToBlockchain(tx);
    }

    this.stateService.showToast('Đã hoàn tất tiến trình đồng bộ đối soát thu chi tài chính!', 'success');
  }

  // Xem chi tiết phiếu thu chi
  public viewTransactionDetails(tx: any) {
    this.selectedTransactionDetails.set(tx);
    this.isTransactionDetailModalOpen.set(true);
  }

  public closeTransactionDetailModal() {
    this.selectedTransactionDetails.set(null);
    this.isTransactionDetailModalOpen.set(false);
  }

  // Helpers cho template HTML

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.web3Service.getTxExplorerLink(txHash, chainId);
  }
}
