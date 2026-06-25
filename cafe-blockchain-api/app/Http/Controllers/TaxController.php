<?php

namespace App\Http\Controllers;

use App\Domain\Entities\TaxProfile;
use App\Domain\Entities\TaxPeriod;
use App\Infrastructure\Persistence\Eloquent\OrderModel as Order;
use App\Domain\Entities\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class TaxController extends Controller
{
    /**
     * Get the store's tax profile.
     */
    public function getProfile(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        $profile = TaxProfile::where('store_owner_address', $storeOwner)->first();

        if (!$profile) {
            return response()->json([
                'configured' => false,
                'profile' => null
            ]);
        }

        return response()->json([
            'configured' => true,
            'profile' => $profile
        ]);
    }

    /**
     * Save or update the store's tax profile.
     */
    public function saveProfile(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

        $validated = $request->validate([
            'business_group' => 'required|integer|in:1,2,3,4',
            'industry_type' => 'required|string|in:distributor,service,production,others',
            'is_multi_industry' => 'required|boolean',
            'industry_allocation' => 'nullable|array',
            'tax_method' => 'required|string|in:revenue_percent,profit_percent',
        ]);

        $profile = TaxProfile::updateOrCreate(
            ['store_owner_address' => $storeOwner],
            [
                'business_group' => $validated['business_group'],
                'industry_type' => $validated['industry_type'],
                'is_multi_industry' => $validated['is_multi_industry'],
                'industry_allocation' => $validated['is_multi_industry'] ? $validated['industry_allocation'] : null,
                'tax_method' => $validated['tax_method'],
            ]
        );

        return response()->json([
            'message' => 'Tax profile saved successfully.',
            'profile' => $profile
        ]);
    }

    /**
     * Get tax estimates for a specific date range.
     */
    public function getEstimate(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $profile = TaxProfile::where('store_owner_address', $storeOwner)->first();

        if (!$profile) {
            return response()->json([
                'profile_configured' => false,
                'message' => 'Tax profile is not configured yet.'
            ]);
        }

        $estimate = $this->calculateTaxEstimate($storeOwner, $profile, $startDate, $endDate);

        return response()->json(array_merge([
            'profile_configured' => true,
        ], $estimate));
    }

    /**
     * Get list of tax periods (paginated).
     */
    public function getPeriods(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $limit = (int)$request->query('limit', 10);
        $status = $request->query('status');
        $year = $request->query('year');

        $query = TaxPeriod::where('store_owner_address', $storeOwner)
            ->orderBy('period_year', 'desc')
            ->orderBy('period_type', 'desc')
            ->orderBy('period_value', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        if ($year) {
            $query->where('period_year', (int)$year);
        }

        $paginated = $query->paginate($limit);

        return response()->json($paginated);
    }

    /**
     * Create a new tax period (calculates estimate at creation time).
     */
    public function createPeriod(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

        $validated = $request->validate([
            'period_type' => 'required|string|in:month,quarter,year',
            'period_value' => 'required|integer',
            'period_year' => 'required|integer',
        ]);

        $profile = TaxProfile::where('store_owner_address', $storeOwner)->first();
        if (!$profile) {
            return response()->json([
                'message' => 'Please configure your tax profile before creating a tax period.'
            ], 400);
        }

        // Check if period already exists
        $exists = TaxPeriod::where('store_owner_address', $storeOwner)
            ->where('period_type', $validated['period_type'])
            ->where('period_value', $validated['period_value'])
            ->where('period_year', $validated['period_year'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Tax period for this timeframe already exists.'
            ], 400);
        }

        // Calculate timeframe dates
        $dates = $this->getTimeframeDates($validated['period_type'], $validated['period_value'], $validated['period_year']);
        
        // Calculate estimate
        $estimate = $this->calculateTaxEstimate($storeOwner, $profile, $dates['start_date'], $dates['end_date']);

        $period = TaxPeriod::create([
            'store_owner_address' => $storeOwner,
            'period_type' => $validated['period_type'],
            'period_value' => $validated['period_value'],
            'period_year' => $validated['period_year'],
            'status' => 'open',
            'revenue_amount' => $estimate['revenue'],
            'expense_amount' => $estimate['expense'],
            'estimated_vat' => $estimate['estimated_vat'],
            'estimated_pit' => $estimate['estimated_pit'],
        ]);

        return response()->json([
            'message' => 'Tax period created successfully.',
            'period' => $period
        ], 201);
    }

    /**
     * Lock a tax period.
     */
    public function lockPeriod(Request $request, $id)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        $period = TaxPeriod::where('id', $id)->where('store_owner_address', $storeOwner)->first();

        if (!$period) {
            return response()->json([
                'message' => 'Tax period not found.'
            ], 404);
        }

        if ($period->status === 'locked') {
            return response()->json([
                'message' => 'Tax period is already locked.'
            ], 400);
        }

        $period->status = 'locked';
        $period->save();

        return response()->json([
            'message' => 'Tax period locked successfully.',
            'period' => $period
        ]);
    }

    /**
     * Delete an open tax period.
     */
    public function destroyPeriod(Request $request, $id)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

        $period = TaxPeriod::where('id', $id)->where('store_owner_address', $storeOwner)->first();

        if (!$period) {
            return response()->json([
                'message' => 'Tax period not found.'
            ], 404);
        }

        if ($period->status === 'locked') {
            return response()->json([
                'message' => 'Cannot delete a locked tax period.'
            ], 400);
        }

        $period->delete();

        return response()->json([
            'message' => 'Tax period deleted successfully.'
        ]);
    }

    /**
     * Helper to compute start and end dates based on period settings.
     */
    private function getTimeframeDates($type, $value, $year)
    {
        if ($type === 'month') {
            $startDate = Carbon::create($year, $value, 1)->startOfMonth()->toDateString();
            $endDate = Carbon::create($year, $value, 1)->endOfMonth()->toDateString();
        } elseif ($type === 'quarter') {
            $startMonth = ($value - 1) * 3 + 1;
            $endMonth = $value * 3;
            $startDate = Carbon::create($year, $startMonth, 1)->startOfMonth()->toDateString();
            $endDate = Carbon::create($year, $endMonth, 1)->endOfMonth()->toDateString();
        } else {
            // year
            $startDate = Carbon::create($year, 1, 1)->startOfYear()->toDateString();
            $endDate = Carbon::create($year, 12, 31)->endOfYear()->toDateString();
        }

        return [
            'start_date' => $startDate,
            'end_date' => $endDate
        ];
    }

    /**
     * Helper to calculate revenue, expense and taxes estimate.
     */
    private function calculateTaxEstimate($storeOwner, $profile, $startDate, $endDate)
    {
        // 1. Doanh thu (Revenue from completed orders)
        $revenue = (float)Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->sum('total_amount');

        // 2. Chi phí (Expenses from transaction type = 'chi')
        $expense = (float)Transaction::where('store_owner_address', $storeOwner)
            ->where('type', 'chi')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // 3. Compute tax rates
        $vatRate = 0;
        $pitRate = 0;

        if ($profile->is_multi_industry && !empty($profile->industry_allocation)) {
            foreach ($profile->industry_allocation as $ind => $pct) {
                $rates = $this->getRatesForIndustry($ind);
                $vatRate += ($pct / 100) * $rates['vat'];
                $pitRate += ($pct / 100) * $rates['pit'];
            }
        } else {
            $rates = $this->getRatesForIndustry($profile->industry_type);
            $vatRate = $rates['vat'];
            $pitRate = $rates['pit'];
        }

        // Calculate VAT
        $estimatedVat = $revenue * $vatRate;

        // Calculate PIT
        if ($profile->tax_method === 'profit_percent') {
            // Method 2: 15% profit
            $profit = max(0.0, $revenue - $expense);
            $estimatedPit = $profit * 0.15;
        } else {
            // Method 1: % revenue
            $estimatedPit = $revenue * $pitRate;
        }
        
        return [
            'revenue' => $revenue,
            'expense' => $expense,
            'vat_rate' => $vatRate,
            'pit_rate' => $pitRate,
            'estimated_vat' => $estimatedVat,
            'estimated_pit' => $estimatedPit,
            'estimated_total_tax' => $estimatedVat + $estimatedPit,
        ];
    }

    /**
     * Get tax rates for a given industry.
     */
    private function getRatesForIndustry($industryType)
    {
        switch ($industryType) {
            case 'distributor':
                return ['vat' => 0.01, 'pit' => 0.005];
            case 'service':
                return ['vat' => 0.05, 'pit' => 0.02];
            case 'production':
                return ['vat' => 0.03, 'pit' => 0.015];
            case 'others':
            default:
                return ['vat' => 0.02, 'pit' => 0.01];
        }
    }
}
