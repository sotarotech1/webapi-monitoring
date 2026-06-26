<?php

namespace App\Console\Commands;

use App\Jobs\CheckSiteJob;
use App\Models\Site;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CheckSitesCommand extends Command
{
    protected $signature   = 'monitoring:check-sites {--force : Check all sites ignoring interval}';
    protected $description = 'Dispatch check jobs for active sites that are due for a check.';

    public function handle(): int
    {
        $force = $this->option('force');

        $sites = Site::where('is_active', true)
            ->when(! $force, function ($query) {
                $query->where(function ($q) {
                    $q->whereNull('last_checked_at')
                      ->orWhereRaw(
                          'TIMESTAMPDIFF(MINUTE, last_checked_at, NOW()) >= check_interval_minutes'
                      );
                });
            })
            ->get();

        $count = $sites->count();

        $sites->each(fn (Site $site) => CheckSiteJob::dispatch($site));

        $this->info("Dispatched {$count} site check job(s).");

        return self::SUCCESS;
    }
}
