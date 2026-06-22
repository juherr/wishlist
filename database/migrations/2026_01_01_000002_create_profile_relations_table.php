<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_relations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('legacy_parent_id')->nullable();
            $table->unsignedBigInteger('legacy_child_id')->nullable();
            $table->foreignId('parent_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignId('child_id')->constrained('profiles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['parent_id', 'child_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_relations');
    }
};
