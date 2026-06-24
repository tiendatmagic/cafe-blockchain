<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lấy danh sách thực đơn
     */
    public function index(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        // Nếu có phân trang (dùng cho trang quản lý Menu)
        if ($request->has('page') || $request->has('limit')) {
            $limit = (int)$request->input('limit', 10);
            
            $query = Product::where('store_owner_address', $storeOwner)
                ->with(['categories', 'variants', 'recipes.ingredient', 'recipes.variant'])
                ->orderBy('id', 'desc');

            // Lọc theo loại sản phẩm (product hoặc ingredient)
            if ($request->has('type') && !empty($request->type)) {
                $query->where('type', $request->type);
            }

            // Lọc theo từ khóa tìm kiếm nếu có
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            }

            // Lọc theo danh mục nếu có
            if ($request->has('category') && $request->category !== 'Tất cả') {
                $category = $request->category;
                $query->whereHas('categories', function($q) use ($category) {
                    $q->where('name', $category);
                });
            }

            // Lọc theo trạng thái bật/tắt (Đang bán/Ngừng bán)
            if ($request->has('status') && $request->status !== 'all') {
                $status = $request->status === 'active' ? 1 : 0;
                $query->where('status', $status);
            }

            // Lọc theo khoảng giá sản phẩm chính
            if ($request->has('min_price') && $request->min_price !== null && $request->min_price !== '') {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price') && $request->max_price !== null && $request->max_price !== '') {
                $query->where('price', '<=', $request->max_price);
            }

            // Lọc theo khoảng giá biến thể sản phẩm
            if (($request->has('min_variant_price') && $request->min_variant_price !== null && $request->min_variant_price !== '') ||
                ($request->has('max_variant_price') && $request->max_variant_price !== null && $request->max_variant_price !== '')) {
                $query->whereHas('variants', function($q) use ($request) {
                    if ($request->has('min_variant_price') && $request->min_variant_price !== null && $request->min_variant_price !== '') {
                        $q->where('price', '>=', $request->min_variant_price);
                    }
                    if ($request->has('max_variant_price') && $request->max_variant_price !== null && $request->max_variant_price !== '') {
                        $q->where('price', '<=', $request->max_variant_price);
                    }
                });
            }

            $paginated = $query->paginate($limit);
            $paginated->getCollection()->transform(function($product) {
                if (isset($product->image)) {
                    $product->image = Product::normalizeImageUrl($product->image);
                }
                return $product;
            });
            return response()->json($paginated);
        }

        // Mặc định cho POS/Storefront: Trả về toàn bộ danh sách dùng cache
        $products = \Illuminate\Support\Facades\Cache::remember("store_products_all:{$storeOwner}", 86400, function () use ($storeOwner) {
            return Product::where('store_owner_address', $storeOwner)
                ->with(['categories', 'variants', 'recipes.ingredient', 'recipes.variant'])
                ->orderBy('id', 'desc')
                ->get()
                ->toArray();
        });

        $collection = collect($products);

        // Lọc theo loại sản phẩm (product hoặc ingredient)
        if ($request->has('type') && !empty($request->type)) {
            $type = $request->type;
            $collection = $collection->filter(function ($p) use ($type) {
                return ($p['type'] ?? 'product') === $type;
            });
        }

        // Lọc theo từ khóa tìm kiếm nếu có
        if ($request->has('search') && !empty($request->search)) {
            $search = strtolower($request->search);
            $collection = $collection->filter(function ($p) use ($search) {
                $name = strtolower($p['name'] ?? '');
                $sku = strtolower($p['sku'] ?? '');
                return str_contains($name, $search) || str_contains($sku, $search);
            });
        }

        // Lọc theo danh mục nếu có
        if ($request->has('category') && $request->category !== 'Tất cả') {
            $category = $request->category;
            $collection = $collection->filter(function ($p) use ($category) {
                return collect($p['categories'] ?? [])->contains('name', $category);
            });
        }

        $productsArray = $collection->values()->all();
        foreach ($productsArray as &$p) {
            if (isset($p['image'])) {
                $p['image'] = Product::normalizeImageUrl($p['image']);
            }
        }
        return response()->json($productsArray);
    }

    /**
     * Thêm món mới
     */
    public function store(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:product,ingredient',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
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
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.status' => 'nullable|boolean',
            'recipes' => 'nullable|array',
            'recipes.*.ingredient_id' => 'required|exists:products,id',
            'recipes.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'recipes.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'] ?? null,
            'barcode' => $validated['barcode'] ?? null,
            'unit' => $validated['unit'] ?? 'Cái',
            'type' => $validated['type'] ?? 'product',
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
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
                    'cost_price' => $var['cost_price'] ?? null,
                    'status' => $var['status'] ?? true,
                ]);
            }
        }

        // Lưu định lượng nguyên vật liệu nếu có
        if ($product->type === 'product' && $request->has('recipes') && is_array($request->recipes)) {
            foreach ($request->recipes as $recipeData) {
                \App\Domain\Entities\Recipe::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $recipeData['product_variant_id'] ?? null,
                    'ingredient_id' => $recipeData['ingredient_id'],
                    'quantity' => $recipeData['quantity'],
                    'store_owner_address' => $storeOwner,
                ]);
            }
        }

        $product->load(['categories', 'variants', 'recipes.ingredient', 'recipes.variant']);
        $product->image = Product::normalizeImageUrl($product->image);

        // Giải phóng cache storefront
        \App\Domain\Entities\Setting::clearStorefrontCache($storeOwner);

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $product = Product::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:product,ingredient',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
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
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.status' => 'required|boolean',
            'recipes' => 'nullable|array',
            'recipes.*.ingredient_id' => 'required|exists:products,id',
            'recipes.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'recipes.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $product->update([
            'name' => $validated['name'],
            'sku' => $validated['sku'] ?? $product->sku,
            'barcode' => $validated['barcode'] ?? null,
            'unit' => $validated['unit'] ?? 'Cái',
            'type' => $validated['type'] ?? $product->type,
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
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
                        'cost_price' => $var['cost_price'] ?? null,
                        'status' => $var['status'],
                    ]);
                } else {
                    $product->variants()->create([
                        'variant_name' => $var['variant_name'],
                        'price' => $var['price'],
                        'cost_price' => $var['cost_price'] ?? null,
                        'status' => $var['status'] ?? true,
                    ]);
                }
            }
        }

        // Đồng bộ định lượng nguyên vật liệu
        if ($request->has('recipes')) {
            $product->recipes()->delete();
            if (($validated['type'] ?? $product->type) === 'product' && is_array($request->recipes)) {
                foreach ($request->recipes as $recipeData) {
                    \App\Domain\Entities\Recipe::create([
                        'product_id' => $product->id,
                        'product_variant_id' => $recipeData['product_variant_id'] ?? null,
                        'ingredient_id' => $recipeData['ingredient_id'],
                        'quantity' => $recipeData['quantity'],
                        'store_owner_address' => $storeOwner,
                    ]);
                }
            }
        }

        $product->load(['categories', 'variants', 'recipes.ingredient', 'recipes.variant']);
        $product->image = Product::normalizeImageUrl($product->image);

        // Giải phóng cache storefront
        \App\Domain\Entities\Setting::clearStorefrontCache($storeOwner);

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $product = Product::where('store_owner_address', $storeOwner)->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product does not exist or has already been deleted.'
            ], 404);
        }

        try {
            // Thực hiện xóa sản phẩm
            $product->delete();

            // Giải phóng cache storefront
            \App\Domain\Entities\Setting::clearStorefrontCache($storeOwner);

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

    /**
     * Tải lên và tối ưu hóa hình ảnh sản phẩm
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $storeOwner = $request->user()->getStoreOwnerAddress();

        try {
            $file = $request->file('image');
            $urlPath = $this->processAndCompressImage($file, $storeOwner);
            $fullUrl = Product::normalizeImageUrl($urlPath);

            return response()->json([
                'message' => 'Image uploaded and optimized successfully.',
                'url' => $fullUrl
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Xử lý và nén ảnh bằng PHP GD và lưu qua Laravel Storage public disk
     */
    private function processAndCompressImage($file, $storeOwner)
    {
        // Chuẩn hóa tên thư mục ví chủ quán: loại bỏ 0x và chuyển thành chữ thường
        $cleanWallet = strtolower(preg_replace('/^0x/i', '', $storeOwner));
        $relativeDir = 'products/' . $cleanWallet;

        // Lấy đường dẫn vật lý tuyệt đối thông qua Laravel Storage (tự động tương thích local & production)
        $targetDir = \Illuminate\Support\Facades\Storage::disk('public')->path($relativeDir);

        if (!\File::exists($targetDir)) {
            \File::makeDirectory($targetDir, 0755, true, true);
        }

        // Đặt tên file theo timestamp + chuỗi ngẫu nhiên ngắn
        $fileName = time() . '_' . \Illuminate\Support\Str::random(8) . '.webp';
        $destinationPath = $targetDir . '/' . $fileName;

        $mime = $file->getMimeType();
        $image = null;

        // Đọc ảnh dựa theo mime type
        try {
            if ($mime === 'image/jpeg' || $mime === 'image/jpg') {
                $image = @imagecreatefromjpeg($file->getRealPath());
            } elseif ($mime === 'image/png') {
                $image = @imagecreatefrompng($file->getRealPath());
            } elseif ($mime === 'image/webp') {
                $image = @imagecreatefromwebp($file->getRealPath());
            } elseif ($mime === 'image/gif') {
                $image = @imagecreatefromgif($file->getRealPath());
            }
        } catch (\Exception $e) {
            $image = null;
        }

        // Fallback: Nếu không tạo được ảnh bằng GD (thiếu extension hoặc file lỗi), lưu file gốc trực tiếp
        if (!$image) {
            if ($file->getSize() > 1024 * 1024) { // Lớn hơn 1MB
                throw new \Exception('Image size exceeds 1MB limit.');
            }

            $fileName = time() . '_' . \Illuminate\Support\Str::random(8) . '.' . $file->getClientOriginalExtension();
            $destinationPath = $targetDir . '/' . $fileName;
            $file->move($targetDir, $fileName);

            return \Illuminate\Support\Facades\Storage::disk('public')->url($relativeDir . '/' . $fileName);
        }

        // Resize ảnh nếu chiều rộng hoặc chiều cao vượt quá 800px
        $width = imagesx($image);
        $height = imagesy($image);
        $maxDim = 800;

        if ($width > $maxDim || $height > $maxDim) {
            $ratio = $width / $height;
            if ($ratio > 1) {
                $newWidth = $maxDim;
                $newHeight = (int)round($maxDim / $ratio);
            } else {
                $newHeight = $maxDim;
                $newWidth = (int)round($maxDim * $ratio);
            }

            // Tạo ảnh mới và copy
            $resizedImage = imagecreatetruecolor($newWidth, $newHeight);

            // Giữ độ trong suốt (alpha channel) cho PNG/WebP
            imagealphablending($resizedImage, false);
            imagesavealpha($resizedImage, true);

            imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resizedImage;
        }

        // Lưu ảnh dạng WebP chất lượng 75%
        $saved = false;
        if (function_exists('imagewebp')) {
            $saved = @imagewebp($image, $destinationPath, 75);
        }

        // Fallback sang JPEG nếu không hỗ trợ WebP
        if (!$saved) {
            $fileName = time() . '_' . \Illuminate\Support\Str::random(8) . '.jpg';
            $destinationPath = $targetDir . '/' . $fileName;
            $saved = @imagejpeg($image, $destinationPath, 75);
        }

        imagedestroy($image);

        if (!$saved) {
            throw new \Exception('Failed to process and save image.');
        }

        // Kiểm tra kích thước file sau khi nén
        $fileSize = filesize($destinationPath);
        if ($fileSize > 1024 * 1024) { // Lớn hơn 1MB
            @unlink($destinationPath);
            throw new \Exception('Compressed image size exceeds 1MB limit.');
        }

        return \Illuminate\Support\Facades\Storage::disk('public')->url($relativeDir . '/' . $fileName);
    }
}
