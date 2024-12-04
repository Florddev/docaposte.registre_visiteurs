<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE_NAME = 'visits';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable(self::TABLE_NAME)) {
            Schema::create(self::TABLE_NAME, function (Blueprint $table) {
                $table->id();
                $table->foreignId('visitor_id')->nullable()->constrained('visitors');
                $table->foreignId('motif_id')->constrained('purposes')->onDelete('restrict');
                $table->string('visit_recipient')->nullable();
                $table->string('company')->nullable();
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
        Schema::dropIfExists(self::TABLE_NAME);
    }
};
