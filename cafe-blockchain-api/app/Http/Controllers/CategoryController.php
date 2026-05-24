<?php
 
namespace App\Http\Controllers;
 
use App\Models\Category;
use Illuminate\Http\Request;
 
class CategoryController extends Controller
{
    /**
     * Lấy danh sách tất cả danh mục
     */
    public function index()
    {
        return response()->json(Category::orderBy('id', 'asc')->get());
    }
 
    /**
     * Tạo danh mục mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);
 
        $category = Category::create($validated);
 
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
        $category = Category::findOrFail($id);
 
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
        ]);
 
        $category->update($validated);
 
        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category
        ]);
    }
 
    /**
     * Xóa danh mục
     */
    public function destroy($id)
    {
        $category = Category::find($id);

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
