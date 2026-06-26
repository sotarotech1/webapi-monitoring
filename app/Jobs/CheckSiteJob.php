<?php

namespace App\Jobs;

use App\Events\SiteStatusChanged;
use App\Models\CheckLog;
use App\Models\Site;
use App\Notifications\SiteStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class CheckSiteJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $timeout = 30;

    public function __construct(public Site $site) {}

    public function handle(): void
    {
        $previousStatus = $this->site->status;
        $startTime = microtime(true);

        try {
            $response = Http::timeout(10)->get($this->site->url);
            $responseTimeMs = (int) round(
                (microtime(true) - $startTime) * 1000,
            );

            $isOnline = $response->successful() || $response->status() < 500;
            $statusCode = $response->status();
            $error = null;
        } catch (\Exception $e) {
            $responseTimeMs = (int) round(
                (microtime(true) - $startTime) * 1000,
            );
            $isOnline = false;
            $statusCode = null;
            $error = $e->getMessage();
        }

        $newStatus = $isOnline ? "up" : "down";

        CheckLog::create([
            "site_id" => $this->site->id,
            "status_code" => $statusCode,
            "response_time_ms" => $responseTimeMs,
            "is_online" => $isOnline,
            "error_message" => $error,
            "checked_at" => now(),
        ]);

        $this->site->update([
            "status" => $newStatus,
            "last_checked_at" => now(),
        ]);

        if ($previousStatus !== $newStatus) {
            $fresh = $this->site->fresh();

            // Broadcast via WebSocket
            SiteStatusChanged::dispatch($fresh);

            // Email + DB notification to the site owner
            $fresh->load("user");
            $fresh->user->notify(new SiteStatusNotification($fresh));
        }
    }
}
