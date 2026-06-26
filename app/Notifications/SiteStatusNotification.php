<?php

namespace App\Notifications;

use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SiteStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Site $site) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isDown  = $this->site->status === 'down';
        $subject = $isDown
            ? "🔴 [{$this->site->name}] is DOWN"
            : "🟢 [{$this->site->name}] is back UP";

        $mail = (new MailMessage)
            ->subject($subject)
            ->greeting("Hello, {$notifiable->name}!")
            ->line($isDown
                ? "Your site **{$this->site->name}** is currently **DOWN**."
                : "Your site **{$this->site->name}** is back **ONLINE**."
            )
            ->line("URL: {$this->site->url}")
            ->line("Status changed at: " . now()->format('Y-m-d H:i:s') . " UTC");

        if ($isDown) {
            $mail->line("We will notify you when it recovers.");
        }

        return $mail->salutation("— Monitoring WebAPI");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'site_id' => $this->site->id,
            'name'    => $this->site->name,
            'url'     => $this->site->url,
            'status'  => $this->site->status,
        ];
    }
}
