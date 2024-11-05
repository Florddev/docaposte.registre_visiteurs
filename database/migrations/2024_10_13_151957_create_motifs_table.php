<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('motifs')) {
            Schema::create('motifs', function (Blueprint $table) {
                $table->id();
                $table->string('nom')->unique();
                $table->timestamps();
            });

            DB::table('motifs')->insert([
                ['nom' => 'client'],
                ['nom' => 'fournisseur'],
                ['nom' => 'audit'],
                ['nom' => 'prospect'],
                ['nom' => 'autre']
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motifs');
    }
};
