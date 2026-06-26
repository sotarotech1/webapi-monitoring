import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Site, CreateSiteRequest, UpdateSiteRequest } from '../models/site.model';
import { CheckLog } from '../models/check-log.model';
import { DashboardStats } from '../models/dashboard-stats.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard`);
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.base}/sites`);
  }

  getSite(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.base}/sites/${id}`);
  }

  createSite(data: CreateSiteRequest): Observable<Site> {
    return this.http.post<Site>(`${this.base}/sites`, data);
  }

  updateSite(id: number, data: UpdateSiteRequest): Observable<Site> {
    return this.http.put<Site>(`${this.base}/sites/${id}`, data);
  }

  deleteSite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/sites/${id}`);
  }

  checkNow(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/sites/${id}/check`, {});
  }

  getLogs(id: number, page = 1, perPage = 20): Observable<PaginatedResponse<CheckLog>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage));
    return this.http.get<PaginatedResponse<CheckLog>>(`${this.base}/sites/${id}/logs`, { params });
  }
}
