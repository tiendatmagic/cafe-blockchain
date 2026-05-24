import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { Web3Service } from './services/web3.service';
import { forkJoin } from 'rxjs';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Inject các services
  private readonly apiService = inject(ApiService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);

  // Quản lý tab và UI
  public readonly activeTab = signal<string>('dashboard');
  public readonly isDarkMode = signal<boolean>(false);
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly isWalletModalOpen = signal<boolean>(false);
  public readonly isPaymentDropdownOpen = signal<boolean>(false);
  public readonly menuViewMode = signal<'table' | 'card'>('table');

  // Dữ liệu từ Laravel Backend
  public readonly dashboardData = signal<any>(null);
  public readonly products = signal<any[]>([]);
  public readonly orders = signal<any[]>([]);
  public readonly settings = signal<any>({
    store_name: 'Blockchain Cafe & Bistro',
    contract_address: '0xc294C4f1C313e6BA70845a7b8e5c46e01a075304',
    rpc_url: 'https://ethereum-sepolia.publicnode.com',
    chain_id: '11155111',
    explorer_url: 'https://sepolia.etherscan.io',
    primary_color: '#7c3aed',
    secondary_color: '#c084fc'
  });

  // Tỷ giá Crypto ảo phục vụ Dashboard sang trọng
  public readonly ethPriceVND = signal<number>(92450000);
  public readonly usdtPriceVND = signal<number>(25420);

  // Trạng thái POS (Giỏ hàng)
  public readonly cart = signal<{ product: any, quantity: number }[]>([]);
  public readonly tableNumber = signal<string>('');
  public readonly paymentMethod = signal<string>('cash');
  public readonly posCategoryFilter = signal<string>('Tất cả');
  public readonly posSearchQuery = signal<string>('');

  // Trạng thái Quản lý Thực đơn (Menu CRUD Modal)
  public readonly isMenuModalOpen = signal<boolean>(false);
  public readonly menuModalType = signal<'add' | 'edit'>('add');
  public readonly editingProduct = signal<any>(null);
  public readonly menuForm = signal<any>({
    name: '',
    price: 0,
    category: 'Cà phê',
    image: '',
    status: true,
    short_description: '',
    description: ''
  });

  // Trạng thái Sổ đơn hàng (Bộ lọc)
  public readonly orderStatusFilter = signal<string>('all');
  public readonly orderBlockchainFilter = signal<string>('all');
  public readonly selectedOrderDetails = signal<any>(null);
  public readonly isOrderDetailModalOpen = signal<boolean>(false);

  // Trạng thái Cấu hình quán
  public readonly configForm = signal<any>({
    store_name: '',
    contract_address: '',
    rpc_url: '',
    chain_id: '',
    explorer_url: '',
    primary_color: '#7c3aed',
    secondary_color: '#c084fc'
  });

  // Trạng thái Quản trị Owner Ví trên Blockchain
  public readonly ownersFromChain = signal<string[]>([]);
  public readonly isOwnerModalOpen = signal<boolean>(false);
  public readonly newOwnerAddress = signal<string>('');
  public readonly isOwnerActionLoading = signal<boolean>(false);

  // Trạng thái Loading chung
  public readonly isLoading = signal<boolean>(false);
  public readonly successMessage = signal<string>('');
  public readonly errorMessage = signal<string>('');
  public readonly blockchainSyncLoading = signal<boolean>(false);
  public readonly isDeploying = signal<boolean>(false);

  // Tính tổng tiền giỏ hàng
  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  // Helper cho template HTML vẽ biểu đồ
  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Lọc sản phẩm hiển thị trong POS
  public readonly filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchCategory = this.posCategoryFilter() === 'Tất cả' || p.category === this.posCategoryFilter();
      const matchSearch = p.name.toLowerCase().includes(this.posSearchQuery().toLowerCase());
      return matchCategory && matchSearch && p.status;
    });
  });

  // Danh mục sản phẩm (không trùng lặp)
  public readonly categories = computed(() => {
    const list = this.products().map(p => p.category);
    return ['Tất cả', ...Array.from(new Set(list))];
  });

  ngOnInit() {
    this.initTheme();
    this.loadAllData();
    this.initRouting();
  }

  // Khởi tạo Light/Dark Theme
  private initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  // Chuyển đổi Dark Mode
  public toggleTheme() {
    if (this.isDarkMode()) {
      this.isDarkMode.set(false);
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    } else {
      this.isDarkMode.set(true);
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }

  // Tải toàn bộ dữ liệu từ Laravel Backend
  public loadAllData() {
    this.isLoading.set(true);
    forkJoin({
      dashboard: this.apiService.getDashboard(),
      products: this.apiService.getProducts(),
      orders: this.apiService.getOrders(),
      settings: this.apiService.getSettings()
    }).subscribe({
      next: (res) => {
        this.dashboardData.set(res.dashboard);
        this.products.set(res.products);
        this.orders.set(res.orders);
        
        if (res.settings) {
          this.settings.set(res.settings);
          this.configForm.set({ ...res.settings });
          // Áp dụng màu sắc động
          this.applyDynamicColors(res.settings.primary_color, res.settings.secondary_color);
          // Cập nhật cấu hình sang Web3 Service
          this.web3Service.updateConfig(res.settings);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu:', err);
        this.showToast('Lỗi tải dữ liệu từ máy chủ. Vui lòng kiểm tra Laravel Backend!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // Khởi tạo và lắng nghe Routing
  private initRouting() {
    // Đồng bộ tab với URL khi load trang lần đầu
    this.syncTabWithUrl(this.router.url);

    // Lắng nghe sự kiện thay đổi route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncTabWithUrl(event.urlAfterRedirects || event.url);
    });
  }

  // Áp dụng màu sắc động lên document root
  private applyDynamicColors(primary: string, secondary: string) {
    const pColor = primary || '#7c3aed';
    const sColor = secondary || '#c084fc';
    document.documentElement.style.setProperty('--dynamic-primary', pColor);
    document.documentElement.style.setProperty('--dynamic-secondary', sColor);
  }

  // Đồng bộ tab hoạt động dựa trên URL hiện tại
  private syncTabWithUrl(url: string) {
    const cleanUrl = url.split('?')[0]; // bỏ qua query params nếu có
    if (cleanUrl.includes('/dashboard')) {
      this.setTabState('dashboard');
    } else if (cleanUrl.includes('/pos')) {
      this.setTabState('pos');
    } else if (cleanUrl.includes('/menu')) {
      this.setTabState('menu');
    } else if (cleanUrl.includes('/orders')) {
      this.setTabState('orders');
    } else if (cleanUrl.includes('/settings')) {
      this.setTabState('settings');
    }
  }

  // Cập nhật trạng thái tab nội bộ (không trigger navigate vòng lặp)
  private setTabState(tab: string) {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      this.isMobileMenuOpen.set(false);
      
      // Refresh dữ liệu tương ứng khi đổi tab
      if (tab === 'dashboard') {
        this.refreshDashboard();
      } else if (tab === 'orders') {
        this.refreshOrders();
      } else if (tab === 'menu') {
        this.refreshProducts();
      } else if (tab === 'settings') {
        this.loadSettings();
        this.loadOwnersList();
      }
    }
  }

  // Điều hướng bằng Angular Router khi click chọn tab từ giao diện
  public setTab(tab: string) {
    this.router.navigate([`/${tab}`]);
  }

  // Refresh danh sách thực đơn
  private refreshProducts() {
    this.apiService.getProducts().subscribe(res => this.products.set(res));
  }

  // Refresh danh sách đơn hàng
  public refreshOrders() {
    this.apiService.getOrders(this.orderStatusFilter(), this.orderBlockchainFilter()).subscribe(res => this.orders.set(res));
  }

  // Refresh dữ liệu dashboard
  public refreshDashboard() {
    this.apiService.getDashboard().subscribe(res => this.dashboardData.set(res));
  }

  // Refresh cấu hình
  private loadSettings() {
    this.apiService.getSettings().subscribe(res => {
      this.settings.set(res);
      this.configForm.set({ ...res });
      this.web3Service.updateConfig(res);
    });
  }

  // Toast thông báo bóng bẩy
  public showToast(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      this.successMessage.set(msg);
      setTimeout(() => this.successMessage.set(''), 3000);
    } else {
      this.errorMessage.set(msg);
      setTimeout(() => this.errorMessage.set(''), 4000);
    }
  }

  // Sao chép địa chỉ ví thu ngân vào Clipboard
  public copyWalletAddress() {
    const address = this.web3Service.currentAccount();
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        this.showToast('Đã sao chép địa chỉ ví thành công!', 'success');
      }).catch(err => {
        this.showToast('Không thể sao chép địa chỉ ví!', 'error');
      });
    }
  }

  // Ngắt kết nối ví Web3 và đóng cửa sổ
  public disconnectWalletAndClose() {
    this.web3Service.disconnectWallet();
    this.isWalletModalOpen.set(false);
    this.showToast('Đã ngắt kết nối ví Web3 thành công!', 'success');
  }

  // ==================== CHỨC NĂNG POS (BÁN HÀNG) ====================
  
  // Thêm món vào giỏ hàng
  public addToCart(product: any) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item => item.product.id === product.id);

    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].quantity += 1;
      this.cart.set(updated);
    } else {
      this.cart.set([...currentCart, { product, quantity: 1 }]);
    }
  }

  // Giảm số lượng / Xóa món khỏi giỏ hàng
  public removeFromCart(productId: number) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item => item.product.id === productId);

    if (existIndex > -1) {
      const updated = [...currentCart];
      if (updated[existIndex].quantity > 1) {
        updated[existIndex].quantity -= 1;
        this.cart.set(updated);
      } else {
        updated.splice(existIndex, 1);
        this.cart.set(updated);
      }
    }
  }

  // Tăng số lượng món trong giỏ hàng
  public increaseQuantity(productId: number) {
    const currentCart = this.cart();
    const existIndex = currentCart.findIndex(item => item.product.id === productId);
    if (existIndex > -1) {
      const updated = [...currentCart];
      updated[existIndex].quantity += 1;
      this.cart.set(updated);
    }
  }

  // Xóa sạch giỏ hàng
  public clearCart() {
    this.cart.set([]);
    this.tableNumber.set('');
    this.paymentMethod.set('cash');
    this.isPaymentDropdownOpen.set(false);
  }

  // Toggles trạng thái mở/đóng Dropdown thanh toán
  public togglePaymentDropdown() {
    this.isPaymentDropdownOpen.set(!this.isPaymentDropdownOpen());
  }

  // Chọn phương thức thanh toán trong Custom Dropdown
  public selectPaymentMethod(method: string) {
    this.paymentMethod.set(method);
    this.isPaymentDropdownOpen.set(false);
  }

  // Thay đổi chế độ xem thực đơn (Bảng / Lưới thẻ)
  public setMenuViewMode(mode: 'table' | 'card') {
    this.menuViewMode.set(mode);
  }

  // Cập nhật bộ lọc trạng thái đơn hàng (Segmented Button)
  public setOrderStatusFilter(status: string) {
    this.orderStatusFilter.set(status);
    this.refreshOrders();
  }

  // Cập nhật bộ lọc blockchain đơn hàng (Segmented Button)
  public setOrderBlockchainFilter(blockchain: string) {
    this.orderBlockchainFilter.set(blockchain);
    this.refreshOrders();
  }

  // Tạo đơn hàng mới từ POS
  public submitOrder() {
    if (this.cart().length === 0) {
      this.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    this.isLoading.set(true);
    const orderData = {
      table_number: this.tableNumber(),
      payment_method: this.paymentMethod(),
      items: this.cart().map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (res) => {
        this.showToast('Đã ghi nhận đơn hàng thành công! Trạng thái: Đang chờ xác nhận.', 'success');
        this.clearCart();
        this.isLoading.set(false);
        // Tự động chuyển qua trang Sổ đơn hàng để quản lý
        this.setTab('orders');
      },
      error: (err) => {
        console.error('Lỗi đặt đơn:', err);
        this.showToast('Không thể tạo đơn hàng. Vui lòng kiểm tra lại!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // ==================== CHỨC NĂNG SỔ ĐƠN HÀNG ====================

  // Mở modal xem chi tiết đơn hàng
  public viewOrderDetail(order: any) {
    this.selectedOrderDetails.set(order);
    this.isOrderDetailModalOpen.set(true);
  }

  // Đóng modal xem chi tiết
  public closeOrderDetail() {
    this.isOrderDetailModalOpen.set(false);
    this.selectedOrderDetails.set(null);
  }

  // Cập nhật trạng thái đơn hàng (đang chờ -> thành công / đã hủy)
  public updateStatus(orderId: number, status: 'completed' | 'cancelled') {
    this.isLoading.set(true);
    this.apiService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        this.showToast(`Cập nhật trạng thái đơn hàng thành công!`, 'success');
        
        // Nếu cập nhật thành công (completed), và là đơn hàng thanh toán crypto hoặc ngân hàng/tiền mặt mà thu ngân muốn sync,
        // ta sẽ cập nhật trực tiếp trong list orders.
        this.refreshOrders();
        
        // Nếu trong modal chi tiết đang mở, cập nhật nó luôn
        if (this.selectedOrderDetails() && this.selectedOrderDetails().id === orderId) {
          this.selectedOrderDetails.set(res.data);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Loi cap nhat trang thai:', err);
        this.showToast('Cập nhật trạng thái thất bại!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // Đồng bộ hóa đơn lên Blockchain EVM (Bằng chứng hóa đơn)
  public async syncToBlockchain(order: any) {
    // 1. Kiểm tra kết nối ví
    if (!this.web3Service.walletConnected()) {
      const connected = await this.web3Service.connectWallet();
      if (!connected) {
        this.showToast(this.web3Service.walletError() || 'Vui lòng kết nối ví Web3 thu ngân trước!', 'error');
        return;
      }
    }

    // 2. Kiểm tra xem ví có phải Owner được ủy quyền không
    if (!this.web3Service.isOwnerContract()) {
      this.showToast('Địa chỉ ví thu ngân hiện tại của bạn không được phân quyền (Owner) trên Smart Contract! Hãy nhờ quản lý cấp quyền trong mục Cấu hình.', 'error');
      return;
    }

    this.blockchainSyncLoading.set(true);
    this.showToast('Vui lòng xác nhận giao dịch trên ví Metamask...', 'success');

    // Tạo tóm tắt hóa đơn
    const itemsSummary = order.items.map((item: any) => `${item.quantity}x ${item.product.name}`).join(', ');

    // Gọi Smart Contract ghi nhận hóa đơn
    const result = await this.web3Service.recordOrderOnChain(
      order.id,
      order.table_number || 'Mang ve',
      order.total_amount,
      this.getPaymentMethodText(order.payment_method),
      itemsSummary
    );

    if (result.success && result.txHash) {
      this.showToast('Giao dịch đã được gửi! Đang đồng bộ trạng thái...', 'success');
      
      // Gửi TxHash lên Laravel Backend để lưu trữ trạng thái pending ban đầu
      this.apiService.syncOrderBlockchain(order.id, result.txHash, 'success').subscribe({
        next: (res) => {
          this.showToast('Ghi nhận bằng chứng hóa đơn lên Blockchain EVM thành công!', 'success');
          this.refreshOrders();
          
          if (this.selectedOrderDetails() && this.selectedOrderDetails().id === order.id) {
            this.selectedOrderDetails.set(res.data);
          }
          this.blockchainSyncLoading.set(false);
        },
        error: (err) => {
          console.error('Loi cap nhat TxHash len DB:', err);
          this.blockchainSyncLoading.set(false);
        }
      });
    } else {
      this.showToast(result.error || 'Giao dịch thất bại hoặc bị từ chối!', 'error');
      this.blockchainSyncLoading.set(false);
    }
  }

  // Dịch phương thức thanh toán sang tiếng Việt
  public getPaymentMethodText(method: string): string {
    const map: any = {
      'cash': 'Tiền mặt',
      'bank_transfer': 'Chuyển khoản',
      'crypto': 'Crypto Web3'
    };
    return map[method] || method;
  }

  // ==================== QUẢN LÝ THỰC ĐƠN (CRUD) ====================

  // Mở modal thêm món
  public openAddMenuModal() {
    this.menuModalType.set('add');
    this.menuForm.set({
      name: '',
      price: 0,
      category: 'Cà phê',
      image: '',
      status: true,
      short_description: '',
      description: ''
    });
    this.isMenuModalOpen.set(true);
  }

  // Mở modal sửa món
  public openEditMenuModal(product: any) {
    this.menuModalType.set('edit');
    this.editingProduct.set(product);
    this.menuForm.set({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      status: product.status,
      short_description: product.short_description || '',
      description: product.description || ''
    });
    this.isMenuModalOpen.set(true);
  }

  // Đóng modal
  public closeMenuModal() {
    this.isMenuModalOpen.set(false);
    this.editingProduct.set(null);
  }

  // Lưu món ăn (Thêm/Sửa)
  public saveProduct() {
    const formData = this.menuForm();
    if (!formData.name || formData.price <= 0 || !formData.category) {
      this.showToast('Vui lòng nhập đầy đủ thông tin món ăn!', 'error');
      return;
    }

    this.isLoading.set(true);
    if (this.menuModalType() === 'add') {
      this.apiService.createProduct(formData).subscribe({
        next: (res) => {
          this.showToast('Thêm món ăn thành công!', 'success');
          this.closeMenuModal();
          this.refreshProducts();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.showToast('Thêm món thất bại!', 'error');
          this.isLoading.set(false);
        }
      });
    } else {
      const id = this.editingProduct().id;
      this.apiService.updateProduct(id, formData).subscribe({
        next: (res) => {
          this.showToast('Cập nhật món ăn thành công!', 'success');
          this.closeMenuModal();
          this.refreshProducts();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.showToast('Cập nhật món thất bại!', 'error');
          this.isLoading.set(false);
        }
      });
    }
  }

  // Xóa món ăn
  public deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa món này khỏi thực đơn không?')) {
      this.isLoading.set(true);
      this.apiService.deleteProduct(id).subscribe({
        next: (res) => {
          this.showToast('Xóa món ăn khỏi thực đơn thành công!', 'success');
          this.refreshProducts();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.showToast('Xóa món thất bại!', 'error');
          this.isLoading.set(false);
        }
      });
    }
  }

  // ==================== CẤU HÌNH QUÁN & BLOCKCHAIN ====================

  // Lưu cấu hình quán
  public saveConfig() {
    this.isLoading.set(true);
    const data = this.configForm();
    this.apiService.updateSettings(data).subscribe({
      next: (res) => {
        this.showToast('Lưu cấu hình quán và Blockchain thành công!', 'success');
        this.settings.set(res.data);
        // Áp dụng màu sắc động
        this.applyDynamicColors(res.data.primary_color, res.data.secondary_color);
        this.web3Service.updateConfig(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.showToast('Lưu cấu hình thất bại!', 'error');
        this.isLoading.set(false);
      }
    });
  }

  // Khôi phục màu sắc giao diện về mặc định
  public resetColorsToDefault() {
    this.configForm.update(form => ({
      ...form,
      primary_color: '#7c3aed',
      secondary_color: '#c084fc'
    }));
    this.applyDynamicColors('#7c3aed', '#c084fc');
    this.showToast('Đã đặt màu về mặc định. Nhấn "LƯU CẤU HÌNH HỆ THỐNG" để ghi nhận!', 'success');
  }

  // Tự động deploy Smart Contract mới từ giao diện
  public async deployNewContract() {
    if (!this.web3Service.walletConnected()) {
      const connected = await this.web3Service.connectWallet();
      if (!connected) {
        this.showToast(this.web3Service.walletError() || 'Vui lòng kết nối ví Web3 trước!', 'error');
        return;
      }
    }

    this.isDeploying.set(true);
    this.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract trên ví của bạn...', 'success');

    const res = await this.web3Service.deployContractOnChain();
    if (res.success && res.contractAddress) {
      this.configForm.update(form => ({
        ...form,
        contract_address: res.contractAddress
      }));
      this.web3Service.updateConfig({ contract_address: res.contractAddress });
      this.showToast(`Deploy thành công! Contract mới: ${res.contractAddress}. Nhấn LƯU CẤU HÌNH HỆ THỐNG để ghi nhận!`, 'success');
      await this.loadOwnersList();
    } else {
      this.showToast(res.error || 'Deploy Smart Contract thất bại!', 'error');
    }
    this.isDeploying.set(false);
  }

  // Tải danh sách Owners trực tiếp từ Smart Contract Blockchain
  public async loadOwnersList() {
    if (this.web3Service.walletConnected()) {
      const list = await this.web3Service.getOwnersFromChain();
      this.ownersFromChain.set(list);
    }
  }

  // Thêm Owner (ví thu ngân) mới trên Blockchain
  public async addOwnerAddress() {
    const address = this.newOwnerAddress().trim();
    if (!address.startsWith('0x') || address.length !== 42) {
      this.showToast('Địa chỉ ví EVM không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!', 'error');
      return;
    }

    this.isOwnerActionLoading.set(true);
    this.showToast('Vui lòng xác nhận giao dịch thêm Owner trên ví của bạn...', 'success');

    const res = await this.web3Service.addOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.showToast(`Giao dịch thêm Owner thành công! TxHash: ${res.txHash}`, 'success');
      this.newOwnerAddress.set('');
      await this.loadOwnersList();
    } else {
      this.showToast(res.error || 'Thêm Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Xóa Owner (ví thu ngân) khỏi Blockchain
  public async removeOwnerAddress(address: string) {
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa quyền thu ngân của ví: ${address} trên Smart Contract không?`)) {
      this.isOwnerActionLoading.set(true);
      this.showToast('Vui lòng xác nhận giao dịch xóa Owner trên ví của bạn...', 'success');

      const res = await this.web3Service.removeOwnersOnChain([address]);
      if (res.success && res.txHash) {
        this.showToast(`Giao dịch xóa Owner thành công! TxHash: ${res.txHash}`, 'success');
        await this.loadOwnersList();
      } else {
        this.showToast(res.error || 'Xóa Owner thất bại!', 'error');
      }
      this.isOwnerActionLoading.set(false);
    }
  }
}
