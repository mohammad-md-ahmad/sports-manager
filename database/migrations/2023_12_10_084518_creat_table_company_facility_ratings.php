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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->morphs('rated_entity');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('booking_id')->nullable();
            $table->foreign('booking_id')->references('id')->on('bookings')->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['rated_entity_id', 'rated_entity_type', 'user_id', 'booking_id'], 'rating_user_booking_unique');
            $table->string('commenter_name');
            $table->char('rating');
            $table->string('comment', 1000)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
