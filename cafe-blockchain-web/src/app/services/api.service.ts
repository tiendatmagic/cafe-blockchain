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

  // 1. Dashboard API
  public getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }

  // 2. Products (Thực đơn) API
  public getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`, { headers: this.getHeaders() });
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

  public getOrder(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

  public createOrder(order: { table_number?: string, payment_method: string, items: { product_id: number, quantity: number }[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order, { headers: this.getHeaders() });
  }

  public updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  public syncOrderBlockchain(id: number, txHash: string, blockchainStatus: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}/sync`, {
      tx_hash: txHash,
      blockchain_status: blockchainStatus
    }, { headers: this.getHeaders() });
  }

  // 4. Settings (Cấu hình) API
  public getSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings`, { headers: this.getHeaders() });
  }

  public updateSettings(settings: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings`, settings, { headers: this.getHeaders() });
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
}
