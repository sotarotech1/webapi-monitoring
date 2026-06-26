import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  alertClass(type: string): string {
    return {
      success: 'alert-success',
      error:   'alert-error',
      warning: 'alert-warning',
      info:    'alert-info',
    }[type] ?? 'alert-info';
  }

  icon(type: string): string {
    return {
      success: 'fa-circle-check',
      error:   'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info:    'fa-circle-info',
    }[type] ?? 'fa-circle-info';
  }
}
