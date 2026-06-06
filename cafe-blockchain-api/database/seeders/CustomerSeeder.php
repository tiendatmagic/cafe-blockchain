<?php

namespace Database\Seeders;

use App\Domain\Entities\Customer;
use App\Domain\Entities\CustomerGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeOwner = '0x75ad18ef47eda21baff837cac0f1563d0c355555';

        // Lấy tất cả mã khách hàng hiện có để kiểm tra trùng lặp trong bộ nhớ (in-memory)
        $existingCodes = Customer::pluck('customer_code')->toArray();
        $existingCodesMap = array_flip($existingCodes);

        // Lấy danh sách nhóm khách hàng của store owner này
        $groupIds = CustomerGroup::where('store_owner_address', $storeOwner)->pluck('id')->toArray();

        // Họ và tên đệm/tên mẫu để sinh ngẫu nhiên
        $hoList = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Lâm', 'Phùng', 'Mai'];
        $maleMiddleList = ['Văn', 'Hữu', 'Đức', 'Thành', 'Minh', 'Quang', 'Xuân', 'Anh', 'Duy', 'Khánh', 'Hoàng', 'Tuấn', 'Tiến', 'Mạnh', 'Trọng', 'Nhật', 'Bảo', 'Quốc'];
        $femaleMiddleList = ['Thị', 'Ngọc', 'Hồng', 'Mai', 'Lan', 'Quỳnh', 'Cẩm', 'Thu', 'Thảo', 'Phương', 'Bích', 'Tuyết', 'Khánh', 'Cát', 'Hoài', 'Diệu', 'Như'];
        $maleNameList = ['Anh', 'Bình', 'Cường', 'Dũng', 'Đông', 'Đạt', 'Giang', 'Hùng', 'Hải', 'Huy', 'Hoàng', 'Khánh', 'Khoa', 'Lâm', 'Long', 'Minh', 'Nam', 'Phong', 'Phúc', 'Quân', 'Quang', 'Sơn', 'Tùng', 'Thái', 'Tiến', 'Trung', 'Tuấn', 'Vinh', 'Việt', 'Tân', 'Kiệt', 'Thịnh', 'Đức', 'Bảo'];
        $femaleNameList = ['An', 'Anh', 'Chi', 'Cúc', 'Dung', 'Đào', 'Giang', 'Hà', 'Hoa', 'Hương', 'Hằng', 'Hạnh', 'Lan', 'Linh', 'Liên', 'Mai', 'My', 'Ngọc', 'Oanh', 'Phương', 'Phượng', 'Quỳnh', 'Thảo', 'Thu', 'Trang', 'Trinh', 'Vân', 'Vy', 'Yến', 'Trúc', 'Nhi', 'Tuyết', 'Tuyền'];

        $companyPrefixes = ['Công ty TNHH', 'Công ty Cổ phần', 'Tập đoàn', 'Doanh nghiệp Tư nhân', 'Hợp tác xã', 'Công ty TNHH MTV'];
        $companyNames = ['Thịnh Phát', 'An Phát', 'Đại Nam', 'Việt Á', 'Sao Mai', 'Hoàng Gia', 'Trường Sơn', 'Hòa Bình', 'Vinh Quang', 'Đông Dương', 'Thái Bình Dương', 'Vạn Xuân', 'Hải Đăng', 'Tiến Phong', 'Khải Hoàn', 'Đất Việt', 'Tân Á', 'Minh Đăng', 'Nam Á', 'Đại Việt', 'Hồng Hà', 'Cửu Long', 'Trường Giang', 'Sông Hồng', 'Kim Đô', 'Hoa Sen', 'Thành Công'];
        $companySectors = ['Thương mại', 'Dịch vụ', 'Công nghệ', 'Xây dựng', 'Truyền thông', 'Đầu tư', 'Thực phẩm', 'Thời trang', 'Vận tải', 'Sản xuất', 'Du lịch', 'Giáo dục', 'Năng lượng', 'Cơ khí', 'Bất động sản'];

        $streets = ['Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Cách Mạng Tháng Tám', 'Nguyễn Trãi', 'Hai Bà Trưng', 'Lê Duẩn', 'Bùi Thị Xuân', 'Phan Châu Trinh', 'Lý Tự Trọng', 'Tôn Đức Thắng', 'Đồng Khởi', 'Điện Biên Phủ'];
        $cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Quảng Nam', 'Thừa Thiên Huế', 'Nghệ An', 'Thanh Hóa'];

        $phonePrefixes = ['090', '091', '098', '096', '097', '093', '094', '032', '033', '034', '035', '036', '037', '038', '039', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '088'];

        $businessStatuses = ['Đang hoạt động', 'NNT đang hoạt động', 'Ngừng hoạt động', 'Tạm ngưng'];

        // Hàm bỏ dấu tiếng Việt để sinh email & website
        $removeAccents = function ($str) {
            $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
            $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
            $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
            $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
            $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
            $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
            $str = preg_replace("/(đ)/", 'd', $str);
            $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
            $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
            $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
            $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
            $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
            $str = preg_replace("/(Ỳ|Ý|Ỹ|Ỷ|Ỹ)/", 'Y', $str);
            $str = preg_replace("/(Đ)/", 'D', $str);
            return $str;
        };

        DB::transaction(function () use (
            $storeOwner, &$existingCodesMap, $groupIds,
            $hoList, $maleMiddleList, $femaleMiddleList, $maleNameList, $femaleNameList,
            $companyPrefixes, $companyNames, $companySectors,
            $streets, $cities, $phonePrefixes, $businessStatuses, $removeAccents
        ) {
            // Tạo 600 khách hàng cá nhân
            for ($i = 0; $i < 600; $i++) {
                $isMale = (rand(0, 1) === 0);
                $ho = $hoList[array_rand($hoList)];
                $middle = $isMale ? $maleMiddleList[array_rand($maleMiddleList)] : $femaleMiddleList[array_rand($femaleMiddleList)];
                $firstName = $isMale ? $maleNameList[array_rand($maleNameList)] : $femaleNameList[array_rand($femaleNameList)];
                $name = $ho . ' ' . $middle . ' ' . $firstName;

                $phone = $phonePrefixes[array_rand($phonePrefixes)] . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);
                
                $nameClean = strtolower(str_replace(' ', '', $removeAccents($name)));
                $email = $nameClean . rand(10, 99) . '@gmail.com';
                
                $dob = date('Y-m-d', strtotime('-' . rand(18, 50) . ' years -' . rand(0, 365) . ' days'));
                $gender = $isMale ? 'Nam' : 'Nữ';
                
                $address = rand(1, 450) . ' Đường ' . $streets[array_rand($streets)] . ', ' . $cities[array_rand($cities)];

                // Tạo mã khách hàng ngẫu nhiên duy nhất
                do {
                    $customerCode = 'KH-' . strtoupper(bin2hex(random_bytes(2)));
                } while (isset($existingCodesMap[$customerCode]));
                $existingCodesMap[$customerCode] = true;

                $customer = Customer::create([
                    'customer_code' => $customerCode,
                    'type' => 'individual',
                    'name' => $name,
                    'phone' => $phone,
                    'email' => $email,
                    'dob' => $dob,
                    'gender' => $gender,
                    'address' => $address,
                    'store_owner_address' => $storeOwner,
                    'business_status' => 'Đang hoạt động'
                ]);

                // Ngẫu nhiên gán vào nhóm khách hàng (20% cơ hội)
                if (!empty($groupIds) && rand(1, 5) === 1) {
                    $randomGroupId = $groupIds[array_rand($groupIds)];
                    $customer->groups()->attach($randomGroupId);
                }
            }

            // Tạo 400 khách hàng doanh nghiệp
            for ($i = 0; $i < 400; $i++) {
                $prefix = $companyPrefixes[array_rand($companyPrefixes)];
                $companyCore = $companyNames[array_rand($companyNames)];
                $sector = $companySectors[array_rand($companySectors)];
                
                $companyName = $prefix . ' ' . $companyCore;
                if (rand(0, 1) === 0) {
                    $companyName .= ' ' . $sector;
                }

                $taxCode = '0' . rand(1, 9) . str_pad(rand(0, 99999999), 8, '0', STR_PAD_LEFT);
                
                $repIsMale = (rand(0, 1) === 0);
                $repHo = $hoList[array_rand($hoList)];
                $repMiddle = $repIsMale ? $maleMiddleList[array_rand($maleMiddleList)] : $femaleMiddleList[array_rand($femaleMiddleList)];
                $repFirst = $repIsMale ? $maleNameList[array_rand($maleNameList)] : $femaleNameList[array_rand($femaleNameList)];
                $repName = $repHo . ' ' . $repMiddle . ' ' . $repFirst;

                $companyClean = strtolower(str_replace(' ', '', $removeAccents($companyCore)));
                $website = 'https://' . $companyClean . '.com.vn';
                $email = 'contact@' . $companyClean . '.com.vn';
                
                // Số điện thoại bàn hoặc di động doanh nghiệp
                $phone = '';
                if (rand(0, 1) === 0) {
                    $phone = '02' . (rand(0, 1) === 0 ? '4' : '8') . '3' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
                } else {
                    $phone = $phonePrefixes[array_rand($phonePrefixes)] . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);
                }

                $address = 'Tầng ' . rand(1, 20) . ' Tòa nhà ' . $companyCore . ' Tower, ' . rand(1, 250) . ' ' . $streets[array_rand($streets)] . ', ' . $cities[array_rand($cities)];

                // Tạo mã khách hàng ngẫu nhiên duy nhất
                do {
                    $customerCode = 'KH-' . strtoupper(bin2hex(random_bytes(2)));
                } while (isset($existingCodesMap[$customerCode]));
                $existingCodesMap[$customerCode] = true;

                $businessStatus = $businessStatuses[array_rand($businessStatuses)];

                $customer = Customer::create([
                    'customer_code' => $customerCode,
                    'type' => 'business',
                    'name' => $companyName,
                    'company_name' => $companyName,
                    'tax_code' => $taxCode,
                    'representative_name' => $repName,
                    'website' => $website,
                    'phone' => $phone,
                    'email' => $email,
                    'dob' => null,
                    'gender' => $repIsMale ? 'Nam' : 'Nữ',
                    'address' => $address,
                    'store_owner_address' => $storeOwner,
                    'business_status' => $businessStatus
                ]);

                // Ngẫu nhiên gán vào nhóm khách hàng doanh nghiệp (10% cơ hội)
                if (!empty($groupIds) && rand(1, 10) === 1) {
                    $randomGroupId = $groupIds[array_rand($groupIds)];
                    $customer->groups()->attach($randomGroupId);
                }
            }
        });
    }
}
