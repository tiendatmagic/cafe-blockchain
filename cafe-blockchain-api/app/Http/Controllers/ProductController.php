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
        $products = Product::where('store_owner_address', $storeOwner)->with('categories')->orderBy('id', 'desc')->get();
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
            'category_ids.*' => 'exists:categories,id',
            'image' => 'nullable|string|max:1000',
            'status' => 'nullable|boolean',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
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
        $product->load('categories');

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
            'category_ids.*' => 'exists:categories,id',
            'image' => 'nullable|string|max:1000',
            'status' => 'required|boolean',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
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
        $product->load('categories');

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
