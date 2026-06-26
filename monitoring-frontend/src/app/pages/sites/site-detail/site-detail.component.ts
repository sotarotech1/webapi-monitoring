import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { SiteService } from '../../../core/services/site.service';
import { EchoService } from '../../../core/services/echo.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Site } from '../../../core/models/site.model';
import { CheckLog } from '../../../core/models/check-log.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-site-detail',
  imports: [RouterLink, DatePipe, SlicePipe, StatusBadgeComponent],
  templateUrl: './site-detail.component.html',
  styleUrl: './site-detail.component.scss',
})
export class SiteDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private siteService = inject(SiteService);
  private echoService = inject(EchoService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  site = signal<Site | null>(null);
  logs = signal<PaginatedResponse<CheckLog> | null>(null);
  loading = signal(true);
  logsLoading = signal(true);
  checking = signal(false);
  currentPage = signal(1);

  private siteId!: number;

  ngOnInit(): void {
    this.siteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSite();
    this.loadLogs(1);
    this.subscribeToEcho();
  }

  ngOnDestroy(): void {
    const userId = this.authService.user()?.id;
    if (userId) this.echoService.leaveUserChannel(userId);
  }

  loadSite(): void {
    this.siteService.getSite(this.siteId).subscribe({
      next: (site) => {
        this.site.set(site);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadLogs(page: number): void {
    this.logsLoading.set(true);
    this.currentPage.set(page);
    this.siteService.getLogs(this.siteId, page).subscribe({
      next: (logs) => {
        this.logs.set(logs);
        this.logsLoading.set(false);
      },
      error: () => this.logsLoading.set(false),
    });
  }

  checkNow(): void {
    this.checking.set(true);
    this.siteService.checkNow(this.siteId).subscribe({
      next: () => {
        this.toast.info('Check queued!');
        this.checking.set(false);
      },
      error: () => this.checking.set(false),
    });
  }

  private subscribeToEcho(): void {
    const userId = this.authService.user()?.id;
    if (!userId) return;
    this.echoService.listenToUserChannel(userId, (event: any) => {
      if (event.site_id === this.siteId) {
        this.toast.success(`Site is now ${event.status.toUpperCase()}`);
        this.loadSite();
        this.loadLogs(1);
      }
    });
  }

  barWidth(ms: number | null): string {
    if (!ms) return '0%';
    return Math.min((ms / 2000) * 100, 100) + '%';
  }

  barColor(ms: number | null): string {
    if (!ms) return '#e5e7eb';
    if (ms < 300) return '#22c55e';
    if (ms < 800) return '#f59e0b';
    return '#ef4444';
  }
}
