<?php

namespace App\Console\Commands;

use App\Models\Visit;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessVisitsTasks extends Command
{
    protected $signature = 'app:process-visits';
    protected $description = 'Met à jour et nettoie les données de visite';

    public function handle()
    {
        $this->call('app:update-visit-exits');
        $this->call('app:delete-visits-expired');

        return 0;
    }
}
