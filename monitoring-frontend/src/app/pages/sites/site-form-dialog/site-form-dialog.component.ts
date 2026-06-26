import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteService } from '../../../core/services/site.service';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-site-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './site-form-dialog.component.html',
})
export class SiteFormDialogComponent implements OnChanges {
  @Input() site?: Site | null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private siteService = inject(SiteService);

  loading = signal(false);
  isEdit = false;
  intervals = [1, 2, 5, 10, 15, 30, 60];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    check_interval_minutes: [5, [Validators.required, Validators.min(1)]],
    is_active: [true],
  });

  ngOnChanges(): void {
    this.isEdit = !!this.site;
    if (this.site) {
      this.form.patchValue(this.site as any);
    } else {
      this.form.reset({ check_interval_minutes: 5, is_active: true });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const val = this.form.value as any;
    const obs = this.isEdit
      ? this.siteService.updateSite(this.site!.id, val)
      : this.siteService.createSite(val);

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: () => this.loading.set(false),
    });
  }
}
