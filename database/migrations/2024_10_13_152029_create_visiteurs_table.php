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
            Schema::create('visiteurs', function (Blueprint $table) {
                $table->id();
                $table->integer('matricule')->unsigned()->unique()->nullable();
                $table->string('nom');
                $table->string('prenom');
                $table->string('societe')->nullable();
                $table->string('email')->nullable();
                $table->boolean('consentement')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visiteurs');
    }
};
