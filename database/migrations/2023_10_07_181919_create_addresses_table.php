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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->morphs('model');
            $table->string('line_1');
            $table->string('line_2')->nullable();
            $table->string('line_3')->nullable();
            $table->string('city');
            $table->string('region')->nullable();
            $table->string('postcode')->nullable();
            $table->json('geocode_data')->nullable();
            $table->smallInteger('country_id', false, true)->index('addresses_country_id');
            $table->foreign('country_id')->references('id')->on('countries')->onUpdate('restrict')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
