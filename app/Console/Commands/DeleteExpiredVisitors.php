<?php

namespace App\Console\Commands;

use App\Models\Visitor;
use App\Models\Visit;
use App\Models\Setting;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DeleteExpiredVisitors extends Command
{
    protected $signature = 'app:delete-visits-expired';
    protected $description = 'Supprime les visiteurs expiré selon la configuration des paramètres';

    public function handle()
    {
        try {
            // Récupérer la période de rétention depuis les paramètres
            $retentionDays = Setting::get('data_retention_days', 30);

            DB::beginTransaction();

            $expiredVisitorIds = Visitor::whereDate('created_at', '<', Carbon::now()->subDays($retentionDays))
                ->where('data_retention', false)
                ->pluck('id');

            $updatedVisitsCount = Visit::whereIn('visitor_id', $expiredVisitorIds)
                ->update(['visitor_id' => null]);

            $deletedVisitorsCount = Visitor::whereIn('id', $expiredVisitorIds)->delete();

            DB::commit();

            $message = "{$deletedVisitorsCount} visiteurs supprimés et {$updatedVisitsCount} visites mises à jour (période: {$retentionDays} jours)";
            $this->info($message);
            Log::info($message);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Erreur lors de la suppression des visiteurs : " . $e->getMessage());
            Log::error("Erreur lors de la suppression des visiteurs : " . $e->getMessage());
            return 1;
        }
        return 0;
    }
}
