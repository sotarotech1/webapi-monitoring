<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiteRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                   => ['required', 'string', 'max:100'],
            'url'                    => ['required', 'url', 'max:500'],
            'check_interval_minutes' => ['sometimes', 'integer', 'min:1', 'max:1440'],
            'is_active'              => ['sometimes', 'boolean'],
        ];
    }
}
