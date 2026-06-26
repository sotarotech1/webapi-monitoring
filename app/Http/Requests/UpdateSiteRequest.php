<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                   => ['sometimes', 'string', 'max:100'],
            'url'                    => ['sometimes', 'url', 'max:500'],
            'check_interval_minutes' => ['sometimes', 'integer', 'min:1', 'max:1440'],
            'is_active'              => ['sometimes', 'boolean'],
        ];
    }
}
