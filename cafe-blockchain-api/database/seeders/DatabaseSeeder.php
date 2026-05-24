<?php
 
namespace Database\Seeders;
 
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
 
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
        Setting::set('store_name', 'Blockchain Cafe & Bistro');
        Setting::set('contract_address', '0xc294C4f1C313e6BA70845a7b8e5c46e01a075304');
        Setting::set('rpc_url', 'https://ethereum-sepolia.publicnode.com');
        Setting::set('chain_id', '11155111'); // Sepolia Chain ID
        Setting::set('explorer_url', 'https://sepolia.etherscan.io');
        Setting::set('primary_color', '#7c3aed'); // Màu tím chính mặc định
        Setting::set('secondary_color', '#c084fc'); // Màu tím phụ mặc định
 
        // 3. Tạo 8 danh mục động mặc định
        $categories = [
            'Cà phê',
            'Trà trái cây',
            'Đá xay',
            'Sinh tố',
            'Bánh ngọt',
            'Món ăn',
            'Món mới',
            'Bán chạy'
        ];
 
        $categoryModels = [];
        foreach ($categories as $catName) {
            $categoryModels[$catName] = Category::create(['name' => $catName]);
        }
 
        // 4. Tạo danh sách món ăn / đồ uống mẫu với liên kết Nhiều-Nhiều (categories array)
        $products = [
            [
                'name' => 'Cà Phê Sữa Đá',
                'price' => 29000,
                'categories' => ['Cà phê', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Cà phê Robusta đậm đà kết hợp sữa đặc hảo hạng và đá mát lạnh.',
                'description' => 'Món uống quốc dân mang đậm hương vị truyền thống Việt Nam. Sử dụng hạt cà phê Robusta tuyển chọn từ Buôn Ma Thuột, được rang xay nguyên chất, mang lại hương vị đắng thanh nồng nàn quyện cùng vị béo ngậy ngọt ngào của sữa đặc.',
            ],
            [
                'name' => 'Bạc Xỉu Sài Gòn',
                'price' => 32000,
                'categories' => ['Cà phê'],
                'image' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Hương vị cà phê nhẹ nhàng hòa quyện cùng nhiều sữa tươi béo ngậy.',
                'description' => 'Món nước cổ điển đặc trưng của Sài Gòn xưa. Dành cho những ai yêu thích vị béo ngậy của sữa tươi nhưng vẫn muốn cảm nhận một chút nhấn nhá thơm nồng, quyến rũ từ hương vị espresso Robusta nguyên bản.',
            ],
            [
                'name' => 'Espresso Đậm Vị',
                'price' => 25000,
                'categories' => ['Cà phê'],
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Tách espresso Robusta/Arabica nguyên chất chiết xuất áp suất cao.',
                'description' => 'Một shot cà phê đậm đặc được chiết xuất dưới áp suất tiêu chuẩn từ máy pha hiện đại. Lớp crema vàng óng ả dày dặn, hương thơm lôi cuốn nồng nàn.',
            ],
            [
                'name' => 'Cappuccino Nghệ Thuật',
                'price' => 45000,
                'categories' => ['Cà phê', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Cà phê espresso sánh mịn kết hợp lớp bọt sữa mịn màng vẽ nghệ thuật.',
                'description' => 'Sự kết hợp hoàn hảo giữa hương vị espresso hảo hạng và lớp sữa tươi được đánh bọt mịn màng như nhung. Phía trên được tạo hình nghệ thuật Latte Art tinh xảo.',
            ],
            [
                'name' => 'Trà Đào Cam Sả',
                'price' => 39000,
                'categories' => ['Trà trái cây', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Trà đào thanh mát quyện cùng cam vàng tươi và hương sả thơm nồng.',
                'description' => 'Thức uống giải nhiệt tuyệt vời cho ngày hè. Sự kết hợp hài hòa giữa vị chát nhẹ của trà đen, vị ngọt thơm của đào miếng chín mọng, vị chua thanh của cam vàng và hương sả tươi ấm áp.',
            ],
            [
                'name' => 'Trà Vải Sen Thơm',
                'price' => 39000,
                'categories' => ['Trà trái cây'],
                'image' => 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Sự kết hợp tao nhã giữa trà lài thơm ngát, hạt sen bùi béo và vải chín ngọt.',
                'description' => 'Một ly trà thanh mát mang đậm phong vị thanh tao. Hương trà lài thoang thoảng quyện cùng vị ngọt lịm của quả vải chín mọng và những hạt sen ninh nhừ bùi béo.',
            ],
            [
                'name' => 'Trà Dâu Đông Du',
                'price' => 42000,
                'categories' => ['Trà trái cây'],
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Trà lài mát lạnh hòa quyện nước cốt dâu tây chua ngọt tự nhiên.',
                'description' => 'Món trà dâu nổi tiếng phố Đông Du nay đã có mặt tại quán. Trà nhài thanh tao lắc cùng dâu tây tươi nghiền nhuyễn, mang lại hương vị chua chua ngọt ngọt.',
            ],
            [
                'name' => 'Matcha Đá Xay',
                'price' => 49000,
                'categories' => ['Đá xay', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Matcha Nhật Bản thượng hạng xay mịn cùng sữa và kem tươi béo ngậy.',
                'description' => 'Món uống đá xay trứ danh dành cho tín đồ Matcha. Sử dụng bột trà xanh Uji Matcha Nhật Bản nguyên chất, xay nhuyễn cùng sữa tươi béo ngậy, phía trên phủ lớp kem whip cream mịn màng.',
            ],
            [
                'name' => 'Sinh Tố Bơ Sáp',
                'price' => 45000,
                'categories' => ['Sinh tố'],
                'image' => 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Trái bơ sáp Đắk Lắk dẻo thơm xay cùng sữa tươi và đá nhuyễn mịn.',
                'description' => 'Sinh tố bơ dẻo mịn béo ngậy từ những quả bơ sáp chín cây vùng đất đỏ Đắk Lắk. Được xay cùng sữa tươi và sữa đặc tạo nên thức uống sánh mịn, giàu vitamin.',
            ],
            [
                'name' => 'Bánh Croissant Bơ Tỏi',
                'price' => 35000,
                'categories' => ['Bánh ngọt'],
                'image' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Bánh sừng bò ngàn lớp thơm phức bơ Pháp rưới sốt bơ tỏi thơm lừng.',
                'description' => 'Chiếc bánh sừng bò giòn tan với hàng trăm lớp bột xếp chồng lên nhau. Bánh được nướng nóng hổi, thơm phức bơ nhạt cao cấp và tỏi phi.',
            ],
            [
                'name' => 'Tiramisu Cổ Điển',
                'price' => 45000,
                'categories' => ['Bánh ngọt', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Bánh Tiramisu Ý mềm mịn thơm thoang thoảng rượu rum và cà phê.',
                'description' => 'Món tráng miệng lừng danh đến từ nước Ý. Lớp kem Mascarpone béo ngậy xen kẽ các lớp bánh quy Ladyfingers thấm đẫm hương vị cà phê espresso đậm đặc và rượu rum.',
            ],
            [
                'name' => 'Bánh Mousse Chanh Leo',
                'price' => 39000,
                'categories' => ['Bánh ngọt'],
                'image' => 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Lớp mousse chanh leo chua dẻo dễ chịu hòa quyện cùng đế bánh gato mềm xốp.',
                'description' => 'Bánh ngọt Mousse chanh leo thanh mát với lớp mousse chanh leo chua ngọt, béo nhẹ hòa quyện cùng đế bánh gato xốp mềm thơm bơ.',
            ],
            // 11 MÓN MỚI BỔ SUNG (Premium & Rich aesthetics)
            [
                'name' => 'Cà Phê Muối Xứ Huế',
                'price' => 35000,
                'categories' => ['Cà phê', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60',
                'status' => true,
                'short_description' => 'Cà phê Robusta phin kết hợp lớp kem sữa muối mặn mòi độc đáo.',
                'description' => 'Thức uống đặc sản cố đô Huế. Sự hòa quyện đầy mê hoặc giữa vị đắng đậm đà của cà phê Robusta pha phin truyền thống và lớp kem sữa muối đánh bông mịn màng.',
            ],
            [
                'name' => 'Cold Brew Cam Sàng',
                'price' => 45000,
                'categories' => ['Cà phê', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
                'status' => true,
                'short_description' => 'Cà phê ủ lạnh thanh tao hòa cùng vị cam vàng tươi mát sảng khoái.',
                'description' => 'Cà phê được ủ lạnh chậm suốt 16 tiếng mang lại vị đắng dịu thanh khiết, kết hợp cùng nước cam vàng tươi mát và lát sả đập dập thơm lừng.',
            ],
            [
                'name' => 'Affogato Kem Dừa',
                'price' => 39000,
                'categories' => ['Cà phê', 'Đá xay', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=500',
                'status' => true,
                'short_description' => 'Shot espresso nóng hổi đổ trực tiếp lên viên kem dừa béo ngọt.',
                'description' => 'Món tráng miệng Ý mang phong vị nhiệt đới. Một shot Espresso nóng hổi, đậm đặc được rưới trực tiếp lên viên kem dừa béo ngậy mát lạnh.',
            ],
            [
                'name' => 'Trà Xoài Chanh Leo',
                'price' => 42000,
                'categories' => ['Trà trái cây', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
                'status' => true,
                'short_description' => 'Trà lài thanh mát hòa quyện xoài chín mọng và chanh dây chua thanh.',
                'description' => 'Sự kết hợp bùng nổ hương vị nhiệt đới. Trà nhài thơm ngát lắc cùng xoài cát chín vàng ngọt lịm và chanh dây chua thanh mát, phủ thêm lớp thạch xoài.',
            ],
            [
                'name' => 'Trà Bưởi Hồng Ruby',
                'price' => 42000,
                'categories' => ['Trà trái cây'],
                'image' => 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500',
                'status' => true,
                'short_description' => 'Trà lài kết hợp tép bưởi hồng tươi mọng và mật ong tự nhiên.',
                'description' => 'Thức uống dưỡng nhan thanh mát ngọt dịu. Cốt trà nhài thơm nhẹ hòa cùng nước ép bưởi hồng tươi tắn, tép bưởi hồng giòn mọng nước.',
            ],
            [
                'name' => 'Trà Sữa Kem Phô Mai',
                'price' => 45000,
                'categories' => ['Trà trái cây', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
                'status' => true,
                'short_description' => 'Trà ô long đậm vị kết hợp lớp kem phô mai sánh mịn béo ngậy.',
                'description' => 'Ly trà sữa làm tan chảy con tim với cốt trà ô long nướng đậm hương thơm lừng, phía trên là lớp kem phô mai mặn béo ngậy sánh mịn.',
            ],
            [
                'name' => 'Bánh Muffin Việt Quất',
                'price' => 35000,
                'categories' => ['Bánh ngọt', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500',
                'status' => true,
                'short_description' => 'Bánh Muffin nướng xốp mềm chứa những trái việt quất tươi mọng nước.',
                'description' => 'Chiếc bánh muffin nhỏ xinh, thơm lừng bơ sữa với cốt bánh mềm ẩm xốp, đan xen những quả việt quất Mỹ tươi ngon mọng nước.',
            ],
            [
                'name' => 'Bánh Macaron Sắc Màu',
                'price' => 45000,
                'categories' => ['Bánh ngọt'],
                'image' => 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500',
                'status' => true,
                'short_description' => 'Set 3 chiếc bánh Macaron Pháp giòn tan thơm béo đủ hương vị rực rỡ.',
                'description' => 'Biểu tượng bánh ngọt nước Pháp xinh đẹp. Set 3 chiếc Macaron nhỏ nhắn rực rỡ sắc màu với lớp vỏ giòn tan và nhân béo ngậy.',
            ],
            [
                'name' => 'Mỳ Ý Sốt Bò Bằm',
                'price' => 69000,
                'categories' => ['Món ăn', 'Bán chạy'],
                'image' => 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
                'status' => true,
                'short_description' => 'Mỳ Ý dai ngon kết hợp sốt bò bằm đậm đà và phô mai Parmigiano bào.',
                'description' => 'Món ăn no lý tưởng cho buổi trưa. Sợi mỳ Ý luộc vừa chín tới dai ngon, hòa quyện cùng nước sốt cà chua thịt bò bằm đậm đà.',
            ],
            [
                'name' => 'Salad Ức Gà Mè Rang',
                'price' => 59000,
                'categories' => ['Món ăn'],
                'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
                'status' => true,
                'short_description' => 'Ức gà áp chảo mềm mọng cùng xà lách tươi sạch và sốt mè rang.',
                'description' => 'Lựa chọn Eat-clean lành mạnh. Ức gà tẩm ướp thảo mộc áp chảo vàng ươm mềm ẩm, kết hợp cùng xà lách thủy canh tươi giòn.',
            ],
            [
                'name' => 'Khoai Tây Chiên Lắc Phô Mai',
                'price' => 39000,
                'categories' => ['Món ăn', 'Món mới'],
                'image' => 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500',
                'status' => true,
                'short_description' => 'Khoai tây bổ múi chiên giòn rụm phủ bột phô mai Cheddar đậm đà.',
                'description' => 'Món ăn vặt khoái khẩu. Khoai tây cọng lớn chiên vàng rụm bên ngoài, lắc đều cùng bột phô mai Cheddar nhập khẩu đậm đà.',
            ],
            [
                'name' => 'Bánh Mì Tỏi Baguette',
                'price' => 32000,
                'categories' => ['Bánh ngọt', 'Món ăn'],
                'image' => 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500',
                'status' => true,
                'short_description' => 'Bánh mì baguette nướng bơ tỏi thơm giòn nóng hổi khó cưỡng.',
                'description' => 'Những lát bánh mì Baguette Pháp giòn rụm được phết đều hỗn hợp bơ nhạt cao cấp, tỏi lý sơn băm nhuyễn và lá ngò tây thơm phức.',
            ]
        ];
 
        // 5. Lưu sản phẩm và liên kết danh mục Nhiều-Nhiều
        foreach ($products as $productData) {
            $cats = $productData['categories'];
            unset($productData['categories']);
            
            $product = Product::create($productData);
            
            // Tìm và gán id danh mục
            $catIds = [];
            foreach ($cats as $cName) {
                if (isset($categoryModels[$cName])) {
                    $catIds[] = $categoryModels[$cName]->id;
                }
            }
            $product->categories()->sync($catIds);
        }
    }
}
