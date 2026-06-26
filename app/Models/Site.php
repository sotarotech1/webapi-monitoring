<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    protected $fillable = [
        "user_id",
        "name",
        "url",
        "check_interval_minutes",
        "is_active",
        "status",
        "last_checked_at",
    ];

    protected $casts = [
        "is_active" => "boolean",
        "last_checked_at" => "datetime",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(CheckLog::class);
    }

    public function latestLog(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(CheckLog::class)->latestOfMany("checked_at");
    }
}
