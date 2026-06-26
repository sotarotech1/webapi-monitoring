<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSiteRequest;
use App\Http\Requests\UpdateSiteRequest;
use App\Jobs\CheckSiteJob;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sites = $request->user()
            ->sites()
            ->withCount('logs')
            ->orderBy('name')
            ->get();

        return response()->json($sites);
    }

    public function store(StoreSiteRequest $request): JsonResponse
    {
        $site = $request->user()->sites()->create($request->validated());

        // Trigger first check immediately
        CheckSiteJob::dispatch($site);

        return response()->json($site, 201);
    }

    public function show(Request $request, Site $site): JsonResponse
    {
        $this->authorizeSite($request, $site);

        $site->loadCount('logs');

        return response()->json($site);
    }

    public function update(UpdateSiteRequest $request, Site $site): JsonResponse
    {
        $this->authorizeSite($request, $site);

        $site->update($request->validated());

        return response()->json($site);
    }

    public function destroy(Request $request, Site $site): JsonResponse
    {
        $this->authorizeSite($request, $site);

        $site->delete();

        return response()->json(['message' => 'Site deleted.']);
    }

    public function checkNow(Request $request, Site $site): JsonResponse
    {
        $this->authorizeSite($request, $site);

        CheckSiteJob::dispatch($site);

        return response()->json(['message' => 'Check queued.']);
    }

    private function authorizeSite(Request $request, Site $site): void
    {
        abort_if($site->user_id !== $request->user()->id, 403, 'Forbidden.');
    }
}
