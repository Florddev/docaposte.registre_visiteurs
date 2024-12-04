<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    const TABLE_NAME = 'purposes';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable(self::TABLE_NAME)) {
            Schema::create(self::TABLE_NAME, function (Blueprint $table) {
                $table->id();
                $table->string('nom')->unique();
                $table->timestamps();
            });

            $communData = ['created_at' => now(), 'updated_at' => now()];
            DB::table(self::TABLE_NAME)->insert([
                ['nom' => 'Visit', ...$communData],
                ['nom' => 'Audit', ...$communData],
                ['nom' => 'Entretien', ...$communData],
                ['nom' => 'Réunion', ...$communData],
                ['nom' => 'Autre', ...$communData]
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(self::TABLE_NAME);
    }
};
