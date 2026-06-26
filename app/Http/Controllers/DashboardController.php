<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $sites = $user->sites()->get();

        $total   = $sites->count();
        $up      = $sites->where('status', 'up')->count();
        $down    = $sites->where('status', 'down')->count();
        $unknown = $sites->where('status', 'unknown')->count();
        $active  = $sites->where('is_active', true)->count();

        return response()->json([
            'total_sites'    => $total,
            'sites_up'       => $up,
            'sites_down'     => $down,
            'sites_unknown'  => $unknown,
            'active_sites'   => $active,
            'uptime_percent' => $total > 0 ? round($up / $total * 100, 1) : null,
        ]);
    }
}
