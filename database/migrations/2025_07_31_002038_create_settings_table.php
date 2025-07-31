<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insérer les paramètres par défaut
        DB::table('settings')->insert([
            [
                'key' => 'data_retention_days',
                'value' => '30',
                'type' => 'integer',
                'description' => 'Nombre de jours avant suppression automatique des données visiteurs',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'key' => 'process_visits_time',
                'value' => '22:00',
                'type' => 'string',
                'description' => 'Heure quotidienne d\'exécution du traitement des visites (format HH:MM)',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'key' => 'admin_emergency_password',
                'value' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password" hashé
                'type' => 'string',
                'description' => 'Mot de passe administrateur pour l\'accès d\'urgence aux sorties',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
