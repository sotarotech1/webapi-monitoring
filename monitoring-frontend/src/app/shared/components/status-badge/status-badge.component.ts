import { Component, Input } from '@angular/core';
import { SiteStatus } from '../../../core/models/site.model';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  @Input() status: SiteStatus = 'unknown';

  get label(): string {
    return { up: 'Online', down: 'Offline', unknown: 'Unknown' }[this.status];
  }

  get badgeClass(): string {
    return {
      up: 'badge-success',
      down: 'badge-error',
      unknown: 'badge-ghost',
    }[this.status];
  }

  get dotClass(): string {
    return {
      up: 'bg-green-500',
      down: 'bg-red-500',
      unknown: 'bg-gray-400',
    }[this.status];
  }
}
