import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
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
  private readonly colorStorageKey = 'dapp_dynamic_colors';

  // Quản lý tab và UI
  public readonly activeTab = signal<string>('dashboard');
  public readonly isDarkMode = signal<boolean>(false);
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly isWalletModalOpen = signal<boolean>(false);
  public readonly isPaymentDropdownOpen = signal<boolean>(false);
  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly selectedChainName = signal<string>('-- Chọn nhanh mạng phổ biến nhất --');
  public readonly menuViewMode = signal<'table' | 'card'>('table');

  // Dữ liệu từ Laravel Backend
  public readonly dashboardData = signal<any>(null);
  public readonly products = signal<any[]>([]);
  public readonly orders = signal<any[]>([]);
  public readonly settings = signal<any>({
    store_name: 'Blockchain Cafe & Bistro',
    contract_address: '',
    rpc_url: 'https://ethereum-sepolia.publicnode.com',
    chain_id: '11155111',
    explorer_url: 'https://sepolia.etherscan.io',
    primary_color: '#7c3aed',
    secondary_color: '#c084fc'
  });

  // Tỷ giá Crypto phục vụ Dashboard sang trọng theo từng mạng EVM
  public readonly nativeTokenPriceVND = computed(() => {
    const symbol = this.web3Service.nativeTokenSymbol();
    switch (symbol) {
      case 'ETH':
        return 92450000;
      case 'BNB':
        return 15240000;
      case 'MATIC':
      case 'POL':
        return 12800;
      case 'AVAX':
        return 890000;
      default:
        return 92450000;
    }
  });
  public readonly usdtPriceVND = signal<number>(25420);
  public readonly isWrongChain = computed(() => {
    const connected = this.web3Service.walletConnected();
    const contract = this.web3Service.contractAddress();
    const activeChain = this.web3Service.chainId();
    const configChain = this.web3Service.configuredChainId();
    return connected && !!contract && contract.trim() !== '' && activeChain !== configChain;
  });

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
    category_ids: [],
    image: '',
    status: true,
    short_description: '',
    description: ''
  });

  // Trạng thái Quản lý Danh mục (CRUD Category)
  public readonly categoriesList = signal<any[]>([]);
  public readonly categoryForm = signal<any>({
    id: null as number | null,
    name: ''
  });
  public readonly isCategoryLoading = signal<boolean>(false);

  // Các signals quản lý Modal mới
  public readonly isCategoryModalOpen = signal<boolean>(false);
  public readonly isDeleteCategoryConfirmOpen = signal<boolean>(false);
  public readonly deletingCategoryData = signal<any>(null);
  public readonly isDeleteProductConfirmOpen = signal<boolean>(false);
  public readonly deletingProductData = signal<any>(null);
  public readonly isDeleteOwnerConfirmOpen = signal<boolean>(false);
  public readonly deletingOwnerAddress = signal<string>('');

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
  public readonly isConfigSaving = signal<boolean>(false);
  public readonly isProductSaving = signal<boolean>(false);
  public readonly isProductDeleting = signal<boolean>(false);
  public readonly isOrderStatusUpdating = signal<boolean>(false);
  public readonly isOrderSubmitting = signal<boolean>(false);
  public readonly isDetectingChain = signal<boolean>(false);

  // Tính tổng tiền giỏ hàng
  public readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  // ==================== LOGIC PHÂN TRANG (PAGINATION) ====================
  public readonly menuItemsPerPage = 9; // Tối đa 9 sản phẩm trên 1 trang theo quy định mới
  public readonly menuCurrentPage = signal<number>(1);

  // Sản phẩm phân trang ở trang Quản lý Thực đơn
  public readonly paginatedProducts = computed(() => {
    const list = this.products();
    const startIndex = (this.menuCurrentPage() - 1) * this.menuItemsPerPage;
    return list.slice(startIndex, startIndex + this.menuItemsPerPage);
  });

  public readonly menuTotalPages = computed(() => {
    return Math.ceil(this.products().length / this.menuItemsPerPage) || 1;
  });

  // Phân trang sản phẩm ở trang Bán hàng POS
  public readonly posItemsPerPage = 9; // Tối đa 9 sản phẩm trên 1 trang theo quy định mới
  public readonly posCurrentPage = signal<number>(1);

  public readonly paginatedPosProducts = computed(() => {
    const list = this.filteredProducts();
    const startIndex = (this.posCurrentPage() - 1) * this.posItemsPerPage;
    return list.slice(startIndex, startIndex + this.posItemsPerPage);
  });

  public readonly posTotalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.posItemsPerPage) || 1;
  });

  public readonly ordersItemsPerPage = 5;
  public readonly ordersCurrentPage = signal<number>(1);

  // Đơn hàng phân trang ở Sổ đơn hàng
  public readonly paginatedOrders = computed(() => {
    const list = this.orders();
    const startIndex = (this.ordersCurrentPage() - 1) * this.ordersItemsPerPage;
    return list.slice(startIndex, startIndex + this.ordersItemsPerPage);
  });

  public readonly ordersTotalPages = computed(() => {
    return Math.ceil(this.orders().length / this.ordersItemsPerPage) || 1;
  });

  // Helper sinh mảng số trang cho giao diện phân trang
  public getPagesArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Helper cho template HTML vẽ biểu đồ
  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Helper lấy ảnh sản phẩm, nếu trống hoặc lỗi thì trả về ảnh placeholder splash tuyệt đẹp
  public getProductImage(imagePath: string): string {
    if (!imagePath || !imagePath.trim()) {
      return 'not-found.webp';
    }
    return imagePath;
  }

  // Fallback khi hình ảnh bị lỗi tải (như 404)
  public handleImageError(event: any) {
    event.target.src = 'not-found.webp';
  }

  public updateConfigForm(field: string, value: any) {
    this.configForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  public updateMenuForm(field: string, value: any) {
    this.menuForm.update(form => ({
      ...form,
      [field]: field === 'price' ? Number(value) : value
    }));
  }

  public toggleMenuFormStatus() {
    this.menuForm.update(form => ({
      ...form,
      status: !form.status
    }));
  }

  // Lọc sản phẩm hiển thị trong POS
  public readonly filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchCategory = this.posCategoryFilter() === 'Tất cả' || (p.categories && p.categories.some((c: any) => c.name === this.posCategoryFilter()));
      const matchSearch = p.name.toLowerCase().includes(this.posSearchQuery().toLowerCase());
      return matchCategory && matchSearch && p.status;
    });
  });

  // Danh mục sản phẩm động lấy từ backend
  public readonly categories = computed(() => {
    const list = this.categoriesList().map(c => c.name);
    return ['Tất cả', ...list];
  });

  ngOnInit() {
    this.initTheme();
    this.loadAllData();
    this.initRouting();

    // Lắng nghe sự kiện thay đổi ví từ Web3Service
    this.web3Service.accountsChanged$.subscribe((newAccount) => {
      this.handleAccountSwitch(newAccount);
    });
  }

  // Khởi tạo Light/Dark Theme
  private initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyCachedDynamicColors();

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
    const connectedAddress = this.web3Service.currentAccount();
    if (typeof window !== 'undefined') {
      const authAddress = localStorage.getItem('auth_address');
      if (connectedAddress && authAddress && connectedAddress.toLowerCase() !== authAddress.toLowerCase()) {
        console.warn('Lệch tài khoản ví và token xác thực! Đang tự động đăng xuất và yêu cầu xác thực lại...');
        this.handleAccountSwitch(connectedAddress);
        return;
      }
    }

    this.isLoading.set(true);
    forkJoin({
      dashboard: this.apiService.getDashboard(),
      products: this.apiService.getProducts(),
      orders: this.apiService.getOrders(),
      settings: this.apiService.getSettings(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: (res) => {
        this.dashboardData.set(res.dashboard);
        this.products.set(res.products);
        this.orders.set(res.orders);
        this.categoriesList.set(res.categories || []);

        if (res.settings) {
          const settings = { ...res.settings };
          this.settings.set(settings);
          this.configForm.set({ ...settings });
          // Áp dụng màu sắc động
          this.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
          // Cập nhật cấu hình sang Web3 Service
          this.web3Service.updateConfig(settings);
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

  private applyAndCacheDynamicColors(primary: string, secondary: string) {
    this.applyDynamicColors(primary, secondary);
    localStorage.setItem(this.colorStorageKey, JSON.stringify({
      primary_color: primary || '#7c3aed',
      secondary_color: secondary || '#c084fc'
    }));
  }

  private applyCachedDynamicColors() {
    const cachedColors = localStorage.getItem(this.colorStorageKey);
    if (!cachedColors) return;

    try {
      const colors = JSON.parse(cachedColors);
      this.applyDynamicColors(colors.primary_color, colors.secondary_color);
    } catch {
      localStorage.removeItem(this.colorStorageKey);
    }
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
        this.ordersCurrentPage.set(1); // Reset phân trang đơn hàng về 1
        this.refreshOrders();
      } else if (tab === 'menu') {
        this.menuCurrentPage.set(1); // Reset phân trang thực đơn về 1
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
    forkJoin({
      products: this.apiService.getProducts(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.categoriesList.set(res.categories);
      },
      error: (err) => console.error('Lỗi refresh sản phẩm & danh mục:', err)
    });
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
      const settings = { ...res };
      this.settings.set(settings);
      this.configForm.set({ ...settings });
      this.applyAndCacheDynamicColors(settings.primary_color, settings.secondary_color);
      this.web3Service.updateConfig(settings);
      
      // Tự động nhận diện mạng nếu chưa có contract address
      this.autoDetectNetworkIfNoContract();
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
    this.apiService.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
    }
    this.isWalletModalOpen.set(false);
    this.showToast('Đã ngắt kết nối ví Web3 thành công!', 'success');
  }

  // Kết nối và Yêu cầu Ký ví Web3 Auth
  public async connectWalletAndSign() {
    const isConnected = await this.web3Service.connectWallet();
    if (isConnected) {
      const address = this.web3Service.currentAccount();
      if (!address) return;

      this.showToast('Vui lòng ký xác thực trên ví Metamask...', 'success');
      this.apiService.getNonce(address).subscribe({
        next: async (res) => {
          try {
            const signature = await this.web3Service.signMessage(res.message);
            
            this.apiService.verifySignature(address, signature).subscribe({
              next: (verifyRes) => {
                if (verifyRes.token) {
                  this.apiService.setToken(verifyRes.token);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_address', address);
                  }
                  this.showToast('Kết nối và xác thực ví thành công!', 'success');
                  this.isWalletModalOpen.set(false);
                  this.loadAllData();
                  this.loadOwnersList();
                }
              },
              error: (err) => {
                this.web3Service.disconnectWallet();
                this.showToast('Xác thực chữ ký thất bại!', 'error');
              }
            });
          } catch (e) {
            this.web3Service.disconnectWallet();
            this.showToast('Bạn đã từ chối ký xác thực!', 'error');
          }
        },
        error: (err) => {
          this.web3Service.disconnectWallet();
          this.showToast('Lỗi lấy mã xác thực từ server!', 'error');
        }
      });
    }
  }

  // Xử lý khi tài khoản ví Web3 thay đổi
  private handleAccountSwitch(newAccount: string) {
    // Xóa token cũ và địa chỉ ví cũ để đảm bảo bảo mật
    this.apiService.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_address');
    }
    
    // Làm sạch dữ liệu hiện tại để tránh lộ thông tin ví cũ
    this.clearCart();
    this.dashboardData.set(null);
    this.products.set([]);
    this.orders.set([]);
    this.categoriesList.set([]);
    this.ownersFromChain.set([]);

    if (newAccount) {
      console.log('Đã chuyển đổi tài khoản ví sang:', newAccount);
      this.showToast('Phát hiện tài khoản ví thay đổi. Đang yêu cầu ký xác thực lại...', 'success');
      // Bắt đăng nhập lại cho tài khoản mới
      this.connectWalletAndSign();
    } else {
      console.log('Ví đã ngắt kết nối hoàn toàn');
      this.showToast('Ví đã ngắt kết nối. Vui lòng kết nối ví để tiếp tục!', 'error');
    }
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
    this.ordersCurrentPage.set(1); // Reset phân trang về 1 khi đổi bộ lọc
    this.refreshOrders();
  }

  // Cập nhật bộ lọc blockchain đơn hàng (Segmented Button)
  public setOrderBlockchainFilter(blockchain: string) {
    this.orderBlockchainFilter.set(blockchain);
    this.ordersCurrentPage.set(1); // Reset phân trang về 1 khi đổi bộ lọc
    this.refreshOrders();
  }

  // Tạo đơn hàng mới từ POS
  public submitOrder() {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thanh toán và ghi nhận đơn hàng!', 'error');
      return;
    }

    if (this.cart().length === 0) {
      this.showToast('Vui lòng chọn ít nhất một món ăn!', 'error');
      return;
    }

    this.isOrderSubmitting.set(true);
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
        this.isOrderSubmitting.set(false);
        // Tự động chuyển qua trang Sổ đơn hàng để quản lý
        this.setTab('orders');
      },
      error: (err) => {
        console.error('Lỗi đặt đơn:', err);
        this.showToast('Không thể tạo đơn hàng. Vui lòng kiểm tra lại!', 'error');
        this.isOrderSubmitting.set(false);
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
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thay đổi trạng thái đơn hàng!', 'error');
      return;
    }

    this.isOrderStatusUpdating.set(true);
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

        this.isOrderStatusUpdating.set(false);
      },
      error: (err) => {
        console.error('Loi cap nhat trang thai:', err);
        this.showToast('Cập nhật trạng thái thất bại!', 'error');
        this.isOrderStatusUpdating.set(false);
      }
    });
  }

  // Đồng bộ hóa đơn lên Blockchain EVM (Bằng chứng hóa đơn)
  public async syncToBlockchain(order: any) {
    // 1. Kiểm tra kết nối ví
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    // Kiểm tra xem quán đã deploy contract chưa
    if (!this.web3Service.contractAddress() || this.web3Service.contractAddress().trim() === '') {
      this.showToast('Cửa hàng chưa được cấu hình Smart Contract! Vui lòng truy cập mục Cấu hình hệ thống để deploy contract trước.', 'error');
      return;
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

      // Gửi TxHash và Chain ID lên Laravel Backend để lưu trữ
      this.apiService.syncOrderBlockchain(order.id, result.txHash, 'success', this.web3Service.chainId()).subscribe({
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
      // Kiểm tra xem có phải lỗi order already exists không để đối soát tự động
      const errorMsg = result.error || '';
      const isAlreadyExists = errorMsg.includes('order already exists') || 
                              errorMsg.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        this.showToast('Đơn hàng đã tồn tại trên Blockchain. Đang tự động đối soát và đồng bộ...', 'success');
        
        const pseudoTxHash = `0x_already_synced_order_${order.id}`;
        
        this.apiService.syncOrderBlockchain(order.id, pseudoTxHash, 'success', this.web3Service.chainId()).subscribe({
          next: (res) => {
            this.showToast('Đối soát và đồng bộ trạng thái hóa đơn từ Blockchain thành công!', 'success');
            this.refreshOrders();
            if (this.selectedOrderDetails() && this.selectedOrderDetails().id === order.id) {
              this.selectedOrderDetails.set(res.data);
            }
            this.blockchainSyncLoading.set(false);
          },
          error: (err) => {
            console.error('Lỗi đối soát đơn hàng:', err);
            const errMsg = err.error?.message || 'Đối soát thất bại!';
            this.showToast(errMsg, 'error');
            this.blockchainSyncLoading.set(false);
          }
        });
      } else {
        this.showToast(result.error || 'Giao dịch thất bại hoặc bị từ chối!', 'error');
        this.blockchainSyncLoading.set(false);
      }
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
      category_ids: [],
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
      category_ids: product.categories ? product.categories.map((c: any) => c.id) : [],
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
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const formData = this.menuForm();
    if (!formData.name || formData.price <= 0) {
      this.showToast('Vui lòng điền tên và đơn giá hợp lệ!', 'error');
      return;
    }

    this.isProductSaving.set(true);
    if (this.menuModalType() === 'add') {
      this.apiService.createProduct(formData).subscribe({
        next: (res) => {
          this.showToast('Thêm món ăn thành công!', 'success');
          this.closeMenuModal();
          this.refreshProducts();
          this.isProductSaving.set(false);
        },
        error: (err) => {
          this.showToast('Thêm món thất bại!', 'error');
          this.isProductSaving.set(false);
        }
      });
    } else {
      const id = this.editingProduct().id;
      this.apiService.updateProduct(id, formData).subscribe({
        next: (res) => {
          this.showToast('Cập nhật món ăn thành công!', 'success');
          this.closeMenuModal();
          this.refreshProducts();
          this.isProductSaving.set(false);
        },
        error: (err) => {
          this.showToast('Cập nhật món thất bại!', 'error');
          this.isProductSaving.set(false);
        }
      });
    }
  }

  // Xóa món ăn (chuyển tiếp sang trigger mở Custom Confirm Modal)
  public deleteProduct(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const product = this.products().find(p => p.id === id);
    if (product) {
      this.triggerDeleteProduct(product);
    }
  }

  // Xử lý tích/gỡ chọn danh mục trong menuForm
  public toggleFormCategory(categoryId: number) {
    const form = this.menuForm();
    const currentIds: number[] = form.category_ids || [];
    const index = currentIds.indexOf(categoryId);
    if (index > -1) {
      const updated = currentIds.filter(id => id !== categoryId);
      this.menuForm.set({ ...form, category_ids: updated });
    } else {
      const updated = [...currentIds, categoryId];
      this.menuForm.set({ ...form, category_ids: updated });
    }
  }

  public isCategorySelected(categoryId: number): boolean {
    const ids = this.menuForm().category_ids || [];
    return ids.includes(categoryId);
  }

  // Tải danh sách danh mục
  public loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res);
      },
      error: (err) => console.error('Lỗi tải danh mục:', err)
    });
  }

  // Mở modal thêm danh mục mới
  public openAddCategoryModal() {
    this.resetCategoryForm();
    this.isCategoryModalOpen.set(true);
  }

  // Mở modal sửa danh mục
  public openEditCategoryModal(category: any) {
    this.categoryForm.set({
      id: category.id,
      name: category.name
    });
    this.isCategoryModalOpen.set(true);
  }

  // Đóng modal danh mục
  public closeCategoryModal() {
    this.isCategoryModalOpen.set(false);
    this.resetCategoryForm();
  }

  // Sửa danh mục động (chuyển tiếp sang openEditCategoryModal)
  public editCategory(category: any) {
    this.openEditCategoryModal(category);
  }

  // Hủy sửa danh mục
  public resetCategoryForm() {
    this.categoryForm.set({
      id: null,
      name: ''
    });
  }

  // Lưu danh mục (Thêm mới hoặc Cập nhật)
  public saveCategory() {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const form = this.categoryForm();
    if (!form.name.trim()) {
      this.showToast('Vui lòng nhập tên danh mục!', 'error');
      return;
    }

    this.isCategoryLoading.set(true);
    if (form.id) {
      this.apiService.updateCategory(form.id, { name: form.name.trim() }).subscribe({
        next: () => {
          this.showToast('Cập nhật danh mục thành công!', 'success');
          this.closeCategoryModal();
          this.loadCategories();
          this.refreshProducts();
          this.isCategoryLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.showToast('Cập nhật danh mục thất bại! Tên danh mục có thể đã tồn tại.', 'error');
          this.isCategoryLoading.set(false);
        }
      });
    } else {
      this.apiService.createCategory({ name: form.name.trim() }).subscribe({
        next: () => {
          this.showToast('Tạo danh mục mới thành công!', 'success');
          this.closeCategoryModal();
          this.loadCategories();
          this.refreshProducts();
          this.isCategoryLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.showToast('Tạo danh mục mới thất bại! Tên danh mục có thể đã tồn tại.', 'error');
          this.isCategoryLoading.set(false);
        }
      });
    }
  }

  // Xóa danh mục động (chuyển tiếp sang trigger mở Custom Confirm Modal)
  public deleteCategory(id: number) {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const category = this.categoriesList().find(c => c.id === id);
    if (category) {
      this.triggerDeleteCategory(category);
    }
  }

  // Trigger mở modal xác nhận xóa danh mục
  public triggerDeleteCategory(category: any) {
    this.deletingCategoryData.set(category);
    this.isDeleteCategoryConfirmOpen.set(true);
  }

  // Xác nhận xóa danh mục thực tế qua API
  public confirmDeleteCategory() {
    if (this.isCategoryLoading()) return; // Chặn click đúp và các request gọi đồng thời liên tiếp

    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const category = this.deletingCategoryData();
    if (!category) return;

    this.isCategoryLoading.set(true);
    this.apiService.deleteCategory(category.id).subscribe({
      next: () => {
        this.showToast('Xóa danh mục thành công!', 'success');
        this.isDeleteCategoryConfirmOpen.set(false);
        this.deletingCategoryData.set(null);
        this.loadCategories();
        this.refreshProducts();
        this.isCategoryLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        const errMsg = err.error?.message || 'Xóa danh mục thất bại!';
        this.showToast(errMsg, 'error');
        this.isCategoryLoading.set(false);
      }
    });
  }

  // Trigger mở modal xác nhận xóa sản phẩm
  public triggerDeleteProduct(product: any) {
    this.deletingProductData.set(product);
    this.isDeleteProductConfirmOpen.set(true);
  }

  // Xác nhận xóa sản phẩm thực tế qua API
  public confirmDeleteProduct() {
    if (this.isProductDeleting()) return; // Chặn click đúp và các request gọi đồng thời liên tiếp

    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện hành động này!', 'error');
      return;
    }

    const product = this.deletingProductData();
    if (!product) return;

    this.isProductDeleting.set(true);
    this.apiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.showToast('Xóa món ăn khỏi thực đơn thành công!', 'success');
        this.isDeleteProductConfirmOpen.set(false);
        this.deletingProductData.set(null);
        this.refreshProducts();
        this.isProductDeleting.set(false);
      },
      error: (err) => {
        console.error(err);
        const errMsg = err.error?.message || 'Xóa món thất bại!';
        this.showToast(errMsg, 'error');
        this.isProductDeleting.set(false);
      }
    });
  }

  // ==================== CẤU HÌNH QUÁN & BLOCKCHAIN ====================

  // Lưu cấu hình quán
  public saveConfig() {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    this.isConfigSaving.set(true);
    const data = this.configForm();
    this.apiService.updateSettings(data).subscribe({
      next: (res) => {
        this.showToast('Lưu cấu hình quán và Blockchain thành công!', 'success');
        this.settings.set(res.data);
        // Áp dụng màu sắc động
        this.applyAndCacheDynamicColors(res.data.primary_color, res.data.secondary_color);
        this.web3Service.updateConfig(res.data);
        this.isConfigSaving.set(false);
      },
      error: (err) => {
        this.showToast('Lưu cấu hình thất bại!', 'error');
        this.isConfigSaving.set(false);
      }
    });
  }

  // Khôi phục màu sắc giao diện về mặc định
  public resetColorsToDefault() {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
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
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }

    // Đồng bộ cấu hình mạng tạm thời từ Form vào Web3Service để đảm bảo deploy đúng mạng đang chọn trên Form
    this.web3Service.updateConfig({
      rpc_url: this.configForm().rpc_url,
      chain_id: this.configForm().chain_id,
      explorer_url: this.configForm().explorer_url
    });

    this.isDeploying.set(true);
    this.showToast('Vui lòng xác nhận giao dịch Deploy Smart Contract trên ví của bạn...', 'success');

    const res = await this.web3Service.deployContractOnChain(this.configForm().chain_id);
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
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
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
      
      // Đồng bộ đăng ký ví thu ngân vào Laravel Backend
      this.apiService.registerCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ đăng ký thu ngân vào DB.'),
        error: (err) => console.error('Lỗi đồng bộ đăng ký thu ngân:', err)
      });

      await this.loadOwnersList();
    } else {
      this.showToast(res.error || 'Thêm Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  public removeOwnerAddress(address: string) {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Web3 để thực hiện tác vụ này!', 'error');
      return;
    }
    if (address.toLowerCase() === this.web3Service.currentAccount().toLowerCase()) {
      this.showToast('Không thể tự xóa ví chính mình khỏi quyền quản trị!', 'error');
      return;
    }

    this.deletingOwnerAddress.set(address);
    this.isDeleteOwnerConfirmOpen.set(true);
  }

  public async confirmDeleteOwner() {
    if (this.isOwnerActionLoading()) return;

    const address = this.deletingOwnerAddress();
    if (!address) return;

    this.isOwnerActionLoading.set(true);
    this.showToast('Vui lòng xác nhận giao dịch xóa Owner trên ví của bạn...', 'success');

    const res = await this.web3Service.removeOwnersOnChain([address]);
    if (res.success && res.txHash) {
      this.showToast(`Giao dịch xóa Owner thành công! TxHash: ${res.txHash}`, 'success');
      this.isDeleteOwnerConfirmOpen.set(false);
      this.deletingOwnerAddress.set('');
      
      // Đồng bộ gỡ bỏ ví thu ngân khỏi Laravel Backend
      this.apiService.removeCashier(address).subscribe({
        next: () => console.log('Đã đồng bộ gỡ thu ngân khỏi DB.'),
        error: (err) => console.error('Lỗi đồng bộ gỡ thu ngân khỏi DB:', err)
      });

      await this.loadOwnersList();
    } else {
      this.showToast(res.error || 'Xóa Owner thất bại!', 'error');
    }
    this.isOwnerActionLoading.set(false);
  }

  // Danh sách các mạng EVM phổ biến để Admin chọn nhanh
  public readonly POPULAR_CHAINS = [
    { name: 'Ethereum Mainnet', chainId: '1', rpcUrl: 'https://cloudflare-eth.com', explorerUrl: 'https://etherscan.io' },
    { name: 'BNB Smart Chain (BSC)', chainId: '56', rpcUrl: 'https://bsc-dataseed.binance.org', explorerUrl: 'https://bscscan.com' },
    { name: 'Polygon PoS Mainnet', chainId: '137', rpcUrl: 'https://polygon-rpc.com', explorerUrl: 'https://polygonscan.com' },
    { name: 'Arbitrum One Mainnet', chainId: '42161', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io' },
    { name: 'Optimism Mainnet', chainId: '10', rpcUrl: 'https://mainnet.optimism.io', explorerUrl: 'https://optimistic.etherscan.io' },
    { name: 'Base Mainnet', chainId: '8453', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org' },
    { name: 'Avalanche C-Chain', chainId: '43114', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', explorerUrl: 'https://snowtrace.io' },
    { name: 'Sepolia Testnet', chainId: '11155111', rpcUrl: 'https://ethereum-sepolia.publicnode.com', explorerUrl: 'https://sepolia.etherscan.io' },
    { name: 'BSC Testnet', chainId: '97', rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545', explorerUrl: 'https://testnet.bscscan.com' },
    { name: 'Polygon Amoy Testnet', chainId: '80002', rpcUrl: 'https://rpc-amoy.polygon.technology', explorerUrl: 'https://amoy.polygonscan.com' }
  ];

  // Toggle đóng mở dropdown chọn mạng
  public toggleChainDropdown() {
    if (!this.web3Service.walletConnected() || !this.web3Service.isOwnerContract()) return;
    this.isChainDropdownOpen.update(val => !val);
  }

  // Hàm chọn nhanh mạng lưới trực tiếp từ Custom Dropdown
  public selectPopularChainDirect(chain: { name: string, chainId: string, rpcUrl: string, explorerUrl: string }) {
    this.configForm.update(form => ({
      ...form,
      rpc_url: chain.rpcUrl,
      chain_id: chain.chainId,
      explorer_url: chain.explorerUrl
    }));
    this.selectedChainName.set(`${chain.name} (ID: ${chain.chainId})`);
    this.showToast(`Đã tự động điền cấu hình mạng: ${chain.name}!`, 'success');
    this.isChainDropdownOpen.set(false);
  }

  // Lắng nghe click bên ngoài để đóng custom dropdown
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chain-dropdown-container')) {
      this.isChainDropdownOpen.set(false);
    }
  }

  // Tự động nhận diện mạng từ ví Metamask đang kết nối
  public async detectChainFromWallet() {
    if (!this.web3Service.walletConnected()) {
      this.showToast('Vui lòng kết nối ví Metamask trước!', 'error');
      return;
    }

    this.isDetectingChain.set(true);
    try {
      const activeChainId = this.web3Service.chainId();
      if (!activeChainId) {
        this.showToast('Không thể đọc Chain ID từ ví đang kết nối!', 'error');
        this.isDetectingChain.set(false);
        return;
      }

      const idStr = activeChainId.toString().trim();
      const chain = this.POPULAR_CHAINS.find(c => c.chainId === idStr);

      if (chain) {
        this.configForm.update(form => ({
          ...form,
          rpc_url: chain.rpcUrl,
          chain_id: chain.chainId,
          explorer_url: chain.explorerUrl
        }));
        this.showToast(`Nhận diện thành công mạng: ${chain.name}!`, 'success');
      } else {
        // Nếu không thuộc 10 mạng phổ biến
        this.configForm.update(form => ({
          ...form,
          chain_id: idStr,
          rpc_url: '', // Để người dùng tự điền vì là mạng tùy chỉnh
          explorer_url: ''
        }));
        this.showToast(`Nhận diện được Chain ID: ${idStr}. Đây là mạng tùy chỉnh, vui lòng tự nhập RPC URL!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      this.showToast('Lỗi nhận diện mạng từ ví: ' + err.message, 'error');
    }
    this.isDetectingChain.set(false);
  }

  // Tự động nhận diện mạng nếu chưa deploy contract
  public autoDetectNetworkIfNoContract() {
    if (this.web3Service.walletConnected() && !this.web3Service.contractAddress()) {
      const activeChainId = this.web3Service.chainId();
      if (activeChainId) {
        const idStr = activeChainId.toString().trim();
        const chain = this.POPULAR_CHAINS.find(c => c.chainId === idStr);
        if (chain) {
          this.configForm.update(form => ({
            ...form,
            rpc_url: chain.rpcUrl,
            chain_id: chain.chainId,
            explorer_url: chain.explorerUrl
          }));
          this.selectedChainName.set(`${chain.name} (ID: ${chain.chainId})`);
        } else {
          this.configForm.update(form => ({
            ...form,
            chain_id: idStr
          }));
        }
      }
    }
  }

  // Helper lấy Block Explorer Link cho một giao dịch dựa trên Chain ID
  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    if (!txHash) return '#';
    
    if (chainId) {
      const idStr = chainId.toString().trim();
      const chain = this.POPULAR_CHAINS.find(c => c.chainId === idStr);
      if (chain) {
        return `${chain.explorerUrl}/tx/${txHash}`;
      }
    }
    
    // Fallback về explorer hiện tại của quán
    return `${this.settings().explorer_url}/tx/${txHash}`;
  }
}
