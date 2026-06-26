<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckLogController extends Controller
{
    public function index(Request $request, Site $site): JsonResponse
    {
        abort_if($site->user_id !== $request->user()->id, 403, 'Forbidden.');

        $logs = $site->logs()
            ->orderByDesc('checked_at')
            ->paginate($request->integer('per_page', 50));

        return response()->json($logs);
    }
}
