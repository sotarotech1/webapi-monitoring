<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'site_id',
        'status_code',
        'response_time_ms',
        'is_online',
        'error_message',
        'checked_at',
    ];

    protected $casts = [
        'is_online'  => 'boolean',
        'checked_at' => 'datetime',
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
