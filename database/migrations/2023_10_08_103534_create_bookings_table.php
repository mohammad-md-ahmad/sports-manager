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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->unsignedBigInteger('customer_user_id');
            $table->foreign('customer_user_id')->references('id')->on('users')->onUpdate('restrict')->onDelete('restrict');
            $table->unsignedBigInteger('schedule_details_id');
            $table->foreign('schedule_details_id')->references('id')->on('schedule_details')->onUpdate('restrict')->onDelete('restrict');
            $table->boolean('is_approved');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
