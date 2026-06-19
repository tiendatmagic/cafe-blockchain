<?php

namespace Tests\Feature;

use App\Domain\Entities\User;
use App\Domain\Entities\SubscriptionPlan;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SaaSSubscriptionTest extends TestCase
{
    use DatabaseTransactions;

    private $superAdminWallet = '0x75AD18eF47eDa21BafF837CAc0F1563D0C35555';
    private $regularWallet = '0x1234567890123456789012345678901234567890';

    protected function setUp(): void
    {
        parent::setUp();

        // Cấu hình ví Super Admin trong config và env cho quá trình test
        config(['app.super_admin_addresses' => $this->superAdminWallet]);
        putenv("SUPER_ADMIN_ADDRESSES={$this->superAdminWallet}");
        $_ENV['SUPER_ADMIN_ADDRESSES'] = $this->superAdminWallet;
        $_SERVER['SUPER_ADMIN_ADDRESSES'] = $this->superAdminWallet;
    }

    /**
     * Helper to create a user manually to bypass Eloquent fillable mass-assignment protection
     */
    private function createUser(string $wallet, string $planCode, string $status, ?string $expiresAt = null): User
    {
        $user = new User();
        $user->wallet_address = strtolower($wallet);
        $user->plan_code = $planCode;
        $user->subscription_status = $status;
        $user->subscription_expires_at = $expiresAt;
        $user->save();

        return $user;
    }

    /**
     * Test EnsureIsSuperAdmin middleware allows Super Admin.
     */
    public function test_super_admin_can_access_admin_routes(): void
    {
        $superAdmin = $this->createUser($this->superAdminWallet, 'ultra', 'active');

        Sanctum::actingAs($superAdmin);

        $response = $this->getJson('/api/admin/tenants');
        $response->assertStatus(200);
    }

    /**
     * Test EnsureIsSuperAdmin middleware blocks regular user.
     */
    public function test_regular_user_cannot_access_admin_routes(): void
    {
        $regularUser = $this->createUser($this->regularWallet, 'free', 'active');

        Sanctum::actingAs($regularUser);

        $response = $this->getJson('/api/admin/tenants');
        $response->assertStatus(403);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Forbidden. This action requires Super Admin privileges.'
        ]);
    }

    /**
     * Test CheckSubscription middleware blocks suspended users.
     */
    public function test_suspended_user_is_blocked_with_403(): void
    {
        $user = $this->createUser($this->regularWallet, 'free', 'suspended');

        Sanctum::actingAs($user);

        // Gọi thử endpoint dashboard (có CheckSubscription middleware)
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(403);
        $response->assertJsonFragment([
            'success' => false,
            'subscription_status' => 'suspended',
            'message' => 'Tài khoản của bạn đã bị khóa hoặc đình chỉ hoạt động. Vui lòng liên hệ quản trị viên để giải quyết.'
        ]);
    }

    /**
     * Test CheckSubscription middleware blocks expired users.
     */
    public function test_expired_user_is_blocked_with_402(): void
    {
        $user = $this->createUser($this->regularWallet, 'free', 'active', now()->subDay()->toDateTimeString());

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(402);
        $response->assertJsonFragment([
            'success' => false,
            'subscription_status' => 'expired',
            'message' => 'Gói dịch vụ của bạn đã hết hạn. Vui lòng liên hệ quản trị viên để gia hạn và tiếp tục sử dụng.'
        ]);
    }

    /**
     * Test CheckSubscription middleware allows active non-expired users.
     */
    public function test_active_user_can_access_business_routes(): void
    {
        $user = $this->createUser($this->regularWallet, 'pro', 'active', now()->addDays(5)->toDateTimeString());

        // Seed data settings để dashboard không bị lỗi query
        DB::table('settings')->insert([
            'store_owner_address' => strtolower($this->regularWallet),
            'key' => 'store_name',
            'value' => 'Cafe Test',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test Super Admin CRUD on subscription plans.
     */
    public function test_super_admin_can_crud_plans(): void
    {
        $superAdmin = $this->createUser($this->superAdminWallet, 'ultra', 'active');

        Sanctum::actingAs($superAdmin);

        // 1. Lấy danh sách gói cước (Ban đầu có 3 gói: free, pro, ultra từ migration)
        $response = $this->getJson('/api/admin/plans');
        $response->assertStatus(200);
        
        // 2. Tạo gói cước mới
        $newPlanData = [
            'code' => 'pro-plus',
            'name' => 'Gói Siêu Việt (Pro+)',
            'is_active' => true,
            'features' => [
                'max_products' => 1000,
                'max_staffs' => 20,
                'enable_storefront' => true,
                'enable_reports' => true,
                'enable_excel_export' => true,
            ]
        ];

        $response = $this->postJson('/api/admin/plans', $newPlanData);
        $response->assertStatus(201);
        $this->assertDatabaseHas('subscription_plans', ['code' => 'pro-plus']);

        // Lấy plan ID mới tạo
        $plan = SubscriptionPlan::where('code', 'pro-plus')->first();

        // 3. Cập nhật gói cước
        $updatedData = [
            'name' => 'Gói Siêu Việt Nâng Cấp',
            'is_active' => false,
            'features' => [
                'max_products' => 2000,
                'max_staffs' => 30,
                'enable_storefront' => true,
                'enable_reports' => true,
                'enable_excel_export' => true,
            ]
        ];

        $response = $this->putJson("/api/admin/plans/{$plan->id}", $updatedData);
        $response->assertStatus(200);
        $this->assertDatabaseHas('subscription_plans', [
            'code' => 'pro-plus',
            'name' => 'Gói Siêu Việt Nâng Cấp',
            'is_active' => false
        ]);

        // 4. Xóa gói cước
        $response = $this->deleteJson("/api/admin/plans/{$plan->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('subscription_plans', ['code' => 'pro-plus']);
    }

    /**
     * Test Super Admin cannot delete default plans (free, pro, ultra).
     */
    public function test_super_admin_cannot_delete_default_plans(): void
    {
        $superAdmin = $this->createUser($this->superAdminWallet, 'ultra', 'active');

        Sanctum::actingAs($superAdmin);

        $freePlan = SubscriptionPlan::where('code', 'free')->first();

        $response = $this->deleteJson("/api/admin/plans/{$freePlan->id}");
        $response->assertStatus(400);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Không thể xóa các gói cước hệ thống mặc định (free, pro, ultra).'
        ]);
    }

    /**
     * Test Super Admin can update tenant's subscription.
     */
    public function test_super_admin_can_update_tenant_subscription(): void
    {
        $superAdmin = $this->createUser($this->superAdminWallet, 'ultra', 'active');

        $tenant = $this->createUser($this->regularWallet, 'free', 'active', now()->addDays(7)->toDateTimeString());

        Sanctum::actingAs($superAdmin);

        $updateData = [
            'plan_code' => 'pro',
            'subscription_expires_at' => now()->addMonth()->toIso8601String(),
            'subscription_status' => 'suspended',
        ];

        $response = $this->putJson("/api/admin/tenants/{$tenant->id}/subscription", $updateData);
        $response->assertStatus(200);

        $tenant->refresh();
        $this->assertEquals('pro', $tenant->plan_code);
        $this->assertEquals('suspended', $tenant->subscription_status);
    }

    /**
     * Test Token cleanup settings and logic.
     */
    public function test_token_cleanup_settings_and_actions(): void
    {
        $superAdmin = $this->createUser($this->superAdminWallet, 'ultra', 'active');

        Sanctum::actingAs($superAdmin);

        // 1. Cập nhật cleanup days
        $response = $this->putJson('/api/admin/system-settings', [
            'token_cleanup_days' => 15
        ]);
        $response->assertStatus(200);
        
        $setting = DB::table('system_settings')->where('key', 'token_cleanup_days')->first();
        $this->assertNotNull($setting);
        $this->assertEquals(15, json_decode($setting->value, true)['days']);

        // 2. Lấy cleanup days
        $response = $this->getJson('/api/admin/system-settings');
        $response->assertStatus(200);
        $response->assertJsonFragment(['token_cleanup_days' => 15]);

        // 3. Kích hoạt dọn dẹp token
        $response = $this->postJson('/api/admin/clean-tokens');
        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'message']);
    }
}
