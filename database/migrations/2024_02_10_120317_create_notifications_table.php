<?php

use App\Enums\NotificationStatus;
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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->morphs('receiver');
            $table->string('title', 255)->nullable();
            $table->text('notification');
            $table->string('status', 50)->default(NotificationStatus::Pending->name);
            $table->string('category', 50);
            $table->dateTime('opened_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
