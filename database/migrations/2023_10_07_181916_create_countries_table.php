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
        Schema::create('countries', function (Blueprint $table) {
            $table->smallInteger('id', true, true);
            $table->efficientUuid('uuid')->unique();
            $table->string('name')->unique();
            $table->string('iso_short_code', 10)->unique();
            $table->string('flag', 255)->nullable();
            $table->boolean('allowed_to_operate')->default(true);
            $table->string('distance_metric', 10)->default('KILOMETERS');
            $table->smallInteger('currency_id', false, true)->index('countries_currency_id');
            $table->foreign('currency_id')->references('id')->on('currencies')->onUpdate('restrict')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
