<?php

namespace App\Console\Commands;

use App\Models\Visitor;
use App\Models\Visit;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DeleteExpiredVisitors extends Command
{
    protected $signature = 'app:delete-visits-expired';
    protected $description = 'Supprime les visiteurs expiré (Datant de plus d\'1 mois)';

    public function handle()
    {
        try {
            DB::beginTransaction();

            $expiredVisitorIds = Visitor::whereDate('created_at', '<', Carbon::now()->subDays(30))
                ->where('data_retention', false)
                ->pluck('id');

            $updatedVisitsCount = Visit::whereIn('visitor_id', $expiredVisitorIds)
                ->update(['visitor_id' => null]);

            $deletedVisitorsCount = Visitor::whereIn('id', $expiredVisitorIds)->delete();

            DB::commit();

            $message = "{$deletedVisitorsCount} visiteurs supprimés et {$updatedVisitsCount} visites mises à jour";
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
