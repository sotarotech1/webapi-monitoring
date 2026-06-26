<?php

namespace Database\Seeders;

use App\Models\CheckLog;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SiteSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@example.com')->first();

        $sites = [
            ['name' => 'Google',    'url' => 'https://www.google.com',    'status' => 'up'],
            ['name' => 'GitHub',    'url' => 'https://www.github.com',    'status' => 'up'],
            ['name' => 'Laravel',   'url' => 'https://laravel.com',       'status' => 'up'],
            ['name' => 'Mi API',    'url' => 'https://api.miapp.com',     'status' => 'down'],
            ['name' => 'Test Site', 'url' => 'https://test.example.com',  'status' => 'unknown'],
        ];

        foreach ($sites as $siteData) {
            $status = $siteData['status'];
            unset($siteData['status']);

            $site = Site::firstOrCreate(
                ['user_id' => $user->id, 'url' => $siteData['url']],
                array_merge($siteData, [
                    'check_interval_minutes' => 5,
                    'is_active'              => true,
                    'status'                 => $status,
                    'last_checked_at'        => now()->subMinutes(rand(1, 10)),
                ])
            );

            // Generate 10 historical check logs
            for ($i = 10; $i >= 1; $i--) {
                $isOnline = $status === 'down' && $i === 1 ? false : ($status === 'unknown' ? false : true);

                CheckLog::create([
                    'site_id'          => $site->id,
                    'status_code'      => $isOnline ? 200 : null,
                    'response_time_ms' => $isOnline ? rand(80, 600) : null,
                    'is_online'        => $isOnline,
                    'error_message'    => $isOnline ? null : 'Connection refused',
                    'checked_at'       => Carbon::now()->subMinutes($i * 5),
                ]);
            }
        }

        $this->command->info('Sites and check logs seeded.');
    }
}
