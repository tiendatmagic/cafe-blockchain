import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private readonly apiService = inject(ApiService);

  public readonly taxProfile = signal<any>(null);
  public readonly isProfileConfigured = signal<boolean>(false);
  public readonly isLoading = signal<boolean>(false);

  public loadTaxProfile() {
    this.isLoading.set(true);
    this.apiService.getTaxProfile().subscribe({
      next: (res) => {
        this.taxProfile.set(res.profile);
        this.isProfileConfigured.set(res.configured);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  public saveTaxProfile(data: any): Observable<any> {
    return this.apiService.saveTaxProfile(data);
  }

  public getTaxEstimate(startDate: string, endDate: string): Observable<any> {
    return this.apiService.getTaxEstimate(startDate, endDate);
  }

  public getTaxPeriods(page: number, limit: number, status?: string, year?: string): Observable<any> {
    return this.apiService.getTaxPeriods(page, limit, status, year);
  }

  public createTaxPeriod(data: any): Observable<any> {
    return this.apiService.createTaxPeriod(data);
  }

  public lockTaxPeriod(id: string): Observable<any> {
    return this.apiService.lockTaxPeriod(id);
  }

  public destroyTaxPeriod(id: string): Observable<any> {
    return this.apiService.destroyTaxPeriod(id);
  }

  public getPeriodDetails(periodId: string, documentType: string): Observable<any> {
    return this.apiService.getTaxPeriodDetails(periodId, documentType);
  }

  public savePeriodDetails(periodId: string, documentType: string, data: any): Observable<any> {
    return this.apiService.saveTaxPeriodDetails(periodId, documentType, data);
  }
}
