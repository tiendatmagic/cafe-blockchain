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
            'message' => 'Tạo danh mục thành công!',
            'category' => $category
        ], 210);
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
            'message' => 'Cập nhật danh mục thành công!',
            'category' => $category
        ]);
    }
 
    /**
     * Xóa danh mục
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
 
        return response()->json([
            'message' => 'Xóa danh mục thành công!'
        ]);
    }
}
