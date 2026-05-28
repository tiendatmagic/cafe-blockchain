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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('type')->default('individual')->after('customer_code');
            $table->string('company_name')->nullable()->after('name');
            $table->string('tax_code')->nullable()->after('company_name');
            $table->string('representative_name')->nullable()->after('tax_code');
            $table->string('website')->nullable()->after('representative_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['type', 'company_name', 'tax_code', 'representative_name', 'website']);
        });
    }
};
