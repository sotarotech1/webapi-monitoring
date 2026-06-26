import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SiteService } from '../../core/services/site.service';
import { DashboardStats } from '../../core/models/dashboard-stats.model';
import { Site } from '../../core/models/site.model';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, StatCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private siteService = inject(SiteService);

  stats = signal<DashboardStats | null>(null);
  sites = signal<Site[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.siteService.getDashboard().subscribe({ next: (s) => this.stats.set(s) });
    this.siteService.getSites().subscribe({
      next: (sites) => {
        this.sites.set(sites);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
