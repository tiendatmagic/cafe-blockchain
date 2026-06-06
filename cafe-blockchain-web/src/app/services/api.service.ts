import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Web3Service } from './web3.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly web3Service = inject(Web3Service);
  
  // URL của Laravel Backend API (Cổng mặc định của artisan serve)
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Cập nhật token vào localStorage
   */
  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  public removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Tạo HttpHeaders chứa Bearer token để gửi lên Backend kiểm tra bảo mật
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
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

  // 1. Dashboard API
  public getDashboard(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
      params = params.set('end_date', endDate);
    }
    return this.http.get(`${this.baseUrl}/dashboard`, { params, headers: this.getHeaders() });
  }

  // 2. Products (Thực đơn) API
  public getProducts(params?: { page?: number; limit?: number; search?: string; category?: string }): Observable<any> {
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
    return this.http.get<any>(`${this.baseUrl}/products`, { params: httpParams, headers: this.getHeaders() });
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

  // 4. Settings (Cấu hình) API
  public getSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings`, { headers: this.getHeaders() });
  }

  public getPublicSettings(orderCode?: string): Observable<any> {
    const url = orderCode ? `${this.baseUrl}/settings/public?order_code=${orderCode}` : `${this.baseUrl}/settings/public`;
    return this.http.get(url);
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
  public getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
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
  public getCustomers(search?: string, limit?: number): Observable<any[]> {
    let url = `${this.baseUrl}/customers`;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (limit) params.push(`limit=${limit}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
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
  public getCustomerGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customer-groups`, { headers: this.getHeaders() });
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
  public getAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/areas`, { headers: this.getHeaders() });
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
  public getDiningTables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dining-tables`, { headers: this.getHeaders() });
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
}
