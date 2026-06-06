<?php

namespace Database\Seeders;

use App\Domain\Entities\Category;
use App\Domain\Entities\Product;
use App\Domain\Entities\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductAddSeeder extends Seeder
{
    public function run(): void
    {
        $walletAddress = '0x75ad18ef47eda21baff837cac0f1563d0c355555';

        // 1. Đảm bảo các danh mục bổ sung tồn tại
        $categories = [
            'Cà phê', 'Trà trái cây', 'Đá xay', 'Sinh tố', 'Bánh ngọt', 'Món ăn', 'Món mới', 'Bán chạy',
            'Trà sữa ô long', 'Soda Ý sảng khoái', 'Kem Gelato Ý', 'Đồ ăn nhanh'
        ];
        
        $categoryModels = [];
        foreach ($categories as $catName) {
            $category = Category::where('name', $catName)->first();
            if ($category) {
                $category->update(['store_owner_address' => strtolower($walletAddress)]);
                $categoryModels[$catName] = $category;
            } else {
                $categoryModels[$catName] = Category::create([
                    'name' => $catName,
                    'store_owner_address' => strtolower($walletAddress)
                ]);
            }
        }

        // Khai báo kho từ vựng và hình ảnh để sinh 100 sản phẩm ngẫu nhiên có cấu trúc cao
        $images = [
            'coffee' => [
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60'
            ],
            'tea' => [
                'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60'
            ],
            'ice_blended' => [
                'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60'
            ],
            'soda' => [
                'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60'
            ],
            'cake' => [
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60'
            ],
            'gelato' => [
                'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60'
            ],
            'food' => [
                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60'
            ]
        ];

        $productBlueprints = [
            // Nhóm Cà phê
            ['cat' => ['Cà phê'], 'type' => 'coffee', 'name' => 'Cà Phê Cold Brew Nitro', 'price' => 45000, 'desc' => 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.'],
            ['cat' => ['Cà phê', 'Món mới'], 'type' => 'coffee', 'name' => 'Cà Phê Latte Hạt Dẻ', 'price' => 49000, 'desc' => 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.'],
            ['cat' => ['Cà phê'], 'type' => 'coffee', 'name' => 'Caramel Macchiato Nóng', 'price' => 49000, 'desc' => 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.'],
            ['cat' => ['Cà phê', 'Bán chạy'], 'type' => 'coffee', 'name' => 'Cà Phê Cốt Dừa Đá Xay', 'price' => 42000, 'desc' => 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.'],
            ['cat' => ['Cà phê'], 'type' => 'coffee', 'name' => 'Flat White Thượng Hạng', 'price' => 45000, 'desc' => 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.'],
            ['cat' => ['Cà phê'], 'type' => 'coffee', 'name' => 'Cà Phê Mocha Đá', 'price' => 49000, 'desc' => 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.'],

            // Nhóm Trà & Trà Sữa
            ['cat' => ['Trà trái cây'], 'type' => 'tea', 'name' => 'Trà Nhài Thạch Đác Dẻo', 'price' => 39000, 'desc' => 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.'],
            ['cat' => ['Trà trái cây', 'Bán chạy'], 'type' => 'tea', 'name' => 'Trà Ô Long Dưa Lưới', 'price' => 42000, 'desc' => 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.'],
            ['cat' => ['Trà sữa ô long', 'Bán chạy'], 'type' => 'tea', 'name' => 'Trà Sữa Ô Long Trân Châu', 'price' => 45000, 'desc' => 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.'],
            ['cat' => ['Trà sữa ô long', 'Món mới'], 'type' => 'tea', 'name' => 'Trà Sữa Matcha Đậu Đỏ', 'price' => 49000, 'desc' => 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.'],

            // Nhóm Soda & Đá Xay
            ['cat' => ['Soda Ý sảng khoái', 'Món mới'], 'type' => 'soda', 'name' => 'Soda Việt Quất Xanh', 'price' => 35000, 'desc' => 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.'],
            ['cat' => ['Soda Ý sảng khoái'], 'type' => 'soda', 'name' => 'Soda Blue Ocean', 'price' => 35000, 'desc' => 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.'],
            ['cat' => ['Đá xay', 'Bán chạy'], 'type' => 'ice_blended', 'name' => 'Chocolate Cookie Đá Xay', 'price' => 49000, 'desc' => 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.'],
            ['cat' => ['Sinh tố'], 'type' => 'ice_blended', 'name' => 'Sinh Tố Việt Quất Dâu Tây', 'price' => 45000, 'desc' => 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.'],

            // Nhóm Kem Gelato
            ['cat' => ['Kem Gelato Ý', 'Món mới'], 'type' => 'gelato', 'name' => 'Kem Gelato Vani Bourbon', 'price' => 39000, 'desc' => 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.'],
            ['cat' => ['Kem Gelato Ý', 'Bán chạy'], 'type' => 'gelato', 'name' => 'Kem Gelato Matcha Uji', 'price' => 39000, 'desc' => 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.'],
            ['cat' => ['Kem Gelato Ý'], 'type' => 'gelato', 'name' => 'Kem Gelato Chocolate Bỉ', 'price' => 39000, 'desc' => 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.'],

            // Nhóm Bánh ngọt
            ['cat' => ['Bánh ngọt'], 'type' => 'cake', 'name' => 'Bánh Red Velvet Kiêu Kỳ', 'price' => 45000, 'desc' => 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.'],
            ['cat' => ['Bánh ngọt'], 'type' => 'cake', 'name' => 'Bánh Cheesecake Chanh Dây', 'price' => 45000, 'desc' => 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.'],
            ['cat' => ['Bánh ngọt', 'Món mới'], 'type' => 'cake', 'name' => 'Bánh Croissant Trứng Muối', 'price' => 39000, 'desc' => 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.'],

            // Nhóm Món ăn & Đồ ăn nhanh
            ['cat' => ['Món ăn'], 'type' => 'food', 'name' => 'Mỳ Ý Sốt Kem Nấm', 'price' => 69000, 'desc' => 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.'],
            ['cat' => ['Đồ ăn nhanh', 'Bán chạy'], 'type' => 'food', 'name' => 'Hamburger Bò Phô Mai Double', 'price' => 79000, 'desc' => 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.'],
            ['cat' => ['Món ăn'], 'type' => 'food', 'name' => 'Sandwich Club Tam Giác', 'price' => 45000, 'desc' => 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.'],
            ['cat' => ['Đồ ăn nhanh'], 'type' => 'food', 'name' => 'Gà Rán Giòn Cay Giòn Rụm', 'price' => 49000, 'desc' => 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.'],
        ];

        // Dọn dẹp sạch sản phẩm cũ đã seed cho ví này (chỉ dọn các món do seeder tạo và chưa có đơn hàng nào tham chiếu)
        $oldProductIds = Product::where(function($q) use ($walletAddress) {
                $q->where('store_owner_address', strtolower($walletAddress))
                  ->orWhere('store_owner_address', $walletAddress);
            })
            ->where('sku', 'like', 'SP-%')
            ->whereNotIn('id', function($q) {
                $q->select('product_id')->from('order_items');
            })
            ->pluck('id');

        if ($oldProductIds->isNotEmpty()) {
            ProductVariant::whereIn('product_id', $oldProductIds)->delete();
            \Illuminate\Support\Facades\DB::table('category_product')
                ->whereIn('product_id', $oldProductIds)
                ->delete();
            Product::whereIn('id', $oldProductIds)->delete();
        }

        // Tiến hành sinh đủ 100 sản phẩm mới bằng cách nhân bản có biến thể
        $totalToCreate = 100;
        $createdCount = 0;
        $blueprintCount = count($productBlueprints);

        for ($i = 0; $i < $totalToCreate; $i++) {
            $bp = $productBlueprints[$i % $blueprintCount];
            $index = intval($i / $blueprintCount) + 1;
            
            // Tạo tên và sku độc nhất cho mỗi món
            $name = $bp['name'] . ' ' . $this->getRomanNumeral($index);
            $sku = 'SP-' . strtoupper(Str::random(6));
            
            // Lấy ảnh tương ứng
            $imgArray = $images[$bp['type']];
            $image = $imgArray[($i) % count($imgArray)];

            // Tạo sản phẩm mới
            $product = Product::create([
                'sku' => $sku,
                'name' => $name,
                'price' => $bp['price'],
                'image' => $image,
                'status' => true,
                'short_description' => $bp['desc'],
                'description' => $bp['desc'] . ' Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.',
                'store_owner_address' => strtolower($walletAddress)
            ]);

            // Gán danh mục
            $catIds = [];
            foreach ($bp['cat'] as $cName) {
                if (isset($categoryModels[$cName])) {
                    $catIds[] = $categoryModels[$cName]->id;
                }
            }
            $product->categories()->sync($catIds);

            // Cấu hình biến thể size cho khoảng 30% số sản phẩm đồ uống (nhóm coffee, tea, soda, ice_blended)
            $isDrink = in_array($bp['type'], ['coffee', 'tea', 'soda', 'ice_blended']);
            if ($isDrink && ($i % 3 === 0)) {
                // Tạo biến thể Size M (bằng giá chuẩn)
                ProductVariant::create([
                    'product_id' => $product->id,
                    'variant_name' => 'Size M',
                    'price' => $product->price,
                    'status' => true
                ]);

                // Tạo biến thể Size L (bằng giá chuẩn + 6,000đ hoặc 9,000đ)
                $extraPrice = ($i % 2 === 0) ? 6000 : 9000;
                ProductVariant::create([
                    'product_id' => $product->id,
                    'variant_name' => 'Size L',
                    'price' => $product->price + $extraPrice,
                    'status' => true
                ]);
            }

            $createdCount++;
        }

        $this->command->info("Da tao thanh cong {$createdCount} san pham mon an moi thuoc ve vi {$walletAddress}!");
    }

    private function getRomanNumeral(int $num): string
    {
        // Trả về hậu tố gọn gàng
        if ($num === 1) return 'Premium';
        if ($num === 2) return 'Signature';
        if ($num === 3) return 'Đặc Biệt';
        if ($num === 4) return 'Classic';
        if ($num === 5) return 'Royal';
        
        return 'Thượng Hạng';
    }
}
