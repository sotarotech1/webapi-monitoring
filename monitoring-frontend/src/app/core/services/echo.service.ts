import { Injectable, inject } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

(window as any).Pusher = Pusher;

@Injectable({ providedIn: 'root' })
export class EchoService {
  private authService = inject(AuthService);
  private echo: Echo<any> | null = null;

  private init(): void {
    if (this.echo) return;
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.appKey,
      wsHost: environment.reverb.host,
      wsPort: environment.reverb.port,
      wssPort: environment.reverb.port,
      forceTLS: environment.reverb.scheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.apiUrl.replace('/api', '')}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${this.authService.token()}`,
        },
      },
    });
  }

  listenToUserChannel(userId: number, callback: (event: any) => void): void {
    this.init();
    this.echo!.private(`user.${userId}`).listen('.site.status_changed', callback);
  }

  leaveUserChannel(userId: number): void {
    this.echo?.leave(`user.${userId}`);
  }

  disconnect(): void {
    this.echo?.disconnect();
    this.echo = null;
  }
}
