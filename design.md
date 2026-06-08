# Tài liệu thiết kế giao diện (UI/UX Design) — Cafe Blockchain DApp

Tài liệu này mô tả chi tiết ngôn ngữ thiết kế, hệ thống màu sắc, cấu trúc responsive và các cải tiến trải nghiệm người dùng (UX) vừa được áp dụng cho ứng dụng Cafe Blockchain Web3.

---

## 1. Hệ thống màu sắc động (Dynamic Themes)

DApp hỗ trợ cấu hình màu sắc động linh hoạt từ Admin Dashboard thông qua CSS Variables.

* **Biến màu động**:
  * `--dynamic-primary`: Màu chủ đạo (Mặc định: `#7c3aed` - Tím đậm).
  * `--dynamic-secondary`: Màu phụ (Mặc định: `#c084fc` - Tím nhạt).

* **Giải pháp Override thông minh (Tailwind CSS v4 Integration)**:
  Để tránh việc refactor thủ công hàng trăm class Tailwind chứa màu tím (`bg-purple-650`, `text-purple-600`, etc.), chúng tôi đã override trực tiếp dải màu `purple` của hệ thống Tailwind trong `@theme` tại `styles.css`. 
  Tất cả các class `purple` hiện có trên giao diện sẽ tự động chuyển đổi theo màu sắc tùy chỉnh của quán (được lưu tại cơ sở dữ liệu và đồng bộ qua API).

---

## 2. Quy tắc Bo góc (Border Radius)
* Hệ thống áp dụng phong cách thiết kế bo tròn tinh tế và sắc sảo, tối đa là **15px** để tạo cảm giác đồng bộ, hiện đại và không bị tròn quá mức (tròn hình quả bong bóng) trên các màn hình lớn.
* **Cấu hình**:
  ```css
  --radius-xl: 15px;
  --radius-2xl: 15px;
  --radius-3xl: 15px;
  --radius-4xl: 15px;
  ```

---

## 3. Cấu trúc Responsive
Ứng dụng được tối ưu hóa hiển thị nhất quán từ màn hình máy tính lớn (Desktop) đến điện thoại di động (Mobile).

* **Desktop Layout**:
  * Sidebar cố định bên trái (chiều rộng `w-72` / `288px`), tích hợp điều hướng, bộ chọn giao diện và nút Blockchain Explorer nổi bật.
  * Header phía trên chứa tên cửa hàng, tỷ giá USDT/VND thời gian thực và Widget hiển thị trạng thái kết nối ví Web3.
  * Content chính cuộn dọc bên phải.

* **Mobile Layout**:
  * Sidebar tự động ẩn. Thay vào đó là Header Mobile tinh gọn ở phía trên cùng, tích hợp nút Hamburger Menu và nút Kết nối ví Web3 thu nhỏ.
  * Khi bấm Hamburger Menu, một Drawer trượt (Overlay Drawer) từ bên trái sẽ xuất hiện mượt mà chứa toàn bộ menu điều hướng và bộ chọn giao diện.

---

## 4. Banner CTA Kết nối ví Web3 (Cải tiến UX mới)
Khi chưa phát hiện kết nối ví Web3, thay vì hiển thị các skeleton loader trống hoặc bảng dữ liệu trống, hệ thống sẽ tự động hiển thị một **Banner Call-To-Action (CTA)** được thiết kế theo phong cách kính mờ (Glassmorphism):

* **Thiết kế trực quan**:
  * Nền kính mờ: `bg-white/60 dark:bg-slate-900/60 backdrop-blur-md` kết hợp viền mờ `border-slate-200/50 dark:border-slate-800/50`.
  * Hiệu ứng chuyển động nhẹ của icon ví Web3 dạng 3D (`animate-bounce-slow`).
  * Nút hành động **KẾT NỐI VÍ METAMASK** dạng gradient rực rỡ thu hút sự chú ý của người dùng, giúp kích hoạt nhanh tiến trình Web3 Auth.

* **Vị trí áp dụng**:
  * **Tổng quan Dashboard**: Banner CTA che đi các ô thống kê và biểu đồ trống.
  * **Bán hàng POS**: Banner CTA thay thế cho danh mục món ăn và giỏ hàng, yêu cầu đăng nhập trước khi bán.

---

## 5. Blockchain Receipt Explorer
Trang tra cứu hóa đơn phân tán công khai (`/blockchain-explorer`) được thiết kế biệt lập:
* Cung cấp khả năng tra cứu trực tiếp dữ liệu giao dịch từ Smart Contract (BSC/Sepolia) mà không phụ thuộc vào cơ sở dữ liệu MySQL truyền thống.
* Sử dụng bảng màu tím sáng dịu nhẹ để mang lại cảm giác tin cậy và minh bạch của công nghệ sổ cái phân tán.
