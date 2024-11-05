<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('visiteurs')) {
            Schema::create('visites', function (Blueprint $table) {
                $table->id();
                $table->foreignId('visiteur_id')->constrained('visiteurs')->onDelete('cascade');
                $table->foreignId('motif_id')->constrained('motifs')->onDelete('restrict');
                $table->dateTime('date_entree');
                $table->dateTime('date_sortie')->nullable();
                $table->integer('identifiant_sortie')->unsigned()->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visites');
    }
};
