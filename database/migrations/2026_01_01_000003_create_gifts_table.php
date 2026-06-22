<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gifts', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('legacy_id')->nullable()->unique();
            $table->foreignId('profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->boolean('is_list')->default(false);
            $table->foreignId('reserved_by_profile_id')->nullable()->constrained('profiles')->nullOnDelete();
            $table->string('reserved_by_guest_name')->nullable();
            $table->timestamp('reserved_at')->nullable();
            $table->timestamps();

            $table->index(['profile_id', 'is_list']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gifts');
    }
};
