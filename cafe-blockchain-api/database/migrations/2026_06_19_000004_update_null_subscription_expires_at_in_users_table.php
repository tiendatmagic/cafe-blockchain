<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $users = DB::table('users')
            ->whereNull('store_owner_address')
            ->whereNull('subscription_expires_at')
            ->get();

        foreach ($users as $user) {
            $createdAt = Carbon::parse($user->created_at);
            $expiresAt = $user->plan_code === 'free' 
                ? $createdAt->addDays(7) 
                : $createdAt->addDays(30);

            DB::table('users')
                ->where('id', $user->id)
                ->update(['subscription_expires_at' => $expiresAt]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse action needed
    }
};
