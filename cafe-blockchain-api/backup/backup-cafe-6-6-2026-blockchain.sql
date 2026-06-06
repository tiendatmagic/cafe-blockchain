-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 06, 2026 lúc 02:55 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cafe-blockchain`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `areas`
--

CREATE TABLE `areas` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `areas`
--

INSERT INTO `areas` (`id`, `name`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'Sân vườn', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 04:04:19', '2026-05-26 04:04:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(10, 'Trà sữa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 12:54:36', '2026-05-25 12:54:36'),
(12, 'Cà phê', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(13, 'Trà trái cây', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(14, 'Đá xay', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(15, 'Sinh tố', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(16, 'Bánh ngọt', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(17, 'Món ăn', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(18, 'Món mới', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(19, 'Bán chạy', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(20, 'Trà sữa ô long', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(21, 'Soda Ý sảng khoái', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(22, 'Kem Gelato Ý', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09'),
(23, 'Đồ ăn nhanh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 10:20:26', '2026-05-29 10:37:09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category_product`
--

CREATE TABLE `category_product` (
  `product_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `category_product`
--

INSERT INTO `category_product` (`product_id`, `category_id`) VALUES
(434, 12),
(435, 12),
(436, 12),
(437, 12),
(438, 12),
(439, 12),
(458, 12),
(459, 12),
(460, 12),
(461, 12),
(462, 12),
(463, 12),
(482, 12),
(483, 12),
(484, 12),
(485, 12),
(486, 12),
(487, 12),
(506, 12),
(507, 12),
(508, 12),
(509, 12),
(510, 12),
(511, 12),
(530, 12),
(531, 12),
(532, 12),
(533, 12),
(440, 13),
(441, 13),
(464, 13),
(465, 13),
(488, 13),
(489, 13),
(512, 13),
(513, 13),
(446, 14),
(470, 14),
(494, 14),
(518, 14),
(447, 15),
(471, 15),
(495, 15),
(519, 15),
(451, 16),
(452, 16),
(453, 16),
(475, 16),
(476, 16),
(477, 16),
(499, 16),
(500, 16),
(501, 16),
(523, 16),
(524, 16),
(525, 16),
(454, 17),
(456, 17),
(478, 17),
(480, 17),
(502, 17),
(504, 17),
(526, 17),
(528, 17),
(435, 18),
(443, 18),
(444, 18),
(448, 18),
(453, 18),
(459, 18),
(467, 18),
(468, 18),
(472, 18),
(477, 18),
(483, 18),
(491, 18),
(492, 18),
(496, 18),
(501, 18),
(507, 18),
(515, 18),
(516, 18),
(520, 18),
(525, 18),
(531, 18),
(437, 19),
(441, 19),
(442, 19),
(446, 19),
(449, 19),
(455, 19),
(461, 19),
(465, 19),
(466, 19),
(470, 19),
(473, 19),
(479, 19),
(485, 19),
(489, 19),
(490, 19),
(494, 19),
(497, 19),
(503, 19),
(509, 19),
(513, 19),
(514, 19),
(518, 19),
(521, 19),
(527, 19),
(533, 19),
(442, 20),
(443, 20),
(466, 20),
(467, 20),
(490, 20),
(491, 20),
(514, 20),
(515, 20),
(444, 21),
(445, 21),
(468, 21),
(469, 21),
(492, 21),
(493, 21),
(516, 21),
(517, 21),
(448, 22),
(449, 22),
(450, 22),
(472, 22),
(473, 22),
(474, 22),
(496, 22),
(497, 22),
(498, 22),
(520, 22),
(521, 22),
(522, 22),
(455, 23),
(457, 23),
(479, 23),
(481, 23),
(503, 23),
(505, 23),
(527, 23),
(529, 23);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `customer_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'individual',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `representative_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Đang hoạt động',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wallet_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'KH-842D', 'individual', 'Dương Thị Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789293516', 'duongthiha13@gmail.com', NULL, '1994-03-01', 'Nữ', '178 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(2, 'KH-6754', 'individual', 'Đỗ Bích Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375387026', 'dobichnhi72@gmail.com', NULL, '1997-07-26', 'Nữ', '19 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(3, 'KH-1FFC', 'individual', 'Bùi Quỳnh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0330465829', 'buiquynhcuc46@gmail.com', NULL, '2001-07-13', 'Nữ', '368 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(4, 'KH-9935', 'individual', 'Đỗ Hữu Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366623133', 'dohuubinh14@gmail.com', NULL, '2007-04-24', 'Nam', '421 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(5, 'KH-871D', 'individual', 'Phùng Bảo Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394797989', 'phungbaoquan87@gmail.com', NULL, '1994-04-23', 'Nam', '447 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(6, 'KH-E1C2', 'individual', 'Hoàng Tuyết Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0905503860', 'hoangtuyethanh22@gmail.com', NULL, '1996-06-19', 'Nữ', '230 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(7, 'KH-8C0A', 'individual', 'Phùng Khánh Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342280334', 'phungkhanhlien41@gmail.com', NULL, '1994-10-12', 'Nữ', '103 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(8, 'KH-594C', 'individual', 'Bùi Hoài Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849643020', 'buihoaihuong97@gmail.com', NULL, '2005-09-13', 'Nữ', '280 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(9, 'KH-C1A4', 'individual', 'Phạm Mạnh Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0948274460', 'phammanhphuc49@gmail.com', NULL, '1983-06-08', 'Nam', '241 Đường Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(10, 'KH-1E24', 'individual', 'Mai Cát Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0837707841', 'maicatha49@gmail.com', NULL, '1987-10-10', 'Nữ', '391 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(11, 'KH-C037', 'individual', 'Võ Mai Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0982633298', 'vomaiphuong72@gmail.com', NULL, '1977-02-28', 'Nữ', '94 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(12, 'KH-D792', 'individual', 'Bùi Xuân Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0915317717', 'buixuanduc87@gmail.com', NULL, '1987-09-20', 'Nam', '199 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(13, 'KH-0DCB', 'individual', 'Đặng Văn Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349631304', 'dangvantan14@gmail.com', NULL, '1997-04-10', 'Nam', '313 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(14, 'KH-EC59', 'individual', 'Bùi Thu Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889892774', 'buithuthu80@gmail.com', NULL, '1994-07-12', 'Nữ', '264 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(15, 'KH-58EF', 'individual', 'Huỳnh Xuân Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839882097', 'huynhxuanvinh31@gmail.com', NULL, '1992-06-13', 'Nam', '378 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(16, 'KH-88CC', 'individual', 'Lý Tuyết Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933326023', 'lytuyettuyen96@gmail.com', NULL, '2007-07-29', 'Nữ', '254 Đường Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(17, 'KH-2C51', 'individual', 'Dương Xuân Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838546142', 'duongxuankiet86@gmail.com', NULL, '2003-02-05', 'Nam', '223 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(18, 'KH-C62C', 'individual', 'Võ Hữu Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332040005', 'vohuuphong77@gmail.com', NULL, '1988-03-27', 'Nam', '193 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(19, 'KH-EF9A', 'individual', 'Bùi Khánh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0816552674', 'buikhanhcuc75@gmail.com', NULL, '1989-06-23', 'Nữ', '270 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(20, 'KH-796B', 'individual', 'Dương Quốc Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0903391034', 'duongquocthai41@gmail.com', NULL, '1988-10-20', 'Nam', '91 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(21, 'KH-3789', 'individual', 'Lê Duy Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0813689737', 'leduytung92@gmail.com', NULL, '1984-01-25', 'Nam', '255 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(22, 'KH-E061', 'individual', 'Lý Ngọc Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0378988688', 'lyngoctuyet76@gmail.com', NULL, '2001-10-21', 'Nữ', '18 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(23, 'KH-F290', 'individual', 'Phùng Tuyết Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968881401', 'phungtuyetlinh50@gmail.com', NULL, '1986-10-03', 'Nữ', '48 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(24, 'KH-81C2', 'individual', 'Lý Mạnh Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395672469', 'lymanhdung53@gmail.com', NULL, '1990-01-08', 'Nam', '276 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(25, 'KH-620D', 'individual', 'Lý Cát Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962623363', 'lycatcuc81@gmail.com', NULL, '1979-02-03', 'Nữ', '257 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(26, 'KH-CD91', 'individual', 'Vũ Lan Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361287882', 'vulanvan52@gmail.com', NULL, '1979-09-28', 'Nữ', '255 Đường Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(27, 'KH-1BA9', 'individual', 'Hoàng Bích Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0936436056', 'hoangbichhanh73@gmail.com', NULL, '1978-06-15', 'Nữ', '136 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(28, 'KH-39AB', 'individual', 'Đỗ Mai An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343402273', 'domaian25@gmail.com', NULL, '1984-03-04', 'Nữ', '440 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(29, 'KH-657E', 'individual', 'Lý Ngọc Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0843221342', 'lyngocha71@gmail.com', NULL, '1977-03-18', 'Nữ', '232 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(30, 'KH-1F0C', 'individual', 'Phan Tuấn Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942613242', 'phantuanlong58@gmail.com', NULL, '2005-04-07', 'Nam', '109 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(31, 'KH-0AA9', 'individual', 'Nguyễn Cát Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387093489', 'nguyencatoanh54@gmail.com', NULL, '1983-02-08', 'Nữ', '41 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(32, 'KH-0407', 'individual', 'Đặng Đức Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0762428975', 'dangducquang47@gmail.com', NULL, '1999-04-02', 'Nam', '163 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(33, 'KH-7C48', 'individual', 'Phùng Khánh Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359396671', 'phungkhanhtuyen22@gmail.com', NULL, '1997-01-09', 'Nữ', '38 Đường Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(34, 'KH-681B', 'individual', 'Lý Ngọc Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380703323', 'lyngoctuyet92@gmail.com', NULL, '1976-12-05', 'Nữ', '175 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(35, 'KH-53C1', 'individual', 'Nguyễn Lan Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769846866', 'nguyenlantruc91@gmail.com', NULL, '1989-08-16', 'Nữ', '10 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(36, 'KH-9E6E', 'individual', 'Bùi Xuân Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0700268263', 'buixuantrung52@gmail.com', NULL, '1985-12-12', 'Nam', '26 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(37, 'KH-7981', 'individual', 'Nguyễn Đức Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0903209387', 'nguyenducdat60@gmail.com', NULL, '1994-12-20', 'Nam', '200 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(38, 'KH-4F21', 'individual', 'Lâm Hoài Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703926673', 'lamhoaidung16@gmail.com', NULL, '2004-03-14', 'Nữ', '109 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(39, 'KH-9265', 'individual', 'Mai Ngọc Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0823241083', 'maingocha34@gmail.com', NULL, '1980-05-19', 'Nữ', '167 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(40, 'KH-16B8', 'individual', 'Lê Như Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799847101', 'lenhuchi48@gmail.com', NULL, '2004-04-27', 'Nữ', '238 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(41, 'KH-19FC', 'individual', 'Đặng Thảo Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0815568937', 'dangthaogiang13@gmail.com', NULL, '1996-11-18', 'Nữ', '291 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(42, 'KH-54E9', 'individual', 'Hồ Hữu Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787592683', 'hohuukiet76@gmail.com', NULL, '1992-01-05', 'Nam', '163 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(43, 'KH-D5D6', 'individual', 'Dương Như An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0859228535', 'duongnhuan88@gmail.com', NULL, '1978-03-21', 'Nữ', '238 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(44, 'KH-EACD', 'individual', 'Đỗ Mai Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779182066', 'domaitruc57@gmail.com', NULL, '1979-03-22', 'Nữ', '319 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(45, 'KH-56F5', 'individual', 'Huỳnh Hồng Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0847328497', 'huynhhongtruc47@gmail.com', NULL, '1995-04-23', 'Nữ', '116 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(46, 'KH-8268', 'individual', 'Vũ Quỳnh Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385517914', 'vuquynhvy91@gmail.com', NULL, '1986-09-03', 'Nữ', '211 Đường Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(47, 'KH-CD6A', 'individual', 'Trần Minh Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703086751', 'tranminhhai86@gmail.com', NULL, '1981-09-13', 'Nam', '119 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(48, 'KH-31B0', 'individual', 'Bùi Xuân Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900372429', 'buixuanquan24@gmail.com', NULL, '2002-05-30', 'Nam', '368 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(49, 'KH-36F1', 'individual', 'Vũ Bích Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839786588', 'vubichvan18@gmail.com', NULL, '1977-12-31', 'Nữ', '158 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(50, 'KH-9CCA', 'individual', 'Đặng Cát Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913495592', 'dangcattrang70@gmail.com', NULL, '1995-11-10', 'Nữ', '343 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(51, 'KH-8D52', 'individual', 'Võ Tuấn Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365894180', 'votuanphong68@gmail.com', NULL, '1983-11-13', 'Nam', '209 Đường Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(52, 'KH-AAE1', 'individual', 'Lâm Thu Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0858125662', 'lamthuha21@gmail.com', NULL, '1980-12-02', 'Nữ', '303 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(53, 'KH-0840', 'individual', 'Đặng Hoàng Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708665384', 'danghoangdat14@gmail.com', NULL, '2007-02-03', 'Nam', '230 Đường Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(54, 'KH-6273', 'individual', 'Phùng Tuyết Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370648667', 'phungtuyetphuong19@gmail.com', NULL, '1994-10-02', 'Nữ', '237 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(55, 'KH-8174', 'individual', 'Phùng Mạnh Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0784991652', 'phungmanhtrung59@gmail.com', NULL, '2004-05-06', 'Nam', '2 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(56, 'KH-D1C7', 'individual', 'Hoàng Anh Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972899231', 'hoanganhbinh88@gmail.com', NULL, '1998-10-16', 'Nam', '115 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(57, 'KH-7EA5', 'individual', 'Võ Tiến Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0829788590', 'votienbinh95@gmail.com', NULL, '2004-07-20', 'Nam', '90 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(58, 'KH-290D', 'individual', 'Lý Thị Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338523122', 'lythioanh74@gmail.com', NULL, '2002-03-11', 'Nữ', '132 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(59, 'KH-1503', 'individual', 'Trần Quỳnh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940214916', 'tranquynhanh36@gmail.com', NULL, '1989-12-04', 'Nữ', '328 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(60, 'KH-A965', 'individual', 'Mai Thảo Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0345118485', 'maithaothu89@gmail.com', NULL, '1994-11-06', 'Nữ', '218 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(61, 'KH-BC34', 'individual', 'Huỳnh Văn Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0334182883', 'huynhvantien17@gmail.com', NULL, '1995-06-09', 'Nam', '359 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(62, 'KH-D43E', 'individual', 'Phạm Đức Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839054896', 'phamductien82@gmail.com', NULL, '1991-07-12', 'Nam', '114 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(63, 'KH-325C', 'individual', 'Võ Bích Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363818307', 'vobichha44@gmail.com', NULL, '2005-01-05', 'Nữ', '102 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(64, 'KH-9D5B', 'individual', 'Phan Nhật Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0888248411', 'phannhattung75@gmail.com', NULL, '1997-12-26', 'Nam', '199 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(65, 'KH-9880', 'individual', 'Nguyễn Mai Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0369698562', 'nguyenmaitrang81@gmail.com', NULL, '1986-09-15', 'Nữ', '94 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(66, 'KH-7099', 'individual', 'Lý Tiến Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845630186', 'lytienthai83@gmail.com', NULL, '2007-08-28', 'Nam', '26 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(67, 'KH-183B', 'individual', 'Vũ Như Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0947786469', 'vunhuanh24@gmail.com', NULL, '2006-08-04', 'Nữ', '237 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(68, 'KH-7341', 'individual', 'Đinh Quang Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0379969547', 'dinhquanggiang89@gmail.com', NULL, '1988-10-30', 'Nam', '47 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(69, 'KH-4398', 'individual', 'Lâm Tuấn Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333387381', 'lamtuanminh80@gmail.com', NULL, '1977-03-23', 'Nam', '129 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(70, 'KH-E050', 'individual', 'Lê Quỳnh Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769243171', 'lequynhnhi26@gmail.com', NULL, '1994-05-16', 'Nữ', '201 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(71, 'KH-BC2D', 'individual', 'Đinh Văn Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828846040', 'dinhvandung67@gmail.com', NULL, '1990-07-20', 'Nam', '73 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(72, 'KH-36FD', 'individual', 'Bùi Bích Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818632847', 'buibichmai33@gmail.com', NULL, '1997-11-28', 'Nữ', '36 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(73, 'KH-74C4', 'individual', 'Lý Anh Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883306056', 'lyanhtrung44@gmail.com', NULL, '1980-03-30', 'Nam', '280 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(74, 'KH-F7F1', 'individual', 'Đỗ Hoài Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385666548', 'dohoailinh12@gmail.com', NULL, '1985-10-31', 'Nữ', '415 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(75, 'KH-7E03', 'individual', 'Huỳnh Trọng Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777931079', 'huynhtronghai15@gmail.com', NULL, '1979-08-23', 'Nam', '108 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(76, 'KH-8C6A', 'individual', 'Lê Thảo Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0837072430', 'lethaodao38@gmail.com', NULL, '1991-08-03', 'Nữ', '410 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(77, 'KH-38BE', 'individual', 'Lý Anh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0701168443', 'lyanhson78@gmail.com', NULL, '1982-04-27', 'Nam', '264 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(78, 'KH-0C2C', 'individual', 'Vũ Tuyết Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358975911', 'vutuyetquynh64@gmail.com', NULL, '2002-02-19', 'Nữ', '309 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(79, 'KH-0B1A', 'individual', 'Ngô Phương Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385443416', 'ngophuongoanh18@gmail.com', NULL, '2007-04-27', 'Nữ', '412 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(80, 'KH-2F6A', 'individual', 'Dương Văn Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0321096359', 'duongvanlam83@gmail.com', NULL, '2002-01-02', 'Nam', '341 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(81, 'KH-C53C', 'individual', 'Võ Đức Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387662988', 'voducquan58@gmail.com', NULL, '1989-01-24', 'Nam', '151 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(82, 'KH-B192', 'individual', 'Trần Anh Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0334984864', 'trananhhoang35@gmail.com', NULL, '1989-06-12', 'Nam', '308 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(83, 'KH-263F', 'individual', 'Phùng Quang Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931819860', 'phungquangson11@gmail.com', NULL, '2004-06-28', 'Nam', '45 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(84, 'KH-0131', 'individual', 'Lâm Tuyết Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774224691', 'lamtuyetlan74@gmail.com', NULL, '1976-12-03', 'Nữ', '198 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(85, 'KH-65E9', 'individual', 'Lý Hữu Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0885713328', 'lyhuuhung97@gmail.com', NULL, '1987-05-01', 'Nam', '428 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(86, 'KH-DF7A', 'individual', 'Nguyễn Trọng Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884949630', 'nguyentronghung16@gmail.com', NULL, '1976-11-14', 'Nam', '146 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(87, 'KH-2F87', 'individual', 'Vũ Tiến Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0980798890', 'vutientan38@gmail.com', NULL, '1987-05-21', 'Nam', '131 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(88, 'KH-2996', 'individual', 'Nguyễn Khánh Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779932431', 'nguyenkhanhvinh73@gmail.com', NULL, '1987-01-10', 'Nam', '214 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(89, 'KH-829D', 'individual', 'Dương Hoài Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325472023', 'duonghoaiha57@gmail.com', NULL, '2003-03-02', 'Nữ', '340 Đường Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(90, 'KH-69FE', 'individual', 'Trần Hoàng Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385727837', 'tranhoangvinh67@gmail.com', NULL, '1991-12-23', 'Nam', '110 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(91, 'KH-8D4E', 'individual', 'Hoàng Văn Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0793279281', 'hoangvangiang60@gmail.com', NULL, '2007-02-09', 'Nam', '286 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(92, 'KH-986C', 'individual', 'Vũ Thị Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904714034', 'vuthigiang70@gmail.com', NULL, '1982-12-23', 'Nữ', '388 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(93, 'KH-9914', 'individual', 'Đặng Cẩm Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971770007', 'dangcamchi44@gmail.com', NULL, '2000-02-22', 'Nữ', '222 Đường Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(94, 'KH-48E9', 'individual', 'Phạm Trọng Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856761231', 'phamtronglam52@gmail.com', NULL, '1983-07-15', 'Nam', '51 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(95, 'KH-9A41', 'individual', 'Đinh Mạnh Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0773496688', 'dinhmanhphong90@gmail.com', NULL, '1984-04-16', 'Nam', '305 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(96, 'KH-DA7F', 'individual', 'Bùi Văn Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365967996', 'buivantrung51@gmail.com', NULL, '2006-10-03', 'Nam', '130 Đường Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(97, 'KH-C20C', 'individual', 'Phan Cẩm Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349143799', 'phancamchi87@gmail.com', NULL, '2006-08-05', 'Nữ', '265 Đường Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(98, 'KH-52A7', 'individual', 'Võ Tuấn Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0961462359', 'votuanhung45@gmail.com', NULL, '1989-02-13', 'Nam', '252 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(99, 'KH-B5CA', 'individual', 'Đỗ Nhật Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0767485162', 'donhatquang31@gmail.com', NULL, '1978-09-10', 'Nam', '196 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(100, 'KH-7C4D', 'individual', 'Lý Đức Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0989688640', 'lyducthinh84@gmail.com', NULL, '1987-07-13', 'Nam', '408 Đường Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(101, 'KH-B353', 'individual', 'Phạm Hồng My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0773857648', 'phamhongmy72@gmail.com', NULL, '2007-09-29', 'Nữ', '114 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(102, 'KH-283A', 'individual', 'Hồ Mạnh Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933057141', 'homanhdung50@gmail.com', NULL, '2002-09-21', 'Nam', '135 Đường Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(103, 'KH-EBB1', 'individual', 'Phùng Khánh Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376465549', 'phungkhanhhai53@gmail.com', NULL, '1977-07-22', 'Nam', '209 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(104, 'KH-C871', 'individual', 'Nguyễn Hoài My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332108245', 'nguyenhoaimy14@gmail.com', NULL, '1977-08-04', 'Nữ', '239 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(105, 'KH-CDCA', 'individual', 'Phạm Xuân Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818624529', 'phamxuanphong95@gmail.com', NULL, '2007-12-01', 'Nam', '25 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(106, 'KH-5C55', 'individual', 'Lâm Mai Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833757277', 'lammaivan56@gmail.com', NULL, '1996-10-05', 'Nữ', '13 Đường Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(107, 'KH-D750', 'individual', 'Lê Nhật Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0887277120', 'lenhatnam79@gmail.com', NULL, '1996-04-30', 'Nam', '207 Đường Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(108, 'KH-1E48', 'individual', 'Phạm Cẩm Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0826743152', 'phamcamvan97@gmail.com', NULL, '1978-06-12', 'Nữ', '127 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(109, 'KH-CF56', 'individual', 'Mai Quốc Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972647089', 'maiquocviet64@gmail.com', NULL, '1995-12-13', 'Nam', '399 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(110, 'KH-B4A9', 'individual', 'Ngô Lan Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938204784', 'ngolanvan59@gmail.com', NULL, '1985-07-14', 'Nữ', '423 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(111, 'KH-7EA0', 'individual', 'Phan Thu Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0847406591', 'phanthucuc73@gmail.com', NULL, '1977-12-07', 'Nữ', '285 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(112, 'KH-6693', 'individual', 'Đinh Xuân Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850215041', 'dinhxuantuan99@gmail.com', NULL, '1984-10-18', 'Nam', '119 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(113, 'KH-33EE', 'individual', 'Ngô Quốc Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881382746', 'ngoquochai89@gmail.com', NULL, '1981-10-29', 'Nam', '443 Đường Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(114, 'KH-2C21', 'individual', 'Huỳnh Nhật Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338521017', 'huynhnhatdung69@gmail.com', NULL, '1992-02-07', 'Nam', '68 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(115, 'KH-A1A5', 'individual', 'Dương Văn Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327650047', 'duongvandong61@gmail.com', NULL, '1979-03-28', 'Nam', '386 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(116, 'KH-C52A', 'individual', 'Nguyễn Quốc Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856288308', 'nguyenquockiet81@gmail.com', NULL, '1978-12-23', 'Nam', '58 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(117, 'KH-36CD', 'individual', 'Đinh Xuân Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856773365', 'dinhxuandat42@gmail.com', NULL, '1987-04-20', 'Nam', '345 Đường Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(118, 'KH-5A4B', 'individual', 'Vũ Khánh Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779031028', 'vukhanhquang37@gmail.com', NULL, '1986-09-05', 'Nam', '22 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(119, 'KH-EC1F', 'individual', 'Vũ Đức Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375932844', 'vuducquan12@gmail.com', NULL, '1992-12-14', 'Nam', '360 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(120, 'KH-D73D', 'individual', 'Lâm Hoàng Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0814565393', 'lamhoangquan34@gmail.com', NULL, '2002-06-23', 'Nam', '303 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(121, 'KH-45AB', 'individual', 'Bùi Đức Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0344880508', 'buiductan53@gmail.com', NULL, '1986-07-28', 'Nam', '48 Đường Bùi Thị Xuân, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(122, 'KH-002C', 'individual', 'Mai Hữu Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0796895547', 'maihuuthinh41@gmail.com', NULL, '1979-03-28', 'Nam', '125 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(123, 'KH-42B3', 'individual', 'Mai Ngọc Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0846094928', 'maingoctrinh34@gmail.com', NULL, '1983-03-02', 'Nữ', '406 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(124, 'KH-F183', 'individual', 'Bùi Đức Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383840653', 'buiductien96@gmail.com', NULL, '2002-05-13', 'Nam', '351 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(125, 'KH-0E4E', 'individual', 'Lâm Hồng My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909293277', 'lamhongmy94@gmail.com', NULL, '2000-12-17', 'Nữ', '328 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(126, 'KH-36F8', 'individual', 'Trần Minh Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0967689471', 'tranminhcuong82@gmail.com', NULL, '1995-05-24', 'Nam', '379 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(127, 'KH-9E2B', 'individual', 'Đinh Văn Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0970625749', 'dinhvanviet77@gmail.com', NULL, '2001-04-24', 'Nam', '434 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(128, 'KH-23C4', 'individual', 'Vũ Thu Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324181194', 'vuthutruc75@gmail.com', NULL, '1976-03-05', 'Nữ', '320 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(129, 'KH-6809', 'individual', 'Mai Thành Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0914335594', 'maithanhdung58@gmail.com', NULL, '1983-06-13', 'Nam', '188 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(130, 'KH-00CC', 'individual', 'Đỗ Bảo Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0763800950', 'dobaodong63@gmail.com', NULL, '1979-10-15', 'Nam', '142 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(131, 'KH-1412', 'individual', 'Trần Tuyết Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0919690223', 'trantuyetdao73@gmail.com', NULL, '1997-05-16', 'Nữ', '219 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(132, 'KH-7CC4', 'individual', 'Phùng Lan Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972384177', 'phunglananh27@gmail.com', NULL, '2007-06-01', 'Nữ', '292 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(133, 'KH-A96B', 'individual', 'Đỗ Trọng Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0813776947', 'dotronghoang49@gmail.com', NULL, '2007-08-30', 'Nam', '367 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(134, 'KH-583B', 'individual', 'Đặng Duy Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820777580', 'dangduybao29@gmail.com', NULL, '2004-03-09', 'Nam', '254 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(135, 'KH-EB1C', 'individual', 'Võ Như Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0843390235', 'vonhuhoa59@gmail.com', NULL, '1997-07-29', 'Nữ', '429 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(136, 'KH-17A9', 'individual', 'Đỗ Cẩm Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0356714452', 'docamtrinh61@gmail.com', NULL, '2005-07-17', 'Nữ', '333 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(137, 'KH-F298', 'individual', 'Phùng Cẩm Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764318702', 'phungcamgiang47@gmail.com', NULL, '1976-07-02', 'Nữ', '197 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(138, 'KH-1165', 'individual', 'Hồ Bảo Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365520777', 'hobaokiet22@gmail.com', NULL, '1994-11-06', 'Nam', '191 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(139, 'KH-719C', 'individual', 'Hoàng Anh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986599738', 'hoanganhtung91@gmail.com', NULL, '1995-08-11', 'Nam', '168 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(140, 'KH-EB9A', 'individual', 'Nguyễn Khánh Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0371371056', 'nguyenkhanhduc17@gmail.com', NULL, '1985-09-17', 'Nam', '307 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(141, 'KH-1779', 'individual', 'Bùi Cẩm Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0767152403', 'buicamdung22@gmail.com', NULL, '1995-12-30', 'Nữ', '57 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(142, 'KH-7E53', 'individual', 'Hoàng Bảo Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0949352701', 'hoangbaohoang90@gmail.com', NULL, '2006-01-02', 'Nam', '415 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(143, 'KH-6468', 'individual', 'Phan Khánh Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850317778', 'phankhanhquynh65@gmail.com', NULL, '1980-01-13', 'Nữ', '291 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(144, 'KH-6C4D', 'individual', 'Hoàng Mai Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0917484346', 'hoangmaianh64@gmail.com', NULL, '2002-10-15', 'Nữ', '446 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(145, 'KH-A575', 'individual', 'Đinh Diệu Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355633953', 'dinhdieuquynh96@gmail.com', NULL, '1981-02-12', 'Nữ', '79 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(146, 'KH-9D40', 'individual', 'Dương Trọng Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373456059', 'duongtrongbinh13@gmail.com', NULL, '1981-10-31', 'Nam', '246 Đường Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(147, 'KH-B547', 'individual', 'Đỗ Khánh Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0822858249', 'dokhanhtan88@gmail.com', NULL, '2004-01-04', 'Nam', '289 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(148, 'KH-99D9', 'individual', 'Ngô Quang Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768785237', 'ngoquangthai62@gmail.com', NULL, '1976-09-21', 'Nam', '367 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(149, 'KH-A7B3', 'individual', 'Huỳnh Hoàng Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708627115', 'huynhhoangdung93@gmail.com', NULL, '1983-03-18', 'Nam', '237 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(150, 'KH-AA12', 'individual', 'Đinh Lan Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342731941', 'dinhlanyen87@gmail.com', NULL, '1981-12-07', 'Nữ', '163 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(151, 'KH-D728', 'individual', 'Dương Văn Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987114426', 'duongvanson92@gmail.com', NULL, '2003-01-16', 'Nam', '136 Đường Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(152, 'KH-F3DA', 'individual', 'Lý Như Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831078989', 'lynhucuc76@gmail.com', NULL, '1997-02-06', 'Nữ', '195 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(153, 'KH-B8F3', 'individual', 'Trần Thu Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0705875458', 'tranthuha48@gmail.com', NULL, '1990-07-14', 'Nữ', '284 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(154, 'KH-EDA9', 'individual', 'Hoàng Mai Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883206658', 'hoangmaiphuong82@gmail.com', NULL, '1976-02-14', 'Nữ', '281 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(155, 'KH-3221', 'individual', 'Vũ Quốc Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818584409', 'vuquoctung64@gmail.com', NULL, '1984-01-14', 'Nam', '15 Đường Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(156, 'KH-C49E', 'individual', 'Lâm Xuân Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380276228', 'lamxuanbao14@gmail.com', NULL, '2000-10-17', 'Nam', '237 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(157, 'KH-6E4C', 'individual', 'Trần Diệu Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0840214652', 'trandieuvan62@gmail.com', NULL, '2003-04-24', 'Nữ', '115 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(158, 'KH-B427', 'individual', 'Ngô Như An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361545163', 'ngonhuan19@gmail.com', NULL, '1985-09-26', 'Nữ', '307 Đường Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(159, 'KH-9FAE', 'individual', 'Nguyễn Bảo Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761672453', 'nguyenbaocuong89@gmail.com', NULL, '1978-05-13', 'Nam', '89 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(160, 'KH-8931', 'individual', 'Phùng Quỳnh Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360789315', 'phungquynhvy10@gmail.com', NULL, '1993-12-31', 'Nữ', '299 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(161, 'KH-9DEB', 'individual', 'Ngô Hoàng Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900401040', 'ngohoangdat41@gmail.com', NULL, '1994-02-24', 'Nam', '47 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(162, 'KH-9272', 'individual', 'Phùng Như Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972136956', 'phungnhutuyet20@gmail.com', NULL, '2004-08-05', 'Nữ', '175 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(163, 'KH-D0A7', 'individual', 'Nguyễn Thị Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343633717', 'nguyenthinhi12@gmail.com', NULL, '1999-04-26', 'Nữ', '134 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(164, 'KH-CFFB', 'individual', 'Đinh Anh Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0823204097', 'dinhanhtien68@gmail.com', NULL, '2005-11-30', 'Nam', '246 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(165, 'KH-16EE', 'individual', 'Ngô Tuyết Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0354065516', 'ngotuyetthu67@gmail.com', NULL, '1987-02-09', 'Nữ', '374 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(166, 'KH-E45E', 'individual', 'Lâm Hoài Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0932389362', 'lamhoaihoa74@gmail.com', NULL, '2001-11-11', 'Nữ', '191 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(167, 'KH-8818', 'individual', 'Trần Tiến Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0396589628', 'trantienbao74@gmail.com', NULL, '1975-07-07', 'Nam', '321 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(168, 'KH-2B99', 'individual', 'Mai Hồng Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329258339', 'maihongdung32@gmail.com', NULL, '1978-06-16', 'Nữ', '97 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(169, 'KH-90C2', 'individual', 'Dương Thị An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376507874', 'duongthian13@gmail.com', NULL, '1986-03-23', 'Nữ', '36 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(170, 'KH-F28C', 'individual', 'Vũ Thị Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775354199', 'vuthilinh41@gmail.com', NULL, '1990-04-19', 'Nữ', '23 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(171, 'KH-F683', 'individual', 'Vũ Duy Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0944871426', 'vuduyvinh29@gmail.com', NULL, '1982-01-23', 'Nam', '340 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(172, 'KH-6EF4', 'individual', 'Mai Bảo Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0945279474', 'maibaohung10@gmail.com', NULL, '2000-07-14', 'Nam', '345 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(173, 'KH-BC47', 'individual', 'Vũ Bích Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0369845340', 'vubichhuong39@gmail.com', NULL, '1976-08-05', 'Nữ', '172 Đường Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(174, 'KH-ED53', 'individual', 'Phan Duy Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881809910', 'phanduytuan72@gmail.com', NULL, '1977-05-03', 'Nam', '41 Đường Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(175, 'KH-53E8', 'individual', 'Vũ Hoài Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768161502', 'vuhoaianh54@gmail.com', NULL, '1993-11-14', 'Nữ', '290 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(176, 'KH-16B7', 'individual', 'Vũ Hồng Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789265365', 'vuhonghanh98@gmail.com', NULL, '1990-07-14', 'Nữ', '182 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(177, 'KH-4534', 'individual', 'Lý Lan My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789972163', 'lylanmy20@gmail.com', NULL, '2005-11-07', 'Nữ', '428 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(178, 'KH-64D7', 'individual', 'Phạm Hoàng Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385989392', 'phamhoangkhanh11@gmail.com', NULL, '1997-03-30', 'Nam', '435 Đường Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(179, 'KH-7A91', 'individual', 'Mai Thành Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979677946', 'maithanhkiet57@gmail.com', NULL, '1993-01-11', 'Nam', '65 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(180, 'KH-5F60', 'individual', 'Lý Quang Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0762565377', 'lyquangkiet52@gmail.com', NULL, '1996-06-03', 'Nam', '65 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(181, 'KH-E84D', 'individual', 'Hoàng Mạnh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0919526801', 'hoangmanhquan38@gmail.com', NULL, '1995-01-26', 'Nam', '234 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(182, 'KH-D59C', 'individual', 'Đỗ Lan Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0819343375', 'dolangiang85@gmail.com', NULL, '2002-01-04', 'Nữ', '122 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(183, 'KH-2546', 'individual', 'Lâm Tiến Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838427428', 'lamtienquan52@gmail.com', NULL, '1985-12-02', 'Nam', '165 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(184, 'KH-C1E9', 'individual', 'Dương Nhật Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325649628', 'duongnhatson25@gmail.com', NULL, '1981-11-26', 'Nam', '419 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(185, 'KH-779C', 'individual', 'Huỳnh Hoài Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708148729', 'huynhhoaithu76@gmail.com', NULL, '1982-05-15', 'Nữ', '116 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(186, 'KH-D61D', 'individual', 'Đinh Hoàng Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0815747256', 'dinhhoanglam64@gmail.com', NULL, '1998-02-09', 'Nam', '12 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(187, 'KH-1D13', 'individual', 'Đặng Hữu Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760654653', 'danghuunam59@gmail.com', NULL, '1975-12-11', 'Nam', '419 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(188, 'KH-43F5', 'individual', 'Lý Tiến Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833328347', 'lytiendong33@gmail.com', NULL, '1986-01-12', 'Nam', '373 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(189, 'KH-9579', 'individual', 'Đinh Lan Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938021394', 'dinhlanphuong67@gmail.com', NULL, '1991-08-12', 'Nữ', '107 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(190, 'KH-2174', 'individual', 'Phan Tuấn Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939752499', 'phantuantuan56@gmail.com', NULL, '1982-09-02', 'Nam', '71 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(191, 'KH-D8E0', 'individual', 'Hoàng Văn Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0834142171', 'hoangvandong89@gmail.com', NULL, '1996-11-19', 'Nam', '251 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(192, 'KH-BA3D', 'individual', 'Lê Mai Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0788198741', 'lemaidung44@gmail.com', NULL, '1982-12-24', 'Nữ', '244 Đường Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(193, 'KH-4184', 'individual', 'Huỳnh Mạnh Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799875061', 'huynhmanhkhanh97@gmail.com', NULL, '1994-03-26', 'Nam', '276 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(194, 'KH-A9EB', 'individual', 'Đinh Hoàng Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0767960507', 'dinhhoangdong92@gmail.com', NULL, '1989-01-17', 'Nam', '345 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(195, 'KH-B289', 'individual', 'Lâm Cát Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0781532081', 'lamcatmai90@gmail.com', NULL, '2004-09-02', 'Nữ', '325 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(196, 'KH-6E89', 'individual', 'Vũ Nhật Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913024308', 'vunhatquan47@gmail.com', NULL, '1990-09-09', 'Nam', '124 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(197, 'KH-074C', 'individual', 'Đinh Lan An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0888988728', 'dinhlanan20@gmail.com', NULL, '2007-10-05', 'Nữ', '361 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(198, 'KH-7095', 'individual', 'Lý Bích Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835497136', 'lybichyen33@gmail.com', NULL, '2007-12-17', 'Nữ', '235 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(199, 'KH-3F76', 'individual', 'Hồ Khánh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818843639', 'hokhanhquan69@gmail.com', NULL, '1993-10-08', 'Nam', '276 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(200, 'KH-42D1', 'individual', 'Mai Tuấn Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849166445', 'maituangiang97@gmail.com', NULL, '2003-11-19', 'Nam', '392 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(201, 'KH-5EAF', 'individual', 'Hồ Thu Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0880902536', 'hothuhoa76@gmail.com', NULL, '1992-01-23', 'Nữ', '340 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(202, 'KH-54E0', 'individual', 'Phạm Thảo Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320014365', 'phamthaoquynh21@gmail.com', NULL, '1993-07-23', 'Nữ', '287 Đường Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(203, 'KH-93A4', 'individual', 'Phùng Quang Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818850267', 'phungquangdat88@gmail.com', NULL, '1992-10-30', 'Nam', '250 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(204, 'KH-7713', 'individual', 'Vũ Xuân Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0908153046', 'vuxuanvinh50@gmail.com', NULL, '2005-04-05', 'Nam', '254 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(205, 'KH-5FF8', 'individual', 'Vũ Khánh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821592892', 'vukhanhanh25@gmail.com', NULL, '1990-01-26', 'Nam', '154 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(206, 'KH-D6C0', 'individual', 'Lý Thành Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971805710', 'lythanhhuy36@gmail.com', NULL, '1995-09-02', 'Nam', '84 Đường Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(207, 'KH-8213', 'individual', 'Ngô Minh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0902437710', 'ngominhquan49@gmail.com', NULL, '1987-05-19', 'Nam', '113 Đường Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(208, 'KH-2C63', 'individual', 'Đặng Thành Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0706422886', 'dangthanhphong30@gmail.com', NULL, '1983-01-20', 'Nam', '259 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(209, 'KH-51F2', 'individual', 'Lý Thị Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0782856510', 'lythilien59@gmail.com', NULL, '1996-09-21', 'Nữ', '204 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(210, 'KH-4050', 'individual', 'Đỗ Hữu Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987156341', 'dohuuhai62@gmail.com', NULL, '2000-03-27', 'Nam', '160 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(211, 'KH-6C85', 'individual', 'Võ Cát Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0390021083', 'vocattruc96@gmail.com', NULL, '1980-11-02', 'Nữ', '90 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(212, 'KH-09C9', 'individual', 'Bùi Anh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0763422310', 'buianhtung17@gmail.com', NULL, '1985-12-16', 'Nam', '17 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(213, 'KH-09CF', 'individual', 'Dương Minh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931687911', 'duongminhthai93@gmail.com', NULL, '2005-04-25', 'Nam', '258 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(214, 'KH-8B8F', 'individual', 'Hồ Xuân Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0836277288', 'hoxuankiet21@gmail.com', NULL, '2007-07-12', 'Nam', '16 Đường Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(215, 'KH-3C6E', 'individual', 'Đặng Hoàng Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381707033', 'danghoangvinh94@gmail.com', NULL, '1981-12-13', 'Nam', '377 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(216, 'KH-21B7', 'individual', 'Mai Quỳnh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0352299825', 'maiquynhcuc41@gmail.com', NULL, '2005-10-14', 'Nữ', '238 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(217, 'KH-0EDC', 'individual', 'Hoàng Như Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359846732', 'hoangnhuhanh96@gmail.com', NULL, '1995-04-02', 'Nữ', '144 Đường Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(218, 'KH-8224', 'individual', 'Vũ Quỳnh My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0379348077', 'vuquynhmy12@gmail.com', NULL, '1987-06-02', 'Nữ', '147 Đường Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(219, 'KH-439D', 'individual', 'Phùng Anh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359441703', 'phunganhkhoa74@gmail.com', NULL, '1999-06-29', 'Nam', '109 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(220, 'KH-C175', 'individual', 'Hoàng Như Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855263225', 'hoangnhulinh31@gmail.com', NULL, '1985-03-25', 'Nữ', '387 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(221, 'KH-A50B', 'individual', 'Đinh Quang Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900976303', 'dinhquangminh85@gmail.com', NULL, '1995-08-03', 'Nam', '156 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(222, 'KH-1C2B', 'individual', 'Hồ Khánh Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785854634', 'hokhanhquynh81@gmail.com', NULL, '1995-09-28', 'Nữ', '180 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(223, 'KH-A1FB', 'individual', 'Huỳnh Minh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0886137855', 'huynhminhanh90@gmail.com', NULL, '1975-09-12', 'Nam', '282 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(224, 'KH-204A', 'individual', 'Bùi Quang Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855299888', 'buiquangduc23@gmail.com', NULL, '1990-07-09', 'Nam', '138 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(225, 'KH-E5A0', 'individual', 'Mai Thị An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0960698465', 'maithian56@gmail.com', NULL, '2008-01-22', 'Nữ', '69 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(226, 'KH-4E17', 'individual', 'Lý Quỳnh Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0949676691', 'lyquynhtuyen40@gmail.com', NULL, '2002-09-05', 'Nữ', '219 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(227, 'KH-9EAA', 'individual', 'Huỳnh Diệu Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0348861258', 'huynhdieuoanh69@gmail.com', NULL, '2007-09-27', 'Nữ', '227 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(228, 'KH-DEE0', 'individual', 'Lê Lan Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0323059469', 'lelanthu82@gmail.com', NULL, '1992-11-25', 'Nữ', '353 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(229, 'KH-E0F0', 'individual', 'Nguyễn Quốc Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339828512', 'nguyenquocvinh11@gmail.com', NULL, '1989-08-08', 'Nam', '29 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(230, 'KH-E0E2', 'individual', 'Lý Ngọc Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329007546', 'lyngoccuc94@gmail.com', NULL, '1995-04-29', 'Nữ', '295 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(231, 'KH-4D3E', 'individual', 'Đặng Văn Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0982820581', 'dangvantung60@gmail.com', NULL, '1982-02-02', 'Nam', '198 Đường Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(232, 'KH-CAD4', 'individual', 'Lê Phương An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0846100402', 'lephuongan61@gmail.com', NULL, '1995-02-06', 'Nữ', '298 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(233, 'KH-93FC', 'individual', 'Vũ Khánh Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0911765000', 'vukhanhkhanh58@gmail.com', NULL, '2002-03-05', 'Nam', '151 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(234, 'KH-54FE', 'individual', 'Phạm Đức Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777107327', 'phamducvinh47@gmail.com', NULL, '1999-03-11', 'Nam', '415 Đường Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(235, 'KH-E622', 'individual', 'Nguyễn Hoàng Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0700143483', 'nguyenhoangnam14@gmail.com', NULL, '1983-03-09', 'Nam', '280 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(236, 'KH-40DF', 'individual', 'Hoàng Quốc Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760012738', 'hoangquoctuan85@gmail.com', NULL, '1977-08-02', 'Nam', '344 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(237, 'KH-1163', 'individual', 'Nguyễn Hồng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0709004758', 'nguyenhonganh83@gmail.com', NULL, '1996-10-02', 'Nữ', '338 Đường Bùi Thị Xuân, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(238, 'KH-F347', 'individual', 'Bùi Trọng Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350846719', 'buitrongdat29@gmail.com', NULL, '1993-12-29', 'Nam', '283 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(239, 'KH-5872', 'individual', 'Đỗ Hoài Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0357916020', 'dohoaihuong96@gmail.com', NULL, '1976-05-01', 'Nữ', '430 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(240, 'KH-9809', 'individual', 'Đặng Quang Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703238091', 'dangquangbao69@gmail.com', NULL, '1978-06-30', 'Nam', '284 Đường Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(241, 'KH-AB7C', 'individual', 'Lâm Phương Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0914688272', 'lamphuonglien87@gmail.com', NULL, '1978-08-22', 'Nữ', '378 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(242, 'KH-1E7E', 'individual', 'Vũ Nhật Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395689426', 'vunhatquang97@gmail.com', NULL, '2003-05-18', 'Nam', '166 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(243, 'KH-125E', 'individual', 'Phan Thu Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331299727', 'phanthulan95@gmail.com', NULL, '1990-05-14', 'Nữ', '48 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(244, 'KH-D3CF', 'individual', 'Đinh Thảo Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361181329', 'dinhthaohang87@gmail.com', NULL, '1985-07-29', 'Nữ', '112 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(245, 'KH-B53F', 'individual', 'Lê Thu Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0367488438', 'lethumai11@gmail.com', NULL, '1976-01-03', 'Nữ', '300 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(246, 'KH-0F18', 'individual', 'Phạm Quang Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820879762', 'phamquangphuc43@gmail.com', NULL, '2006-08-10', 'Nam', '397 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(247, 'KH-AABE', 'individual', 'Dương Tiến Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0960060013', 'duongtienlong63@gmail.com', NULL, '1982-04-26', 'Nam', '226 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(248, 'KH-B9B0', 'individual', 'Đỗ Thành Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848681899', 'dothanhnam65@gmail.com', NULL, '1992-11-25', 'Nam', '95 Đường Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(249, 'KH-8F5B', 'individual', 'Hoàng Trọng Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349939461', 'hoangtrongdong73@gmail.com', NULL, '2000-01-27', 'Nam', '340 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(250, 'KH-6ECC', 'individual', 'Ngô Phương Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0781133699', 'ngophuonglien65@gmail.com', NULL, '1989-07-13', 'Nữ', '34 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(251, 'KH-EC88', 'individual', 'Võ Xuân Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986126869', 'voxuanhung63@gmail.com', NULL, '2000-10-02', 'Nam', '244 Đường Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(252, 'KH-6D74', 'individual', 'Dương Thành Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0794285797', 'duongthanhdat80@gmail.com', NULL, '1982-06-21', 'Nam', '437 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(253, 'KH-B17A', 'individual', 'Lâm Thành Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962578010', 'lamthanhquang70@gmail.com', NULL, '2001-11-16', 'Nam', '156 Đường Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(254, 'KH-6E7F', 'individual', 'Võ Quỳnh Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0337186738', 'voquynhtrinh64@gmail.com', NULL, '1982-07-04', 'Nữ', '400 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(255, 'KH-4E37', 'individual', 'Vũ Thành Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0356119537', 'vuthanhtung21@gmail.com', NULL, '1999-08-11', 'Nam', '137 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(256, 'KH-CE8C', 'individual', 'Bùi Duy Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0795051617', 'buiduylong44@gmail.com', NULL, '1995-06-19', 'Nam', '221 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(257, 'KH-3DEB', 'individual', 'Hoàng Tuyết Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0811142299', 'hoangtuyetvy15@gmail.com', NULL, '1982-04-20', 'Nữ', '134 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(258, 'KH-93DA', 'individual', 'Lý Tuấn Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940317121', 'lytuanminh90@gmail.com', NULL, '1983-08-18', 'Nam', '422 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(259, 'KH-1104', 'individual', 'Hoàng Bảo Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329658829', 'hoangbaocuong19@gmail.com', NULL, '2007-05-12', 'Nam', '237 Đường Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(260, 'KH-BFCA', 'individual', 'Dương Cẩm Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913470416', 'duongcamhang60@gmail.com', NULL, '1982-06-10', 'Nữ', '81 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(261, 'KH-FC73', 'individual', 'Lê Đức Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988665585', 'leducdong49@gmail.com', NULL, '1996-10-08', 'Nam', '372 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(262, 'KH-858A', 'individual', 'Vũ Hoài Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0784697377', 'vuhoaianh35@gmail.com', NULL, '1994-09-25', 'Nữ', '271 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(263, 'KH-EE07', 'individual', 'Lý Hồng An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913642156', 'lyhongan37@gmail.com', NULL, '1992-08-15', 'Nữ', '371 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(264, 'KH-D85D', 'individual', 'Hoàng Minh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0788589665', 'hoangminhviet59@gmail.com', NULL, '1996-06-11', 'Nam', '89 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(265, 'KH-7E09', 'individual', 'Đỗ Cát Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777908037', 'docatthao85@gmail.com', NULL, '1980-09-27', 'Nữ', '293 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(266, 'KH-5717', 'individual', 'Đinh Thị Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0367527592', 'dinhthigiang58@gmail.com', NULL, '1991-07-26', 'Nữ', '8 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(267, 'KH-B0D7', 'individual', 'Phạm Bích Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338627229', 'phambichvan99@gmail.com', NULL, '1984-08-01', 'Nữ', '122 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(268, 'KH-0054', 'individual', 'Nguyễn Tuấn Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855765733', 'nguyentuanduc70@gmail.com', NULL, '1989-08-02', 'Nam', '426 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(269, 'KH-0355', 'individual', 'Mai Khánh Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768876866', 'maikhanhminh88@gmail.com', NULL, '1991-12-22', 'Nam', '333 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(270, 'KH-33E0', 'individual', 'Đinh Cẩm Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0841383572', 'dinhcamlien21@gmail.com', NULL, '1985-02-04', 'Nữ', '60 Đường Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(271, 'KH-D901', 'individual', 'Đỗ Ngọc Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933439249', 'dongochang94@gmail.com', NULL, '1975-09-29', 'Nữ', '239 Đường Hai Bà Trưng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(272, 'KH-0B8A', 'individual', 'Võ Hoài Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934458008', 'vohoaihoa62@gmail.com', NULL, '2005-09-28', 'Nữ', '415 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(273, 'KH-5D47', 'individual', 'Lâm Minh Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372332161', 'lamminhlong38@gmail.com', NULL, '2005-08-30', 'Nam', '315 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(274, 'KH-0625', 'individual', 'Phạm Tiến Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0328614410', 'phamtientuan53@gmail.com', NULL, '2002-11-01', 'Nam', '181 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(275, 'KH-B9BE', 'individual', 'Ngô Minh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962861729', 'ngominhnam75@gmail.com', NULL, '1986-04-04', 'Nam', '366 Đường Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(276, 'KH-69A4', 'individual', 'Bùi Hoài Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938037845', 'buihoaicuc47@gmail.com', NULL, '1979-12-08', 'Nữ', '152 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(277, 'KH-0D0C', 'individual', 'Võ Đức Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760156624', 'voducthinh59@gmail.com', NULL, '2001-10-31', 'Nam', '399 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(278, 'KH-8486', 'individual', 'Phạm Hữu Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0379014725', 'phamhuuthai81@gmail.com', NULL, '1999-09-09', 'Nam', '231 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(279, 'KH-710D', 'individual', 'Mai Thảo Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0346270581', 'maithaolinh26@gmail.com', NULL, '1986-05-04', 'Nữ', '330 Đường Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(280, 'KH-0E9D', 'individual', 'Nguyễn Bảo Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985087892', 'nguyenbaolong48@gmail.com', NULL, '1993-09-14', 'Nam', '179 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(281, 'KH-5931', 'individual', 'Lâm Nhật Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988947456', 'lamnhatminh24@gmail.com', NULL, '1991-02-08', 'Nam', '194 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(282, 'KH-EEE4', 'individual', 'Võ Phương Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938284896', 'vophuonganh87@gmail.com', NULL, '1978-11-05', 'Nữ', '242 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(283, 'KH-BEF1', 'individual', 'Bùi Xuân Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881435578', 'buixuanthai12@gmail.com', NULL, '1982-05-20', 'Nam', '67 Đường Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(284, 'KH-7548', 'individual', 'Dương Tuyết Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0345954373', 'duongtuyettrang11@gmail.com', NULL, '1984-09-17', 'Nữ', '436 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(285, 'KH-83F7', 'individual', 'Huỳnh Duy Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0778229400', 'huynhduylam52@gmail.com', NULL, '1991-03-21', 'Nam', '319 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(286, 'KH-16B9', 'individual', 'Phùng Cẩm Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0771624830', 'phungcamcuc67@gmail.com', NULL, '1979-12-26', 'Nữ', '402 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(287, 'KH-5F26', 'individual', 'Võ Diệu Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913227370', 'vodieuphuong95@gmail.com', NULL, '1978-06-03', 'Nữ', '276 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(288, 'KH-D162', 'individual', 'Võ Mạnh Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0976675812', 'vomanhbao21@gmail.com', NULL, '1990-12-14', 'Nam', '236 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(289, 'KH-020D', 'individual', 'Lâm Tuấn Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376344669', 'lamtuanphuc51@gmail.com', NULL, '1978-01-17', 'Nam', '357 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(290, 'KH-FC92', 'individual', 'Võ Hồng Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360647028', 'vohongngoc15@gmail.com', NULL, '1994-02-04', 'Nữ', '133 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(291, 'KH-7FD0', 'individual', 'Ngô Mai Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365702937', 'ngomaidung73@gmail.com', NULL, '2000-03-07', 'Nữ', '115 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(292, 'KH-4875', 'individual', 'Phùng Quỳnh Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785763068', 'phungquynhhoa15@gmail.com', NULL, '1997-01-05', 'Nữ', '252 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(293, 'KH-AEC6', 'individual', 'Trần Hồng Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909614633', 'tranhonglien83@gmail.com', NULL, '2002-12-13', 'Nữ', '195 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(294, 'KH-FBA1', 'individual', 'Lâm Bích Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820260729', 'lambichlinh41@gmail.com', NULL, '2001-07-04', 'Nữ', '276 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(295, 'KH-EB29', 'individual', 'Trần Cẩm Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764692103', 'trancamquynh88@gmail.com', NULL, '1976-09-08', 'Nữ', '310 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(296, 'KH-7211', 'individual', 'Lê Ngọc Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0322854329', 'lengochuong17@gmail.com', NULL, '1998-03-30', 'Nữ', '329 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(297, 'KH-336C', 'individual', 'Huỳnh Thu Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850971375', 'huynhthungoc82@gmail.com', NULL, '1985-05-16', 'Nữ', '144 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(298, 'KH-59F0', 'individual', 'Phạm Thành Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0967054612', 'phamthanhquan76@gmail.com', NULL, '1996-11-06', 'Nam', '335 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(299, 'KH-1BBC', 'individual', 'Ngô Hữu Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933194139', 'ngohuukhoa53@gmail.com', NULL, '1995-04-17', 'Nam', '420 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(300, 'KH-AD0B', 'individual', 'Hồ Ngọc Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940044053', 'hongoctuyen16@gmail.com', NULL, '2007-08-02', 'Nữ', '259 Đường Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(301, 'KH-581E', 'individual', 'Phùng Quốc Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0326997972', 'phungquochai81@gmail.com', NULL, '1990-11-22', 'Nam', '450 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(302, 'KH-6613', 'individual', 'Hoàng Cẩm An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394130970', 'hoangcaman62@gmail.com', NULL, '1994-01-02', 'Nữ', '51 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(303, 'KH-2C2A', 'individual', 'Phùng Tiến Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385163922', 'phungtienhuy93@gmail.com', NULL, '1984-02-11', 'Nam', '301 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(304, 'KH-789C', 'individual', 'Vũ Tuyết Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940536480', 'vutuyetvy84@gmail.com', NULL, '2001-07-10', 'Nữ', '432 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(305, 'KH-2E0B', 'individual', 'Phùng Đức Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387965200', 'phungductung69@gmail.com', NULL, '1995-11-10', 'Nam', '383 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(306, 'KH-4715', 'individual', 'Phạm Thu Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856265341', 'phamthuthao43@gmail.com', NULL, '2003-11-19', 'Nữ', '83 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(307, 'KH-B5D7', 'individual', 'Đỗ Hoài Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963078926', 'dohoaicuc68@gmail.com', NULL, '1985-03-26', 'Nữ', '88 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(308, 'KH-16F2', 'individual', 'Trần Như Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761369885', 'trannhulinh42@gmail.com', NULL, '2000-04-06', 'Nữ', '180 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(309, 'KH-6AB6', 'individual', 'Đặng Thành Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0798109086', 'dangthanhthinh64@gmail.com', NULL, '1982-06-28', 'Nam', '61 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(310, 'KH-AAEF', 'individual', 'Phạm Thảo Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0816990343', 'phamthaoha45@gmail.com', NULL, '1994-10-10', 'Nữ', '346 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(311, 'KH-8BBE', 'individual', 'Đinh Mai Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972450187', 'dinhmaichi25@gmail.com', NULL, '1986-09-01', 'Nữ', '84 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(312, 'KH-3FE5', 'individual', 'Nguyễn Trọng Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770524435', 'nguyentrongtung96@gmail.com', NULL, '1978-11-11', 'Nam', '408 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(313, 'KH-B969', 'individual', 'Trần Như An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774877694', 'trannhuan11@gmail.com', NULL, '1997-03-31', 'Nữ', '291 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(314, 'KH-4D61', 'individual', 'Đặng Bảo Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0322107905', 'dangbaokiet46@gmail.com', NULL, '2000-12-14', 'Nam', '232 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(315, 'KH-5640', 'individual', 'Đặng Như Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963221331', 'dangnhuphuong47@gmail.com', NULL, '1989-03-05', 'Nữ', '75 Đường Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(316, 'KH-9397', 'individual', 'Hồ Quang Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0859019729', 'hoquangtrung54@gmail.com', NULL, '2000-02-12', 'Nam', '272 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(317, 'KH-F54B', 'individual', 'Hồ Khánh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372746389', 'hokhanhkhoa75@gmail.com', NULL, '2001-03-23', 'Nam', '93 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(318, 'KH-2FB7', 'individual', 'Phạm Như Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355276883', 'phamnhungoc34@gmail.com', NULL, '1977-03-11', 'Nữ', '375 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(319, 'KH-5289', 'individual', 'Trần Nhật Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883170729', 'trannhatphuc59@gmail.com', NULL, '2003-08-20', 'Nam', '165 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(320, 'KH-FF94', 'individual', 'Hồ Khánh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916982495', 'hokhanhtung85@gmail.com', NULL, '1988-12-15', 'Nam', '31 Đường Bùi Thị Xuân, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(321, 'KH-08D0', 'individual', 'Vũ Thu Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0367966866', 'vuthutrang18@gmail.com', NULL, '1997-09-28', 'Nữ', '237 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(322, 'KH-1EEA', 'individual', 'Đinh Anh Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0382057729', 'dinhanhgiang28@gmail.com', NULL, '2007-03-26', 'Nam', '11 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(323, 'KH-B9A9', 'individual', 'Hoàng Phương Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907382133', 'hoangphuongthao14@gmail.com', NULL, '1994-06-23', 'Nữ', '56 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(324, 'KH-FB39', 'individual', 'Phạm Cát Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0983711059', 'phamcattruc79@gmail.com', NULL, '1978-04-02', 'Nữ', '232 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(325, 'KH-C50C', 'individual', 'Võ Thị Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883980614', 'vothicuc71@gmail.com', NULL, '1987-02-21', 'Nữ', '288 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(326, 'KH-8F0F', 'individual', 'Ngô Ngọc Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761295944', 'ngongoctruc50@gmail.com', NULL, '2006-11-19', 'Nữ', '337 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(327, 'KH-01B6', 'individual', 'Hồ Thành Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0341545054', 'hothanhdat31@gmail.com', NULL, '2002-12-17', 'Nam', '224 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(328, 'KH-37F8', 'individual', 'Lê Hoàng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835039232', 'lehoanganh64@gmail.com', NULL, '1979-10-26', 'Nam', '97 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(329, 'KH-F880', 'individual', 'Dương Quang Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845189152', 'duongquanganh20@gmail.com', NULL, '1991-05-03', 'Nam', '369 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(330, 'KH-7FEA', 'individual', 'Vũ Mạnh Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0705438836', 'vumanhthinh47@gmail.com', NULL, '1990-09-22', 'Nam', '200 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(331, 'KH-2A4C', 'individual', 'Nguyễn Hoài Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0843339097', 'nguyenhoaiha23@gmail.com', NULL, '1989-05-16', 'Nữ', '297 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(332, 'KH-EA44', 'individual', 'Vũ Như Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389617625', 'vunhutrinh17@gmail.com', NULL, '2003-07-26', 'Nữ', '400 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(333, 'KH-88C5', 'individual', 'Võ Xuân Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0932514510', 'voxuancuong48@gmail.com', NULL, '1998-02-09', 'Nam', '353 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(334, 'KH-7A0F', 'individual', 'Đặng Trọng Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0910164552', 'dangtrongbinh93@gmail.com', NULL, '1987-08-03', 'Nam', '90 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(335, 'KH-2E53', 'individual', 'Ngô Trọng Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0382954316', 'ngotronghai34@gmail.com', NULL, '1978-12-11', 'Nam', '406 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(336, 'KH-E2E5', 'individual', 'Đặng Thảo Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0781155480', 'dangthaolinh93@gmail.com', NULL, '1985-10-29', 'Nữ', '51 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(337, 'KH-1CF2', 'individual', 'Lâm Trọng Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0766665684', 'lamtrongtuan98@gmail.com', NULL, '2000-07-11', 'Nam', '338 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(338, 'KH-EEF9', 'individual', 'Nguyễn Minh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0356730458', 'nguyenminhtung84@gmail.com', NULL, '1982-06-22', 'Nam', '320 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(339, 'KH-43C8', 'individual', 'Đỗ Tuấn Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981223346', 'dotuanlam82@gmail.com', NULL, '1985-05-29', 'Nam', '19 Đường Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(340, 'KH-1B2B', 'individual', 'Lâm Tuấn Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708915414', 'lamtuanhai14@gmail.com', NULL, '1983-04-05', 'Nam', '61 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(341, 'KH-2992', 'individual', 'Trần Quốc Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0858004548', 'tranquocduc45@gmail.com', NULL, '1978-12-17', 'Nam', '177 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(342, 'KH-E673', 'individual', 'Phan Phương Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332438852', 'phanphuonghoa37@gmail.com', NULL, '1996-01-11', 'Nữ', '265 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(343, 'KH-CA27', 'individual', 'Vũ Như Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799556179', 'vunhuvan77@gmail.com', NULL, '1991-06-13', 'Nữ', '312 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(344, 'KH-5B82', 'individual', 'Đỗ Quốc Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0854305601', 'doquoclam51@gmail.com', NULL, '2003-07-29', 'Nam', '436 Đường Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(345, 'KH-EB0C', 'individual', 'Phan Ngọc Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828684701', 'phanngocchi42@gmail.com', NULL, '2005-02-24', 'Nữ', '230 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(346, 'KH-D3D3', 'individual', 'Nguyễn Hồng Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383438911', 'nguyenhongtuyet37@gmail.com', NULL, '1979-11-10', 'Nữ', '229 Đường Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(347, 'KH-A8CA', 'individual', 'Lâm Đức Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338322364', 'lamductrung38@gmail.com', NULL, '1977-11-02', 'Nam', '334 Đường Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(348, 'KH-AD21', 'individual', 'Dương Khánh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940394364', 'duongkhanhhung55@gmail.com', NULL, '1996-07-17', 'Nam', '73 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(349, 'KH-4CD4', 'individual', 'Đặng Anh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366467822', 'danganhnam93@gmail.com', NULL, '1992-09-02', 'Nam', '404 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(350, 'KH-D431', 'individual', 'Võ Cẩm Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0397848828', 'vocamthao78@gmail.com', NULL, '1991-10-18', 'Nữ', '215 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(351, 'KH-1167', 'individual', 'Hoàng Tuấn Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0351122933', 'hoangtuanminh61@gmail.com', NULL, '1981-06-07', 'Nam', '225 Đường Bùi Thị Xuân, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(352, 'KH-C470', 'individual', 'Bùi Ngọc An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350772039', 'buingocan88@gmail.com', NULL, '1976-09-27', 'Nữ', '151 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(353, 'KH-58F4', 'individual', 'Lâm Bảo Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0384125002', 'lambaobinh85@gmail.com', NULL, '1997-09-22', 'Nam', '429 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(354, 'KH-F1A5', 'individual', 'Hồ Quốc Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708588032', 'hoquockhoa77@gmail.com', NULL, '1984-05-06', 'Nam', '404 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(355, 'KH-2542', 'individual', 'Ngô Bích Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907084707', 'ngobichoanh47@gmail.com', NULL, '1995-11-26', 'Nữ', '219 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(356, 'KH-A3C8', 'individual', 'Trần Bích Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850785024', 'tranbichchi85@gmail.com', NULL, '1993-03-31', 'Nữ', '384 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(357, 'KH-7030', 'individual', 'Ngô Mai Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365452223', 'ngomaituyen71@gmail.com', NULL, '1986-01-23', 'Nữ', '209 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(358, 'KH-2A3E', 'individual', 'Bùi Thị Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0834164783', 'buithilan64@gmail.com', NULL, '1978-03-18', 'Nữ', '43 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(359, 'KH-8A7C', 'individual', 'Ngô Cát Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0766185652', 'ngocatphuong27@gmail.com', NULL, '1980-11-04', 'Nữ', '184 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(360, 'KH-1B1B', 'individual', 'Bùi Phương Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355711454', 'buiphuongngoc84@gmail.com', NULL, '1995-11-25', 'Nữ', '139 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(361, 'KH-2FC4', 'individual', 'Vũ Phương Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0326433837', 'vuphuonghang74@gmail.com', NULL, '1991-07-13', 'Nữ', '136 Đường Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(362, 'KH-38E3', 'individual', 'Trần Hồng Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0824384825', 'tranhongtruc96@gmail.com', NULL, '1987-01-16', 'Nữ', '190 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(363, 'KH-213C', 'individual', 'Võ Thị Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0398104679', 'vothivan19@gmail.com', NULL, '1985-03-19', 'Nữ', '195 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(364, 'KH-B16C', 'individual', 'Mai Thu My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387135519', 'maithumy50@gmail.com', NULL, '2002-09-14', 'Nữ', '371 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(365, 'KH-BC6E', 'individual', 'Ngô Tuyết Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360083965', 'ngotuyettrang97@gmail.com', NULL, '1981-04-07', 'Nữ', '33 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(366, 'KH-B3F3', 'individual', 'Phạm Thị Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821256656', 'phamthihoa55@gmail.com', NULL, '1999-09-14', 'Nữ', '159 Đường Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(367, 'KH-BDC3', 'individual', 'Bùi Anh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774521514', 'buianhson32@gmail.com', NULL, '1984-01-10', 'Nam', '4 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(368, 'KH-27A4', 'individual', 'Hoàng Cẩm Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0788393842', 'hoangcamtrinh34@gmail.com', NULL, '1977-05-20', 'Nữ', '293 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(369, 'KH-964D', 'individual', 'Phùng Khánh Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0397540067', 'phungkhanhtrinh24@gmail.com', NULL, '1984-06-09', 'Nữ', '28 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(370, 'KH-4ADB', 'individual', 'Phạm Cát Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343547243', 'phamcatha16@gmail.com', NULL, '2006-07-24', 'Nữ', '236 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(371, 'KH-A62B', 'individual', 'Lê Tuấn Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370669882', 'letuangiang84@gmail.com', NULL, '2000-08-30', 'Nam', '255 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(372, 'KH-C819', 'individual', 'Lê Hồng My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943357667', 'lehongmy86@gmail.com', NULL, '1990-10-28', 'Nữ', '26 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(373, 'KH-AB01', 'individual', 'Mai Anh Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0859973120', 'maianhtan15@gmail.com', NULL, '1986-04-12', 'Nam', '151 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(374, 'KH-9BED', 'individual', 'Trần Cát Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940060532', 'trancathanh34@gmail.com', NULL, '1976-02-01', 'Nữ', '427 Đường Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(375, 'KH-75C1', 'individual', 'Dương Diệu Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0384287592', 'duongdieuchi53@gmail.com', NULL, '2003-08-09', 'Nữ', '38 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(376, 'KH-4FD6', 'individual', 'Lê Thảo Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988273088', 'lethaoha77@gmail.com', NULL, '2002-09-13', 'Nữ', '224 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(377, 'KH-2935', 'individual', 'Mai Diệu Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881611215', 'maidieutrang91@gmail.com', NULL, '1988-10-08', 'Nữ', '427 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(378, 'KH-B58F', 'individual', 'Huỳnh Cẩm Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389830388', 'huynhcamtuyen92@gmail.com', NULL, '2006-02-21', 'Nữ', '228 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(379, 'KH-231A', 'individual', 'Võ Phương Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968723935', 'vophuongtuyet36@gmail.com', NULL, '1976-02-12', 'Nữ', '22 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(380, 'KH-3078', 'individual', 'Dương Hoài Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0822033337', 'duonghoailien40@gmail.com', NULL, '1994-06-10', 'Nữ', '413 Đường Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(381, 'KH-FE93', 'individual', 'Võ Thảo Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340954391', 'vothaochi45@gmail.com', NULL, '1976-08-23', 'Nữ', '393 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(382, 'KH-7FDD', 'individual', 'Huỳnh Trọng Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0966265591', 'huynhtrongphong14@gmail.com', NULL, '1994-10-23', 'Nam', '396 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(383, 'KH-1E5D', 'individual', 'Phan Hữu Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342768322', 'phanhuuson56@gmail.com', NULL, '1982-05-17', 'Nam', '142 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(384, 'KH-D761', 'individual', 'Hồ Hữu Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342512771', 'hohuugiang66@gmail.com', NULL, '2002-06-30', 'Nam', '344 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(385, 'KH-90B6', 'individual', 'Lê Phương Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359323435', 'lephuongcuc31@gmail.com', NULL, '1992-04-18', 'Nữ', '127 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(386, 'KH-6FF9', 'individual', 'Phan Thu Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835682404', 'phanthuanh88@gmail.com', NULL, '2003-12-17', 'Nữ', '65 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(387, 'KH-9A80', 'individual', 'Phan Tiến Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0386159548', 'phantienphong30@gmail.com', NULL, '1987-10-06', 'Nam', '268 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(388, 'KH-3F8C', 'individual', 'Mai Minh Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0364822697', 'maiminhlong56@gmail.com', NULL, '1979-03-06', 'Nam', '283 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(389, 'KH-EC8E', 'individual', 'Dương Hoài My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0932614951', 'duonghoaimy24@gmail.com', NULL, '1991-05-23', 'Nữ', '300 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(390, 'KH-DFD0', 'individual', 'Phạm Tiến Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0975071858', 'phamtienthai61@gmail.com', NULL, '1998-03-26', 'Nam', '407 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(391, 'KH-B020', 'individual', 'Phạm Xuân Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768762300', 'phamxuanhuy55@gmail.com', NULL, '1977-02-02', 'Nam', '432 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(392, 'KH-31A4', 'individual', 'Lê Khánh Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0357637681', 'lekhanhbinh97@gmail.com', NULL, '1993-09-14', 'Nam', '36 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(393, 'KH-6EF7', 'individual', 'Dương Phương Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0766628848', 'duongphuongchi50@gmail.com', NULL, '1986-01-31', 'Nữ', '265 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(394, 'KH-0821', 'individual', 'Nguyễn Cẩm Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0976264581', 'nguyencamlan83@gmail.com', NULL, '2003-11-07', 'Nữ', '38 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(395, 'KH-3DFA', 'individual', 'Phạm Thành Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0346506517', 'phamthanhhoang11@gmail.com', NULL, '2001-02-15', 'Nam', '203 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(396, 'KH-87A3', 'individual', 'Trần Hồng Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0973527701', 'tranhongtrinh71@gmail.com', NULL, '1983-05-19', 'Nữ', '272 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(397, 'KH-A784', 'individual', 'Phạm Bảo Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0947422761', 'phambaokhoa17@gmail.com', NULL, '1989-03-02', 'Nam', '330 Đường Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(398, 'KH-FBD5', 'individual', 'Lý Thị Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933300100', 'lythidao78@gmail.com', NULL, '1976-07-25', 'Nữ', '344 Đường Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(399, 'KH-2C4D', 'individual', 'Vũ Nhật Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818897879', 'vunhatcuong79@gmail.com', NULL, '2002-07-20', 'Nam', '115 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(400, 'KH-47F5', 'individual', 'Dương Bích Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770913093', 'duongbichquynh47@gmail.com', NULL, '1982-11-10', 'Nữ', '104 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(401, 'KH-FB2B', 'individual', 'Lê Cẩm Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985733436', 'lecamgiang60@gmail.com', NULL, '2000-11-05', 'Nữ', '208 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(402, 'KH-32F8', 'individual', 'Mai Cát Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946574854', 'maicatyen10@gmail.com', NULL, '1981-04-19', 'Nữ', '365 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(403, 'KH-2E1C', 'individual', 'Đặng Trọng Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799637624', 'dangtrongminh61@gmail.com', NULL, '1975-09-21', 'Nam', '372 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(404, 'KH-3543', 'individual', 'Ngô Xuân Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963736908', 'ngoxuantrung77@gmail.com', NULL, '1990-12-27', 'Nam', '344 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(405, 'KH-B79B', 'individual', 'Dương Mạnh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0330049937', 'duongmanhnam22@gmail.com', NULL, '1995-07-05', 'Nam', '235 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(406, 'KH-1EF7', 'individual', 'Bùi Phương Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333015121', 'buiphuongngoc50@gmail.com', NULL, '1975-11-16', 'Nữ', '138 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(407, 'KH-8E60', 'individual', 'Hồ Anh Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760782080', 'hoanhphuc65@gmail.com', NULL, '1983-03-27', 'Nam', '327 Đường Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(408, 'KH-9A52', 'individual', 'Dương Quang Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0709544978', 'duongquangtrung11@gmail.com', NULL, '1985-03-05', 'Nam', '125 Đường Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(409, 'KH-41B0', 'individual', 'Hoàng Thảo Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939831667', 'hoangthaohuong28@gmail.com', NULL, '1999-08-05', 'Nữ', '305 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(410, 'KH-1015', 'individual', 'Trần Hoài Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820020865', 'tranhoaichi65@gmail.com', NULL, '2004-06-20', 'Nữ', '447 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(411, 'KH-D255', 'individual', 'Lâm Mai Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0935460648', 'lammailien70@gmail.com', NULL, '1995-03-09', 'Nữ', '113 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(412, 'KH-D580', 'individual', 'Đỗ Khánh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930641232', 'dokhanhthai78@gmail.com', NULL, '1994-06-23', 'Nam', '332 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(413, 'KH-4984', 'individual', 'Dương Trọng Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703080067', 'duongtrongkhoa51@gmail.com', NULL, '1995-12-09', 'Nam', '398 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(414, 'KH-8586', 'individual', 'Đặng Anh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0967079852', 'danganhkhoa25@gmail.com', NULL, '1980-05-15', 'Nam', '379 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(415, 'KH-6E8F', 'individual', 'Vũ Tuyết Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939592170', 'vutuyetthu66@gmail.com', NULL, '2001-01-23', 'Nữ', '203 Đường Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(416, 'KH-70F4', 'individual', 'Ngô Quốc Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0969065134', 'ngoquocnam96@gmail.com', NULL, '1991-10-30', 'Nam', '312 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(417, 'KH-01A8', 'individual', 'Phùng Quang Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838699490', 'phungquangson82@gmail.com', NULL, '1978-02-15', 'Nam', '88 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(418, 'KH-75C8', 'individual', 'Lâm Đức Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0788586587', 'lamductrung77@gmail.com', NULL, '1997-04-17', 'Nam', '143 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(419, 'KH-4977', 'individual', 'Lý Anh Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939255139', 'lyanhgiang23@gmail.com', NULL, '1997-04-15', 'Nam', '266 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(420, 'KH-BBD1', 'individual', 'Vũ Đức Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329468908', 'vuductrung45@gmail.com', NULL, '1977-08-10', 'Nam', '279 Đường Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(421, 'KH-C3A8', 'individual', 'Đỗ Khánh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0887538416', 'dokhanhthai47@gmail.com', NULL, '1996-04-16', 'Nam', '325 Đường Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(422, 'KH-9599', 'individual', 'Phạm Thành Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821884370', 'phamthanhhuy81@gmail.com', NULL, '1999-07-19', 'Nam', '182 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(423, 'KH-E76B', 'individual', 'Phan Hữu Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381442555', 'phanhuucuong99@gmail.com', NULL, '2000-03-07', 'Nam', '255 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(424, 'KH-35BC', 'individual', 'Lâm Thành Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0396306570', 'lamthanhquan59@gmail.com', NULL, '1987-11-19', 'Nam', '22 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(425, 'KH-2074', 'individual', 'Hồ Bích Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931678755', 'hobichtrinh11@gmail.com', NULL, '1988-06-02', 'Nữ', '125 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(426, 'KH-B491', 'individual', 'Lâm Thảo Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381372403', 'lamthaotrang89@gmail.com', NULL, '1999-09-26', 'Nữ', '446 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(427, 'KH-D45C', 'individual', 'Lê Bảo Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0935564230', 'lebaolam22@gmail.com', NULL, '1975-12-13', 'Nam', '426 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(428, 'KH-69B0', 'individual', 'Nguyễn Quang Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360479754', 'nguyenquangthinh75@gmail.com', NULL, '1975-10-08', 'Nam', '292 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(429, 'KH-BE57', 'individual', 'Bùi Bích An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380822228', 'buibichan15@gmail.com', NULL, '1980-07-10', 'Nữ', '81 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(430, 'KH-6309', 'individual', 'Hoàng Thành Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366742387', 'hoangthanhlam99@gmail.com', NULL, '1993-01-30', 'Nam', '11 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(431, 'KH-5CB6', 'individual', 'Lý Anh Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0811918973', 'lyanhdong52@gmail.com', NULL, '1982-12-07', 'Nam', '74 Đường Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(432, 'KH-4BAF', 'individual', 'Hồ Hoài Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981914317', 'hohoaihang98@gmail.com', NULL, '1977-06-19', 'Nữ', '289 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(433, 'KH-F67A', 'individual', 'Lê Quang Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0908492178', 'lequanghoang71@gmail.com', NULL, '1983-02-12', 'Nam', '63 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(434, 'KH-BDE2', 'individual', 'Vũ Xuân Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987142619', 'vuxuankiet58@gmail.com', NULL, '1997-03-01', 'Nam', '396 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(435, 'KH-5A3C', 'individual', 'Đinh Quốc Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0982459315', 'dinhquochai82@gmail.com', NULL, '1980-06-21', 'Nam', '254 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(436, 'KH-E552', 'individual', 'Lý Nhật Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764884263', 'lynhathuy47@gmail.com', NULL, '1988-03-15', 'Nam', '414 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(437, 'KH-52CE', 'individual', 'Bùi Hoàng Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0859720379', 'buihoangtrung39@gmail.com', NULL, '1975-06-10', 'Nam', '321 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(438, 'KH-E423', 'individual', 'Ngô Cát Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931271094', 'ngocatcuc19@gmail.com', NULL, '1998-05-25', 'Nữ', '180 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(439, 'KH-071F', 'individual', 'Võ Khánh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0393603794', 'vokhanhthai85@gmail.com', NULL, '2004-06-05', 'Nam', '169 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(440, 'KH-7B8A', 'individual', 'Ngô Thị Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0966654574', 'ngothilan51@gmail.com', NULL, '1982-03-03', 'Nữ', '424 Đường Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(441, 'KH-A39C', 'individual', 'Võ Thảo My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946965222', 'vothaomy55@gmail.com', NULL, '1985-10-21', 'Nữ', '422 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(442, 'KH-E693', 'individual', 'Đặng Bảo Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0388606953', 'dangbaophong84@gmail.com', NULL, '1992-04-24', 'Nam', '310 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(443, 'KH-8296', 'individual', 'Hồ Khánh Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775384732', 'hokhanhhai23@gmail.com', NULL, '2003-12-11', 'Nam', '218 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(444, 'KH-8B22', 'individual', 'Lê Mạnh Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0362995426', 'lemanhdat22@gmail.com', NULL, '1987-05-14', 'Nam', '25 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(445, 'KH-FF77', 'individual', 'Đỗ Thành Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0912867137', 'dothanhdat71@gmail.com', NULL, '1999-08-09', 'Nam', '251 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(446, 'KH-FB66', 'individual', 'Hoàng Quốc Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0766701659', 'hoangquochung41@gmail.com', NULL, '1999-09-24', 'Nam', '291 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(447, 'KH-8D01', 'individual', 'Đinh Quốc Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349179036', 'dinhquochai55@gmail.com', NULL, '2005-06-19', 'Nam', '252 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(448, 'KH-D783', 'individual', 'Lâm Như Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394123418', 'lamnhuhanh57@gmail.com', NULL, '1978-07-10', 'Nữ', '7 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(449, 'KH-501B', 'individual', 'Lê Quang Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394422054', 'lequangbinh81@gmail.com', NULL, '1996-04-08', 'Nam', '164 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(450, 'KH-D67F', 'individual', 'Đặng Hữu Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343175215', 'danghuutrung93@gmail.com', NULL, '1976-06-04', 'Nam', '54 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(451, 'KH-D277', 'individual', 'Dương Minh Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0843279387', 'duongminhlong59@gmail.com', NULL, '1982-09-14', 'Nam', '433 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(452, 'KH-75E9', 'individual', 'Mai Hồng An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848918313', 'maihongan47@gmail.com', NULL, '1993-01-14', 'Nữ', '109 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(453, 'KH-912B', 'individual', 'Huỳnh Mai Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0390029074', 'huynhmaiphuong44@gmail.com', NULL, '1975-06-26', 'Nữ', '417 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(454, 'KH-BD6E', 'individual', 'Hồ Duy Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381178431', 'hoduyhung17@gmail.com', NULL, '2007-07-04', 'Nam', '193 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(455, 'KH-A2A1', 'individual', 'Vũ Quốc Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0778019580', 'vuquocvinh60@gmail.com', NULL, '1999-05-13', 'Nam', '363 Đường Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(456, 'KH-13EE', 'individual', 'Trần Tuyết Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353525485', 'trantuyethanh47@gmail.com', NULL, '1975-06-06', 'Nữ', '449 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(457, 'KH-6F6C', 'individual', 'Dương Quang Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327949612', 'duongquangbinh93@gmail.com', NULL, '2003-02-27', 'Nam', '233 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(458, 'KH-A904', 'individual', 'Nguyễn Mai Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0976294187', 'nguyenmaidung62@gmail.com', NULL, '1988-09-16', 'Nữ', '161 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(459, 'KH-995C', 'individual', 'Lâm Tuyết Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0969519665', 'lamtuyetngoc83@gmail.com', NULL, '1977-02-19', 'Nữ', '191 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(460, 'KH-D442', 'individual', 'Huỳnh Mạnh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0351492813', 'huynhmanhkhoa22@gmail.com', NULL, '1979-07-27', 'Nam', '255 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(461, 'KH-2BD1', 'individual', 'Bùi Thu Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0337871100', 'buithuthu54@gmail.com', NULL, '1976-10-16', 'Nữ', '449 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(462, 'KH-46AC', 'individual', 'Đinh Phương Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789356128', 'dinhphuongvy18@gmail.com', NULL, '1986-05-12', 'Nữ', '279 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(463, 'KH-D1CD', 'individual', 'Ngô Trọng Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0944125922', 'ngotrongphuc62@gmail.com', NULL, '1993-12-02', 'Nam', '114 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(464, 'KH-9E61', 'individual', 'Phùng Cẩm My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0362293394', 'phungcammy16@gmail.com', NULL, '1994-01-18', 'Nữ', '324 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(465, 'KH-950E', 'individual', 'Lý Xuân Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0847798589', 'lyxuanthinh90@gmail.com', NULL, '1989-10-27', 'Nam', '308 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(466, 'KH-6968', 'individual', 'Đặng Minh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0908042710', 'dangminhhung14@gmail.com', NULL, '1985-06-23', 'Nam', '109 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(467, 'KH-FB91', 'individual', 'Hồ Cát Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0321593228', 'hocattruc26@gmail.com', NULL, '2002-06-24', 'Nữ', '283 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(468, 'KH-A58B', 'individual', 'Võ Mạnh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0780646038', 'vomanhviet38@gmail.com', NULL, '1979-06-21', 'Nam', '240 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(469, 'KH-D793', 'individual', 'Phan Đức Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761461998', 'phanducgiang96@gmail.com', NULL, '1990-08-06', 'Nam', '425 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(470, 'KH-AA05', 'individual', 'Lê Xuân Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833121682', 'lexuantuan63@gmail.com', NULL, '2008-05-08', 'Nam', '3 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(471, 'KH-0933', 'individual', 'Hoàng Thị Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0825367581', 'hoangthiha46@gmail.com', NULL, '1993-06-21', 'Nữ', '184 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(472, 'KH-4FD9', 'individual', 'Đỗ Ngọc Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0826028475', 'dongocnhi22@gmail.com', NULL, '1989-06-17', 'Nữ', '177 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(473, 'KH-9EF6', 'individual', 'Trần Hữu Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0392540130', 'tranhuutrung57@gmail.com', NULL, '1987-09-27', 'Nam', '321 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(474, 'KH-48B8', 'individual', 'Lý Khánh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0851879200', 'lykhanhthai78@gmail.com', NULL, '1979-06-10', 'Nam', '126 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(475, 'KH-E2DA', 'individual', 'Phạm Khánh Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0935581721', 'phamkhanhhanh89@gmail.com', NULL, '2005-03-01', 'Nữ', '20 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(476, 'KH-99A1', 'individual', 'Vũ Nhật Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0330042893', 'vunhatanh52@gmail.com', NULL, '1991-10-05', 'Nam', '55 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(477, 'KH-9494', 'individual', 'Hồ Nhật Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372877352', 'honhatviet62@gmail.com', NULL, '1984-12-20', 'Nam', '156 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(478, 'KH-53A4', 'individual', 'Dương Lan Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331499777', 'duonglanhuong65@gmail.com', NULL, '1985-02-25', 'Nữ', '89 Đường Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(479, 'KH-E55C', 'individual', 'Dương Anh Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332216727', 'duonganhkiet14@gmail.com', NULL, '1989-07-30', 'Nam', '197 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(480, 'KH-6B5E', 'individual', 'Võ Như Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372579586', 'vonhuvy84@gmail.com', NULL, '1988-09-28', 'Nữ', '315 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(481, 'KH-1316', 'individual', 'Bùi Hoàng Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821824348', 'buihoangthai52@gmail.com', NULL, '1981-11-11', 'Nam', '347 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(482, 'KH-FBED', 'individual', 'Hoàng Quang Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0328714431', 'hoangquanganh58@gmail.com', NULL, '1982-08-10', 'Nam', '444 Đường Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(483, 'KH-5AB5', 'individual', 'Hồ Trọng Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828622753', 'hotrongtuan90@gmail.com', NULL, '1986-10-14', 'Nam', '318 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(484, 'KH-01CF', 'individual', 'Võ Nhật Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0322973632', 'vonhatkhanh87@gmail.com', NULL, '1985-07-06', 'Nam', '363 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(485, 'KH-82AD', 'individual', 'Trần Ngọc Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799658168', 'tranngoclan14@gmail.com', NULL, '1983-09-04', 'Nữ', '264 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(486, 'KH-F937', 'individual', 'Nguyễn Duy Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0915563508', 'nguyenduyvinh78@gmail.com', NULL, '1996-02-13', 'Nam', '317 Đường Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(487, 'KH-2AE8', 'individual', 'Phan Ngọc Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0859686370', 'phanngocanh15@gmail.com', NULL, '1980-07-16', 'Nữ', '227 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(488, 'KH-A0DB', 'individual', 'Lý Bích Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320454691', 'lybichcuc74@gmail.com', NULL, '2004-10-14', 'Nữ', '3 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(489, 'KH-1006', 'individual', 'Hoàng Tuấn Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0391798701', 'hoangtuannam66@gmail.com', NULL, '2004-06-12', 'Nam', '71 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(490, 'KH-C0E8', 'individual', 'Lâm Thị Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930468598', 'lamthitrinh50@gmail.com', NULL, '1994-08-14', 'Nữ', '115 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(491, 'KH-CE75', 'individual', 'Bùi Cẩm Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943253477', 'buicamlien91@gmail.com', NULL, '2003-01-14', 'Nữ', '242 Đường Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(492, 'KH-D6B5', 'individual', 'Dương Diệu Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0348072276', 'duongdieugiang58@gmail.com', NULL, '1989-10-17', 'Nữ', '43 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(493, 'KH-FFB0', 'individual', 'Đỗ Mạnh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963801079', 'domanhthai78@gmail.com', NULL, '2007-04-16', 'Nam', '425 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(494, 'KH-6B2E', 'individual', 'Lâm Ngọc Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0706897945', 'lamngocphuong42@gmail.com', NULL, '1985-09-11', 'Nữ', '188 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(495, 'KH-ACCD', 'individual', 'Lý Minh Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0825592060', 'lyminhvinh39@gmail.com', NULL, '1997-08-06', 'Nam', '404 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(496, 'KH-4798', 'individual', 'Phùng Quang Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979584184', 'phungquangthai65@gmail.com', NULL, '1991-08-14', 'Nam', '351 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(497, 'KH-8E78', 'individual', 'Phan Mạnh Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0321292371', 'phanmanhkhanh54@gmail.com', NULL, '1980-06-25', 'Nam', '110 Đường Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(498, 'KH-DD20', 'individual', 'Đinh Phương Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0765786410', 'dinhphuongtrinh73@gmail.com', NULL, '1994-11-30', 'Nữ', '27 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(499, 'KH-01BE', 'individual', 'Hoàng Quốc Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769774041', 'hoangquocphong77@gmail.com', NULL, '2007-02-28', 'Nam', '74 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(500, 'KH-CA2E', 'individual', 'Nguyễn Mạnh Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769319986', 'nguyenmanhtuan27@gmail.com', NULL, '1976-11-25', 'Nam', '150 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(501, 'KH-890E', 'individual', 'Bùi Quang Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761539171', 'buiquangkhanh41@gmail.com', NULL, '2005-11-18', 'Nam', '321 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(502, 'KH-2D28', 'individual', 'Ngô Hồng Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349171972', 'ngohongyen85@gmail.com', NULL, '1985-09-01', 'Nữ', '441 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(503, 'KH-00C9', 'individual', 'Nguyễn Thảo Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0978224039', 'nguyenthaotuyet48@gmail.com', NULL, '1982-12-20', 'Nữ', '12 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(504, 'KH-A366', 'individual', 'Võ Tuyết Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785799809', 'votuyetquynh97@gmail.com', NULL, '1985-12-20', 'Nữ', '375 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(505, 'KH-9A0D', 'individual', 'Phạm Duy Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0917777693', 'phamduytrung64@gmail.com', NULL, '1976-10-11', 'Nam', '390 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(506, 'KH-FE29', 'individual', 'Lý Thu Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0795413145', 'lythutrang87@gmail.com', NULL, '1992-06-05', 'Nữ', '355 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(507, 'KH-AAB5', 'individual', 'Trần Hữu Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327901773', 'tranhuuphong30@gmail.com', NULL, '2008-04-11', 'Nam', '75 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(508, 'KH-6033', 'individual', 'Ngô Như Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0337523283', 'ngonhutrinh95@gmail.com', NULL, '1977-01-18', 'Nữ', '39 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(509, 'KH-E86B', 'individual', 'Dương Trọng Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0346479716', 'duongtrongnam24@gmail.com', NULL, '1999-12-27', 'Nam', '360 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(510, 'KH-1AE5', 'individual', 'Huỳnh Thu Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0823728539', 'huynhthungoc90@gmail.com', NULL, '2002-01-07', 'Nữ', '29 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(511, 'KH-2B5F', 'individual', 'Trần Duy Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963311868', 'tranduyphong74@gmail.com', NULL, '2007-03-20', 'Nam', '243 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(512, 'KH-81E8', 'individual', 'Trần Hoàng Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0786523446', 'tranhoanghai30@gmail.com', NULL, '2006-10-25', 'Nam', '426 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(513, 'KH-4B04', 'individual', 'Lâm Thị An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789776070', 'lamthian66@gmail.com', NULL, '1978-12-09', 'Nữ', '276 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(514, 'KH-7A4B', 'individual', 'Đặng Đức Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0984117855', 'dangducminh44@gmail.com', NULL, '1976-09-23', 'Nam', '132 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(515, 'KH-01ED', 'individual', 'Nguyễn Bảo Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333984494', 'nguyenbaotrung20@gmail.com', NULL, '2006-06-05', 'Nam', '287 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(516, 'KH-B569', 'individual', 'Ngô Trọng Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0963155445', 'ngotrongquan51@gmail.com', NULL, '1986-04-22', 'Nam', '395 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(517, 'KH-BD88', 'individual', 'Võ Bảo Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776263092', 'vobaodat88@gmail.com', NULL, '2007-10-14', 'Nam', '112 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(518, 'KH-CD50', 'individual', 'Đỗ Hồng Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389589276', 'dohonggiang37@gmail.com', NULL, '1993-10-19', 'Nữ', '437 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(519, 'KH-873B', 'individual', 'Phùng Quỳnh Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0784266853', 'phungquynhdung63@gmail.com', NULL, '2005-02-16', 'Nữ', '434 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(520, 'KH-5A06', 'individual', 'Phùng Tuyết Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943008188', 'phungtuyettuyet14@gmail.com', NULL, '1983-02-12', 'Nữ', '293 Đường Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(521, 'KH-3AB6', 'individual', 'Phùng Diệu Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986243767', 'phungdieuanh63@gmail.com', NULL, '1977-05-19', 'Nữ', '200 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(522, 'KH-4422', 'individual', 'Phùng Khánh Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900666054', 'phungkhanhphuong43@gmail.com', NULL, '1996-08-21', 'Nữ', '306 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(523, 'KH-C75B', 'individual', 'Ngô Tuấn Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776861842', 'ngotuanminh70@gmail.com', NULL, '2003-02-09', 'Nam', '447 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(524, 'KH-25CF', 'individual', 'Đinh Khánh Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0906127642', 'dinhkhanhoanh66@gmail.com', NULL, '1995-05-07', 'Nữ', '268 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(525, 'KH-58B9', 'individual', 'Ngô Trọng Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343181303', 'ngotronggiang14@gmail.com', NULL, '1990-02-20', 'Nam', '107 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(526, 'KH-7289', 'individual', 'Phùng Thảo Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339080534', 'phungthaochi14@gmail.com', NULL, '1999-07-05', 'Nữ', '29 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(527, 'KH-7FBF', 'individual', 'Mai Tiến Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0772389580', 'maitienphong16@gmail.com', NULL, '1995-08-25', 'Nam', '369 Đường Bùi Thị Xuân, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(528, 'KH-0E93', 'individual', 'Dương Thảo My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0792747666', 'duongthaomy61@gmail.com', NULL, '1976-04-13', 'Nữ', '128 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(529, 'KH-F7FC', 'individual', 'Dương Mạnh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907797675', 'duongmanhhung39@gmail.com', NULL, '1996-10-04', 'Nam', '244 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(530, 'KH-B071', 'individual', 'Lê Tuyết Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0390863778', 'letuyetha26@gmail.com', NULL, '1983-09-29', 'Nữ', '389 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(531, 'KH-632C', 'individual', 'Mai Như Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372069097', 'mainhulan36@gmail.com', NULL, '1990-12-12', 'Nữ', '279 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(532, 'KH-50CC', 'individual', 'Phùng Bảo Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370323672', 'phungbaotan79@gmail.com', NULL, '2005-02-15', 'Nam', '140 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(533, 'KH-AFCF', 'individual', 'Hoàng Hoàng Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913071519', 'hoanghoanghung69@gmail.com', NULL, '1991-04-25', 'Nam', '38 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(534, 'KH-4499', 'individual', 'Ngô Đức Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0886690252', 'ngoduchung67@gmail.com', NULL, '1988-05-06', 'Nam', '27 Đường Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(535, 'KH-42E4', 'individual', 'Võ Diệu An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0814941616', 'vodieuan79@gmail.com', NULL, '1991-09-08', 'Nữ', '125 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(536, 'KH-6AEE', 'individual', 'Huỳnh Lan Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355881626', 'huynhlannhi66@gmail.com', NULL, '1976-12-01', 'Nữ', '161 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(537, 'KH-1040', 'individual', 'Phạm Anh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372086316', 'phamanhhuy43@gmail.com', NULL, '1993-11-16', 'Nam', '85 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(538, 'KH-93E9', 'individual', 'Nguyễn Quỳnh Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0888560511', 'nguyenquynhquynh47@gmail.com', NULL, '2000-07-25', 'Nữ', '51 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(539, 'KH-A559', 'individual', 'Hoàng Như Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0337539862', 'hoangnhutuyen46@gmail.com', NULL, '1996-02-14', 'Nữ', '79 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(540, 'KH-512B', 'individual', 'Huỳnh Khánh Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760530456', 'huynhkhanhbinh47@gmail.com', NULL, '1982-01-14', 'Nam', '392 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(541, 'KH-9752', 'individual', 'Vũ Hữu Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883396593', 'vuhuuvinh66@gmail.com', NULL, '1977-07-11', 'Nam', '139 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(542, 'KH-541B', 'individual', 'Phan Lan Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395298358', 'phanlanhang14@gmail.com', NULL, '1985-12-01', 'Nữ', '249 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(543, 'KH-8A81', 'individual', 'Lê Thu Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339315592', 'lethuanh24@gmail.com', NULL, '2007-10-02', 'Nữ', '344 Đường Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(544, 'KH-4F57', 'individual', 'Đinh Cát Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327245872', 'dinhcatyen62@gmail.com', NULL, '1978-12-14', 'Nữ', '241 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(545, 'KH-EBB4', 'individual', 'Nguyễn Cát Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325976221', 'nguyencattrang95@gmail.com', NULL, '1981-10-09', 'Nữ', '411 Đường Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(546, 'KH-0822', 'individual', 'Phùng Mai Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0906251312', 'phungmaioanh29@gmail.com', NULL, '2002-12-23', 'Nữ', '221 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(547, 'KH-0420', 'individual', 'Đỗ Thu My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0811250387', 'dothumy25@gmail.com', NULL, '2003-01-17', 'Nữ', '346 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(548, 'KH-2932', 'individual', 'Dương Tuấn Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855814982', 'duongtuantung21@gmail.com', NULL, '2006-10-27', 'Nam', '380 Đường Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(549, 'KH-4374', 'individual', 'Đỗ Anh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761602584', 'doanhhung29@gmail.com', NULL, '1985-04-23', 'Nam', '370 Đường Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(550, 'KH-91C5', 'individual', 'Vũ Nhật Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703827629', 'vunhathung12@gmail.com', NULL, '1998-04-27', 'Nam', '439 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(551, 'KH-780A', 'individual', 'Nguyễn Bích Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856062197', 'nguyenbichtrinh38@gmail.com', NULL, '1981-05-27', 'Nữ', '341 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(552, 'KH-0827', 'individual', 'Vũ Cẩm Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0825893043', 'vucamcuc36@gmail.com', NULL, '1995-04-11', 'Nữ', '406 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(553, 'KH-039D', 'individual', 'Lâm Thu Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366825932', 'lamthudung35@gmail.com', NULL, '1998-01-24', 'Nữ', '196 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(554, 'KH-A170', 'individual', 'Mai Khánh Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770244433', 'maikhanhdat67@gmail.com', NULL, '1979-08-20', 'Nam', '389 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(555, 'KH-1299', 'individual', 'Phan Trọng Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389280848', 'phantrongbinh46@gmail.com', NULL, '1984-10-06', 'Nam', '145 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(556, 'KH-831C', 'individual', 'Nguyễn Bảo Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0830078986', 'nguyenbaotan10@gmail.com', NULL, '1980-11-09', 'Nam', '428 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(557, 'KH-7AC5', 'individual', 'Lý Duy Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353317127', 'lyduytan23@gmail.com', NULL, '1999-01-24', 'Nam', '271 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(558, 'KH-9C22', 'individual', 'Đặng Văn Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939157241', 'dangvanlong83@gmail.com', NULL, '1989-09-05', 'Nam', '385 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(559, 'KH-F4F5', 'individual', 'Hoàng Hoài Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327874320', 'hoanghoaiphuong57@gmail.com', NULL, '1976-01-15', 'Nữ', '202 Đường Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(560, 'KH-6034', 'individual', 'Đỗ Hoàng Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361804166', 'dohoanggiang35@gmail.com', NULL, '1978-12-28', 'Nam', '11 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(561, 'KH-9A8B', 'individual', 'Ngô Minh Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365313899', 'ngominhtien16@gmail.com', NULL, '1987-06-26', 'Nam', '16 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(562, 'KH-394E', 'individual', 'Phan Khánh Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0811612293', 'phankhanhmai50@gmail.com', NULL, '1980-12-18', 'Nữ', '81 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(563, 'KH-C2A2', 'individual', 'Lâm Hữu Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0967418568', 'lamhuukiet75@gmail.com', NULL, '1990-07-28', 'Nam', '416 Đường Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(564, 'KH-A2B7', 'individual', 'Phùng Tiến Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839775793', 'phungtienkiet19@gmail.com', NULL, '2007-08-26', 'Nam', '38 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(565, 'KH-9288', 'individual', 'Dương Quang Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968015832', 'duongquangphuc71@gmail.com', NULL, '1998-07-06', 'Nam', '389 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(566, 'KH-74BA', 'individual', 'Võ Ngọc Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0348154936', 'vongocmai24@gmail.com', NULL, '1993-02-10', 'Nữ', '134 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(567, 'KH-499A', 'individual', 'Phạm Như Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363257078', 'phamnhutruc64@gmail.com', NULL, '1983-08-10', 'Nữ', '248 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(568, 'KH-E149', 'individual', 'Ngô Quỳnh Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889878421', 'ngoquynhlan31@gmail.com', NULL, '1998-12-15', 'Nữ', '193 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(569, 'KH-F0C3', 'individual', 'Vũ Mai Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0817224020', 'vumaiphuong79@gmail.com', NULL, '1991-01-02', 'Nữ', '29 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(570, 'KH-5603', 'individual', 'Trần Quang Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0707646643', 'tranquangviet98@gmail.com', NULL, '1982-11-19', 'Nam', '203 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(571, 'KH-A4FF', 'individual', 'Đặng Thị Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845852345', 'dangthivan54@gmail.com', NULL, '2006-11-17', 'Nữ', '342 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(572, 'KH-5DEF', 'individual', 'Lê Tuyết Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0973264519', 'letuyetdao39@gmail.com', NULL, '1987-04-22', 'Nữ', '178 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(573, 'KH-C33B', 'individual', 'Trần Văn Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0362848110', 'tranvanhai37@gmail.com', NULL, '2007-04-05', 'Nam', '448 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(574, 'KH-5D8A', 'individual', 'Ngô Minh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0795231850', 'ngominhtung56@gmail.com', NULL, '2000-11-12', 'Nam', '327 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(575, 'KH-AECA', 'individual', 'Ngô Phương Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0704663792', 'ngophuongoanh81@gmail.com', NULL, '1992-05-13', 'Nữ', '268 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(576, 'KH-7EDF', 'individual', 'Đinh Phương My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366073153', 'dinhphuongmy98@gmail.com', NULL, '1993-10-26', 'Nữ', '105 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(577, 'KH-791D', 'individual', 'Võ Thành Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0326026815', 'vothanhhai84@gmail.com', NULL, '1992-10-03', 'Nam', '183 Đường Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(578, 'KH-A500', 'individual', 'Hồ Hoàng Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0824683373', 'hohoangtung24@gmail.com', NULL, '1982-09-28', 'Nam', '334 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(579, 'KH-D270', 'individual', 'Dương Ngọc My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0780320811', 'duongngocmy29@gmail.com', NULL, '1977-02-15', 'Nữ', '353 Đường Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(580, 'KH-C94D', 'individual', 'Phan Quốc Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0399741493', 'phanquocdung79@gmail.com', NULL, '1986-04-24', 'Nam', '65 Đường Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(581, 'KH-23A2', 'individual', 'Ngô Thu Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0384757862', 'ngothulien59@gmail.com', NULL, '1993-03-22', 'Nữ', '363 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(582, 'KH-24AB', 'individual', 'Phạm Minh Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0792778411', 'phamminhtrung71@gmail.com', NULL, '2001-01-15', 'Nam', '236 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(583, 'KH-B682', 'individual', 'Trần Thị Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363397403', 'tranthinhi15@gmail.com', NULL, '1988-11-09', 'Nữ', '112 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(584, 'KH-E704', 'individual', 'Hồ Tuyết Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0880964260', 'hotuyetmai92@gmail.com', NULL, '1999-03-07', 'Nữ', '54 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(585, 'KH-EC99', 'individual', 'Trần Khánh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0989025673', 'trankhanhnam17@gmail.com', NULL, '1987-05-10', 'Nam', '289 Đường Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(586, 'KH-E368', 'individual', 'Trần Hồng Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831899253', 'tranhongngoc54@gmail.com', NULL, '1996-11-08', 'Nữ', '245 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(587, 'KH-11B4', 'individual', 'Lâm Mạnh Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0832754720', 'lammanhkiet64@gmail.com', NULL, '1976-07-09', 'Nam', '219 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(588, 'KH-0511', 'individual', 'Vũ Nhật Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934345254', 'vunhatphuc87@gmail.com', NULL, '1998-03-19', 'Nam', '299 Đường Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(589, 'KH-5672', 'individual', 'Vũ Hồng Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0386741399', 'vuhonglan71@gmail.com', NULL, '2000-05-26', 'Nữ', '335 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(590, 'KH-F150', 'individual', 'Phan Bảo Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942909371', 'phanbaoquan80@gmail.com', NULL, '1988-01-26', 'Nam', '59 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(591, 'KH-A15A', 'individual', 'Hoàng Đức Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774142773', 'hoangducnam73@gmail.com', NULL, '1994-03-31', 'Nam', '444 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(592, 'KH-F8B2', 'individual', 'Vũ Xuân Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395040873', 'vuxuantrung94@gmail.com', NULL, '1984-11-13', 'Nam', '65 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(593, 'KH-3B6B', 'individual', 'Đinh Mạnh Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761243781', 'dinhmanhdung44@gmail.com', NULL, '1985-08-14', 'Nam', '95 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(594, 'KH-A9CB', 'individual', 'Bùi Mạnh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395103586', 'buimanhson19@gmail.com', NULL, '1984-02-07', 'Nam', '292 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(595, 'KH-0273', 'individual', 'Lâm Phương Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0326482618', 'lamphuongthu38@gmail.com', NULL, '1991-05-23', 'Nữ', '63 Đường Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(596, 'KH-EF11', 'individual', 'Đinh Hoài Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883840485', 'dinhhoaiyen53@gmail.com', NULL, '1978-10-23', 'Nữ', '100 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(597, 'KH-63A9', 'individual', 'Hoàng Trọng Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0888690964', 'hoangtrongviet82@gmail.com', NULL, '1983-11-01', 'Nam', '408 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(598, 'KH-7D6E', 'individual', 'Đặng Bích Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0945501900', 'dangbichtuyet33@gmail.com', NULL, '2001-01-29', 'Nữ', '398 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(599, 'KH-6007', 'individual', 'Lê Hoàng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968245812', 'lehoanganh71@gmail.com', NULL, '2002-04-05', 'Nam', '189 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(600, 'KH-9ED1', 'individual', 'Võ Anh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385943301', 'voanhquan47@gmail.com', NULL, '1995-11-14', 'Nam', '387 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(601, 'KH-437F', 'business', 'Doanh nghiệp Tư nhân Hoàng Gia Thời trang', 'Doanh nghiệp Tư nhân Hoàng Gia Thời trang', '0718320934', 'Lý Văn Đạt', 'https://hoanggia.com.vn', 'Đang hoạt động', '0283397687', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Hoàng Gia Tower, 15 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(602, 'KH-F68A', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0494576211', 'Lê Thành Lâm', 'https://thanhcong.com.vn', 'Tạm ngưng', '0376917021', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Thành Công Tower, 18 Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(603, 'KH-FC6D', 'business', 'Công ty TNHH MTV Hoàng Gia Năng lượng', 'Công ty TNHH MTV Hoàng Gia Năng lượng', '0807353132', 'Vũ Trọng Lâm', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0243279350', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Hoàng Gia Tower, 84 Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(604, 'KH-EE3E', 'business', 'Công ty TNHH Tiến Phong', 'Công ty TNHH Tiến Phong', '0539974601', 'Mai Đức Sơn', 'https://tienphong.com.vn', 'Đang hoạt động', '0830365918', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Tiến Phong Tower, 60 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(605, 'KH-410D', 'business', 'Tập đoàn Đất Việt', 'Tập đoàn Đất Việt', '0354058478', 'Huỳnh Quốc Đạt', 'https://datviet.com.vn', 'Ngừng hoạt động', '0283294066', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Đất Việt Tower, 115 Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(606, 'KH-C4E9', 'business', 'Hợp tác xã Tiến Phong Thời trang', 'Hợp tác xã Tiến Phong Thời trang', '0626078857', 'Ngô Đức Bình', 'https://tienphong.com.vn', 'NNT đang hoạt động', '0374380759', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Tiến Phong Tower, 184 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(607, 'KH-B395', 'business', 'Doanh nghiệp Tư nhân Đất Việt Cơ khí', 'Doanh nghiệp Tư nhân Đất Việt Cơ khí', '0412164532', 'Võ Anh Khoa', 'https://datviet.com.vn', 'NNT đang hoạt động', '0396538632', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Đất Việt Tower, 188 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(608, 'KH-34B3', 'business', 'Doanh nghiệp Tư nhân Tân Á Thực phẩm', 'Doanh nghiệp Tư nhân Tân Á Thực phẩm', '0172189446', 'Hồ Cẩm Đào', 'https://tana.com.vn', 'Đang hoạt động', '0323718115', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Tân Á Tower, 149 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(609, 'KH-71A7', 'business', 'Công ty Cổ phần Sông Hồng Bất động sản', 'Công ty Cổ phần Sông Hồng Bất động sản', '0438748426', 'Phan Nhật Lâm', 'https://songhong.com.vn', 'NNT đang hoạt động', '0243518776', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Sông Hồng Tower, 46 Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(610, 'KH-B6EA', 'business', 'Công ty TNHH MTV Đại Việt', 'Công ty TNHH MTV Đại Việt', '0225413284', 'Ngô Tuyết Dung', 'https://daiviet.com.vn', 'NNT đang hoạt động', '0283136036', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Đại Việt Tower, 32 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(611, 'KH-CCE2', 'business', 'Tập đoàn Trường Giang', 'Tập đoàn Trường Giang', '0470711803', 'Phạm Hồng Vy', 'https://truonggiang.com.vn', 'Tạm ngưng', '0283071098', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Trường Giang Tower, 209 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(612, 'KH-95CA', 'business', 'Hợp tác xã Hoàng Gia', 'Hợp tác xã Hoàng Gia', '0477381402', 'Hoàng Hồng Hương', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0243927758', 'contact@hoanggia.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Hoàng Gia Tower, 208 Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(613, 'KH-A353', 'business', 'Công ty Cổ phần Khải Hoàn Năng lượng', 'Công ty Cổ phần Khải Hoàn Năng lượng', '0459434709', 'Lý Tuấn Bảo', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0970913184', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Khải Hoàn Tower, 120 Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(614, 'KH-6963', 'business', 'Hợp tác xã Hòa Bình Thương mại', 'Hợp tác xã Hòa Bình Thương mại', '0106639661', 'Lâm Quỳnh Trinh', 'https://hoabinh.com.vn', 'Tạm ngưng', '0283660039', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Hòa Bình Tower, 187 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(615, 'KH-D5EF', 'business', 'Hợp tác xã Việt Á Bất động sản', 'Hợp tác xã Việt Á Bất động sản', '0485376719', 'Vũ Hoàng Thái', 'https://vieta.com.vn', 'Tạm ngưng', '0283134681', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Việt Á Tower, 103 Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(616, 'KH-3351', 'business', 'Công ty TNHH MTV Hải Đăng', 'Công ty TNHH MTV Hải Đăng', '0268077828', 'Đỗ Trọng Sơn', 'https://haidang.com.vn', 'Tạm ngưng', '0341279079', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Hải Đăng Tower, 197 Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(617, 'KH-00D0', 'business', 'Doanh nghiệp Tư nhân Thịnh Phát', 'Doanh nghiệp Tư nhân Thịnh Phát', '0946136725', 'Nguyễn Lan Trúc', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0336881362', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Thịnh Phát Tower, 64 Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(618, 'KH-7D6A', 'business', 'Công ty Cổ phần Đại Nam', 'Công ty Cổ phần Đại Nam', '0195325416', 'Hồ Minh Quang', 'https://dainam.com.vn', 'Ngừng hoạt động', '0914135530', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Đại Nam Tower, 211 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(619, 'KH-980A', 'business', 'Hợp tác xã Hoa Sen', 'Hợp tác xã Hoa Sen', '0221893117', 'Hoàng Hoài Hằng', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0243336904', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Hoa Sen Tower, 125 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(620, 'KH-6601', 'business', 'Công ty Cổ phần Hồng Hà', 'Công ty Cổ phần Hồng Hà', '0128153256', 'Võ Khánh Bảo', 'https://hongha.com.vn', 'Ngừng hoạt động', '0243409900', 'contact@hongha.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Hồng Hà Tower, 166 Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(621, 'KH-07E1', 'business', 'Tập đoàn Kim Đô', 'Tập đoàn Kim Đô', '0772132020', 'Bùi Thị Hằng', 'https://kimdo.com.vn', 'Đang hoạt động', '0243528947', 'contact@kimdo.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Kim Đô Tower, 83 Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(622, 'KH-E6EF', 'business', 'Hợp tác xã Kim Đô Truyền thông', 'Hợp tác xã Kim Đô Truyền thông', '0913009836', 'Đặng Hoài Mai', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0790522489', 'contact@kimdo.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Kim Đô Tower, 83 Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(623, 'KH-812F', 'business', 'Hợp tác xã Đông Dương', 'Hợp tác xã Đông Dương', '0550155831', 'Đỗ Nhật Cường', 'https://dongduong.com.vn', 'Tạm ngưng', '0766118994', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Đông Dương Tower, 190 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(624, 'KH-FCC2', 'business', 'Doanh nghiệp Tư nhân Trường Giang', 'Doanh nghiệp Tư nhân Trường Giang', '0838763650', 'Hoàng Hồng Anh', 'https://truonggiang.com.vn', 'Tạm ngưng', '0243768030', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 9 Tòa nhà Trường Giang Tower, 49 Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(625, 'KH-6FA1', 'business', 'Hợp tác xã Hoa Sen Du lịch', 'Hợp tác xã Hoa Sen Du lịch', '0704925891', 'Phan Anh Tuấn', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0283974080', 'contact@hoasen.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Hoa Sen Tower, 48 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(626, 'KH-7E4A', 'business', 'Công ty TNHH MTV Kim Đô', 'Công ty TNHH MTV Kim Đô', '0999131785', 'Vũ Đức Tân', 'https://kimdo.com.vn', 'Ngừng hoạt động', '0792024566', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Kim Đô Tower, 67 Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(627, 'KH-DE95', 'business', 'Công ty TNHH MTV Việt Á', 'Công ty TNHH MTV Việt Á', '0447840091', 'Lý Quỳnh An', 'https://vieta.com.vn', 'Đang hoạt động', '0243999659', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Việt Á Tower, 3 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(628, 'KH-2C70', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0215000487', 'Lâm Cát Thu', 'https://truongson.com.vn', 'Ngừng hoạt động', '0243375625', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Trường Sơn Tower, 132 Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(629, 'KH-BC4A', 'business', 'Công ty TNHH Cửu Long Cơ khí', 'Công ty TNHH Cửu Long Cơ khí', '0511272907', 'Phan Xuân Việt', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0362558856', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Cửu Long Tower, 64 Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(630, 'KH-2914', 'business', 'Công ty Cổ phần Hồng Hà', 'Công ty Cổ phần Hồng Hà', '0218654852', 'Võ Ngọc Thu', 'https://hongha.com.vn', 'Đang hoạt động', '0342597342', 'contact@hongha.com.vn', NULL, NULL, 'Nữ', 'Tầng 18 Tòa nhà Hồng Hà Tower, 179 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(631, 'KH-8673', 'business', 'Công ty Cổ phần Hồng Hà', 'Công ty Cổ phần Hồng Hà', '0427249132', 'Lê Nhật Trung', 'https://hongha.com.vn', 'Tạm ngưng', '0283047998', 'contact@hongha.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Hồng Hà Tower, 160 Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(632, 'KH-A51E', 'business', 'Tập đoàn Đông Dương Xây dựng', 'Tập đoàn Đông Dương Xây dựng', '0220408348', 'Đặng Anh Khoa', 'https://dongduong.com.vn', 'Đang hoạt động', '0356390522', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Đông Dương Tower, 113 Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(633, 'KH-5584', 'business', 'Doanh nghiệp Tư nhân Đông Dương', 'Doanh nghiệp Tư nhân Đông Dương', '0587417330', 'Lâm Khánh Khánh', 'https://dongduong.com.vn', 'Tạm ngưng', '0810975169', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Đông Dương Tower, 174 Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(634, 'KH-13A2', 'business', 'Doanh nghiệp Tư nhân Trường Giang Cơ khí', 'Doanh nghiệp Tư nhân Trường Giang Cơ khí', '0466088760', 'Mai Quốc Đạt', 'https://truonggiang.com.vn', 'Tạm ngưng', '0243746074', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Trường Giang Tower, 142 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(635, 'KH-A5BF', 'business', 'Doanh nghiệp Tư nhân Sao Mai', 'Doanh nghiệp Tư nhân Sao Mai', '0938028112', 'Ngô Mạnh Hùng', 'https://saomai.com.vn', 'Đang hoạt động', '0283023869', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Sao Mai Tower, 242 Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(636, 'KH-1DF8', 'business', 'Hợp tác xã Thành Công', 'Hợp tác xã Thành Công', '0430670905', 'Trần Thành Cường', 'https://thanhcong.com.vn', 'Tạm ngưng', '0765765199', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Thành Công Tower, 107 Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(637, 'KH-399F', 'business', 'Doanh nghiệp Tư nhân Nam Á', 'Doanh nghiệp Tư nhân Nam Á', '0432712651', 'Hoàng Hoàng Đức', 'https://nama.com.vn', 'NNT đang hoạt động', '0283683198', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Nam Á Tower, 108 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(638, 'KH-DFED', 'business', 'Công ty Cổ phần Sao Mai Công nghệ', 'Công ty Cổ phần Sao Mai Công nghệ', '0853847359', 'Phan Diệu Phương', 'https://saomai.com.vn', 'NNT đang hoạt động', '0829929808', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Sao Mai Tower, 202 Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(639, 'KH-0084', 'business', 'Công ty TNHH MTV Việt Á', 'Công ty TNHH MTV Việt Á', '0367236693', 'Mai Thảo Hoa', 'https://vieta.com.vn', 'Ngừng hoạt động', '0378442288', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Việt Á Tower, 31 Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(640, 'KH-40FE', 'business', 'Công ty TNHH MTV Minh Đăng Thời trang', 'Công ty TNHH MTV Minh Đăng Thời trang', '0157641229', 'Đinh Bảo Kiệt', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0283208702', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Minh Đăng Tower, 128 Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(641, 'KH-3612', 'business', 'Công ty TNHH Thái Bình Dương Công nghệ', 'Công ty TNHH Thái Bình Dương Công nghệ', '0626728134', 'Lê Khánh Anh', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0283579437', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Thái Bình Dương Tower, 72 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(642, 'KH-CAAE', 'business', 'Công ty TNHH MTV Hải Đăng', 'Công ty TNHH MTV Hải Đăng', '0525382165', 'Bùi Tuấn Long', 'https://haidang.com.vn', 'NNT đang hoạt động', '0324890338', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Hải Đăng Tower, 5 Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(643, 'KH-FD25', 'business', 'Doanh nghiệp Tư nhân Việt Á Xây dựng', 'Doanh nghiệp Tư nhân Việt Á Xây dựng', '0421362873', 'Mai Hoài Chi', 'https://vieta.com.vn', 'NNT đang hoạt động', '0848784288', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Việt Á Tower, 114 Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(644, 'KH-D5BF', 'business', 'Tập đoàn Vạn Xuân Du lịch', 'Tập đoàn Vạn Xuân Du lịch', '0699193590', 'Hồ Duy Bình', 'https://vanxuan.com.vn', 'Tạm ngưng', '0813701405', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Vạn Xuân Tower, 211 Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(645, 'KH-1545', 'business', 'Hợp tác xã Thái Bình Dương', 'Hợp tác xã Thái Bình Dương', '0460562940', 'Bùi Bích Thu', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0243504900', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 211 Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(646, 'KH-D2E2', 'business', 'Hợp tác xã Cửu Long', 'Hợp tác xã Cửu Long', '0538912024', 'Nguyễn Trọng Bình', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0940891799', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Cửu Long Tower, 118 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(647, 'KH-C7F3', 'business', 'Tập đoàn Sông Hồng', 'Tập đoàn Sông Hồng', '0579826445', 'Đặng Mạnh Quang', 'https://songhong.com.vn', 'NNT đang hoạt động', '0283197039', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Sông Hồng Tower, 103 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(648, 'KH-D20E', 'business', 'Doanh nghiệp Tư nhân Đông Dương Truyền thông', 'Doanh nghiệp Tư nhân Đông Dương Truyền thông', '0730025934', 'Phạm Như Phương', 'https://dongduong.com.vn', 'NNT đang hoạt động', '0824594949', 'contact@dongduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Đông Dương Tower, 216 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(649, 'KH-AE10', 'business', 'Công ty TNHH Trường Giang', 'Công ty TNHH Trường Giang', '0804296984', 'Huỳnh Bích Phượng', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0283751944', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Trường Giang Tower, 226 Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(650, 'KH-20CA', 'business', 'Doanh nghiệp Tư nhân Trường Sơn', 'Doanh nghiệp Tư nhân Trường Sơn', '0619652773', 'Hoàng Diệu Cúc', 'https://truongson.com.vn', 'Tạm ngưng', '0283770355', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Trường Sơn Tower, 20 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(651, 'KH-1487', 'business', 'Công ty TNHH MTV Đại Nam', 'Công ty TNHH MTV Đại Nam', '0588631965', 'Bùi Cẩm Cúc', 'https://dainam.com.vn', 'NNT đang hoạt động', '0243774795', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Đại Nam Tower, 207 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(652, 'KH-2367', 'business', 'Doanh nghiệp Tư nhân Thành Công', 'Doanh nghiệp Tư nhân Thành Công', '0377996242', 'Phạm Hoài Dung', 'https://thanhcong.com.vn', 'Tạm ngưng', '0283320656', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Thành Công Tower, 33 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(653, 'KH-CC2A', 'business', 'Hợp tác xã Tiến Phong', 'Hợp tác xã Tiến Phong', '0296373653', 'Phan Mai Hằng', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0773125036', 'contact@tienphong.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Tiến Phong Tower, 5 Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(654, 'KH-12AF', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0927446566', 'Bùi Thu Linh', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0283735795', 'contact@cuulong.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Cửu Long Tower, 193 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(655, 'KH-67F7', 'business', 'Công ty TNHH Đại Nam', 'Công ty TNHH Đại Nam', '0916688568', 'Huỳnh Hoàng Quang', 'https://dainam.com.vn', 'Đang hoạt động', '0790607482', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Đại Nam Tower, 115 Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(656, 'KH-E85B', 'business', 'Tập đoàn Đông Dương', 'Tập đoàn Đông Dương', '0629085829', 'Ngô Quốc Tân', 'https://dongduong.com.vn', 'Đang hoạt động', '0886840908', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Đông Dương Tower, 243 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(657, 'KH-6B89', 'business', 'Tập đoàn Đại Nam Du lịch', 'Tập đoàn Đại Nam Du lịch', '0727667614', 'Phan Trọng Minh', 'https://dainam.com.vn', 'Tạm ngưng', '0243948045', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Đại Nam Tower, 190 Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(658, 'KH-239D', 'business', 'Công ty Cổ phần Hòa Bình Xây dựng', 'Công ty Cổ phần Hòa Bình Xây dựng', '0790707011', 'Võ Ngọc Oanh', 'https://hoabinh.com.vn', 'Đang hoạt động', '0243860923', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Hòa Bình Tower, 137 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(659, 'KH-043A', 'business', 'Tập đoàn Thái Bình Dương', 'Tập đoàn Thái Bình Dương', '0422822759', 'Hồ Bảo Minh', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0243424286', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 141 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(660, 'KH-C640', 'business', 'Hợp tác xã Sao Mai Vận tải', 'Hợp tác xã Sao Mai Vận tải', '0664254578', 'Đỗ Quỳnh Hạnh', 'https://saomai.com.vn', 'Ngừng hoạt động', '0377775081', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Sao Mai Tower, 72 Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(661, 'KH-624D', 'business', 'Doanh nghiệp Tư nhân Minh Đăng', 'Doanh nghiệp Tư nhân Minh Đăng', '0821214696', 'Võ Mạnh Huy', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0243056647', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Minh Đăng Tower, 235 Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(662, 'KH-030D', 'business', 'Công ty TNHH MTV Khải Hoàn', 'Công ty TNHH MTV Khải Hoàn', '0945889180', 'Dương Hữu Cường', 'https://khaihoan.com.vn', 'Tạm ngưng', '0902591592', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Khải Hoàn Tower, 235 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(663, 'KH-EEA3', 'business', 'Tập đoàn Trường Giang Cơ khí', 'Tập đoàn Trường Giang Cơ khí', '0216881586', 'Phan Ngọc Đào', 'https://truonggiang.com.vn', 'Đang hoạt động', '0913397510', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Trường Giang Tower, 193 Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(664, 'KH-C880', 'business', 'Tập đoàn Sông Hồng Công nghệ', 'Tập đoàn Sông Hồng Công nghệ', '0471328124', 'Đỗ Anh Tân', 'https://songhong.com.vn', 'Ngừng hoạt động', '0855388886', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Sông Hồng Tower, 127 Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(665, 'KH-D624', 'business', 'Công ty Cổ phần Cửu Long', 'Công ty Cổ phần Cửu Long', '0876720358', 'Hồ Quốc Hùng', 'https://cuulong.com.vn', 'Đang hoạt động', '0243085497', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Cửu Long Tower, 90 Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(666, 'KH-B0AE', 'business', 'Công ty TNHH MTV Hoàng Gia Dịch vụ', 'Công ty TNHH MTV Hoàng Gia Dịch vụ', '0451724521', 'Lý Trọng Phúc', 'https://hoanggia.com.vn', 'Đang hoạt động', '0933552759', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Hoàng Gia Tower, 139 Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(667, 'KH-DE0D', 'business', 'Tập đoàn Thịnh Phát', 'Tập đoàn Thịnh Phát', '0657076504', 'Lý Tuấn Thịnh', 'https://thinhphat.com.vn', 'Đang hoạt động', '0243053396', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Thịnh Phát Tower, 139 Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(668, 'KH-9DD0', 'business', 'Doanh nghiệp Tư nhân Đất Việt', 'Doanh nghiệp Tư nhân Đất Việt', '0156683111', 'Hồ Hoài An', 'https://datviet.com.vn', 'Ngừng hoạt động', '0243784454', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Đất Việt Tower, 115 Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(669, 'KH-21A7', 'business', 'Tập đoàn Việt Á Công nghệ', 'Tập đoàn Việt Á Công nghệ', '0151653756', 'Võ Thu Tuyền', 'https://vieta.com.vn', 'Ngừng hoạt động', '0243303418', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Việt Á Tower, 157 Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(670, 'KH-C4E4', 'business', 'Công ty TNHH Kim Đô', 'Công ty TNHH Kim Đô', '0420309109', 'Hoàng Quang Long', 'https://kimdo.com.vn', 'Tạm ngưng', '0283188484', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Kim Đô Tower, 202 Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(671, 'KH-3A54', 'business', 'Hợp tác xã Hải Đăng', 'Hợp tác xã Hải Đăng', '0789595157', 'Đinh Hữu Quân', 'https://haidang.com.vn', 'Đang hoạt động', '0283481426', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Hải Đăng Tower, 125 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(672, 'KH-FC63', 'business', 'Hợp tác xã Minh Đăng', 'Hợp tác xã Minh Đăng', '0372203378', 'Vũ Quỳnh Hà', 'https://minhdang.com.vn', 'Tạm ngưng', '0283513983', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Minh Đăng Tower, 236 Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(673, 'KH-158E', 'business', 'Công ty TNHH MTV Hải Đăng', 'Công ty TNHH MTV Hải Đăng', '0217662919', 'Phan Trọng Minh', 'https://haidang.com.vn', 'NNT đang hoạt động', '0283851431', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Hải Đăng Tower, 118 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(674, 'KH-3C9F', 'business', 'Công ty TNHH MTV Việt Á Thực phẩm', 'Công ty TNHH MTV Việt Á Thực phẩm', '0343925663', 'Ngô Nhật Lâm', 'https://vieta.com.vn', 'NNT đang hoạt động', '0283335438', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Việt Á Tower, 143 Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(675, 'KH-25BD', 'business', 'Công ty TNHH Hoàng Gia', 'Công ty TNHH Hoàng Gia', '0945487850', 'Bùi Quỳnh Thu', 'https://hoanggia.com.vn', 'Tạm ngưng', '0283467430', 'contact@hoanggia.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Hoàng Gia Tower, 156 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(676, 'KH-5190', 'business', 'Tập đoàn Trường Giang', 'Tập đoàn Trường Giang', '0145686788', 'Dương Thảo Hà', 'https://truonggiang.com.vn', 'Đang hoạt động', '0337876966', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Trường Giang Tower, 103 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(677, 'KH-41F5', 'business', 'Hợp tác xã Sao Mai', 'Hợp tác xã Sao Mai', '0655339976', 'Hồ Anh Khoa', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283793311', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Sao Mai Tower, 123 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(678, 'KH-6CA7', 'business', 'Công ty Cổ phần Hoa Sen Cơ khí', 'Công ty Cổ phần Hoa Sen Cơ khí', '0614528139', 'Đinh Cẩm Trúc', 'https://hoasen.com.vn', 'NNT đang hoạt động', '0386113531', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 9 Tòa nhà Hoa Sen Tower, 145 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(679, 'KH-34CF', 'business', 'Công ty TNHH MTV Thịnh Phát', 'Công ty TNHH MTV Thịnh Phát', '0968324286', 'Võ Duy Đức', 'https://thinhphat.com.vn', 'Tạm ngưng', '0334686905', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Thịnh Phát Tower, 164 Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(680, 'KH-1079', 'business', 'Hợp tác xã Cửu Long', 'Hợp tác xã Cửu Long', '0989441933', 'Phạm Tuấn Dũng', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0243474667', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Cửu Long Tower, 250 Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(681, 'KH-D398', 'business', 'Tập đoàn Việt Á Truyền thông', 'Tập đoàn Việt Á Truyền thông', '0281217448', 'Lê Duy Hải', 'https://vieta.com.vn', 'Tạm ngưng', '0905758305', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Việt Á Tower, 17 Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(682, 'KH-4C1D', 'business', 'Công ty TNHH Thịnh Phát Vận tải', 'Công ty TNHH Thịnh Phát Vận tải', '0706350619', 'Đỗ Hoài Trinh', 'https://thinhphat.com.vn', 'Ngừng hoạt động', '0283857088', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Thịnh Phát Tower, 100 Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(683, 'KH-64F1', 'business', 'Doanh nghiệp Tư nhân Đại Việt Sản xuất', 'Doanh nghiệp Tư nhân Đại Việt Sản xuất', '0378592680', 'Phạm Bích Vy', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0243034766', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Đại Việt Tower, 180 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(684, 'KH-6151', 'business', 'Tập đoàn Khải Hoàn', 'Tập đoàn Khải Hoàn', '0219951667', 'Đặng Như My', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0331463742', 'contact@khaihoan.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Khải Hoàn Tower, 42 Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(685, 'KH-7C1B', 'business', 'Doanh nghiệp Tư nhân Trường Sơn Công nghệ', 'Doanh nghiệp Tư nhân Trường Sơn Công nghệ', '0140055846', 'Nguyễn Khánh Trinh', 'https://truongson.com.vn', 'Ngừng hoạt động', '0356548614', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Trường Sơn Tower, 44 Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(686, 'KH-B29E', 'business', 'Tập đoàn Hồng Hà Xây dựng', 'Tập đoàn Hồng Hà Xây dựng', '0365812834', 'Phùng Thị Hà', 'https://hongha.com.vn', 'NNT đang hoạt động', '0243142111', 'contact@hongha.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Hồng Hà Tower, 99 Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(687, 'KH-1D0D', 'business', 'Công ty TNHH Việt Á Đầu tư', 'Công ty TNHH Việt Á Đầu tư', '0416572718', 'Đặng Thu Anh', 'https://vieta.com.vn', 'Đang hoạt động', '0243238581', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Việt Á Tower, 179 Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(688, 'KH-A712', 'business', 'Hợp tác xã Đại Việt Thương mại', 'Hợp tác xã Đại Việt Thương mại', '0528069733', 'Phan Như Phương', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0243529058', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Đại Việt Tower, 124 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(689, 'KH-4D71', 'business', 'Doanh nghiệp Tư nhân Cửu Long Thực phẩm', 'Doanh nghiệp Tư nhân Cửu Long Thực phẩm', '0757715726', 'Hồ Quốc Bình', 'https://cuulong.com.vn', 'Đang hoạt động', '0243954121', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Cửu Long Tower, 219 Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(690, 'KH-E46A', 'business', 'Công ty TNHH Đất Việt', 'Công ty TNHH Đất Việt', '0720428269', 'Ngô Khánh Hương', 'https://datviet.com.vn', 'NNT đang hoạt động', '0243073980', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Đất Việt Tower, 40 Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(691, 'KH-9FC1', 'business', 'Hợp tác xã Trường Sơn', 'Hợp tác xã Trường Sơn', '0664623338', 'Bùi Đức Vinh', 'https://truongson.com.vn', 'Tạm ngưng', '0359786729', 'contact@truongson.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 235 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(692, 'KH-9F53', 'business', 'Công ty Cổ phần Đất Việt Dịch vụ', 'Công ty Cổ phần Đất Việt Dịch vụ', '0126193354', 'Hoàng Quỳnh Thu', 'https://datviet.com.vn', 'NNT đang hoạt động', '0360933372', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Đất Việt Tower, 68 Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(693, 'KH-7CE8', 'business', 'Hợp tác xã Hoàng Gia', 'Hợp tác xã Hoàng Gia', '0893278599', 'Võ Bảo Tiến', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0776402911', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Hoàng Gia Tower, 222 Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(694, 'KH-B0D9', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0825246616', 'Phan Khánh Hải', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0971214307', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Minh Đăng Tower, 158 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(695, 'KH-527F', 'business', 'Công ty Cổ phần Sông Hồng', 'Công ty Cổ phần Sông Hồng', '0348519017', 'Lâm Quỳnh Vy', 'https://songhong.com.vn', 'Ngừng hoạt động', '0243313202', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Sông Hồng Tower, 236 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(696, 'KH-AD03', 'business', 'Công ty Cổ phần Hòa Bình Bất động sản', 'Công ty Cổ phần Hòa Bình Bất động sản', '0450806744', 'Huỳnh Thị Trinh', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0243356885', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Hòa Bình Tower, 27 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(697, 'KH-ECBE', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0886151924', 'Phùng Cát Hằng', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0398273261', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Hòa Bình Tower, 249 Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(698, 'KH-B9B9', 'business', 'Hợp tác xã Thái Bình Dương Công nghệ', 'Hợp tác xã Thái Bình Dương Công nghệ', '0202202998', 'Lê Cẩm Hạnh', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0332530046', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 9 Tòa nhà Thái Bình Dương Tower, 26 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(699, 'KH-428C', 'business', 'Doanh nghiệp Tư nhân Đại Nam', 'Doanh nghiệp Tư nhân Đại Nam', '0451437870', 'Phùng Khánh Trinh', 'https://dainam.com.vn', 'Tạm ngưng', '0851778866', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Đại Nam Tower, 100 Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(700, 'KH-814B', 'business', 'Công ty TNHH Hoa Sen', 'Công ty TNHH Hoa Sen', '0894305431', 'Phạm Minh Giang', 'https://hoasen.com.vn', 'Đang hoạt động', '0243509910', 'contact@hoasen.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Hoa Sen Tower, 23 Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(701, 'KH-AA36', 'business', 'Doanh nghiệp Tư nhân Đông Dương', 'Doanh nghiệp Tư nhân Đông Dương', '0433091757', 'Đặng Hoàng Tiến', 'https://dongduong.com.vn', 'NNT đang hoạt động', '0243825730', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Đông Dương Tower, 149 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(702, 'KH-6473', 'business', 'Doanh nghiệp Tư nhân Hải Đăng', 'Doanh nghiệp Tư nhân Hải Đăng', '0679376433', 'Đặng Mạnh Lâm', 'https://haidang.com.vn', 'Tạm ngưng', '0323852158', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Hải Đăng Tower, 98 Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(703, 'KH-31E9', 'business', 'Tập đoàn Vinh Quang Thực phẩm', 'Tập đoàn Vinh Quang Thực phẩm', '0621699789', 'Phạm Mai Hoa', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0376533376', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Vinh Quang Tower, 239 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(704, 'KH-A810', 'business', 'Công ty Cổ phần Trường Giang', 'Công ty Cổ phần Trường Giang', '0423276999', 'Mai Tiến Lâm', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0243977628', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Trường Giang Tower, 87 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(705, 'KH-A6AA', 'business', 'Hợp tác xã Trường Giang', 'Hợp tác xã Trường Giang', '0546950829', 'Lâm Thị Giang', 'https://truonggiang.com.vn', 'Đang hoạt động', '0968030371', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Trường Giang Tower, 99 Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(706, 'KH-1F9A', 'business', 'Hợp tác xã Cửu Long Cơ khí', 'Hợp tác xã Cửu Long Cơ khí', '0500551176', 'Mai Mạnh Bình', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0764667666', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Cửu Long Tower, 142 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(707, 'KH-F025', 'business', 'Hợp tác xã Nam Á Du lịch', 'Hợp tác xã Nam Á Du lịch', '0378827844', 'Phùng Bảo Vinh', 'https://nama.com.vn', 'Đang hoạt động', '0283784965', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Nam Á Tower, 236 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(708, 'KH-749B', 'business', 'Công ty TNHH Thịnh Phát Thực phẩm', 'Công ty TNHH Thịnh Phát Thực phẩm', '0745552089', 'Đặng Xuân Bình', 'https://thinhphat.com.vn', 'Tạm ngưng', '0969536686', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Thịnh Phát Tower, 7 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(709, 'KH-70A2', 'business', 'Công ty TNHH MTV Nam Á Dịch vụ', 'Công ty TNHH MTV Nam Á Dịch vụ', '0358470327', 'Hồ Bảo Khoa', 'https://nama.com.vn', 'Tạm ngưng', '0283548846', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Nam Á Tower, 6 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(710, 'KH-0CEA', 'business', 'Tập đoàn Kim Đô', 'Tập đoàn Kim Đô', '0380223827', 'Lâm Thành Huy', 'https://kimdo.com.vn', 'Đang hoạt động', '0378491574', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Kim Đô Tower, 206 Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(711, 'KH-B24D', 'business', 'Công ty Cổ phần Đại Việt', 'Công ty Cổ phần Đại Việt', '0948344866', 'Mai Thành Hải', 'https://daiviet.com.vn', 'Đang hoạt động', '0349620233', 'contact@daiviet.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Đại Việt Tower, 65 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(712, 'KH-E963', 'business', 'Công ty TNHH MTV Trường Giang Sản xuất', 'Công ty TNHH MTV Trường Giang Sản xuất', '0753116113', 'Lâm Thị Ngọc', 'https://truonggiang.com.vn', 'Đang hoạt động', '0838808924', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Trường Giang Tower, 32 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(713, 'KH-2F64', 'business', 'Công ty Cổ phần Hoàng Gia Công nghệ', 'Công ty Cổ phần Hoàng Gia Công nghệ', '0765349485', 'Đỗ Quỳnh Quỳnh', 'https://hoanggia.com.vn', 'Đang hoạt động', '0962717172', 'contact@hoanggia.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Hoàng Gia Tower, 211 Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(714, 'KH-A6E0', 'business', 'Công ty TNHH Sao Mai Công nghệ', 'Công ty TNHH Sao Mai Công nghệ', '0269018685', 'Đỗ Thu Yến', 'https://saomai.com.vn', 'NNT đang hoạt động', '0839483153', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Sao Mai Tower, 7 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(715, 'KH-1968', 'business', 'Doanh nghiệp Tư nhân Tân Á Thực phẩm', 'Doanh nghiệp Tư nhân Tân Á Thực phẩm', '0786676778', 'Huỳnh Thị Nhi', 'https://tana.com.vn', 'Ngừng hoạt động', '0243748222', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Tân Á Tower, 81 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(716, 'KH-B697', 'business', 'Doanh nghiệp Tư nhân Đất Việt Đầu tư', 'Doanh nghiệp Tư nhân Đất Việt Đầu tư', '0650969003', 'Hoàng Trọng Sơn', 'https://datviet.com.vn', 'Đang hoạt động', '0905860855', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Đất Việt Tower, 90 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(717, 'KH-32CE', 'business', 'Tập đoàn Nam Á', 'Tập đoàn Nam Á', '0284266867', 'Hồ Như Mai', 'https://nama.com.vn', 'Đang hoạt động', '0243554109', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Nam Á Tower, 30 Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(718, 'KH-C9C8', 'business', 'Công ty TNHH MTV An Phát', 'Công ty TNHH MTV An Phát', '0454031255', 'Võ Hồng Mai', 'https://anphat.com.vn', 'Ngừng hoạt động', '0836083490', 'contact@anphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà An Phát Tower, 120 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(719, 'KH-E1BE', 'business', 'Công ty TNHH Tân Á Cơ khí', 'Công ty TNHH Tân Á Cơ khí', '0279044605', 'Hoàng Thành Minh', 'https://tana.com.vn', 'Tạm ngưng', '0326717375', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Tân Á Tower, 205 Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(720, 'KH-925A', 'business', 'Công ty TNHH Thịnh Phát Thương mại', 'Công ty TNHH Thịnh Phát Thương mại', '0692933555', 'Ngô Duy Khánh', 'https://thinhphat.com.vn', 'Tạm ngưng', '0243652517', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Thịnh Phát Tower, 175 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(721, 'KH-CE7A', 'business', 'Doanh nghiệp Tư nhân Đại Nam', 'Doanh nghiệp Tư nhân Đại Nam', '0415968222', 'Ngô Đức Long', 'https://dainam.com.vn', 'Đang hoạt động', '0243705132', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Đại Nam Tower, 207 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(722, 'KH-64C8', 'business', 'Công ty Cổ phần Đại Nam', 'Công ty Cổ phần Đại Nam', '0691745870', 'Phùng Văn Huy', 'https://dainam.com.vn', 'NNT đang hoạt động', '0243681750', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Đại Nam Tower, 6 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(723, 'KH-257E', 'business', 'Tập đoàn Đại Việt', 'Tập đoàn Đại Việt', '0228570736', 'Đinh Thu Liên', 'https://daiviet.com.vn', 'Đang hoạt động', '0283550777', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Đại Việt Tower, 44 Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(724, 'KH-3C91', 'business', 'Công ty TNHH MTV Tiến Phong Giáo dục', 'Công ty TNHH MTV Tiến Phong Giáo dục', '0731996953', 'Bùi Lan Giang', 'https://tienphong.com.vn', 'NNT đang hoạt động', '0283739325', 'contact@tienphong.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Tiến Phong Tower, 41 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(725, 'KH-FA29', 'business', 'Công ty TNHH Trường Giang Cơ khí', 'Công ty TNHH Trường Giang Cơ khí', '0233400674', 'Phạm Phương Trinh', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0778642032', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Trường Giang Tower, 204 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(726, 'KH-0CEF', 'business', 'Tập đoàn Hòa Bình Bất động sản', 'Tập đoàn Hòa Bình Bất động sản', '0806899711', 'Hồ Nhật Giang', 'https://hoabinh.com.vn', 'Đang hoạt động', '0243381640', 'contact@hoabinh.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Hòa Bình Tower, 17 Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(727, 'KH-6766', 'business', 'Công ty Cổ phần Thịnh Phát Truyền thông', 'Công ty Cổ phần Thịnh Phát Truyền thông', '0336385570', 'Hồ Như An', 'https://thinhphat.com.vn', 'Đang hoạt động', '0243159023', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Thịnh Phát Tower, 191 Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(728, 'KH-2DEF', 'business', 'Công ty TNHH MTV Hoàng Gia Cơ khí', 'Công ty TNHH MTV Hoàng Gia Cơ khí', '0244166434', 'Huỳnh Thành Minh', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0393720130', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Hoàng Gia Tower, 104 Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(729, 'KH-0FD1', 'business', 'Hợp tác xã Sao Mai', 'Hợp tác xã Sao Mai', '0987384204', 'Đặng Nhật Bình', 'https://saomai.com.vn', 'Ngừng hoạt động', '0243513151', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Sao Mai Tower, 16 Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(730, 'KH-1384', 'business', 'Hợp tác xã Cửu Long', 'Hợp tác xã Cửu Long', '0868870515', 'Hồ Văn Thái', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0283091449', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Cửu Long Tower, 179 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(731, 'KH-A908', 'business', 'Công ty TNHH Khải Hoàn Đầu tư', 'Công ty TNHH Khải Hoàn Đầu tư', '0454201759', 'Trần Diệu Trinh', 'https://khaihoan.com.vn', 'Tạm ngưng', '0961246298', 'contact@khaihoan.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Khải Hoàn Tower, 71 Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(732, 'KH-7CC6', 'business', 'Công ty TNHH Đất Việt Truyền thông', 'Công ty TNHH Đất Việt Truyền thông', '0688309599', 'Trần Hữu Tân', 'https://datviet.com.vn', 'Ngừng hoạt động', '0784213075', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Đất Việt Tower, 167 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(733, 'KH-10A9', 'business', 'Doanh nghiệp Tư nhân Khải Hoàn', 'Doanh nghiệp Tư nhân Khải Hoàn', '0586457618', 'Đặng Như Vân', 'https://khaihoan.com.vn', 'Tạm ngưng', '0943231501', 'contact@khaihoan.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Khải Hoàn Tower, 32 Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(734, 'KH-D956', 'business', 'Doanh nghiệp Tư nhân Đại Nam Thực phẩm', 'Doanh nghiệp Tư nhân Đại Nam Thực phẩm', '0506921916', 'Võ Xuân Kiệt', 'https://dainam.com.vn', 'Tạm ngưng', '0283097632', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Đại Nam Tower, 62 Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(735, 'KH-4878', 'business', 'Công ty Cổ phần Sao Mai', 'Công ty Cổ phần Sao Mai', '0325456836', 'Võ Cát Trúc', 'https://saomai.com.vn', 'Đang hoạt động', '0392543042', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Sao Mai Tower, 136 Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(736, 'KH-1C5A', 'business', 'Doanh nghiệp Tư nhân Đại Việt', 'Doanh nghiệp Tư nhân Đại Việt', '0399751115', 'Ngô Cát Yến', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0283909742', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Đại Việt Tower, 36 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(737, 'KH-DA4A', 'business', 'Công ty TNHH MTV Hòa Bình Thương mại', 'Công ty TNHH MTV Hòa Bình Thương mại', '0656209491', 'Dương Hồng Phượng', 'https://hoabinh.com.vn', 'Tạm ngưng', '0763381522', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Hòa Bình Tower, 155 Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(738, 'KH-AC76', 'business', 'Hợp tác xã Hòa Bình Cơ khí', 'Hợp tác xã Hòa Bình Cơ khí', '0856472312', 'Dương Lan Phượng', 'https://hoabinh.com.vn', 'Đang hoạt động', '0789999219', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Hòa Bình Tower, 249 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(739, 'KH-F59B', 'business', 'Hợp tác xã Nam Á', 'Hợp tác xã Nam Á', '0616179803', 'Bùi Bảo Lâm', 'https://nama.com.vn', 'Tạm ngưng', '0396526822', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Nam Á Tower, 17 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(740, 'KH-8604', 'business', 'Doanh nghiệp Tư nhân An Phát', 'Doanh nghiệp Tư nhân An Phát', '0906770707', 'Đặng Minh Minh', 'https://anphat.com.vn', 'Ngừng hoạt động', '0834261544', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà An Phát Tower, 145 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(741, 'KH-D434', 'business', 'Hợp tác xã Cửu Long Năng lượng', 'Hợp tác xã Cửu Long Năng lượng', '0905322535', 'Phan Duy Trung', 'https://cuulong.com.vn', 'Tạm ngưng', '0982028676', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Cửu Long Tower, 80 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(742, 'KH-48AC', 'business', 'Công ty TNHH MTV Sao Mai', 'Công ty TNHH MTV Sao Mai', '0831858898', 'Mai Hoài Oanh', 'https://saomai.com.vn', 'Đang hoạt động', '0283608117', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Sao Mai Tower, 6 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(743, 'KH-E02E', 'business', 'Doanh nghiệp Tư nhân Sông Hồng', 'Doanh nghiệp Tư nhân Sông Hồng', '0719747488', 'Trần Cát Phương', 'https://songhong.com.vn', 'Ngừng hoạt động', '0243269267', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Sông Hồng Tower, 178 Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(744, 'KH-0EA0', 'business', 'Công ty Cổ phần Thành Công Thương mại', 'Công ty Cổ phần Thành Công Thương mại', '0428093520', 'Đặng Bích Oanh', 'https://thanhcong.com.vn', 'Tạm ngưng', '0243651842', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Thành Công Tower, 157 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(745, 'KH-AA8D', 'business', 'Công ty TNHH Thịnh Phát', 'Công ty TNHH Thịnh Phát', '0301893552', 'Hoàng Nhật Trung', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0349417344', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Thịnh Phát Tower, 200 Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(746, 'KH-153A', 'business', 'Hợp tác xã Hòa Bình Công nghệ', 'Hợp tác xã Hòa Bình Công nghệ', '0927483474', 'Trần Hữu Bảo', 'https://hoabinh.com.vn', 'Đang hoạt động', '0283717243', 'contact@hoabinh.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Hòa Bình Tower, 176 Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(747, 'KH-F4C6', 'business', 'Doanh nghiệp Tư nhân Đông Dương', 'Doanh nghiệp Tư nhân Đông Dương', '0906096022', 'Võ Tiến Phong', 'https://dongduong.com.vn', 'Tạm ngưng', '0243827834', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Đông Dương Tower, 242 Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(748, 'KH-C767', 'business', 'Công ty TNHH Trường Giang', 'Công ty TNHH Trường Giang', '0546782885', 'Lý Khánh Tuyền', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0362567556', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Trường Giang Tower, 13 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(749, 'KH-ECE0', 'business', 'Hợp tác xã Hoàng Gia', 'Hợp tác xã Hoàng Gia', '0403085284', 'Bùi Thị Đào', 'https://hoanggia.com.vn', 'Đang hoạt động', '0283098988', 'contact@hoanggia.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Hoàng Gia Tower, 221 Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(750, 'KH-4DA1', 'business', 'Tập đoàn Minh Đăng', 'Tập đoàn Minh Đăng', '0724069928', 'Trần Cẩm Đào', 'https://minhdang.com.vn', 'Đang hoạt động', '0243276371', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Minh Đăng Tower, 228 Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(751, 'KH-F457', 'business', 'Công ty TNHH Đất Việt', 'Công ty TNHH Đất Việt', '0458561482', 'Bùi Thành Đạt', 'https://datviet.com.vn', 'NNT đang hoạt động', '0243123048', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Đất Việt Tower, 54 Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(752, 'KH-FC75', 'business', 'Công ty Cổ phần Trường Sơn Thực phẩm', 'Công ty Cổ phần Trường Sơn Thực phẩm', '0488238045', 'Bùi Tuấn Trung', 'https://truongson.com.vn', 'Ngừng hoạt động', '0283375575', 'contact@truongson.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Trường Sơn Tower, 203 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(753, 'KH-D4F2', 'business', 'Công ty TNHH MTV Trường Sơn', 'Công ty TNHH MTV Trường Sơn', '0265241109', 'Lâm Diệu Lan', 'https://truongson.com.vn', 'Đang hoạt động', '0832551591', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Trường Sơn Tower, 220 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(754, 'KH-06E3', 'business', 'Doanh nghiệp Tư nhân Đại Nam', 'Doanh nghiệp Tư nhân Đại Nam', '0906469633', 'Đặng Nhật Sơn', 'https://dainam.com.vn', 'NNT đang hoạt động', '0943895617', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Đại Nam Tower, 222 Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(755, 'KH-8760', 'business', 'Công ty TNHH Hồng Hà', 'Công ty TNHH Hồng Hà', '0465044928', 'Phạm Như Hạnh', 'https://hongha.com.vn', 'Đang hoạt động', '0243404585', 'contact@hongha.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Hồng Hà Tower, 166 Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(756, 'KH-08EE', 'business', 'Công ty TNHH MTV Việt Á Xây dựng', 'Công ty TNHH MTV Việt Á Xây dựng', '0795019158', 'Hoàng Diệu Hương', 'https://vieta.com.vn', 'NNT đang hoạt động', '0822173151', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Việt Á Tower, 6 Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:34', '2026-06-04 17:56:34'),
(757, 'KH-A156', 'business', 'Công ty TNHH MTV Tân Á Thời trang', 'Công ty TNHH MTV Tân Á Thời trang', '0611792278', 'Phùng Duy Thái', 'https://tana.com.vn', 'Ngừng hoạt động', '0243058813', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Tân Á Tower, 93 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(758, 'KH-9A89', 'business', 'Doanh nghiệp Tư nhân Vinh Quang Xây dựng', 'Doanh nghiệp Tư nhân Vinh Quang Xây dựng', '0458473262', 'Phan Xuân Long', 'https://vinhquang.com.vn', 'Tạm ngưng', '0851435725', 'contact@vinhquang.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Vinh Quang Tower, 153 Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(759, 'KH-0555', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0785254096', 'Lý Tiến Dũng', 'https://hongha.com.vn', 'NNT đang hoạt động', '0363160437', 'contact@hongha.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Hồng Hà Tower, 143 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(760, 'KH-109A', 'business', 'Công ty TNHH MTV Trường Giang Thực phẩm', 'Công ty TNHH MTV Trường Giang Thực phẩm', '0270957283', 'Phùng Xuân Tuấn', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0903086447', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Trường Giang Tower, 110 Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(761, 'KH-0E2D', 'business', 'Công ty Cổ phần Sao Mai Giáo dục', 'Công ty Cổ phần Sao Mai Giáo dục', '0425891233', 'Đỗ Diệu Hà', 'https://saomai.com.vn', 'NNT đang hoạt động', '0243916075', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 18 Tòa nhà Sao Mai Tower, 29 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(762, 'KH-1F06', 'business', 'Công ty TNHH MTV An Phát Năng lượng', 'Công ty TNHH MTV An Phát Năng lượng', '0537960972', 'Võ Thành Đông', 'https://anphat.com.vn', 'Đang hoạt động', '0320504834', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà An Phát Tower, 68 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(763, 'KH-B8A0', 'business', 'Công ty Cổ phần Thái Bình Dương Truyền thông', 'Công ty Cổ phần Thái Bình Dương Truyền thông', '0731135273', 'Đỗ Diệu Trúc', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0243074020', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 206 Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(764, 'KH-E77F', 'business', 'Hợp tác xã Tiến Phong Giáo dục', 'Hợp tác xã Tiến Phong Giáo dục', '0739681466', 'Đỗ Quang Hải', 'https://tienphong.com.vn', 'Đang hoạt động', '0283753805', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Tiến Phong Tower, 128 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(765, 'KH-7294', 'business', 'Hợp tác xã An Phát', 'Hợp tác xã An Phát', '0348365981', 'Bùi Nhật Đông', 'https://anphat.com.vn', 'Ngừng hoạt động', '0820714348', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà An Phát Tower, 209 Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(766, 'KH-5CC6', 'business', 'Công ty TNHH Hòa Bình Thương mại', 'Công ty TNHH Hòa Bình Thương mại', '0462997195', 'Nguyễn Như Liên', 'https://hoabinh.com.vn', 'Ngừng hoạt động', '0283909203', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Hòa Bình Tower, 59 Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(767, 'KH-6917', 'business', 'Công ty TNHH Đại Nam Thương mại', 'Công ty TNHH Đại Nam Thương mại', '0264171687', 'Võ Tiến Thái', 'https://dainam.com.vn', 'Đang hoạt động', '0797600152', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Đại Nam Tower, 127 Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(768, 'KH-E63A', 'business', 'Công ty TNHH Kim Đô Công nghệ', 'Công ty TNHH Kim Đô Công nghệ', '0838528199', 'Phạm Minh Việt', 'https://kimdo.com.vn', 'Tạm ngưng', '0283899209', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Kim Đô Tower, 141 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(769, 'KH-44AD', 'business', 'Tập đoàn Thịnh Phát', 'Tập đoàn Thịnh Phát', '0390589262', 'Bùi Quỳnh Chi', 'https://thinhphat.com.vn', 'Tạm ngưng', '0974802188', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Thịnh Phát Tower, 192 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(770, 'KH-A285', 'business', 'Công ty TNHH MTV Đại Nam Thương mại', 'Công ty TNHH MTV Đại Nam Thương mại', '0278638688', 'Hoàng Hoài Thu', 'https://dainam.com.vn', 'Đang hoạt động', '0283132135', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Đại Nam Tower, 168 Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(771, 'KH-2BCE', 'business', 'Công ty TNHH MTV Thành Công Vận tải', 'Công ty TNHH MTV Thành Công Vận tải', '0653413370', 'Dương Quốc Đức', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0283576081', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Thành Công Tower, 182 Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(772, 'KH-596C', 'business', 'Công ty TNHH MTV Nam Á', 'Công ty TNHH MTV Nam Á', '0339816371', 'Phan Hoàng Lâm', 'https://nama.com.vn', 'NNT đang hoạt động', '0283686349', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Nam Á Tower, 245 Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(773, 'KH-5856', 'business', 'Hợp tác xã Đại Việt Bất động sản', 'Hợp tác xã Đại Việt Bất động sản', '0435125000', 'Lý Thu Anh', 'https://daiviet.com.vn', 'NNT đang hoạt động', '0283424510', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Đại Việt Tower, 224 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(774, 'KH-97D4', 'business', 'Công ty TNHH MTV Hoa Sen', 'Công ty TNHH MTV Hoa Sen', '0380228712', 'Lý Thảo Phượng', 'https://hoasen.com.vn', 'Đang hoạt động', '0919313750', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Hoa Sen Tower, 108 Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(775, 'KH-0B98', 'business', 'Doanh nghiệp Tư nhân Vinh Quang Thương mại', 'Doanh nghiệp Tư nhân Vinh Quang Thương mại', '0210596933', 'Dương Ngọc Tuyết', 'https://vinhquang.com.vn', 'Đang hoạt động', '0941498029', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Vinh Quang Tower, 66 Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(776, 'KH-8BDB', 'business', 'Công ty TNHH MTV Vinh Quang Đầu tư', 'Công ty TNHH MTV Vinh Quang Đầu tư', '0550107222', 'Vũ Mạnh Vinh', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0399124354', 'contact@vinhquang.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Vinh Quang Tower, 219 Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(777, 'KH-86C7', 'business', 'Công ty TNHH Đại Việt Thời trang', 'Công ty TNHH Đại Việt Thời trang', '0126807451', 'Trần Trọng Lâm', 'https://daiviet.com.vn', 'Đang hoạt động', '0762579860', 'contact@daiviet.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Đại Việt Tower, 127 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(778, 'KH-3BB9', 'business', 'Hợp tác xã Đất Việt Đầu tư', 'Hợp tác xã Đất Việt Đầu tư', '0494241676', 'Phùng Bích Chi', 'https://datviet.com.vn', 'Ngừng hoạt động', '0243915042', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Đất Việt Tower, 139 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(779, 'KH-9C06', 'business', 'Công ty Cổ phần Kim Đô Năng lượng', 'Công ty Cổ phần Kim Đô Năng lượng', '0350780417', 'Đinh Quang Phong', 'https://kimdo.com.vn', 'Tạm ngưng', '0356286225', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Kim Đô Tower, 16 Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(780, 'KH-4782', 'business', 'Công ty TNHH MTV Việt Á Xây dựng', 'Công ty TNHH MTV Việt Á Xây dựng', '0462878523', 'Lâm Xuân Việt', 'https://vieta.com.vn', 'Đang hoạt động', '0283576679', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Việt Á Tower, 155 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(781, 'KH-8B6A', 'business', 'Doanh nghiệp Tư nhân Trường Sơn Truyền thông', 'Doanh nghiệp Tư nhân Trường Sơn Truyền thông', '0394351407', 'Mai Cát Cúc', 'https://truongson.com.vn', 'Đang hoạt động', '0283851227', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Trường Sơn Tower, 220 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(782, 'KH-96C0', 'business', 'Hợp tác xã Minh Đăng Sản xuất', 'Hợp tác xã Minh Đăng Sản xuất', '0437084890', 'Lâm Thảo Hoa', 'https://minhdang.com.vn', 'Đang hoạt động', '0970781932', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Minh Đăng Tower, 212 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(783, 'KH-28C7', 'business', 'Công ty TNHH Khải Hoàn Du lịch', 'Công ty TNHH Khải Hoàn Du lịch', '0151732293', 'Hoàng Mạnh Khoa', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0243840819', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Khải Hoàn Tower, 102 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(784, 'KH-2072', 'business', 'Công ty TNHH MTV Trường Giang Thương mại', 'Công ty TNHH MTV Trường Giang Thương mại', '0204477391', 'Nguyễn Bích My', 'https://truonggiang.com.vn', 'Đang hoạt động', '0283939666', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Trường Giang Tower, 175 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(785, 'KH-76A3', 'business', 'Công ty Cổ phần Đất Việt Năng lượng', 'Công ty Cổ phần Đất Việt Năng lượng', '0883755818', 'Huỳnh Nhật Tân', 'https://datviet.com.vn', 'Ngừng hoạt động', '0243233272', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Đất Việt Tower, 161 Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(786, 'KH-EB01', 'business', 'Tập đoàn Cửu Long', 'Tập đoàn Cửu Long', '0381988737', 'Vũ Khánh Tuấn', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0964067233', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Cửu Long Tower, 1 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(787, 'KH-F0FB', 'business', 'Công ty TNHH Trường Sơn', 'Công ty TNHH Trường Sơn', '0778959779', 'Trần Hữu Tùng', 'https://truongson.com.vn', 'NNT đang hoạt động', '0355199219', 'contact@truongson.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 152 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(788, 'KH-1BF9', 'business', 'Doanh nghiệp Tư nhân Thành Công', 'Doanh nghiệp Tư nhân Thành Công', '0173164405', 'Đỗ Duy Bình', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0781135636', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Thành Công Tower, 78 Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(789, 'KH-537C', 'business', 'Tập đoàn Việt Á', 'Tập đoàn Việt Á', '0779927331', 'Nguyễn Hoàng Kiệt', 'https://vieta.com.vn', 'NNT đang hoạt động', '0840452200', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Việt Á Tower, 44 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(790, 'KH-DF3C', 'business', 'Công ty TNHH Việt Á Thực phẩm', 'Công ty TNHH Việt Á Thực phẩm', '0825230808', 'Hoàng Như Liên', 'https://vieta.com.vn', 'Đang hoạt động', '0791720036', 'contact@vieta.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Việt Á Tower, 154 Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(791, 'KH-2290', 'business', 'Hợp tác xã Thái Bình Dương Bất động sản', 'Hợp tác xã Thái Bình Dương Bất động sản', '0910540493', 'Hồ Diệu Tuyết', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0911600735', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 9 Tòa nhà Thái Bình Dương Tower, 103 Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(792, 'KH-89BF', 'business', 'Công ty TNHH Thái Bình Dương', 'Công ty TNHH Thái Bình Dương', '0461987728', 'Lê Cát My', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0369097928', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 18 Tòa nhà Thái Bình Dương Tower, 244 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(793, 'KH-7025', 'business', 'Hợp tác xã Tân Á', 'Hợp tác xã Tân Á', '0384344911', 'Đỗ Lan Cúc', 'https://tana.com.vn', 'NNT đang hoạt động', '0702524776', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Tân Á Tower, 175 Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(794, 'KH-EDE8', 'business', 'Công ty Cổ phần Tân Á Đầu tư', 'Công ty Cổ phần Tân Á Đầu tư', '0304347644', 'Dương Bảo Khoa', 'https://tana.com.vn', 'Ngừng hoạt động', '0283084762', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Tân Á Tower, 211 Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(795, 'KH-4DFD', 'business', 'Công ty TNHH MTV Kim Đô Du lịch', 'Công ty TNHH MTV Kim Đô Du lịch', '0979232643', 'Ngô Mạnh Lâm', 'https://kimdo.com.vn', 'Đang hoạt động', '0832903147', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Kim Đô Tower, 81 Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(796, 'KH-45D6', 'business', 'Tập đoàn Việt Á Dịch vụ', 'Tập đoàn Việt Á Dịch vụ', '0982506560', 'Đặng Duy Khánh', 'https://vieta.com.vn', 'NNT đang hoạt động', '0243754195', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Việt Á Tower, 204 Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(797, 'KH-E877', 'business', 'Tập đoàn Nam Á Truyền thông', 'Tập đoàn Nam Á Truyền thông', '0429927386', 'Lâm Cẩm Quỳnh', 'https://nama.com.vn', 'Tạm ngưng', '0243065478', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Nam Á Tower, 99 Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(798, 'KH-7E3F', 'business', 'Công ty Cổ phần Thành Công Công nghệ', 'Công ty Cổ phần Thành Công Công nghệ', '0348600225', 'Nguyễn Phương Cúc', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0849640906', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Thành Công Tower, 141 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(799, 'KH-88BA', 'business', 'Công ty TNHH Hoa Sen', 'Công ty TNHH Hoa Sen', '0871740590', 'Mai Thành Hoàng', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0702615932', 'contact@hoasen.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Hoa Sen Tower, 205 Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(800, 'KH-5F8C', 'business', 'Công ty TNHH MTV Kim Đô Xây dựng', 'Công ty TNHH MTV Kim Đô Xây dựng', '0906314584', 'Vũ Hữu Cường', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0849298654', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Kim Đô Tower, 123 Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(801, 'KH-38B6', 'business', 'Công ty TNHH Hồng Hà Dịch vụ', 'Công ty TNHH Hồng Hà Dịch vụ', '0864302600', 'Huỳnh Bảo Giang', 'https://hongha.com.vn', 'NNT đang hoạt động', '0243531780', 'contact@hongha.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Hồng Hà Tower, 149 Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(802, 'KH-0150', 'business', 'Công ty TNHH MTV Hải Đăng Thời trang', 'Công ty TNHH MTV Hải Đăng Thời trang', '0494910550', 'Dương Văn Quang', 'https://haidang.com.vn', 'NNT đang hoạt động', '0325293091', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Hải Đăng Tower, 63 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(803, 'KH-E038', 'business', 'Tập đoàn Sông Hồng', 'Tập đoàn Sông Hồng', '0172928502', 'Lê Khánh Khánh', 'https://songhong.com.vn', 'NNT đang hoạt động', '0397063042', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Sông Hồng Tower, 151 Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(804, 'KH-F550', 'business', 'Công ty TNHH MTV Sông Hồng Sản xuất', 'Công ty TNHH MTV Sông Hồng Sản xuất', '0971656987', 'Hoàng Khánh Hằng', 'https://songhong.com.vn', 'Ngừng hoạt động', '0910550206', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 9 Tòa nhà Sông Hồng Tower, 27 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(805, 'KH-F01F', 'business', 'Tập đoàn Thịnh Phát', 'Tập đoàn Thịnh Phát', '0813007156', 'Huỳnh Hữu Hải', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0907696693', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Thịnh Phát Tower, 79 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(806, 'KH-68B7', 'business', 'Công ty TNHH Tiến Phong', 'Công ty TNHH Tiến Phong', '0601576034', 'Ngô Quang Lâm', 'https://tienphong.com.vn', 'NNT đang hoạt động', '0828779479', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Tiến Phong Tower, 229 Bùi Thị Xuân, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(807, 'KH-D1D8', 'business', 'Doanh nghiệp Tư nhân Kim Đô Dịch vụ', 'Doanh nghiệp Tư nhân Kim Đô Dịch vụ', '0674304968', 'Mai Khánh Huy', 'https://kimdo.com.vn', 'Ngừng hoạt động', '0913282753', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Kim Đô Tower, 204 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(808, 'KH-A945', 'business', 'Công ty TNHH MTV Thịnh Phát Bất động sản', 'Công ty TNHH MTV Thịnh Phát Bất động sản', '0641637942', 'Lý Văn Thái', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0851300948', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Thịnh Phát Tower, 182 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(809, 'KH-9144', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0138826157', 'Phan Hoàng Cường', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0243541555', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Vạn Xuân Tower, 154 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(810, 'KH-B9A8', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0557980872', 'Nguyễn Ngọc Mai', 'https://hoabinh.com.vn', 'Ngừng hoạt động', '0373277863', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Hòa Bình Tower, 170 Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(811, 'KH-AFD5', 'business', 'Công ty TNHH Thành Công', 'Công ty TNHH Thành Công', '0449948229', 'Huỳnh Diệu Tuyền', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0337153126', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Thành Công Tower, 99 Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(812, 'KH-C224', 'business', 'Công ty Cổ phần An Phát', 'Công ty Cổ phần An Phát', '0454592200', 'Đỗ Bích Tuyết', 'https://anphat.com.vn', 'Đang hoạt động', '0937501377', 'contact@anphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà An Phát Tower, 151 Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(813, 'KH-BC74', 'business', 'Tập đoàn Việt Á', 'Tập đoàn Việt Á', '0680329321', 'Đỗ Mạnh Đạt', 'https://vieta.com.vn', 'NNT đang hoạt động', '0703011371', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Việt Á Tower, 168 Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(814, 'KH-BFF8', 'business', 'Công ty Cổ phần Minh Đăng', 'Công ty Cổ phần Minh Đăng', '0660230021', 'Lâm Hoàng Đức', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0283785308', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Minh Đăng Tower, 49 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(815, 'KH-F143', 'business', 'Công ty Cổ phần Đông Dương Truyền thông', 'Công ty Cổ phần Đông Dương Truyền thông', '0496073598', 'Huỳnh Thu Linh', 'https://dongduong.com.vn', 'Tạm ngưng', '0830731589', 'contact@dongduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Đông Dương Tower, 220 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(816, 'KH-9614', 'business', 'Công ty Cổ phần Thành Công Thương mại', 'Công ty Cổ phần Thành Công Thương mại', '0425747532', 'Đinh Diệu Tuyền', 'https://thanhcong.com.vn', 'Đang hoạt động', '0283207160', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Thành Công Tower, 223 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(817, 'KH-EE44', 'business', 'Công ty Cổ phần Kim Đô Thời trang', 'Công ty Cổ phần Kim Đô Thời trang', '0844927203', 'Võ Thị Trang', 'https://kimdo.com.vn', 'Đang hoạt động', '0243753767', 'contact@kimdo.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Kim Đô Tower, 52 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(818, 'KH-2525', 'business', 'Tập đoàn Vinh Quang', 'Tập đoàn Vinh Quang', '0328766464', 'Phan Tiến Hải', 'https://vinhquang.com.vn', 'Đang hoạt động', '0359930764', 'contact@vinhquang.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Vinh Quang Tower, 205 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(819, 'KH-F136', 'business', 'Doanh nghiệp Tư nhân Hải Đăng', 'Doanh nghiệp Tư nhân Hải Đăng', '0815614344', 'Trần Diệu Ngọc', 'https://haidang.com.vn', 'Đang hoạt động', '0243077771', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Hải Đăng Tower, 185 Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(820, 'KH-EA5E', 'business', 'Công ty TNHH Kim Đô', 'Công ty TNHH Kim Đô', '0523357385', 'Bùi Như Oanh', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0844789745', 'contact@kimdo.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Kim Đô Tower, 233 Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(821, 'KH-3EF9', 'business', 'Công ty TNHH MTV Trường Giang', 'Công ty TNHH MTV Trường Giang', '0804206638', 'Dương Hoàng Giang', 'https://truonggiang.com.vn', 'Đang hoạt động', '0837230532', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Trường Giang Tower, 150 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(822, 'KH-A4BE', 'business', 'Công ty Cổ phần Tân Á Du lịch', 'Công ty Cổ phần Tân Á Du lịch', '0844002623', 'Mai Mạnh Tùng', 'https://tana.com.vn', 'NNT đang hoạt động', '0778121750', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Tân Á Tower, 201 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(823, 'KH-B659', 'business', 'Hợp tác xã Vạn Xuân', 'Hợp tác xã Vạn Xuân', '0506061306', 'Mai Khánh Vinh', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0283336335', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Vạn Xuân Tower, 112 Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(824, 'KH-01D0', 'business', 'Hợp tác xã Minh Đăng', 'Hợp tác xã Minh Đăng', '0571492000', 'Phan Tiến Tùng', 'https://minhdang.com.vn', 'Tạm ngưng', '0788118781', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Minh Đăng Tower, 104 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(825, 'KH-3A13', 'business', 'Tập đoàn Sông Hồng Giáo dục', 'Tập đoàn Sông Hồng Giáo dục', '0525040690', 'Võ Bảo Hoàng', 'https://songhong.com.vn', 'Đang hoạt động', '0857185789', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Sông Hồng Tower, 89 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(826, 'KH-D4D9', 'business', 'Công ty TNHH Thịnh Phát', 'Công ty TNHH Thịnh Phát', '0169599104', 'Phan Hoàng Hùng', 'https://thinhphat.com.vn', 'Ngừng hoạt động', '0764486581', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Thịnh Phát Tower, 43 Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(827, 'KH-D8BB', 'business', 'Công ty TNHH Hoàng Gia Cơ khí', 'Công ty TNHH Hoàng Gia Cơ khí', '0103552154', 'Mai Phương Hạnh', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0363312300', 'contact@hoanggia.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Hoàng Gia Tower, 49 Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(828, 'KH-539C', 'business', 'Doanh nghiệp Tư nhân Hòa Bình', 'Doanh nghiệp Tư nhân Hòa Bình', '0122188014', 'Ngô Khánh Bình', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0243995861', 'contact@hoabinh.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Hòa Bình Tower, 48 Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(829, 'KH-2CFA', 'business', 'Công ty Cổ phần Hòa Bình Giáo dục', 'Công ty Cổ phần Hòa Bình Giáo dục', '0163626684', 'Bùi Như Phương', 'https://hoabinh.com.vn', 'Tạm ngưng', '0243011298', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Hòa Bình Tower, 239 Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(830, 'KH-6995', 'business', 'Công ty TNHH MTV Đại Nam', 'Công ty TNHH MTV Đại Nam', '0440801157', 'Bùi Duy Bảo', 'https://dainam.com.vn', 'NNT đang hoạt động', '0766039998', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Đại Nam Tower, 226 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(831, 'KH-3F98', 'business', 'Công ty Cổ phần Thái Bình Dương Thời trang', 'Công ty Cổ phần Thái Bình Dương Thời trang', '0559094341', 'Võ Quang Quân', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0283268846', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Thái Bình Dương Tower, 113 Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(832, 'KH-BAF3', 'business', 'Hợp tác xã Thành Công Vận tải', 'Hợp tác xã Thành Công Vận tải', '0553685021', 'Dương Đức Việt', 'https://thanhcong.com.vn', 'Đang hoạt động', '0243649821', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Thành Công Tower, 191 Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(833, 'KH-1723', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0821187393', 'Huỳnh Thảo Oanh', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0842606231', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Thành Công Tower, 147 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(834, 'KH-B80D', 'business', 'Tập đoàn An Phát', 'Tập đoàn An Phát', '0287642987', 'Hoàng Quốc Quân', 'https://anphat.com.vn', 'Tạm ngưng', '0243958584', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà An Phát Tower, 26 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(835, 'KH-5AF8', 'business', 'Doanh nghiệp Tư nhân Hải Đăng', 'Doanh nghiệp Tư nhân Hải Đăng', '0808656997', 'Hoàng Khánh Hoa', 'https://haidang.com.vn', 'Đang hoạt động', '0243423713', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Hải Đăng Tower, 148 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(836, 'KH-E879', 'business', 'Doanh nghiệp Tư nhân Thái Bình Dương', 'Doanh nghiệp Tư nhân Thái Bình Dương', '0677378840', 'Dương Hữu Khánh', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0819509839', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Thái Bình Dương Tower, 2 Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(837, 'KH-AD57', 'business', 'Doanh nghiệp Tư nhân Thịnh Phát Bất động sản', 'Doanh nghiệp Tư nhân Thịnh Phát Bất động sản', '0501809996', 'Nguyễn Quốc Nam', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0820635397', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Thịnh Phát Tower, 156 Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(838, 'KH-84E4', 'business', 'Công ty Cổ phần Thái Bình Dương', 'Công ty Cổ phần Thái Bình Dương', '0968765410', 'Phan Thành Hùng', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0243948329', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Thái Bình Dương Tower, 129 Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(839, 'KH-57C7', 'business', 'Công ty TNHH An Phát Truyền thông', 'Công ty TNHH An Phát Truyền thông', '0420393805', 'Trần Trọng Hải', 'https://anphat.com.vn', 'Tạm ngưng', '0977714430', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà An Phát Tower, 122 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(840, 'KH-C60D', 'business', 'Công ty TNHH Tiến Phong', 'Công ty TNHH Tiến Phong', '0431634763', 'Đặng Mạnh Khoa', 'https://tienphong.com.vn', 'Đang hoạt động', '0243530021', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Tiến Phong Tower, 39 Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(841, 'KH-D19A', 'business', 'Doanh nghiệp Tư nhân Tiến Phong', 'Doanh nghiệp Tư nhân Tiến Phong', '0273338495', 'Hoàng Tuấn Minh', 'https://tienphong.com.vn', 'Tạm ngưng', '0283222704', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Tiến Phong Tower, 189 Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(842, 'KH-957C', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0940949589', 'Mai Như Cúc', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0963835279', 'contact@cuulong.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Cửu Long Tower, 26 Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(843, 'KH-1B19', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0185013475', 'Bùi Xuân Kiệt', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0243224777', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Minh Đăng Tower, 211 Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(844, 'KH-F611', 'business', 'Công ty TNHH Minh Đăng', 'Công ty TNHH Minh Đăng', '0829752609', 'Phan Hoài Yến', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0283966315', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Minh Đăng Tower, 163 Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(845, 'KH-0C8B', 'business', 'Doanh nghiệp Tư nhân Đại Nam', 'Doanh nghiệp Tư nhân Đại Nam', '0800720106', 'Võ Phương Vân', 'https://dainam.com.vn', 'NNT đang hoạt động', '0985862433', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Đại Nam Tower, 85 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(846, 'KH-3C83', 'business', 'Công ty TNHH MTV Việt Á', 'Công ty TNHH MTV Việt Á', '0349823512', 'Dương Minh Kiệt', 'https://vieta.com.vn', 'Tạm ngưng', '0981638057', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Việt Á Tower, 208 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(847, 'KH-AF8C', 'business', 'Công ty TNHH MTV Hoàng Gia Thực phẩm', 'Công ty TNHH MTV Hoàng Gia Thực phẩm', '0619867627', 'Bùi Quang Lâm', 'https://hoanggia.com.vn', 'Tạm ngưng', '0283463444', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Hoàng Gia Tower, 18 Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(848, 'KH-D0EB', 'business', 'Hợp tác xã Trường Sơn Thương mại', 'Hợp tác xã Trường Sơn Thương mại', '0638456362', 'Lý Cẩm My', 'https://truongson.com.vn', 'Đang hoạt động', '0243987874', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Trường Sơn Tower, 144 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(849, 'KH-6C24', 'business', 'Doanh nghiệp Tư nhân Vạn Xuân', 'Doanh nghiệp Tư nhân Vạn Xuân', '0299455602', 'Vũ Khánh Bảo', 'https://vanxuan.com.vn', 'Đang hoạt động', '0378244051', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Vạn Xuân Tower, 21 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(850, 'KH-5C53', 'business', 'Tập đoàn Trường Sơn', 'Tập đoàn Trường Sơn', '0392167928', 'Trần Tuyết Anh', 'https://truongson.com.vn', 'Ngừng hoạt động', '0797768284', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Trường Sơn Tower, 30 Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(851, 'KH-074D', 'business', 'Hợp tác xã Sao Mai', 'Hợp tác xã Sao Mai', '0817842798', 'Phan Quang Hùng', 'https://saomai.com.vn', 'NNT đang hoạt động', '0243530388', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Sao Mai Tower, 164 Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(852, 'KH-465E', 'business', 'Công ty TNHH MTV Sông Hồng', 'Công ty TNHH MTV Sông Hồng', '0936079520', 'Nguyễn Thảo Trúc', 'https://songhong.com.vn', 'Đang hoạt động', '0703350963', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Sông Hồng Tower, 78 Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(853, 'KH-1270', 'business', 'Tập đoàn Thái Bình Dương', 'Tập đoàn Thái Bình Dương', '0561514074', 'Hồ Đức Thái', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0782768523', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Thái Bình Dương Tower, 249 Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(854, 'KH-4966', 'business', 'Hợp tác xã Hải Đăng Cơ khí', 'Hợp tác xã Hải Đăng Cơ khí', '0775632809', 'Đỗ Khánh Lan', 'https://haidang.com.vn', 'Ngừng hoạt động', '0243197344', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Hải Đăng Tower, 172 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(855, 'KH-F698', 'business', 'Tập đoàn Hoàng Gia', 'Tập đoàn Hoàng Gia', '0340099388', 'Trần Duy Quang', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0774573997', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Hoàng Gia Tower, 20 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(856, 'KH-7F23', 'business', 'Công ty Cổ phần Kim Đô', 'Công ty Cổ phần Kim Đô', '0322852564', 'Lê Xuân Khoa', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0794017523', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Kim Đô Tower, 116 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(857, 'KH-3006', 'business', 'Doanh nghiệp Tư nhân Hải Đăng Thương mại', 'Doanh nghiệp Tư nhân Hải Đăng Thương mại', '0761302120', 'Đỗ Thị Liên', 'https://haidang.com.vn', 'Ngừng hoạt động', '0324137344', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Hải Đăng Tower, 89 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(858, 'KH-6085', 'business', 'Công ty TNHH MTV Sông Hồng', 'Công ty TNHH MTV Sông Hồng', '0912013643', 'Phạm Đức Kiệt', 'https://songhong.com.vn', 'Tạm ngưng', '0383335401', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Sông Hồng Tower, 216 Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(859, 'KH-A874', 'business', 'Hợp tác xã Trường Giang Công nghệ', 'Hợp tác xã Trường Giang Công nghệ', '0486205538', 'Phan Hữu Trung', 'https://truonggiang.com.vn', 'Tạm ngưng', '0905492109', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Trường Giang Tower, 142 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(860, 'KH-C3F1', 'business', 'Hợp tác xã Thái Bình Dương Xây dựng', 'Hợp tác xã Thái Bình Dương Xây dựng', '0816368192', 'Ngô Hồng Tuyền', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0332244550', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Thái Bình Dương Tower, 62 Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(861, 'KH-55A7', 'business', 'Công ty Cổ phần Đại Nam Sản xuất', 'Công ty Cổ phần Đại Nam Sản xuất', '0295872523', 'Lý Phương Lan', 'https://dainam.com.vn', 'NNT đang hoạt động', '0704706552', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Đại Nam Tower, 34 Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(862, 'KH-1443', 'business', 'Tập đoàn Khải Hoàn Du lịch', 'Tập đoàn Khải Hoàn Du lịch', '0418470064', 'Nguyễn Tiến Khánh', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0328155935', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Khải Hoàn Tower, 25 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(863, 'KH-3C36', 'business', 'Công ty Cổ phần Tân Á', 'Công ty Cổ phần Tân Á', '0837258135', 'Phùng Thành Khoa', 'https://tana.com.vn', 'Đang hoạt động', '0707949333', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Tân Á Tower, 178 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(864, 'KH-A0B9', 'business', 'Công ty Cổ phần Cửu Long Du lịch', 'Công ty Cổ phần Cửu Long Du lịch', '0954558808', 'Đặng Thị Đào', 'https://cuulong.com.vn', 'Đang hoạt động', '0243763951', 'contact@cuulong.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Cửu Long Tower, 208 Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(865, 'KH-3C52', 'business', 'Hợp tác xã Sao Mai', 'Hợp tác xã Sao Mai', '0461531400', 'Mai Hồng Lan', 'https://saomai.com.vn', 'Tạm ngưng', '0243074229', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Sao Mai Tower, 242 Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(866, 'KH-ED75', 'business', 'Tập đoàn Khải Hoàn Giáo dục', 'Tập đoàn Khải Hoàn Giáo dục', '0596131404', 'Lâm Mạnh Cường', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0364642686', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Khải Hoàn Tower, 76 Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(867, 'KH-988B', 'business', 'Công ty Cổ phần Hoàng Gia Sản xuất', 'Công ty Cổ phần Hoàng Gia Sản xuất', '0225618085', 'Vũ Mạnh Nam', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0392552083', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Hoàng Gia Tower, 55 Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(868, 'KH-4DA7', 'business', 'Tập đoàn Sao Mai', 'Tập đoàn Sao Mai', '0657948738', 'Nguyễn Tuấn Hải', 'https://saomai.com.vn', 'Đang hoạt động', '0283033234', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Sao Mai Tower, 9 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(869, 'KH-60E1', 'business', 'Công ty TNHH Hoa Sen', 'Công ty TNHH Hoa Sen', '0586517608', 'Hồ Tuyết My', 'https://hoasen.com.vn', 'NNT đang hoạt động', '0283840911', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Hoa Sen Tower, 87 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(870, 'KH-7A7F', 'business', 'Công ty Cổ phần Trường Sơn Giáo dục', 'Công ty Cổ phần Trường Sơn Giáo dục', '0679174420', 'Dương Thành Cường', 'https://truongson.com.vn', 'NNT đang hoạt động', '0775088716', 'contact@truongson.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Trường Sơn Tower, 207 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(871, 'KH-BC49', 'business', 'Hợp tác xã Nam Á', 'Hợp tác xã Nam Á', '0330336048', 'Vũ Hoàng Sơn', 'https://nama.com.vn', 'Đang hoạt động', '0283030994', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Nam Á Tower, 102 Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(872, 'KH-A1D4', 'business', 'Công ty TNHH MTV Tân Á Đầu tư', 'Công ty TNHH MTV Tân Á Đầu tư', '0873716220', 'Trần Quang Bảo', 'https://tana.com.vn', 'Ngừng hoạt động', '0379961535', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Tân Á Tower, 50 Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(873, 'KH-8D81', 'business', 'Công ty TNHH MTV Trường Giang Năng lượng', 'Công ty TNHH MTV Trường Giang Năng lượng', '0845157501', 'Huỳnh Duy Long', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0283145614', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Trường Giang Tower, 240 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(874, 'KH-491D', 'business', 'Tập đoàn Nam Á', 'Tập đoàn Nam Á', '0318111020', 'Phạm Tuyết Vy', 'https://nama.com.vn', 'Tạm ngưng', '0979595857', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Nam Á Tower, 43 Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(875, 'KH-0237', 'business', 'Hợp tác xã Kim Đô', 'Hợp tác xã Kim Đô', '0951839460', 'Lâm Hoàng Đức', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0322695981', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Kim Đô Tower, 243 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(876, 'KH-8184', 'business', 'Doanh nghiệp Tư nhân Minh Đăng', 'Doanh nghiệp Tư nhân Minh Đăng', '0795099016', 'Phan Thị Yến', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0243607455', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Minh Đăng Tower, 16 Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(877, 'KH-58B8', 'business', 'Công ty TNHH Đại Việt', 'Công ty TNHH Đại Việt', '0183633394', 'Đinh Thu An', 'https://daiviet.com.vn', 'Tạm ngưng', '0283640434', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Đại Việt Tower, 57 Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(878, 'KH-303B', 'business', 'Công ty Cổ phần Đông Dương', 'Công ty Cổ phần Đông Dương', '0643695638', 'Lâm Trọng Quang', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0243263818', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Đông Dương Tower, 191 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(879, 'KH-A62D', 'business', 'Công ty TNHH MTV Sao Mai Thương mại', 'Công ty TNHH MTV Sao Mai Thương mại', '0833516204', 'Bùi Ngọc Hoa', 'https://saomai.com.vn', 'Tạm ngưng', '0818006421', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Sao Mai Tower, 90 Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(880, 'KH-2118', 'business', 'Doanh nghiệp Tư nhân Đất Việt Truyền thông', 'Doanh nghiệp Tư nhân Đất Việt Truyền thông', '0259322123', 'Trần Như Yến', 'https://datviet.com.vn', 'Tạm ngưng', '0243291020', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Đất Việt Tower, 94 Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(881, 'KH-68E7', 'business', 'Công ty TNHH Vạn Xuân Công nghệ', 'Công ty TNHH Vạn Xuân Công nghệ', '0696991478', 'Phạm Tuyết Phương', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0791527522', 'contact@vanxuan.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Vạn Xuân Tower, 123 Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(882, 'KH-AE77', 'business', 'Doanh nghiệp Tư nhân Tiến Phong', 'Doanh nghiệp Tư nhân Tiến Phong', '0109052818', 'Phùng Đức Quang', 'https://tienphong.com.vn', 'Tạm ngưng', '0785672575', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Tiến Phong Tower, 114 Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(883, 'KH-59C9', 'business', 'Doanh nghiệp Tư nhân Thái Bình Dương', 'Doanh nghiệp Tư nhân Thái Bình Dương', '0425791530', 'Dương Quốc Thái', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0914996382', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Thái Bình Dương Tower, 91 Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(884, 'KH-3474', 'business', 'Công ty TNHH MTV An Phát', 'Công ty TNHH MTV An Phát', '0808757247', 'Bùi Thảo Hằng', 'https://anphat.com.vn', 'Tạm ngưng', '0398483550', 'contact@anphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà An Phát Tower, 238 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(885, 'KH-90B2', 'business', 'Công ty TNHH Đất Việt', 'Công ty TNHH Đất Việt', '0429035792', 'Ngô Hồng Ngọc', 'https://datviet.com.vn', 'Tạm ngưng', '0701972364', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Đất Việt Tower, 203 Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(886, 'KH-3DF1', 'business', 'Hợp tác xã An Phát Năng lượng', 'Hợp tác xã An Phát Năng lượng', '0756572239', 'Dương Mạnh Nam', 'https://anphat.com.vn', 'Tạm ngưng', '0945025433', 'contact@anphat.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà An Phát Tower, 147 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(887, 'KH-A863', 'business', 'Hợp tác xã Đại Nam Năng lượng', 'Hợp tác xã Đại Nam Năng lượng', '0270183219', 'Ngô Tuấn Anh', 'https://dainam.com.vn', 'Ngừng hoạt động', '0376903527', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Đại Nam Tower, 89 Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(888, 'KH-6088', 'business', 'Doanh nghiệp Tư nhân An Phát Công nghệ', 'Doanh nghiệp Tư nhân An Phát Công nghệ', '0832958579', 'Phùng Mai Chi', 'https://anphat.com.vn', 'Ngừng hoạt động', '0243668354', 'contact@anphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà An Phát Tower, 16 Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(889, 'KH-12F3', 'business', 'Hợp tác xã Tân Á', 'Hợp tác xã Tân Á', '0734232040', 'Hoàng Lan Giang', 'https://tana.com.vn', 'Ngừng hoạt động', '0880340632', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Tân Á Tower, 180 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(890, 'KH-3952', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0934445448', 'Nguyễn Tuấn Long', 'https://thanhcong.com.vn', 'Đang hoạt động', '0857627237', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Thành Công Tower, 19 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(891, 'KH-D880', 'business', 'Tập đoàn Sao Mai', 'Tập đoàn Sao Mai', '0831544130', 'Phan Ngọc Vy', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283061802', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Sao Mai Tower, 80 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(892, 'KH-AACE', 'business', 'Tập đoàn Đại Nam', 'Tập đoàn Đại Nam', '0572618972', 'Bùi Hữu Phong', 'https://dainam.com.vn', 'Đang hoạt động', '0935427596', 'contact@dainam.com.vn', NULL, NULL, 'Nam', 'Tầng 20 Tòa nhà Đại Nam Tower, 181 Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(893, 'KH-7F66', 'business', 'Tập đoàn Việt Á Vận tải', 'Tập đoàn Việt Á Vận tải', '0346536119', 'Phan Nhật Sơn', 'https://vieta.com.vn', 'NNT đang hoạt động', '0283043452', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Việt Á Tower, 96 Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(894, 'KH-CD17', 'business', 'Tập đoàn Cửu Long Năng lượng', 'Tập đoàn Cửu Long Năng lượng', '0227523062', 'Đặng Đức Hải', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0283022763', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Cửu Long Tower, 88 Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(895, 'KH-C73C', 'business', 'Công ty Cổ phần An Phát Vận tải', 'Công ty Cổ phần An Phát Vận tải', '0660913887', 'Hoàng Như Tuyền', 'https://anphat.com.vn', 'Tạm ngưng', '0960338602', 'contact@anphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 18 Tòa nhà An Phát Tower, 225 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(896, 'KH-AB0B', 'business', 'Hợp tác xã Đông Dương Bất động sản', 'Hợp tác xã Đông Dương Bất động sản', '0221120316', 'Hồ Khánh Quang', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0820070512', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Đông Dương Tower, 152 Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(897, 'KH-FB80', 'business', 'Công ty TNHH MTV Vinh Quang Thương mại', 'Công ty TNHH MTV Vinh Quang Thương mại', '0742507110', 'Hoàng Minh Đông', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0830274171', 'contact@vinhquang.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Vinh Quang Tower, 22 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(898, 'KH-DA23', 'business', 'Công ty Cổ phần Vinh Quang Dịch vụ', 'Công ty Cổ phần Vinh Quang Dịch vụ', '0854910193', 'Trần Bích Quỳnh', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0243785688', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 1 Tòa nhà Vinh Quang Tower, 104 Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(899, 'KH-8B3D', 'business', 'Tập đoàn Cửu Long Thời trang', 'Tập đoàn Cửu Long Thời trang', '0979594973', 'Võ Tuấn Minh', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0822544169', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Cửu Long Tower, 105 Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(900, 'KH-B8E6', 'business', 'Doanh nghiệp Tư nhân Đất Việt', 'Doanh nghiệp Tư nhân Đất Việt', '0949335608', 'Đỗ Quang Quang', 'https://datviet.com.vn', 'Ngừng hoạt động', '0283138554', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Đất Việt Tower, 105 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(901, 'KH-65B2', 'business', 'Công ty Cổ phần Vinh Quang', 'Công ty Cổ phần Vinh Quang', '0120497197', 'Mai Như Trang', 'https://vinhquang.com.vn', 'Đang hoạt động', '0381501899', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Vinh Quang Tower, 122 Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(902, 'KH-AF2F', 'business', 'Công ty Cổ phần Việt Á Du lịch', 'Công ty Cổ phần Việt Á Du lịch', '0423682254', 'Vũ Hoàng Bảo', 'https://vieta.com.vn', 'Ngừng hoạt động', '0349371523', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Việt Á Tower, 204 Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(903, 'KH-2E74', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0570763038', 'Phùng Nhật Tân', 'https://minhdang.com.vn', 'Đang hoạt động', '0243899437', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Minh Đăng Tower, 116 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(904, 'KH-D46E', 'business', 'Công ty Cổ phần Tiến Phong', 'Công ty Cổ phần Tiến Phong', '0960791738', 'Lâm Ngọc Ngọc', 'https://tienphong.com.vn', 'Tạm ngưng', '0243089438', 'contact@tienphong.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Tiến Phong Tower, 215 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(905, 'KH-00EA', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0690720610', 'Bùi Tuấn Giang', 'https://minhdang.com.vn', 'Đang hoạt động', '0243721622', 'contact@minhdang.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Minh Đăng Tower, 128 Bùi Thị Xuân, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(906, 'KH-B2E2', 'business', 'Tập đoàn Hoa Sen', 'Tập đoàn Hoa Sen', '0257474912', 'Ngô Thị Liên', 'https://hoasen.com.vn', 'Tạm ngưng', '0283571418', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Hoa Sen Tower, 182 Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(907, 'KH-A5C8', 'business', 'Doanh nghiệp Tư nhân Đại Việt Truyền thông', 'Doanh nghiệp Tư nhân Đại Việt Truyền thông', '0896546854', 'Phan Thị Thảo', 'https://daiviet.com.vn', 'Đang hoạt động', '0283444946', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Đại Việt Tower, 19 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(908, 'KH-DB49', 'business', 'Hợp tác xã Đất Việt Truyền thông', 'Hợp tác xã Đất Việt Truyền thông', '0497313486', 'Đinh Thành Cường', 'https://datviet.com.vn', 'NNT đang hoạt động', '0243674902', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Đất Việt Tower, 50 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(909, 'KH-8FB0', 'business', 'Tập đoàn Sông Hồng Vận tải', 'Tập đoàn Sông Hồng Vận tải', '0795903804', 'Dương Như Đào', 'https://songhong.com.vn', 'NNT đang hoạt động', '0243465434', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Sông Hồng Tower, 188 Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(910, 'KH-0F33', 'business', 'Hợp tác xã Thành Công', 'Hợp tác xã Thành Công', '0181996639', 'Nguyễn Tiến Việt', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0283355965', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 19 Tòa nhà Thành Công Tower, 223 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(911, 'KH-9CFA', 'business', 'Tập đoàn Vạn Xuân Dịch vụ', 'Tập đoàn Vạn Xuân Dịch vụ', '0774058455', 'Lâm Xuân Bảo', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0283637543', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Vạn Xuân Tower, 137 Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(912, 'KH-C3FA', 'business', 'Hợp tác xã Cửu Long', 'Hợp tác xã Cửu Long', '0882746797', 'Hồ Tuyết Giang', 'https://cuulong.com.vn', 'Đang hoạt động', '0243450919', 'contact@cuulong.com.vn', NULL, NULL, 'Nữ', 'Tầng 18 Tòa nhà Cửu Long Tower, 210 Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(913, 'KH-0E7F', 'business', 'Doanh nghiệp Tư nhân Sông Hồng Năng lượng', 'Doanh nghiệp Tư nhân Sông Hồng Năng lượng', '0292990613', 'Đỗ Thu Trúc', 'https://songhong.com.vn', 'Đang hoạt động', '0354279836', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Sông Hồng Tower, 52 Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(914, 'KH-091C', 'business', 'Công ty TNHH Đại Việt Cơ khí', 'Công ty TNHH Đại Việt Cơ khí', '0101041935', 'Đinh Minh Kiệt', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0283991422', 'contact@daiviet.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Đại Việt Tower, 114 Bùi Thị Xuân, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(915, 'KH-C1C6', 'business', 'Công ty TNHH Nam Á Vận tải', 'Công ty TNHH Nam Á Vận tải', '0978321037', 'Dương Như Anh', 'https://nama.com.vn', 'Tạm ngưng', '0283538489', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 8 Tòa nhà Nam Á Tower, 100 Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(916, 'KH-61DF', 'business', 'Công ty Cổ phần Thái Bình Dương', 'Công ty Cổ phần Thái Bình Dương', '0732322359', 'Dương Quỳnh My', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0709089426', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Thái Bình Dương Tower, 250 Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(917, 'KH-6B38', 'business', 'Công ty TNHH Trường Giang', 'Công ty TNHH Trường Giang', '0186361811', 'Hoàng Thu Ngọc', 'https://truonggiang.com.vn', 'Tạm ngưng', '0283776382', 'contact@truonggiang.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Trường Giang Tower, 156 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(918, 'KH-2F4D', 'business', 'Doanh nghiệp Tư nhân Sao Mai Thương mại', 'Doanh nghiệp Tư nhân Sao Mai Thương mại', '0806417650', 'Đặng Cát Hạnh', 'https://saomai.com.vn', 'Đang hoạt động', '0243385749', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Sao Mai Tower, 183 Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(919, 'KH-4E81', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0418761272', 'Lý Thành Minh', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0362673032', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 5 Tòa nhà Vạn Xuân Tower, 239 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(920, 'KH-4174', 'business', 'Công ty Cổ phần Hòa Bình', 'Công ty Cổ phần Hòa Bình', '0766064932', 'Võ Cẩm Tuyết', 'https://hoabinh.com.vn', 'Tạm ngưng', '0243759164', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Hòa Bình Tower, 124 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(921, 'KH-8E05', 'business', 'Hợp tác xã Hải Đăng', 'Hợp tác xã Hải Đăng', '0863268888', 'Mai Hoàng Tiến', 'https://haidang.com.vn', 'NNT đang hoạt động', '0283683484', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Hải Đăng Tower, 6 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(922, 'KH-88B3', 'business', 'Công ty TNHH Cửu Long', 'Công ty TNHH Cửu Long', '0739357364', 'Ngô Nhật Tuấn', 'https://cuulong.com.vn', 'Đang hoạt động', '0945073513', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Cửu Long Tower, 146 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(923, 'KH-D886', 'business', 'Công ty TNHH MTV Đại Nam Thực phẩm', 'Công ty TNHH MTV Đại Nam Thực phẩm', '0860930365', 'Hồ Ngọc Linh', 'https://dainam.com.vn', 'Đang hoạt động', '0904312771', 'contact@dainam.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Đại Nam Tower, 231 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(924, 'KH-5ED2', 'business', 'Công ty TNHH Sông Hồng', 'Công ty TNHH Sông Hồng', '0113378557', 'Lâm Hoài Thu', 'https://songhong.com.vn', 'Ngừng hoạt động', '0243605606', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Sông Hồng Tower, 195 Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(925, 'KH-59EA', 'business', 'Doanh nghiệp Tư nhân Hải Đăng', 'Doanh nghiệp Tư nhân Hải Đăng', '0654054526', 'Đinh Tiến Lâm', 'https://haidang.com.vn', 'Đang hoạt động', '0828958607', 'contact@haidang.com.vn', NULL, NULL, 'Nam', 'Tầng 14 Tòa nhà Hải Đăng Tower, 1 Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(926, 'KH-4617', 'business', 'Tập đoàn Thành Công', 'Tập đoàn Thành Công', '0613850750', 'Ngô Ngọc Dung', 'https://thanhcong.com.vn', 'Tạm ngưng', '0827563481', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Thành Công Tower, 245 Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(927, 'KH-2712', 'business', 'Tập đoàn Nam Á Giáo dục', 'Tập đoàn Nam Á Giáo dục', '0836409741', 'Hồ Thị Thu', 'https://nama.com.vn', 'Đang hoạt động', '0243942669', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 12 Tòa nhà Nam Á Tower, 111 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(928, 'KH-6264', 'business', 'Công ty Cổ phần Hoa Sen Du lịch', 'Công ty Cổ phần Hoa Sen Du lịch', '0117166058', 'Trần Nhật Quân', 'https://hoasen.com.vn', 'Đang hoạt động', '0399101257', 'contact@hoasen.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Hoa Sen Tower, 179 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(929, 'KH-8E23', 'business', 'Hợp tác xã Thịnh Phát Bất động sản', 'Hợp tác xã Thịnh Phát Bất động sản', '0858712490', 'Đỗ Quốc Tùng', 'https://thinhphat.com.vn', 'Tạm ngưng', '0325875333', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Thịnh Phát Tower, 127 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(930, 'KH-D591', 'business', 'Doanh nghiệp Tư nhân Tiến Phong', 'Doanh nghiệp Tư nhân Tiến Phong', '0742534211', 'Lê Hoài Ngọc', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0785366626', 'contact@tienphong.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Tiến Phong Tower, 120 Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(931, 'KH-883B', 'business', 'Công ty Cổ phần Tiến Phong', 'Công ty Cổ phần Tiến Phong', '0891182172', 'Võ Hữu Đức', 'https://tienphong.com.vn', 'Tạm ngưng', '0283492382', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Tiến Phong Tower, 203 Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(932, 'KH-4595', 'business', 'Công ty Cổ phần Kim Đô Cơ khí', 'Công ty Cổ phần Kim Đô Cơ khí', '0928110610', 'Đỗ Quốc Quang', 'https://kimdo.com.vn', 'Tạm ngưng', '0907901580', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Kim Đô Tower, 199 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `wallet_address`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(933, 'KH-9467', 'business', 'Doanh nghiệp Tư nhân Trường Giang', 'Doanh nghiệp Tư nhân Trường Giang', '0426981802', 'Võ Văn Bình', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0283027665', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Trường Giang Tower, 200 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(934, 'KH-E1AD', 'business', 'Công ty TNHH Cửu Long Truyền thông', 'Công ty TNHH Cửu Long Truyền thông', '0464756669', 'Hoàng Mai Trúc', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0390748036', 'contact@cuulong.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Cửu Long Tower, 29 Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(935, 'KH-4BC5', 'business', 'Tập đoàn Hải Đăng', 'Tập đoàn Hải Đăng', '0677285439', 'Hồ Mai Mai', 'https://haidang.com.vn', 'NNT đang hoạt động', '0795698659', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Hải Đăng Tower, 233 Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(936, 'KH-0E5E', 'business', 'Doanh nghiệp Tư nhân Trường Sơn', 'Doanh nghiệp Tư nhân Trường Sơn', '0262316657', 'Đỗ Hoàng Dũng', 'https://truongson.com.vn', 'Đang hoạt động', '0243970812', 'contact@truongson.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 12 Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(937, 'KH-18AB', 'business', 'Doanh nghiệp Tư nhân Tân Á Sản xuất', 'Doanh nghiệp Tư nhân Tân Á Sản xuất', '0697553294', 'Phùng Văn Phúc', 'https://tana.com.vn', 'NNT đang hoạt động', '0822717244', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Tân Á Tower, 64 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(938, 'KH-5E49', 'business', 'Tập đoàn Hòa Bình Công nghệ', 'Tập đoàn Hòa Bình Công nghệ', '0570788861', 'Huỳnh Diệu Trang', 'https://hoabinh.com.vn', 'Đang hoạt động', '0321471192', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Hòa Bình Tower, 24 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(939, 'KH-6B64', 'business', 'Công ty TNHH Thịnh Phát', 'Công ty TNHH Thịnh Phát', '0832632997', 'Phùng Hồng Mai', 'https://thinhphat.com.vn', 'Tạm ngưng', '0283380353', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Thịnh Phát Tower, 130 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(940, 'KH-16B4', 'business', 'Công ty TNHH Vinh Quang', 'Công ty TNHH Vinh Quang', '0873857637', 'Dương Hồng Cúc', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0283131265', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Vinh Quang Tower, 111 Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(941, 'KH-B723', 'business', 'Hợp tác xã Kim Đô Sản xuất', 'Hợp tác xã Kim Đô Sản xuất', '0718669224', 'Vũ Thảo Tuyền', 'https://kimdo.com.vn', 'Đang hoạt động', '0774009417', 'contact@kimdo.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Kim Đô Tower, 158 Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(942, 'KH-264F', 'business', 'Tập đoàn Tân Á Truyền thông', 'Tập đoàn Tân Á Truyền thông', '0286585895', 'Huỳnh Ngọc An', 'https://tana.com.vn', 'Đang hoạt động', '0243622648', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 15 Tòa nhà Tân Á Tower, 92 Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(943, 'KH-4929', 'business', 'Doanh nghiệp Tư nhân Tân Á Bất động sản', 'Doanh nghiệp Tư nhân Tân Á Bất động sản', '0536933268', 'Hoàng Bảo Phong', 'https://tana.com.vn', 'Đang hoạt động', '0361967904', 'contact@tana.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Tân Á Tower, 36 Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(944, 'KH-A6E2', 'business', 'Doanh nghiệp Tư nhân Tân Á', 'Doanh nghiệp Tư nhân Tân Á', '0864443363', 'Huỳnh Thị Phương', 'https://tana.com.vn', 'Đang hoạt động', '0283069180', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Tân Á Tower, 23 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(945, 'KH-8D20', 'business', 'Công ty TNHH MTV Cửu Long Du lịch', 'Công ty TNHH MTV Cửu Long Du lịch', '0743082651', 'Mai Tuấn Minh', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0243401430', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Cửu Long Tower, 65 Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(946, 'KH-B063', 'business', 'Công ty Cổ phần Sông Hồng', 'Công ty Cổ phần Sông Hồng', '0521512291', 'Đỗ Thành Hoàng', 'https://songhong.com.vn', 'Tạm ngưng', '0283161108', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 7 Tòa nhà Sông Hồng Tower, 131 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(947, 'KH-9A32', 'business', 'Hợp tác xã Vinh Quang', 'Hợp tác xã Vinh Quang', '0568463800', 'Nguyễn Bích Quỳnh', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0905766767', 'contact@vinhquang.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Vinh Quang Tower, 87 Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(948, 'KH-055E', 'business', 'Công ty TNHH Khải Hoàn', 'Công ty TNHH Khải Hoàn', '0831075402', 'Phùng Bảo Quân', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0824831901', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Khải Hoàn Tower, 75 Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(949, 'KH-11B5', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0782225774', 'Hồ Hoàng Khoa', 'https://cuulong.com.vn', 'Đang hoạt động', '0243818136', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Cửu Long Tower, 225 Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(950, 'KH-DAAB', 'business', 'Công ty TNHH MTV Vạn Xuân', 'Công ty TNHH MTV Vạn Xuân', '0857573663', 'Đinh Thị Trang', 'https://vanxuan.com.vn', 'Tạm ngưng', '0889099015', 'contact@vanxuan.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Vạn Xuân Tower, 38 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(951, 'KH-F2FB', 'business', 'Công ty Cổ phần Thành Công Truyền thông', 'Công ty Cổ phần Thành Công Truyền thông', '0492860238', 'Trần Bảo Đức', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0783948006', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Thành Công Tower, 19 Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(952, 'KH-61C5', 'business', 'Hợp tác xã Tiến Phong Năng lượng', 'Hợp tác xã Tiến Phong Năng lượng', '0713153055', 'Hoàng Hữu Thái', 'https://tienphong.com.vn', 'Đang hoạt động', '0888936927', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 13 Tòa nhà Tiến Phong Tower, 217 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(953, 'KH-1434', 'business', 'Doanh nghiệp Tư nhân Đất Việt Vận tải', 'Doanh nghiệp Tư nhân Đất Việt Vận tải', '0703965074', 'Phùng Thu Nhi', 'https://datviet.com.vn', 'NNT đang hoạt động', '0794951298', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 19 Tòa nhà Đất Việt Tower, 226 Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(954, 'KH-268A', 'business', 'Công ty TNHH Khải Hoàn Cơ khí', 'Công ty TNHH Khải Hoàn Cơ khí', '0467753204', 'Bùi Khánh Hằng', 'https://khaihoan.com.vn', 'Tạm ngưng', '0243215233', 'contact@khaihoan.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Khải Hoàn Tower, 148 Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(955, 'KH-26D5', 'business', 'Hợp tác xã Trường Giang Xây dựng', 'Hợp tác xã Trường Giang Xây dựng', '0264257653', 'Đặng Tuấn Vinh', 'https://truonggiang.com.vn', 'Tạm ngưng', '0700994387', 'contact@truonggiang.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Trường Giang Tower, 115 Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(956, 'KH-67D1', 'business', 'Doanh nghiệp Tư nhân Đất Việt Thời trang', 'Doanh nghiệp Tư nhân Đất Việt Thời trang', '0588521903', 'Phùng Minh Anh', 'https://datviet.com.vn', 'Đang hoạt động', '0844608333', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Đất Việt Tower, 122 Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(957, 'KH-6707', 'business', 'Hợp tác xã Trường Sơn', 'Hợp tác xã Trường Sơn', '0697050564', 'Mai Cát Vy', 'https://truongson.com.vn', 'NNT đang hoạt động', '0345220888', 'contact@truongson.com.vn', NULL, NULL, 'Nữ', 'Tầng 6 Tòa nhà Trường Sơn Tower, 104 Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(958, 'KH-FF75', 'business', 'Tập đoàn Thành Công Giáo dục', 'Tập đoàn Thành Công Giáo dục', '0677772853', 'Đỗ Cẩm Tuyền', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0243444007', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Thành Công Tower, 16 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(959, 'KH-6B21', 'business', 'Công ty TNHH Đông Dương', 'Công ty TNHH Đông Dương', '0452870251', 'Huỳnh Tuấn Phong', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0283967840', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Đông Dương Tower, 35 Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(960, 'KH-E7E9', 'business', 'Hợp tác xã Hòa Bình', 'Hợp tác xã Hòa Bình', '0533073312', 'Phạm Hoài Vân', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0283713073', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 11 Tòa nhà Hòa Bình Tower, 53 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(961, 'KH-7BF7', 'business', 'Hợp tác xã Nam Á Năng lượng', 'Hợp tác xã Nam Á Năng lượng', '0358801008', 'Mai Văn Thịnh', 'https://nama.com.vn', 'Ngừng hoạt động', '0243460904', 'contact@nama.com.vn', NULL, NULL, 'Nam', 'Tầng 4 Tòa nhà Nam Á Tower, 3 Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(962, 'KH-33DA', 'business', 'Tập đoàn Thành Công', 'Tập đoàn Thành Công', '0850034190', 'Võ Thị Yến', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0930095869', 'contact@thanhcong.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Thành Công Tower, 95 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(963, 'KH-FBAC', 'business', 'Công ty TNHH MTV Hoa Sen Dịch vụ', 'Công ty TNHH MTV Hoa Sen Dịch vụ', '0745489120', 'Trần Bích Hoa', 'https://hoasen.com.vn', 'Đang hoạt động', '0243411614', 'contact@hoasen.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Hoa Sen Tower, 129 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(964, 'KH-23D4', 'business', 'Hợp tác xã Tân Á', 'Hợp tác xã Tân Á', '0383532889', 'Bùi Thu Đào', 'https://tana.com.vn', 'Đang hoạt động', '0283168221', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Tân Á Tower, 14 Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(965, 'KH-AE3B', 'business', 'Doanh nghiệp Tư nhân Nam Á Đầu tư', 'Doanh nghiệp Tư nhân Nam Á Đầu tư', '0643705928', 'Dương Thảo Thu', 'https://nama.com.vn', 'Tạm ngưng', '0243257789', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 16 Tòa nhà Nam Á Tower, 27 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(966, 'KH-FC1C', 'business', 'Doanh nghiệp Tư nhân Khải Hoàn', 'Doanh nghiệp Tư nhân Khải Hoàn', '0844299070', 'Lê Anh Tân', 'https://khaihoan.com.vn', 'Đang hoạt động', '0283153825', 'contact@khaihoan.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Khải Hoàn Tower, 194 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(967, 'KH-8197', 'business', 'Công ty TNHH Hải Đăng', 'Công ty TNHH Hải Đăng', '0306125954', 'Phùng Hoài Thu', 'https://haidang.com.vn', 'Đang hoạt động', '0283504520', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Hải Đăng Tower, 237 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(968, 'KH-DBEC', 'business', 'Hợp tác xã Minh Đăng', 'Hợp tác xã Minh Đăng', '0447511925', 'Phùng Cát Hoa', 'https://minhdang.com.vn', 'Đang hoạt động', '0283193978', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Minh Đăng Tower, 174 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(969, 'KH-F690', 'business', 'Công ty TNHH Thịnh Phát', 'Công ty TNHH Thịnh Phát', '0634358894', 'Huỳnh Nhật Trung', 'https://thinhphat.com.vn', 'Ngừng hoạt động', '0243761239', 'contact@thinhphat.com.vn', NULL, NULL, 'Nam', 'Tầng 10 Tòa nhà Thịnh Phát Tower, 25 Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(970, 'KH-0CE9', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0132381512', 'Đỗ Duy Thái', 'https://hongha.com.vn', 'Đang hoạt động', '0832668939', 'contact@hongha.com.vn', NULL, NULL, 'Nam', 'Tầng 8 Tòa nhà Hồng Hà Tower, 66 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(971, 'KH-0507', 'business', 'Tập đoàn Hoàng Gia Vận tải', 'Tập đoàn Hoàng Gia Vận tải', '0979770532', 'Huỳnh Tuấn Anh', 'https://hoanggia.com.vn', 'Đang hoạt động', '0283652056', 'contact@hoanggia.com.vn', NULL, NULL, 'Nam', 'Tầng 3 Tòa nhà Hoàng Gia Tower, 132 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(972, 'KH-E8FC', 'business', 'Tập đoàn Sông Hồng', 'Tập đoàn Sông Hồng', '0923669096', 'Ngô Mạnh Bảo', 'https://songhong.com.vn', 'Tạm ngưng', '0283218549', 'contact@songhong.com.vn', NULL, NULL, 'Nam', 'Tầng 16 Tòa nhà Sông Hồng Tower, 63 Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(973, 'KH-A0A2', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0662739582', 'Đinh Bảo Tiến', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0243249635', 'contact@vanxuan.com.vn', NULL, NULL, 'Nam', 'Tầng 12 Tòa nhà Vạn Xuân Tower, 144 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(974, 'KH-FFCB', 'business', 'Công ty TNHH Nam Á', 'Công ty TNHH Nam Á', '0510242955', 'Phạm Mai Tuyền', 'https://nama.com.vn', 'Ngừng hoạt động', '0352218828', 'contact@nama.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Nam Á Tower, 102 Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(975, 'KH-C305', 'business', 'Doanh nghiệp Tư nhân Minh Đăng', 'Doanh nghiệp Tư nhân Minh Đăng', '0961701982', 'Đinh Thảo Trinh', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0772362498', 'contact@minhdang.com.vn', NULL, NULL, 'Nữ', 'Tầng 10 Tòa nhà Minh Đăng Tower, 80 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(976, 'KH-CA39', 'business', 'Hợp tác xã Đông Dương Truyền thông', 'Hợp tác xã Đông Dương Truyền thông', '0527162346', 'Phạm Tuấn Hoàng', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0830422666', 'contact@dongduong.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Đông Dương Tower, 58 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(977, 'KH-A9EC', 'business', 'Công ty Cổ phần Sông Hồng Năng lượng', 'Công ty Cổ phần Sông Hồng Năng lượng', '0947232396', 'Nguyễn Lan Anh', 'https://songhong.com.vn', 'NNT đang hoạt động', '0243851545', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Sông Hồng Tower, 52 Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(978, 'KH-8D8E', 'business', 'Doanh nghiệp Tư nhân Việt Á Bất động sản', 'Doanh nghiệp Tư nhân Việt Á Bất động sản', '0245287538', 'Mai Quốc Giang', 'https://vieta.com.vn', 'Tạm ngưng', '0799905779', 'contact@vieta.com.vn', NULL, NULL, 'Nam', 'Tầng 6 Tòa nhà Việt Á Tower, 159 Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(979, 'KH-02EB', 'business', 'Doanh nghiệp Tư nhân Tân Á Du lịch', 'Doanh nghiệp Tư nhân Tân Á Du lịch', '0308186685', 'Dương Mai Đào', 'https://tana.com.vn', 'Ngừng hoạt động', '0855971026', 'contact@tana.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Tân Á Tower, 60 Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(980, 'KH-CBB9', 'business', 'Hợp tác xã Đại Việt Thực phẩm', 'Hợp tác xã Đại Việt Thực phẩm', '0713003116', 'Hồ Thu Vân', 'https://daiviet.com.vn', 'Đang hoạt động', '0243906730', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 4 Tòa nhà Đại Việt Tower, 27 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(981, 'KH-80B7', 'business', 'Công ty TNHH MTV Đại Việt Thực phẩm', 'Công ty TNHH MTV Đại Việt Thực phẩm', '0799487451', 'Lâm Diệu An', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0973912669', 'contact@daiviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 2 Tòa nhà Đại Việt Tower, 143 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(982, 'KH-E685', 'business', 'Công ty TNHH Cửu Long', 'Công ty TNHH Cửu Long', '0422290999', 'Huỳnh Duy Tuấn', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0938893524', 'contact@cuulong.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Cửu Long Tower, 155 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(983, 'KH-6DC0', 'business', 'Công ty TNHH MTV Sao Mai Sản xuất', 'Công ty TNHH MTV Sao Mai Sản xuất', '0819491181', 'Đỗ Tuyết Phương', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283396350', 'contact@saomai.com.vn', NULL, NULL, 'Nữ', 'Tầng 20 Tòa nhà Sao Mai Tower, 189 Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(984, 'KH-8770', 'business', 'Tập đoàn Đất Việt', 'Tập đoàn Đất Việt', '0821686252', 'Mai Hữu Quang', 'https://datviet.com.vn', 'Tạm ngưng', '0359356358', 'contact@datviet.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Đất Việt Tower, 108 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(985, 'KH-6797', 'business', 'Công ty TNHH MTV Đông Dương', 'Công ty TNHH MTV Đông Dương', '0839112287', 'Đinh Tuyết Thảo', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0243128277', 'contact@dongduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 14 Tòa nhà Đông Dương Tower, 105 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(986, 'KH-DAEB', 'business', 'Công ty TNHH MTV Sông Hồng', 'Công ty TNHH MTV Sông Hồng', '0260284581', 'Hoàng Tuyết Phượng', 'https://songhong.com.vn', 'Ngừng hoạt động', '0350025791', 'contact@songhong.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Sông Hồng Tower, 149 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(987, 'KH-2467', 'business', 'Doanh nghiệp Tư nhân Kim Đô Đầu tư', 'Doanh nghiệp Tư nhân Kim Đô Đầu tư', '0163564663', 'Phạm Quốc Thái', 'https://kimdo.com.vn', 'Tạm ngưng', '0283186829', 'contact@kimdo.com.vn', NULL, NULL, 'Nam', 'Tầng 18 Tòa nhà Kim Đô Tower, 107 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(988, 'KH-D507', 'business', 'Tập đoàn Đất Việt', 'Tập đoàn Đất Việt', '0367826509', 'Hồ Khánh Hạnh', 'https://datviet.com.vn', 'Ngừng hoạt động', '0964774467', 'contact@datviet.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Đất Việt Tower, 89 Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(989, 'KH-5BC6', 'business', 'Tập đoàn Thái Bình Dương', 'Tập đoàn Thái Bình Dương', '0118938093', 'Dương Trọng Đức', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0883845723', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 2 Tòa nhà Thái Bình Dương Tower, 29 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(990, 'KH-DEA1', 'business', 'Doanh nghiệp Tư nhân Sao Mai', 'Doanh nghiệp Tư nhân Sao Mai', '0775021043', 'Phạm Trọng Đức', 'https://saomai.com.vn', 'Ngừng hoạt động', '0983216357', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 1 Tòa nhà Sao Mai Tower, 164 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(991, 'KH-82CE', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0910632940', 'Lâm Quốc Dũng', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0763641876', 'contact@thanhcong.com.vn', NULL, NULL, 'Nam', 'Tầng 9 Tòa nhà Thành Công Tower, 202 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(992, 'KH-4356', 'business', 'Doanh nghiệp Tư nhân Tiến Phong Vận tải', 'Doanh nghiệp Tư nhân Tiến Phong Vận tải', '0225153298', 'Võ Hữu Dũng', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0243325654', 'contact@tienphong.com.vn', NULL, NULL, 'Nam', 'Tầng 11 Tòa nhà Tiến Phong Tower, 26 Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(993, 'KH-CCA5', 'business', 'Công ty TNHH MTV Hòa Bình Bất động sản', 'Công ty TNHH MTV Hòa Bình Bất động sản', '0840436512', 'Phùng Diệu Hà', 'https://hoabinh.com.vn', 'Đang hoạt động', '0943431900', 'contact@hoabinh.com.vn', NULL, NULL, 'Nữ', 'Tầng 13 Tòa nhà Hòa Bình Tower, 196 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(994, 'KH-8355', 'business', 'Công ty TNHH Thái Bình Dương', 'Công ty TNHH Thái Bình Dương', '0860620868', 'Đặng Thị An', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0243824248', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 5 Tòa nhà Thái Bình Dương Tower, 78 Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(995, 'KH-5040', 'business', 'Doanh nghiệp Tư nhân Sao Mai', 'Doanh nghiệp Tư nhân Sao Mai', '0955885855', 'Vũ Duy Vinh', 'https://saomai.com.vn', 'Ngừng hoạt động', '0243051564', 'contact@saomai.com.vn', NULL, NULL, 'Nam', 'Tầng 15 Tòa nhà Sao Mai Tower, 92 Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(996, 'KH-E56B', 'business', 'Công ty TNHH Thái Bình Dương Bất động sản', 'Công ty TNHH Thái Bình Dương Bất động sản', '0711594904', 'Phùng Minh Lâm', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0334846049', 'contact@thaibinhduong.com.vn', NULL, NULL, 'Nam', 'Tầng 17 Tòa nhà Thái Bình Dương Tower, 153 Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(997, 'KH-502B', 'business', 'Doanh nghiệp Tư nhân Thịnh Phát Năng lượng', 'Doanh nghiệp Tư nhân Thịnh Phát Năng lượng', '0960615385', 'Đỗ Hồng Mai', 'https://thinhphat.com.vn', 'Ngừng hoạt động', '0283317032', 'contact@thinhphat.com.vn', NULL, NULL, 'Nữ', 'Tầng 3 Tòa nhà Thịnh Phát Tower, 79 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(998, 'KH-0DBF', 'business', 'Công ty TNHH Hải Đăng', 'Công ty TNHH Hải Đăng', '0246370398', 'Ngô Ngọc Vân', 'https://haidang.com.vn', 'Đang hoạt động', '0932500650', 'contact@haidang.com.vn', NULL, NULL, 'Nữ', 'Tầng 7 Tòa nhà Hải Đăng Tower, 178 Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(999, 'KH-E4C0', 'business', 'Công ty TNHH MTV Đông Dương', 'Công ty TNHH MTV Đông Dương', '0960423873', 'Trần Hồng Trang', 'https://dongduong.com.vn', 'Đang hoạt động', '0938743342', 'contact@dongduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Đông Dương Tower, 191 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(1000, 'KH-62A8', 'business', 'Công ty TNHH Đông Dương Dịch vụ', 'Công ty TNHH Đông Dương Dịch vụ', '0747612617', 'Lý Thảo Thảo', 'https://dongduong.com.vn', 'Tạm ngưng', '0243267953', 'contact@dongduong.com.vn', NULL, NULL, 'Nữ', 'Tầng 17 Tòa nhà Đông Dương Tower, 226 Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:56:35', '2026-06-04 17:56:35'),
(1001, 'KH-FBDF', 'individual', 'Đạt MG', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901980543', 'tiendatmagic8@gmail.com', '0x75AD18eF47eDa21BafF837CAc0F1563D0C355555', NULL, 'Nam', NULL, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 17:59:58', '2026-06-04 18:34:17'),
(1002, 'KH-34A6', 'individual', 'Đạt 009', NULL, NULL, NULL, NULL, 'Đang hoạt động', NULL, NULL, '0xc0f810364e0eacEbbD9e02187fd6504dF4599999', NULL, 'Nam', NULL, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:00:14', '2026-06-04 18:00:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer_customer_group`
--

CREATE TABLE `customer_customer_group` (
  `customer_id` bigint UNSIGNED NOT NULL,
  `customer_group_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer_groups`
--

CREATE TABLE `customer_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dining_tables`
--

CREATE TABLE `dining_tables` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area_id` bigint UNSIGNED DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'empty',
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory_records`
--

CREATE TABLE `inventory_records` (
  `id` bigint UNSIGNED NOT NULL,
  `record_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `record_date` datetime NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory_record_items`
--

CREATE TABLE `inventory_record_items` (
  `id` bigint UNSIGNED NOT NULL,
  `inventory_record_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `product_variant_id` bigint UNSIGNED DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_24_000001_create_products_table', 1),
(5, '2026_05_24_000002_create_orders_table', 1),
(6, '2026_05_24_000003_create_order_items_table', 1),
(7, '2026_05_24_000004_create_settings_table', 1),
(8, '2026_05_24_004321_create_categories_table', 1),
(9, '2026_05_24_004325_create_category_product_table', 1),
(10, '2026_05_25_000001_restrict_order_items_product_delete', 1),
(11, '2026_05_25_162347_create_personal_access_tokens_table', 1),
(12, '2026_05_26_000000_add_chain_id_to_orders_table', 1),
(13, '2026_05_26_001000_add_store_owner_address_to_tables', 1),
(14, '2026_05_26_002000_remove_chain_id_from_products_table', 1),
(15, '2026_05_26_003000_remove_chain_id_from_settings_table', 1),
(16, '2026_05_26_004000_create_product_variants_table', 1),
(17, '2026_05_26_005000_add_product_variant_id_to_order_items_table', 1),
(18, '2026_05_27_000000_create_customers_table', 1),
(19, '2026_05_27_001000_create_customer_groups_table', 1),
(20, '2026_05_27_002000_create_transactions_table', 1),
(21, '2026_05_27_003000_create_inventory_records_table', 1),
(22, '2026_05_27_004000_create_tables_and_areas', 1),
(23, '2026_05_27_006000_add_verification_hash_to_orders_table', 1),
(24, '2026_05_28_000000_add_blockchain_fields_to_transactions_table', 1),
(25, '2026_05_28_013935_add_public_codes_to_tables', 1),
(26, '2026_05_28_120000_add_business_fields_to_customers_table', 1),
(27, '2026_05_28_130000_add_status_to_customers_table', 1),
(28, '2026_05_30_070000_add_customer_id_and_note_to_tables', 1),
(29, '2026_06_03_164803_add_vouchers_and_customers_wallet', 1),
(30, '2026_06_05_004036_create_voucher_signatures_table', 1),
(31, '2026_06_05_000000_convert_tables_to_uuid7', 2),
(32, '2026_06_05_172136_add_columns_to_voucher_signatures_table', 3),
(33, '2026_06_05_175513_add_gift_voucher_nft_token_id_to_orders_table', 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `discount_amount` int NOT NULL DEFAULT '0',
  `voucher_nft_token_id` bigint UNSIGNED DEFAULT NULL,
  `gift_voucher_nft_token_id` bigint UNSIGNED DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tx_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chain_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blockchain_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `customer_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `table_number`, `total_amount`, `discount_amount`, `voucher_nft_token_id`, `gift_voucher_nft_token_id`, `payment_method`, `status`, `tx_hash`, `chain_id`, `blockchain_status`, `store_owner_address`, `verification_hash`, `created_at`, `updated_at`, `customer_id`) VALUES
('019e98b4-c271-7092-930c-8804a8a34a44', 'HD-B5DF64', NULL, 207000.00, 0, NULL, 4, 'cash', 'completed', '0x227676287d2af7bca478be8431061ee56e525c885458b4bd2495768caec65e75', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '4f2a8055fa2d980e82f924899c9b512e53bc87f689bba825ecce7a398cecfd2a', '2026-06-04 18:34:27', '2026-06-05 10:56:08', 1001),
('019e98b4-c2dc-7367-96c7-92ee0d935d06', 'HD-CA3A23', NULL, 196000.00, 0, NULL, 3, 'cash', 'completed', '0x6f0bd3b0a571b3178d55ae54f37a0f577d344cce72e018fc4be737f6c2579531', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '54582df637e14e24333cdf0ffeeadf2facb362ef26e57b2901c9a3bd0e7a7369', '2026-06-04 23:31:17', '2026-06-05 10:56:08', 1001),
('019e98b4-c2e4-7239-8178-93cb6ade72d3', 'HD-117517', NULL, 147000.00, 0, NULL, 2, 'cash', 'completed', '0xc9cdab4793027feb349f12afef7b1838bd5857bf4d606ea5957c30ef7e87ed16', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'eeadab4699c4142fd2a983933b9246e2f42224271b84399d34997dfb53a309c1', '2026-06-05 00:00:02', '2026-06-05 10:56:08', 1001),
('019e98b4-c2eb-7219-8dd3-7aaafe7f4b30', 'HD-7FEB66', NULL, 285000.00, 0, NULL, 2, 'cash', 'completed', '0x108d67cedeadb549bbf7e626b552f37a4070237df9d7c6633ee251562b3b1793', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '911a75a7352e30f675029d5f2e2c91098a557f83e269643ae703834a3a183637', '2026-06-05 09:41:18', '2026-06-05 10:56:08', 1001),
('019e98b9-a243-735b-96a3-913c3f9e6f4a', 'HD-445412', NULL, 196000.00, 0, NULL, 1, 'cash', 'completed', '0xf4e0f875e6e591c1e4bba3eb91a40774ab5a00ff03c1199811d24f00b2a85a02', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '03c73851519b92328a6e16c0259fe109591c1517148cfaf00828a5fc0ab91661', '2026-06-05 09:59:23', '2026-06-05 10:56:08', 1001),
('019e98c8-5aa5-7197-9774-89d58477183e', 'HD-3D9044', NULL, 343000.00, 0, NULL, 1, 'cash', 'completed', '0x4632e200d8e276cb4bdb0dd09fdd2d5b2419c7cc2f95d11cdf14a2900da16068', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '45d89b70bd606981e1a85a7e0a46711f003623d1049cb07c0e65d6ca1431ed04', '2026-06-05 10:15:27', '2026-06-05 10:56:08', 1001),
('019e98d4-f394-73a7-9503-24ca93c702df', 'HD-76QN844', NULL, 388000.00, 5000, 1, 2, 'cash', 'completed', '0xaa017fe818bb611e9daa0c64a7720cdfc9216d7073a56bfb0903594a98b65029', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2f739dacdce07898bff9c756b799566b38a89cdd78e3a1c125995ec828a1e680', '2026-06-05 10:29:13', '2026-06-05 13:57:14', 1001),
('019e98e5-165e-7146-ac3b-cfb8560d337e', 'HD-7TSA564', NULL, 220000.00, 5000, 2, 3, 'bank_transfer', 'completed', '0x26dab55bf7aa77b4684b394358afaf54f6439678f191fba7e116c838e3d9fe4f', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'fa7ee887a24ac75e2e80394d709f7fa5ab82dbe5b5d5f6d14ec51c09bbc617bc', '2026-06-05 10:46:50', '2026-06-05 13:57:14', 1001),
('019e98f0-eff9-7394-a34a-b42cf7fea6fb', 'HD-8AS4S78', NULL, 240000.00, 5000, 3, 4, 'cash', 'completed', '0x2f1e866585ce2e2aa461c9869919e9d5c253b9961c88b62ad54f068afd36fcfd', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '565c59cfc98eeab861e754fd00ab1734c29e0707e8c023fc4562e2c2d2e34603', '2026-06-05 10:59:47', '2026-06-05 11:00:38', 1001),
('019e98fd-6561-70dd-8a69-cfa5f9d7ba72', 'HD-416609', NULL, 362000.00, 0, NULL, NULL, 'bank_transfer', 'completed', '0xe1510a3653011781e1dea81b7869c7a017727ce441b7bf4d77a17bd192fb140b', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'd5fd73acf47e75939160b99502751c7da824418a10eb6c9d683ed4703c038d56', '2026-06-05 11:13:23', '2026-06-05 11:14:37', NULL),
('019e98ff-457a-73ad-8396-e0124072bffd', 'HD-EB830C', NULL, 196000.00, 0, NULL, NULL, 'cash', 'completed', '0x2be5ace992fa0c3aa6e90bf1a82c503657a4c3860b78ae11765517d2b6873b26', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '33bc089a3eeb9f3465f1d9d846a43a33cfe6279d7ec5d50e2ec00099c94f7a46', '2026-06-05 11:15:26', '2026-06-05 11:16:10', NULL),
('019e999c-c979-73b4-b574-16d818af0275', 'HD-1956B3', NULL, 245000.00, 0, NULL, 5, 'bank_transfer', 'completed', '0x2e9579390cf4a0e120d476fd0123d23d1881eabe5e1e3335c02cec3c61908b29', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'b07d1100afdd9036c33929edbac927f919569e88c6bfa21353aff378fa7eda3e', '2026-06-05 14:07:29', '2026-06-05 14:09:37', 1001),
('019e99b0-a2b4-704a-adce-bde20d4d2901', 'HD-FOY5237', NULL, 632000.00, 5000, 5, 6, 'bank_transfer', 'completed', '0xa5e2d5a819cee83dcd85e8779153700ec1d76ee624555f9adfedfcddf244ef7d', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '573b59a393b2d434eaa01ece31cf56a63e21398b154ab569a2af98acd397aea1', '2026-06-05 14:29:10', '2026-06-05 19:54:05', 1001);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `product_variant_id` bigint UNSIGNED DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_variant_id`, `quantity`, `price`, `created_at`, `updated_at`, `note`) VALUES
(1, '019e98b4-c271-7092-930c-8804a8a34a44', 526, NULL, 3, 69000.00, '2026-06-04 18:34:27', '2026-06-04 18:34:27', NULL),
(2, '019e98b4-c2dc-7367-96c7-92ee0d935d06', 532, NULL, 4, 49000.00, '2026-06-04 23:31:17', '2026-06-04 23:31:17', NULL),
(3, '019e98b4-c2e4-7239-8178-93cb6ade72d3', 532, NULL, 3, 49000.00, '2026-06-05 00:00:02', '2026-06-05 00:00:02', NULL),
(4, '019e98b4-c2eb-7219-8dd3-7aaafe7f4b30', 526, NULL, 3, 69000.00, '2026-06-05 09:41:18', '2026-06-05 09:41:18', NULL),
(5, '019e98b4-c2eb-7219-8dd3-7aaafe7f4b30', 525, NULL, 2, 39000.00, '2026-06-05 09:41:18', '2026-06-05 09:41:18', NULL),
(6, '019e98b9-a243-735b-96a3-913c3f9e6f4a', 531, NULL, 4, 49000.00, '2026-06-05 09:59:23', '2026-06-05 09:59:23', NULL),
(7, '019e98c8-5aa5-7197-9774-89d58477183e', 532, NULL, 7, 49000.00, '2026-06-05 10:15:27', '2026-06-05 10:15:27', NULL),
(8, '019e98d4-f394-73a7-9503-24ca93c702df', 526, NULL, 4, 69000.00, '2026-06-05 10:29:13', '2026-06-05 10:29:13', NULL),
(9, '019e98d4-f394-73a7-9503-24ca93c702df', 525, NULL, 3, 39000.00, '2026-06-05 10:29:13', '2026-06-05 10:29:13', NULL),
(10, '019e98e5-165e-7146-ac3b-cfb8560d337e', 528, NULL, 5, 45000.00, '2026-06-05 10:46:50', '2026-06-05 10:46:50', NULL),
(11, '019e98f0-eff9-7394-a34a-b42cf7fea6fb', 529, NULL, 5, 49000.00, '2026-06-05 10:59:47', '2026-06-05 10:59:47', NULL),
(12, '019e98fd-6561-70dd-8a69-cfa5f9d7ba72', 529, NULL, 2, 49000.00, '2026-06-05 11:13:23', '2026-06-05 11:13:23', NULL),
(13, '019e98fd-6561-70dd-8a69-cfa5f9d7ba72', 531, NULL, 3, 49000.00, '2026-06-05 11:13:23', '2026-06-05 11:13:23', NULL),
(14, '019e98fd-6561-70dd-8a69-cfa5f9d7ba72', 525, NULL, 3, 39000.00, '2026-06-05 11:13:23', '2026-06-05 11:13:23', NULL),
(15, '019e98ff-457a-73ad-8396-e0124072bffd', 532, NULL, 4, 49000.00, '2026-06-05 11:15:26', '2026-06-05 11:15:26', NULL),
(16, '019e999c-c979-73b4-b574-16d818af0275', 531, NULL, 5, 49000.00, '2026-06-05 14:07:29', '2026-06-05 14:07:29', 'thêm đường'),
(17, '019e99b0-a2b4-704a-adce-bde20d4d2901', 532, NULL, 10, 49000.00, '2026-06-05 14:29:10', '2026-06-05 14:29:10', NULL),
(18, '019e99b0-a2b4-704a-adce-bde20d4d2901', 531, NULL, 3, 49000.00, '2026-06-05 14:29:10', '2026-06-05 14:29:10', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'pos-access-token', 'a462851e2807ff8660c8d68a190b95b66d3dcdec63900b1b3f794b2aa4eca46a', '[\"*\"]', '2026-06-05 01:23:01', NULL, '2026-06-04 17:57:14', '2026-06-05 01:23:01'),
(2, 'App\\Models\\User', 1, 'pos-access-token', 'c0468ad51d288df60659369a75caf84af0a09fd4711fb3d157aaa186bcfc09b8', '[\"*\"]', '2026-06-05 09:09:39', NULL, '2026-06-05 08:51:29', '2026-06-05 09:09:39'),
(3, 'App\\Models\\User', 1, 'pos-access-token', '18ecbb7a3646dd6b2b561fd4ea09d3e20ccc2415e67ec3d46ec58f7b7bcd6147', '[\"*\"]', '2026-06-05 09:14:21', NULL, '2026-06-05 09:14:16', '2026-06-05 09:14:21'),
(4, 'App\\Models\\User', 1, 'pos-access-token', '8120984a4e8b98188646c33759d1b6bb3cede87a5f3a6febfc75d67ca53c42d4', '[\"*\"]', '2026-06-05 09:30:05', NULL, '2026-06-05 09:30:01', '2026-06-05 09:30:05'),
(5, 'App\\Models\\User', 1, 'pos-access-token', 'e85d0febcb865ccde808400105efe82fb5ca0f0dc257bfe604af8c479319efdf', '[\"*\"]', '2026-06-05 19:54:03', NULL, '2026-06-05 09:30:07', '2026-06-05 19:54:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `price`, `image`, `status`, `store_owner_address`, `short_description`, `description`, `created_at`, `updated_at`) VALUES
(1, 'SP-000001', 'Cà Phê Sữa Đá', 29000.00, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đậm đà kết hợp sữa đặc hảo hạng và đá mát lạnh.', 'Món uống quốc dân mang đậm hương vị truyền thống Việt Nam. Sử dụng hạt cà phê Robusta tuyển chọn từ Buôn Ma Thuột, được rang xay nguyên chất, mang lại hương vị đắng thanh nồng nàn quyện cùng vị béo ngậy ngọt ngào của sữa đặc.', '2026-05-25 03:15:19', '2026-05-27 11:42:29'),
(4, 'SP-000004', 'Cappuccino Nghệ Thuật', 45000.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê espresso sánh mịn kết hợp lớp bọt sữa mịn màng vẽ nghệ thuật.', 'Sự kết hợp hoàn hảo giữa hương vị espresso hảo hạng và lớp sữa tươi được đánh bọt mịn màng như nhung. Phía trên được tạo hình nghệ thuật Latte Art tinh xảo.', '2026-05-25 03:15:20', '2026-05-27 11:42:29'),
(22, 'SP-000022', 'Salad Ức Gà Mè Rang', 59000.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Ức gà áp chảo mềm mọng cùng xà lách tươi sạch và sốt mè rang.', 'Lựa chọn Eat-clean lành mạnh. Ức gà tẩm ướp thảo mộc áp chảo vàng ươm mềm ẩm, kết hợp cùng xà lách thủy canh tươi giòn.', '2026-05-25 03:15:20', '2026-05-27 11:42:30'),
(24, 'SP-000024', 'Bánh Mì Baguette', 32000.00, 'https://www.lottemart.vn/media/catalog/product/cache/0x0/0/4/0400285600009-1.jpg.webp', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh mì baguette nướng bơ tỏi thơm giòn nóng hổi khó cưỡng.', 'Những lát bánh mì Baguette Pháp giòn rụm được phết đều hỗn hợp bơ nhạt cao cấp, tỏi lý sơn băm nhuyễn và lá ngò tây thơm phức.', '2026-05-25 03:15:20', '2026-05-27 11:42:30'),
(434, 'SP-C03ODJ', 'Cà Phê Cold Brew Nitro Premium', 45000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(435, 'SP-H0KFOA', 'Cà Phê Latte Hạt Dẻ Premium', 49000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(436, 'SP-MR0DLH', 'Caramel Macchiato Nóng Premium', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(437, 'SP-U2HVLQ', 'Cà Phê Cốt Dừa Đá Xay Premium', 42000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(438, 'SP-Q4LEUG', 'Flat White Thượng Hạng Premium', 45000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(439, 'SP-1DGO8K', 'Cà Phê Mocha Đá Premium', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(440, 'SP-Q6ZUUB', 'Trà Nhài Thạch Đác Dẻo Premium', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(441, 'SP-LLRFAV', 'Trà Ô Long Dưa Lưới Premium', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(442, 'SP-LZQBWD', 'Trà Sữa Ô Long Trân Châu Premium', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(443, 'SP-Z0ZZ2I', 'Trà Sữa Matcha Đậu Đỏ Premium', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(444, 'SP-5I41GI', 'Soda Việt Quất Xanh Premium', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(445, 'SP-7RGWXH', 'Soda Blue Ocean Premium', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(446, 'SP-IM6ARA', 'Chocolate Cookie Đá Xay Premium', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(447, 'SP-RTRLXG', 'Sinh Tố Việt Quất Dâu Tây Premium', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(448, 'SP-TQLVFK', 'Kem Gelato Vani Bourbon Premium', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(449, 'SP-UDXRIO', 'Kem Gelato Matcha Uji Premium', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(450, 'SP-ICGTYF', 'Kem Gelato Chocolate Bỉ Premium', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(451, 'SP-5SHVRR', 'Bánh Red Velvet Kiêu Kỳ Premium', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(452, 'SP-LC14OS', 'Bánh Cheesecake Chanh Dây Premium', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(453, 'SP-3NZANN', 'Bánh Croissant Trứng Muối Premium', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(454, 'SP-NN64EU', 'Mỳ Ý Sốt Kem Nấm Premium', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(455, 'SP-GTDHFR', 'Hamburger Bò Phô Mai Double Premium', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(456, 'SP-GBLIRE', 'Sandwich Club Tam Giác Premium', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(457, 'SP-OA6SUJ', 'Gà Rán Giòn Cay Giòn Rụm Premium', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(458, 'SP-TYVLLU', 'Cà Phê Cold Brew Nitro Signature', 45000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(459, 'SP-SYBUEZ', 'Cà Phê Latte Hạt Dẻ Signature', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(460, 'SP-63T6M0', 'Caramel Macchiato Nóng Signature', 49000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(461, 'SP-BFGWVX', 'Cà Phê Cốt Dừa Đá Xay Signature', 42000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(462, 'SP-5GX630', 'Flat White Thượng Hạng Signature', 45000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(463, 'SP-UYNXSA', 'Cà Phê Mocha Đá Signature', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(464, 'SP-YGXX0U', 'Trà Nhài Thạch Đác Dẻo Signature', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(465, 'SP-MGWWZX', 'Trà Ô Long Dưa Lưới Signature', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(466, 'SP-TCSCQP', 'Trà Sữa Ô Long Trân Châu Signature', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(467, 'SP-UNQW1O', 'Trà Sữa Matcha Đậu Đỏ Signature', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(468, 'SP-AABZOE', 'Soda Việt Quất Xanh Signature', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(469, 'SP-WOLXFV', 'Soda Blue Ocean Signature', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(470, 'SP-PJB1WU', 'Chocolate Cookie Đá Xay Signature', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(471, 'SP-KYKRHG', 'Sinh Tố Việt Quất Dâu Tây Signature', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(472, 'SP-2QZ3R9', 'Kem Gelato Vani Bourbon Signature', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(473, 'SP-JVPZXQ', 'Kem Gelato Matcha Uji Signature', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(474, 'SP-KIX39L', 'Kem Gelato Chocolate Bỉ Signature', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(475, 'SP-IUHOXX', 'Bánh Red Velvet Kiêu Kỳ Signature', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(476, 'SP-WGXWGK', 'Bánh Cheesecake Chanh Dây Signature', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(477, 'SP-NEWM2M', 'Bánh Croissant Trứng Muối Signature', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(478, 'SP-6DPLLX', 'Mỳ Ý Sốt Kem Nấm Signature', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(479, 'SP-ULJLPI', 'Hamburger Bò Phô Mai Double Signature', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(480, 'SP-U6UMSB', 'Sandwich Club Tam Giác Signature', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(481, 'SP-LAM80R', 'Gà Rán Giòn Cay Giòn Rụm Signature', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(482, 'SP-ZWBFDM', 'Cà Phê Cold Brew Nitro Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(483, 'SP-D7UA2X', 'Cà Phê Latte Hạt Dẻ Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(484, 'SP-GXLVK5', 'Caramel Macchiato Nóng Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(485, 'SP-W0CSJD', 'Cà Phê Cốt Dừa Đá Xay Đặc Biệt', 42000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(486, 'SP-IAVTGJ', 'Flat White Thượng Hạng Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(487, 'SP-VKDVLA', 'Cà Phê Mocha Đá Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(488, 'SP-ZRMCZB', 'Trà Nhài Thạch Đác Dẻo Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(489, 'SP-BUCMRX', 'Trà Ô Long Dưa Lưới Đặc Biệt', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(490, 'SP-KYFT0A', 'Trà Sữa Ô Long Trân Châu Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(491, 'SP-EXKIPO', 'Trà Sữa Matcha Đậu Đỏ Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(492, 'SP-UWMNUE', 'Soda Việt Quất Xanh Đặc Biệt', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(493, 'SP-OORLSX', 'Soda Blue Ocean Đặc Biệt', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(494, 'SP-UZWPXS', 'Chocolate Cookie Đá Xay Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(495, 'SP-LWLVWM', 'Sinh Tố Việt Quất Dâu Tây Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(496, 'SP-MOAM6S', 'Kem Gelato Vani Bourbon Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(497, 'SP-6D40CG', 'Kem Gelato Matcha Uji Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(498, 'SP-KDSECS', 'Kem Gelato Chocolate Bỉ Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(499, 'SP-CJRZRC', 'Bánh Red Velvet Kiêu Kỳ Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(500, 'SP-XNZ9HF', 'Bánh Cheesecake Chanh Dây Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(501, 'SP-NODFRF', 'Bánh Croissant Trứng Muối Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(502, 'SP-SVPJOY', 'Mỳ Ý Sốt Kem Nấm Đặc Biệt', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(503, 'SP-CUVFLG', 'Hamburger Bò Phô Mai Double Đặc Biệt', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(504, 'SP-NJOBRK', 'Sandwich Club Tam Giác Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(505, 'SP-OH4HWT', 'Gà Rán Giòn Cay Giòn Rụm Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(506, 'SP-NSZB8R', 'Cà Phê Cold Brew Nitro Classic', 45000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(507, 'SP-KL2MBG', 'Cà Phê Latte Hạt Dẻ Classic', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(508, 'SP-ZMQSGO', 'Caramel Macchiato Nóng Classic', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(509, 'SP-MM41VG', 'Cà Phê Cốt Dừa Đá Xay Classic', 42000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(510, 'SP-NWZGHL', 'Flat White Thượng Hạng Classic', 45000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(511, 'SP-FL3QID', 'Cà Phê Mocha Đá Classic', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18');
INSERT INTO `products` (`id`, `sku`, `name`, `price`, `image`, `status`, `store_owner_address`, `short_description`, `description`, `created_at`, `updated_at`) VALUES
(512, 'SP-MODRE5', 'Trà Nhài Thạch Đác Dẻo Classic', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(513, 'SP-TLRIGB', 'Trà Ô Long Dưa Lưới Classic', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(514, 'SP-LW26VJ', 'Trà Sữa Ô Long Trân Châu Classic', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(515, 'SP-51KXLA', 'Trà Sữa Matcha Đậu Đỏ Classic', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(516, 'SP-OC5WXA', 'Soda Việt Quất Xanh Classic', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(517, 'SP-MDN66C', 'Soda Blue Ocean Classic', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(518, 'SP-TYNPJ4', 'Chocolate Cookie Đá Xay Classic', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(519, 'SP-1XRS8E', 'Sinh Tố Việt Quất Dâu Tây Classic', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(520, 'SP-WSG8SW', 'Kem Gelato Vani Bourbon Classic', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(521, 'SP-LDKOLI', 'Kem Gelato Matcha Uji Classic', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(522, 'SP-ROYQKJ', 'Kem Gelato Chocolate Bỉ Classic', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(523, 'SP-YNPY3K', 'Bánh Red Velvet Kiêu Kỳ Classic', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(524, 'SP-RP4Z2T', 'Bánh Cheesecake Chanh Dây Classic', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(525, 'SP-ZL3LVB', 'Bánh Croissant Trứng Muối Classic', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(526, 'SP-OA6TS1', 'Mỳ Ý Sốt Kem Nấm Classic', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(527, 'SP-BLLK4I', 'Hamburger Bò Phô Mai Double Classic', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(528, 'SP-QELHPX', 'Sandwich Club Tam Giác Classic', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(529, 'SP-ILAKTM', 'Gà Rán Giòn Cay Giòn Rụm Classic', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(530, 'SP-RQQOAZ', 'Cà Phê Cold Brew Nitro Royal', 45000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(531, 'SP-ZZYUNM', 'Cà Phê Latte Hạt Dẻ Royal', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(532, 'SP-JSBQUW', 'Caramel Macchiato Nóng Royal', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(533, 'SP-XE275I', 'Cà Phê Cốt Dừa Đá Xay Royal', 42000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 10:37:18', '2026-05-29 10:37:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `variant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_name`, `price`, `status`, `created_at`, `updated_at`) VALUES
(47, 434, 'Size M', 45000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(48, 434, 'Size L', 51000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(49, 437, 'Size M', 42000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(50, 437, 'Size L', 51000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(51, 440, 'Size M', 39000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(52, 440, 'Size L', 45000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(53, 443, 'Size M', 49000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(54, 443, 'Size L', 58000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(55, 446, 'Size M', 49000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(56, 446, 'Size L', 55000.00, 1, '2026-05-29 10:37:17', '2026-05-29 10:37:17'),
(57, 458, 'Size M', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(58, 458, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(59, 461, 'Size M', 42000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(60, 461, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(61, 464, 'Size M', 39000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(62, 464, 'Size L', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(63, 467, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(64, 467, 'Size L', 58000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(65, 470, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(66, 470, 'Size L', 55000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(67, 482, 'Size M', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(68, 482, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(69, 485, 'Size M', 42000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(70, 485, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(71, 488, 'Size M', 39000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(72, 488, 'Size L', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(73, 491, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(74, 491, 'Size L', 58000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(75, 494, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(76, 494, 'Size L', 55000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(77, 506, 'Size M', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(78, 506, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(79, 509, 'Size M', 42000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(80, 509, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(81, 512, 'Size M', 39000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(82, 512, 'Size L', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(83, 515, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(84, 515, 'Size L', 58000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(85, 518, 'Size M', 49000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(86, 518, 'Size L', 55000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(87, 530, 'Size M', 45000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(88, 530, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-05-29 10:37:18'),
(89, 533, 'Size M', 42000.00, 1, '2026-05-29 10:37:18', '2026-06-04 18:33:38'),
(90, 533, 'Size L', 51000.00, 1, '2026-05-29 10:37:18', '2026-06-04 18:33:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'store_name', 'Cafe Web3 POS', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(2, 'primary_color', '#ff0088', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:30:41'),
(3, 'secondary_color', '#c084fc', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(4, 'contract_address', '0xC6b3fc5a2E5Aba0e5a0B6eD8FaCD412A76dC5D2A', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:32:07'),
(5, 'finance_contract_address', '0x7988500670EC631F7be36eD91E367760f380d6Af', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:32:07'),
(6, 'voucher_contract_address', '0xB35E2987932C7D6499f93d8CE5ac90CF43DD8c38', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-05 10:14:27'),
(7, 'relayer_private_key', 'eyJpdiI6IkloMlQrNTZyK3BFaVBEbGpJWUxJOVE9PSIsInZhbHVlIjoibGNPUjE1dEZrRkthellrdnAxbUoyL3QrYmNnWXVLMElnVllmQVppb2ZYem4vNXFRUHVSbmRpZzE3RWFSYmk5MnorcHYwVUtXTEQyNHFPdU1BeXdlbytTaGU0R2xPV3k0NHErTVk2TjRmNzA9IiwibWFjIjoiYTFmYjJmZWVlN2M4NDU5NzY4MjJkN2RiMDJkMTZiYzU4ZmJmYTc1MmFiMzNmMmJhNDIxYjczOGIxNTY5Mjk3YSIsInRhZyI6IiJ9', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:32:42'),
(8, 'rpc_url', 'https://bsc-testnet.rpc.sentio.xyz', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 23:59:22'),
(9, 'chain_id', '97', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:31:27'),
(10, 'explorer_url', 'https://testnet.bscscan.com', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:31:27'),
(11, 'explorer_api_key', '94CWX8UC3A5UI54EA2B9MAHW2VXRGB3G82', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:31:42'),
(12, 'default_print_size', '80mm', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(13, 'voucher_gift_min_amount', '100000', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(14, 'voucher_discount_amount', '5000', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(15, 'voucher_use_min_amount', '100000', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-04 18:18:36', '2026-06-04 18:18:36'),
(16, 'menu_registry_contract_address', '0x1f66772E86CC58fe55fc1DcDd84b58a1AA8FF523', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-06-05 15:01:17', '2026-06-05 19:26:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `transaction_date` date NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tx_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blockchain_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `chain_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_code`, `type`, `amount`, `category`, `description`, `transaction_date`, `store_owner_address`, `tx_hash`, `blockchain_status`, `chain_id`, `verification_hash`, `created_at`, `updated_at`) VALUES
('019e98bc-23a9-70da-8542-a324a38acd8d', 'TC-CAF7E2', 'chi', 100000.00, 'Chi phí khác', 'đi chợ', '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xb1a605d718a4904978811dc9e8d5a1081cf6313ba81b226565d26efdf20d3a76', 'success', '97', '57076ce654a88f0238c5ebf30d5c377f92a4335911f0a7d41453e7a9e6d1de4b', '2026-06-05 10:02:07', '2026-06-05 10:02:12'),
('019e9901-04cc-7340-be13-63e58b3d9125', 'TC-DB3C73', 'thu', 10000.00, 'Bán hàng POS', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xeb810986762410bd67df6bed073438f503b9b4234329a49804d919f341d2ddb2', 'success', '97', '64450e0a177dfe2d30ba9e67d60cbc7d166e15d181435ba1166e941720af9253', '2026-06-05 11:17:21', '2026-06-05 11:19:16'),
('019e9901-2893-71c8-8090-3096de9db215', 'TC-39BE7C', 'chi', 10000.00, 'Nhập nguyên liệu', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x80a30ad8f79b7b15ecf5fc602de6749cdee3f838f2c0f329184a49be49dc8706', 'success', '97', 'fb67c01791495dd4f1574a2899f7e4341efe8356c13cbf8aec055a8f3473e765', '2026-06-05 11:17:30', '2026-06-05 11:19:14'),
('019e9901-4a61-71b8-8659-c9628a2f3060', 'TC-CE7D69', 'chi', 10000.00, 'Nhập nguyên liệu', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x427da5d29bdc66714915fd9e1c97207399b97363b1b69b75162e0c9d4cbc85f7', 'success', '97', '9210677a2534e043b9bb82028b780d4d4086fb3b0d2ea136b3190138d87bce68', '2026-06-05 11:17:39', '2026-06-05 11:19:12'),
('019e9901-6402-734d-bab5-e514215fcf1d', 'TC-9B990F', 'thu', 10000.00, 'Tiền mặt bằng', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x79204de67a336721be3e41b5ca1d2d4bf0893606949d98c2fd5882d79aae6aef', 'success', '97', '83ace7ba08314abe8d42ff2ad55d20c1ef8163fdf8f2478bc0fefaf61f3be15c', '2026-06-05 11:17:45', '2026-06-05 11:19:09'),
('019e9901-85ae-7153-9009-fe701f60ecb9', 'TC-9E23EA', 'thu', 10000.00, 'Tiền điện nước', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xc2588527e4a2f313235b99882b7e12e087c89c46a2584d4b9e063718cbe62451', 'success', '97', '6d02e29313535f9b6d2a73c74465123429560342b6e25c21406dfee4e0497bfa', '2026-06-05 11:17:54', '2026-06-05 11:19:07'),
('019e9901-a2be-70ef-9cc6-f4177eada088', 'TC-AA0BE6', 'thu', 10000.00, 'Tiền điện nước', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x5127628d7be0c4be4ecd1bab6314896c9b8d53690d7a48f08b9f382892a620bf', 'success', '97', '913ef953b14e6db1f186f5a56666612b949747f0a025f9ec0674539d0b54290b', '2026-06-05 11:18:01', '2026-06-05 11:19:05'),
('019e9901-c517-72c9-97e4-a950e20285f8', 'TC-0658C3', 'thu', 10000.00, 'Tiền điện nước', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xd9da9f15573e976d7d0d56c444a36ff65c2d26b8ee3db7386206c7ddee3e3af5', 'success', '97', 'bb38eedeb60df44a211fd52fc1201728f9b8066aa04dbb51f8b7ea0ba16618fe', '2026-06-05 11:18:10', '2026-06-05 11:19:25'),
('019e9901-e7ca-7260-8b2a-a19a509c9bd1', 'TC-9AD400', 'chi', 10000.00, 'Tiền mặt bằng', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xb560bb0e5d55229b6035bf3596f7d2d18cb4e9a4a1a1fab1333015e878e062c7', 'success', '97', '9fd9686090d9324cffc6c12952de6efd251f8db77ffb8c165958b1cc198a4c35', '2026-06-05 11:18:19', '2026-06-05 11:19:00'),
('019e9902-1f44-711d-8b35-c0d49c900d84', 'TC-9E3B28', 'thu', 10000.00, 'Tiền mặt bằng', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x307e5c045ea87831121f21d916974397d1ac240215e69a22fb329460c32256cb', 'success', '97', 'fbfb8dc6a0cbd44ea9d9b36c59fd3a79c0d854e5c6e9f835fb9ecb469e651b67', '2026-06-05 11:18:33', '2026-06-05 11:18:58'),
('019e9902-3abe-72bf-a7e1-9cea9cbbb529', 'TC-CFEDDC', 'thu', 10000.00, 'Nhập nguyên liệu', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0xfeb4424982a00500777b7a80e425fc067e50442fc38d0b2924af5c455b73858a', 'success', '97', '85bb788913ecff09e865fd23d83bbc76a5465a5adcb3fba9bc00204de46bd5e6', '2026-06-05 11:18:40', '2026-06-05 11:18:55'),
('019e99c2-be07-72a7-857d-2d36f8461617', 'TC-638ABE', 'chi', 200000.00, 'Lương nhân viên', NULL, '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x8238f4583aff502a8cb792bb30d6bc1be003b8579f862a0ed6bfcdf1014f04ec', 'success', '97', '8a0a33813a82c504ebe60ca2a82efd4ff17cd4cc6bbc678e8058c1b6ebb86997', '2026-06-05 14:48:57', '2026-06-05 14:49:29'),
('019e99c3-80f0-731f-88d5-9f60713ccc1f', 'TC-49697F', 'chi', 500000.00, 'Tiền mặt bằng', 'trả tiền mặt bằng', '2026-06-05', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x89a7c2b490b3f2d13cbce991f76a9cec119c706304ced81fed2b85dc42dbe78c', 'success', '97', 'c438727ba495035e06a8af233d167d1ec7dcabffc06e96b8d5ec3769fd864eba', '2026-06-05 14:49:47', '2026-06-05 14:49:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `wallet_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `wallet_address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', NULL, '2026-06-04 17:57:14', '2026-06-04 17:57:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher_signatures`
--

CREATE TABLE `voucher_signatures` (
  `id` bigint UNSIGNED NOT NULL,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_id` int NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `temp_order_data` longtext COLLATE utf8mb4_unicode_ci,
  `signature` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher_signatures`
--

INSERT INTO `voucher_signatures` (`id`, `order_code`, `token_id`, `store_owner_address`, `temp_order_data`, `signature`, `status`, `created_at`, `updated_at`) VALUES
(9, 'HD-F9X2M84', 5, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '{\"table_number\":null,\"payment_method\":\"bank_transfer\",\"total_amount\":392000,\"discount_amount\":5000,\"final_amount\":387000,\"items\":[{\"product_name\":\"Caramel Macchiato Nóng Royal\",\"variant_name\":null,\"quantity\":6,\"price\":49000,\"note\":null},{\"product_name\":\"Cà Phê Latte Hạt Dẻ Royal\",\"variant_name\":null,\"quantity\":2,\"price\":49000,\"note\":null}]}', NULL, 'pending', '2026-06-05 14:14:34', '2026-06-05 14:14:34'),
(10, 'HD-FBR5046', 5, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '{\"table_number\":null,\"payment_method\":\"cash\",\"total_amount\":147000,\"discount_amount\":5000,\"final_amount\":142000,\"items\":[{\"product_name\":\"Gà Rán Giòn Cay Giòn Rụm Classic\",\"variant_name\":null,\"quantity\":3,\"price\":49000,\"note\":null}]}', NULL, 'pending', '2026-06-05 14:16:00', '2026-06-05 14:16:00'),
(12, 'HD-FOY5237', 5, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '{\"table_number\":null,\"payment_method\":\"bank_transfer\",\"customer_id\":1001,\"total_amount\":637000,\"discount_amount\":5000,\"final_amount\":632000,\"items\":[{\"product_id\":532,\"product_variant_id\":null,\"product_name\":\"Caramel Macchiato Nóng Royal\",\"variant_name\":null,\"quantity\":10,\"price\":49000,\"note\":null},{\"product_id\":531,\"product_variant_id\":null,\"product_name\":\"Cà Phê Latte Hạt Dẻ Royal\",\"variant_name\":null,\"quantity\":3,\"price\":49000,\"note\":null}]}', '0xabbbad525898b493f303611beb6c937b458d86d40ee8da48a50a2615843651ac1b00b8285b254c2e7398997f68c5c4dc896c49aa0c1657c8e58eb8718e6ea8e81c', 'signed', '2026-06-05 14:26:15', '2026-06-05 14:29:10');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Chỉ mục cho bảng `category_product`
--
ALTER TABLE `category_product`
  ADD PRIMARY KEY (`product_id`,`category_id`),
  ADD KEY `category_product_category_id_foreign` (`category_id`);

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_customer_code_unique` (`customer_code`);

--
-- Chỉ mục cho bảng `customer_customer_group`
--
ALTER TABLE `customer_customer_group`
  ADD PRIMARY KEY (`customer_id`,`customer_group_id`),
  ADD KEY `customer_customer_group_customer_group_id_foreign` (`customer_group_id`);

--
-- Chỉ mục cho bảng `customer_groups`
--
ALTER TABLE `customer_groups`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `dining_tables`
--
ALTER TABLE `dining_tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dining_tables_area_id_foreign` (`area_id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Chỉ mục cho bảng `inventory_records`
--
ALTER TABLE `inventory_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_records_record_code_unique` (`record_code`);

--
-- Chỉ mục cho bảng `inventory_record_items`
--
ALTER TABLE `inventory_record_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_record_items_inventory_record_id_foreign` (`inventory_record_id`),
  ADD KEY `inventory_record_items_product_id_foreign` (`product_id`),
  ADD KEY `inventory_record_items_product_variant_id_foreign` (`product_variant_id`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_code_unique` (`order_code`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`),
  ADD KEY `order_items_product_variant_id_foreign` (`product_variant_id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`sku`);

--
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_variants_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_store_owner_address_unique` (`key`,`store_owner_address`);

--
-- Chỉ mục cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_transaction_code_unique` (`transaction_code`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_wallet_address_unique` (`wallet_address`);

--
-- Chỉ mục cho bảng `voucher_signatures`
--
ALTER TABLE `voucher_signatures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voucher_signatures_order_code_unique` (`order_code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `areas`
--
ALTER TABLE `areas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1003;

--
-- AUTO_INCREMENT cho bảng `customer_groups`
--
ALTER TABLE `customer_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `dining_tables`
--
ALTER TABLE `dining_tables`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `inventory_records`
--
ALTER TABLE `inventory_records`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `inventory_record_items`
--
ALTER TABLE `inventory_record_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=534;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `voucher_signatures`
--
ALTER TABLE `voucher_signatures`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `category_product`
--
ALTER TABLE `category_product`
  ADD CONSTRAINT `category_product_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `category_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `customer_customer_group`
--
ALTER TABLE `customer_customer_group`
  ADD CONSTRAINT `customer_customer_group_customer_group_id_foreign` FOREIGN KEY (`customer_group_id`) REFERENCES `customer_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_customer_group_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `dining_tables`
--
ALTER TABLE `dining_tables`
  ADD CONSTRAINT `dining_tables_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `inventory_record_items`
--
ALTER TABLE `inventory_record_items`
  ADD CONSTRAINT `inventory_record_items_inventory_record_id_foreign` FOREIGN KEY (`inventory_record_id`) REFERENCES `inventory_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_record_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_record_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `order_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
