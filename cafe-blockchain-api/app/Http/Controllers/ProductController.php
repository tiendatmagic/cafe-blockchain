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
            'tax_rate' => 'nullable|numeric|min:-1|max:100',
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
            'tax_rate' => isset($validated['tax_rate']) ? ($validated['tax_rate'] !== null && $validated['tax_rate'] !== '' ? (float)$validated['tax_rate'] : null) : null,
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
            'tax_rate' => 'nullable|numeric|min:-1|max:100',
        ]);

        $oldImage = $product->image;

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
            'tax_rate' => isset($validated['tax_rate']) ? ($validated['tax_rate'] !== null && $validated['tax_rate'] !== '' ? (float)$validated['tax_rate'] : null) : null,
        ]);

        $newImage = $product->image;
        if ($oldImage && $oldImage !== $newImage) {
            $this->deleteImageFileIfOrphaned($oldImage, $storeOwner);
        }

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

    /**
     * Xóa tệp tin hình ảnh cũ trên server nếu không còn sản phẩm nào dùng chung
     */
    private function deleteImageFileIfOrphaned($imageUrl, $storeOwner)
    {
        if (!$imageUrl) {
            return;
        }

        // Kiểm tra xem ảnh có nằm trong thư mục products/ hay không
        if (!str_contains($imageUrl, '/products/')) {
            return;
        }

        // Tách đường dẫn tương đối của file đối với ổ đĩa public
        $parts = explode('/products/', $imageUrl);
        if (count($parts) < 2) {
            return;
        }
        
        $cleanWallet = strtolower(preg_replace('/^0x/i', '', $storeOwner));
        $relativeFilePath = 'products/' . ltrim($parts[1], '/');

        // Đảm bảo file này thuộc thư mục của ví chủ quán hiện tại để tránh lỗi bảo mật xóa chéo
        if (!str_starts_with($relativeFilePath, 'products/' . $cleanWallet . '/')) {
            return;
        }

        // Kiểm tra xem có sản phẩm nào khác trong DB đang sử dụng chung ảnh này không
        $isUsed = Product::where('image', 'like', '%' . $relativeFilePath)->exists();
        if ($isUsed) {
            return;
        }

        // Tiến hành xóa file
        try {
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($relativeFilePath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($relativeFilePath);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('[ProductController] Failed to delete orphaned image: ' . $e->getMessage());
        }
    }

    /**
     * Import sản phẩm/món ăn từ file Excel
     */
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xls,xlsx'
        ]);

        $filePath = $request->file('file')->getRealPath();
        
        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi đọc tệp Excel: ' . $e->getMessage()], 400);
        }

        if (count($rows) < 2) {
            return response()->json(['message' => 'Tệp Excel rỗng hoặc không có dữ liệu.'], 400);
        }

        $header = $rows[1];
        $colMap = [
            'name' => null,
            'sku' => null,
            'barcode' => null,
            'unit' => null,
            'price' => null,
            'cost_price' => null,
            'image' => null,
            'short_description' => null,
            'description' => null,
            'category' => null,
            'status' => null,
        ];

        foreach ($header as $colKey => $colValue) {
            $val = trim(strtolower($colValue));
            if (empty($val)) continue;
            
            if (in_array($val, ['tên sản phẩm', 'tên hàng', 'tên món', 'tên', 'name', 'tên sản phẩm (*)'])) {
                $colMap['name'] = $colKey;
            } elseif (in_array($val, ['mã sản phẩm', 'mã hàng', 'sku', 'mã sản phẩm (sku)'])) {
                $colMap['sku'] = $colKey;
            } elseif (in_array($val, ['mã vạch', 'barcode', 'mã vạch (barcode)'])) {
                $colMap['barcode'] = $colKey;
            } elseif (in_array($val, ['đơn vị tính', 'đvt', 'đơn vị'])) {
                $colMap['unit'] = $colKey;
            } elseif (in_array($val, ['giá bán', 'giá bán lẻ', 'đơn giá', 'price', 'giá bán (*)'])) {
                $colMap['price'] = $colKey;
            } elseif (in_array($val, ['giá vốn', 'cost_price'])) {
                $colMap['cost_price'] = $colKey;
            } elseif (in_array($val, ['hình ảnh', 'link hình ảnh', 'image', 'hình ảnh (url1,url2...)'])) {
                $colMap['image'] = $colKey;
            } elseif (in_array($val, ['mô tả ngắn', 'short_description'])) {
                $colMap['short_description'] = $colKey;
            } elseif (in_array($val, ['mô tả', 'mô tả chi tiết', 'description'])) {
                $colMap['description'] = $colKey;
            } elseif (in_array($val, ['danh mục', 'nhóm hàng', 'nhóm hàng(3 cấp)', 'category'])) {
                $colMap['category'] = $colKey;
            } elseif (in_array($val, ['trạng thái', 'đang kinh doanh', 'status', 'trạng thái (1: đang bán, 0: ngừng bán)'])) {
                $colMap['status'] = $colKey;
            }
        }

        if (empty($colMap['name']) || empty($colMap['price'])) {
            return response()->json([
                'message' => 'Cấu trúc file Excel không hợp lệ. Cột "Tên sản phẩm" và "Giá bán" là bắt buộc.'
            ], 400);
        }

        $successCount = 0;
        $errorCount = 0;
        $errors = [];
        $storeOwner = $request->user()->getStoreOwnerAddress();

        // Lấy giới hạn sản phẩm của gói cước
        $maxProducts = -1;
        try {
            $maxProducts = $request->user()->getFeatureLimit('max_products');
        } catch (\Exception $e) {}

        // Đếm số sản phẩm hiện tại của shop
        $currentProductsCount = Product::where('store_owner_address', $storeOwner)->count();

        // Duyệt dữ liệu
        for ($rowIdx = 2; $rowIdx <= count($rows); $rowIdx++) {
            $row = $rows[$rowIdx];
            
            // Bỏ qua dòng rỗng
            $isRowEmpty = true;
            foreach ($row as $cell) {
                if ($cell !== null && trim((string)$cell) !== '') {
                    $isRowEmpty = false;
                    break;
                }
            }
            if ($isRowEmpty) continue;

            $name = $colMap['name'] ? trim((string)($row[$colMap['name']] ?? '')) : '';
            $priceVal = $colMap['price'] ? trim((string)($row[$colMap['price']] ?? '')) : '';
            
            $rowErrors = [];
            if (empty($name)) {
                $rowErrors[] = 'Tên sản phẩm không được để trống.';
            }
            
            $price = 0;
            if ($priceVal === '') {
                $rowErrors[] = 'Giá bán không được để trống.';
            } else {
                $priceClean = str_replace([',', ' '], '', $priceVal);
                if (!is_numeric($priceClean) || floatval($priceClean) < 0) {
                    $rowErrors[] = 'Giá bán phải là số lớn hơn hoặc bằng 0.';
                } else {
                    $price = floatval($priceClean);
                }
            }

            $costPrice = null;
            if ($colMap['cost_price']) {
                $costPriceVal = trim((string)($row[$colMap['cost_price']] ?? ''));
                if ($costPriceVal !== '') {
                    $costPriceClean = str_replace([',', ' '], '', $costPriceVal);
                    if (!is_numeric($costPriceClean) || floatval($costPriceClean) < 0) {
                        $rowErrors[] = 'Giá vốn phải là số lớn hơn hoặc bằng 0.';
                    } else {
                        $costPrice = floatval($costPriceClean);
                    }
                }
            }

            if (!empty($rowErrors)) {
                $errorCount++;
                $errors[] = [
                    'row' => $rowIdx,
                    'product_name' => $name ?: '(Chưa có tên)',
                    'reasons' => $rowErrors
                ];
                continue;
            }

            // Các cột khác
            $sku = $colMap['sku'] ? trim((string)($row[$colMap['sku']] ?? '')) : '';
            $barcode = $colMap['barcode'] ? trim((string)($row[$colMap['barcode']] ?? '')) : '';
            $unit = $colMap['unit'] ? trim((string)($row[$colMap['unit']] ?? '')) : 'Cái';
            if (empty($unit)) $unit = 'Cái';
            
            $imageUrl = $colMap['image'] ? trim((string)($row[$colMap['image']] ?? '')) : null;
            if (!empty($imageUrl)) {
                $urls = explode(',', $imageUrl);
                $imageUrl = trim($urls[0]);
            }

            $shortDesc = $colMap['short_description'] ? trim((string)($row[$colMap['short_description']] ?? '')) : null;
            $desc = $colMap['description'] ? trim((string)($row[$colMap['description']] ?? '')) : null;
            
            $status = true;
            if ($colMap['status']) {
                $statusVal = trim((string)($row[$colMap['status']] ?? ''));
                if ($statusVal !== '') {
                    if (in_array(strtolower($statusVal), ['0', 'ngừng bán', 'no', 'false', 'inactive', 'không'])) {
                        $status = false;
                    }
                }
            }

            $categoryName = $colMap['category'] ? trim((string)($row[$colMap['category']] ?? '')) : '';
            if (!empty($categoryName) && (str_contains($categoryName, '>>') || str_contains($categoryName, '>'))) {
                $delimiter = str_contains($categoryName, '>>') ? '>>' : '>';
                $parts = explode($delimiter, $categoryName);
                $categoryName = trim(end($parts));
            }

            \DB::beginTransaction();
            try {
                $product = null;
                if (!empty($sku)) {
                    $product = Product::withTrashed()
                        ->where('store_owner_address', $storeOwner)
                        ->where('sku', $sku)
                        ->first();
                }

                if ($product) {
                    if ($product->trashed()) {
                        $product->restore();
                    }
                    $product->update([
                        'name' => $name,
                        'barcode' => $barcode ?: $product->barcode,
                        'unit' => $unit,
                        'price' => $price,
                        'cost_price' => $costPrice !== null ? $costPrice : $product->cost_price,
                        'image' => $imageUrl ?: $product->image,
                        'status' => $status,
                        'short_description' => $shortDesc ?: $product->short_description,
                        'description' => $desc ?: $product->description,
                    ]);
                } else {
                    if ($maxProducts >= 0 && ($currentProductsCount + $successCount) >= $maxProducts) {
                        \DB::rollBack();
                        $errorCount++;
                        $errors[] = [
                            'row' => $rowIdx,
                            'product_name' => $name,
                            'reasons' => ['Đã vượt quá giới hạn số lượng sản phẩm tối đa của gói cước (' . $maxProducts . ' món).']
                        ];
                        continue;
                    }

                    $product = Product::create([
                        'store_owner_address' => $storeOwner,
                        'sku' => $sku ?: null,
                        'barcode' => $barcode ?: null,
                        'unit' => $unit,
                        'type' => 'product',
                        'name' => $name,
                        'price' => $price,
                        'cost_price' => $costPrice,
                        'image' => $imageUrl ?: null,
                        'status' => $status,
                        'short_description' => $shortDesc,
                        'description' => $desc,
                    ]);
                }

                if (!empty($categoryName)) {
                    $category = \App\Domain\Entities\Category::firstOrCreate([
                        'name' => $categoryName,
                        'store_owner_address' => $storeOwner
                    ]);
                    $product->categories()->sync([$category->id]);
                }

                \DB::commit();
                $successCount++;
            } catch (\Exception $e) {
                \DB::rollBack();
                $errorCount++;
                $errors[] = [
                    'row' => $rowIdx,
                    'product_name' => $name,
                    'reasons' => ['Lỗi hệ thống khi lưu database: ' . $e->getMessage()]
                ];
            }
        }

        \App\Domain\Entities\Setting::clearStorefrontCache($storeOwner);
        \Illuminate\Support\Facades\Cache::forget("store_products_all:{$storeOwner}");

        return response()->json([
            'message' => 'Import hoàn tất.',
            'success_count' => $successCount,
            'error_count' => $errorCount,
            'errors' => $errors
        ], 200);
    }

    /**
     * Tải file excel mẫu cho import sản phẩm
     */
    public function downloadTemplate()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');
        
        $headers = [
            'Mã sản phẩm (SKU)',
            'Mã vạch (Barcode)',
            'Tên sản phẩm (*)',
            'Danh mục',
            'Đơn vị tính',
            'Giá bán (*)',
            'Giá vốn',
            'Link hình ảnh',
            'Mô tả ngắn',
            'Mô tả',
            'Trạng thái (1: Đang bán, 0: Ngừng bán)'
        ];
        
        $sheet->fromArray($headers, null, 'A1');
        
        $sampleData = [
            [
                'SP001',
                '8936079381394',
                'Cà phê sữa đá',
                'Cà phê',
                'Ly',
                29000,
                12000,
                'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300',
                'Cà phê sữa đá pha phin truyền thống',
                'Cà phê sữa đá pha phin đậm vị, sử dụng sữa đặc chất lượng cao và đá tinh khiết.',
                1
            ],
            [
                'SP002',
                '',
                'Trà đào cam sả',
                'Trà trái cây',
                'Ly',
                39000,
                15000,
                '',
                'Trà đào sả cam giải nhiệt mùa hè',
                'Hương vị thanh mát kết hợp từ cam tươi, sả thơm nồng và đào lát giòn ngọt.',
                1
            ]
        ];
        
        $sheet->fromArray($sampleData, null, 'A2');
        
        // Auto-fit các cột
        foreach (range('A', 'K') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        
        $response = new \Symfony\Component\HttpFoundation\StreamedResponse(function() use ($writer) {
            $writer->save('php://output');
        });
        
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment; filename="cafe_blockchain_product_template.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');
        
        return $response;
    }
}
