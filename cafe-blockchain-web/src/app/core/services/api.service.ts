import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Web3Service } from './web3.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly web3Service = inject(Web3Service);
  
  // URL của Laravel Backend API (Cổng mặc định của artisan serve)
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Cập nhật token (Vô hiệu hóa vì đã dùng HttpOnly Cookie)
   */
  public setToken(token: string) {
    // Không còn lưu token ở localStorage để chống XSS
  }

  public getToken(): string | null {
    // Đọc token từ localStorage bị vô hiệu hóa
    return null;
  }

  public removeToken() {
    // Xóa token ở localStorage bị vô hiệu hóa
  }

  /**
   * Gọi API đăng xuất để xóa cookie phía backend
   */
  public logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  /**
   * Tạo HttpHeaders chứa Bearer token (được giữ lại cho Mobile App sau này, Web dùng Cookie)
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Tạo HttpHeaders có chứa thông tin cache (TTL và Bypass Cache)
   */
  private getCacheHeaders(ttl?: number, force?: boolean): HttpHeaders {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    if (force) {
      headers = headers.set('X-Bypass-Cache', 'true');
    }
    return headers;
  }

  // --- Auth API ---
  public getNonce(address: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/nonce?address=${address}`);
  }

  public verifySignature(address: string, signature: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verify`, { address, signature });
  }

  public registerCashier(address: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register-cashier`, { cashier_address: address }, { headers: this.getHeaders() });
  }

  public removeCashier(address: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/remove-cashier`, { cashier_address: address }, { headers: this.getHeaders() });
  }

  /**
   * Lấy thông tin subscription hiện tại của user đang đăng nhập (để sync sau khi admin đổi gói)
   */
  public getMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`, { headers: this.getHeaders() });
  }

  public updateProfile(profile: { name: string; email?: string; phone?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/profile`, profile, { headers: this.getHeaders() });
  }

  /**
   * Lấy danh sách các gói cước đang hoạt động
   */
  public getPublicPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth/subscription/plans`, { headers: this.getHeaders() });
  }

  /**
   * Nâng cấp gói cước cho cửa hàng qua Web3
   */
  public updateTenantSubscriptionUpgrade(data: { plan_code: string, duration_months: number, tx_hash: string, system_payment_method_id?: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/subscription/upgrade`, data, { headers: this.getHeaders() });
  }

  // 1. Dashboard API
  public getDashboard(startDate?: string, endDate?: string, ttl?: number, force?: boolean): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
      params = params.set('end_date', endDate);
    }
    const headers = this.getCacheHeaders(ttl, force);
    return this.http.get(`${this.baseUrl}/dashboard`, { params, headers });
  }

  // 2. Products (Thực đơn) API
  public getProducts(params?: { page?: number; limit?: number; search?: string; category?: string }, ttl?: number): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.limit !== undefined) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }
      if (params.search !== undefined) {
        httpParams = httpParams.set('search', params.search);
      }
      if (params.category !== undefined) {
        httpParams = httpParams.set('category', params.category);
      }
    }
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any>(`${this.baseUrl}/products`, { params: httpParams, headers });
  }

  public createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product, { headers: this.getHeaders() });
  }

  public updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, { headers: this.getHeaders() });
  }

  public deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  // 3. Orders (Đơn hàng) API
  public getOrders(status: string = 'all', blockchainStatus: string = 'all'): Observable<any[]> {
    let params = new HttpParams();
    if (status !== 'all') {
      params = params.set('status', status);
    }
    if (blockchainStatus !== 'all') {
      params = params.set('blockchain_status', blockchainStatus);
    }
    return this.http.get<any[]>(`${this.baseUrl}/orders`, { params, headers: this.getHeaders() });
  }

  public getOrder(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

  public createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order, { headers: this.getHeaders() });
  }

  public updateOrder(id: string | number, order: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}`, order, { headers: this.getHeaders() });
  }

  public updateOrderStatus(id: string | number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  // 12. Vouchers API
  public requestVoucherSignature(orderCode: string, tokenId: number, tempOrderData?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vouchers/request-sign`, {
      order_code: orderCode,
      token_id: tokenId,
      temp_order_data: tempOrderData
    }, { headers: this.getHeaders() });
  }

  public cancelVoucherSignature(orderCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/vouchers/cancel-sign`, {
      order_code: orderCode
    }, { headers: this.getHeaders() });
  }

  public checkVoucherSignature(orderCode: string): Observable<{ status: string, signature: string | null }> {
    return this.http.get<{ status: string, signature: string | null }>(`${this.baseUrl}/vouchers/check-signature/${orderCode}`, { headers: this.getHeaders() });
  }

  public submitVoucherSignature(orderCode: string, signature: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/vouchers/submit-signature`, {
      order_code: orderCode,
      signature: signature
    });
  }

  public syncOrderBlockchain(id: string | number, txHash: string, blockchainStatus: string, chainId?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}/sync`, {
      tx_hash: txHash,
      blockchain_status: blockchainStatus,
      chain_id: chainId
    }, { headers: this.getHeaders() });
  }

  public mintVoucherManual(orderId: string | number): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/${orderId}/mint-voucher-manual`, {}, { headers: this.getHeaders() });
  }

  /**
   * Khách hàng gửi yêu cầu claim điểm tích lũy bằng mã hóa đơn
   */
  public claimPoints(orderCode: string, phoneLast5: string, walletAddress: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/claim-points`, {
      order_code: orderCode,
      phone_last_5: phoneLast5,
      wallet_address: walletAddress
    });
  }

  // 4. Settings (Cấu hình) API
  public getSettings(ttl?: number, force?: boolean): Observable<any> {
    const headers = this.getCacheHeaders(ttl, force);
    return this.http.get(`${this.baseUrl}/settings`, { headers });
  }

  public getPublicSettings(orderCode?: string): Observable<any> {
    const url = orderCode ? `${this.baseUrl}/settings/public?order_code=${orderCode}` : `${this.baseUrl}/settings/public`;
    return this.http.get(url);
  }

  public getPublicStoreBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/store/${slug}`);
  }

  public createPublicOrder(slug: string, orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/${slug}/orders`, orderData);
  }

  public updateSettings(settings: any): Observable<any> {

    return this.http.post(`${this.baseUrl}/settings`, settings, { headers: this.getHeaders() });
  }

  // Menu Sync Logs (Lịch sử đồng bộ thực đơn lên Blockchain)
  public getMenuSyncLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/menu-sync-logs`, { headers: this.getHeaders() });
  }

  public createMenuSyncLog(data: { synced_by: string; tx_hash: string; product_count: number; chain_id: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/menu-sync-logs`, data, { headers: this.getHeaders() });
  }

  // 5. Categories (Danh mục) API
  public getCategories(ttl?: number): Observable<any[]> {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/categories`, { headers });
  }

  public createCategory(category: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, category, { headers: this.getHeaders() });
  }

  public updateCategory(id: number, category: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, category, { headers: this.getHeaders() });
  }

  public deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  // 6. Customers (Khách hàng) API
  public getCustomers(search?: string, limit?: number, ttl?: number, force?: boolean): Observable<any[]> {
    let url = `${this.baseUrl}/customers`;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (limit) params.push(`limit=${limit}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    const headers = this.getCacheHeaders(ttl, force);
    return this.http.get<any[]>(url, { headers });
  }

  public createCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, customer, { headers: this.getHeaders() });
  }

  public updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customers/${id}`, customer, { headers: this.getHeaders() });
  }

  public deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customers/${id}`, { headers: this.getHeaders() });
  }

  // 7. Customer Groups (Nhóm khách hàng) API
  public getCustomerGroups(ttl?: number, force?: boolean): Observable<any[]> {
    const headers = this.getCacheHeaders(ttl, force);
    return this.http.get<any[]>(`${this.baseUrl}/customer-groups`, { headers });
  }

  public createCustomerGroup(group: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer-groups`, group, { headers: this.getHeaders() });
  }

  public updateCustomerGroup(id: number, group: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/customer-groups/${id}`, group, { headers: this.getHeaders() });
  }

  public deleteCustomerGroup(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customer-groups/${id}`, { headers: this.getHeaders() });
  }

  // 8. Transactions (Thu Chi) API
  public getTransactions(type: string = 'all'): Observable<any[]> {
    let params = new HttpParams();
    if (type !== 'all') {
      params = params.set('type', type);
    }
    return this.http.get<any[]>(`${this.baseUrl}/transactions`, { params, headers: this.getHeaders() });
  }

  public createTransaction(transaction: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transactions`, transaction, { headers: this.getHeaders() });
  }

  public updateTransaction(id: string | number, transaction: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/transactions/${id}`, transaction, { headers: this.getHeaders() });
  }

  public deleteTransaction(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/transactions/${id}`, { headers: this.getHeaders() });
  }

  public syncTransactionBlockchain(id: string | number, txHash: string, blockchainStatus: string, chainId?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/transactions/${id}/sync`, {
      tx_hash: txHash,
      blockchain_status: blockchainStatus,
      chain_id: chainId
    }, { headers: this.getHeaders() });
  }

  // 9. Inventory (Kho hàng) API
  public getInventoryRecords(type: string = 'all'): Observable<any[]> {
    let params = new HttpParams();
    if (type !== 'all') {
      params = params.set('type', type);
    }
    return this.http.get<any[]>(`${this.baseUrl}/inventory`, { params, headers: this.getHeaders() });
  }

  public createInventoryRecord(record: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory`, record, { headers: this.getHeaders() });
  }

  public deleteInventoryRecord(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/inventory/${id}`, { headers: this.getHeaders() });
  }

  // 10. Areas (Khu vực) API
  public getAreas(ttl?: number): Observable<any[]> {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/areas`, { headers });
  }

  public createArea(area: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/areas`, area, { headers: this.getHeaders() });
  }

  public updateArea(id: number, area: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/areas/${id}`, area, { headers: this.getHeaders() });
  }

  public deleteArea(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/areas/${id}`, { headers: this.getHeaders() });
  }

  // 11. Dining Tables (Bàn ăn) API
  public getDiningTables(ttl?: number): Observable<any[]> {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/dining-tables`, { headers });
  }

  public createDiningTable(table: { name: string, area_id: number, status?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/dining-tables`, table, { headers: this.getHeaders() });
  }

  public updateDiningTable(id: number, table: { name: string, area_id: number, status?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/dining-tables/${id}`, table, { headers: this.getHeaders() });
  }

  public updateDiningTableStatus(id: number, status: 'empty' | 'using'): Observable<any> {
    return this.http.put(`${this.baseUrl}/dining-tables/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  public deleteDiningTable(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/dining-tables/${id}`, { headers: this.getHeaders() });
  }

  // 12. Reports API (Báo cáo doanh thu, hàng hóa, khách hàng, lãi lỗ)
  public getReports(startDate: string, endDate: string, ttl?: number): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any>(`${this.baseUrl}/reports`, { headers, params });
  }

  // --- Debts (Sổ nợ) API ---
  public getDebts(search?: string, filter: string = 'all'): Observable<any[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (filter !== 'all') {
      params = params.set('filter', filter);
    }
    return this.http.get<any[]>(`${this.baseUrl}/debts`, { headers: this.getHeaders(), params });
  }

  public getCustomerDebtLogs(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/debts/customer/${customerId}`, { headers: this.getHeaders() });
  }

  public createManualDebt(data: { customer_id: number; amount: number; note?: string; recorded_at: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/debts`, data, { headers: this.getHeaders() });
  }

  public createDebtPayment(data: { customer_id: number; amount: number; payment_method: string; note?: string; recorded_at: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/debts/payment`, data, { headers: this.getHeaders() });
  }

  public deleteDebtLog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/debts/${id}`, { headers: this.getHeaders() });
  }

  // --- Shifts (Ca làm việc) API ---
  public getCurrentShift(ttl?: number, force?: boolean): Observable<any> {
    let headers = this.getCacheHeaders(ttl, force);
    headers = headers.set('X-Silent-Request', 'true');
    return this.http.get(`${this.baseUrl}/shifts/current`, { headers });
  }

  public getShiftSummary(): Observable<any> {
    let headers = this.getHeaders();
    headers = headers.set('X-Silent-Request', 'true');
    return this.http.get(`${this.baseUrl}/shifts/current/summary`, { headers });
  }

  public openShift(initialCash: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/shifts/open`, { initial_cash: initialCash }, { headers: this.getHeaders() });
  }

  public closeShift(actualCash: number, note?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/shifts/close`, { actual_cash: actualCash, note }, { headers: this.getHeaders() });
  }

  public getShifts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/shifts`, { headers: this.getHeaders() });
  }

  // --- Staffs & Roles API ---
  public getStaffs(ttl?: number): Observable<any[]> {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/staffs`, { headers });
  }

  public createStaff(staff: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staffs`, staff, { headers: this.getHeaders() });
  }

  public updateStaff(id: number | string, staff: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/staffs/${id}`, staff, { headers: this.getHeaders() });
  }

  public deleteStaff(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staffs/${id}`, { headers: this.getHeaders() });
  }

  public getRoles(ttl?: number): Observable<any[]> {
    let headers = this.getHeaders();
    if (ttl !== undefined) {
      headers = headers.set('X-Cache-TTL', ttl.toString());
    }
    return this.http.get<any[]>(`${this.baseUrl}/roles`, { headers });
  }

  public createRole(role: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/roles`, role, { headers: this.getHeaders() });
  }

  public updateRole(id: number | string, role: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/roles/${id}`, role, { headers: this.getHeaders() });
  }

  public deleteRole(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/roles/${id}`, { headers: this.getHeaders() });
  }

  public resetDefaultRoles(): Observable<any> {
    return this.http.post(`${this.baseUrl}/roles/reset-default`, {}, { headers: this.getHeaders() });
  }

  // --- Payment Methods (Phương thức thanh toán) API ---
  public getPaymentMethods(params?: { page?: number; per_page?: number; search?: string }, ttl?: number, force?: boolean): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.per_page !== undefined) {
        httpParams = httpParams.set('per_page', params.per_page.toString());
      }
      if (params.search !== undefined && params.search.trim() !== '') {
        httpParams = httpParams.set('search', params.search.trim());
      }
    }
    const headers = this.getCacheHeaders(ttl, force);
    return this.http.get<any>(`${this.baseUrl}/payment-methods`, { params: httpParams, headers });
  }

  public createPaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payment-methods`, paymentMethod, { headers: this.getHeaders() });
  }

  public updatePaymentMethod(id: number | string, paymentMethod: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/payment-methods/${id}`, paymentMethod, { headers: this.getHeaders() });
  }

  public deletePaymentMethod(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/payment-methods/${id}`, { headers: this.getHeaders() });
  }

  public getSystemPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth/system-payment-methods`, { headers: this.getHeaders() });
  }

  // --- Super Admin SaaS APIs ---
  public getAdminSystemStaffs(params?: { search?: string; page?: number; per_page?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.search !== undefined) {
        httpParams = httpParams.set('search', params.search);
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.per_page !== undefined) {
        httpParams = httpParams.set('per_page', params.per_page.toString());
      }
    }
    return this.http.get<any>(`${this.baseUrl}/admin/staffs`, { params: httpParams, headers: this.getHeaders() });
  }

  public createAdminSystemStaff(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/staffs`, data, { headers: this.getHeaders() });
  }

  public deleteAdminSystemStaff(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/staffs/${id}`, { headers: this.getHeaders() });
  }

  // Subscription Requests (Yêu cầu thuê bao)
  public getAdminSubscriptionRequests(params?: { status?: string; search?: string; page?: number; per_page?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status !== undefined) {
        httpParams = httpParams.set('status', params.status);
      }
      if (params.search !== undefined && params.search.trim() !== '') {
        httpParams = httpParams.set('search', params.search.trim());
      }
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.per_page !== undefined) {
        httpParams = httpParams.set('per_page', params.per_page.toString());
      }
    }
    return this.http.get<any>(`${this.baseUrl}/admin/subscriptions`, { params: httpParams, headers: this.getHeaders() });
  }

  public approveAdminSubscription(id: number | string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/subscriptions/${id}/approve`, {}, { headers: this.getHeaders() });
  }

  public rejectAdminSubscription(id: number | string, reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/subscriptions/${id}/reject`, { rejected_reason: reason }, { headers: this.getHeaders() });
  }

  public getAdminTenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/tenants`, { headers: this.getHeaders() });
  }

  public getAdminPaymentMethods(params?: { page?: number; per_page?: number; search?: string }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.per_page !== undefined) {
        httpParams = httpParams.set('per_page', params.per_page.toString());
      }
      if (params.search !== undefined && params.search.trim() !== '') {
        httpParams = httpParams.set('search', params.search.trim());
      }
    }
    return this.http.get<any>(`${this.baseUrl}/admin/payment-methods`, { params: httpParams, headers: this.getHeaders() });
  }

  public createAdminPaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/payment-methods`, paymentMethod, { headers: this.getHeaders() });
  }

  public updateAdminPaymentMethod(id: number | string, paymentMethod: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/payment-methods/${id}`, paymentMethod, { headers: this.getHeaders() });
  }

  public deleteAdminPaymentMethod(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/payment-methods/${id}`, { headers: this.getHeaders() });
  }

  public updateTenantSubscription(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/tenants/${id}/subscription`, data, { headers: this.getHeaders() });
  }

  public getAdminPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/plans`, { headers: this.getHeaders() });
  }

  public createAdminPlan(plan: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/plans`, plan, { headers: this.getHeaders() });
  }

  public updateAdminPlan(id: number, plan: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/plans/${id}`, plan, { headers: this.getHeaders() });
  }

  public deleteAdminPlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/plans/${id}`, { headers: this.getHeaders() });
  }

  public resetAdminDefaultPlans(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/plans/reset-defaults`, {}, { headers: this.getHeaders() });
  }

  public getAdminSystemSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/system-settings`, { headers: this.getHeaders() });
  }

  public updateAdminSystemSettings(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/system-settings`, data, { headers: this.getHeaders() });
  }

  public cleanTokens(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/clean-tokens`, {}, { headers: this.getHeaders() });
  }

  public cleanAllTokens(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/clean-all-tokens`, {}, { headers: this.getHeaders() });
  }

  public getAdminSystemInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/system-info`, { headers: this.getHeaders() });
  }

  public getAdminPackages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/packages`, { headers: this.getHeaders() });
  }

  public adminMaintenanceClearViews(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/clear-views`, {}, { headers: this.getHeaders() });
  }

  public adminMaintenanceClearConfig(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/clear-config`, {}, { headers: this.getHeaders() });
  }

  public adminMaintenanceClearRoutes(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/clear-routes`, {}, { headers: this.getHeaders() });
  }

  public adminMaintenanceClearLogs(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/clear-logs`, {}, { headers: this.getHeaders() });
  }

  public adminMaintenanceOptimize(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/optimize`, {}, { headers: this.getHeaders() });
  }

  public adminMaintenanceClearOptimize(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/maintenance/clear-optimize`, {}, { headers: this.getHeaders() });
  }
}

