import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  auth = inject(AuthService);

  navLinks = [
    { path: '/dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
    { path: '/sites', icon: 'fa-globe', label: 'Sites' },
  ];
}
