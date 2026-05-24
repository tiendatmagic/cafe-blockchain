<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tạo tài khoản User thử nghiệm
        User::factory()->create([
            'name' => 'Thu ngân Cafe Web3',
            'email' => 'cashier@cafe.web3',
            'password' => bcrypt('password'),
        ]);

        // 2. Tạo cấu hình quán và blockchain mặc định
        \App\Models\Setting::set('store_name', 'Blockchain Cafe & Bistro');
        \App\Models\Setting::set('contract_address', '0xc294C4f1C313e6BA70845a7b8e5c46e01a075304');
        \App\Models\Setting::set('rpc_url', 'https://ethereum-sepolia.publicnode.com');
        \App\Models\Setting::set('chain_id', '11155111'); // Sepolia Chain ID
        \App\Models\Setting::set('explorer_url', 'https://sepolia.etherscan.io');
        \App\Models\Setting::set('primary_color', '#7c3aed'); // Màu tím chính mặc định
        \App\Models\Setting::set('secondary_color', '#c084fc'); // Màu tím phụ mặc định

        // 3. Tạo danh sách món ăn / đồ uống mẫu
        $products = [
            // Cà phê
            [
                'name' => 'Cà Phê Sữa Đá',
                'price' => 29000,
                'category' => 'Cà phê',
                'image' => 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Cà phê Robusta đậm đà kết hợp sữa đặc hảo hạng và đá mát lạnh.',
                'description' => 'Món uống quốc dân mang đậm hương vị truyền thống Việt Nam. Sử dụng hạt cà phê Robusta tuyển chọn từ Buôn Ma Thuột, được rang xay nguyên chất, mang lại hương vị đắng thanh nồng nàn quyện cùng vị béo ngậy ngọt ngào của sữa đặc và đá viên tinh khiết.',
            ],
            [
                'name' => 'Bạc Xỉu Sài Gòn',
                'price' => 32000,
                'category' => 'Cà phê',
                'image' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Hương vị cà phê nhẹ nhàng hòa quyện cùng nhiều sữa tươi béo ngậy.',
                'description' => 'Món nước cổ điển đặc trưng của Sài Gòn xưa. Dành cho những ai yêu thích vị béo ngậy của sữa tươi nhưng vẫn muốn cảm nhận một chút nhấn nhá thơm nồng, quyến rũ từ hương vị espresso Robusta nguyên bản.',
            ],
            [
                'name' => 'Espresso Đậm Vị',
                'price' => 25000,
                'category' => 'Cà phê',
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Tách espresso Robusta/Arabica nguyên chất chiết xuất áp suất cao.',
                'description' => 'Một shot cà phê đậm đặc được chiết xuất dưới áp suất tiêu chuẩn từ máy pha hiện đại. Lớp crema vàng óng ả dày dặn, hương thơm lôi cuốn nồng nàn và hậu vị đắng ngọt kéo dài khó quên.',
            ],
            [
                'name' => 'Cappuccino Nghệ Thuật',
                'price' => 45000,
                'category' => 'Cà phê',
                'image' => 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Cà phê espresso sánh mịn kết hợp lớp bọt sữa mịn màng vẽ nghệ thuật.',
                'description' => 'Sự kết hợp hoàn hảo giữa hương vị espresso hảo hạng và lớp sữa tươi được đánh bọt mịn màng như nhung. Phía trên được tạo hình nghệ thuật Latte Art tinh xảo bởi những barista chuyên nghiệp của quán.',
            ],
            // Trà trái cây
            [
                'name' => 'Trà Đào Cam Sả',
                'price' => 39000,
                'category' => 'Trà trái cây',
                'image' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Trà đào thanh mát quyện cùng cam vàng tươi và hương sả thơm nồng.',
                'description' => 'Thức uống giải nhiệt tuyệt vời cho ngày hè. Sự kết hợp hài hòa giữa vị chát nhẹ của trà đen, vị ngọt thơm của đào miếng chín mọng, vị chua thanh của cam vàng và hương sả tươi ấm áp dễ chịu.',
            ],
            [
                'name' => 'Trà Vải Sen Thơm',
                'price' => 39000,
                'category' => 'Trà trái cây',
                'image' => 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Sự kết hợp tao nhã giữa trà lài thơm ngát, hạt sen bùi béo và vải chín ngọt.',
                'description' => 'Một ly trà thanh mát mang đậm phong vị thanh tao. Hương trà lài thoang thoảng quyện cùng vị ngọt lịm của quả vải chín mọng và những hạt sen được ninh nhừ bùi béo, giàu dinh dưỡng.',
            ],
            [
                'name' => 'Trà Dâu Đông Du',
                'price' => 42000,
                'category' => 'Trà trái cây',
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Trà lài mát lạnh hòa quyện nước cốt dâu tây chua ngọt tự nhiên.',
                'description' => 'Món trà dâu nổi tiếng phố Đông Du nay đã có mặt tại quán. Trà nhài thanh tao lắc cùng dâu tây tươi nghiền nhuyễn, mang lại hương vị chua chua ngọt ngọt kích thích vị giác cực đỉnh.',
            ],
            // Đá xay & Sinh tố
            [
                'name' => 'Matcha Đá Xay',
                'price' => 49000,
                'category' => 'Đá xay',
                'image' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Matcha Nhật Bản thượng hạng xay mịn cùng sữa và kem tươi béo ngậy.',
                'description' => 'Món uống đá xay trứ danh dành cho tín đồ Matcha. Sử dụng bột trà xanh Uji Matcha Nhật Bản nguyên chất, xay nhuyễn cùng sữa tươi béo ngậy, phía trên phủ lớp kem whip cream mịn màng ngọt ngào.',
            ],
            [
                'name' => 'Sinh Tố Bơ Sáp',
                'price' => 45000,
                'category' => 'Sinh tố',
                'image' => 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Trái bơ sáp Đắk Lắk dẻo thơm xay cùng sữa tươi và đá nhuyễn mịn.',
                'description' => 'Sinh tố bơ dẻo mịn béo ngậy từ những quả bơ sáp chín cây vùng đất đỏ Đắk Lắk. Được xay cùng sữa tươi và sữa đặc tạo nên thức uống sánh mịn, giàu vitamin và vô cùng bổ dưỡng.',
            ],
            // Bánh ngọt
            [
                'name' => 'Bánh Croissant Bơ Tỏi',
                'price' => 35000,
                'category' => 'Bánh ngọt',
                'image' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Bánh sừng bò ngàn lớp thơm phức bơ Pháp rưới sốt bơ tỏi thơm lừng.',
                'description' => 'Chiếc bánh sừng bò giòn tan với hàng trăm lớp bột xếp chồng lên nhau theo công thức Pháp truyền thống. Bánh được nướng nóng hổi, thơm phức mùi bơ nhạt cao cấp kết hợp sốt tỏi phi lừng danh.',
            ],
            [
                'name' => 'Tiramisu Cổ Điển',
                'price' => 45000,
                'category' => 'Bánh ngọt',
                'image' => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'status' => true,
                'short_description' => 'Bánh Tiramisu Ý mềm mịn thơm thoang thoảng rượu rum và cà phê.',
                'description' => 'Món tráng miệng lừng danh đến từ nước Ý. Lớp kem Mascarpone béo ngậy xen kẽ các lớp bánh quy Ladyfingers thấm đẫm hương vị cà phê espresso đậm đặc và rượu rum nồng nàn, phủ ngoài bột cacao đắng nhẹ.',
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::create($product);
        }
    }
}
