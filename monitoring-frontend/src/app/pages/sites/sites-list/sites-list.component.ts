import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SiteService } from '../../../core/services/site.service';
import { ToastService } from '../../../core/services/toast.service';
import { Site } from '../../../core/models/site.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SiteFormDialogComponent } from '../site-form-dialog/site-form-dialog.component';

@Component({
  selector: 'app-sites-list',
  imports: [RouterLink, DatePipe, StatusBadgeComponent, SiteFormDialogComponent],
  templateUrl: './sites-list.component.html',
  styleUrl: './sites-list.component.scss',
})
export class SitesListComponent implements OnInit {
  private siteService = inject(SiteService);
  private toast = inject(ToastService);

  formDialog = viewChild<ElementRef<HTMLDialogElement>>('formDialog');
  sites = signal<Site[]>([]);
  loading = signal(true);
  checkingIds = signal<Set<number>>(new Set());
  editingSite = signal<Site | null>(null);

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading.set(true);
    this.siteService.getSites().subscribe({
      next: (sites) => {
        this.sites.set(sites);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openForm(site?: Site): void {
    this.editingSite.set(site ?? null);
    this.formDialog()?.nativeElement.showModal();
  }

  onSaved(): void {
    this.formDialog()?.nativeElement.close();
    this.toast.success(this.editingSite() ? 'Site updated!' : 'Site added!');
    this.loadSites();
  }

  onCancelled(): void {
    this.formDialog()?.nativeElement.close();
  }

  checkNow(site: Site, event: Event): void {
    event.stopPropagation();
    this.checkingIds.update((s) => new Set([...s, site.id]));
    this.siteService.checkNow(site.id).subscribe({
      next: () => {
        this.toast.info('Check queued!');
        this.checkingIds.update((s) => {
          const n = new Set(s);
          n.delete(site.id);
          return n;
        });
      },
      error: () => {
        this.checkingIds.update((s) => {
          const n = new Set(s);
          n.delete(site.id);
          return n;
        });
      },
    });
  }

  deleteSite(site: Site, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Delete "${site.name}"? All check history will be removed.`)) return;
    this.siteService.deleteSite(site.id).subscribe({
      next: () => {
        this.toast.success('Site deleted.');
        this.loadSites();
      },
    });
  }
}
