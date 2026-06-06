<?php
 
namespace App\Http\Controllers;
 
use App\Domain\Entities\Category;
use Illuminate\Http\Request;
 
class CategoryController extends Controller
{
    /**
     * Lấy danh sách tất cả danh mục
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        return response()->json(Category::where('store_owner_address', $storeOwner)->orderBy('id', 'asc')->get());
    }
 
    /**
     * Tạo danh mục mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('categories', 'name')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
        ]);
 
        $category = Category::create([
            'name' => $validated['name'],
            'store_owner_address' => $storeOwner,
        ]);
 
        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category
        ], 201);
    }
 
    /**
     * Cập nhật danh mục
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $category = Category::where('store_owner_address', $storeOwner)->findOrFail($id);
 
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('categories', 'name')
                    ->ignore($id)
                    ->where(function ($query) use ($storeOwner) {
                        return $query->where('store_owner_address', $storeOwner);
                    })
            ],
        ]);
 
        $category->update([
            'name' => $validated['name']
        ]);
 
        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category
        ]);
    }
 
    /**
     * Xóa danh mục
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $category = Category::where('store_owner_address', $storeOwner)->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category does not exist or has already been deleted.'
            ], 404);
        }

        try {
            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'This category cannot be deleted because it is assigned to one or more products.',
                'error' => $e->getMessage()
            ], 409); // 409 Conflict đúng chuẩn Restful API
        }
    }
}
