<?php

namespace App\Events;

use App\Models\Site;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SiteStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Site $site) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->site->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'site.status_changed';
    }

    public function broadcastWith(): array
    {
        return [
            'site_id' => $this->site->id,
            'name'    => $this->site->name,
            'url'     => $this->site->url,
            'status'  => $this->site->status,
        ];
    }
}
