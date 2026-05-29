<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lấy danh sách thực đơn
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $query = Product::where('store_owner_address', $storeOwner)
            ->with(['categories', 'variants'])
            ->orderBy('id', 'desc');
        // Lọc theo từ khóa tìm kiếm nếu có
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Lọc theo danh mục nếu có
        if ($request->has('category') && $request->category !== 'Tất cả') {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }
        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->input('limit', 9); // Mặc định 9 sản phẩm một trang
            $products = $query->paginate($limit);
        } else {
            // Mặc định trả về toàn bộ mảng phẳng để tương thích ngược
            $products = $query->get();
        }

        return response()->json($products);
    }

    /**
     * Thêm món mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => [
                'exists:categories,id',
                \Illuminate\Validation\Rule::exists('categories', 'id')->where('store_owner_address', $storeOwner)
            ],
            'image' => 'nullable|string|max:1000',
            'status' => 'nullable|boolean',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
            'variants' => 'nullable|array',
            'variants.*.variant_name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.status' => 'nullable|boolean',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'status' => $validated['status'] ?? true,
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'store_owner_address' => $storeOwner,
        ]);

        // Đồng bộ hóa các danh mục Nhiều-Nhiều
        $product->categories()->sync($validated['category_ids'] ?? []);

        // Lưu các biến thể nếu có
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $var) {
                $product->variants()->create([
                    'variant_name' => $var['variant_name'],
                    'price' => $var['price'],
                    'status' => $var['status'] ?? true,
                ]);
            }
        }

        $product->load(['categories', 'variants']);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product
        ], 201);
    }

    /**
     * Cập nhật món ăn
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $product = Product::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => [
                'exists:categories,id',
                \Illuminate\Validation\Rule::exists('categories', 'id')->where('store_owner_address', $storeOwner)
            ],
            'image' => 'nullable|string|max:1000',
            'status' => 'required|boolean',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.variant_name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.status' => 'required|boolean',
        ]);

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'status' => $validated['status'],
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        // Đồng bộ hóa các danh mục Nhiều-Nhiều
        $product->categories()->sync($validated['category_ids'] ?? []);

        // Đồng bộ các biến thể
        if ($request->has('variants')) {
            $incomingVariants = $request->variants ?: [];
            $incomingIds = collect($incomingVariants)->pluck('id')->filter()->toArray();

            // Xóa các biến thể cũ không xuất hiện trong danh sách mới
            $product->variants()->whereNotIn('id', $incomingIds)->delete();

            foreach ($incomingVariants as $var) {
                if (isset($var['id']) && $var['id']) {
                    $product->variants()->where('id', $var['id'])->update([
                        'variant_name' => $var['variant_name'],
                        'price' => $var['price'],
                        'status' => $var['status'],
                    ]);
                } else {
                    $product->variants()->create([
                        'variant_name' => $var['variant_name'],
                        'price' => $var['price'],
                        'status' => $var['status'] ?? true,
                    ]);
                }
            }
        }

        $product->load(['categories', 'variants']);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => $product
        ]);
    }

    /**
     * Xóa món ăn
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $product = Product::where('store_owner_address', $storeOwner)->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product does not exist or has already been deleted.'
            ], 404);
        }

        try {
            // Thực hiện xóa sản phẩm
            $product->delete();

            return response()->json([
                'message' => 'Product deleted successfully.'
            ]);
        } catch (\Exception $e) {
            // Lỗi QueryException hoặc các lỗi ràng buộc khóa ngoại (foreign key constraint)
            return response()->json([
                'message' => 'This product cannot be deleted because it has been recorded in the order history.',
                'error' => $e->getMessage()
            ], 409); // 409 Conflict đúng chuẩn Restful API
        }
    }
}
