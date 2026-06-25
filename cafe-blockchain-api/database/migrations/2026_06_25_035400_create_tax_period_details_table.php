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
        Schema::create('tax_period_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tax_period_id');
            $table->string('document_type'); // declaration, s1a, s2a, s2b, s2c, s2d, s2e
            $table->json('data'); // JSON data (rows, etc)
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('tax_period_id')
                ->references('id')
                ->on('tax_periods')
                ->onDelete('cascade');

            // Unique composite index
            $table->unique(['tax_period_id', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_period_details');
    }
};
