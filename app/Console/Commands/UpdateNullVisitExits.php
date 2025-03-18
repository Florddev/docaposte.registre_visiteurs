<?php

namespace App\Console\Commands;

use App\Models\Visit;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateNullVisitExits extends Command
{
    protected $signature = 'app:update-visit-exits';
    protected $description = 'Met à jour les dates de sortie nulles';

    public function handle()
    {
        $count = Visit::whereNull('date_sortie')
            ->update(['date_sortie' => Carbon::now()]);

        $this->info("$count visites ont été mises à jour");
        Log::info("$count visites ont été mises à jour");
    }
}
