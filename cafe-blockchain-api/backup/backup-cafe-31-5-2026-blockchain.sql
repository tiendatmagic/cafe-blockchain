-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th5 31, 2026 lúc 04:40 PM
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
(1, 'Sân vườn', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 11:04:19', '2026-05-26 11:04:19'),
(2, 'Tầng trệt', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 19:38:45', '2026-05-26 19:38:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-auth_nonce_0x1111111111111111111111111111111111111111', 's:32:\"91XAGxc1IECDMf5d00IIxDNhWv3bCQ4G\";', 1780101434),
('laravel-cache-auth_nonce_0x1234567890abcdef1234567890abcdef12345678', 's:32:\"G80TAyQnqa6TtEvoxaje8waoNk0ytgg7\";', 1780127215),
('laravel-cache-auth_nonce_0x3adac804a22fae38352f7defaf17b8298933aced', 's:32:\"0uyIjMHSEnOkBLZQNFG9uD19rHf81hUv\";', 1780127554),
('laravel-cache-auth_nonce_0x65b8dcb90f89a3f8029a330fdcc3b1c5d1980362', 's:32:\"Qa44rV0TlQsHaNok4tqzxClmBMO63lJY\";', 1779849644),
('laravel-cache-auth_nonce_0x75ad18ef47eda21baff837cac0f1563d0c355555', 's:32:\"6xkFByR0SosnVAVsbqjYXWgHE2nmcdKR\";', 1780101113),
('laravel-cache-auth_nonce_0x90f8bf6a479f320ced073e141279c6d365e12345', 's:32:\"6NxrwhTQlWjue4ySX1Hms7WREEJ4vXGV\";', 1779849515),
('laravel-cache-auth_nonce_0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5', 's:32:\"S8HAp4VTJ6SW4aHBCW4Bern9742NiYj5\";', 1779818375),
('laravel-cache-auth_nonce_0x99655b3434609de9837f75be371727787a9a3217', 's:32:\"T9T5H4VHeLz3YCeOQPP3y210y8TJAqRT\";', 1780142104),
('laravel-cache-auth_nonce_0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 's:32:\"ndJF6lAHMHCZu4U8PzkXwSF0GuaRIMbI\";', 1780143245);

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
  `chain_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `chain_id`, `name`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(10, NULL, 'Trà sữa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 19:54:36', '2026-05-25 19:54:36'),
(11, NULL, 'Đồ uống', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:55:30', '2026-05-26 10:55:30'),
(12, NULL, 'Cà phê', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(13, NULL, 'Trà trái cây', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(14, NULL, 'Đá xay', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(15, NULL, 'Sinh tố', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(16, NULL, 'Bánh ngọt', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(17, NULL, 'Món ăn', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(18, NULL, 'Món mới', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(19, NULL, 'Bán chạy', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(20, NULL, 'Trà sữa ô long', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(21, NULL, 'Soda Ý sảng khoái', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(22, NULL, 'Kem Gelato Ý', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(23, NULL, 'Đồ ăn nhanh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 17:20:26', '2026-05-29 17:37:09'),
(24, NULL, 'Đồ uống Web3', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:33:03', '2026-05-29 17:33:03'),
(32, NULL, 'Cà Phê Web3', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-30 05:09:53', '2026-05-30 05:09:53');

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
(31, 11),
(234, 11),
(235, 11),
(236, 11),
(237, 11),
(238, 11),
(239, 11),
(240, 11),
(241, 11),
(242, 11),
(243, 11),
(244, 11),
(245, 11),
(246, 11),
(247, 11),
(248, 11),
(249, 11),
(250, 11),
(251, 11),
(252, 11),
(253, 11),
(254, 11),
(255, 11),
(256, 11),
(257, 11),
(258, 11),
(259, 11),
(260, 11),
(261, 11),
(262, 11),
(263, 11),
(264, 11),
(265, 11),
(266, 11),
(267, 11),
(268, 11),
(269, 11),
(270, 11),
(271, 11),
(272, 11),
(273, 11),
(274, 11),
(275, 11),
(276, 11),
(277, 11),
(278, 11),
(279, 11),
(280, 11),
(281, 11),
(282, 11),
(283, 11),
(284, 11),
(285, 11),
(286, 11),
(287, 11),
(288, 11),
(289, 11),
(290, 11),
(291, 11),
(292, 11),
(293, 11),
(294, 11),
(295, 11),
(296, 11),
(297, 11),
(298, 11),
(299, 11),
(300, 11),
(301, 11),
(302, 11),
(303, 11),
(304, 11),
(305, 11),
(306, 11),
(307, 11),
(308, 11),
(309, 11),
(310, 11),
(311, 11),
(312, 11),
(313, 11),
(314, 11),
(315, 11),
(316, 11),
(317, 11),
(318, 11),
(319, 11),
(320, 11),
(321, 11),
(322, 11),
(323, 11),
(324, 11),
(325, 11),
(326, 11),
(327, 11),
(328, 11),
(329, 11),
(330, 11),
(331, 11),
(332, 11),
(333, 11),
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
(529, 23),
(334, 24),
(335, 24),
(336, 24),
(337, 24),
(338, 24),
(339, 24),
(340, 24),
(341, 24),
(342, 24),
(343, 24),
(344, 24),
(345, 24),
(346, 24),
(347, 24),
(348, 24),
(349, 24),
(350, 24),
(351, 24),
(352, 24),
(353, 24),
(354, 24),
(355, 24),
(356, 24),
(357, 24),
(358, 24),
(359, 24),
(360, 24),
(361, 24),
(362, 24),
(363, 24),
(364, 24),
(365, 24),
(366, 24),
(367, 24),
(368, 24),
(369, 24),
(370, 24),
(371, 24),
(372, 24),
(373, 24),
(374, 24),
(375, 24),
(376, 24),
(377, 24),
(378, 24),
(379, 24),
(380, 24),
(381, 24),
(382, 24),
(383, 24),
(384, 24),
(385, 24),
(386, 24),
(387, 24),
(388, 24),
(389, 24),
(390, 24),
(391, 24),
(392, 24),
(393, 24),
(394, 24),
(395, 24),
(396, 24),
(397, 24),
(398, 24),
(399, 24),
(400, 24),
(401, 24),
(402, 24),
(403, 24),
(404, 24),
(405, 24),
(406, 24),
(407, 24),
(408, 24),
(409, 24),
(410, 24),
(411, 24),
(412, 24),
(413, 24),
(414, 24),
(415, 24),
(416, 24),
(417, 24),
(418, 24),
(419, 24),
(420, 24),
(421, 24),
(422, 24),
(423, 24),
(424, 24),
(425, 24),
(426, 24),
(427, 24),
(428, 24),
(429, 24),
(430, 24),
(431, 24),
(432, 24),
(433, 24);

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

INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'KH-0001', 'individual', 'Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '123', NULL, NULL, 'Nam', NULL, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:37:36', '2026-05-27 18:42:30'),
(2, 'KH-0002', 'individual', 'Nguyen Van A', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987654321', 'a@gmail.com', NULL, 'Nam', 'Ha Noi', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 11:02:48', '2026-05-27 18:42:30'),
(3, 'KH-D7FF', 'individual', 'NguyNguyen Van A', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987654321', 'anguyen@example.com', NULL, 'Nam', NULL, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:46:58', '2026-05-29 17:46:58'),
(4, 'KH-CC16', 'individual', 'Nguyễn Tiến Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909123456', NULL, NULL, 'Nam', NULL, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-30 00:23:47', '2026-05-30 00:23:47'),
(5, 'KH-EC30', 'business', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ MODORO', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ MODORO', '4201768504', NULL, NULL, 'NNT đang hoạt động', NULL, NULL, NULL, 'Nam', 'Tầng 7 tòa nhà văn phòng VCN, đường A1, KĐT Vĩnh Điềm Trung, Phường Tây Nha Trang, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 00:30:50', '2026-05-30 00:35:10'),
(6, 'KH-799C', 'individual', 'Nguyễn Tiến Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909123456', NULL, NULL, 'Nam', NULL, '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:43:56', '2026-05-30 00:43:56'),
(7, 'KH-687C', 'individual', 'Hồ Tuấn Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0390116360', 'hotuantung82@gmail.com', '1994-05-28', 'Nam', '394 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(8, 'KH-3606', 'individual', 'Phùng Anh Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916331861', 'phunganhtuan33@gmail.com', '1991-01-03', 'Nam', '442 Đường Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(9, 'KH-5BDA', 'individual', 'Đặng Quang Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0846799868', 'dangquangviet76@gmail.com', '1981-02-10', 'Nam', '87 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(10, 'KH-85C8', 'individual', 'Đỗ Thu Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0771913741', 'dothuhuong23@gmail.com', '2002-02-04', 'Nữ', '1 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(11, 'KH-F75A', 'individual', 'Hồ Tiến Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320367146', 'hotienson57@gmail.com', '1980-05-19', 'Nam', '428 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(12, 'KH-407E', 'individual', 'Dương Quỳnh Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770642749', 'duongquynhthu45@gmail.com', '1994-10-11', 'Nữ', '431 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(13, 'KH-E56F', 'individual', 'Đặng Đức Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0944380773', 'dangduchoang32@gmail.com', '1983-06-01', 'Nam', '374 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(14, 'KH-8BC8', 'individual', 'Đinh Lan An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799401098', 'dinhlanan99@gmail.com', '1995-07-11', 'Nữ', '160 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(15, 'KH-B23C', 'individual', 'Huỳnh Tuyết Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0791177223', 'huynhtuyetlinh92@gmail.com', '1997-10-21', 'Nữ', '247 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(16, 'KH-9350', 'individual', 'Dương Cát Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856299169', 'duongcatdao97@gmail.com', '1999-09-05', 'Nữ', '62 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(17, 'KH-6314', 'individual', 'Phan Mai Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0844846231', 'phanmaithu90@gmail.com', '1999-05-19', 'Nữ', '163 Đường Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(18, 'KH-EA47', 'individual', 'Lê Tuyết Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848111057', 'letuyetdung63@gmail.com', '1977-09-26', 'Nữ', '82 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(19, 'KH-C9AC', 'individual', 'Dương Tiến Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0827388762', 'duongtienlong97@gmail.com', '2005-03-10', 'Nam', '101 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(20, 'KH-C29D', 'individual', 'Phùng Tuấn Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835671231', 'phungtuanvinh45@gmail.com', '1993-08-31', 'Nam', '115 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(21, 'KH-E427', 'individual', 'Võ Hữu Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0391620858', 'vohuuanh42@gmail.com', '1996-10-27', 'Nam', '137 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(22, 'KH-7B4F', 'individual', 'Đỗ Phương Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850544834', 'dophuonglinh48@gmail.com', '1978-02-27', 'Nữ', '6 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(23, 'KH-C314', 'individual', 'Nguyễn Hồng Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0356970197', 'nguyenhonghang27@gmail.com', '1978-01-19', 'Nữ', '254 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(24, 'KH-B35B', 'individual', 'Hoàng Ngọc Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985225618', 'hoangngochuong59@gmail.com', '1996-11-03', 'Nữ', '218 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(25, 'KH-0AA8', 'individual', 'Đinh Minh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0792711931', 'dinhminhanh65@gmail.com', '1978-04-26', 'Nam', '209 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(26, 'KH-5EBD', 'individual', 'Huỳnh Thị Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0399682055', 'huynhthitrang12@gmail.com', '1986-03-30', 'Nữ', '76 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(27, 'KH-5A71', 'individual', 'Lý Nhật Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360384278', 'lynhathuy95@gmail.com', '1983-10-16', 'Nam', '297 Đường Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(28, 'KH-E589', 'individual', 'Đặng Quốc Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0810629530', 'dangquochuy47@gmail.com', '1997-07-22', 'Nam', '206 Đường Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(29, 'KH-483B', 'individual', 'Mai Thành Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0815206828', 'maithanhviet95@gmail.com', '1984-07-04', 'Nam', '179 Đường Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(30, 'KH-0E0D', 'individual', 'Đỗ Tuyết Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0814461148', 'dotuyetvan79@gmail.com', '1985-05-01', 'Nữ', '404 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(31, 'KH-BAB0', 'individual', 'Dương Tuấn Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0846544452', 'duongtuantuan43@gmail.com', '1975-07-17', 'Nam', '112 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(32, 'KH-C5F4', 'individual', 'Ngô Đức Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779905346', 'ngoduchuy53@gmail.com', '1991-11-04', 'Nam', '429 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(33, 'KH-57CB', 'individual', 'Đặng Ngọc Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0364329147', 'dangngocdao37@gmail.com', '1984-05-19', 'Nữ', '324 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(34, 'KH-0BAB', 'individual', 'Đặng Cát Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375203337', 'dangcatanh18@gmail.com', '1988-06-29', 'Nữ', '269 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(35, 'KH-1DDE', 'individual', 'Lê Hoài Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779138227', 'lehoaiphuong38@gmail.com', '1978-06-22', 'Nữ', '98 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(36, 'KH-8C7C', 'individual', 'Đinh Cát Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361519008', 'dinhcatnhi39@gmail.com', '1981-05-25', 'Nữ', '289 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(37, 'KH-12D5', 'individual', 'Hoàng Nhật Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325620588', 'hoangnhatlam22@gmail.com', '1983-06-16', 'Nam', '448 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(38, 'KH-46F2', 'individual', 'Ngô Mai My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0823147682', 'ngomaimy74@gmail.com', '2005-02-28', 'Nữ', '146 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(39, 'KH-D39B', 'individual', 'Phan Thu Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0321441765', 'phanthucuc33@gmail.com', '1986-12-29', 'Nữ', '8 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(40, 'KH-FA66', 'individual', 'Dương Quang Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373528586', 'duongquangtan54@gmail.com', '1984-05-04', 'Nam', '39 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(41, 'KH-B063', 'individual', 'Nguyễn Hoài Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0814363097', 'nguyenhoaimai14@gmail.com', '2001-05-25', 'Nữ', '21 Đường Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(42, 'KH-0AC6', 'individual', 'Lâm Lan Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375637226', 'lamlanquynh77@gmail.com', '1989-09-22', 'Nữ', '402 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(43, 'KH-5D8B', 'individual', 'Bùi Khánh Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988755609', 'buikhanhdao83@gmail.com', '1999-03-19', 'Nữ', '355 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(44, 'KH-1AF8', 'individual', 'Hoàng Hoàng Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882095403', 'hoanghoanghai99@gmail.com', '1980-07-10', 'Nam', '4 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(45, 'KH-91CC', 'individual', 'Ngô Mạnh Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0842137186', 'ngomanhquang61@gmail.com', '1993-11-22', 'Nam', '345 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(46, 'KH-FBA1', 'individual', 'Đinh Diệu Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761790690', 'dinhdieuhoa95@gmail.com', '2003-11-10', 'Nữ', '207 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(47, 'KH-7077', 'individual', 'Lâm Hoàng Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385847096', 'lamhoanglam50@gmail.com', '1981-01-07', 'Nam', '372 Đường Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(48, 'KH-8E53', 'individual', 'Hồ Hoài Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769131532', 'hohoaiyen22@gmail.com', '1990-04-12', 'Nữ', '202 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(49, 'KH-F95D', 'individual', 'Lê Cẩm An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940614775', 'lecaman13@gmail.com', '1986-12-03', 'Nữ', '58 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(50, 'KH-1CD1', 'individual', 'Phan Bảo Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0911652960', 'phanbaohuy57@gmail.com', '1984-10-22', 'Nam', '7 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(51, 'KH-8482', 'individual', 'Phùng Ngọc Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883067558', 'phungngoclien34@gmail.com', '1995-07-14', 'Nữ', '27 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(52, 'KH-47AA', 'individual', 'Huỳnh Xuân Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0392098572', 'huynhxuancuong76@gmail.com', '1997-04-21', 'Nam', '297 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(53, 'KH-84DE', 'individual', 'Nguyễn Như Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988786211', 'nguyennhulan72@gmail.com', '1997-07-04', 'Nữ', '201 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(54, 'KH-1A7B', 'individual', 'Phạm Thảo Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325845724', 'phamthaooanh31@gmail.com', '2005-12-24', 'Nữ', '268 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(55, 'KH-3851', 'individual', 'Võ Duy Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0328516305', 'voduyhuy69@gmail.com', '1985-05-04', 'Nam', '380 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(56, 'KH-27DE', 'individual', 'Huỳnh Ngọc Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913895715', 'huynhngocyen81@gmail.com', '1993-10-24', 'Nữ', '158 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(57, 'KH-A581', 'individual', 'Nguyễn Văn Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0399926675', 'nguyenvangiang43@gmail.com', '2000-09-07', 'Nam', '342 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(58, 'KH-7016', 'individual', 'Vũ Thảo Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0709918852', 'vuthaodao48@gmail.com', '1976-01-12', 'Nữ', '438 Đường Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(59, 'KH-A1EF', 'individual', 'Dương Mạnh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0817402104', 'duongmanhtung15@gmail.com', '2002-05-11', 'Nam', '175 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(60, 'KH-2822', 'individual', 'Mai Văn Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971671887', 'maivantuan73@gmail.com', '1992-02-11', 'Nam', '331 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(61, 'KH-6170', 'individual', 'Đỗ Quỳnh Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0336355734', 'doquynhthu36@gmail.com', '2003-04-10', 'Nữ', '164 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(62, 'KH-9DCF', 'individual', 'Đinh Diệu Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0357605511', 'dinhdieutruc96@gmail.com', '1980-01-29', 'Nữ', '145 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(63, 'KH-CDA7', 'individual', 'Hoàng Mạnh Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380733783', 'hoangmanhbinh11@gmail.com', '1979-03-09', 'Nam', '159 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(64, 'KH-E52E', 'individual', 'Mai Xuân Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339441054', 'maixuanphuc99@gmail.com', '2003-05-20', 'Nam', '297 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(65, 'KH-B3AC', 'individual', 'Bùi Thảo Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838040040', 'buithaocuc84@gmail.com', '1993-05-15', 'Nữ', '419 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(66, 'KH-5F9C', 'individual', 'Ngô Hoài Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779024503', 'ngohoaingoc13@gmail.com', '2003-04-08', 'Nữ', '58 Đường Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(67, 'KH-0BF2', 'individual', 'Hoàng Như Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986779673', 'hoangnhuoanh95@gmail.com', '1996-03-22', 'Nữ', '234 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(68, 'KH-A2E5', 'individual', 'Dương Cẩm Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943526944', 'duongcamhang38@gmail.com', '2004-01-26', 'Nữ', '187 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(69, 'KH-BE2F', 'individual', 'Phạm Đức Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0978061884', 'phamduccuong86@gmail.com', '1980-09-11', 'Nam', '412 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(70, 'KH-29B4', 'individual', 'Lê Xuân Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0374124824', 'lexuanviet23@gmail.com', '1995-06-22', 'Nam', '356 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(71, 'KH-43A2', 'individual', 'Vũ Quỳnh Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350115319', 'vuquynhtuyet10@gmail.com', '1990-02-26', 'Nữ', '429 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(72, 'KH-47D3', 'individual', 'Đỗ Bích Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387330733', 'dobichhuong96@gmail.com', '1992-02-22', 'Nữ', '43 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(73, 'KH-E5BD', 'individual', 'Phan Như Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940807711', 'phannhutuyen62@gmail.com', '1988-07-05', 'Nữ', '55 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(74, 'KH-0760', 'individual', 'Hoàng Tuyết Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760796038', 'hoangtuyetmai49@gmail.com', '2002-01-21', 'Nữ', '14 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(75, 'KH-D925', 'individual', 'Đinh Tuấn Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821150446', 'dinhtuanquang70@gmail.com', '2002-01-25', 'Nam', '144 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(76, 'KH-D2C9', 'individual', 'Bùi Tiến Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775689804', 'buitienhai23@gmail.com', '2003-05-18', 'Nam', '317 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(77, 'KH-3B02', 'individual', 'Võ Tuấn Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394518226', 'votuantrung10@gmail.com', '1982-09-28', 'Nam', '284 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(78, 'KH-A923', 'individual', 'Vũ Diệu Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0973321280', 'vudieutrang70@gmail.com', '2005-02-08', 'Nữ', '103 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(79, 'KH-5719', 'individual', 'Phùng Hữu Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849389160', 'phunghuunam71@gmail.com', '1992-05-12', 'Nam', '448 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(80, 'KH-403D', 'individual', 'Mai Văn Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0949885237', 'maivangiang24@gmail.com', '2008-04-14', 'Nam', '391 Đường Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(81, 'KH-B62F', 'individual', 'Phùng Đức Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394605548', 'phungduckhanh17@gmail.com', '1996-11-02', 'Nam', '207 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(82, 'KH-0041', 'individual', 'Phùng Phương Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907967772', 'phungphuonghanh38@gmail.com', '2007-02-18', 'Nữ', '119 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(83, 'KH-7EF5', 'individual', 'Nguyễn Bảo Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353639485', 'nguyenbaoquan15@gmail.com', '1995-08-08', 'Nam', '217 Đường Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(84, 'KH-8464', 'individual', 'Ngô Mạnh Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375927257', 'ngomanhtien69@gmail.com', '1993-06-11', 'Nam', '1 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(85, 'KH-98D7', 'individual', 'Vũ Duy Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350066189', 'vuduytien41@gmail.com', '2001-02-14', 'Nam', '205 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(86, 'KH-4C8F', 'individual', 'Võ Hoàng Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370805130', 'vohoangson61@gmail.com', '1994-12-02', 'Nam', '157 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(87, 'KH-5154', 'individual', 'Bùi Quỳnh Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0396314413', 'buiquynhphuong74@gmail.com', '2001-12-20', 'Nữ', '235 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(88, 'KH-53E6', 'individual', 'Đỗ Mạnh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0903159581', 'domanhviet39@gmail.com', '1976-04-15', 'Nam', '54 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(89, 'KH-9141', 'individual', 'Lê Quốc Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342207836', 'lequocduc22@gmail.com', '1997-11-26', 'Nam', '409 Đường Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(90, 'KH-1E56', 'individual', 'Lâm Khánh Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0834702147', 'lamkhanhmai27@gmail.com', '2001-09-18', 'Nữ', '93 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(91, 'KH-34BB', 'individual', 'Đặng Anh Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0824197462', 'danganhtan44@gmail.com', '2001-12-29', 'Nam', '347 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(92, 'KH-C917', 'individual', 'Lý Tuấn Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909125824', 'lytuanduc60@gmail.com', '1997-09-26', 'Nam', '85 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(93, 'KH-36AC', 'individual', 'Phan Như Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333838044', 'phannhudung72@gmail.com', '1989-05-29', 'Nữ', '172 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(94, 'KH-75B6', 'individual', 'Phan Tuyết Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0379803844', 'phantuyettuyet75@gmail.com', '1989-10-02', 'Nữ', '356 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(95, 'KH-F3FB', 'individual', 'Hồ Như Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799176936', 'honhuvan77@gmail.com', '1993-02-08', 'Nữ', '366 Đường Lý Tự Trọng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(96, 'KH-1E91', 'individual', 'Lý Trọng Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0704941980', 'lytronghuy35@gmail.com', '1984-10-06', 'Nam', '310 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(97, 'KH-BD58', 'individual', 'Dương Phương Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375821805', 'duongphuongtrinh89@gmail.com', '1978-04-28', 'Nữ', '127 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(98, 'KH-7D82', 'individual', 'Nguyễn Tuấn Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0885838209', 'nguyentuanhuy28@gmail.com', '1994-08-05', 'Nam', '211 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(99, 'KH-7CC5', 'individual', 'Trần Quốc Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0915033328', 'tranquoctan73@gmail.com', '1982-04-18', 'Nam', '368 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(100, 'KH-EAF3', 'individual', 'Phùng Mạnh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0842902523', 'phungmanhhuy80@gmail.com', '1976-05-05', 'Nam', '78 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(101, 'KH-41A3', 'individual', 'Lý Tiến Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335334179', 'lytienanh49@gmail.com', '1997-07-27', 'Nam', '191 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(102, 'KH-51E8', 'individual', 'Ngô Mai My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0393069154', 'ngomaimy39@gmail.com', '1981-07-23', 'Nữ', '54 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(103, 'KH-6CC4', 'individual', 'Nguyễn Minh Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365254967', 'nguyenminhthai13@gmail.com', '2007-03-12', 'Nam', '201 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(104, 'KH-F0CD', 'individual', 'Võ Cát Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934084241', 'vocatnhi33@gmail.com', '1993-10-17', 'Nữ', '207 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(105, 'KH-8A28', 'individual', 'Võ Trọng Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327551799', 'votrongtien30@gmail.com', '1976-10-17', 'Nam', '236 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(106, 'KH-1511', 'individual', 'Mai Cẩm Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770982971', 'maicamngoc12@gmail.com', '1982-01-07', 'Nữ', '34 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(107, 'KH-479A', 'individual', 'Vũ Quỳnh Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971764703', 'vuquynhlan13@gmail.com', '1990-10-24', 'Nữ', '399 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(108, 'KH-6EE6', 'individual', 'Huỳnh Lan Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774885087', 'huynhlanmai41@gmail.com', '1982-05-09', 'Nữ', '388 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(109, 'KH-FFC7', 'individual', 'Đỗ Hữu Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831331178', 'dohuucuong19@gmail.com', '1977-03-12', 'Nam', '127 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(110, 'KH-8556', 'individual', 'Hoàng Hồng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359686663', 'hoanghonganh14@gmail.com', '1984-04-25', 'Nữ', '228 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(111, 'KH-6B06', 'individual', 'Huỳnh Tiến Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0826817881', 'huynhtienphuc38@gmail.com', '2002-10-01', 'Nam', '172 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(112, 'KH-0D55', 'individual', 'Bùi Hoàng Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0941381164', 'buihoangvinh42@gmail.com', '1994-01-04', 'Nam', '179 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(113, 'KH-CA33', 'individual', 'Võ Minh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785374021', 'vominhkhoa55@gmail.com', '1990-05-31', 'Nam', '402 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(114, 'KH-B9F1', 'individual', 'Lê Văn Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0974268699', 'levanbao84@gmail.com', '1987-09-29', 'Nam', '74 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(115, 'KH-3B79', 'individual', 'Huỳnh Văn Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938742922', 'huynhvantung28@gmail.com', '1989-06-19', 'Nam', '91 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(116, 'KH-52D8', 'individual', 'Phùng Quốc Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821060496', 'phungquoctan28@gmail.com', '2006-01-13', 'Nam', '280 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(117, 'KH-458B', 'individual', 'Bùi Khánh Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0797401667', 'buikhanhoanh14@gmail.com', '2002-08-21', 'Nữ', '313 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(118, 'KH-C365', 'individual', 'Đỗ Duy Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376074104', 'doduykhanh68@gmail.com', '1993-02-08', 'Nam', '9 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(119, 'KH-1CC5', 'individual', 'Hồ Phương Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333214002', 'hophuongmai86@gmail.com', '2003-11-15', 'Nữ', '402 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(120, 'KH-B03B', 'individual', 'Phùng Quang Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979582842', 'phungquangkiet31@gmail.com', '1995-10-28', 'Nam', '292 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(121, 'KH-5D9A', 'individual', 'Phan Lan Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777293927', 'phanlanngoc81@gmail.com', '1987-01-20', 'Nữ', '321 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(122, 'KH-A1FF', 'individual', 'Võ Thị Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0843536201', 'vothidao52@gmail.com', '1978-11-24', 'Nữ', '15 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(123, 'KH-02AF', 'individual', 'Dương Nhật Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0345261564', 'duongnhatphuc80@gmail.com', '1985-02-18', 'Nam', '246 Đường Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(124, 'KH-86F6', 'individual', 'Phạm Bảo Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979843262', 'phambaotrung37@gmail.com', '1989-11-22', 'Nam', '397 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(125, 'KH-5776', 'individual', 'Hồ Hoài Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0374515575', 'hohoaitruc64@gmail.com', '1997-04-28', 'Nữ', '268 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(126, 'KH-8F1D', 'individual', 'Đinh Quốc Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0844782938', 'dinhquoctung25@gmail.com', '2001-10-10', 'Nam', '179 Đường Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(127, 'KH-4C23', 'individual', 'Trần Thảo Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373889949', 'tranthaovy92@gmail.com', '1976-05-29', 'Nữ', '214 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(128, 'KH-341D', 'individual', 'Mai Tuấn Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0328179158', 'maituanlam15@gmail.com', '1997-10-09', 'Nam', '281 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(129, 'KH-DAB5', 'individual', 'Phạm Tuyết Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0388298509', 'phamtuyetlan43@gmail.com', '2000-10-20', 'Nữ', '143 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(130, 'KH-F835', 'individual', 'Vũ Văn Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331834695', 'vuvanviet29@gmail.com', '1980-06-18', 'Nam', '191 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(131, 'KH-7824', 'individual', 'Trần Hồng My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934105317', 'tranhongmy84@gmail.com', '2002-06-14', 'Nữ', '259 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(132, 'KH-3F0E', 'individual', 'Dương Quốc Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0778473814', 'duongquoctan48@gmail.com', '2000-02-04', 'Nam', '120 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(133, 'KH-B933', 'individual', 'Hồ Cát Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889127358', 'hocattrinh99@gmail.com', '1983-10-06', 'Nữ', '132 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(134, 'KH-8EE4', 'individual', 'Trần Khánh Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0949707370', 'trankhanhdung86@gmail.com', '1991-01-19', 'Nam', '274 Đường Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(135, 'KH-8BA9', 'individual', 'Ngô Quỳnh Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339594407', 'ngoquynhlan64@gmail.com', '2008-02-17', 'Nữ', '65 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(136, 'KH-4286', 'individual', 'Bùi Ngọc Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985781684', 'buingocmai53@gmail.com', '2005-01-19', 'Nữ', '160 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(137, 'KH-BCB7', 'individual', 'Lâm Mai Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335317561', 'lammaithao43@gmail.com', '1981-08-21', 'Nữ', '304 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(138, 'KH-9956', 'individual', 'Đặng Lan Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383304469', 'danglanngoc79@gmail.com', '1986-06-04', 'Nữ', '140 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(139, 'KH-E601', 'individual', 'Mai Trọng Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0357174954', 'maitrongtung10@gmail.com', '1991-06-13', 'Nam', '303 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(140, 'KH-1D84', 'individual', 'Hồ Khánh Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332683777', 'hokhanhdong79@gmail.com', '2001-12-21', 'Nam', '203 Đường Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(141, 'KH-918B', 'individual', 'Đinh Hoàng Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0902930976', 'dinhhoangquang27@gmail.com', '1989-05-25', 'Nam', '183 Đường Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(142, 'KH-8AB7', 'individual', 'Mai Cẩm Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0824681999', 'maicamanh63@gmail.com', '2003-05-24', 'Nữ', '192 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(143, 'KH-B195', 'individual', 'Lâm Như Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0842032521', 'lamnhutuyet99@gmail.com', '2000-02-13', 'Nữ', '365 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(144, 'KH-0FC6', 'individual', 'Phạm Quang Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901384434', 'phamquanghoang58@gmail.com', '2002-11-09', 'Nam', '178 Đường Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(145, 'KH-7F4B', 'individual', 'Hoàng Tuấn Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320618150', 'hoangtuantien71@gmail.com', '1984-09-05', 'Nam', '211 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(146, 'KH-6510', 'individual', 'Mai Bảo Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0709591828', 'maibaotien44@gmail.com', '2004-02-03', 'Nam', '409 Đường Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(147, 'KH-3961', 'individual', 'Lâm Thảo Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335159455', 'lamthaoquynh55@gmail.com', '1987-10-29', 'Nữ', '50 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(148, 'KH-BD75', 'individual', 'Phạm Tiến Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0841080624', 'phamtientuan84@gmail.com', '1984-09-06', 'Nam', '264 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(149, 'KH-F2D7', 'individual', 'Phạm Cát Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358513618', 'phamcatquynh57@gmail.com', '1994-10-11', 'Nữ', '218 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(150, 'KH-808E', 'individual', 'Trần Đức Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985278956', 'tranduccuong40@gmail.com', '1980-11-22', 'Nam', '85 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(151, 'KH-1631', 'individual', 'Phùng Khánh Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916906040', 'phungkhanhkhanh75@gmail.com', '1979-01-11', 'Nam', '369 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(152, 'KH-EFDE', 'individual', 'Ngô Anh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376988658', 'ngoanhanh67@gmail.com', '1977-09-05', 'Nam', '23 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(153, 'KH-6D37', 'individual', 'Nguyễn Tiến Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981765873', 'nguyentienquang61@gmail.com', '1980-07-13', 'Nam', '102 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(154, 'KH-B7CF', 'individual', 'Bùi Diệu Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904025676', 'buidieuvan79@gmail.com', '2000-11-25', 'Nữ', '425 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(155, 'KH-19F0', 'individual', 'Đặng Trọng Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979842285', 'dangtrongdat36@gmail.com', '2008-04-30', 'Nam', '127 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(156, 'KH-18E0', 'individual', 'Hồ Cát Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774158618', 'hocatchi93@gmail.com', '1984-05-12', 'Nữ', '173 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(157, 'KH-10AF', 'individual', 'Đỗ Cẩm Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839457767', 'docamha93@gmail.com', '1977-03-13', 'Nữ', '282 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(158, 'KH-FEB0', 'individual', 'Lê Diệu Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0857538991', 'ledieuhang28@gmail.com', '1979-08-14', 'Nữ', '324 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(159, 'KH-8F2A', 'individual', 'Huỳnh Thành Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971895293', 'huynhthanhkiet27@gmail.com', '2005-05-01', 'Nam', '333 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(160, 'KH-EF07', 'individual', 'Mai Tiến Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900267599', 'maitienkhoa90@gmail.com', '1988-05-10', 'Nam', '36 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(161, 'KH-FBAB', 'individual', 'Đặng Tiến Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332597909', 'dangtienhuy58@gmail.com', '1980-10-09', 'Nam', '255 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(162, 'KH-27FF', 'individual', 'Ngô Quang Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324912442', 'ngoquangquang78@gmail.com', '1982-07-19', 'Nam', '337 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(163, 'KH-69A6', 'individual', 'Lý Lan Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0762686450', 'lylananh29@gmail.com', '1986-09-15', 'Nữ', '108 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(164, 'KH-5A21', 'individual', 'Võ Hữu Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0912114709', 'vohuudat35@gmail.com', '1987-07-27', 'Nam', '83 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(165, 'KH-06C6', 'individual', 'Phan Anh Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777665198', 'phananhcuong20@gmail.com', '1994-04-14', 'Nam', '349 Đường Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(166, 'KH-D7D7', 'individual', 'Đặng Trọng Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0356910992', 'dangtronghai86@gmail.com', '1979-10-23', 'Nam', '224 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(167, 'KH-A22D', 'individual', 'Đặng Nhật Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0903394826', 'dangnhathuy48@gmail.com', '1986-07-31', 'Nam', '238 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(168, 'KH-ACFE', 'individual', 'Phùng Khánh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930352925', 'phungkhanhcuc78@gmail.com', '1989-05-17', 'Nữ', '70 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(169, 'KH-67C3', 'individual', 'Huỳnh Cẩm Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0857243225', 'huynhcamtrang44@gmail.com', '1977-07-18', 'Nữ', '413 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(170, 'KH-0231', 'individual', 'Đỗ Khánh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0798625919', 'dokhanhson80@gmail.com', '2001-07-26', 'Nam', '238 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(171, 'KH-4E65', 'individual', 'Lý Tuyết Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0336513866', 'lytuyetlien50@gmail.com', '2001-08-13', 'Nữ', '377 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(172, 'KH-8315', 'individual', 'Mai Ngọc Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0826096535', 'maingocmai64@gmail.com', '2000-08-08', 'Nữ', '148 Đường Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(173, 'KH-7CA2', 'individual', 'Ngô Minh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0825838202', 'ngominhhuy93@gmail.com', '1998-01-06', 'Nam', '340 Đường Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(174, 'KH-291B', 'individual', 'Nguyễn Cát Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883393222', 'nguyencatdao13@gmail.com', '1979-06-14', 'Nữ', '331 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(175, 'KH-97EC', 'individual', 'Huỳnh Hoàng Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884004541', 'huynhhoangtung48@gmail.com', '1976-07-18', 'Nam', '215 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(176, 'KH-76FA', 'individual', 'Huỳnh Hữu Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971423502', 'huynhhuuhuy54@gmail.com', '1993-03-08', 'Nam', '268 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(177, 'KH-F9CF', 'individual', 'Hồ Tuyết Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0941755308', 'hotuyetvan78@gmail.com', '1989-01-12', 'Nữ', '450 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(178, 'KH-74DE', 'individual', 'Lý Nhật Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358134951', 'lynhathung14@gmail.com', '1976-06-19', 'Nam', '435 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(179, 'KH-F097', 'individual', 'Phan Duy Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0391324716', 'phanduyphong55@gmail.com', '1993-10-22', 'Nam', '420 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(180, 'KH-2BF8', 'individual', 'Đặng Thảo Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962770707', 'dangthaohang25@gmail.com', '1982-08-01', 'Nữ', '195 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(181, 'KH-5C71', 'individual', 'Hồ Duy Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0813267565', 'hoduyduc94@gmail.com', '1998-09-23', 'Nam', '201 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(182, 'KH-0017', 'individual', 'Bùi Thị Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0795186746', 'buithidung90@gmail.com', '2007-03-24', 'Nữ', '90 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(183, 'KH-0FD8', 'individual', 'Hoàng Hoàng Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838083251', 'hoanghoanghuy53@gmail.com', '2003-11-06', 'Nam', '361 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(184, 'KH-6CC7', 'individual', 'Hồ Bích Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0947677940', 'hobichtuyet28@gmail.com', '1982-02-06', 'Nữ', '252 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(185, 'KH-7E2E', 'individual', 'Bùi Hữu Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361651351', 'buihuuquan59@gmail.com', '2006-05-08', 'Nam', '47 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(186, 'KH-0B97', 'individual', 'Hoàng Anh Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0978712405', 'hoanganhdung53@gmail.com', '1980-01-19', 'Nam', '405 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(187, 'KH-9DE4', 'individual', 'Ngô Diệu Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320427041', 'ngodieumai55@gmail.com', '1997-03-22', 'Nữ', '17 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(188, 'KH-4790', 'individual', 'Phùng Bích Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968724044', 'phungbichhang18@gmail.com', '1977-05-19', 'Nữ', '57 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(189, 'KH-D817', 'individual', 'Trần Trọng Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0824723944', 'trantrongminh56@gmail.com', '1996-09-13', 'Nam', '124 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(190, 'KH-7B4E', 'individual', 'Phan Quỳnh Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938648966', 'phanquynhvy37@gmail.com', '1984-09-12', 'Nữ', '130 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(191, 'KH-B7D3', 'individual', 'Phùng Quỳnh My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0761534563', 'phungquynhmy24@gmail.com', '1983-03-09', 'Nữ', '96 Đường Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(192, 'KH-F9A3', 'individual', 'Bùi Tuyết Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0784525322', 'buituyetmai97@gmail.com', '2006-01-19', 'Nữ', '200 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(193, 'KH-6C57', 'individual', 'Phạm Thảo Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0706047380', 'phamthaophuong65@gmail.com', '2000-03-04', 'Nữ', '316 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(194, 'KH-7AAD', 'individual', 'Võ Quang Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0334815605', 'voquangtien73@gmail.com', '2001-10-13', 'Nam', '47 Đường Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(195, 'KH-6C7D', 'individual', 'Võ Duy Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358744179', 'voduycuong19@gmail.com', '2002-12-08', 'Nam', '65 Đường Bùi Thị Xuân, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(196, 'KH-A036', 'individual', 'Bùi Quốc Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787771118', 'buiquocdat14@gmail.com', '1990-09-06', 'Nam', '337 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(197, 'KH-E257', 'individual', 'Nguyễn Khánh Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0327674953', 'nguyenkhanhlinh55@gmail.com', '1978-12-25', 'Nữ', '345 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(198, 'KH-DE78', 'individual', 'Lý Thị Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0817423590', 'lythithu11@gmail.com', '1988-12-04', 'Nữ', '227 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(199, 'KH-92D4', 'individual', 'Lê Duy Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0852246068', 'leduyhai17@gmail.com', '1987-09-14', 'Nam', '326 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(200, 'KH-AAC4', 'individual', 'Lý Khánh Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855569269', 'lykhanhoanh90@gmail.com', '1993-04-09', 'Nữ', '212 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(201, 'KH-EFAD', 'individual', 'Đặng Hồng Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972351562', 'danghonglien44@gmail.com', '1987-10-05', 'Nữ', '176 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(202, 'KH-6533', 'individual', 'Phạm Minh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380578956', 'phamminhhuy48@gmail.com', '2003-03-26', 'Nam', '157 Đường Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(203, 'KH-DAE4', 'individual', 'Phùng Hoàng Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777473096', 'phunghoangthinh15@gmail.com', '1988-12-15', 'Nam', '366 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(204, 'KH-D646', 'individual', 'Hồ Anh Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0966617154', 'hoanhphong86@gmail.com', '1982-12-31', 'Nam', '22 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(205, 'KH-6A41', 'individual', 'Đỗ Bích Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331416999', 'dobichanh90@gmail.com', '1984-09-17', 'Nữ', '364 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(206, 'KH-CBDC', 'individual', 'Đặng Tuyết My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849852902', 'dangtuyetmy66@gmail.com', '1988-08-12', 'Nữ', '341 Đường Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(207, 'KH-BD88', 'individual', 'Phùng Tiến Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0960064283', 'phungtienhung94@gmail.com', '1993-02-17', 'Nam', '209 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(208, 'KH-995A', 'individual', 'Phạm Minh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0858340739', 'phamminhhung43@gmail.com', '1992-01-14', 'Nam', '163 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(209, 'KH-7E6E', 'individual', 'Đặng Anh Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0819570031', 'danganhthinh59@gmail.com', '1991-10-16', 'Nam', '161 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(210, 'KH-55D2', 'individual', 'Bùi Thị Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0366859282', 'buithihuong48@gmail.com', '1999-02-13', 'Nữ', '231 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(211, 'KH-A8DE', 'individual', 'Phan Anh Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0975818393', 'phananhdong74@gmail.com', '1982-05-04', 'Nam', '34 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(212, 'KH-5765', 'individual', 'Vũ Mai Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981887510', 'vumaitrinh56@gmail.com', '1976-09-20', 'Nữ', '47 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(213, 'KH-F94F', 'individual', 'Mai Khánh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820173652', 'maikhanhquan67@gmail.com', '1990-01-02', 'Nam', '289 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(214, 'KH-94D2', 'individual', 'Phạm Đức Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882839783', 'phamducbinh22@gmail.com', '2003-10-04', 'Nam', '51 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(215, 'KH-49A2', 'individual', 'Đặng Thu Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385686372', 'dangthutruc45@gmail.com', '2005-09-15', 'Nữ', '203 Đường Điện Biên Phủ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(216, 'KH-6640', 'individual', 'Lý Quốc Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0352424893', 'lyquocphuc12@gmail.com', '2004-10-12', 'Nam', '435 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(217, 'KH-8521', 'individual', 'Mai Hồng Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361100706', 'maihongvan46@gmail.com', '1998-05-26', 'Nữ', '272 Đường Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(218, 'KH-E77E', 'individual', 'Hồ Cát Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0948518318', 'hocattuyet88@gmail.com', '1985-06-20', 'Nữ', '75 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(219, 'KH-079B', 'individual', 'Đặng Phương Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775082562', 'dangphuongtrinh94@gmail.com', '1982-05-23', 'Nữ', '435 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(220, 'KH-26D0', 'individual', 'Nguyễn Thu Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0851913015', 'nguyenthutrinh12@gmail.com', '1983-07-23', 'Nữ', '160 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(221, 'KH-833C', 'individual', 'Lâm Cát Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0702002245', 'lamcathanh60@gmail.com', '1977-09-17', 'Nữ', '197 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(222, 'KH-E40B', 'individual', 'Ngô Hoàng Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0332735265', 'ngohoangthai97@gmail.com', '1986-10-23', 'Nam', '105 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(223, 'KH-794E', 'individual', 'Trần Bích Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884598461', 'tranbichchi98@gmail.com', '1976-07-24', 'Nữ', '240 Đường Đồng Khởi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(224, 'KH-07B0', 'individual', 'Võ Tuyết Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372781095', 'votuyetvy93@gmail.com', '1977-02-09', 'Nữ', '380 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(225, 'KH-B9B1', 'individual', 'Phạm Diệu Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0905232697', 'phamdieulien94@gmail.com', '1999-01-04', 'Nữ', '138 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(226, 'KH-230A', 'individual', 'Lê Xuân Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0778696205', 'lexuankhoa70@gmail.com', '2000-02-22', 'Nam', '206 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(227, 'KH-AD1F', 'individual', 'Vũ Lan Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0796855001', 'vulanoanh84@gmail.com', '2002-09-17', 'Nữ', '380 Đường Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(228, 'KH-2A11', 'individual', 'Phùng Mạnh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777528721', 'phungmanhkhoa14@gmail.com', '1977-12-29', 'Nam', '58 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(229, 'KH-A40E', 'individual', 'Đinh Hữu Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375106815', 'dinhhuutien88@gmail.com', '1988-02-09', 'Nam', '124 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(230, 'KH-7ECA', 'individual', 'Đặng Cát Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329823435', 'dangcatlien12@gmail.com', '1987-12-14', 'Nữ', '382 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(231, 'KH-0CC5', 'individual', 'Vũ Thị Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787511836', 'vuthivan50@gmail.com', '1986-01-25', 'Nữ', '221 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(232, 'KH-BDB9', 'individual', 'Dương Quốc Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849245461', 'duongquockhanh32@gmail.com', '1977-10-26', 'Nam', '424 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(233, 'KH-9775', 'individual', 'Ngô Diệu Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365402117', 'ngodieutrinh37@gmail.com', '2003-04-29', 'Nữ', '261 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(234, 'KH-F328', 'individual', 'Nguyễn Quốc Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0903167433', 'nguyenquocdong22@gmail.com', '2005-11-04', 'Nam', '103 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(235, 'KH-4BF3', 'individual', 'Phùng Diệu Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0325375874', 'phungdieulien55@gmail.com', '1995-01-31', 'Nữ', '147 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(236, 'KH-DD8E', 'individual', 'Phan Quang Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768484069', 'phanquangson99@gmail.com', '2005-07-18', 'Nam', '117 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(237, 'KH-8C34', 'individual', 'Võ Quỳnh Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0917026012', 'voquynhtruc40@gmail.com', '1997-05-31', 'Nữ', '60 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(238, 'KH-C88F', 'individual', 'Đặng Thảo Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776406740', 'dangthaoanh39@gmail.com', '1994-05-29', 'Nữ', '359 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(239, 'KH-8CBE', 'individual', 'Huỳnh Diệu Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0988792386', 'huynhdieulien17@gmail.com', '2004-07-21', 'Nữ', '446 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(240, 'KH-50BC', 'individual', 'Nguyễn Thảo Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909627428', 'nguyenthaothu93@gmail.com', '1976-11-01', 'Nữ', '276 Đường Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(241, 'KH-2523', 'individual', 'Đỗ Bích Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340474215', 'dobichtruc63@gmail.com', '1985-12-14', 'Nữ', '85 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(242, 'KH-482E', 'individual', 'Đinh Bích Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0329145240', 'dinhbichlien72@gmail.com', '1998-08-23', 'Nữ', '145 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(243, 'KH-2507', 'individual', 'Lý Quang Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0910566743', 'lyquangthai73@gmail.com', '1987-03-08', 'Nam', '385 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(244, 'KH-610B', 'individual', 'Phan Bảo Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833506173', 'phanbaokhanh15@gmail.com', '1994-01-08', 'Nam', '74 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(245, 'KH-A36E', 'individual', 'Mai Tuyết Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373792403', 'maituyetdao80@gmail.com', '1985-03-16', 'Nữ', '402 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(246, 'KH-3298', 'individual', 'Lâm Khánh An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0812202453', 'lamkhanhan50@gmail.com', '2002-10-19', 'Nữ', '205 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(247, 'KH-8DE9', 'individual', 'Lê Quốc Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0832262472', 'lequochung99@gmail.com', '1989-10-21', 'Nam', '427 Đường Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(248, 'KH-A221', 'individual', 'Lê Xuân Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0829790012', 'lexuantung66@gmail.com', '1980-09-17', 'Nam', '408 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(249, 'KH-CAB8', 'individual', 'Huỳnh Anh Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848837708', 'huynhanhanh14@gmail.com', '1975-08-18', 'Nam', '445 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(250, 'KH-18B4', 'individual', 'Võ Quang Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0887244555', 'voquanglong83@gmail.com', '1983-08-29', 'Nam', '5 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(251, 'KH-0B10', 'individual', 'Lê Thảo Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835138711', 'lethaotrinh85@gmail.com', '2005-04-15', 'Nữ', '63 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(252, 'KH-D56B', 'individual', 'Lý Lan Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904283027', 'lylanhanh50@gmail.com', '1979-10-27', 'Nữ', '363 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(253, 'KH-FBCB', 'individual', 'Bùi Văn Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0841803574', 'buivanhuy11@gmail.com', '2001-08-19', 'Nam', '10 Đường Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(254, 'KH-28FB', 'individual', 'Hoàng Lan Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376578489', 'hoanglantuyen11@gmail.com', '1980-07-04', 'Nữ', '313 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(255, 'KH-5385', 'individual', 'Phan Xuân Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849850470', 'phanxuanbao20@gmail.com', '1985-12-01', 'Nam', '362 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(256, 'KH-98A4', 'individual', 'Phan Hồng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850731407', 'phanhonganh52@gmail.com', '1979-08-07', 'Nữ', '391 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(257, 'KH-F1BD', 'individual', 'Dương Khánh Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831907529', 'duongkhanhdao56@gmail.com', '1998-01-23', 'Nữ', '253 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(258, 'KH-D226', 'individual', 'Võ Minh Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0369334619', 'vominhduc12@gmail.com', '2001-10-09', 'Nam', '289 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(259, 'KH-0B7C', 'individual', 'Ngô Hồng Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0705036708', 'ngohonggiang76@gmail.com', '2001-07-29', 'Nữ', '34 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(260, 'KH-4480', 'individual', 'Phan Xuân Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0906315444', 'phanxuanthinh14@gmail.com', '1987-03-07', 'Nam', '200 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(261, 'KH-17C8', 'individual', 'Đinh Bảo Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0912561057', 'dinhbaokhoa30@gmail.com', '1999-06-06', 'Nam', '157 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(262, 'KH-53FE', 'individual', 'Trần Quỳnh Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0945229369', 'tranquynhha23@gmail.com', '2001-11-28', 'Nữ', '343 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(263, 'KH-A470', 'individual', 'Đỗ Đức Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0374934290', 'doduckhanh90@gmail.com', '1985-10-18', 'Nam', '14 Đường Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(264, 'KH-8AFB', 'individual', 'Phạm Ngọc Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342515886', 'phamngocquynh67@gmail.com', '1990-03-11', 'Nữ', '435 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(265, 'KH-7324', 'individual', 'Vũ Văn Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385143451', 'vuvanson33@gmail.com', '2001-02-21', 'Nam', '237 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(266, 'KH-B214', 'individual', 'Phan Quốc Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0940908676', 'phanquoctrung51@gmail.com', '2007-06-16', 'Nam', '38 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(267, 'KH-23BE', 'individual', 'Ngô Mai Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764798267', 'ngomaiyen57@gmail.com', '1989-01-29', 'Nữ', '105 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(268, 'KH-6512', 'individual', 'Ngô Hữu Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882636675', 'ngohuutan96@gmail.com', '1985-10-21', 'Nam', '32 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(269, 'KH-F9DA', 'individual', 'Vũ Bảo Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0388288392', 'vubaodong39@gmail.com', '2001-11-07', 'Nam', '59 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(270, 'KH-BFBA', 'individual', 'Huỳnh Duy Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0387616178', 'huynhduyviet26@gmail.com', '2004-06-20', 'Nam', '97 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(271, 'KH-CC36', 'individual', 'Đặng Duy Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883644140', 'dangduyduc53@gmail.com', '1997-12-08', 'Nam', '364 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(272, 'KH-4418', 'individual', 'Phan Ngọc Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889422809', 'phanngocthao46@gmail.com', '1981-02-19', 'Nữ', '286 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(273, 'KH-C464', 'individual', 'Vũ Hồng Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342427631', 'vuhonghanh13@gmail.com', '1985-01-27', 'Nữ', '168 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(274, 'KH-A1F9', 'individual', 'Lê Anh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324917994', 'leanhnam65@gmail.com', '2004-01-19', 'Nam', '69 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(275, 'KH-1E1F', 'individual', 'Lâm Cẩm Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0704326592', 'lamcamlan30@gmail.com', '1988-08-03', 'Nữ', '364 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(276, 'KH-DB2B', 'individual', 'Đinh Cát Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904091677', 'dinhcatphuong70@gmail.com', '2000-06-02', 'Nữ', '114 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(277, 'KH-793B', 'individual', 'Phạm Bảo Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0880978316', 'phambaokhanh26@gmail.com', '1992-06-11', 'Nam', '124 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(278, 'KH-61B7', 'individual', 'Vũ Diệu Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0941763206', 'vudieunhi34@gmail.com', '1977-11-08', 'Nữ', '105 Đường Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(279, 'KH-BAD8', 'individual', 'Lâm Quốc Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0886053472', 'lamquocgiang96@gmail.com', '1991-12-25', 'Nam', '267 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(280, 'KH-06CB', 'individual', 'Phan Thu Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942646592', 'phanthuhuong20@gmail.com', '1983-04-05', 'Nữ', '424 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(281, 'KH-BCE2', 'individual', 'Phạm Quốc Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340143560', 'phamquoctan49@gmail.com', '1984-06-10', 'Nam', '122 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(282, 'KH-EB37', 'individual', 'Trần Mai Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708492789', 'tranmaianh47@gmail.com', '1990-05-25', 'Nữ', '16 Đường Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(283, 'KH-8054', 'individual', 'Hồ Quang Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0840473847', 'hoquanglong77@gmail.com', '2007-08-26', 'Nam', '345 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(284, 'KH-032C', 'individual', 'Bùi Mai Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986452517', 'buimaituyen95@gmail.com', '2007-07-15', 'Nữ', '445 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(285, 'KH-28F7', 'individual', 'Võ Minh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930664410', 'vominhnam40@gmail.com', '2003-10-15', 'Nam', '101 Đường Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(286, 'KH-8F37', 'individual', 'Phạm Tuyết Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335591679', 'phamtuyetmai90@gmail.com', '1997-08-24', 'Nữ', '274 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(287, 'KH-884D', 'individual', 'Nguyễn Hữu Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909930647', 'nguyenhuuminh62@gmail.com', '1983-06-04', 'Nam', '307 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(288, 'KH-44D1', 'individual', 'Hoàng Thu Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0813171492', 'hoangthuha89@gmail.com', '2001-11-13', 'Nữ', '161 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(289, 'KH-46F7', 'individual', 'Lâm Xuân Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0386961904', 'lamxuanson11@gmail.com', '1983-09-13', 'Nam', '433 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(290, 'KH-32D5', 'individual', 'Lâm Bảo Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0910106940', 'lambaokiet87@gmail.com', '1982-07-13', 'Nam', '194 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(291, 'KH-9B4C', 'individual', 'Phùng Mạnh Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0829938949', 'phungmanhlam52@gmail.com', '1982-07-10', 'Nam', '20 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(292, 'KH-1DB8', 'individual', 'Mai Đức Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376761459', 'maiduchai65@gmail.com', '1975-10-23', 'Nam', '120 Đường Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(293, 'KH-EC27', 'individual', 'Lê Cát Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0906305030', 'lecathang33@gmail.com', '1985-09-17', 'Nữ', '141 Đường Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(294, 'KH-165A', 'individual', 'Bùi Duy Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0960021326', 'buiduyduc49@gmail.com', '2003-04-26', 'Nam', '55 Đường Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(295, 'KH-50A3', 'individual', 'Phan Trọng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0780333615', 'phantronganh50@gmail.com', '1984-05-31', 'Nam', '94 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(296, 'KH-F7AE', 'individual', 'Phùng Hoài Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331975498', 'phunghoaiphuong95@gmail.com', '1978-12-12', 'Nữ', '302 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(297, 'KH-9117', 'individual', 'Hoàng Mai Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783199937', 'hoangmaianh88@gmail.com', '1994-04-25', 'Nữ', '296 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(298, 'KH-374E', 'individual', 'Lâm Xuân Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324013939', 'lamxuandat77@gmail.com', '1988-02-05', 'Nam', '104 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(299, 'KH-F86F', 'individual', 'Bùi Thảo Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909328282', 'buithaohanh28@gmail.com', '1984-08-01', 'Nữ', '46 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(300, 'KH-E6A4', 'individual', 'Trần Trọng Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820422557', 'trantrongtrung83@gmail.com', '2002-11-15', 'Nam', '119 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(301, 'KH-97DB', 'individual', 'Võ Minh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0887979936', 'vominhquan17@gmail.com', '1994-08-21', 'Nam', '313 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(302, 'KH-407C', 'individual', 'Lê Bích Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340842040', 'lebichthao63@gmail.com', '2008-02-17', 'Nữ', '222 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(303, 'KH-2AE5', 'individual', 'Trần Văn Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943616322', 'tranvantien10@gmail.com', '1992-04-08', 'Nam', '112 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(304, 'KH-9D17', 'individual', 'Võ Quốc Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0822790783', 'voquocduc81@gmail.com', '1984-02-02', 'Nam', '20 Đường Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(305, 'KH-55E1', 'individual', 'Đỗ Quốc Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0858751418', 'doquoctan75@gmail.com', '2000-08-19', 'Nam', '61 Đường Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(306, 'KH-66C4', 'individual', 'Phạm Văn Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0935628116', 'phamvankiet81@gmail.com', '1985-11-08', 'Nam', '349 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(307, 'KH-EC21', 'individual', 'Dương Quỳnh Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968608652', 'duongquynhphuong54@gmail.com', '2006-03-10', 'Nữ', '213 Đường Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(308, 'KH-20DD', 'individual', 'Phan Anh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0817160447', 'phananhquan33@gmail.com', '1976-10-17', 'Nam', '187 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(309, 'KH-BED2', 'individual', 'Võ Tuấn Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365056803', 'votuanlong28@gmail.com', '1981-06-25', 'Nam', '346 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(310, 'KH-62B1', 'individual', 'Bùi Lan Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0762286083', 'builanphuong23@gmail.com', '2001-01-12', 'Nữ', '277 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(311, 'KH-84BD', 'individual', 'Đặng Mạnh Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833034325', 'dangmanhhai24@gmail.com', '1981-09-17', 'Nam', '330 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(312, 'KH-A6F5', 'individual', 'Đỗ Thành Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0822196173', 'dothanhlam33@gmail.com', '1985-07-27', 'Nam', '300 Đường Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(313, 'KH-6096', 'individual', 'Ngô Quang Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987278311', 'ngoquangkiet11@gmail.com', '1997-06-29', 'Nam', '169 Đường Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(314, 'KH-EB9E', 'individual', 'Lâm Khánh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799532193', 'lamkhanhviet18@gmail.com', '1994-02-25', 'Nam', '113 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(315, 'KH-F075', 'individual', 'Lâm Như Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0980229156', 'lamnhungoc75@gmail.com', '1976-11-18', 'Nữ', '105 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(316, 'KH-C985', 'individual', 'Võ Bích Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370913921', 'vobichlan57@gmail.com', '2002-05-08', 'Nữ', '447 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(317, 'KH-68E1', 'individual', 'Phùng Mạnh Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0858042676', 'phungmanhlong86@gmail.com', '1978-07-19', 'Nam', '23 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(318, 'KH-88F5', 'individual', 'Huỳnh Ngọc Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385493441', 'huynhngocmai34@gmail.com', '1993-03-03', 'Nữ', '294 Đường Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(319, 'KH-7A66', 'individual', 'Đặng Bích Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0794079194', 'dangbichphuong11@gmail.com', '1982-06-12', 'Nữ', '273 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(320, 'KH-3730', 'individual', 'Đỗ Bích Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856705392', 'dobichvy98@gmail.com', '1993-11-17', 'Nữ', '57 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(321, 'KH-B5EC', 'individual', 'Trần Phương Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0328408032', 'tranphuongdao46@gmail.com', '2006-08-08', 'Nữ', '39 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(322, 'KH-35AE', 'individual', 'Võ Lan Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0819745398', 'volanmai64@gmail.com', '1983-07-01', 'Nữ', '199 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(323, 'KH-58FA', 'individual', 'Hồ Phương Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0989254290', 'hophuongyen20@gmail.com', '1995-03-04', 'Nữ', '276 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(324, 'KH-19E3', 'individual', 'Hồ Cẩm Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0364872202', 'hocamtrinh46@gmail.com', '1990-11-22', 'Nữ', '48 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(325, 'KH-1394', 'individual', 'Vũ Hoàng Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0379866542', 'vuhoangcuong27@gmail.com', '2005-12-03', 'Nam', '219 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(326, 'KH-EBE8', 'individual', 'Đặng Tiến Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0369589941', 'dangtientung54@gmail.com', '2002-11-16', 'Nam', '116 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(327, 'KH-EA0C', 'individual', 'Nguyễn Thị Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0977897778', 'nguyenthioanh24@gmail.com', '1983-06-09', 'Nữ', '187 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(328, 'KH-797E', 'individual', 'Ngô Quang Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0330113901', 'ngoquangduc70@gmail.com', '2007-10-21', 'Nam', '338 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(329, 'KH-D261', 'individual', 'Mai Đức Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770350023', 'maiducdat52@gmail.com', '1991-02-23', 'Nam', '278 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(330, 'KH-F246', 'individual', 'Lê Ngọc Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884337616', 'lengoctrinh43@gmail.com', '1984-09-17', 'Nữ', '393 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(331, 'KH-C285', 'individual', 'Phạm Nhật Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349952085', 'phamnhathung28@gmail.com', '1987-11-24', 'Nam', '83 Đường Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(332, 'KH-2056', 'individual', 'Võ Xuân Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979766123', 'voxuankhoa38@gmail.com', '1991-05-16', 'Nam', '241 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(333, 'KH-B8D7', 'individual', 'Vũ Quang Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361613010', 'vuquangcuong84@gmail.com', '1991-10-06', 'Nam', '298 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(334, 'KH-7F5C', 'individual', 'Đỗ Hồng Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0705365723', 'dohonghoa99@gmail.com', '1985-08-16', 'Nữ', '389 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(335, 'KH-98D2', 'individual', 'Nguyễn Trọng Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389702646', 'nguyentrongdong89@gmail.com', '1998-09-24', 'Nam', '162 Đường Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(336, 'KH-E9BD', 'individual', 'Phan Xuân Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0784055981', 'phanxuancuong45@gmail.com', '1996-03-05', 'Nam', '64 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(337, 'KH-428B', 'individual', 'Phạm Khánh Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703546452', 'phamkhanhbinh49@gmail.com', '2006-04-02', 'Nam', '300 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(338, 'KH-A29B', 'individual', 'Đinh Cát Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0976404141', 'dinhcattruc17@gmail.com', '1980-06-09', 'Nữ', '67 Đường Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(339, 'KH-E67C', 'individual', 'Đinh Bảo Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913301134', 'dinhbaoquan27@gmail.com', '1985-10-05', 'Nam', '103 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(340, 'KH-09A7', 'individual', 'Võ Diệu Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703645265', 'vodieutuyet70@gmail.com', '1977-09-05', 'Nữ', '100 Đường Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(341, 'KH-4235', 'individual', 'Phạm Lan Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0786702306', 'phamlantrang50@gmail.com', '1979-05-09', 'Nữ', '306 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(342, 'KH-73C3', 'individual', 'Lâm Khánh Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985582153', 'lamkhanhdung83@gmail.com', '1982-03-16', 'Nữ', '327 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(343, 'KH-2671', 'individual', 'Lý Mạnh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355602465', 'lymanhson20@gmail.com', '2007-10-05', 'Nam', '8 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(344, 'KH-2F81', 'individual', 'Đinh Bích Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0837533515', 'dinhbichgiang71@gmail.com', '1999-11-17', 'Nữ', '338 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(345, 'KH-6F36', 'individual', 'Đinh Mai Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909068618', 'dinhmaiphuong49@gmail.com', '1996-06-02', 'Nữ', '43 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(346, 'KH-C797', 'individual', 'Vũ Thị Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820244119', 'vuthithao30@gmail.com', '1987-10-03', 'Nữ', '440 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(347, 'KH-0687', 'individual', 'Bùi Bích Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0819979308', 'buibichnhi56@gmail.com', '1985-08-30', 'Nữ', '277 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(348, 'KH-AEC1', 'individual', 'Đinh Khánh Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775136687', 'dinhkhanhlan99@gmail.com', '1993-05-23', 'Nữ', '64 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(349, 'KH-C3B8', 'individual', 'Đinh Quốc Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972127973', 'dinhquocminh83@gmail.com', '2003-02-10', 'Nam', '304 Đường Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(350, 'KH-424C', 'individual', 'Đặng Cẩm My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0853389551', 'dangcammy79@gmail.com', '2001-08-29', 'Nữ', '401 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(351, 'KH-C807', 'individual', 'Vũ Bảo Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360452968', 'vubaohai33@gmail.com', '1990-05-21', 'Nam', '396 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(352, 'KH-9C8B', 'individual', 'Lê Ngọc Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943484970', 'lengocnhi72@gmail.com', '1982-11-05', 'Nữ', '48 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(353, 'KH-4CC9', 'individual', 'Vũ Anh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838503933', 'vuanhson45@gmail.com', '1987-12-30', 'Nam', '26 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(354, 'KH-DBC3', 'individual', 'Đặng Như Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0362995609', 'dangnhulien84@gmail.com', '1991-04-13', 'Nữ', '427 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(355, 'KH-85C3', 'individual', 'Mai Quỳnh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818805190', 'maiquynhcuc21@gmail.com', '1976-09-21', 'Nữ', '203 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(356, 'KH-BBED', 'individual', 'Phan Quỳnh Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389017331', 'phanquynhthao72@gmail.com', '2007-12-24', 'Nữ', '425 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(357, 'KH-D12C', 'individual', 'Ngô Cẩm Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934888723', 'ngocamnhi72@gmail.com', '1979-07-23', 'Nữ', '49 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(358, 'KH-7798', 'individual', 'Phạm Đức Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0974058511', 'phamductuan19@gmail.com', '1983-01-29', 'Nam', '336 Đường Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(359, 'KH-BFB3', 'individual', 'Võ Lan My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0352577081', 'volanmy71@gmail.com', '1979-05-21', 'Nữ', '39 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(360, 'KH-ABE1', 'individual', 'Hồ Khánh Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370848428', 'hokhanhthu24@gmail.com', '1993-10-17', 'Nữ', '189 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(361, 'KH-75CB', 'individual', 'Dương Phương My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787970303', 'duongphuongmy74@gmail.com', '1981-10-29', 'Nữ', '79 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(362, 'KH-55AA', 'individual', 'Đỗ Khánh Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0396830083', 'dokhanhhuong81@gmail.com', '1997-03-02', 'Nữ', '216 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(363, 'KH-8818', 'individual', 'Mai Văn Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764223491', 'maivannam19@gmail.com', '1995-12-01', 'Nam', '96 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(364, 'KH-9859', 'individual', 'Hoàng Hoài Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946346760', 'hoanghoailinh41@gmail.com', '1982-11-01', 'Nữ', '328 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(365, 'KH-73A7', 'individual', 'Đinh Lan Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987149136', 'dinhlanhanh44@gmail.com', '1998-11-18', 'Nữ', '425 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(366, 'KH-8941', 'individual', 'Võ Hữu Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0978832997', 'vohuunam26@gmail.com', '1989-12-26', 'Nam', '359 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(367, 'KH-A811', 'individual', 'Đỗ Hữu Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845370974', 'dohuuhoang98@gmail.com', '1982-11-13', 'Nam', '86 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(368, 'KH-5E9B', 'individual', 'Huỳnh Hồng Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916536482', 'huynhhongthu36@gmail.com', '2006-07-21', 'Nữ', '102 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(369, 'KH-F953', 'individual', 'Phạm Cẩm Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0842897950', 'phamcamthao87@gmail.com', '1981-05-03', 'Nữ', '132 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(370, 'KH-4AE7', 'individual', 'Bùi Khánh Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381516583', 'buikhanhyen46@gmail.com', '1985-05-02', 'Nữ', '64 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(371, 'KH-C17B', 'individual', 'Lý Hồng Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0911073796', 'lyhongtruc51@gmail.com', '1987-06-03', 'Nữ', '363 Đường Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(372, 'KH-1284', 'individual', 'Phan Bảo Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901443942', 'phanbaotuan22@gmail.com', '1997-10-07', 'Nam', '151 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(373, 'KH-1AB1', 'individual', 'Đặng Thu Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0390842951', 'dangthudung45@gmail.com', '1990-11-16', 'Nữ', '297 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(374, 'KH-6A65', 'individual', 'Phùng Thảo Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389807433', 'phungthaodung98@gmail.com', '1996-12-15', 'Nữ', '2 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(375, 'KH-92F3', 'individual', 'Lý Bích Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363314218', 'lybichhoa31@gmail.com', '2004-09-24', 'Nữ', '424 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(376, 'KH-FCE7', 'individual', 'Vũ Cát Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904905690', 'vucatdung98@gmail.com', '2004-01-16', 'Nữ', '259 Đường Tôn Đức Thắng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(377, 'KH-84FE', 'individual', 'Hoàng Nhật Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942649781', 'hoangnhatphuc43@gmail.com', '1987-05-25', 'Nam', '231 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(378, 'KH-B489', 'individual', 'Phan Tiến Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0852395520', 'phantienthai25@gmail.com', '1988-04-17', 'Nam', '26 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(379, 'KH-8BF9', 'individual', 'Võ Cát Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342792565', 'vocatphuong24@gmail.com', '1983-08-18', 'Nữ', '262 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(380, 'KH-E990', 'individual', 'Trần Hoàng Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848698443', 'tranhoangdung72@gmail.com', '1976-10-04', 'Nam', '27 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(381, 'KH-A98B', 'individual', 'Hoàng Thành Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0969858516', 'hoangthanhhoang85@gmail.com', '1989-02-27', 'Nam', '43 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(382, 'KH-6FDA', 'individual', 'Huỳnh Khánh Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372230850', 'huynhkhanhoanh17@gmail.com', '1998-02-20', 'Nữ', '352 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(383, 'KH-F631', 'individual', 'Trần Hồng Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0347796898', 'tranhongtrinh45@gmail.com', '1996-03-09', 'Nữ', '365 Đường Đồng Khởi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(384, 'KH-1D90', 'individual', 'Ngô Quốc Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385955817', 'ngoquocbinh66@gmail.com', '1982-11-01', 'Nam', '267 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(385, 'KH-EC5D', 'individual', 'Đinh Tuyết Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0910983746', 'dinhtuyetphuong90@gmail.com', '1999-06-26', 'Nữ', '280 Đường Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(386, 'KH-D7BF', 'individual', 'Phạm Ngọc Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0846409492', 'phamngochuong48@gmail.com', '1987-10-08', 'Nữ', '112 Đường Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(387, 'KH-BC9F', 'individual', 'Đặng Hữu Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900023798', 'danghuuthinh67@gmail.com', '2006-07-22', 'Nam', '299 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(388, 'KH-758D', 'individual', 'Đinh Bích Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979083414', 'dinhbichthu45@gmail.com', '1976-11-25', 'Nữ', '211 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(389, 'KH-962D', 'individual', 'Dương Thị Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703938253', 'duongthiyen86@gmail.com', '1997-09-01', 'Nữ', '343 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(390, 'KH-8219', 'individual', 'Võ Tuấn Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0700414814', 'votuanbao44@gmail.com', '1975-06-26', 'Nam', '378 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(391, 'KH-6B71', 'individual', 'Mai Xuân Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0902264569', 'maixuanson65@gmail.com', '1976-04-21', 'Nam', '39 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(392, 'KH-5978', 'individual', 'Phùng Đức Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0918891516', 'phungducviet34@gmail.com', '1982-06-12', 'Nam', '134 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(393, 'KH-B2CD', 'individual', 'Vũ Minh Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0986684815', 'vuminhphuc83@gmail.com', '1986-03-30', 'Nam', '426 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(394, 'KH-0D0B', 'individual', 'Ngô Quang Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0794581442', 'ngoquangminh25@gmail.com', '1978-03-03', 'Nam', '73 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(395, 'KH-F81E', 'individual', 'Hoàng Phương Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338626665', 'hoangphuongha55@gmail.com', '1993-05-15', 'Nữ', '85 Đường Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(396, 'KH-15B7', 'individual', 'Đinh Bích Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0886624961', 'dinhbichthao51@gmail.com', '1993-11-30', 'Nữ', '316 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(397, 'KH-7CB9', 'individual', 'Võ Cát Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0795399053', 'vocatdao81@gmail.com', '1978-03-07', 'Nữ', '396 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(398, 'KH-F441', 'individual', 'Phùng Đức Lâm', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0937578261', 'phungduclam70@gmail.com', '2004-05-12', 'Nam', '11 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(399, 'KH-B3A2', 'individual', 'Hồ Thảo Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0788018628', 'hothaovy67@gmail.com', '1989-10-12', 'Nữ', '442 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(400, 'KH-786F', 'individual', 'Lý Minh Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0837301136', 'lyminhbao57@gmail.com', '1995-02-26', 'Nam', '115 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(401, 'KH-4B41', 'individual', 'Võ Thảo Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0849856644', 'vothaotrang57@gmail.com', '2003-12-25', 'Nữ', '384 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(402, 'KH-FC0B', 'individual', 'Huỳnh Thảo Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0767847617', 'huynhthaohang29@gmail.com', '2000-07-29', 'Nữ', '49 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(403, 'KH-8DE6', 'individual', 'Bùi Xuân Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907518147', 'buixuangiang18@gmail.com', '1981-08-06', 'Nam', '437 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(404, 'KH-D3AA', 'individual', 'Mai Tuấn Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942326032', 'maituankhanh39@gmail.com', '1986-03-23', 'Nam', '355 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(405, 'KH-F654', 'individual', 'Phùng Hoài Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981160256', 'phunghoainhi88@gmail.com', '1996-04-13', 'Nữ', '220 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(406, 'KH-0CD3', 'individual', 'Đỗ Duy Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0709123783', 'doduyduc26@gmail.com', '1986-02-11', 'Nam', '350 Đường Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(407, 'KH-ED75', 'individual', 'Bùi Hồng Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0382417755', 'buihonglien98@gmail.com', '1979-05-09', 'Nữ', '328 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(408, 'KH-D373', 'individual', 'Võ Hữu Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380055979', 'vohuuhoang84@gmail.com', '1978-08-01', 'Nam', '301 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(409, 'KH-B90C', 'individual', 'Phan Mai Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324593143', 'phanmaituyet51@gmail.com', '2008-01-02', 'Nữ', '187 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(410, 'KH-2A5B', 'individual', 'Đinh Hữu Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916469838', 'dinhhuuanh89@gmail.com', '2000-03-01', 'Nam', '322 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(411, 'KH-0F43', 'individual', 'Phan Thảo Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909260225', 'phanthaoyen55@gmail.com', '1975-10-04', 'Nữ', '189 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(412, 'KH-84C7', 'individual', 'Bùi Hoài Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770279606', 'buihoaitrang54@gmail.com', '2003-07-26', 'Nữ', '355 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(413, 'KH-24DB', 'individual', 'Phan Thảo Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0700154026', 'phanthaophuong30@gmail.com', '1996-10-02', 'Nữ', '224 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(414, 'KH-11ED', 'individual', 'Võ Khánh Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777790561', 'vokhanhtuyen33@gmail.com', '1997-05-17', 'Nữ', '284 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(415, 'KH-8CF3', 'individual', 'Đỗ Cẩm Hằng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0820176252', 'docamhang28@gmail.com', '1992-08-28', 'Nữ', '231 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(416, 'KH-BCA8', 'individual', 'Dương Minh Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818272766', 'duongminhquan95@gmail.com', '2000-02-25', 'Nam', '266 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(417, 'KH-A7A9', 'individual', 'Vũ Trọng Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359956419', 'vutrongbinh46@gmail.com', '1976-03-13', 'Nam', '439 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(418, 'KH-3420', 'individual', 'Lâm Quang Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770054609', 'lamquangbao29@gmail.com', '2007-10-25', 'Nam', '114 Đường Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(419, 'KH-56AF', 'individual', 'Bùi Hồng An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0336000451', 'buihongan53@gmail.com', '2000-07-16', 'Nữ', '240 Đường Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(420, 'KH-19D6', 'individual', 'Ngô Cẩm Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383011544', 'ngocamoanh42@gmail.com', '1992-09-15', 'Nữ', '372 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(421, 'KH-9972', 'individual', 'Phùng Thu Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0909774929', 'phungthuoanh40@gmail.com', '2000-03-20', 'Nữ', '352 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(422, 'KH-2E51', 'individual', 'Mai Minh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856914405', 'maiminhnam40@gmail.com', '1976-10-28', 'Nam', '441 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(423, 'KH-8A23', 'individual', 'Phùng Lan Vân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385197805', 'phunglanvan51@gmail.com', '1998-04-06', 'Nữ', '450 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(424, 'KH-1EB6', 'individual', 'Phùng Bích Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0937252280', 'phungbichha49@gmail.com', '1983-05-31', 'Nữ', '165 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(425, 'KH-D32C', 'individual', 'Đinh Hồng Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0948329049', 'dinhhongtuyen63@gmail.com', '1983-05-09', 'Nữ', '141 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(426, 'KH-4C5C', 'individual', 'Lý Hữu Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0822068569', 'lyhuuvinh88@gmail.com', '1997-09-20', 'Nam', '43 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(427, 'KH-706B', 'individual', 'Đinh Khánh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0374018042', 'dinhkhanhviet62@gmail.com', '1985-05-27', 'Nam', '266 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(428, 'KH-C496', 'individual', 'Đặng Tuấn Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0830008010', 'dangtuandat89@gmail.com', '1999-01-15', 'Nam', '139 Đường Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(429, 'KH-B67D', 'individual', 'Lý Phương Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0977676717', 'lyphuongvy37@gmail.com', '2002-09-22', 'Nữ', '387 Đường Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(430, 'KH-41F7', 'individual', 'Phùng Thảo Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383135235', 'phungthaogiang63@gmail.com', '1999-07-29', 'Nữ', '183 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(431, 'KH-87A0', 'individual', 'Đỗ Thành Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972203532', 'dothanhson65@gmail.com', '1998-01-18', 'Nam', '182 Đường Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(432, 'KH-4600', 'individual', 'Bùi Thị Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0812024213', 'buithitruc25@gmail.com', '1982-10-08', 'Nữ', '219 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(433, 'KH-4F3E', 'individual', 'Mai Duy Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930502584', 'maiduytrung62@gmail.com', '1982-03-26', 'Nam', '397 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(434, 'KH-6D3A', 'individual', 'Trần Quang Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0764246845', 'tranquanganh86@gmail.com', '1991-12-15', 'Nam', '107 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(435, 'KH-39FC', 'individual', 'Nguyễn Hồng Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342592270', 'nguyenhongchi37@gmail.com', '1989-01-10', 'Nữ', '113 Đường Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(436, 'KH-AB77', 'individual', 'Đặng Khánh Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0797839005', 'dangkhanhmai34@gmail.com', '1994-04-01', 'Nữ', '392 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(437, 'KH-659C', 'individual', 'Vũ Khánh Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856936182', 'vukhanhphuong34@gmail.com', '1977-05-05', 'Nữ', '313 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(438, 'KH-E3C9', 'individual', 'Đỗ Hoài Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0880671366', 'dohoaidao72@gmail.com', '2005-04-19', 'Nữ', '39 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(439, 'KH-C977', 'individual', 'Đinh Hữu Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779599574', 'dinhhuuthai27@gmail.com', '1990-07-16', 'Nam', '209 Đường Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(440, 'KH-2853', 'individual', 'Đặng Thành Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0774329089', 'dangthanhlong50@gmail.com', '2001-05-13', 'Nam', '439 Đường Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(441, 'KH-7012', 'individual', 'Nguyễn Tuyết Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0915127690', 'nguyentuyetmai17@gmail.com', '1982-03-11', 'Nữ', '249 Đường Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(442, 'KH-0946', 'individual', 'Lâm Cát Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361048542', 'lamcatlan93@gmail.com', '2003-06-23', 'Nữ', '107 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(443, 'KH-6931', 'individual', 'Bùi Khánh Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931803006', 'buikhanhphuong30@gmail.com', '2001-12-14', 'Nữ', '274 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(444, 'KH-6D04', 'individual', 'Trần Cát Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787083188', 'trancatyen63@gmail.com', '1992-05-21', 'Nữ', '10 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(445, 'KH-E85B', 'individual', 'Hoàng Khánh Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938110217', 'hoangkhanhlinh93@gmail.com', '1978-11-21', 'Nữ', '424 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(446, 'KH-7CF6', 'individual', 'Lâm Lan Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889178315', 'lamlanlan28@gmail.com', '1994-11-17', 'Nữ', '78 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(447, 'KH-B793', 'individual', 'Đinh Hoàng Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0703335281', 'dinhhoangphong85@gmail.com', '1980-06-15', 'Nam', '235 Đường Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(448, 'KH-E0E8', 'individual', 'Võ Bích Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0979749370', 'vobichhuong40@gmail.com', '2004-10-07', 'Nữ', '412 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(449, 'KH-17B6', 'individual', 'Đặng Tuấn Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0380314961', 'dangtuancuong26@gmail.com', '1989-05-23', 'Nam', '404 Đường Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(450, 'KH-24DE', 'individual', 'Lê Như Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385288686', 'lenhutrinh13@gmail.com', '2001-12-02', 'Nữ', '284 Đường Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(451, 'KH-381B', 'individual', 'Phan Hoàng Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363632040', 'phanhoangcuong32@gmail.com', '1990-06-20', 'Nam', '60 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(452, 'KH-0706', 'individual', 'Lê Cẩm Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0839798427', 'lecamtruc31@gmail.com', '1979-01-16', 'Nữ', '352 Đường Bùi Thị Xuân, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(453, 'KH-6C38', 'individual', 'Ngô Văn Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394822674', 'ngovanhai80@gmail.com', '1990-12-10', 'Nam', '228 Đường Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(454, 'KH-B70F', 'individual', 'Phạm Tuyết Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0348971498', 'phamtuyetcuc47@gmail.com', '1996-02-04', 'Nữ', '246 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(455, 'KH-BBA5', 'individual', 'Hồ Anh Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0984563006', 'hoanhduc73@gmail.com', '1989-06-05', 'Nam', '210 Đường Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(456, 'KH-ED03', 'individual', 'Nguyễn Duy Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0835645541', 'nguyenduybao90@gmail.com', '2006-05-18', 'Nam', '77 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(457, 'KH-E3B9', 'individual', 'Lê Tuấn Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968097763', 'letuanvinh13@gmail.com', '2003-10-05', 'Nam', '336 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(458, 'KH-CB3C', 'individual', 'Phan Phương Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360262654', 'phanphuongquynh22@gmail.com', '1979-08-30', 'Nữ', '306 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(459, 'KH-F5A1', 'individual', 'Đỗ Thảo Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831818324', 'dothaotrinh56@gmail.com', '2003-07-18', 'Nữ', '296 Đường Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(460, 'KH-B8EE', 'individual', 'Mai Thị Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0766675693', 'maithimai81@gmail.com', '1997-05-20', 'Nữ', '65 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(461, 'KH-92CB', 'individual', 'Lê Xuân Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0779822518', 'lexuanhai31@gmail.com', '1992-06-23', 'Nam', '384 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(462, 'KH-D3B5', 'individual', 'Đỗ Hồng Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358488952', 'dohongmai20@gmail.com', '2000-05-19', 'Nữ', '92 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(463, 'KH-A2DF', 'individual', 'Võ Bảo Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340793366', 'vobaotrung69@gmail.com', '1986-10-30', 'Nam', '178 Đường Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(464, 'KH-2F27', 'individual', 'Phùng Cẩm Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783379855', 'phungcamngoc47@gmail.com', '1993-09-14', 'Nữ', '151 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(465, 'KH-2DDD', 'individual', 'Đỗ Minh Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946314809', 'dominhtrung91@gmail.com', '1994-06-04', 'Nam', '5 Đường Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(466, 'KH-36B4', 'individual', 'Võ Minh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0960125430', 'vominhson15@gmail.com', '1986-01-04', 'Nam', '136 Đường Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(467, 'KH-C07C', 'individual', 'Lê Cẩm Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0914108078', 'lecamcuc80@gmail.com', '2000-02-02', 'Nữ', '147 Đường Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(468, 'KH-D6D7', 'individual', 'Hồ Phương Liên', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0984776191', 'hophuonglien85@gmail.com', '2007-10-24', 'Nữ', '233 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(469, 'KH-7374', 'individual', 'Võ Tiến Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0854608390', 'votientung81@gmail.com', '1980-12-31', 'Nam', '328 Đường Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(470, 'KH-370B', 'individual', 'Phùng Hoài Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943008075', 'phunghoailan99@gmail.com', '1995-08-17', 'Nữ', '169 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(471, 'KH-0879', 'individual', 'Phan Hoàng Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789876785', 'phanhoangthinh72@gmail.com', '1982-03-20', 'Nam', '200 Đường Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(472, 'KH-A22A', 'individual', 'Phạm Cẩm Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0360203055', 'phamcamdao90@gmail.com', '1989-08-30', 'Nữ', '327 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(473, 'KH-B157', 'individual', 'Ngô Tuấn Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0334792619', 'ngotuandong86@gmail.com', '1981-01-20', 'Nam', '210 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(474, 'KH-8117', 'individual', 'Dương Văn Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943929573', 'duongvanphuc44@gmail.com', '1982-02-28', 'Nam', '438 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(475, 'KH-8347', 'individual', 'Hoàng Văn Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0771133288', 'hoangvanthai75@gmail.com', '1985-05-10', 'Nam', '190 Đường Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(476, 'KH-DF0D', 'individual', 'Hoàng Nhật Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0762018012', 'hoangnhatkhoa66@gmail.com', '1995-04-28', 'Nam', '233 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(477, 'KH-A5A0', 'individual', 'Hồ Quốc Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0799288951', 'hoquocdung80@gmail.com', '1986-11-22', 'Nam', '64 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(478, 'KH-9C8E', 'individual', 'Hoàng Thành Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785983672', 'hoangthanhgiang67@gmail.com', '2006-07-20', 'Nam', '45 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(479, 'KH-0D94', 'individual', 'Võ Khánh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383276798', 'vokhanhviet56@gmail.com', '1996-07-10', 'Nam', '342 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(480, 'KH-2AE6', 'individual', 'Đỗ Thành Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0342623024', 'dothanhduc32@gmail.com', '1988-07-13', 'Nam', '284 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(481, 'KH-9445', 'individual', 'Bùi Cát Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0370807447', 'buicatthu45@gmail.com', '1983-11-03', 'Nữ', '3 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(482, 'KH-3F2C', 'individual', 'Hoàng Hồng Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331693502', 'hoanghongphuong76@gmail.com', '1984-09-11', 'Nữ', '266 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(483, 'KH-B9EB', 'individual', 'Lê Cát Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0840196979', 'lecatphuong83@gmail.com', '1991-05-02', 'Nữ', '441 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(484, 'KH-A507', 'individual', 'Ngô Bích Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376491270', 'ngobichtrinh38@gmail.com', '2004-12-30', 'Nữ', '11 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(485, 'KH-D692', 'individual', 'Hồ Bích Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828799945', 'hobichvy13@gmail.com', '1977-07-17', 'Nữ', '394 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(486, 'KH-5E98', 'individual', 'Vũ Khánh Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0930762310', 'vukhanhtan46@gmail.com', '1981-05-04', 'Nam', '107 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(487, 'KH-C67C', 'individual', 'Lâm Quang Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0322231901', 'lamquanghoang30@gmail.com', '1980-09-02', 'Nam', '14 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(488, 'KH-B358', 'individual', 'Vũ Như Tuyền', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821384446', 'vunhutuyen33@gmail.com', '1975-10-08', 'Nữ', '247 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(489, 'KH-5A13', 'individual', 'Trần Tuyết Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0908771116', 'trantuyetha45@gmail.com', '2000-02-13', 'Nữ', '336 Đường Hai Bà Trưng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(490, 'KH-74E2', 'individual', 'Đỗ Quang Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0367854606', 'doquangduc50@gmail.com', '2003-09-22', 'Nam', '14 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(491, 'KH-304E', 'individual', 'Hồ Anh Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987172262', 'hoanhhung24@gmail.com', '1977-09-01', 'Nam', '218 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(492, 'KH-3959', 'individual', 'Bùi Ngọc Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777639312', 'buingocquynh78@gmail.com', '1992-07-03', 'Nữ', '381 Đường Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(493, 'KH-FEEA', 'individual', 'Dương Cẩm Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0797216074', 'duongcamoanh41@gmail.com', '1990-05-03', 'Nữ', '134 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(494, 'KH-CCD9', 'individual', 'Bùi Bảo Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884251029', 'buibaotan79@gmail.com', '1987-08-23', 'Nam', '264 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(495, 'KH-5004', 'individual', 'Võ Mai Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0393010636', 'vomaitruc82@gmail.com', '2006-06-01', 'Nữ', '318 Đường Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(496, 'KH-2C05', 'individual', 'Trần Hoài Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0792700158', 'tranhoaitrang39@gmail.com', '1998-07-11', 'Nữ', '201 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(497, 'KH-6BC0', 'individual', 'Đỗ Nhật Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0395786334', 'donhatviet84@gmail.com', '2000-03-31', 'Nam', '244 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(498, 'KH-4C78', 'individual', 'Huỳnh Bích Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0844234658', 'huynhbichtuyet18@gmail.com', '2006-12-29', 'Nữ', '376 Đường Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(499, 'KH-E6AE', 'individual', 'Lý Tuyết Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0708932860', 'lytuyetdao57@gmail.com', '2006-10-12', 'Nữ', '165 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(500, 'KH-1E5D', 'individual', 'Phùng Cát Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828139195', 'phungcathuong35@gmail.com', '2002-12-22', 'Nữ', '423 Đường Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(501, 'KH-57C9', 'individual', 'Phạm Tuấn Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0931376910', 'phamtuanviet26@gmail.com', '1980-11-27', 'Nam', '337 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(502, 'KH-54D9', 'individual', 'Nguyễn Thị Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768291757', 'nguyenthianh27@gmail.com', '1991-06-19', 'Nữ', '403 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(503, 'KH-DB83', 'individual', 'Đinh Hoàng Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0917856298', 'dinhhoangtien35@gmail.com', '1993-09-21', 'Nam', '128 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(504, 'KH-E441', 'individual', 'Phan Tuấn Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0384188131', 'phantuantuan12@gmail.com', '2004-05-03', 'Nam', '270 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(505, 'KH-D123', 'individual', 'Phạm Quang Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0384780195', 'phamquangduc14@gmail.com', '1984-04-11', 'Nam', '272 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(506, 'KH-46C5', 'individual', 'Lý Duy Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783271731', 'lyduytien32@gmail.com', '1978-04-26', 'Nam', '149 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(507, 'KH-E514', 'individual', 'Nguyễn Quang Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350715412', 'nguyenquangnam63@gmail.com', '2006-02-28', 'Nam', '227 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(508, 'KH-8A16', 'individual', 'Lâm Xuân Dũng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0336184326', 'lamxuandung34@gmail.com', '1982-04-17', 'Nam', '76 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(509, 'KH-AF74', 'individual', 'Phạm Duy Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0828992594', 'phamduytrung50@gmail.com', '1976-06-15', 'Nam', '97 Đường Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(510, 'KH-38A6', 'individual', 'Ngô Quỳnh Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0982702288', 'ngoquynhcuc16@gmail.com', '2007-05-08', 'Nữ', '224 Đường Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(511, 'KH-72B4', 'individual', 'Hồ Mạnh Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0883881951', 'homanhthinh33@gmail.com', '1984-04-04', 'Nam', '137 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(512, 'KH-B87B', 'individual', 'Võ Bích Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0347416684', 'vobichvy93@gmail.com', '1996-03-09', 'Nữ', '443 Đường Cách Mạng Tháng Tám, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(513, 'KH-A193', 'individual', 'Lý Khánh Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0388409814', 'lykhanhtrung14@gmail.com', '1977-01-04', 'Nam', '428 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(514, 'KH-1EB0', 'individual', 'Mai Trọng Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845650308', 'maitrongtrung59@gmail.com', '2002-02-14', 'Nam', '42 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(515, 'KH-60F4', 'individual', 'Đặng Hữu Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0368079162', 'danghuudong36@gmail.com', '1994-01-30', 'Nam', '190 Đường Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(516, 'KH-ED83', 'individual', 'Đặng Anh Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0941859056', 'danganhminh43@gmail.com', '1990-10-11', 'Nam', '216 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(517, 'KH-F127', 'individual', 'Vũ Mạnh Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383333856', 'vumanhtuan12@gmail.com', '2008-04-16', 'Nam', '380 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(518, 'KH-8D48', 'individual', 'Đỗ Hồng Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833915645', 'dohongthu42@gmail.com', '1976-09-26', 'Nữ', '249 Đường Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(519, 'KH-EE57', 'individual', 'Hoàng Thảo Linh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783456156', 'hoangthaolinh76@gmail.com', '1986-04-24', 'Nữ', '314 Đường Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(520, 'KH-0A22', 'individual', 'Bùi Hữu Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0354987449', 'buihuukhoa26@gmail.com', '1992-12-28', 'Nam', '209 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(521, 'KH-CA26', 'individual', 'Dương Hoài Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962169660', 'duonghoaiphuong48@gmail.com', '1976-05-01', 'Nữ', '448 Đường Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(522, 'KH-03D2', 'individual', 'Hồ Xuân Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353867434', 'hoxuantuan46@gmail.com', '1982-11-29', 'Nam', '241 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(523, 'KH-ED2B', 'individual', 'Lâm Xuân Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0336147100', 'lamxuanviet15@gmail.com', '1990-10-20', 'Nam', '64 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(524, 'KH-9221', 'individual', 'Phùng Lan Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901035584', 'phunglanhanh68@gmail.com', '1992-10-23', 'Nữ', '378 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(525, 'KH-5235', 'individual', 'Lý Quỳnh Hương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0389571118', 'lyquynhhuong41@gmail.com', '1984-01-08', 'Nữ', '401 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(526, 'KH-910D', 'individual', 'Mai Tuấn Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335329408', 'maituanlong87@gmail.com', '2000-06-29', 'Nam', '219 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(527, 'KH-0B01', 'individual', 'Lê Mạnh Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0381001515', 'lemanhminh32@gmail.com', '1995-04-02', 'Nam', '16 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(528, 'KH-D16D', 'individual', 'Đinh Hoàng Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783988103', 'dinhhoangkhoa52@gmail.com', '1986-12-25', 'Nam', '242 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(529, 'KH-448F', 'individual', 'Ngô Quốc Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968286748', 'ngoquocvinh53@gmail.com', '1998-01-28', 'Nam', '116 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(530, 'KH-F696', 'individual', 'Trần Hoài Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0324943381', 'tranhoaianh47@gmail.com', '1979-04-22', 'Nữ', '56 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(531, 'KH-FF90', 'individual', 'Đỗ Bích Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981621930', 'dobichoanh38@gmail.com', '1983-10-30', 'Nữ', '369 Đường Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(532, 'KH-F1A8', 'individual', 'Võ Quỳnh Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0775515616', 'voquynhvy30@gmail.com', '1984-09-08', 'Nữ', '328 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(533, 'KH-441B', 'individual', 'Đinh Anh Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907301022', 'dinhanhtan57@gmail.com', '2006-12-07', 'Nam', '6 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(534, 'KH-C768', 'individual', 'Ngô Nhật Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972439208', 'ngonhatbao87@gmail.com', '1998-01-03', 'Nam', '115 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(535, 'KH-B98D', 'individual', 'Dương Như Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0760775898', 'duongnhugiang47@gmail.com', '1996-12-05', 'Nữ', '280 Đường Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(536, 'KH-C6DE', 'individual', 'Lê Hồng Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0916310614', 'lehongthao48@gmail.com', '1988-09-26', 'Nữ', '394 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(537, 'KH-FE87', 'individual', 'Phan Bảo Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0816145301', 'phanbaovinh34@gmail.com', '2000-11-14', 'Nam', '293 Đường Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(538, 'KH-3410', 'individual', 'Phan Khánh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0782314088', 'phankhanhhuy25@gmail.com', '2003-03-29', 'Nam', '307 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(539, 'KH-FEF8', 'individual', 'Bùi Quốc Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0936727876', 'buiquocphuc95@gmail.com', '1980-03-09', 'Nam', '431 Đường Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(540, 'KH-9042', 'individual', 'Vũ Xuân Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0905546618', 'vuxuantuan95@gmail.com', '1989-10-15', 'Nam', '315 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(541, 'KH-28F9', 'individual', 'Nguyễn Phương Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353777401', 'nguyenphuongyen59@gmail.com', '1977-02-09', 'Nữ', '12 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(542, 'KH-E73B', 'individual', 'Ngô Xuân Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0339908940', 'ngoxuankhanh54@gmail.com', '1976-08-11', 'Nam', '378 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(543, 'KH-6C02', 'individual', 'Đặng Khánh Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0810801834', 'dangkhanhnhi50@gmail.com', '1993-09-08', 'Nữ', '5 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(544, 'KH-03A9', 'individual', 'Huỳnh Cẩm Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0854088767', 'huynhcamcuc13@gmail.com', '1982-06-04', 'Nữ', '279 Đường Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(545, 'KH-F063', 'individual', 'Phan Ngọc Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0359054235', 'phanngocdao87@gmail.com', '1978-01-28', 'Nữ', '275 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(546, 'KH-28BD', 'individual', 'Huỳnh Bích An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821621381', 'huynhbichan88@gmail.com', '1979-03-22', 'Nữ', '367 Đường Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(547, 'KH-EB12', 'individual', 'Lý Quang Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882967482', 'lyquangbinh77@gmail.com', '2002-03-05', 'Nam', '437 Đường Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(548, 'KH-A462', 'individual', 'Mai Quang Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0941732269', 'maiquanghai57@gmail.com', '1994-08-09', 'Nam', '25 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(549, 'KH-A96C', 'individual', 'Phan Đức Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0377608121', 'phanductien78@gmail.com', '1994-03-27', 'Nam', '75 Đường Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(550, 'KH-68BF', 'individual', 'Hoàng Thảo Cúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0377731282', 'hoangthaocuc41@gmail.com', '1978-09-21', 'Nữ', '185 Đường Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(551, 'KH-6344', 'individual', 'Vũ Cát Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776669404', 'vucatquynh71@gmail.com', '1994-01-07', 'Nữ', '343 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(552, 'KH-9167', 'individual', 'Đinh Quỳnh Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340922690', 'dinhquynhthao87@gmail.com', '1991-02-19', 'Nữ', '140 Đường Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(553, 'KH-316A', 'individual', 'Đặng Tuấn Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0971769045', 'dangtuanviet40@gmail.com', '2003-07-04', 'Nam', '226 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(554, 'KH-0D8D', 'individual', 'Vũ Hoài Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972450070', 'vuhoainhi65@gmail.com', '1982-07-12', 'Nữ', '70 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(555, 'KH-9789', 'individual', 'Ngô Khánh Quang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0989477013', 'ngokhanhquang94@gmail.com', '1977-09-29', 'Nam', '166 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(556, 'KH-8B2C', 'individual', 'Đặng Ngọc Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0936577625', 'dangngocmai25@gmail.com', '2003-05-02', 'Nữ', '385 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(557, 'KH-53C5', 'individual', 'Đinh Ngọc Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0981936914', 'dinhngocngoc67@gmail.com', '1983-07-28', 'Nữ', '102 Đường Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(558, 'KH-040F', 'individual', 'Đặng Bảo Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0855119236', 'dangbaohung89@gmail.com', '2001-05-29', 'Nam', '311 Đường Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(559, 'KH-3346', 'individual', 'Nguyễn Bích Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0707222135', 'nguyenbichvy97@gmail.com', '1995-07-19', 'Nữ', '107 Đường Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(560, 'KH-892F', 'individual', 'Mai Anh Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394057160', 'maianhcuong13@gmail.com', '1993-11-16', 'Nam', '437 Đường Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(561, 'KH-FA2B', 'individual', 'Đinh Bích Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0836439215', 'dinhbichthu58@gmail.com', '1992-05-03', 'Nữ', '62 Đường Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(562, 'KH-FB4A', 'individual', 'Trần Khánh Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0939292422', 'trankhanhlan12@gmail.com', '1999-06-25', 'Nữ', '195 Đường Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(563, 'KH-E27A', 'individual', 'Lý Tuấn Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0345753143', 'lytuankiet93@gmail.com', '1982-03-24', 'Nam', '420 Đường Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(564, 'KH-0BEA', 'individual', 'Nguyễn Mạnh Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0943132258', 'nguyenmanhson22@gmail.com', '1997-03-10', 'Nam', '45 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(565, 'KH-09FC', 'individual', 'Phan Bích Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0326385159', 'phanbichphuong45@gmail.com', '1978-12-19', 'Nữ', '119 Đường Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(566, 'KH-E132', 'individual', 'Trần Hữu Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361911552', 'tranhuuhoang12@gmail.com', '1999-06-19', 'Nam', '296 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(567, 'KH-9977', 'individual', 'Lý Đức Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0913320003', 'lyducvinh47@gmail.com', '1978-01-13', 'Nam', '425 Đường Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(568, 'KH-D372', 'individual', 'Hoàng Ngọc Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0972463395', 'hoangngoctrinh48@gmail.com', '1987-05-21', 'Nữ', '364 Đường Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(569, 'KH-45A2', 'individual', 'Vũ Thảo Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0968768531', 'vuthaohanh10@gmail.com', '1995-10-03', 'Nữ', '44 Đường Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(570, 'KH-8A80', 'individual', 'Phạm Minh Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0369317635', 'phamminhphong94@gmail.com', '2007-11-20', 'Nam', '414 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(571, 'KH-14E8', 'individual', 'Đặng Bích Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0358078776', 'dangbichha61@gmail.com', '2001-12-24', 'Nữ', '337 Đường Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(572, 'KH-1190', 'individual', 'Huỳnh Nhật Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0984287369', 'huynhnhatphong15@gmail.com', '2005-05-21', 'Nam', '406 Đường Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(573, 'KH-390B', 'individual', 'Vũ Như Đào', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0829619381', 'vunhudao92@gmail.com', '2003-02-21', 'Nữ', '118 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(574, 'KH-1E23', 'individual', 'Đinh Tuyết Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0343025838', 'dinhtuyetvy15@gmail.com', '1995-02-02', 'Nữ', '198 Đường Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(575, 'KH-1CF4', 'individual', 'Đặng Đức Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0821674077', 'dangductrung44@gmail.com', '1988-02-11', 'Nam', '47 Đường Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(576, 'KH-E7AB', 'individual', 'Vũ Phương Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0338417851', 'vuphuongoanh39@gmail.com', '1998-01-21', 'Nữ', '379 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(577, 'KH-1D2F', 'individual', 'Phạm Bảo Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361351168', 'phambaodong48@gmail.com', '1998-08-15', 'Nam', '213 Đường Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(578, 'KH-3987', 'individual', 'Phùng Quang Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0330917936', 'phungquangduc63@gmail.com', '1994-05-20', 'Nam', '415 Đường Nguyễn Trãi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(579, 'KH-B4EB', 'individual', 'Đỗ Mai Yến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0383381938', 'domaiyen55@gmail.com', '1979-01-14', 'Nữ', '317 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(580, 'KH-CC83', 'individual', 'Lê Tuyết My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0773782386', 'letuyetmy67@gmail.com', '1990-09-13', 'Nữ', '8 Đường Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(581, 'KH-B067', 'individual', 'Bùi Văn Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904789854', 'buivankhoa43@gmail.com', '1991-06-10', 'Nam', '263 Đường Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(582, 'KH-5434', 'individual', 'Đặng Hoài Quỳnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0813327900', 'danghoaiquynh87@gmail.com', '2003-07-14', 'Nữ', '327 Đường Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(583, 'KH-989F', 'individual', 'Dương Thu Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0705890915', 'duongthutuyet43@gmail.com', '2003-05-13', 'Nữ', '174 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(584, 'KH-9B78', 'individual', 'Ngô Văn Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0962902851', 'ngovanthinh75@gmail.com', '1978-12-15', 'Nam', '235 Đường Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(585, 'KH-1B54', 'individual', 'Lê Diệu Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0769702451', 'ledieungoc93@gmail.com', '1995-09-15', 'Nữ', '245 Đường Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(586, 'KH-85E6', 'individual', 'Lê Quốc Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0982862373', 'lequocson37@gmail.com', '2006-07-17', 'Nam', '448 Đường Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(587, 'KH-28B2', 'individual', 'Lê Tiến Đạt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0917700048', 'letiendat96@gmail.com', '1990-10-07', 'Nam', '370 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(588, 'KH-BE64', 'individual', 'Hoàng Mạnh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889621807', 'hoangmanhtung51@gmail.com', '1983-10-09', 'Nam', '392 Đường Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(589, 'KH-0FA8', 'individual', 'Hoàng Phương Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0902989608', 'hoangphuongoanh49@gmail.com', '1984-11-19', 'Nữ', '210 Đường Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(590, 'KH-3974', 'individual', 'Phan Tuyết Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0856639382', 'phantuyetthu67@gmail.com', '2007-12-08', 'Nữ', '220 Đường Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(591, 'KH-8C4F', 'individual', 'Trần Mai My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0350543806', 'tranmaimy26@gmail.com', '2006-11-11', 'Nữ', '9 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(592, 'KH-8582', 'individual', 'Vũ Tuyết Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0374522698', 'vutuyettruc74@gmail.com', '1980-04-30', 'Nữ', '191 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(593, 'KH-51FB', 'individual', 'Đỗ Tuấn Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0399115145', 'dotuanviet96@gmail.com', '1993-12-15', 'Nam', '284 Đường Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(594, 'KH-1A17', 'individual', 'Huỳnh Quang Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0886843223', 'huynhquangnam90@gmail.com', '1980-01-22', 'Nam', '118 Đường Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(595, 'KH-523A', 'individual', 'Lê Quang Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776776953', 'lequangbao19@gmail.com', '2007-11-01', 'Nam', '179 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(596, 'KH-929B', 'individual', 'Đặng Hữu Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0378531490', 'danghuukhoa76@gmail.com', '1999-11-02', 'Nam', '202 Đường Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(597, 'KH-F99C', 'individual', 'Phan Mạnh Minh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333877866', 'phanmanhminh67@gmail.com', '1979-04-15', 'Nam', '208 Đường Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(598, 'KH-B0CA', 'individual', 'Dương Ngọc An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0942060476', 'duongngocan84@gmail.com', '2006-02-14', 'Nữ', '105 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(599, 'KH-DC7B', 'individual', 'Ngô Trọng Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987662248', 'ngotrongtung90@gmail.com', '1989-01-04', 'Nam', '34 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(600, 'KH-67D4', 'individual', 'Lý Hoàng Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373671049', 'lyhoanghoang29@gmail.com', '1997-05-21', 'Nam', '343 Đường Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(601, 'KH-FF26', 'individual', 'Dương Cẩm Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0978247686', 'duongcamphuong46@gmail.com', '1994-11-20', 'Nữ', '394 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(602, 'KH-BA81', 'individual', 'Lê Tuấn Cường', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375519757', 'letuancuong36@gmail.com', '2005-11-20', 'Nam', '336 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(603, 'KH-B68E', 'individual', 'Võ Mạnh Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0398559460', 'vomanhthinh48@gmail.com', '1989-06-11', 'Nam', '344 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(604, 'KH-4BC6', 'individual', 'Phan Cẩm Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0830205119', 'phancammai13@gmail.com', '1999-06-03', 'Nữ', '84 Đường Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(605, 'KH-21DB', 'individual', 'Lê Cát Trinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0973292545', 'lecattrinh90@gmail.com', '1993-12-09', 'Nữ', '358 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(606, 'KH-D3CD', 'individual', 'Đỗ Đức Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0850509489', 'doduchung80@gmail.com', '1986-06-03', 'Nam', '443 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(607, 'KH-1B8E', 'business', 'Hợp tác xã Thái Bình Dương', 'Hợp tác xã Thái Bình Dương', '0657790477', 'Đỗ Quốc Tiến', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0243342786', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Thái Bình Dương Tower, 183 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(608, 'KH-8BA5', 'business', 'Hợp tác xã Đại Việt', 'Hợp tác xã Đại Việt', '0329695792', 'Lê Phương Hà', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0243064533', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Đại Việt Tower, 41 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(609, 'KH-5961', 'business', 'Doanh nghiệp Tư nhân Tân Á', 'Doanh nghiệp Tư nhân Tân Á', '0357477596', 'Lý Minh Giang', 'https://tana.com.vn', 'NNT đang hoạt động', '0243810710', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Tân Á Tower, 72 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(610, 'KH-B7B4', 'business', 'Tập đoàn Vinh Quang Năng lượng', 'Tập đoàn Vinh Quang Năng lượng', '0720210333', 'Phùng Văn Dũng', 'https://vinhquang.com.vn', 'Tạm ngưng', '0283438066', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Vinh Quang Tower, 147 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(611, 'KH-3DA1', 'business', 'Công ty TNHH Sông Hồng', 'Công ty TNHH Sông Hồng', '0467414254', 'Hoàng Quang Sơn', 'https://songhong.com.vn', 'Đang hoạt động', '0969136805', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Sông Hồng Tower, 26 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(612, 'KH-A11E', 'business', 'Doanh nghiệp Tư nhân Khải Hoàn', 'Doanh nghiệp Tư nhân Khải Hoàn', '0785146747', 'Đặng Bích Phương', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0938658878', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Khải Hoàn Tower, 189 Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(613, 'KH-49C0', 'business', 'Tập đoàn Hoàng Gia', 'Tập đoàn Hoàng Gia', '0992701618', 'Ngô Mạnh Khánh', 'https://hoanggia.com.vn', 'Tạm ngưng', '0283634809', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hoàng Gia Tower, 126 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(614, 'KH-BB1E', 'business', 'Công ty TNHH Kim Đô Đầu tư', 'Công ty TNHH Kim Đô Đầu tư', '0754174414', 'Phan Phương Yến', 'https://kimdo.com.vn', 'Tạm ngưng', '0901586231', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Kim Đô Tower, 234 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(615, 'KH-8BD1', 'business', 'Công ty TNHH Hòa Bình', 'Công ty TNHH Hòa Bình', '0912071266', 'Nguyễn Mai Ngọc', 'https://hoabinh.com.vn', 'Tạm ngưng', '0987785000', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Hòa Bình Tower, 54 Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(616, 'KH-B077', 'business', 'Doanh nghiệp Tư nhân Tân Á', 'Doanh nghiệp Tư nhân Tân Á', '0412048355', 'Bùi Hoài Cúc', 'https://tana.com.vn', 'Tạm ngưng', '0243497173', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Tân Á Tower, 12 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(617, 'KH-F542', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0441656887', 'Lý Tiến Huy', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0283265960', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Thành Công Tower, 222 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(618, 'KH-A644', 'business', 'Hợp tác xã Tiến Phong Giáo dục', 'Hợp tác xã Tiến Phong Giáo dục', '0326854841', 'Võ Bảo Đông', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0823400380', 'contact@tienphong.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Tiến Phong Tower, 16 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(619, 'KH-92FD', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0570077456', 'Đinh Mai Dung', 'https://hongha.com.vn', 'Đang hoạt động', '0243502061', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Hồng Hà Tower, 86 Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(620, 'KH-ED43', 'business', 'Công ty TNHH Thành Công', 'Công ty TNHH Thành Công', '0168514599', 'Bùi Thu Thảo', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0830215347', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Thành Công Tower, 128 Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(621, 'KH-3A54', 'business', 'Công ty TNHH MTV An Phát Thực phẩm', 'Công ty TNHH MTV An Phát Thực phẩm', '0780269868', 'Hồ Thị Thảo', 'https://anphat.com.vn', 'Ngừng hoạt động', '0857482165', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà An Phát Tower, 16 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(622, 'KH-9091', 'business', 'Hợp tác xã Thành Công Bất động sản', 'Hợp tác xã Thành Công Bất động sản', '0990314234', 'Hồ Khánh Ngọc', 'https://thanhcong.com.vn', 'Đang hoạt động', '0885532871', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Thành Công Tower, 128 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(623, 'KH-51BE', 'business', 'Công ty TNHH MTV Tân Á', 'Công ty TNHH MTV Tân Á', '0959975684', 'Vũ Hồng Phượng', 'https://tana.com.vn', 'Đang hoạt động', '0283605547', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Tân Á Tower, 76 Trần Hưng Đạo, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(624, 'KH-9DC6', 'business', 'Tập đoàn Đất Việt Vận tải', 'Tập đoàn Đất Việt Vận tải', '0666702714', 'Lê Cát Phương', 'https://datviet.com.vn', 'Tạm ngưng', '0905593756', 'contact@datviet.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Đất Việt Tower, 43 Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(625, 'KH-719A', 'business', 'Công ty TNHH Sao Mai Bất động sản', 'Công ty TNHH Sao Mai Bất động sản', '0432685447', 'Phan Khánh Đức', 'https://saomai.com.vn', 'NNT đang hoạt động', '0243410264', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Sao Mai Tower, 194 Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(626, 'KH-35CB', 'business', 'Hợp tác xã Tiến Phong Truyền thông', 'Hợp tác xã Tiến Phong Truyền thông', '0932933757', 'Lý Hoài Trang', 'https://tienphong.com.vn', 'NNT đang hoạt động', '0283179674', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Tiến Phong Tower, 159 Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(627, 'KH-0591', 'business', 'Công ty Cổ phần Khải Hoàn', 'Công ty Cổ phần Khải Hoàn', '0287379698', 'Huỳnh Khánh Tuyết', 'https://khaihoan.com.vn', 'Đang hoạt động', '0828549311', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Khải Hoàn Tower, 218 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(628, 'KH-C5B9', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0817191954', 'Hoàng Hoàng Trung', 'https://cuulong.com.vn', 'Tạm ngưng', '0283962350', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Cửu Long Tower, 31 Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(629, 'KH-BEA6', 'business', 'Công ty Cổ phần Hoa Sen Vận tải', 'Công ty Cổ phần Hoa Sen Vận tải', '0806027536', 'Dương Khánh Lâm', 'https://hoasen.com.vn', 'Đang hoạt động', '0964416367', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Hoa Sen Tower, 85 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(630, 'KH-CFA7', 'business', 'Tập đoàn Minh Đăng', 'Tập đoàn Minh Đăng', '0943536559', 'Đinh Anh Phúc', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0243054904', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Minh Đăng Tower, 236 Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(631, 'KH-FC5A', 'business', 'Hợp tác xã Đại Nam', 'Hợp tác xã Đại Nam', '0116287900', 'Phan Nhật Anh', 'https://dainam.com.vn', 'Đang hoạt động', '0283612930', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Đại Nam Tower, 68 Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(632, 'KH-04BD', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0307665125', 'Nguyễn Anh Tuấn', 'https://truongson.com.vn', 'Đang hoạt động', '0243817349', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 9 Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(633, 'KH-5895', 'business', 'Công ty TNHH MTV Kim Đô', 'Công ty TNHH MTV Kim Đô', '0295358607', 'Lý Hồng An', 'https://kimdo.com.vn', 'Tạm ngưng', '0799179587', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Kim Đô Tower, 171 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(634, 'KH-54C7', 'business', 'Công ty TNHH MTV Thái Bình Dương', 'Công ty TNHH MTV Thái Bình Dương', '0735191652', 'Đặng Khánh Dũng', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0283222001', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Thái Bình Dương Tower, 244 Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(635, 'KH-DA7A', 'business', 'Công ty TNHH Thịnh Phát Giáo dục', 'Công ty TNHH Thịnh Phát Giáo dục', '0828289347', 'Lâm Ngọc My', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0243908968', 'contact@thinhphat.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Thịnh Phát Tower, 177 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(636, 'KH-4E66', 'business', 'Doanh nghiệp Tư nhân Đại Việt Năng lượng', 'Doanh nghiệp Tư nhân Đại Việt Năng lượng', '0804813608', 'Lý Lan Ngọc', 'https://daiviet.com.vn', 'Tạm ngưng', '0283683564', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Đại Việt Tower, 249 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(637, 'KH-1510', 'business', 'Công ty TNHH MTV Kim Đô', 'Công ty TNHH MTV Kim Đô', '0875902570', 'Lê Xuân Thịnh', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0283039724', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Kim Đô Tower, 200 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(638, 'KH-D2B6', 'business', 'Công ty TNHH MTV Trường Giang', 'Công ty TNHH MTV Trường Giang', '0401542745', 'Phạm Cẩm Giang', 'https://truonggiang.com.vn', 'Tạm ngưng', '0243788578', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Trường Giang Tower, 21 Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(639, 'KH-B2F7', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0246964893', 'Trần Quốc Nam', 'https://truongson.com.vn', 'Đang hoạt động', '0390689398', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Trường Sơn Tower, 194 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(640, 'KH-324B', 'business', 'Công ty TNHH Sao Mai Bất động sản', 'Công ty TNHH Sao Mai Bất động sản', '0347187961', 'Ngô Như Thu', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283689641', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Sao Mai Tower, 217 Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(641, 'KH-25B9', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0877857929', 'Phùng Thảo Lan', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0283093421', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Cửu Long Tower, 66 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(642, 'KH-6F24', 'business', 'Công ty Cổ phần Hoa Sen Truyền thông', 'Công ty Cổ phần Hoa Sen Truyền thông', '0337806253', 'Đinh Bích Mai', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0773776737', 'contact@hoasen.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Hoa Sen Tower, 165 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(643, 'KH-1395', 'business', 'Hợp tác xã Đại Việt Dịch vụ', 'Hợp tác xã Đại Việt Dịch vụ', '0274837405', 'Hồ Thị Hạnh', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0243400526', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Đại Việt Tower, 36 Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(644, 'KH-CF4C', 'business', 'Công ty TNHH MTV An Phát Năng lượng', 'Công ty TNHH MTV An Phát Năng lượng', '0218929724', 'Lý Thị Mai', 'https://anphat.com.vn', 'Tạm ngưng', '0349892574', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà An Phát Tower, 7 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(645, 'KH-31B8', 'business', 'Doanh nghiệp Tư nhân Đất Việt Dịch vụ', 'Doanh nghiệp Tư nhân Đất Việt Dịch vụ', '0388931656', 'Đỗ Văn Vinh', 'https://datviet.com.vn', 'NNT đang hoạt động', '0796456771', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Đất Việt Tower, 156 Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(646, 'KH-62D3', 'business', 'Hợp tác xã Đại Việt Du lịch', 'Hợp tác xã Đại Việt Du lịch', '0843354644', 'Huỳnh Khánh Hương', 'https://daiviet.com.vn', 'Tạm ngưng', '0368594109', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Đại Việt Tower, 186 Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(647, 'KH-9DC1', 'business', 'Công ty TNHH MTV Thành Công Du lịch', 'Công ty TNHH MTV Thành Công Du lịch', '0753613728', 'Nguyễn Hồng Tuyết', 'https://thanhcong.com.vn', 'Tạm ngưng', '0283488800', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Thành Công Tower, 81 Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(648, 'KH-CED5', 'business', 'Công ty TNHH Trường Giang Vận tải', 'Công ty TNHH Trường Giang Vận tải', '0813451964', 'Lê Tuyết Thảo', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0243444222', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Trường Giang Tower, 119 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(649, 'KH-3B81', 'business', 'Tập đoàn Hoàng Gia', 'Tập đoàn Hoàng Gia', '0298096647', 'Võ Khánh Linh', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0346865487', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Hoàng Gia Tower, 135 Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(650, 'KH-DC57', 'business', 'Tập đoàn Đại Việt Cơ khí', 'Tập đoàn Đại Việt Cơ khí', '0633080893', 'Dương Đức Hùng', 'https://daiviet.com.vn', 'Tạm ngưng', '0243449255', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Đại Việt Tower, 52 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(651, 'KH-C13C', 'business', 'Công ty TNHH Khải Hoàn', 'Công ty TNHH Khải Hoàn', '0327595029', 'Đặng Tuyết Cúc', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0283394924', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Khải Hoàn Tower, 53 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(652, 'KH-7C91', 'business', 'Công ty TNHH MTV Đất Việt', 'Công ty TNHH MTV Đất Việt', '0920429255', 'Lê Mạnh Hải', 'https://datviet.com.vn', 'Ngừng hoạt động', '0283101420', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Đất Việt Tower, 162 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(653, 'KH-CD7C', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0166149918', 'Hồ Tuyết Hương', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0702024433', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Cửu Long Tower, 52 Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(654, 'KH-CBE6', 'business', 'Công ty TNHH Hoàng Gia Du lịch', 'Công ty TNHH Hoàng Gia Du lịch', '0260142689', 'Lý Hữu Tuấn', 'https://hoanggia.com.vn', 'Tạm ngưng', '0815730757', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Hoàng Gia Tower, 35 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(655, 'KH-57AD', 'business', 'Công ty TNHH MTV Thái Bình Dương Đầu tư', 'Công ty TNHH MTV Thái Bình Dương Đầu tư', '0178062920', 'Phạm Hoài Chi', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0936512554', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Thái Bình Dương Tower, 200 Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(656, 'KH-7E86', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0510096128', 'Đặng Cẩm Anh', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0852913933', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Minh Đăng Tower, 183 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(657, 'KH-6ADD', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0217002291', 'Nguyễn Tuấn Sơn', 'https://truongson.com.vn', 'NNT đang hoạt động', '0283796656', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Trường Sơn Tower, 112 Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(658, 'KH-C8C1', 'business', 'Tập đoàn Việt Á Cơ khí', 'Tập đoàn Việt Á Cơ khí', '0364418936', 'Hoàng Cẩm Dung', 'https://vieta.com.vn', 'Đang hoạt động', '0353990638', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Việt Á Tower, 4 Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(659, 'KH-BDC3', 'business', 'Hợp tác xã Cửu Long Thời trang', 'Hợp tác xã Cửu Long Thời trang', '0919381790', 'Mai Thị Hoa', 'https://cuulong.com.vn', 'Tạm ngưng', '0243913559', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Cửu Long Tower, 97 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(660, 'KH-9A11', 'business', 'Tập đoàn Đại Việt Bất động sản', 'Tập đoàn Đại Việt Bất động sản', '0674621109', 'Phạm Nhật Quân', 'https://daiviet.com.vn', 'Tạm ngưng', '0946487108', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Đại Việt Tower, 6 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(661, 'KH-283B', 'business', 'Công ty TNHH Vinh Quang', 'Công ty TNHH Vinh Quang', '0285436970', 'Phùng Nhật Hải', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0243218501', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Vinh Quang Tower, 167 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(662, 'KH-A2DC', 'business', 'Công ty TNHH Sao Mai Năng lượng', 'Công ty TNHH Sao Mai Năng lượng', '0208574147', 'Lâm Quang Nam', 'https://saomai.com.vn', 'Đang hoạt động', '0984789972', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Sao Mai Tower, 92 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(663, 'KH-A02F', 'business', 'Hợp tác xã Hải Đăng', 'Hợp tác xã Hải Đăng', '0363786363', 'Lý Hoài Lan', 'https://haidang.com.vn', 'Đang hoạt động', '0373139089', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Hải Đăng Tower, 155 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(664, 'KH-A41E', 'business', 'Công ty TNHH MTV An Phát', 'Công ty TNHH MTV An Phát', '0374570043', 'Ngô Mạnh Sơn', 'https://anphat.com.vn', 'Tạm ngưng', '0283520797', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà An Phát Tower, 39 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(665, 'KH-D0E9', 'business', 'Công ty TNHH MTV Vạn Xuân Bất động sản', 'Công ty TNHH MTV Vạn Xuân Bất động sản', '0507326291', 'Đỗ Tiến Việt', 'https://vanxuan.com.vn', 'Tạm ngưng', '0243143085', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Vạn Xuân Tower, 158 Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(666, 'KH-9B9D', 'business', 'Tập đoàn Hòa Bình', 'Tập đoàn Hòa Bình', '0488250538', 'Dương Thu Hoa', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0243758523', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Hòa Bình Tower, 193 Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(667, 'KH-F56D', 'business', 'Hợp tác xã Vinh Quang Thương mại', 'Hợp tác xã Vinh Quang Thương mại', '0518954628', 'Đinh Thị Hương', 'https://vinhquang.com.vn', 'Đang hoạt động', '0767148999', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Vinh Quang Tower, 120 Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(668, 'KH-1407', 'business', 'Công ty TNHH Kim Đô Dịch vụ', 'Công ty TNHH Kim Đô Dịch vụ', '0425070888', 'Hồ Mạnh Đông', 'https://kimdo.com.vn', 'Ngừng hoạt động', '0364255965', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Kim Đô Tower, 158 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(669, 'KH-2DD8', 'business', 'Công ty TNHH MTV Thành Công Truyền thông', 'Công ty TNHH MTV Thành Công Truyền thông', '0869832428', 'Huỳnh Tuyết Dung', 'https://thanhcong.com.vn', 'Tạm ngưng', '0283330904', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Thành Công Tower, 44 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(670, 'KH-2E68', 'business', 'Công ty Cổ phần Hoàng Gia', 'Công ty Cổ phần Hoàng Gia', '0979756410', 'Lê Mai Trang', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0883607501', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Hoàng Gia Tower, 169 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(671, 'KH-BF34', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0304634270', 'Đỗ Tuấn Bảo', 'https://hoabinh.com.vn', 'Tạm ngưng', '0243918597', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hòa Bình Tower, 183 Điện Biên Phủ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(672, 'KH-0B57', 'business', 'Hợp tác xã An Phát Vận tải', 'Hợp tác xã An Phát Vận tải', '0871248184', 'Vũ Quốc Phúc', 'https://anphat.com.vn', 'NNT đang hoạt động', '0283977292', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà An Phát Tower, 116 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(673, 'KH-5EBC', 'business', 'Công ty TNHH Tân Á', 'Công ty TNHH Tân Á', '0743246385', 'Đặng Bích An', 'https://tana.com.vn', 'NNT đang hoạt động', '0283256764', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Tân Á Tower, 45 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(674, 'KH-4CC3', 'business', 'Hợp tác xã Sao Mai Thời trang', 'Hợp tác xã Sao Mai Thời trang', '0223618873', 'Ngô Cẩm Liên', 'https://saomai.com.vn', 'Ngừng hoạt động', '0243735636', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Sao Mai Tower, 163 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(675, 'KH-4CEC', 'business', 'Công ty TNHH MTV Hoàng Gia', 'Công ty TNHH MTV Hoàng Gia', '0496593814', 'Lý Như Linh', 'https://hoanggia.com.vn', 'Tạm ngưng', '0962205079', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Hoàng Gia Tower, 192 Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(676, 'KH-2F7F', 'business', 'Doanh nghiệp Tư nhân Việt Á Thực phẩm', 'Doanh nghiệp Tư nhân Việt Á Thực phẩm', '0681679372', 'Đỗ Văn Anh', 'https://vieta.com.vn', 'Đang hoạt động', '0844952821', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Việt Á Tower, 125 Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(677, 'KH-CA57', 'business', 'Công ty TNHH Sao Mai', 'Công ty TNHH Sao Mai', '0847976036', 'Huỳnh Phương Hằng', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283085219', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Sao Mai Tower, 76 Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(678, 'KH-384B', 'business', 'Doanh nghiệp Tư nhân Thịnh Phát Xây dựng', 'Doanh nghiệp Tư nhân Thịnh Phát Xây dựng', '0217994302', 'Nguyễn Quang Hùng', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0283539702', 'contact@thinhphat.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Thịnh Phát Tower, 82 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(679, 'KH-C21C', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0331350127', 'Bùi Mai Vy', 'https://cuulong.com.vn', 'Đang hoạt động', '0327182322', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Cửu Long Tower, 166 Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(680, 'KH-1686', 'business', 'Hợp tác xã Đại Việt Công nghệ', 'Hợp tác xã Đại Việt Công nghệ', '0442572168', 'Phan Quốc Dũng', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0370440509', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Đại Việt Tower, 208 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(681, 'KH-CB71', 'business', 'Công ty Cổ phần Đại Việt', 'Công ty Cổ phần Đại Việt', '0127623034', 'Đinh Thảo My', 'https://daiviet.com.vn', 'NNT đang hoạt động', '0283922697', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Đại Việt Tower, 233 Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(682, 'KH-3031', 'business', 'Doanh nghiệp Tư nhân Thành Công Thực phẩm', 'Doanh nghiệp Tư nhân Thành Công Thực phẩm', '0867784318', 'Đặng Ngọc Trinh', 'https://thanhcong.com.vn', 'Tạm ngưng', '0355504601', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Thành Công Tower, 1 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(683, 'KH-3ACC', 'business', 'Công ty Cổ phần Việt Á Thực phẩm', 'Công ty Cổ phần Việt Á Thực phẩm', '0937585732', 'Bùi Nhật Sơn', 'https://vieta.com.vn', 'Đang hoạt động', '0243969603', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Việt Á Tower, 126 Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(684, 'KH-C075', 'business', 'Doanh nghiệp Tư nhân Kim Đô Đầu tư', 'Doanh nghiệp Tư nhân Kim Đô Đầu tư', '0623819776', 'Vũ Lan Vy', 'https://kimdo.com.vn', 'Tạm ngưng', '0911849300', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Kim Đô Tower, 214 Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(685, 'KH-8772', 'business', 'Tập đoàn Minh Đăng Bất động sản', 'Tập đoàn Minh Đăng Bất động sản', '0647839042', 'Phùng Mai Tuyền', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0283148939', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Minh Đăng Tower, 135 Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(686, 'KH-6B1C', 'business', 'Công ty TNHH MTV Trường Giang', 'Công ty TNHH MTV Trường Giang', '0142735945', 'Lý Thị Hà', 'https://truonggiang.com.vn', 'Tạm ngưng', '0823342740', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Trường Giang Tower, 241 Cách Mạng Tháng Tám, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(687, 'KH-5325', 'business', 'Công ty Cổ phần Nam Á', 'Công ty Cổ phần Nam Á', '0915461419', 'Dương Tuyết Hằng', 'https://nama.com.vn', 'Ngừng hoạt động', '0283365280', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Nam Á Tower, 202 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(688, 'KH-6594', 'business', 'Công ty TNHH Thành Công', 'Công ty TNHH Thành Công', '0309693188', 'Lê Khánh Vy', 'https://thanhcong.com.vn', 'Đang hoạt động', '0780621457', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Thành Công Tower, 241 Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(689, 'KH-511F', 'business', 'Công ty TNHH Cửu Long Dịch vụ', 'Công ty TNHH Cửu Long Dịch vụ', '0708539718', 'Mai Tuấn Sơn', 'https://cuulong.com.vn', 'Tạm ngưng', '0283568800', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Cửu Long Tower, 146 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(690, 'KH-A23B', 'business', 'Công ty Cổ phần Sông Hồng Sản xuất', 'Công ty Cổ phần Sông Hồng Sản xuất', '0187877112', 'Phùng Khánh Anh', 'https://songhong.com.vn', 'Ngừng hoạt động', '0907203589', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Sông Hồng Tower, 126 Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(691, 'KH-9988', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0490364834', 'Phạm Thành Kiệt', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0943109937', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 20 Tòa nhà Thành Công Tower, 189 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(692, 'KH-186B', 'business', 'Hợp tác xã An Phát Thương mại', 'Hợp tác xã An Phát Thương mại', '0767026466', 'Dương Thu Vy', 'https://anphat.com.vn', 'NNT đang hoạt động', '0243978697', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà An Phát Tower, 57 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(693, 'KH-282C', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0946779840', 'Võ Văn Long', 'https://truongson.com.vn', 'NNT đang hoạt động', '0243364210', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Trường Sơn Tower, 60 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(694, 'KH-45EE', 'business', 'Công ty Cổ phần Hoa Sen Thương mại', 'Công ty Cổ phần Hoa Sen Thương mại', '0263052356', 'Bùi Quang Tân', 'https://hoasen.com.vn', 'Đang hoạt động', '0243378939', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Hoa Sen Tower, 81 Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(695, 'KH-6ED2', 'business', 'Công ty TNHH Hoàng Gia', 'Công ty TNHH Hoàng Gia', '0345288471', 'Hoàng Thị Đào', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0283263837', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Hoàng Gia Tower, 34 Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(696, 'KH-E71E', 'business', 'Công ty TNHH MTV Vạn Xuân Thời trang', 'Công ty TNHH MTV Vạn Xuân Thời trang', '0369177028', 'Phùng Quang Phúc', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0396330388', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Vạn Xuân Tower, 250 Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(697, 'KH-5721', 'business', 'Tập đoàn Sao Mai', 'Tập đoàn Sao Mai', '0309691713', 'Trần Quỳnh Yến', 'https://saomai.com.vn', 'Đang hoạt động', '0854406749', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Sao Mai Tower, 205 Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(698, 'KH-BF66', 'business', 'Công ty TNHH Khải Hoàn Cơ khí', 'Công ty TNHH Khải Hoàn Cơ khí', '0946031009', 'Vũ Xuân Bảo', 'https://khaihoan.com.vn', 'Đang hoạt động', '0283510273', 'contact@khaihoan.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Khải Hoàn Tower, 28 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(699, 'KH-F858', 'business', 'Công ty TNHH Đại Nam Năng lượng', 'Công ty TNHH Đại Nam Năng lượng', '0302767027', 'Võ Khánh Nhi', 'https://dainam.com.vn', 'NNT đang hoạt động', '0320168670', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Đại Nam Tower, 17 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(700, 'KH-A0DD', 'business', 'Công ty TNHH MTV Trường Sơn', 'Công ty TNHH MTV Trường Sơn', '0197433828', 'Lâm Văn Giang', 'https://truongson.com.vn', 'Đang hoạt động', '0331977181', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Trường Sơn Tower, 99 Cách Mạng Tháng Tám, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(701, 'KH-565B', 'business', 'Hợp tác xã Khải Hoàn', 'Hợp tác xã Khải Hoàn', '0405369741', 'Bùi Văn Khoa', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0961676821', 'contact@khaihoan.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Khải Hoàn Tower, 77 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(702, 'KH-8504', 'business', 'Tập đoàn Tân Á Giáo dục', 'Tập đoàn Tân Á Giáo dục', '0463455202', 'Lý Mai Hà', 'https://tana.com.vn', 'NNT đang hoạt động', '0243564309', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Tân Á Tower, 81 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(703, 'KH-5D40', 'business', 'Công ty Cổ phần Hoàng Gia', 'Công ty Cổ phần Hoàng Gia', '0765979184', 'Hoàng Tiến Long', 'https://hoanggia.com.vn', 'Đang hoạt động', '0283004185', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Hoàng Gia Tower, 166 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(704, 'KH-256F', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0690902103', 'Mai Văn Sơn', 'https://hongha.com.vn', 'Tạm ngưng', '0243475594', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Hồng Hà Tower, 187 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(705, 'KH-F35F', 'business', 'Công ty Cổ phần Đông Dương Bất động sản', 'Công ty Cổ phần Đông Dương Bất động sản', '0306499538', 'Hồ Cẩm Tuyết', 'https://dongduong.com.vn', 'NNT đang hoạt động', '0962262141', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Đông Dương Tower, 12 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(706, 'KH-9DF8', 'business', 'Hợp tác xã An Phát', 'Hợp tác xã An Phát', '0461074569', 'Dương Như An', 'https://anphat.com.vn', 'Tạm ngưng', '0283390666', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà An Phát Tower, 177 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(707, 'KH-BD31', 'business', 'Tập đoàn Hồng Hà Thực phẩm', 'Tập đoàn Hồng Hà Thực phẩm', '0632430333', 'Hồ Quốc Trung', 'https://hongha.com.vn', 'Tạm ngưng', '0358284164', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Hồng Hà Tower, 33 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(708, 'KH-067A', 'business', 'Doanh nghiệp Tư nhân Trường Sơn', 'Doanh nghiệp Tư nhân Trường Sơn', '0204280426', 'Lê Thành Thịnh', 'https://truongson.com.vn', 'Tạm ngưng', '0979464317', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Trường Sơn Tower, 222 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(709, 'KH-1421', 'business', 'Công ty TNHH MTV Hoa Sen Đầu tư', 'Công ty TNHH MTV Hoa Sen Đầu tư', '0570996282', 'Phạm Diệu Anh', 'https://hoasen.com.vn', 'Đang hoạt động', '0243225813', 'contact@hoasen.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Hoa Sen Tower, 11 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(710, 'KH-79EB', 'business', 'Doanh nghiệp Tư nhân Minh Đăng Công nghệ', 'Doanh nghiệp Tư nhân Minh Đăng Công nghệ', '0868110481', 'Huỳnh Thị Trúc', 'https://minhdang.com.vn', 'Tạm ngưng', '0777825084', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Minh Đăng Tower, 27 Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(711, 'KH-704A', 'business', 'Doanh nghiệp Tư nhân Sông Hồng Du lịch', 'Doanh nghiệp Tư nhân Sông Hồng Du lịch', '0772371467', 'Hồ Tiến Kiệt', 'https://songhong.com.vn', 'Ngừng hoạt động', '0961013130', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Sông Hồng Tower, 126 Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(712, 'KH-CFF4', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0373771883', 'Lý Xuân Hùng', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0283168560', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Hòa Bình Tower, 23 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(713, 'KH-3C39', 'business', 'Công ty Cổ phần Việt Á Năng lượng', 'Công ty Cổ phần Việt Á Năng lượng', '0772086463', 'Phan Mai Nhi', 'https://vieta.com.vn', 'Ngừng hoạt động', '0243656780', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Việt Á Tower, 145 Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(714, 'KH-80C4', 'business', 'Công ty TNHH MTV Hòa Bình Năng lượng', 'Công ty TNHH MTV Hòa Bình Năng lượng', '0534062978', 'Lê Minh Đông', 'https://hoabinh.com.vn', 'Tạm ngưng', '0283744979', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hòa Bình Tower, 219 Nguyễn Huệ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(715, 'KH-5906', 'business', 'Công ty Cổ phần Thành Công Vận tải', 'Công ty Cổ phần Thành Công Vận tải', '0655665365', 'Phạm Thu Mai', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0905033410', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Thành Công Tower, 59 Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(716, 'KH-E177', 'business', 'Hợp tác xã Hòa Bình', 'Hợp tác xã Hòa Bình', '0529697039', 'Bùi Cẩm An', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0969283437', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Hòa Bình Tower, 15 Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(717, 'KH-C2D7', 'business', 'Công ty Cổ phần Minh Đăng Thực phẩm', 'Công ty Cổ phần Minh Đăng Thực phẩm', '0608638462', 'Đinh Ngọc Dung', 'https://minhdang.com.vn', 'Tạm ngưng', '0977242787', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Minh Đăng Tower, 68 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(718, 'KH-CC41', 'business', 'Doanh nghiệp Tư nhân Vinh Quang Đầu tư', 'Doanh nghiệp Tư nhân Vinh Quang Đầu tư', '0127193129', 'Đỗ Quang Cường', 'https://vinhquang.com.vn', 'Tạm ngưng', '0769065585', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 20 Tòa nhà Vinh Quang Tower, 36 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(719, 'KH-8562', 'business', 'Công ty Cổ phần Kim Đô', 'Công ty Cổ phần Kim Đô', '0737793841', 'Vũ Xuân Bảo', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0243621305', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Kim Đô Tower, 63 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(720, 'KH-FFC1', 'business', 'Công ty TNHH Hoàng Gia Thời trang', 'Công ty TNHH Hoàng Gia Thời trang', '0590760294', 'Dương Văn Tùng', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0243255353', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Hoàng Gia Tower, 243 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(721, 'KH-79FB', 'business', 'Doanh nghiệp Tư nhân Kim Đô', 'Doanh nghiệp Tư nhân Kim Đô', '0492273768', 'Ngô Ngọc Trinh', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0283054090', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Kim Đô Tower, 152 Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(722, 'KH-18F8', 'business', 'Công ty TNHH MTV Tiến Phong Giáo dục', 'Công ty TNHH MTV Tiến Phong Giáo dục', '0662669022', 'Đinh Hữu Khoa', 'https://tienphong.com.vn', 'Tạm ngưng', '0243410757', 'contact@tienphong.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Tiến Phong Tower, 129 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(723, 'KH-F6F7', 'business', 'Doanh nghiệp Tư nhân Hồng Hà Công nghệ', 'Doanh nghiệp Tư nhân Hồng Hà Công nghệ', '0646759128', 'Phan Xuân Long', 'https://hongha.com.vn', 'Đang hoạt động', '0243981917', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Hồng Hà Tower, 181 Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(724, 'KH-4C93', 'business', 'Công ty TNHH MTV Sao Mai Truyền thông', 'Công ty TNHH MTV Sao Mai Truyền thông', '0766640873', 'Võ Thảo Hằng', 'https://saomai.com.vn', 'Ngừng hoạt động', '0856576896', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Sao Mai Tower, 3 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(725, 'KH-9490', 'business', 'Công ty Cổ phần Thịnh Phát', 'Công ty Cổ phần Thịnh Phát', '0374637478', 'Phùng Bảo Huy', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0243248110', 'contact@thinhphat.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Thịnh Phát Tower, 44 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(726, 'KH-A560', 'business', 'Công ty Cổ phần Đất Việt Thực phẩm', 'Công ty Cổ phần Đất Việt Thực phẩm', '0444613856', 'Nguyễn Phương Hà', 'https://datviet.com.vn', 'Đang hoạt động', '0967474633', 'contact@datviet.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Đất Việt Tower, 65 Lê Duẩn, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(727, 'KH-F3A1', 'business', 'Doanh nghiệp Tư nhân Đại Việt Giáo dục', 'Doanh nghiệp Tư nhân Đại Việt Giáo dục', '0247039124', 'Dương Ngọc Anh', 'https://daiviet.com.vn', 'NNT đang hoạt động', '0322229743', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Đại Việt Tower, 38 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(728, 'KH-2184', 'business', 'Công ty TNHH MTV Đại Nam', 'Công ty TNHH MTV Đại Nam', '0116240231', 'Lâm Bảo Tuấn', 'https://dainam.com.vn', 'Tạm ngưng', '0395239036', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Đại Nam Tower, 224 Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(729, 'KH-BF1D', 'business', 'Hợp tác xã Tân Á Thời trang', 'Hợp tác xã Tân Á Thời trang', '0110545120', 'Võ Văn Hùng', 'https://tana.com.vn', 'NNT đang hoạt động', '0243305216', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Tân Á Tower, 230 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(730, 'KH-7981', 'business', 'Tập đoàn Nam Á', 'Tập đoàn Nam Á', '0381101122', 'Huỳnh Trọng Tiến', 'https://nama.com.vn', 'NNT đang hoạt động', '0283898720', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Nam Á Tower, 118 Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(731, 'KH-5069', 'business', 'Công ty Cổ phần Đông Dương', 'Công ty Cổ phần Đông Dương', '0620214043', 'Dương Cát Nhi', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0283778056', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Đông Dương Tower, 142 Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(732, 'KH-EE38', 'business', 'Tập đoàn Đông Dương', 'Tập đoàn Đông Dương', '0821464000', 'Hồ Quỳnh Liên', 'https://dongduong.com.vn', 'Tạm ngưng', '0283287776', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Đông Dương Tower, 216 Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(733, 'KH-3860', 'business', 'Công ty TNHH Đại Nam Thương mại', 'Công ty TNHH Đại Nam Thương mại', '0811091520', 'Lý Minh Sơn', 'https://dainam.com.vn', 'Đang hoạt động', '0387960195', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Đại Nam Tower, 105 Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(734, 'KH-B1FC', 'business', 'Công ty Cổ phần Kim Đô', 'Công ty Cổ phần Kim Đô', '0509885448', 'Đinh Diệu Thu', 'https://kimdo.com.vn', 'Ngừng hoạt động', '0775043138', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Kim Đô Tower, 117 Trần Hưng Đạo, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(735, 'KH-5EE6', 'business', 'Công ty TNHH MTV Sông Hồng', 'Công ty TNHH MTV Sông Hồng', '0456489043', 'Lâm Hoàng Huy', 'https://songhong.com.vn', 'Đang hoạt động', '0283706293', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Sông Hồng Tower, 171 Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(736, 'KH-28C3', 'business', 'Doanh nghiệp Tư nhân An Phát Thời trang', 'Doanh nghiệp Tư nhân An Phát Thời trang', '0830548743', 'Phan Khánh Tuấn', 'https://anphat.com.vn', 'NNT đang hoạt động', '0777861313', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà An Phát Tower, 229 Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(737, 'KH-34C0', 'business', 'Doanh nghiệp Tư nhân Hoa Sen Thực phẩm', 'Doanh nghiệp Tư nhân Hoa Sen Thực phẩm', '0305004360', 'Ngô Văn Hoàng', 'https://hoasen.com.vn', 'Đang hoạt động', '0933520485', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Hoa Sen Tower, 243 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(738, 'KH-E350', 'business', 'Tập đoàn Việt Á', 'Tập đoàn Việt Á', '0123761779', 'Phùng Cát Mai', 'https://vieta.com.vn', 'Tạm ngưng', '0283192316', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Việt Á Tower, 192 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(739, 'KH-108D', 'business', 'Doanh nghiệp Tư nhân An Phát', 'Doanh nghiệp Tư nhân An Phát', '0516357655', 'Phan Thu My', 'https://anphat.com.vn', 'Ngừng hoạt động', '0283506181', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà An Phát Tower, 221 Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(740, 'KH-4FC1', 'business', 'Tập đoàn Cửu Long', 'Tập đoàn Cửu Long', '0628255592', 'Ngô Quỳnh Hạnh', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0243355909', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Cửu Long Tower, 29 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(741, 'KH-7CD6', 'business', 'Doanh nghiệp Tư nhân Hòa Bình', 'Doanh nghiệp Tư nhân Hòa Bình', '0681423884', 'Vũ Quang Phong', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0283927140', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Hòa Bình Tower, 21 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(742, 'KH-1DF5', 'business', 'Doanh nghiệp Tư nhân Trường Giang', 'Doanh nghiệp Tư nhân Trường Giang', '0778354010', 'Lý Thu Nhi', 'https://truonggiang.com.vn', 'Đang hoạt động', '0705003507', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Trường Giang Tower, 8 Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(743, 'KH-78EA', 'business', 'Công ty TNHH Sông Hồng', 'Công ty TNHH Sông Hồng', '0150802558', 'Đinh Thị Thu', 'https://songhong.com.vn', 'NNT đang hoạt động', '0767901171', 'contact@songhong.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Sông Hồng Tower, 247 Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(744, 'KH-64EB', 'business', 'Hợp tác xã Hòa Bình', 'Hợp tác xã Hòa Bình', '0332629091', 'Đỗ Diệu Hằng', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0243506564', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Hòa Bình Tower, 244 Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(745, 'KH-B8F5', 'business', 'Công ty Cổ phần Thịnh Phát', 'Công ty Cổ phần Thịnh Phát', '0234939110', 'Trần Hồng Nhi', 'https://thinhphat.com.vn', 'Đang hoạt động', '0390421578', 'contact@thinhphat.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Thịnh Phát Tower, 33 Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(746, 'KH-9777', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0397364175', 'Đỗ Mai Trinh', 'https://cuulong.com.vn', 'Đang hoạt động', '0283120490', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Cửu Long Tower, 192 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(747, 'KH-F52A', 'business', 'Công ty Cổ phần Kim Đô Cơ khí', 'Công ty Cổ phần Kim Đô Cơ khí', '0343440829', 'Lâm Bảo Phúc', 'https://kimdo.com.vn', 'Đang hoạt động', '0283027030', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Kim Đô Tower, 105 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(748, 'KH-D491', 'business', 'Tập đoàn Minh Đăng Năng lượng', 'Tập đoàn Minh Đăng Năng lượng', '0545947987', 'Đinh Trọng Tân', 'https://minhdang.com.vn', 'Đang hoạt động', '0396559775', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Minh Đăng Tower, 170 Lý Tự Trọng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(749, 'KH-1BC0', 'business', 'Công ty Cổ phần Đông Dương', 'Công ty Cổ phần Đông Dương', '0390997723', 'Đinh Trọng Lâm', 'https://dongduong.com.vn', 'Tạm ngưng', '0243387294', 'contact@dongduong.com.vn', NULL, 'Nam', 'Tầng 20 Tòa nhà Đông Dương Tower, 158 Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(750, 'KH-021C', 'business', 'Công ty Cổ phần Tân Á Thời trang', 'Công ty Cổ phần Tân Á Thời trang', '0651459327', 'Trần Khánh Hùng', 'https://tana.com.vn', 'NNT đang hoạt động', '0970789669', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Tân Á Tower, 31 Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(751, 'KH-89C7', 'business', 'Công ty TNHH MTV Vinh Quang Thực phẩm', 'Công ty TNHH MTV Vinh Quang Thực phẩm', '0676282225', 'Dương Nhật Long', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0978127765', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Vinh Quang Tower, 90 Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(752, 'KH-22C4', 'business', 'Hợp tác xã Tiến Phong', 'Hợp tác xã Tiến Phong', '0427383885', 'Lý Diệu Thu', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0361587247', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Tiến Phong Tower, 190 Lê Duẩn, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(753, 'KH-56B2', 'business', 'Tập đoàn Tiến Phong', 'Tập đoàn Tiến Phong', '0767698005', 'Ngô Thành Minh', 'https://tienphong.com.vn', 'Đang hoạt động', '0363166692', 'contact@tienphong.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Tiến Phong Tower, 159 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(754, 'KH-7908', 'business', 'Công ty TNHH MTV Thái Bình Dương', 'Công ty TNHH MTV Thái Bình Dương', '0301410150', 'Hồ Thành Bình', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0283590297', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 189 Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(755, 'KH-1757', 'business', 'Tập đoàn Đại Nam Cơ khí', 'Tập đoàn Đại Nam Cơ khí', '0899037700', 'Vũ Thành Dũng', 'https://dainam.com.vn', 'Ngừng hoạt động', '0351157608', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Đại Nam Tower, 60 Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(756, 'KH-3C42', 'business', 'Công ty TNHH MTV Hồng Hà', 'Công ty TNHH MTV Hồng Hà', '0497294893', 'Phạm Hoài Vân', 'https://hongha.com.vn', 'Tạm ngưng', '0283721783', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Hồng Hà Tower, 98 Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(757, 'KH-D509', 'business', 'Công ty TNHH Hoàng Gia', 'Công ty TNHH Hoàng Gia', '0448298051', 'Hoàng Thảo Hoa', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0283035275', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Hoàng Gia Tower, 128 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(758, 'KH-5523', 'business', 'Doanh nghiệp Tư nhân Trường Giang Giáo dục', 'Doanh nghiệp Tư nhân Trường Giang Giáo dục', '0146439071', 'Lý Hoài Mai', 'https://truonggiang.com.vn', 'Đang hoạt động', '0243102428', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Trường Giang Tower, 31 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(759, 'KH-EAA4', 'business', 'Công ty TNHH Trường Sơn', 'Công ty TNHH Trường Sơn', '0546218484', 'Phan Tuấn Sơn', 'https://truongson.com.vn', 'Tạm ngưng', '0773484960', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Trường Sơn Tower, 142 Hai Bà Trưng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(760, 'KH-38E3', 'business', 'Công ty Cổ phần Hồng Hà', 'Công ty Cổ phần Hồng Hà', '0902250987', 'Đinh Ngọc Linh', 'https://hongha.com.vn', 'Đang hoạt động', '0936095511', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Hồng Hà Tower, 231 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(761, 'KH-3826', 'business', 'Hợp tác xã Hoa Sen', 'Hợp tác xã Hoa Sen', '0845872580', 'Nguyễn Quang Hải', 'https://hoasen.com.vn', 'Đang hoạt động', '0283047872', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Hoa Sen Tower, 195 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(762, 'KH-EB74', 'business', 'Doanh nghiệp Tư nhân Nam Á', 'Doanh nghiệp Tư nhân Nam Á', '0744052969', 'Hồ Văn Trung', 'https://nama.com.vn', 'NNT đang hoạt động', '0384510792', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Nam Á Tower, 42 Lê Duẩn, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(763, 'KH-6368', 'business', 'Công ty TNHH MTV Kim Đô Xây dựng', 'Công ty TNHH MTV Kim Đô Xây dựng', '0414547553', 'Đinh Cát Trinh', 'https://kimdo.com.vn', 'Đang hoạt động', '0283988928', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Kim Đô Tower, 158 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(764, 'KH-E469', 'business', 'Công ty TNHH MTV Hoa Sen', 'Công ty TNHH MTV Hoa Sen', '0364343353', 'Đinh Tuyết Thu', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0243910118', 'contact@hoasen.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Hoa Sen Tower, 4 Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(765, 'KH-FCB8', 'business', 'Hợp tác xã Sông Hồng', 'Hợp tác xã Sông Hồng', '0545048917', 'Mai Quốc Giang', 'https://songhong.com.vn', 'Tạm ngưng', '0283066122', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Sông Hồng Tower, 95 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(766, 'KH-01E9', 'business', 'Công ty Cổ phần Thái Bình Dương', 'Công ty Cổ phần Thái Bình Dương', '0183133423', 'Võ Hoàng Anh', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0703262800', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 14 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(767, 'KH-1B48', 'business', 'Công ty Cổ phần Khải Hoàn Xây dựng', 'Công ty Cổ phần Khải Hoàn Xây dựng', '0749845998', 'Hoàng Thảo Oanh', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0889724175', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Khải Hoàn Tower, 51 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(768, 'KH-7113', 'business', 'Tập đoàn Trường Sơn Du lịch', 'Tập đoàn Trường Sơn Du lịch', '0513124432', 'Mai Minh Nam', 'https://truongson.com.vn', 'Ngừng hoạt động', '0347470703', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Trường Sơn Tower, 36 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(769, 'KH-E20A', 'business', 'Công ty TNHH Khải Hoàn Xây dựng', 'Công ty TNHH Khải Hoàn Xây dựng', '0515654997', 'Mai Quốc Đông', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0963481393', 'contact@khaihoan.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Khải Hoàn Tower, 2 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(770, 'KH-DDA3', 'business', 'Doanh nghiệp Tư nhân Minh Đăng', 'Doanh nghiệp Tư nhân Minh Đăng', '0989833557', 'Phùng Mạnh Dũng', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0975709209', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Minh Đăng Tower, 124 Nguyễn Huệ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(771, 'KH-071F', 'business', 'Tập đoàn Trường Sơn', 'Tập đoàn Trường Sơn', '0821702393', 'Mai Tuyết Hà', 'https://truongson.com.vn', 'Đang hoạt động', '0377533866', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Trường Sơn Tower, 122 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(772, 'KH-75F6', 'business', 'Công ty TNHH Vạn Xuân', 'Công ty TNHH Vạn Xuân', '0397770987', 'Lý Mai Ngọc', 'https://vanxuan.com.vn', 'Đang hoạt động', '0243102829', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Vạn Xuân Tower, 136 Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(773, 'KH-260E', 'business', 'Hợp tác xã Việt Á Thời trang', 'Hợp tác xã Việt Á Thời trang', '0602917055', 'Đặng Nhật Hùng', 'https://vieta.com.vn', 'NNT đang hoạt động', '0962797396', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Việt Á Tower, 84 Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(774, 'KH-7FEB', 'business', 'Công ty TNHH Hoa Sen Vận tải', 'Công ty TNHH Hoa Sen Vận tải', '0455714693', 'Hồ Duy Sơn', 'https://hoasen.com.vn', 'NNT đang hoạt động', '0885534911', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Hoa Sen Tower, 130 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(775, 'KH-AFB0', 'business', 'Công ty TNHH MTV Vinh Quang Thực phẩm', 'Công ty TNHH MTV Vinh Quang Thực phẩm', '0187881735', 'Nguyễn Tuấn Sơn', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0348408996', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Vinh Quang Tower, 196 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(776, 'KH-E7D9', 'business', 'Tập đoàn Thái Bình Dương', 'Tập đoàn Thái Bình Dương', '0935921747', 'Hồ Mai Dung', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0334551216', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Thái Bình Dương Tower, 220 Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(777, 'KH-7123', 'business', 'Tập đoàn Đông Dương', 'Tập đoàn Đông Dương', '0264610515', 'Lâm Xuân Long', 'https://dongduong.com.vn', 'Đang hoạt động', '0243570625', 'contact@dongduong.com.vn', NULL, 'Nam', 'Tầng 20 Tòa nhà Đông Dương Tower, 223 Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(778, 'KH-E674', 'business', 'Hợp tác xã Hòa Bình', 'Hợp tác xã Hòa Bình', '0335433137', 'Huỳnh Mai An', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0283702547', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Hòa Bình Tower, 244 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(779, 'KH-23F2', 'business', 'Công ty TNHH MTV Thái Bình Dương Vận tải', 'Công ty TNHH MTV Thái Bình Dương Vận tải', '0258198101', 'Phan Trọng Nam', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0383491390', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Thái Bình Dương Tower, 177 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(780, 'KH-97BF', 'business', 'Hợp tác xã Đại Việt Vận tải', 'Hợp tác xã Đại Việt Vận tải', '0534347186', 'Phạm Cẩm Vy', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0905615281', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Đại Việt Tower, 146 Hai Bà Trưng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(781, 'KH-3CDD', 'business', 'Tập đoàn Vinh Quang Thực phẩm', 'Tập đoàn Vinh Quang Thực phẩm', '0528969799', 'Lê Quỳnh Lan', 'https://vinhquang.com.vn', 'Tạm ngưng', '0283517982', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Vinh Quang Tower, 165 Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(782, 'KH-2639', 'business', 'Tập đoàn Khải Hoàn Thời trang', 'Tập đoàn Khải Hoàn Thời trang', '0831431407', 'Lý Tuấn Trung', 'https://khaihoan.com.vn', 'Tạm ngưng', '0243508699', 'contact@khaihoan.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Khải Hoàn Tower, 71 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(783, 'KH-57A9', 'business', 'Hợp tác xã Đại Nam', 'Hợp tác xã Đại Nam', '0516731605', 'Phạm Mai Chi', 'https://dainam.com.vn', 'Đang hoạt động', '0813598653', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Đại Nam Tower, 212 Điện Biên Phủ, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(784, 'KH-F2F0', 'business', 'Doanh nghiệp Tư nhân Hồng Hà', 'Doanh nghiệp Tư nhân Hồng Hà', '0125887180', 'Đỗ Tuấn Đạt', 'https://hongha.com.vn', 'NNT đang hoạt động', '0243727136', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Hồng Hà Tower, 149 Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(785, 'KH-E6CD', 'business', 'Doanh nghiệp Tư nhân Vinh Quang', 'Doanh nghiệp Tư nhân Vinh Quang', '0714002586', 'Vũ Xuân Hải', 'https://vinhquang.com.vn', 'Tạm ngưng', '0243187018', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Vinh Quang Tower, 236 Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(786, 'KH-47FC', 'business', 'Tập đoàn Trường Sơn', 'Tập đoàn Trường Sơn', '0195432611', 'Ngô Lan Trang', 'https://truongson.com.vn', 'Ngừng hoạt động', '0283155420', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Trường Sơn Tower, 31 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(787, 'KH-40C0', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0653672680', 'Hoàng Anh Tiến', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0283805657', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Vạn Xuân Tower, 223 Cách Mạng Tháng Tám, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(788, 'KH-4C1B', 'business', 'Công ty TNHH MTV Đất Việt', 'Công ty TNHH MTV Đất Việt', '0324033408', 'Lâm Tiến Minh', 'https://datviet.com.vn', 'NNT đang hoạt động', '0283597074', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Đất Việt Tower, 228 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(789, 'KH-5F27', 'business', 'Công ty Cổ phần Nam Á Vận tải', 'Công ty Cổ phần Nam Á Vận tải', '0582718963', 'Phan Trọng Sơn', 'https://nama.com.vn', 'NNT đang hoạt động', '0283339933', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Nam Á Tower, 59 Trần Hưng Đạo, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(790, 'KH-70AC', 'business', 'Tập đoàn Minh Đăng', 'Tập đoàn Minh Đăng', '0249632705', 'Lâm Trọng Kiệt', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0283132208', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Minh Đăng Tower, 109 Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(791, 'KH-4BC7', 'business', 'Hợp tác xã Minh Đăng Vận tải', 'Hợp tác xã Minh Đăng Vận tải', '0506010109', 'Phan Hữu Trung', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0283299857', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Minh Đăng Tower, 34 Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(792, 'KH-009C', 'business', 'Hợp tác xã Hoa Sen Sản xuất', 'Hợp tác xã Hoa Sen Sản xuất', '0877948058', 'Lâm Thị Liên', 'https://hoasen.com.vn', 'Tạm ngưng', '0243323709', 'contact@hoasen.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Hoa Sen Tower, 133 Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(793, 'KH-6C6B', 'business', 'Công ty Cổ phần Sông Hồng Du lịch', 'Công ty Cổ phần Sông Hồng Du lịch', '0445871936', 'Đinh Tiến Bảo', 'https://songhong.com.vn', 'Ngừng hoạt động', '0947232996', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Sông Hồng Tower, 203 Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(794, 'KH-A9CF', 'business', 'Công ty TNHH Khải Hoàn', 'Công ty TNHH Khải Hoàn', '0266853911', 'Đặng Diệu Nhi', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0283601879', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Khải Hoàn Tower, 46 Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(795, 'KH-4633', 'business', 'Công ty TNHH Hải Đăng Thời trang', 'Công ty TNHH Hải Đăng Thời trang', '0418827045', 'Lâm Cát Linh', 'https://haidang.com.vn', 'Đang hoạt động', '0397966740', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Hải Đăng Tower, 221 Lý Tự Trọng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(796, 'KH-4EA2', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0297383692', 'Vũ Tiến Nam', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0243422826', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Vạn Xuân Tower, 177 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(797, 'KH-1424', 'business', 'Công ty Cổ phần Minh Đăng Bất động sản', 'Công ty Cổ phần Minh Đăng Bất động sản', '0962917362', 'Hồ Lan Hoa', 'https://minhdang.com.vn', 'Tạm ngưng', '0283842349', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Minh Đăng Tower, 94 Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(798, 'KH-69E8', 'business', 'Công ty TNHH Hồng Hà Dịch vụ', 'Công ty TNHH Hồng Hà Dịch vụ', '0766467000', 'Mai Hữu Tuấn', 'https://hongha.com.vn', 'Tạm ngưng', '0283463531', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Hồng Hà Tower, 224 Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(799, 'KH-6D42', 'business', 'Công ty TNHH Nam Á', 'Công ty TNHH Nam Á', '0928011173', 'Dương Cẩm Hằng', 'https://nama.com.vn', 'Tạm ngưng', '0853490042', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Nam Á Tower, 1 Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(800, 'KH-8C8B', 'business', 'Công ty TNHH MTV Hoa Sen Truyền thông', 'Công ty TNHH MTV Hoa Sen Truyền thông', '0962063545', 'Hồ Minh Anh', 'https://hoasen.com.vn', 'NNT đang hoạt động', '0283147189', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Hoa Sen Tower, 110 Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(801, 'KH-A4CB', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0724772668', 'Đỗ Bảo Phúc', 'https://cuulong.com.vn', 'Đang hoạt động', '0243413481', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Cửu Long Tower, 16 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(802, 'KH-C7F8', 'business', 'Tập đoàn Hòa Bình Vận tải', 'Tập đoàn Hòa Bình Vận tải', '0341946697', 'Vũ Thị Vân', 'https://hoabinh.com.vn', 'Tạm ngưng', '0243044352', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Hòa Bình Tower, 1 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(803, 'KH-A9BD', 'business', 'Công ty Cổ phần Việt Á', 'Công ty Cổ phần Việt Á', '0488136469', 'Dương Hoàng Phong', 'https://vieta.com.vn', 'Ngừng hoạt động', '0243676649', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Việt Á Tower, 152 Lê Lợi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(804, 'KH-7B95', 'business', 'Công ty TNHH Nam Á', 'Công ty TNHH Nam Á', '0575678964', 'Lý Mai Hà', 'https://nama.com.vn', 'Tạm ngưng', '0243341828', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Nam Á Tower, 115 Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(805, 'KH-A498', 'business', 'Doanh nghiệp Tư nhân Nam Á Giáo dục', 'Doanh nghiệp Tư nhân Nam Á Giáo dục', '0540543981', 'Võ Tuyết Thu', 'https://nama.com.vn', 'NNT đang hoạt động', '0283649530', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Nam Á Tower, 203 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(806, 'KH-3944', 'business', 'Công ty TNHH MTV Hoa Sen', 'Công ty TNHH MTV Hoa Sen', '0798834228', 'Võ Đức Minh', 'https://hoasen.com.vn', 'NNT đang hoạt động', '0243520762', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Hoa Sen Tower, 75 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(807, 'KH-0345', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0231347567', 'Ngô Duy Bình', 'https://truongson.com.vn', 'Đang hoạt động', '0283810117', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 6 Tòa nhà Trường Sơn Tower, 241 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(808, 'KH-2577', 'business', 'Hợp tác xã Tân Á', 'Hợp tác xã Tân Á', '0438708102', 'Hồ Duy Sơn', 'https://tana.com.vn', 'NNT đang hoạt động', '0243607118', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Tân Á Tower, 115 Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(809, 'KH-3AD2', 'business', 'Công ty Cổ phần Minh Đăng Bất động sản', 'Công ty Cổ phần Minh Đăng Bất động sản', '0238279819', 'Nguyễn Ngọc An', 'https://minhdang.com.vn', 'NNT đang hoạt động', '0283267738', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Minh Đăng Tower, 249 Điện Biên Phủ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(810, 'KH-B2EF', 'business', 'Công ty TNHH MTV An Phát Thời trang', 'Công ty TNHH MTV An Phát Thời trang', '0316003549', 'Đinh Mai Thảo', 'https://anphat.com.vn', 'Tạm ngưng', '0243028329', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà An Phát Tower, 183 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(811, 'KH-4955', 'business', 'Hợp tác xã Đất Việt Thời trang', 'Hợp tác xã Đất Việt Thời trang', '0680499304', 'Lâm Hoài Hạnh', 'https://datviet.com.vn', 'NNT đang hoạt động', '0283368812', 'contact@datviet.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Đất Việt Tower, 235 Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(812, 'KH-8B6D', 'business', 'Công ty Cổ phần An Phát', 'Công ty Cổ phần An Phát', '0459084683', 'Đỗ Hoàng Kiệt', 'https://anphat.com.vn', 'NNT đang hoạt động', '0283954378', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà An Phát Tower, 218 Hai Bà Trưng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(813, 'KH-7704', 'business', 'Công ty TNHH An Phát', 'Công ty TNHH An Phát', '0351727669', 'Mai Minh Tùng', 'https://anphat.com.vn', 'Đang hoạt động', '0709462948', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà An Phát Tower, 134 Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(814, 'KH-FBE8', 'business', 'Hợp tác xã Trường Sơn Cơ khí', 'Hợp tác xã Trường Sơn Cơ khí', '0438513088', 'Đặng Cát Cúc', 'https://truongson.com.vn', 'Ngừng hoạt động', '0910659247', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Trường Sơn Tower, 154 Nguyễn Huệ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(815, 'KH-F427', 'business', 'Hợp tác xã Tiến Phong Giáo dục', 'Hợp tác xã Tiến Phong Giáo dục', '0305989275', 'Trần Phương Trúc', 'https://tienphong.com.vn', 'Tạm ngưng', '0397603811', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Tiến Phong Tower, 70 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(816, 'KH-F411', 'business', 'Công ty Cổ phần An Phát Xây dựng', 'Công ty Cổ phần An Phát Xây dựng', '0562026881', 'Nguyễn Văn Nam', 'https://anphat.com.vn', 'NNT đang hoạt động', '0243785673', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà An Phát Tower, 244 Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(817, 'KH-786A', 'business', 'Hợp tác xã Tiến Phong Xây dựng', 'Hợp tác xã Tiến Phong Xây dựng', '0888382431', 'Vũ Mai Mai', 'https://tienphong.com.vn', 'Tạm ngưng', '0839410233', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Tiến Phong Tower, 19 Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(818, 'KH-37BA', 'business', 'Doanh nghiệp Tư nhân Cửu Long', 'Doanh nghiệp Tư nhân Cửu Long', '0372882317', 'Ngô Quỳnh Lan', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0243676955', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Cửu Long Tower, 111 Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(819, 'KH-9696', 'business', 'Công ty TNHH Kim Đô Du lịch', 'Công ty TNHH Kim Đô Du lịch', '0770420621', 'Ngô Quỳnh Lan', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0363725484', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Kim Đô Tower, 25 Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(820, 'KH-026B', 'business', 'Công ty TNHH MTV Kim Đô Công nghệ', 'Công ty TNHH MTV Kim Đô Công nghệ', '0169972047', 'Lý Mai My', 'https://kimdo.com.vn', 'Đang hoạt động', '0397529588', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Kim Đô Tower, 70 Điện Biên Phủ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(821, 'KH-DF50', 'business', 'Công ty TNHH Tân Á Vận tải', 'Công ty TNHH Tân Á Vận tải', '0284626872', 'Nguyễn Quang Tùng', 'https://tana.com.vn', 'Đang hoạt động', '0283807133', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Tân Á Tower, 180 Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(822, 'KH-B4F8', 'business', 'Công ty TNHH Hồng Hà', 'Công ty TNHH Hồng Hà', '0106337064', 'Lê Quỳnh Giang', 'https://hongha.com.vn', 'Đang hoạt động', '0243508899', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Hồng Hà Tower, 136 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(823, 'KH-FD12', 'business', 'Tập đoàn Vạn Xuân Đầu tư', 'Tập đoàn Vạn Xuân Đầu tư', '0555645379', 'Lâm Quỳnh An', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0939440238', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Vạn Xuân Tower, 60 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(824, 'KH-30DD', 'business', 'Tập đoàn Vinh Quang Thời trang', 'Tập đoàn Vinh Quang Thời trang', '0832845620', 'Huỳnh Tuấn Việt', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0388377617', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Vinh Quang Tower, 1 Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(825, 'KH-DFE7', 'business', 'Tập đoàn Tiến Phong Dịch vụ', 'Tập đoàn Tiến Phong Dịch vụ', '0878985663', 'Huỳnh Quỳnh Thu', 'https://tienphong.com.vn', 'Tạm ngưng', '0398207444', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Tiến Phong Tower, 6 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(826, 'KH-D64E', 'business', 'Hợp tác xã Thái Bình Dương', 'Hợp tác xã Thái Bình Dương', '0351009869', 'Mai Khánh Trinh', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0963991210', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Thái Bình Dương Tower, 85 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(827, 'KH-712E', 'business', 'Tập đoàn Hòa Bình', 'Tập đoàn Hòa Bình', '0103128932', 'Đặng Cát Quỳnh', 'https://hoabinh.com.vn', 'Tạm ngưng', '0283223559', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Hòa Bình Tower, 131 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(828, 'KH-3922', 'business', 'Doanh nghiệp Tư nhân Kim Đô Thương mại', 'Doanh nghiệp Tư nhân Kim Đô Thương mại', '0846061982', 'Phan Hồng Giang', 'https://kimdo.com.vn', 'NNT đang hoạt động', '0369753271', 'contact@kimdo.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Kim Đô Tower, 46 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(829, 'KH-AE7F', 'business', 'Hợp tác xã Tân Á', 'Hợp tác xã Tân Á', '0800540465', 'Hồ Diệu Dung', 'https://tana.com.vn', 'Ngừng hoạt động', '0283288158', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Tân Á Tower, 189 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(830, 'KH-313C', 'business', 'Tập đoàn Việt Á', 'Tập đoàn Việt Á', '0555368683', 'Phùng Ngọc Liên', 'https://vieta.com.vn', 'Ngừng hoạt động', '0283565958', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Việt Á Tower, 74 Hai Bà Trưng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(831, 'KH-1F4B', 'business', 'Công ty TNHH MTV Tiến Phong Bất động sản', 'Công ty TNHH MTV Tiến Phong Bất động sản', '0526917055', 'Nguyễn Như Linh', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0243302191', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Tiến Phong Tower, 202 Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(832, 'KH-0442', 'business', 'Công ty Cổ phần Vạn Xuân Truyền thông', 'Công ty Cổ phần Vạn Xuân Truyền thông', '0141433583', 'Phạm Bích An', 'https://vanxuan.com.vn', 'Tạm ngưng', '0243565927', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Vạn Xuân Tower, 41 Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(833, 'KH-A3E8', 'business', 'Doanh nghiệp Tư nhân Minh Đăng Công nghệ', 'Doanh nghiệp Tư nhân Minh Đăng Công nghệ', '0660140940', 'Dương Quỳnh Oanh', 'https://minhdang.com.vn', 'Đang hoạt động', '0243203356', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Minh Đăng Tower, 241 Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(834, 'KH-7BA8', 'business', 'Công ty TNHH MTV An Phát', 'Công ty TNHH MTV An Phát', '0881077311', 'Võ Cát Thảo', 'https://anphat.com.vn', 'Đang hoạt động', '0243694740', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà An Phát Tower, 226 Nguyễn Huệ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(835, 'KH-A1E9', 'business', 'Hợp tác xã Việt Á Giáo dục', 'Hợp tác xã Việt Á Giáo dục', '0280744895', 'Mai Duy Tiến', 'https://vieta.com.vn', 'Đang hoạt động', '0339330312', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Việt Á Tower, 58 Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(836, 'KH-9A4E', 'business', 'Công ty Cổ phần Kim Đô', 'Công ty Cổ phần Kim Đô', '0660279479', 'Hoàng Thành Kiệt', 'https://kimdo.com.vn', 'Tạm ngưng', '0283621641', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Kim Đô Tower, 38 Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(837, 'KH-AA01', 'business', 'Công ty TNHH Nam Á Thương mại', 'Công ty TNHH Nam Á Thương mại', '0740754841', 'Đặng Thảo Thu', 'https://nama.com.vn', 'Tạm ngưng', '0323717202', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Nam Á Tower, 39 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(838, 'KH-BDBD', 'business', 'Công ty Cổ phần Đại Nam Du lịch', 'Công ty Cổ phần Đại Nam Du lịch', '0295204671', 'Hoàng Tuyết Hạnh', 'https://dainam.com.vn', 'Tạm ngưng', '0243394426', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Đại Nam Tower, 139 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(839, 'KH-9704', 'business', 'Doanh nghiệp Tư nhân Hoàng Gia', 'Doanh nghiệp Tư nhân Hoàng Gia', '0961131072', 'Dương Trọng Thịnh', 'https://hoanggia.com.vn', 'Tạm ngưng', '0283891426', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Hoàng Gia Tower, 91 Trần Hưng Đạo, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(840, 'KH-0809', 'business', 'Doanh nghiệp Tư nhân Đất Việt Bất động sản', 'Doanh nghiệp Tư nhân Đất Việt Bất động sản', '0552849454', 'Dương Trọng Minh', 'https://datviet.com.vn', 'Tạm ngưng', '0840176177', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Đất Việt Tower, 129 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(841, 'KH-1787', 'business', 'Công ty Cổ phần Tân Á', 'Công ty Cổ phần Tân Á', '0181199340', 'Lê Quang Anh', 'https://tana.com.vn', 'Đang hoạt động', '0283880717', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Tân Á Tower, 33 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(842, 'KH-1BBF', 'business', 'Hợp tác xã Cửu Long', 'Hợp tác xã Cửu Long', '0542750076', 'Đinh Quốc Tùng', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0330356237', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Cửu Long Tower, 67 Đồng Khởi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(843, 'KH-3C96', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0445019074', 'Lê Mai Hà', 'https://hoabinh.com.vn', 'Ngừng hoạt động', '0243111837', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Hòa Bình Tower, 4 Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(844, 'KH-F710', 'business', 'Hợp tác xã Minh Đăng', 'Hợp tác xã Minh Đăng', '0967319355', 'Ngô Thành Bình', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0821584649', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Minh Đăng Tower, 127 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(845, 'KH-31BF', 'business', 'Hợp tác xã Hòa Bình Thời trang', 'Hợp tác xã Hòa Bình Thời trang', '0701133373', 'Hồ Hoài My', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0885030851', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Hòa Bình Tower, 190 Lý Tự Trọng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(846, 'KH-80CE', 'business', 'Hợp tác xã Đại Nam', 'Hợp tác xã Đại Nam', '0537506851', 'Phan Anh Cường', 'https://dainam.com.vn', 'Đang hoạt động', '0243607669', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Đại Nam Tower, 96 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(847, 'KH-8689', 'business', 'Doanh nghiệp Tư nhân Thái Bình Dương', 'Doanh nghiệp Tư nhân Thái Bình Dương', '0506963597', 'Lê Mạnh Thái', 'https://thaibinhduong.com.vn', 'Ngừng hoạt động', '0283763317', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Thái Bình Dương Tower, 237 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(848, 'KH-F54C', 'business', 'Tập đoàn Thái Bình Dương Dịch vụ', 'Tập đoàn Thái Bình Dương Dịch vụ', '0447647314', 'Hoàng Mai Nhi', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0283602556', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Thái Bình Dương Tower, 208 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(849, 'KH-86CD', 'business', 'Hợp tác xã Minh Đăng', 'Hợp tác xã Minh Đăng', '0760615912', 'Đinh Như Phượng', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0374656799', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Minh Đăng Tower, 191 Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(850, 'KH-951C', 'business', 'Công ty Cổ phần Trường Giang', 'Công ty Cổ phần Trường Giang', '0894225309', 'Lâm Tuấn Hải', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0396782075', 'contact@truonggiang.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Trường Giang Tower, 224 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(851, 'KH-6596', 'business', 'Tập đoàn Khải Hoàn Truyền thông', 'Tập đoàn Khải Hoàn Truyền thông', '0553543840', 'Trần Khánh Giang', 'https://khaihoan.com.vn', 'Tạm ngưng', '0397955861', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Khải Hoàn Tower, 30 Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(852, 'KH-E382', 'business', 'Hợp tác xã Nam Á Đầu tư', 'Hợp tác xã Nam Á Đầu tư', '0933901227', 'Lê Hoàng Đông', 'https://nama.com.vn', 'NNT đang hoạt động', '0915065783', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 9 Tòa nhà Nam Á Tower, 34 Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(853, 'KH-09D2', 'business', 'Công ty TNHH MTV Sao Mai', 'Công ty TNHH MTV Sao Mai', '0940556523', 'Trần Khánh Trinh', 'https://saomai.com.vn', 'Đang hoạt động', '0243482876', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Sao Mai Tower, 46 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(854, 'KH-FD45', 'business', 'Công ty TNHH Thái Bình Dương', 'Công ty TNHH Thái Bình Dương', '0822142798', 'Đinh Khánh Tuyền', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0283659207', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Thái Bình Dương Tower, 125 Lê Lợi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(855, 'KH-269B', 'business', 'Tập đoàn Thành Công', 'Tập đoàn Thành Công', '0612639009', 'Huỳnh Minh Tùng', 'https://thanhcong.com.vn', 'Đang hoạt động', '0842402906', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Thành Công Tower, 179 Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(856, 'KH-CDD3', 'business', 'Doanh nghiệp Tư nhân Hoa Sen', 'Doanh nghiệp Tư nhân Hoa Sen', '0303636093', 'Lý Anh Hoàng', 'https://hoasen.com.vn', 'Đang hoạt động', '0243402173', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Hoa Sen Tower, 123 Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(857, 'KH-4E77', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0873827498', 'Lâm Cẩm Hương', 'https://hongha.com.vn', 'Tạm ngưng', '0283665578', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Hồng Hà Tower, 52 Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(858, 'KH-17BC', 'business', 'Doanh nghiệp Tư nhân Thành Công Cơ khí', 'Doanh nghiệp Tư nhân Thành Công Cơ khí', '0128328589', 'Mai Quốc Phong', 'https://thanhcong.com.vn', 'Tạm ngưng', '0334383618', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Thành Công Tower, 246 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(859, 'KH-27EB', 'business', 'Tập đoàn Nam Á', 'Tập đoàn Nam Á', '0363097862', 'Phùng Mai Quỳnh', 'https://nama.com.vn', 'Ngừng hoạt động', '0283108303', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Nam Á Tower, 212 Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(860, 'KH-28E1', 'business', 'Công ty TNHH MTV Hải Đăng Bất động sản', 'Công ty TNHH MTV Hải Đăng Bất động sản', '0794590761', 'Lâm Như Phượng', 'https://haidang.com.vn', 'NNT đang hoạt động', '0707491701', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Hải Đăng Tower, 189 Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(861, 'KH-8DA4', 'business', 'Công ty Cổ phần Cửu Long Đầu tư', 'Công ty Cổ phần Cửu Long Đầu tư', '0140124229', 'Phạm Hồng Giang', 'https://cuulong.com.vn', 'NNT đang hoạt động', '0830757164', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Cửu Long Tower, 218 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(862, 'KH-6A5D', 'business', 'Tập đoàn Trường Giang', 'Tập đoàn Trường Giang', '0958591028', 'Phạm Cát Anh', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0912292514', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Trường Giang Tower, 85 Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(863, 'KH-AFB9', 'business', 'Công ty Cổ phần Sao Mai', 'Công ty Cổ phần Sao Mai', '0211683941', 'Hoàng Hoài Linh', 'https://saomai.com.vn', 'Đang hoạt động', '0283709052', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Sao Mai Tower, 224 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(864, 'KH-FFEE', 'business', 'Doanh nghiệp Tư nhân Khải Hoàn', 'Doanh nghiệp Tư nhân Khải Hoàn', '0139415914', 'Mai Hồng Hạnh', 'https://khaihoan.com.vn', 'Ngừng hoạt động', '0938282927', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Khải Hoàn Tower, 133 Nguyễn Huệ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(865, 'KH-7831', 'business', 'Công ty TNHH Hồng Hà Năng lượng', 'Công ty TNHH Hồng Hà Năng lượng', '0528327398', 'Hồ Minh Nam', 'https://hongha.com.vn', 'Ngừng hoạt động', '0842624415', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Hồng Hà Tower, 185 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(866, 'KH-43D2', 'business', 'Công ty TNHH MTV Tiến Phong', 'Công ty TNHH MTV Tiến Phong', '0161467801', 'Đỗ Cẩm Hương', 'https://tienphong.com.vn', 'Tạm ngưng', '0771989130', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Tiến Phong Tower, 38 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(867, 'KH-4BD8', 'business', 'Công ty TNHH Khải Hoàn Thương mại', 'Công ty TNHH Khải Hoàn Thương mại', '0587288231', 'Mai Thị Giang', 'https://khaihoan.com.vn', 'Tạm ngưng', '0776806943', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 1 Tòa nhà Khải Hoàn Tower, 79 Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(868, 'KH-0FAE', 'business', 'Công ty Cổ phần Hải Đăng', 'Công ty Cổ phần Hải Đăng', '0371512475', 'Phùng Tiến Huy', 'https://haidang.com.vn', 'Tạm ngưng', '0343751040', 'contact@haidang.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Hải Đăng Tower, 31 Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(869, 'KH-C97F', 'business', 'Tập đoàn Đại Nam', 'Tập đoàn Đại Nam', '0172455998', 'Huỳnh Thu Thu', 'https://dainam.com.vn', 'Ngừng hoạt động', '0395624987', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Đại Nam Tower, 30 Lê Duẩn, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(870, 'KH-9133', 'business', 'Doanh nghiệp Tư nhân Khải Hoàn Giáo dục', 'Doanh nghiệp Tư nhân Khải Hoàn Giáo dục', '0861974310', 'Ngô Thu Trang', 'https://khaihoan.com.vn', 'NNT đang hoạt động', '0940502337', 'contact@khaihoan.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Khải Hoàn Tower, 197 Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(871, 'KH-AB85', 'business', 'Tập đoàn Hoàng Gia Bất động sản', 'Tập đoàn Hoàng Gia Bất động sản', '0158581614', 'Lê Hoàng Tiến', 'https://hoanggia.com.vn', 'NNT đang hoạt động', '0283921791', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hoàng Gia Tower, 43 Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(872, 'KH-1B63', 'business', 'Doanh nghiệp Tư nhân Cửu Long Thương mại', 'Doanh nghiệp Tư nhân Cửu Long Thương mại', '0304082990', 'Phạm Mai Thảo', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0283768004', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Cửu Long Tower, 14 Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(873, 'KH-3FAA', 'business', 'Doanh nghiệp Tư nhân Hải Đăng Năng lượng', 'Doanh nghiệp Tư nhân Hải Đăng Năng lượng', '0410931276', 'Nguyễn Lan Liên', 'https://haidang.com.vn', 'Ngừng hoạt động', '0847861378', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Hải Đăng Tower, 137 Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(874, 'KH-A6E7', 'business', 'Công ty TNHH Vạn Xuân Giáo dục', 'Công ty TNHH Vạn Xuân Giáo dục', '0415855615', 'Đỗ Mạnh Hoàng', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0322066969', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Vạn Xuân Tower, 62 Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(875, 'KH-F06A', 'business', 'Công ty Cổ phần Đông Dương Đầu tư', 'Công ty Cổ phần Đông Dương Đầu tư', '0218450870', 'Võ Xuân Nam', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0858553409', 'contact@dongduong.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Đông Dương Tower, 221 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(876, 'KH-7D2F', 'business', 'Công ty TNHH Nam Á', 'Công ty TNHH Nam Á', '0917625464', 'Phạm Tiến Thái', 'https://nama.com.vn', 'Tạm ngưng', '0243247688', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Nam Á Tower, 78 Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(877, 'KH-D81A', 'business', 'Công ty TNHH MTV Kim Đô Thời trang', 'Công ty TNHH MTV Kim Đô Thời trang', '0421622859', 'Lâm Thành Việt', 'https://kimdo.com.vn', 'Đang hoạt động', '0283645023', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Kim Đô Tower, 236 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(878, 'KH-9BD3', 'business', 'Công ty TNHH MTV Minh Đăng', 'Công ty TNHH MTV Minh Đăng', '0464137606', 'Ngô Cát Trang', 'https://minhdang.com.vn', 'Đang hoạt động', '0785700456', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Minh Đăng Tower, 230 Hai Bà Trưng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(879, 'KH-7467', 'business', 'Doanh nghiệp Tư nhân Hoàng Gia', 'Doanh nghiệp Tư nhân Hoàng Gia', '0628266926', 'Lý Phương Oanh', 'https://hoanggia.com.vn', 'Tạm ngưng', '0814721595', 'contact@hoanggia.com.vn', NULL, 'Nữ', 'Tầng 5 Tòa nhà Hoàng Gia Tower, 184 Phan Châu Trinh, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(880, 'KH-B288', 'business', 'Tập đoàn Hoa Sen Du lịch', 'Tập đoàn Hoa Sen Du lịch', '0755194516', 'Nguyễn Minh Nam', 'https://hoasen.com.vn', 'Tạm ngưng', '0764191840', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Hoa Sen Tower, 249 Lê Lợi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(881, 'KH-1C68', 'business', 'Công ty TNHH Hải Đăng Sản xuất', 'Công ty TNHH Hải Đăng Sản xuất', '0950944290', 'Vũ Hồng Trang', 'https://haidang.com.vn', 'Ngừng hoạt động', '0975132616', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Hải Đăng Tower, 172 Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(882, 'KH-1911', 'business', 'Công ty TNHH Hồng Hà Công nghệ', 'Công ty TNHH Hồng Hà Công nghệ', '0936586403', 'Phan Quỳnh Hoa', 'https://hongha.com.vn', 'NNT đang hoạt động', '0963707943', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Hồng Hà Tower, 161 Đồng Khởi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(883, 'KH-B353', 'business', 'Công ty TNHH MTV Vinh Quang Đầu tư', 'Công ty TNHH MTV Vinh Quang Đầu tư', '0561363163', 'Lâm Quang Hùng', 'https://vinhquang.com.vn', 'Tạm ngưng', '0847374337', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Vinh Quang Tower, 64 Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(884, 'KH-CEFB', 'business', 'Doanh nghiệp Tư nhân Vinh Quang Đầu tư', 'Doanh nghiệp Tư nhân Vinh Quang Đầu tư', '0922446677', 'Vũ Cẩm Đào', 'https://vinhquang.com.vn', 'Tạm ngưng', '0283655510', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Vinh Quang Tower, 250 Trần Hưng Đạo, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(885, 'KH-A33B', 'business', 'Công ty Cổ phần Sao Mai', 'Công ty Cổ phần Sao Mai', '0548031984', 'Hồ Bích Hạnh', 'https://saomai.com.vn', 'Tạm ngưng', '0243597056', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Sao Mai Tower, 166 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(886, 'KH-7A4A', 'business', 'Công ty TNHH Vạn Xuân Đầu tư', 'Công ty TNHH Vạn Xuân Đầu tư', '0893144173', 'Đặng Diệu Cúc', 'https://vanxuan.com.vn', 'Tạm ngưng', '0283072216', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Vạn Xuân Tower, 132 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(887, 'KH-5BAC', 'business', 'Công ty TNHH Hòa Bình', 'Công ty TNHH Hòa Bình', '0250162149', 'Phùng Bảo Kiệt', 'https://hoabinh.com.vn', 'Đang hoạt động', '0831486397', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hòa Bình Tower, 117 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(888, 'KH-1EDE', 'business', 'Hợp tác xã Đại Việt Truyền thông', 'Hợp tác xã Đại Việt Truyền thông', '0156098410', 'Nguyễn Tiến Nam', 'https://daiviet.com.vn', 'Tạm ngưng', '0283886218', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Đại Việt Tower, 48 Điện Biên Phủ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(889, 'KH-A82F', 'business', 'Hợp tác xã Thịnh Phát Xây dựng', 'Hợp tác xã Thịnh Phát Xây dựng', '0956694706', 'Huỳnh Bảo Khoa', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0962122706', 'contact@thinhphat.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Thịnh Phát Tower, 90 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(890, 'KH-90CB', 'business', 'Tập đoàn Nam Á Du lịch', 'Tập đoàn Nam Á Du lịch', '0701690088', 'Hoàng Quốc Tuấn', 'https://nama.com.vn', 'Đang hoạt động', '0361057255', 'contact@nama.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Nam Á Tower, 226 Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(891, 'KH-C61A', 'business', 'Công ty TNHH MTV Trường Sơn', 'Công ty TNHH MTV Trường Sơn', '0740438335', 'Lý Hoài Hương', 'https://truongson.com.vn', 'Tạm ngưng', '0793234379', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Trường Sơn Tower, 191 Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(892, 'KH-5BEE', 'business', 'Công ty Cổ phần Trường Sơn', 'Công ty Cổ phần Trường Sơn', '0696444524', 'Mai Ngọc Trang', 'https://truongson.com.vn', 'Đang hoạt động', '0243782299', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Trường Sơn Tower, 142 Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(893, 'KH-6327', 'business', 'Doanh nghiệp Tư nhân Việt Á Dịch vụ', 'Doanh nghiệp Tư nhân Việt Á Dịch vụ', '0826851792', 'Hồ Tiến Đông', 'https://vieta.com.vn', 'Đang hoạt động', '0243314486', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Việt Á Tower, 215 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(894, 'KH-2B4F', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0292703232', 'Dương Hoàng Hải', 'https://cuulong.com.vn', 'Tạm ngưng', '0243108033', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Cửu Long Tower, 211 Nguyễn Trãi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(895, 'KH-B25D', 'business', 'Tập đoàn Minh Đăng Du lịch', 'Tập đoàn Minh Đăng Du lịch', '0308280191', 'Dương Thảo Vy', 'https://minhdang.com.vn', 'Đang hoạt động', '0243438463', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Minh Đăng Tower, 239 Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(896, 'KH-62F7', 'business', 'Công ty TNHH Việt Á Sản xuất', 'Công ty TNHH Việt Á Sản xuất', '0860300554', 'Ngô Hữu Trung', 'https://vieta.com.vn', 'Ngừng hoạt động', '0765767279', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Việt Á Tower, 9 Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(897, 'KH-249D', 'business', 'Doanh nghiệp Tư nhân Cửu Long Vận tải', 'Doanh nghiệp Tư nhân Cửu Long Vận tải', '0252249671', 'Hoàng Hữu Thái', 'https://cuulong.com.vn', 'Đang hoạt động', '0349148155', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Cửu Long Tower, 31 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(898, 'KH-E608', 'business', 'Hợp tác xã Sao Mai Du lịch', 'Hợp tác xã Sao Mai Du lịch', '0692927109', 'Đinh Thành Dũng', 'https://saomai.com.vn', 'Đang hoạt động', '0243753325', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Sao Mai Tower, 70 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(899, 'KH-4850', 'business', 'Công ty TNHH MTV Thành Công Vận tải', 'Công ty TNHH MTV Thành Công Vận tải', '0768710651', 'Võ Thị Phương', 'https://thanhcong.com.vn', 'Tạm ngưng', '0702765243', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Thành Công Tower, 224 Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(900, 'KH-9C0C', 'business', 'Doanh nghiệp Tư nhân Sông Hồng', 'Doanh nghiệp Tư nhân Sông Hồng', '0854115441', 'Đỗ Quang Minh', 'https://songhong.com.vn', 'Đang hoạt động', '0851913295', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Sông Hồng Tower, 103 Điện Biên Phủ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(901, 'KH-7E08', 'business', 'Công ty Cổ phần Thái Bình Dương', 'Công ty Cổ phần Thái Bình Dương', '0895490170', 'Hoàng Minh Giang', 'https://thaibinhduong.com.vn', 'Tạm ngưng', '0386940439', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Thái Bình Dương Tower, 55 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:18', '2026-05-30 23:02:18'),
(902, 'KH-C194', 'business', 'Hợp tác xã Sao Mai Năng lượng', 'Hợp tác xã Sao Mai Năng lượng', '0579821378', 'Phùng Mạnh Vinh', 'https://saomai.com.vn', 'Tạm ngưng', '0283466357', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Sao Mai Tower, 166 Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(903, 'KH-99BC', 'business', 'Công ty Cổ phần Sao Mai Công nghệ', 'Công ty Cổ phần Sao Mai Công nghệ', '0505901942', 'Lý Quỳnh Dung', 'https://saomai.com.vn', 'Đang hoạt động', '0969066220', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Sao Mai Tower, 210 Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(904, 'KH-1F44', 'business', 'Công ty Cổ phần Thành Công Giáo dục', 'Công ty Cổ phần Thành Công Giáo dục', '0647981895', 'Bùi Quỳnh Trúc', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0283228440', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Thành Công Tower, 235 Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(905, 'KH-A83B', 'business', 'Hợp tác xã Đất Việt Vận tải', 'Hợp tác xã Đất Việt Vận tải', '0698539398', 'Đặng Quang Sơn', 'https://datviet.com.vn', 'Đang hoạt động', '0903600148', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Đất Việt Tower, 48 Lê Duẩn, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(906, 'KH-DDCC', 'business', 'Tập đoàn Thành Công Truyền thông', 'Tập đoàn Thành Công Truyền thông', '0884349954', 'Ngô Quỳnh My', 'https://thanhcong.com.vn', 'Tạm ngưng', '0243607268', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Thành Công Tower, 204 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(907, 'KH-32EE', 'business', 'Hợp tác xã Vinh Quang', 'Hợp tác xã Vinh Quang', '0275866701', 'Hoàng Hoài Liên', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0243429736', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Vinh Quang Tower, 135 Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(908, 'KH-C6FB', 'business', 'Công ty Cổ phần Kim Đô Sản xuất', 'Công ty Cổ phần Kim Đô Sản xuất', '0323130490', 'Đặng Quốc Huy', 'https://kimdo.com.vn', 'Tạm ngưng', '0353691484', 'contact@kimdo.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Kim Đô Tower, 222 Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(909, 'KH-CB62', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0782475418', 'Lê Cẩm Ngọc', 'https://hongha.com.vn', 'Tạm ngưng', '0283663992', 'contact@hongha.com.vn', NULL, 'Nữ', 'Tầng 10 Tòa nhà Hồng Hà Tower, 109 Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(910, 'KH-2ACD', 'business', 'Hợp tác xã Sao Mai Bất động sản', 'Hợp tác xã Sao Mai Bất động sản', '0617896380', 'Đỗ Hoàng Vinh', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283018087', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Sao Mai Tower, 127 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(911, 'KH-5250', 'business', 'Tập đoàn Đông Dương', 'Tập đoàn Đông Dương', '0498659397', 'Trần Ngọc Trúc', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0853727475', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 7 Tòa nhà Đông Dương Tower, 164 Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(912, 'KH-FA5C', 'business', 'Doanh nghiệp Tư nhân Vinh Quang', 'Doanh nghiệp Tư nhân Vinh Quang', '0955821332', 'Ngô Mạnh Dũng', 'https://vinhquang.com.vn', 'Tạm ngưng', '0243702660', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Vinh Quang Tower, 221 Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(913, 'KH-5E47', 'business', 'Công ty TNHH MTV Vinh Quang Truyền thông', 'Công ty TNHH MTV Vinh Quang Truyền thông', '0599842390', 'Lý Cẩm Trinh', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0365088904', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Vinh Quang Tower, 22 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(914, 'KH-FB0C', 'business', 'Tập đoàn Đại Việt Cơ khí', 'Tập đoàn Đại Việt Cơ khí', '0108422654', 'Mai Anh Cường', 'https://daiviet.com.vn', 'Tạm ngưng', '0243551826', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 4 Tòa nhà Đại Việt Tower, 78 Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(915, 'KH-3AAF', 'business', 'Công ty TNHH MTV Tân Á', 'Công ty TNHH MTV Tân Á', '0713092301', 'Lâm Tuấn Hùng', 'https://tana.com.vn', 'Ngừng hoạt động', '0394311729', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Tân Á Tower, 90 Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(916, 'KH-F8DD', 'business', 'Công ty TNHH MTV Đại Việt', 'Công ty TNHH MTV Đại Việt', '0797579817', 'Đặng Cẩm Trang', 'https://daiviet.com.vn', 'NNT đang hoạt động', '0965470734', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Đại Việt Tower, 55 Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(917, 'KH-62D9', 'business', 'Hợp tác xã Vinh Quang', 'Hợp tác xã Vinh Quang', '0298051848', 'Ngô Cẩm My', 'https://vinhquang.com.vn', 'Tạm ngưng', '0243021930', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Vinh Quang Tower, 226 Nguyễn Huệ, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(918, 'KH-E775', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0545263241', 'Phạm Phương Vy', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0943487695', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Thành Công Tower, 27 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(919, 'KH-A632', 'business', 'Doanh nghiệp Tư nhân Đông Dương Đầu tư', 'Doanh nghiệp Tư nhân Đông Dương Đầu tư', '0721007784', 'Dương Khánh Hoa', 'https://dongduong.com.vn', 'Tạm ngưng', '0397115372', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Đông Dương Tower, 60 Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(920, 'KH-B73E', 'business', 'Tập đoàn Cửu Long', 'Tập đoàn Cửu Long', '0948989944', 'Nguyễn Diệu Thu', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0971500555', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Cửu Long Tower, 125 Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(921, 'KH-5C76', 'business', 'Hợp tác xã Sao Mai', 'Hợp tác xã Sao Mai', '0575227528', 'Lê Thảo Anh', 'https://saomai.com.vn', 'Ngừng hoạt động', '0243324429', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Sao Mai Tower, 207 Đồng Khởi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(922, 'KH-D454', 'business', 'Công ty TNHH MTV Minh Đăng Du lịch', 'Công ty TNHH MTV Minh Đăng Du lịch', '0624603736', 'Đặng Tuấn Đức', 'https://minhdang.com.vn', 'Tạm ngưng', '0368949619', 'contact@minhdang.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Minh Đăng Tower, 130 Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(923, 'KH-CF36', 'business', 'Công ty TNHH MTV Cửu Long', 'Công ty TNHH MTV Cửu Long', '0102086631', 'Trần Xuân Việt', 'https://cuulong.com.vn', 'Tạm ngưng', '0774448221', 'contact@cuulong.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Cửu Long Tower, 158 Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(924, 'KH-80E1', 'business', 'Công ty TNHH MTV Đất Việt Truyền thông', 'Công ty TNHH MTV Đất Việt Truyền thông', '0949835752', 'Võ Bảo Huy', 'https://datviet.com.vn', 'Đang hoạt động', '0790144581', 'contact@datviet.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Đất Việt Tower, 171 Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(925, 'KH-A1FE', 'business', 'Hợp tác xã Cửu Long Xây dựng', 'Hợp tác xã Cửu Long Xây dựng', '0916842910', 'Phan Thảo Phượng', 'https://cuulong.com.vn', 'Ngừng hoạt động', '0375331583', 'contact@cuulong.com.vn', NULL, 'Nữ', 'Tầng 4 Tòa nhà Cửu Long Tower, 4 Lý Tự Trọng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(926, 'KH-7F48', 'business', 'Công ty Cổ phần Việt Á Năng lượng', 'Công ty Cổ phần Việt Á Năng lượng', '0343412835', 'Lê Cẩm My', 'https://vieta.com.vn', 'Tạm ngưng', '0243363840', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 20 Tòa nhà Việt Á Tower, 236 Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(927, 'KH-310B', 'business', 'Hợp tác xã Đại Nam', 'Hợp tác xã Đại Nam', '0751507569', 'Nguyễn Tuấn Giang', 'https://dainam.com.vn', 'Đang hoạt động', '0243387448', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 15 Tòa nhà Đại Nam Tower, 246 Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(928, 'KH-F2EA', 'business', 'Hợp tác xã Vạn Xuân Vận tải', 'Hợp tác xã Vạn Xuân Vận tải', '0307180506', 'Nguyễn Văn Thịnh', 'https://vanxuan.com.vn', 'Đang hoạt động', '0283307078', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Vạn Xuân Tower, 81 Trần Hưng Đạo, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(929, 'KH-0A57', 'business', 'Công ty Cổ phần Hoàng Gia', 'Công ty Cổ phần Hoàng Gia', '0410485113', 'Hoàng Quang Quân', 'https://hoanggia.com.vn', 'Tạm ngưng', '0835762895', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Hoàng Gia Tower, 61 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(930, 'KH-B340', 'business', 'Công ty TNHH MTV Đại Nam', 'Công ty TNHH MTV Đại Nam', '0309767201', 'Phạm Tiến Hùng', 'https://dainam.com.vn', 'Đang hoạt động', '0707963613', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Đại Nam Tower, 127 Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(931, 'KH-AD2D', 'business', 'Công ty Cổ phần Vạn Xuân', 'Công ty Cổ phần Vạn Xuân', '0506170519', 'Huỳnh Xuân Nam', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0283929015', 'contact@vanxuan.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Vạn Xuân Tower, 25 Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(932, 'KH-0E1E', 'business', 'Doanh nghiệp Tư nhân Trường Giang Giáo dục', 'Doanh nghiệp Tư nhân Trường Giang Giáo dục', '0908735166', 'Đỗ Thảo Chi', 'https://truonggiang.com.vn', 'Tạm ngưng', '0831259110', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Trường Giang Tower, 39 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(933, 'KH-CB87', 'business', 'Hợp tác xã Vạn Xuân Thời trang', 'Hợp tác xã Vạn Xuân Thời trang', '0304674836', 'Dương Ngọc Chi', 'https://vanxuan.com.vn', 'Tạm ngưng', '0243585374', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Vạn Xuân Tower, 183 Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(934, 'KH-5E3D', 'business', 'Công ty TNHH Trường Sơn', 'Công ty TNHH Trường Sơn', '0397755153', 'Nguyễn Thành Dũng', 'https://truongson.com.vn', 'Ngừng hoạt động', '0338424853', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 173 Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(935, 'KH-AE63', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0597019216', 'Lâm Mạnh Trung', 'https://hongha.com.vn', 'Đang hoạt động', '0322888599', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 1 Tòa nhà Hồng Hà Tower, 172 Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(936, 'KH-ED61', 'business', 'Hợp tác xã Hòa Bình', 'Hợp tác xã Hòa Bình', '0106131204', 'Trần Mạnh Cường', 'https://hoabinh.com.vn', 'Tạm ngưng', '0283278484', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Hòa Bình Tower, 75 Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(937, 'KH-FB22', 'business', 'Hợp tác xã Thái Bình Dương', 'Hợp tác xã Thái Bình Dương', '0710860842', 'Đặng Thị Tuyết', 'https://thaibinhduong.com.vn', 'Đang hoạt động', '0856169058', 'contact@thaibinhduong.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Thái Bình Dương Tower, 23 Lê Duẩn, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(938, 'KH-FE73', 'business', 'Công ty TNHH MTV Sao Mai Đầu tư', 'Công ty TNHH MTV Sao Mai Đầu tư', '0147654835', 'Phan Thành Quang', 'https://saomai.com.vn', 'Tạm ngưng', '0325726108', 'contact@saomai.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Sao Mai Tower, 8 Lê Lợi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(939, 'KH-0FA9', 'business', 'Hợp tác xã Hồng Hà', 'Hợp tác xã Hồng Hà', '0246451212', 'Hồ Minh Vinh', 'https://hongha.com.vn', 'Đang hoạt động', '0838496704', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 6 Tòa nhà Hồng Hà Tower, 71 Nguyễn Huệ, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(940, 'KH-A547', 'business', 'Công ty Cổ phần An Phát Công nghệ', 'Công ty Cổ phần An Phát Công nghệ', '0567415919', 'Hoàng Minh Vinh', 'https://anphat.com.vn', 'NNT đang hoạt động', '0243300220', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà An Phát Tower, 123 Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(941, 'KH-7728', 'business', 'Công ty Cổ phần Hồng Hà Cơ khí', 'Công ty Cổ phần Hồng Hà Cơ khí', '0975572143', 'Phan Minh Bình', 'https://hongha.com.vn', 'NNT đang hoạt động', '0243495918', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Hồng Hà Tower, 107 Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(942, 'KH-3470', 'business', 'Công ty TNHH Đông Dương Đầu tư', 'Công ty TNHH Đông Dương Đầu tư', '0246078554', 'Lê Cẩm Liên', 'https://dongduong.com.vn', 'Ngừng hoạt động', '0930379263', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Đông Dương Tower, 8 Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(943, 'KH-1842', 'business', 'Doanh nghiệp Tư nhân Tân Á Sản xuất', 'Doanh nghiệp Tư nhân Tân Á Sản xuất', '0918208877', 'Trần Cát Phượng', 'https://tana.com.vn', 'NNT đang hoạt động', '0703900131', 'contact@tana.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Tân Á Tower, 27 Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(944, 'KH-DB13', 'business', 'Công ty Cổ phần An Phát Thời trang', 'Công ty Cổ phần An Phát Thời trang', '0662476207', 'Phan Khánh Giang', 'https://anphat.com.vn', 'NNT đang hoạt động', '0907963887', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà An Phát Tower, 246 Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(945, 'KH-5560', 'business', 'Tập đoàn Tân Á Thương mại', 'Tập đoàn Tân Á Thương mại', '0454563782', 'Đỗ Quốc Bảo', 'https://tana.com.vn', 'Ngừng hoạt động', '0963519630', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Tân Á Tower, 102 Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(946, 'KH-830F', 'business', 'Công ty Cổ phần Đại Nam', 'Công ty Cổ phần Đại Nam', '0483118342', 'Lâm Tiến Hải', 'https://dainam.com.vn', 'Tạm ngưng', '0845788272', 'contact@dainam.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Đại Nam Tower, 148 Cách Mạng Tháng Tám, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(947, 'KH-A55C', 'business', 'Hợp tác xã Sông Hồng Cơ khí', 'Hợp tác xã Sông Hồng Cơ khí', '0377212322', 'Bùi Ngọc Vy', 'https://songhong.com.vn', 'Ngừng hoạt động', '0850190216', 'contact@songhong.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Sông Hồng Tower, 210 Lê Lợi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(948, 'KH-473C', 'business', 'Công ty TNHH Hòa Bình Sản xuất', 'Công ty TNHH Hòa Bình Sản xuất', '0196737324', 'Lâm Bích Trúc', 'https://hoabinh.com.vn', 'Ngừng hoạt động', '0386332584', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 9 Tòa nhà Hòa Bình Tower, 17 Cách Mạng Tháng Tám, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(949, 'KH-DB9A', 'business', 'Công ty TNHH MTV Sông Hồng Thương mại', 'Công ty TNHH MTV Sông Hồng Thương mại', '0267631891', 'Lê Xuân Khánh', 'https://songhong.com.vn', 'Đang hoạt động', '0880439168', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 8 Tòa nhà Sông Hồng Tower, 50 Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(950, 'KH-5361', 'business', 'Công ty TNHH Thành Công', 'Công ty TNHH Thành Công', '0193797692', 'Mai Thảo Giang', 'https://thanhcong.com.vn', 'Ngừng hoạt động', '0243858087', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Thành Công Tower, 34 Trần Hưng Đạo, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(951, 'KH-8DB7', 'business', 'Công ty TNHH MTV Hồng Hà', 'Công ty TNHH MTV Hồng Hà', '0569449988', 'Ngô Nhật Trung', 'https://hongha.com.vn', 'NNT đang hoạt động', '0243393766', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Hồng Hà Tower, 50 Trần Hưng Đạo, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19');
INSERT INTO `customers` (`id`, `customer_code`, `type`, `name`, `company_name`, `tax_code`, `representative_name`, `website`, `business_status`, `phone`, `email`, `dob`, `gender`, `address`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(952, 'KH-8EB3', 'business', 'Hợp tác xã Thịnh Phát Thời trang', 'Hợp tác xã Thịnh Phát Thời trang', '0414953998', 'Trần Khánh Nam', 'https://thinhphat.com.vn', 'Tạm ngưng', '0332669865', 'contact@thinhphat.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Thịnh Phát Tower, 174 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(953, 'KH-782A', 'business', 'Công ty TNHH Việt Á Dịch vụ', 'Công ty TNHH Việt Á Dịch vụ', '0874493813', 'Phan Bảo Phong', 'https://vieta.com.vn', 'Tạm ngưng', '0243103717', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 3 Tòa nhà Việt Á Tower, 217 Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(954, 'KH-919C', 'business', 'Công ty TNHH Vạn Xuân', 'Công ty TNHH Vạn Xuân', '0498449211', 'Ngô Thị Hoa', 'https://vanxuan.com.vn', 'Ngừng hoạt động', '0334504082', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Vạn Xuân Tower, 57 Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(955, 'KH-BCCB', 'business', 'Tập đoàn Sông Hồng', 'Tập đoàn Sông Hồng', '0971405351', 'Lý Anh Hùng', 'https://songhong.com.vn', 'Đang hoạt động', '0243737551', 'contact@songhong.com.vn', NULL, 'Nam', 'Tầng 14 Tòa nhà Sông Hồng Tower, 61 Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(956, 'KH-CA65', 'business', 'Hợp tác xã Thành Công Bất động sản', 'Hợp tác xã Thành Công Bất động sản', '0272522175', 'Hoàng Tuyết Trang', 'https://thanhcong.com.vn', 'Tạm ngưng', '0792307254', 'contact@thanhcong.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Thành Công Tower, 89 Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(957, 'KH-341C', 'business', 'Tập đoàn Hòa Bình', 'Tập đoàn Hòa Bình', '0236242295', 'Hoàng Ngọc My', 'https://hoabinh.com.vn', 'Đang hoạt động', '0283889037', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Hòa Bình Tower, 39 Lê Lợi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(958, 'KH-B7B8', 'business', 'Hợp tác xã Tiến Phong Bất động sản', 'Hợp tác xã Tiến Phong Bất động sản', '0269503410', 'Dương Hoàng Bảo', 'https://tienphong.com.vn', 'Đang hoạt động', '0774491018', 'contact@tienphong.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Tiến Phong Tower, 223 Lê Lợi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(959, 'KH-B4BF', 'business', 'Công ty Cổ phần Nam Á Thời trang', 'Công ty Cổ phần Nam Á Thời trang', '0196608692', 'Lý Ngọc Liên', 'https://nama.com.vn', 'NNT đang hoạt động', '0858925518', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Nam Á Tower, 9 Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(960, 'KH-478C', 'business', 'Công ty Cổ phần Thành Công', 'Công ty Cổ phần Thành Công', '0954771641', 'Mai Khánh Quang', 'https://thanhcong.com.vn', 'NNT đang hoạt động', '0818625142', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 6 Tòa nhà Thành Công Tower, 58 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(961, 'KH-38A1', 'business', 'Công ty TNHH MTV An Phát', 'Công ty TNHH MTV An Phát', '0958880199', 'Đinh Lan Liên', 'https://anphat.com.vn', 'Ngừng hoạt động', '0243313869', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà An Phát Tower, 88 Bùi Thị Xuân, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(962, 'KH-127B', 'business', 'Công ty TNHH MTV Sao Mai', 'Công ty TNHH MTV Sao Mai', '0791459825', 'Lê Cát Thu', 'https://saomai.com.vn', 'Ngừng hoạt động', '0283985873', 'contact@saomai.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Sao Mai Tower, 126 Nguyễn Huệ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(963, 'KH-7621', 'business', 'Tập đoàn Tiến Phong Công nghệ', 'Tập đoàn Tiến Phong Công nghệ', '0702255123', 'Võ Cẩm Oanh', 'https://tienphong.com.vn', 'Ngừng hoạt động', '0283786637', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Tiến Phong Tower, 112 Hai Bà Trưng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(964, 'KH-48F3', 'business', 'Công ty TNHH Đại Việt Xây dựng', 'Công ty TNHH Đại Việt Xây dựng', '0628050844', 'Vũ Khánh Khoa', 'https://daiviet.com.vn', 'Đang hoạt động', '0243523042', 'contact@daiviet.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Đại Việt Tower, 224 Nguyễn Trãi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(965, 'KH-E3B3', 'business', 'Doanh nghiệp Tư nhân Vinh Quang', 'Doanh nghiệp Tư nhân Vinh Quang', '0353472601', 'Mai Cát Thu', 'https://vinhquang.com.vn', 'Ngừng hoạt động', '0903351720', 'contact@vinhquang.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Vinh Quang Tower, 220 Tôn Đức Thắng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(966, 'KH-67BC', 'business', 'Doanh nghiệp Tư nhân Sông Hồng Xây dựng', 'Doanh nghiệp Tư nhân Sông Hồng Xây dựng', '0353460031', 'Mai Ngọc Liên', 'https://songhong.com.vn', 'Đang hoạt động', '0243633587', 'contact@songhong.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Sông Hồng Tower, 116 Tôn Đức Thắng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(967, 'KH-BB2C', 'business', 'Tập đoàn Hòa Bình', 'Tập đoàn Hòa Bình', '0988829020', 'Hoàng Như Linh', 'https://hoabinh.com.vn', 'Ngừng hoạt động', '0764925829', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 13 Tòa nhà Hòa Bình Tower, 157 Hai Bà Trưng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(968, 'KH-5C15', 'business', 'Công ty Cổ phần Trường Giang Dịch vụ', 'Công ty Cổ phần Trường Giang Dịch vụ', '0786992987', 'Hồ Quốc Lâm', 'https://truonggiang.com.vn', 'Ngừng hoạt động', '0880751010', 'contact@truonggiang.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Trường Giang Tower, 241 Đồng Khởi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(969, 'KH-7907', 'business', 'Tập đoàn Đông Dương Vận tải', 'Tập đoàn Đông Dương Vận tải', '0183587349', 'Mai Thị Ngọc', 'https://dongduong.com.vn', 'NNT đang hoạt động', '0243022207', 'contact@dongduong.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Đông Dương Tower, 108 Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(970, 'KH-38D5', 'business', 'Hợp tác xã Trường Sơn Đầu tư', 'Hợp tác xã Trường Sơn Đầu tư', '0925918566', 'Lý Lan Quỳnh', 'https://truongson.com.vn', 'Tạm ngưng', '0373017733', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 6 Tòa nhà Trường Sơn Tower, 3 Tôn Đức Thắng, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(971, 'KH-5F28', 'business', 'Công ty TNHH Tân Á Cơ khí', 'Công ty TNHH Tân Á Cơ khí', '0209732306', 'Bùi Khánh Khoa', 'https://tana.com.vn', 'NNT đang hoạt động', '0283523864', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 2 Tòa nhà Tân Á Tower, 7 Cách Mạng Tháng Tám, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(972, 'KH-2481', 'business', 'Công ty TNHH Minh Đăng', 'Công ty TNHH Minh Đăng', '0648350563', 'Lê Ngọc Phượng', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0919452188', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Minh Đăng Tower, 231 Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(973, 'KH-A611', 'business', 'Tập đoàn Vạn Xuân Đầu tư', 'Tập đoàn Vạn Xuân Đầu tư', '0675602357', 'Nguyễn Cát An', 'https://vanxuan.com.vn', 'NNT đang hoạt động', '0243382095', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Vạn Xuân Tower, 140 Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(974, 'KH-376E', 'business', 'Tập đoàn Thành Công', 'Tập đoàn Thành Công', '0761331746', 'Lâm Hữu Lâm', 'https://thanhcong.com.vn', 'Tạm ngưng', '0283271926', 'contact@thanhcong.com.vn', NULL, 'Nam', 'Tầng 6 Tòa nhà Thành Công Tower, 113 Hai Bà Trưng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(975, 'KH-9952', 'business', 'Doanh nghiệp Tư nhân Tân Á Đầu tư', 'Doanh nghiệp Tư nhân Tân Á Đầu tư', '0133900909', 'Hồ Nhật Hoàng', 'https://tana.com.vn', 'Tạm ngưng', '0976979725', 'contact@tana.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Tân Á Tower, 38 Nguyễn Trãi, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(976, 'KH-EB0A', 'business', 'Tập đoàn Trường Sơn Giáo dục', 'Tập đoàn Trường Sơn Giáo dục', '0890250892', 'Phạm Ngọc Hà', 'https://truongson.com.vn', 'NNT đang hoạt động', '0243186185', 'contact@truongson.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Trường Sơn Tower, 53 Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(977, 'KH-A4A4', 'business', 'Công ty TNHH MTV Đất Việt Cơ khí', 'Công ty TNHH MTV Đất Việt Cơ khí', '0964504258', 'Ngô Hồng Lan', 'https://datviet.com.vn', 'Đang hoạt động', '0243412572', 'contact@datviet.com.vn', NULL, 'Nữ', 'Tầng 14 Tòa nhà Đất Việt Tower, 12 Lê Lợi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(978, 'KH-34CC', 'business', 'Hợp tác xã Việt Á', 'Hợp tác xã Việt Á', '0198033083', 'Lý Lan Phượng', 'https://vieta.com.vn', 'Đang hoạt động', '0358315199', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 17 Tòa nhà Việt Á Tower, 88 Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(979, 'KH-5551', 'business', 'Công ty TNHH Trường Sơn', 'Công ty TNHH Trường Sơn', '0135330925', 'Phan Nhật Nam', 'https://truongson.com.vn', 'Ngừng hoạt động', '0283479615', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 10 Tòa nhà Trường Sơn Tower, 57 Nguyễn Trãi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(980, 'KH-5635', 'business', 'Tập đoàn Đại Nam', 'Tập đoàn Đại Nam', '0687046589', 'Trần Lan Lan', 'https://dainam.com.vn', 'NNT đang hoạt động', '0977899236', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 12 Tòa nhà Đại Nam Tower, 50 Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(981, 'KH-0952', 'business', 'Công ty TNHH MTV Trường Giang Năng lượng', 'Công ty TNHH MTV Trường Giang Năng lượng', '0530445772', 'Lâm Như Dung', 'https://truonggiang.com.vn', 'NNT đang hoạt động', '0940256622', 'contact@truonggiang.com.vn', NULL, 'Nữ', 'Tầng 19 Tòa nhà Trường Giang Tower, 193 Nguyễn Trãi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(982, 'KH-649B', 'business', 'Công ty TNHH MTV Hoa Sen Thời trang', 'Công ty TNHH MTV Hoa Sen Thời trang', '0680406530', 'Hồ Bảo Tân', 'https://hoasen.com.vn', 'Ngừng hoạt động', '0947924086', 'contact@hoasen.com.vn', NULL, 'Nam', 'Tầng 7 Tòa nhà Hoa Sen Tower, 75 Trần Hưng Đạo, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(983, 'KH-885F', 'business', 'Công ty TNHH MTV Đại Nam Sản xuất', 'Công ty TNHH MTV Đại Nam Sản xuất', '0312528605', 'Lâm Phương Tuyết', 'https://dainam.com.vn', 'Đang hoạt động', '0283429564', 'contact@dainam.com.vn', NULL, 'Nữ', 'Tầng 3 Tòa nhà Đại Nam Tower, 149 Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(984, 'KH-AE08', 'business', 'Công ty TNHH Trường Sơn', 'Công ty TNHH Trường Sơn', '0222189115', 'Phan Bảo Thịnh', 'https://truongson.com.vn', 'NNT đang hoạt động', '0283735204', 'contact@truongson.com.vn', NULL, 'Nam', 'Tầng 5 Tòa nhà Trường Sơn Tower, 12 Lý Tự Trọng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(985, 'KH-BBDE', 'business', 'Tập đoàn Hòa Bình Đầu tư', 'Tập đoàn Hòa Bình Đầu tư', '0110020934', 'Phùng Quốc Đức', 'https://hoabinh.com.vn', 'NNT đang hoạt động', '0974003354', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Hòa Bình Tower, 86 Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(986, 'KH-B8E8', 'business', 'Công ty TNHH Hòa Bình', 'Công ty TNHH Hòa Bình', '0367706524', 'Đinh Đức Quân', 'https://hoabinh.com.vn', 'Đang hoạt động', '0283794877', 'contact@hoabinh.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Hòa Bình Tower, 207 Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(987, 'KH-F121', 'business', 'Hợp tác xã Thịnh Phát Năng lượng', 'Hợp tác xã Thịnh Phát Năng lượng', '0423103521', 'Ngô Anh Long', 'https://thinhphat.com.vn', 'NNT đang hoạt động', '0243190672', 'contact@thinhphat.com.vn', NULL, 'Nam', 'Tầng 18 Tòa nhà Thịnh Phát Tower, 89 Bùi Thị Xuân, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(988, 'KH-61A1', 'business', 'Tập đoàn Thái Bình Dương Truyền thông', 'Tập đoàn Thái Bình Dương Truyền thông', '0655693100', 'Lâm Thành Thái', 'https://thaibinhduong.com.vn', 'NNT đang hoạt động', '0243997969', 'contact@thaibinhduong.com.vn', NULL, 'Nam', 'Tầng 6 Tòa nhà Thái Bình Dương Tower, 181 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(989, 'KH-7531', 'business', 'Công ty TNHH An Phát Thương mại', 'Công ty TNHH An Phát Thương mại', '0574986442', 'Nguyễn Quốc Trung', 'https://anphat.com.vn', 'NNT đang hoạt động', '0377683672', 'contact@anphat.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà An Phát Tower, 98 Lý Tự Trọng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(990, 'KH-280D', 'business', 'Công ty TNHH MTV Hoàng Gia Thực phẩm', 'Công ty TNHH MTV Hoàng Gia Thực phẩm', '0203198741', 'Hồ Bảo Lâm', 'https://hoanggia.com.vn', 'Ngừng hoạt động', '0283774296', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 19 Tòa nhà Hoàng Gia Tower, 212 Cách Mạng Tháng Tám, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(991, 'KH-FC83', 'business', 'Công ty TNHH Việt Á', 'Công ty TNHH Việt Á', '0575312976', 'Mai Trọng Hùng', 'https://vieta.com.vn', 'Ngừng hoạt động', '0283375894', 'contact@vieta.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Việt Á Tower, 74 Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(992, 'KH-6A7D', 'business', 'Hợp tác xã An Phát Truyền thông', 'Hợp tác xã An Phát Truyền thông', '0899009041', 'Lê Ngọc Trang', 'https://anphat.com.vn', 'Tạm ngưng', '0380791680', 'contact@anphat.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà An Phát Tower, 34 Phan Châu Trinh, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(993, 'KH-01C3', 'business', 'Công ty Cổ phần Tiến Phong', 'Công ty Cổ phần Tiến Phong', '0405358886', 'Lâm Thảo My', 'https://tienphong.com.vn', 'Tạm ngưng', '0353118770', 'contact@tienphong.com.vn', NULL, 'Nữ', 'Tầng 18 Tòa nhà Tiến Phong Tower, 214 Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(994, 'KH-E3C4', 'business', 'Doanh nghiệp Tư nhân Minh Đăng Cơ khí', 'Doanh nghiệp Tư nhân Minh Đăng Cơ khí', '0716837714', 'Ngô Diệu Thu', 'https://minhdang.com.vn', 'Tạm ngưng', '0782516935', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 16 Tòa nhà Minh Đăng Tower, 132 Lê Lợi, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(995, 'KH-9D45', 'business', 'Tập đoàn Việt Á Dịch vụ', 'Tập đoàn Việt Á Dịch vụ', '0637191054', 'Nguyễn Phương Linh', 'https://vieta.com.vn', 'NNT đang hoạt động', '0243811836', 'contact@vieta.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Việt Á Tower, 207 Cách Mạng Tháng Tám, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(996, 'KH-B436', 'business', 'Tập đoàn Đại Việt Thương mại', 'Tập đoàn Đại Việt Thương mại', '0575846914', 'Mai Phương Chi', 'https://daiviet.com.vn', 'Ngừng hoạt động', '0283716206', 'contact@daiviet.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Đại Việt Tower, 140 Bùi Thị Xuân, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(997, 'KH-2E9A', 'business', 'Công ty TNHH MTV Minh Đăng Thời trang', 'Công ty TNHH MTV Minh Đăng Thời trang', '0407897862', 'Phạm Cẩm Thu', 'https://minhdang.com.vn', 'Ngừng hoạt động', '0982418895', 'contact@minhdang.com.vn', NULL, 'Nữ', 'Tầng 15 Tòa nhà Minh Đăng Tower, 200 Lê Duẩn, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(998, 'KH-4032', 'business', 'Công ty TNHH Hồng Hà', 'Công ty TNHH Hồng Hà', '0675051789', 'Đinh Minh Phong', 'https://hongha.com.vn', 'Ngừng hoạt động', '0825514617', 'contact@hongha.com.vn', NULL, 'Nam', 'Tầng 11 Tòa nhà Hồng Hà Tower, 39 Phan Châu Trinh, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(999, 'KH-38D8', 'business', 'Công ty TNHH MTV Vinh Quang', 'Công ty TNHH MTV Vinh Quang', '0400762837', 'Lâm Khánh Tùng', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0919667928', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 16 Tòa nhà Vinh Quang Tower, 76 Nguyễn Trãi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1000, 'KH-CAB4', 'business', 'Công ty TNHH Hải Đăng', 'Công ty TNHH Hải Đăng', '0463026208', 'Nguyễn Lan Liên', 'https://haidang.com.vn', 'NNT đang hoạt động', '0283301153', 'contact@haidang.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Hải Đăng Tower, 218 Lê Duẩn, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1001, 'KH-F43F', 'business', 'Công ty TNHH MTV Hòa Bình', 'Công ty TNHH MTV Hòa Bình', '0578147592', 'Dương Tuyết Trinh', 'https://hoabinh.com.vn', 'Đang hoạt động', '0243967943', 'contact@hoabinh.com.vn', NULL, 'Nữ', 'Tầng 2 Tòa nhà Hòa Bình Tower, 132 Phan Châu Trinh, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1002, 'KH-68A1', 'business', 'Hợp tác xã Hoàng Gia Thực phẩm', 'Hợp tác xã Hoàng Gia Thực phẩm', '0521373356', 'Lý Trọng Minh', 'https://hoanggia.com.vn', 'Tạm ngưng', '0333134429', 'contact@hoanggia.com.vn', NULL, 'Nam', 'Tầng 12 Tòa nhà Hoàng Gia Tower, 99 Hai Bà Trưng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1003, 'KH-4971', 'business', 'Tập đoàn Vinh Quang Truyền thông', 'Tập đoàn Vinh Quang Truyền thông', '0340956202', 'Bùi Quốc Anh', 'https://vinhquang.com.vn', 'NNT đang hoạt động', '0780125174', 'contact@vinhquang.com.vn', NULL, 'Nam', 'Tầng 17 Tòa nhà Vinh Quang Tower, 112 Lê Lợi, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1004, 'KH-FA65', 'business', 'Công ty TNHH MTV Vạn Xuân Thực phẩm', 'Công ty TNHH MTV Vạn Xuân Thực phẩm', '0440373996', 'Phạm Phương Vân', 'https://vanxuan.com.vn', 'Đang hoạt động', '0243472270', 'contact@vanxuan.com.vn', NULL, 'Nữ', 'Tầng 11 Tòa nhà Vạn Xuân Tower, 181 Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1005, 'KH-DB72', 'business', 'Hợp tác xã Nam Á', 'Hợp tác xã Nam Á', '0669470144', 'Phạm Thị Trúc', 'https://nama.com.vn', 'Đang hoạt động', '0283660345', 'contact@nama.com.vn', NULL, 'Nữ', 'Tầng 8 Tòa nhà Nam Á Tower, 148 Bùi Thị Xuân, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1006, 'KH-E88F', 'business', 'Công ty TNHH Trường Giang', 'Công ty TNHH Trường Giang', '0936385031', 'Phạm Nhật Cường', 'https://truonggiang.com.vn', 'Tạm ngưng', '0283186607', 'contact@truonggiang.com.vn', NULL, 'Nam', 'Tầng 13 Tòa nhà Trường Giang Tower, 119 Phan Châu Trinh, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:02:19', '2026-05-30 23:02:19'),
(1007, 'KH-A6F7', 'individual', 'Lê Thảo Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0967028695', 'lethaoha23@gmail.com', '1981-07-09', 'Nữ', '76 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1008, 'KH-0E07', 'individual', 'Lý Cát Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0323072205', 'lycatphuong33@gmail.com', '2001-02-25', 'Nữ', '258 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1009, 'KH-1CBA', 'individual', 'Bùi Tuấn Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0361838400', 'buituantan14@gmail.com', '1977-12-06', 'Nam', '103 Đường Cách Mạng Tháng Tám, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1010, 'KH-9C5C', 'individual', 'Huỳnh Khánh An', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848992542', 'huynhkhanhan61@gmail.com', '1997-05-04', 'Nữ', '392 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1011, 'KH-653C', 'individual', 'Hồ Hữu Đức', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0320695456', 'hohuuduc79@gmail.com', '1991-01-08', 'Nam', '285 Đường Phan Châu Trinh, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1012, 'KH-E86C', 'individual', 'Ngô Quỳnh Dung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0884471838', 'ngoquynhdung93@gmail.com', '1984-07-25', 'Nữ', '131 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1013, 'KH-AB40', 'individual', 'Nguyễn Cát Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0848713675', 'nguyencattrang88@gmail.com', '1981-07-02', 'Nữ', '307 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1014, 'KH-EED8', 'individual', 'Lê Tuyết Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0844762973', 'letuyettuyet57@gmail.com', '1990-05-23', 'Nữ', '262 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1015, 'KH-B855', 'individual', 'Huỳnh Ngọc Vy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0322791731', 'huynhngocvy51@gmail.com', '1982-08-06', 'Nữ', '222 Đường Hai Bà Trưng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1016, 'KH-92D7', 'individual', 'Lê Diệu Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946340667', 'ledieuphuong52@gmail.com', '2002-10-09', 'Nữ', '356 Đường Trần Hưng Đạo, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1017, 'KH-6CCF', 'individual', 'Dương Thu Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0700080652', 'duongthuphuong47@gmail.com', '1983-10-29', 'Nữ', '50 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1018, 'KH-31E2', 'individual', 'Hồ Quốc Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882459698', 'hoquocthinh16@gmail.com', '2002-05-10', 'Nam', '229 Đường Lê Duẩn, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1019, 'KH-2F3D', 'individual', 'Đỗ Cẩm Hạnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0798166570', 'docamhanh26@gmail.com', '1998-09-20', 'Nữ', '348 Đường Điện Biên Phủ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1020, 'KH-4B23', 'individual', 'Phùng Thu Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0974300136', 'phungthuha48@gmail.com', '1983-06-29', 'Nữ', '428 Đường Phan Châu Trinh, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1021, 'KH-D37A', 'individual', 'Ngô Hoàng Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881151589', 'ngohoangkhoa17@gmail.com', '1994-08-03', 'Nam', '262 Đường Nguyễn Trãi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1022, 'KH-E9C4', 'individual', 'Lý Tiến Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0841797123', 'lytienlong73@gmail.com', '2003-09-07', 'Nam', '66 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1023, 'KH-BDB1', 'individual', 'Phan Cát Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394564387', 'phancatngoc40@gmail.com', '1981-01-31', 'Nữ', '381 Đường Tôn Đức Thắng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1024, 'KH-0A08', 'individual', 'Đỗ Hoàng Hùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0831037536', 'dohoanghung97@gmail.com', '1981-12-09', 'Nam', '427 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1025, 'KH-E1BA', 'individual', 'Vũ Bảo Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0842441334', 'vubaohoang53@gmail.com', '2001-10-05', 'Nam', '125 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1026, 'KH-A889', 'individual', 'Trần Quốc Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0777877046', 'tranquockhoa85@gmail.com', '1987-11-17', 'Nam', '413 Đường Lê Duẩn, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1027, 'KH-B039', 'individual', 'Hoàng Mai Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0780663424', 'hoangmaiphuong96@gmail.com', '2006-02-07', 'Nữ', '142 Đường Hai Bà Trưng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1028, 'KH-BA36', 'individual', 'Bùi Bảo Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0946075705', 'buibaophong47@gmail.com', '1987-11-17', 'Nam', '336 Đường Phan Châu Trinh, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1029, 'KH-00C5', 'individual', 'Đỗ Quang Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0333655168', 'doquangtien33@gmail.com', '1985-12-08', 'Nam', '438 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1030, 'KH-FF6B', 'individual', 'Đặng Cẩm Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0907885139', 'dangcamlan98@gmail.com', '1989-05-16', 'Nữ', '410 Đường Nguyễn Huệ, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1031, 'KH-8F0C', 'individual', 'Phùng Thị Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0881336796', 'phungthigiang54@gmail.com', '1989-05-01', 'Nữ', '353 Đường Điện Biên Phủ, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1032, 'KH-DCE7', 'individual', 'Hồ Đức Vinh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0944416372', 'hoducvinh87@gmail.com', '2000-11-25', 'Nam', '64 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1033, 'KH-FE46', 'individual', 'Đặng Minh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394871646', 'dangminhviet29@gmail.com', '1981-04-08', 'Nam', '263 Đường Bùi Thị Xuân, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1034, 'KH-D8E3', 'individual', 'Võ Thành Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0961658151', 'vothanhtuan46@gmail.com', '2005-09-19', 'Nam', '8 Đường Đồng Khởi, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1035, 'KH-F0F8', 'individual', 'Vũ Thành Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0372743263', 'vuthanhtuan13@gmail.com', '1975-12-12', 'Nam', '110 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1036, 'KH-E88C', 'individual', 'Đỗ Thảo Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0376130623', 'dothaotrang76@gmail.com', '1995-03-17', 'Nữ', '25 Đường Cách Mạng Tháng Tám, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1037, 'KH-A9F2', 'individual', 'Hoàng Trọng Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0852759733', 'hoangtrongbao19@gmail.com', '1982-06-01', 'Nam', '242 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1038, 'KH-0176', 'individual', 'Hoàng Minh Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0812661780', 'hoangminhviet25@gmail.com', '1985-08-05', 'Nam', '99 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1039, 'KH-EC44', 'individual', 'Vũ Thành Tiến', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0375877528', 'vuthanhtien32@gmail.com', '2004-10-16', 'Nam', '165 Đường Nguyễn Trãi, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1040, 'KH-4C04', 'individual', 'Nguyễn Quốc Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0373818720', 'nguyenquocthinh33@gmail.com', '1999-08-16', 'Nam', '392 Đường Lê Lợi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1041, 'KH-C08A', 'individual', 'Hoàng Thị Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0845226415', 'hoangthinhi78@gmail.com', '1992-06-21', 'Nữ', '131 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1042, 'KH-B286', 'individual', 'Bùi Thu Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0385956802', 'buithutuyet62@gmail.com', '1989-07-05', 'Nữ', '74 Đường Hai Bà Trưng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1043, 'KH-7CDD', 'individual', 'Phùng Khánh Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0833853649', 'phungkhanhha29@gmail.com', '1995-03-11', 'Nữ', '445 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1044, 'KH-5770', 'individual', 'Mai Trọng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0770397667', 'maitronganh41@gmail.com', '1992-01-05', 'Nam', '440 Đường Tôn Đức Thắng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1045, 'KH-6D16', 'individual', 'Huỳnh Thành Trung', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0362580743', 'huynhthanhtrung53@gmail.com', '1977-01-24', 'Nam', '375 Đường Lý Tự Trọng, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1046, 'KH-5DBF', 'individual', 'Ngô Cát Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0334213279', 'ngocatchi30@gmail.com', '2001-08-18', 'Nữ', '403 Đường Nguyễn Trãi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1047, 'KH-C4CC', 'individual', 'Lâm Tuyết Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0399512989', 'lamtuyetgiang32@gmail.com', '1993-04-19', 'Nữ', '323 Đường Trần Hưng Đạo, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1048, 'KH-87B2', 'individual', 'Võ Thu Trang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0918976459', 'vothutrang15@gmail.com', '1979-10-09', 'Nữ', '229 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1049, 'KH-E9AA', 'individual', 'Trần Hữu Bảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0985988422', 'tranhuubao77@gmail.com', '2002-05-05', 'Nam', '342 Đường Tôn Đức Thắng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1050, 'KH-561F', 'individual', 'Nguyễn Xuân Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0391188958', 'nguyenxuanhai82@gmail.com', '2006-03-28', 'Nam', '197 Đường Nguyễn Huệ, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1051, 'KH-E21B', 'individual', 'Lê Quang Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0394253729', 'lequangthai10@gmail.com', '1987-05-05', 'Nam', '52 Đường Nguyễn Huệ, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1052, 'KH-896C', 'individual', 'Ngô Thành Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0919582861', 'ngothanhhoang81@gmail.com', '1992-11-06', 'Nam', '358 Đường Tôn Đức Thắng, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1053, 'KH-EBD5', 'individual', 'Đặng Quỳnh Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0335725073', 'dangquynhchi92@gmail.com', '1984-10-27', 'Nữ', '176 Đường Điện Biên Phủ, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1054, 'KH-38D0', 'individual', 'Nguyễn Thu Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0789470566', 'nguyenthuoanh50@gmail.com', '2003-08-15', 'Nữ', '301 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1055, 'KH-05FF', 'individual', 'Hoàng Xuân Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0987273386', 'hoangxuantan96@gmail.com', '1980-03-30', 'Nam', '277 Đường Đồng Khởi, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1056, 'KH-ED1D', 'individual', 'Bùi Khánh Hải', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0885905922', 'buikhanhhai91@gmail.com', '1990-09-28', 'Nam', '185 Đường Điện Biên Phủ, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1057, 'KH-E839', 'individual', 'Đinh Hồng Phương', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0340099427', 'dinhhongphuong81@gmail.com', '1996-06-25', 'Nữ', '86 Đường Đồng Khởi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1058, 'KH-012E', 'individual', 'Lê Hoàng Tân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0933801842', 'lehoangtan55@gmail.com', '1985-04-08', 'Nam', '270 Đường Phan Châu Trinh, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1059, 'KH-83A7', 'individual', 'Phùng Văn Phúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785929396', 'phungvanphuc32@gmail.com', '2000-10-29', 'Nam', '3 Đường Điện Biên Phủ, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1060, 'KH-D68D', 'individual', 'Vũ Hữu Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0349097921', 'vuhuuviet26@gmail.com', '1989-05-29', 'Nam', '107 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1061, 'KH-1036', 'individual', 'Đỗ Quốc Kiệt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0976511406', 'doquockiet93@gmail.com', '1978-07-28', 'Nam', '20 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1062, 'KH-E179', 'individual', 'Phan Mai Nhi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0792799833', 'phanmainhi14@gmail.com', '2006-03-11', 'Nữ', '368 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1063, 'KH-4A55', 'individual', 'Phạm Bích Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0852571613', 'phambichha24@gmail.com', '1988-08-03', 'Nữ', '417 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1064, 'KH-3DE9', 'individual', 'Phạm Cẩm Phượng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0838005808', 'phamcamphuong22@gmail.com', '1997-03-06', 'Nữ', '405 Đường Đồng Khởi, Hà Nội', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1065, 'KH-1F1D', 'individual', 'Dương Khánh Oanh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0768791763', 'duongkhanhoanh22@gmail.com', '1984-03-22', 'Nữ', '208 Đường Lý Tự Trọng, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1066, 'KH-2D38', 'individual', 'Hoàng Nhật Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0947428106', 'hoangnhattung53@gmail.com', '1997-07-22', 'Nam', '43 Đường Lý Tự Trọng, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1067, 'KH-2474', 'individual', 'Lý Bích Trúc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0847748304', 'lybichtruc14@gmail.com', '1976-08-18', 'Nữ', '211 Đường Bùi Thị Xuân, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1068, 'KH-1042', 'individual', 'Đỗ Duy Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0706481870', 'doduykhanh58@gmail.com', '2006-08-05', 'Nam', '215 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1069, 'KH-AF09', 'individual', 'Hoàng Trọng Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0351210422', 'hoangtrongthinh28@gmail.com', '2001-12-09', 'Nam', '51 Đường Tôn Đức Thắng, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1070, 'KH-5958', 'individual', 'Ngô Hữu Tuấn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0388499768', 'ngohuutuan53@gmail.com', '1978-11-27', 'Nam', '428 Đường Nguyễn Trãi, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1071, 'KH-C9B5', 'individual', 'Huỳnh Minh Long', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0353044684', 'huynhminhlong44@gmail.com', '1979-02-24', 'Nam', '59 Đường Đồng Khởi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1072, 'KH-6424', 'individual', 'Hồ Tuấn Sơn', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0882705093', 'hotuanson58@gmail.com', '1991-04-30', 'Nam', '37 Đường Nguyễn Trãi, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1073, 'KH-FE3E', 'individual', 'Bùi Minh Khoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818900420', 'buiminhkhoa38@gmail.com', '2007-11-19', 'Nam', '263 Đường Tôn Đức Thắng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1074, 'KH-FB36', 'individual', 'Hoàng Tuấn Khánh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0934003495', 'hoangtuankhanh30@gmail.com', '2007-03-28', 'Nam', '74 Đường Bùi Thị Xuân, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1075, 'KH-0DC0', 'individual', 'Vũ Mạnh Phong', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0354506214', 'vumanhphong65@gmail.com', '1987-06-30', 'Nam', '54 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1076, 'KH-514F', 'individual', 'Lâm Ngọc Hà', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0787833366', 'lamngocha67@gmail.com', '1976-03-04', 'Nữ', '223 Đường Tôn Đức Thắng, Lâm Đồng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1077, 'KH-902C', 'individual', 'Phùng Tuấn Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0363855297', 'phungtuanhuy99@gmail.com', '1988-04-21', 'Nam', '244 Đường Đồng Khởi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1078, 'KH-1B60', 'individual', 'Phan Hữu Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0763995598', 'phanhuubinh33@gmail.com', '1996-02-03', 'Nam', '433 Đường Phan Châu Trinh, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1079, 'KH-1FC5', 'individual', 'Mai Anh Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0887587649', 'maianhnam46@gmail.com', '1980-04-28', 'Nam', '378 Đường Nguyễn Huệ, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1080, 'KH-8DC6', 'individual', 'Đặng Quang Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0904059268', 'dangquangthinh84@gmail.com', '1982-11-12', 'Nam', '204 Đường Tôn Đức Thắng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1081, 'KH-2E50', 'individual', 'Võ Xuân Đông', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0785782672', 'voxuandong27@gmail.com', '1986-04-26', 'Nam', '294 Đường Đồng Khởi, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1082, 'KH-80A3', 'individual', 'Dương Hữu Thái', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0844098727', 'duonghuuthai58@gmail.com', '1997-02-21', 'Nam', '388 Đường Phan Châu Trinh, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1083, 'KH-9140', 'individual', 'Lý Thị Mai', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783403480', 'lythimai11@gmail.com', '1976-03-27', 'Nữ', '392 Đường Cách Mạng Tháng Tám, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1084, 'KH-9E4A', 'individual', 'Huỳnh Hồng Thu', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0776384574', 'huynhhongthu41@gmail.com', '1987-07-04', 'Nữ', '47 Đường Lê Duẩn, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1085, 'KH-6F57', 'individual', 'Hoàng Thu Thảo', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901804983', 'hoangthuthao82@gmail.com', '1982-09-13', 'Nữ', '419 Đường Lê Lợi, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1086, 'KH-229F', 'individual', 'Mai Minh Tùng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0900806100', 'maiminhtung85@gmail.com', '1993-11-28', 'Nam', '230 Đường Bùi Thị Xuân, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1087, 'KH-6588', 'individual', 'Đặng Tuyết Chi', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0938521220', 'dangtuyetchi33@gmail.com', '1981-07-07', 'Nữ', '96 Đường Bùi Thị Xuân, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1088, 'KH-B0DA', 'individual', 'Hoàng Hoài Hoa', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0812230886', 'hoanghoaihoa18@gmail.com', '1983-06-02', 'Nữ', '343 Đường Phan Châu Trinh, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1089, 'KH-8950', 'individual', 'Trần Tiến Quân', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0331749544', 'trantienquan70@gmail.com', '1988-05-08', 'Nam', '64 Đường Nguyễn Huệ, Bình Dương', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1090, 'KH-D5DE', 'individual', 'Phạm Hữu Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0912414441', 'phamhuuhuy10@gmail.com', '1982-01-14', 'Nam', '402 Đường Bùi Thị Xuân, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1091, 'KH-425F', 'individual', 'Phùng Hữu Bình', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0836789286', 'phunghuubinh85@gmail.com', '2004-11-12', 'Nam', '192 Đường Bùi Thị Xuân, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1092, 'KH-3A0F', 'individual', 'Bùi Hoàng Giang', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0818881241', 'buihoanggiang40@gmail.com', '1992-04-22', 'Nam', '239 Đường Cách Mạng Tháng Tám, Cần Thơ', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1093, 'KH-33F7', 'individual', 'Dương Trọng Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0915213089', 'duongtronganh17@gmail.com', '1999-03-18', 'Nam', '105 Đường Lê Duẩn, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1094, 'KH-EC4F', 'individual', 'Bùi Nhật Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0365048233', 'buinhatnam31@gmail.com', '1985-10-23', 'Nam', '303 Đường Hai Bà Trưng, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1095, 'KH-A0F1', 'individual', 'Lý Quang Việt', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0901270159', 'lyquangviet75@gmail.com', '1996-12-17', 'Nam', '145 Đường Lê Lợi, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1096, 'KH-D767', 'individual', 'Lê Lan Anh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0889781669', 'lelananh80@gmail.com', '1980-08-18', 'Nữ', '23 Đường Hai Bà Trưng, Thanh Hóa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1097, 'KH-5F11', 'individual', 'Nguyễn Thảo Lan', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0783647979', 'nguyenthaolan91@gmail.com', '1976-05-05', 'Nữ', '275 Đường Trần Hưng Đạo, Đồng Nai', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1098, 'KH-86AE', 'individual', 'Võ Quỳnh Tuyết', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0355468026', 'voquynhtuyet29@gmail.com', '2003-06-17', 'Nữ', '227 Đường Trần Hưng Đạo, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1099, 'KH-7399', 'individual', 'Hoàng Thảo Ngọc', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0367110525', 'hoangthaongoc18@gmail.com', '1994-09-09', 'Nữ', '385 Đường Nguyễn Trãi, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1100, 'KH-7967', 'individual', 'Hồ Xuân Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0354739492', 'hoxuanhoang20@gmail.com', '1985-06-23', 'Nam', '105 Đường Lý Tự Trọng, Thừa Thiên Huế', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1101, 'KH-3BD7', 'individual', 'Nguyễn Bích My', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0937983162', 'nguyenbichmy76@gmail.com', '1977-12-03', 'Nữ', '436 Đường Tôn Đức Thắng, Quảng Nam', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1102, 'KH-6FE2', 'individual', 'Nguyễn Mạnh Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0857746253', 'nguyenmanhhuy86@gmail.com', '1988-05-13', 'Nam', '223 Đường Lý Tự Trọng, TP. Hồ Chí Minh', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1103, 'KH-5D1F', 'individual', 'Hoàng Đức Huy', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0964763259', 'hoangduchuy69@gmail.com', '2007-05-29', 'Nam', '197 Đường Phan Châu Trinh, Khánh Hòa', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1104, 'KH-C060', 'individual', 'Bùi Nhật Nam', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0834157104', 'buinhatnam46@gmail.com', '1977-04-04', 'Nam', '317 Đường Lý Tự Trọng, Hải Phòng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1105, 'KH-B408', 'individual', 'Bùi Đức Hoàng', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0853183092', 'buiduchoang68@gmail.com', '1996-09-23', 'Nam', '67 Đường Điện Biên Phủ, Đà Nẵng', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36'),
(1106, 'KH-B953', 'individual', 'Đinh Bảo Thịnh', NULL, NULL, NULL, NULL, 'Đang hoạt động', '0321054855', 'dinhbaothinh36@gmail.com', '1981-08-19', 'Nam', '41 Đường Lê Duẩn, Nghệ An', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-30 23:05:36', '2026-05-30 23:05:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer_customer_group`
--

CREATE TABLE `customer_customer_group` (
  `customer_id` bigint UNSIGNED NOT NULL,
  `customer_group_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customer_customer_group`
--

INSERT INTO `customer_customer_group` (`customer_id`, `customer_group_id`) VALUES
(1, 1),
(10, 1),
(25, 1),
(30, 1),
(31, 1),
(52, 1),
(73, 1),
(89, 1),
(91, 1),
(105, 1),
(110, 1),
(116, 1),
(127, 1),
(129, 1),
(146, 1),
(177, 1),
(202, 1),
(210, 1),
(222, 1),
(228, 1),
(232, 1),
(234, 1),
(241, 1),
(258, 1),
(268, 1),
(275, 1),
(284, 1),
(298, 1),
(304, 1),
(311, 1),
(348, 1),
(351, 1),
(352, 1),
(354, 1),
(363, 1),
(368, 1),
(376, 1),
(379, 1),
(380, 1),
(381, 1),
(384, 1),
(404, 1),
(417, 1),
(422, 1),
(440, 1),
(452, 1),
(455, 1),
(464, 1),
(472, 1),
(478, 1),
(482, 1),
(489, 1),
(503, 1),
(513, 1),
(521, 1),
(536, 1),
(542, 1),
(544, 1),
(575, 1),
(581, 1),
(584, 1),
(589, 1),
(599, 1),
(606, 1),
(610, 1),
(622, 1),
(631, 1),
(648, 1),
(761, 1),
(766, 1),
(796, 1),
(865, 1),
(866, 1),
(883, 1),
(945, 1),
(952, 1),
(953, 1),
(1001, 1),
(1011, 1),
(1031, 1),
(1036, 1),
(1042, 1),
(1043, 1),
(1060, 1),
(1069, 1),
(1083, 1),
(1088, 1),
(1096, 1),
(1, 2),
(8, 2),
(15, 2),
(19, 2),
(51, 2),
(54, 2),
(76, 2),
(78, 2),
(82, 2),
(86, 2),
(109, 2),
(112, 2),
(115, 2),
(130, 2),
(132, 2),
(155, 2),
(158, 2),
(162, 2),
(163, 2),
(175, 2),
(183, 2),
(206, 2),
(214, 2),
(217, 2),
(233, 2),
(244, 2),
(259, 2),
(262, 2),
(269, 2),
(287, 2),
(293, 2),
(295, 2),
(302, 2),
(313, 2),
(315, 2),
(331, 2),
(332, 2),
(340, 2),
(346, 2),
(357, 2),
(371, 2),
(378, 2),
(391, 2),
(394, 2),
(400, 2),
(407, 2),
(409, 2),
(428, 2),
(433, 2),
(437, 2),
(471, 2),
(496, 2),
(524, 2),
(545, 2),
(547, 2),
(556, 2),
(565, 2),
(567, 2),
(572, 2),
(574, 2),
(576, 2),
(593, 2),
(613, 2),
(614, 2),
(627, 2),
(628, 2),
(636, 2),
(650, 2),
(671, 2),
(680, 2),
(738, 2),
(753, 2),
(756, 2),
(760, 2),
(767, 2),
(776, 2),
(777, 2),
(825, 2),
(831, 2),
(839, 2),
(848, 2),
(859, 2),
(937, 2),
(957, 2),
(975, 2),
(981, 2),
(984, 2),
(1035, 2),
(1047, 2),
(1057, 2),
(1058, 2),
(1066, 2),
(1101, 2),
(1105, 2),
(2, 3);

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

--
-- Đang đổ dữ liệu cho bảng `customer_groups`
--

INSERT INTO `customer_groups` (`id`, `name`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'khách quen', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:43:09', '2026-05-26 10:43:09'),
(2, 'khách thân', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:49:45', '2026-05-26 10:49:45'),
(3, 'VIP', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 11:02:04', '2026-05-26 11:02:04');

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

--
-- Đang đổ dữ liệu cho bảng `dining_tables`
--

INSERT INTO `dining_tables` (`id`, `name`, `area_id`, `status`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, '01', 1, 'using', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 11:04:30', '2026-05-28 22:35:27'),
(2, 'Bàn 3', 2, 'empty', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 19:38:46', '2026-05-26 19:38:46'),
(3, '02', 1, 'empty', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-28 04:55:40', '2026-05-28 22:35:20'),
(4, '03', 1, 'empty', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-28 04:55:52', '2026-05-28 22:35:36'),
(5, '04', 1, 'empty', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-28 04:56:01', '2026-05-28 22:35:45'),
(6, '05', 1, 'empty', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-28 04:56:09', '2026-05-28 22:35:54');

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

--
-- Đang đổ dữ liệu cho bảng `inventory_records`
--

INSERT INTO `inventory_records` (`id`, `record_code`, `type`, `note`, `record_date`, `store_owner_address`, `created_at`, `updated_at`) VALUES
(1, 'XK-000001', 'nhap', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:39:27', '2026-05-27 18:42:30'),
(2, 'XK-000002', 'xuat', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:39:58', '2026-05-27 18:42:30'),
(3, 'XK-000003', 'nhap', 'test', '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:42:19', '2026-05-27 18:42:30'),
(5, 'XK-000005', 'nhap', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:44:55', '2026-05-27 18:42:30'),
(6, 'XK-000006', 'nhap', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:45:18', '2026-05-27 18:42:30'),
(7, 'XK-000007', 'xuat', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:45:32', '2026-05-27 18:42:30'),
(8, 'XK-000008', 'nhap', NULL, '2026-05-26 00:00:00', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-26 10:45:51', '2026-05-27 18:42:30'),
(10, 'XK-000010', 'nhap', 'Nhập kho 10 ly cà phê sữa đá', '2026-05-26 00:00:00', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:57:18', '2026-05-27 18:42:30'),
(11, 'XK-000011', 'nhap', 'Nhap them 5 ly cafe test', '2026-05-26 00:00:00', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 11:01:18', '2026-05-27 18:42:30');

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

--
-- Đang đổ dữ liệu cho bảng `inventory_record_items`
--

INSERT INTO `inventory_record_items` (`id`, `inventory_record_id`, `product_id`, `product_variant_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(5, 5, 24, NULL, 1, 32000.00, '2026-05-26 10:44:55', '2026-05-26 10:44:55'),
(10, 10, 31, NULL, 10, 15000.00, '2026-05-26 10:57:18', '2026-05-26 10:57:18'),
(11, 11, 31, NULL, 15, 2900290000.00, '2026-05-26 11:01:18', '2026-05-26 11:01:18');

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
(13, '2026_05_26_001000_add_chain_id_to_tables', 1),
(14, '2026_05_26_001000_add_store_owner_address_to_tables', 2),
(15, '2026_05_26_002000_remove_chain_id_from_products_table', 3),
(16, '2026_05_26_003000_remove_chain_id_from_settings_table', 4),
(17, '2026_05_26_004000_create_product_variants_table', 5),
(18, '2026_05_26_005000_add_product_variant_id_to_order_items_table', 5),
(19, '2026_05_27_000000_create_customers_table', 6),
(20, '2026_05_27_001000_create_customer_groups_table', 6),
(21, '2026_05_27_002000_create_transactions_table', 7),
(22, '2026_05_27_003000_create_inventory_records_table', 8),
(23, '2026_05_27_004000_create_tables_and_areas', 9),
(24, '2026_05_27_006000_add_verification_hash_to_orders_table', 10),
(25, '2026_05_28_000000_add_blockchain_fields_to_transactions_table', 11),
(26, '2026_05_28_013935_add_public_codes_to_tables', 12),
(27, '2026_05_28_120000_add_business_fields_to_customers_table', 13),
(28, '2026_05_28_130000_add_status_to_customers_table', 14),
(29, '2026_05_30_070000_add_customer_id_and_note_to_tables', 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `discount_amount` int NOT NULL DEFAULT '0',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tx_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chain_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blockchain_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `customer_id` bigint UNSIGNED DEFAULT NULL,
  `voucher_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `table_number`, `total_amount`, `payment_method`, `status`, `tx_hash`, `chain_id`, `blockchain_status`, `store_owner_address`, `verification_hash`, `created_at`, `updated_at`, `customer_id`) VALUES
(1, 'HD-FFED67', '01', 243000.00, 'bank_transfer', 'completed', '0x2b756e757a3cf65032f652d0de3f372f47dfdc41efa3cb172df771e44725890e', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '4602bde9c32a0b72f1901bdf50477df9a1103121b0e55365459f210828b8307f', '2026-05-29 00:46:40', '2026-05-29 00:46:53', NULL),
(2, 'HD-7288D8', NULL, 90000.00, 'cash', 'completed', '0xba9256c919952558dce420d3be3aaa1eb9c35e5bdfe4bdf6ba0e1351b90b7fc4', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '3a07e05f78bea9984bd16bb913a84f899672fd9059134dc897737cdb383b0887', '2026-05-29 00:55:51', '2026-05-29 01:41:01', NULL),
(3, 'HD-67BF67', NULL, 1893000.00, 'bank_transfer', 'completed', '0xc7ca83822f2997451b489428ed75024b1ead1ed7c7070925821f6548392f6a32', '97', 'success', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '65c65d34ff029eab5cd8d98afbd38019ca9fb869550fa27d153d660690fdb2ee', '2026-05-29 17:49:19', '2026-05-29 17:50:02', NULL),
(4, 'HD-2FE672', NULL, 49000.00, 'bank_transfer', 'pending', NULL, NULL, 'none', '0x75ad18ef47eda21baff837cac0f1563d0c355555', NULL, '2026-05-30 00:27:47', '2026-05-30 00:27:47', NULL),
(5, 'HD-895547', NULL, 98000.00, 'cash', 'completed', NULL, NULL, 'none', '0xcd410fc84cec418253d9582717315e3186f9196a', '98ab60e709a9d16d2e1446a28311357ed41ad71df0d76f39535f5f14dca149fa', '2026-05-30 05:11:51', '2026-05-30 05:12:18', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
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
(1, 1, 24, NULL, 3, 32000.00, '2026-05-29 00:46:40', '2026-05-29 00:46:40', NULL),
(2, 1, 22, NULL, 2, 59000.00, '2026-05-29 00:46:40', '2026-05-29 00:46:40', NULL),
(3, 1, 1, NULL, 1, 29000.00, '2026-05-29 00:46:40', '2026-05-29 00:46:40', NULL),
(4, 2, 4, NULL, 2, 45000.00, '2026-05-29 00:55:51', '2026-05-29 00:55:51', NULL),
(5, 3, 526, NULL, 1, 69000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(6, 3, 525, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(7, 3, 527, NULL, 1, 79000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(8, 3, 528, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(9, 3, 529, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(10, 3, 530, 88, 1, 51000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(11, 3, 531, NULL, 4, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(12, 3, 532, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(13, 3, 533, 90, 1, 51000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(14, 3, 519, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(15, 3, 517, NULL, 2, 35000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(16, 3, 516, NULL, 1, 35000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(17, 3, 518, 86, 1, 55000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(18, 3, 521, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(19, 3, 520, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(20, 3, 523, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(21, 3, 524, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(22, 3, 522, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(23, 3, 507, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(24, 3, 508, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(25, 3, 510, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(26, 3, 511, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(27, 3, 512, 82, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(28, 3, 513, NULL, 1, 42000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(29, 3, 514, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(30, 3, 515, 83, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(31, 3, 489, NULL, 1, 42000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(32, 3, 490, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(33, 3, 492, NULL, 1, 35000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(34, 3, 493, NULL, 1, 35000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(35, 3, 494, 76, 1, 55000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(36, 3, 495, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(37, 3, 496, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(38, 3, 497, NULL, 1, 39000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(39, 3, 480, NULL, 1, 45000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(40, 3, 481, NULL, 1, 49000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(41, 3, 485, 70, 1, 51000.00, '2026-05-29 17:49:19', '2026-05-29 17:49:19', NULL),
(42, 4, 531, NULL, 1, 49000.00, '2026-05-30 00:27:47', '2026-05-30 00:27:47', 'thêm đường'),
(43, 5, 534, NULL, 2, 49000.00, '2026-05-30 05:11:51', '2026-05-30 05:11:51', NULL);

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
(1, 'App\\Models\\User', 1, 'pos-access-token', '9f1e1ee5e778a953b1b41212eca9d14a48c7a32473ee6d17f0f02847b89897eb', '[\"*\"]', '2026-05-25 10:25:23', NULL, '2026-05-25 10:25:22', '2026-05-25 10:25:23'),
(2, 'App\\Models\\User', 1, 'pos-access-token', 'ac0605cbb1582a26ba75b4f23cbc9986182e0a3a8928e7ac9645ddcc8f0d21ed', '[\"*\"]', '2026-05-25 10:25:52', NULL, '2026-05-25 10:25:45', '2026-05-25 10:25:52'),
(3, 'App\\Models\\User', 1, 'pos-access-token', 'a478dd46d362d94f7dd9712295363d48c071a033eb026f0b1487af3f86bf6230', '[\"*\"]', '2026-05-25 10:27:13', NULL, '2026-05-25 10:26:43', '2026-05-25 10:27:13'),
(4, 'App\\Models\\User', 2, 'pos-access-token', 'a236add8b7740372dc0276c4283e93905d69638410014ebd3678146d5a7b5360', '[\"*\"]', '2026-05-25 10:41:30', NULL, '2026-05-25 10:27:39', '2026-05-25 10:41:30'),
(5, 'App\\Models\\User', 3, 'pos-access-token', 'f18f8d9a49f4b086b16bc8c270a3983a7db61c94b6108c1f85d4c4e2014126e6', '[\"*\"]', '2026-05-25 10:42:07', NULL, '2026-05-25 10:41:41', '2026-05-25 10:42:07'),
(6, 'App\\Models\\User', 3, 'pos-access-token', '1d52dcb841639e65ea015048577fe8f94585bc981f58b124c2cecb9401cd37a5', '[\"*\"]', '2026-05-25 14:50:54', NULL, '2026-05-25 10:42:35', '2026-05-25 14:50:54'),
(7, 'App\\Models\\User', 2, 'pos-access-token', '7da3efe99d052c90cecf466ade541c7da65b4943434b5ac17bff14665d82dda9', '[\"*\"]', '2026-05-25 14:53:20', NULL, '2026-05-25 14:51:13', '2026-05-25 14:53:20'),
(8, 'App\\Models\\User', 1, 'pos-access-token', '8b40d5b71a9be949edcc35d773c0e806be8bb019761c8d9ce19e2dee97be3dbd', '[\"*\"]', '2026-05-25 14:54:08', NULL, '2026-05-25 14:54:07', '2026-05-25 14:54:08'),
(9, 'App\\Models\\User', 1, 'pos-access-token', '4856093d8daf88431c00bdf4f4d547f1f0a4c26f610bd33c05faac749bc00652', '[\"*\"]', '2026-05-25 14:57:55', NULL, '2026-05-25 14:54:15', '2026-05-25 14:57:55'),
(10, 'App\\Models\\User', 2, 'pos-access-token', '6fb5ff993148b94e0aac0d1284897dda2c145e379e08f9ec4690c2eabe6911b5', '[\"*\"]', '2026-05-25 14:59:17', NULL, '2026-05-25 14:59:15', '2026-05-25 14:59:17'),
(11, 'App\\Models\\User', 1, 'pos-access-token', 'a4fd707b4823ea5d05f6bc9e9d2bbf89e75f2c4831816939fca082d9e24ed36b', '[\"*\"]', '2026-05-25 15:17:15', NULL, '2026-05-25 15:03:08', '2026-05-25 15:17:15'),
(12, 'App\\Models\\User', 3, 'pos-access-token', 'cf484b1fa7f298d5613db09dc09e85eb0bc789f5477ecd3af48564b7d82038b8', '[\"*\"]', '2026-05-25 15:21:59', NULL, '2026-05-25 15:17:31', '2026-05-25 15:21:59'),
(13, 'App\\Models\\User', 2, 'pos-access-token', '33dadcf4b2b0c447f58f63824c1facd5809a2718d9ab63295fc71036dc75cd98', '[\"*\"]', '2026-05-25 15:22:31', NULL, '2026-05-25 15:22:16', '2026-05-25 15:22:31'),
(14, 'App\\Models\\User', 1, 'pos-access-token', '54518a9a1ecbbbc294ef680503b52ee9304b766aebe04d330f15c69eed172007', '[\"*\"]', '2026-05-25 15:22:50', NULL, '2026-05-25 15:22:44', '2026-05-25 15:22:50'),
(15, 'App\\Models\\User', 3, 'pos-access-token', 'f31f873b13b9af715d6372520f661fc046e435994631667d484728adf2e093a8', '[\"*\"]', '2026-05-25 15:25:02', NULL, '2026-05-25 15:23:02', '2026-05-25 15:25:02'),
(16, 'App\\Models\\User', 5, 'pos-access-token', '977d3dd450728c3d96258c0527651f24291c842a3fc7e73a5dffce639fb1a347', '[\"*\"]', '2026-05-25 15:26:35', NULL, '2026-05-25 15:25:53', '2026-05-25 15:26:35'),
(17, 'App\\Models\\User', 2, 'pos-access-token', '7aa26da1b9dd56fb5b58f96fa9b0cbaae2319a163f4bafe9c815e9cbbde4a266', '[\"*\"]', '2026-05-25 15:29:13', NULL, '2026-05-25 15:26:56', '2026-05-25 15:29:13'),
(18, 'App\\Models\\User', 3, 'pos-access-token', '734fa57875cc1720a588f31e75f7b0eca04413de2a40ca2d831cc0e96ff7b889', '[\"*\"]', '2026-05-25 18:19:52', NULL, '2026-05-25 15:29:39', '2026-05-25 18:19:52'),
(19, 'App\\Models\\User', 6, 'pos-access-token', 'b501465270da949dcb21aedba6d0c699603d49d4d3d6e3a66f36f93e6d90b03c', '[\"*\"]', '2026-05-25 18:37:23', NULL, '2026-05-25 18:21:46', '2026-05-25 18:37:23'),
(20, 'App\\Models\\User', 3, 'pos-access-token', '1650377740afcf2eb97c10f1bf7f2d472c3b4628bd5626c998eee34afeb73a84', '[\"*\"]', '2026-05-26 01:14:52', NULL, '2026-05-25 18:37:40', '2026-05-26 01:14:52'),
(21, 'App\\Models\\User', 3, 'pos-access-token', 'e37075e1a601c1b85f4b236b03dc94f55e7a56331765c98caa526d6e31558195', '[\"*\"]', '2026-05-26 01:16:53', NULL, '2026-05-26 01:16:50', '2026-05-26 01:16:53'),
(22, 'App\\Models\\User', 3, 'pos-access-token', '17c90d5b52c7d263709e4493fd453438250edcbe3de522f64640deef49558ff8', '[\"*\"]', '2026-05-26 01:17:26', NULL, '2026-05-26 01:17:15', '2026-05-26 01:17:26'),
(23, 'App\\Models\\User', 7, 'pos-access-token', 'a6188663d7b9d87145b1551c92dc606aac47e4fe07d9c4a7ecc2aab43e2f8dbd', '[\"*\"]', '2026-05-26 01:18:02', NULL, '2026-05-26 01:17:59', '2026-05-26 01:18:02'),
(24, 'App\\Models\\User', 7, 'pos-access-token', '053426245f2dcbe9e10a1d914d058d584b9342d6b9e60d4a5ea3c6a01a8f3a1a', '[\"*\"]', '2026-05-26 01:49:20', NULL, '2026-05-26 01:18:27', '2026-05-26 01:49:20'),
(25, 'App\\Models\\User', 7, 'pos-access-token', 'f421478322bc29f720eaffa7d04d0b754e5b40cfa9321ada1e2d81a3a769dfe0', '[\"*\"]', '2026-05-26 01:53:07', NULL, '2026-05-26 01:49:35', '2026-05-26 01:53:07'),
(26, 'App\\Models\\User', 2, 'pos-access-token', 'f67c0fca6209f1db6921a91e0b959702ac7e43c9baef4d90e48faac48ebc2883', '[\"*\"]', '2026-05-26 01:53:45', NULL, '2026-05-26 01:53:42', '2026-05-26 01:53:45'),
(27, 'App\\Models\\User', 2, 'pos-access-token', 'a455bc2a518b44fbefafca5a10b440308cf6e0e0726327ca4366bcb2ad9f0ef3', '[\"*\"]', '2026-05-26 01:54:13', NULL, '2026-05-26 01:54:09', '2026-05-26 01:54:13'),
(28, 'App\\Models\\User', 1, 'pos-access-token', '10ee1c96ba91cbdf9baa4b8e244ec545615853f26961eb751cec39e3417efb78', '[\"*\"]', '2026-05-26 01:54:19', NULL, '2026-05-26 01:54:16', '2026-05-26 01:54:19'),
(29, 'App\\Models\\User', 2, 'pos-access-token', 'cd3d9559214b5b75f1e50b078e89a1b853f41464c00924f293e199f1a581e29d', '[\"*\"]', '2026-05-26 01:54:35', NULL, '2026-05-26 01:54:32', '2026-05-26 01:54:35'),
(30, 'App\\Models\\User', 1, 'pos-access-token', 'c2b0d7379486649a667a5b1e8db12d141c28b824bc684b4222378530fab0c395', '[\"*\"]', '2026-05-26 10:20:24', NULL, '2026-05-26 01:54:57', '2026-05-26 10:20:24'),
(31, 'App\\Models\\User', 3, 'pos-access-token', '1bdf4d93dcf99c22af9248228beddd71c1720d1a9a50fde429e794b1a18b8dd2', '[\"*\"]', '2026-05-29 10:13:19', NULL, '2026-05-26 10:20:28', '2026-05-29 10:13:19'),
(32, 'App\\Models\\User', 8, 'pos-access-token', '0aa0c9865c8dbd34cab47c9010d7f23181df852060a3e79e0d27c6150dad2b8a', '[\"*\"]', '2026-05-26 10:55:11', NULL, '2026-05-26 10:54:55', '2026-05-26 10:55:11'),
(33, 'App\\Models\\User', 8, 'pos-access-token', 'b08aed768f8c417cfa3b521c5810dc725358eff97b35a6a1c08acc6293fda154', '[\"*\"]', '2026-05-26 10:56:17', NULL, '2026-05-26 10:55:12', '2026-05-26 10:56:17'),
(34, 'App\\Models\\User', 8, 'pos-access-token', 'e0ddb8bb47cf01efa3c6011c13b00bbd07d6f62c1007cc6fc11e44297ee01005', '[\"*\"]', '2026-05-26 19:32:26', NULL, '2026-05-26 10:56:19', '2026-05-26 19:32:26'),
(35, 'App\\Models\\User', 9, 'pos-access-token', '787e46892104463d314d98c4514a5f3abe836bf2716f9512c3c5be4bc180ee85', '[\"*\"]', NULL, NULL, '2026-05-26 19:35:50', '2026-05-26 19:35:50'),
(36, 'App\\Models\\User', 10, 'pos-access-token', '8d1ebffb8f7e47831f286be7ccd99ee9004bda052919cbeafbf5e65e8bfaffa6', '[\"*\"]', '2026-05-26 19:37:49', NULL, '2026-05-26 19:35:56', '2026-05-26 19:37:49'),
(37, 'App\\Models\\User', 8, 'pos-access-token', 'f79c76890c0a39aac049c4466898c2dde9272063f51900e3897d9292a111f64a', '[\"*\"]', '2026-05-26 19:38:50', NULL, '2026-05-26 19:38:10', '2026-05-26 19:38:50'),
(38, 'App\\Models\\User', 8, 'pos-access-token', 'a16665896b1dd8d217579ec75251e6aea3fafc5fc6d63ea99c1da782b922e5ea', '[\"*\"]', '2026-05-26 19:40:29', NULL, '2026-05-26 19:39:52', '2026-05-26 19:40:29'),
(39, 'App\\Models\\User', 8, 'pos-access-token', '702b075c633f51a16693899511acedf749ac81dc4e3e9edaccc17cc009374a33', '[\"*\"]', '2026-05-29 17:31:07', NULL, '2026-05-26 19:41:20', '2026-05-29 17:31:07'),
(40, 'App\\Models\\User', 3, 'pos-access-token', '2bbb7afed417cba6ccf912f9dfef8122d13623fc9bc113a7e1e1b521d2c5884d', '[\"*\"]', '2026-05-29 10:24:57', NULL, '2026-05-29 10:13:29', '2026-05-29 10:24:57'),
(41, 'App\\Models\\User', 3, 'pos-access-token', '9489874cc43b094d0757b7697ae4e70e584ef04c5e4b48c04e1ed3e9941e6c9f', '[\"*\"]', '2026-05-29 10:27:44', NULL, '2026-05-29 10:27:39', '2026-05-29 10:27:44'),
(42, 'App\\Models\\User', 6, 'pos-access-token', 'd6aa7d3f5487d219b05a99916e9455c2c55e2b0ef6672dc6ba5f18e10d43fd83', '[\"*\"]', '2026-05-29 10:27:57', NULL, '2026-05-29 10:27:52', '2026-05-29 10:27:57'),
(43, 'App\\Models\\User', 3, 'pos-access-token', '7993af7f6ab98bd9f701718e682a9e84f29475ff4dbfa57feb4046d4c18c3798', '[\"*\"]', '2026-05-29 10:28:19', NULL, '2026-05-29 10:28:15', '2026-05-29 10:28:19'),
(44, 'App\\Models\\User', 6, 'pos-access-token', 'a6e394bad09532b687caa62765b43d6b9df916ac8cd9fe97bc6ad65710d83a81', '[\"*\"]', '2026-05-29 10:28:28', NULL, '2026-05-29 10:28:24', '2026-05-29 10:28:28'),
(45, 'App\\Models\\User', 3, 'pos-access-token', '193f1bd8f7b4f79876b0d763abbcf0e50fa2d621de0da994d3fdeb87e1fec43c', '[\"*\"]', '2026-05-31 09:04:18', NULL, '2026-05-29 10:29:34', '2026-05-31 09:04:18'),
(46, 'App\\Models\\User', 11, 'pos-access-token', '537970819c8906997a1e983deff92904e50d67d9f50b159d49dc3a91e0fcf7c6', '[\"*\"]', '2026-05-30 00:41:18', NULL, '2026-05-29 17:32:25', '2026-05-30 00:41:18'),
(47, 'App\\Models\\User', 12, 'pos-access-token', '50fda77be8191fa978cf03433177a6b74d969503e0c9d09915b0a9c9772288df', '[\"*\"]', '2026-05-30 04:49:04', NULL, '2026-05-30 00:42:20', '2026-05-30 04:49:04'),
(48, 'App\\Models\\User', 13, 'pos-access-token', '3e69fc59986defa84fa9ee73223793fd1369c315cd8575a2e5fc175fafda0dd8', '[\"*\"]', '2026-05-30 04:51:57', NULL, '2026-05-30 04:50:32', '2026-05-30 04:51:57'),
(49, 'App\\Models\\User', 13, 'pos-access-token', 'ad9242cf324536cb11c48e18689bffc7a03bb67a305d4afe8325bae177292419', '[\"*\"]', '2026-05-30 05:08:39', NULL, '2026-05-30 04:52:10', '2026-05-30 05:08:39'),
(50, 'App\\Models\\User', 8, 'pos-access-token', '32790fd9a7e45a6ab8eee14451c9bcaa306c2a3c635605be2c9bca24e34479c4', '[\"*\"]', '2026-05-30 05:12:19', NULL, '2026-05-30 05:09:12', '2026-05-30 05:12:19');

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
(1, 'SP-000001', 'Cà Phê Sữa Đá', 29000.00, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đậm đà kết hợp sữa đặc hảo hạng và đá mát lạnh.', 'Món uống quốc dân mang đậm hương vị truyền thống Việt Nam. Sử dụng hạt cà phê Robusta tuyển chọn từ Buôn Ma Thuột, được rang xay nguyên chất, mang lại hương vị đắng thanh nồng nàn quyện cùng vị béo ngậy ngọt ngào của sữa đặc.', '2026-05-25 10:15:19', '2026-05-27 18:42:29'),
(4, 'SP-000004', 'Cappuccino Nghệ Thuật', 45000.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê espresso sánh mịn kết hợp lớp bọt sữa mịn màng vẽ nghệ thuật.', 'Sự kết hợp hoàn hảo giữa hương vị espresso hảo hạng và lớp sữa tươi được đánh bọt mịn màng như nhung. Phía trên được tạo hình nghệ thuật Latte Art tinh xảo.', '2026-05-25 10:15:20', '2026-05-27 18:42:29'),
(22, 'SP-000022', 'Salad Ức Gà Mè Rang', 59000.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Ức gà áp chảo mềm mọng cùng xà lách tươi sạch và sốt mè rang.', 'Lựa chọn Eat-clean lành mạnh. Ức gà tẩm ướp thảo mộc áp chảo vàng ươm mềm ẩm, kết hợp cùng xà lách thủy canh tươi giòn.', '2026-05-25 10:15:20', '2026-05-27 18:42:30'),
(24, 'SP-000024', 'Bánh Mì Baguette', 32000.00, 'https://www.lottemart.vn/media/catalog/product/cache/0x0/0/4/0400285600009-1.jpg.webp', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh mì baguette nướng bơ tỏi thơm giòn nóng hổi khó cưỡng.', 'Những lát bánh mì Baguette Pháp giòn rụm được phết đều hỗn hợp bơ nhạt cao cấp, tỏi lý sơn băm nhuyễn và lá ngò tây thơm phức.', '2026-05-25 10:15:20', '2026-05-27 18:42:30'),
(30, 'SP-000030', 'Bạc xỉu', 2000.00, 'https://dayphache.edu.vn/wp-content/uploads/2019/10/bac-xiu-da.jpg', 1, '0x1ad11e0e96797a14336bf474676eb0a332055555', NULL, NULL, '2026-05-25 18:37:02', '2026-05-27 18:42:30'),
(31, 'SP-000031', 'Cà phê sữa đá', 29000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Cà phê sữa đá truyền thống thơm ngon', NULL, '2026-05-26 10:56:44', '2026-05-27 18:42:30'),
(32, 'SP-F0D0D7', 'Sinh Tố Sapoche Hạt Phỉ #1', 50000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố sapoche hạt phỉ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Sapoche Hạt Phỉ #1 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(33, 'SP-C2DEC1', 'Khoai Tây Chiên Lắc Phô Mai #2', 37000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món khoai tây chiên lắc phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Khoai Tây Chiên Lắc Phô Mai #2 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(34, 'SP-BF6C97', 'Matcha Mint Choc Chip #3', 77000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món matcha mint choc chip thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Matcha Mint Choc Chip #3 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(35, 'SP-C83D37', 'Sinh Tố Dưa Gang Thanh Mát #4', 78000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dưa gang thanh mát thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dưa Gang Thanh Mát #4 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(36, 'SP-F91A6D', 'Cà Phê Kem Dừa Trầm #5', 60000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê kem dừa trầm thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Kem Dừa Trầm #5 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(37, 'SP-89EA9C', 'Cà Phê Muối Kem Béo #6', 81000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê muối kem béo thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Muối Kem Béo #6 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(38, 'SP-A1AA99', 'Trà Bí Đao Hạt Chia #7', 71000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà bí đao hạt chia thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Bí Đao Hạt Chia #7 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(39, 'SP-E015FC', 'Mỳ Ý Sốt Bò Bằm Parmigiano #8', 55000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món mỳ ý sốt bò bằm parmigiano thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Mỳ Ý Sốt Bò Bằm Parmigiano #8 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(40, 'SP-3DB69A', 'Cà Phê Kem Dừa Trầm #9', 40000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê kem dừa trầm thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Kem Dừa Trầm #9 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(41, 'SP-F4D982', 'Bơ Sáp Đá Xay Hạt Điều #10', 78000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bơ sáp đá xay hạt điều thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bơ Sáp Đá Xay Hạt Điều #10 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(42, 'SP-EE43EC', 'Trà Kiwi Bạc Hà #11', 74000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà kiwi bạc hà thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Kiwi Bạc Hà #11 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(43, 'SP-F853B0', 'Cà Phê Muối Kem Béo #12', 41000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê muối kem béo thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Muối Kem Béo #12 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(44, 'SP-764330', 'Trà Sơ Ri Chua Ngọt #13', 50000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà sơ ri chua ngọt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Sơ Ri Chua Ngọt #13 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(45, 'SP-21BEC8', 'Bánh Su Kem Vani Pháp #14', 73000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bánh su kem vani pháp thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bánh Su Kem Vani Pháp #14 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(46, 'SP-EDA815', 'Trà Đào Cam Sả Đặc Biệt #15', 57000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà đào cam sả đặc biệt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Đào Cam Sả Đặc Biệt #15 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(47, 'SP-081036', 'Trà Sen Vàng Long Nhãn #16', 48000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà sen vàng long nhãn thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Sen Vàng Long Nhãn #16 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(48, 'SP-B27289', 'Trà Bí Đao Hạt Chia #17', 46000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà bí đao hạt chia thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Bí Đao Hạt Chia #17 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(49, 'SP-4E8112', 'Sinh Tố Thập Cẩm Đặc Biệt #18', 78000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố thập cẩm đặc biệt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Thập Cẩm Đặc Biệt #18 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(50, 'SP-FD7112', 'Waffle Sốt Socola Dâu Tây #19', 49000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món waffle sốt socola dâu tây thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Waffle Sốt Socola Dâu Tây #19 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(51, 'SP-EAC4BD', 'Xoài Cát Đá Xay Thạch Dừa #20', 25000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món xoài cát đá xay thạch dừa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Xoài Cát Đá Xay Thạch Dừa #20 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(52, 'SP-1E2B45', 'Sandwich Thịt Nguội Phô Mai #21', 53000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sandwich thịt nguội phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sandwich Thịt Nguội Phô Mai #21 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(53, 'SP-6CCB61', 'Hamburger Bò Mỹ Phô Mai #22', 66000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món hamburger bò mỹ phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Hamburger Bò Mỹ Phô Mai #22 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(54, 'SP-DFA09B', 'Pizza Mini Hải Sản #23', 29000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món pizza mini hải sản thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Pizza Mini Hải Sản #23 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(55, 'SP-FD7ECE', 'Trà Bí Đao Hạt Chia #24', 57000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà bí đao hạt chia thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Bí Đao Hạt Chia #24 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(56, 'SP-A57A6B', 'Espresso Con Panna #25', 73000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món espresso con panna thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Espresso Con Panna #25 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(57, 'SP-C50B72', 'Đậu Đỏ Đá Xay Kem Cốt Dừa #26', 30000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món đậu đỏ đá xay kem cốt dừa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Đậu Đỏ Đá Xay Kem Cốt Dừa #26 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(58, 'SP-E41372', 'Dừa Xiêm Đá Xay Trân Châu #27', 52000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món dừa xiêm đá xay trân châu thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Dừa Xiêm Đá Xay Trân Châu #27 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(59, 'SP-942CBD', 'Bánh Su Kem Vani Pháp #28', 69000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bánh su kem vani pháp thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bánh Su Kem Vani Pháp #28 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(60, 'SP-A3ABCA', 'Gà Lắc Trân Châu Giòn Rụm #29', 58000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món gà lắc trân châu giòn rụm thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Gà Lắc Trân Châu Giòn Rụm #29 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(61, 'SP-0198F6', 'Irish Coffee Ấm Áp #30', 33000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món irish coffee ấm áp thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Irish Coffee Ấm Áp #30 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(62, 'SP-C6D3A4', 'Sinh Tố Thanh Long Đỏ #31', 34000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố thanh long đỏ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Thanh Long Đỏ #31 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(63, 'SP-8E03DB', 'Cà Phê Sâm Panh #32', 76000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê sâm panh thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Sâm Panh #32 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(64, 'SP-82AED9', 'Kimbap Hàn Quốc Cuộn Cá Hồi #33', 43000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món kimbap hàn quốc cuộn cá hồi thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Kimbap Hàn Quốc Cuộn Cá Hồi #33 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(65, 'SP-F93AF1', 'Socola Đá Xay Sốt Caramel #34', 53000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món socola đá xay sốt caramel thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Socola Đá Xay Sốt Caramel #34 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(66, 'SP-199B39', 'Cà Phê Cốt Dừa Đá Xay #35', 39000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê cốt dừa đá xay thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Cốt Dừa Đá Xay #35 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(67, 'SP-AC865C', 'Bánh Cuộn Trà Xanh #36', 78000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bánh cuộn trà xanh thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bánh Cuộn Trà Xanh #36 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(68, 'SP-173933', 'Trà Chanh Dây Thạch Nha Đam #37', 28000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà chanh dây thạch nha đam thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Chanh Dây Thạch Nha Đam #37 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(69, 'SP-43FCB6', 'Pizza Mini Hải Sản #38', 64000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món pizza mini hải sản thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Pizza Mini Hải Sản #38 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(70, 'SP-96393E', 'Sinh Tố Đu Đủ Sữa Dừa #39', 37000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố đu đủ sữa dừa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Đu Đủ Sữa Dừa #39 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(71, 'SP-A852B8', 'Sinh Tố Kiwi Xanh Matcha #40', 54000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố kiwi xanh matcha thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Kiwi Xanh Matcha #40 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(72, 'SP-3B2D56', 'Bơ Sáp Đá Xay Hạt Điều #41', 56000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bơ sáp đá xay hạt điều thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bơ Sáp Đá Xay Hạt Điều #41 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(73, 'SP-40E71E', 'Pizza Mini Hải Sản #42', 44000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món pizza mini hải sản thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Pizza Mini Hải Sản #42 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(74, 'SP-EE82C7', 'Trà Việt Quất Mật Ong #43', 34000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà việt quất mật ong thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Việt Quất Mật Ong #43 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(75, 'SP-3AFB3C', 'Muffin Việt Quất Mỹ #44', 42000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món muffin việt quất mỹ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Muffin Việt Quất Mỹ #44 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(76, 'SP-74448E', 'Kimbap Hàn Quốc Cuộn Cá Hồi #45', 75000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món kimbap hàn quốc cuộn cá hồi thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Kimbap Hàn Quốc Cuộn Cá Hồi #45 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(77, 'SP-398921', 'Trà Việt Quất Mật Ong #46', 64000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà việt quất mật ong thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Việt Quất Mật Ong #46 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(78, 'SP-57791F', 'Sinh Tố Dâu Tây Chuối #47', 53000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dâu tây chuối thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dâu Tây Chuối #47 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(79, 'SP-57031B', 'Sinh Tố Kiwi Xanh Matcha #48', 66000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố kiwi xanh matcha thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Kiwi Xanh Matcha #48 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(80, 'SP-153385', 'Gà Lắc Trân Châu Giòn Rụm #49', 32000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món gà lắc trân châu giòn rụm thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Gà Lắc Trân Châu Giòn Rụm #49 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(81, 'SP-217CB7', 'Sinh Tố Kiwi Xanh Matcha #50', 50000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố kiwi xanh matcha thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Kiwi Xanh Matcha #50 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(82, 'SP-C1CC7B', 'Takoyaki Nhật Bản Thơm Phức #51', 50000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món takoyaki nhật bản thơm phức thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Takoyaki Nhật Bản Thơm Phức #51 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(83, 'SP-1DF2C7', 'Bánh Su Kem Vani Pháp #52', 80000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bánh su kem vani pháp thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bánh Su Kem Vani Pháp #52 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(84, 'SP-5DD35D', 'Trà Dưa Hấu Bạc Hà #53', 44000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà dưa hấu bạc hà thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Dưa Hấu Bạc Hà #53 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(85, 'SP-3AF9AC', 'Cold Brew Cam Quế #54', 35000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cold brew cam quế thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cold Brew Cam Quế #54 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(86, 'SP-53280D', 'Croissant Bơ Pháp Giòn #55', 55000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món croissant bơ pháp giòn thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Croissant Bơ Pháp Giòn #55 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(87, 'SP-A3E9B8', 'Trà Xoài Chanh Leo #56', 29000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà xoài chanh leo thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Xoài Chanh Leo #56 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(88, 'SP-FB88E6', 'Sinh Tố Sapoche Hạt Phỉ #57', 60000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố sapoche hạt phỉ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Sapoche Hạt Phỉ #57 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(89, 'SP-DD6E02', 'Cà Phê Cốt Dừa Đá Xay #58', 33000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê cốt dừa đá xay thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Cốt Dừa Đá Xay #58 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(90, 'SP-60C9E4', 'Espresso Macchiato #59', 27000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món espresso macchiato thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Espresso Macchiato #59 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(91, 'SP-415198', 'Sinh Tố Dâu Tây Chuối #60', 53000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dâu tây chuối thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dâu Tây Chuối #60 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(92, 'SP-C7BB1B', 'Cà Phê Phin Giấy #61', 66000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê phin giấy thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Phin Giấy #61 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(93, 'SP-921842', 'Bánh Sừng Bò Trứng Muối #62', 56000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món bánh sừng bò trứng muối thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Bánh Sừng Bò Trứng Muối #62 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(94, 'SP-54E8F8', 'Sinh Tố Sapoche Hạt Phỉ #63', 60000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố sapoche hạt phỉ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Sapoche Hạt Phỉ #63 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(95, 'SP-B80E25', 'Trà Mận Hà Nội #64', 72000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà mận hà nội thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Mận Hà Nội #64 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(96, 'SP-726CB7', 'Crepe Sầu Riêng Kem Lạnh #65', 58000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món crepe sầu riêng kem lạnh thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Crepe Sầu Riêng Kem Lạnh #65 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(97, 'SP-5DC657', 'Trà Lựu Đỏ Kem Cheese #66', 43000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà lựu đỏ kem cheese thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Lựu Đỏ Kem Cheese #66 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(98, 'SP-7FA259', 'Socola Đá Xay Sốt Caramel #67', 65000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món socola đá xay sốt caramel thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Socola Đá Xay Sốt Caramel #67 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(99, 'SP-D26B7F', 'Trà Dưa Hấu Bạc Hà #68', 55000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà dưa hấu bạc hà thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Dưa Hấu Bạc Hà #68 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(100, 'SP-554182', 'Cơm Cuộn Trứng Omurice #69', 58000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cơm cuộn trứng omurice thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cơm Cuộn Trứng Omurice #69 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(101, 'SP-ACD965', 'Latte Vani Hạt Dẻ #70', 50000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món latte vani hạt dẻ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Latte Vani Hạt Dẻ #70 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(102, 'SP-FBE308', 'Trà Chanh Dây Thạch Nha Đam #71', 72000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà chanh dây thạch nha đam thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Chanh Dây Thạch Nha Đam #71 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(103, 'SP-9983D6', 'Dừa Xiêm Đá Xay Trân Châu #72', 47000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món dừa xiêm đá xay trân châu thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Dừa Xiêm Đá Xay Trân Châu #72 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(104, 'SP-E0C144', 'Xoài Cát Đá Xay Thạch Dừa #73', 30000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món xoài cát đá xay thạch dừa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Xoài Cát Đá Xay Thạch Dừa #73 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(105, 'SP-FB4CE7', 'Flat White Đậm Đà #74', 60000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món flat white đậm đà thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Flat White Đậm Đà #74 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(106, 'SP-AA0419', 'Nachos Sốt Phô Mai Cay #75', 62000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món nachos sốt phô mai cay thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Nachos Sốt Phô Mai Cay #75 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(107, 'SP-49D3D6', 'Trà Sơ Ri Chua Ngọt #76', 27000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà sơ ri chua ngọt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Sơ Ri Chua Ngọt #76 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(108, 'SP-48B2CA', 'Cà Phê Sâm Panh #77', 40000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê sâm panh thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Sâm Panh #77 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(109, 'SP-B5C6D0', 'Trà Mận Hà Nội #78', 44000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà mận hà nội thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Mận Hà Nội #78 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(110, 'SP-01A7FE', 'Muffin Việt Quất Mỹ #79', 74000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món muffin việt quất mỹ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Muffin Việt Quất Mỹ #79 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(111, 'SP-F521A2', 'Trà Sơ Ri Chua Ngọt #80', 56000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà sơ ri chua ngọt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Sơ Ri Chua Ngọt #80 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(112, 'SP-1C6063', 'Latte Vani Hạt Dẻ #81', 35000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món latte vani hạt dẻ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Latte Vani Hạt Dẻ #81 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(113, 'SP-01150A', 'Hamburger Bò Mỹ Phô Mai #82', 36000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món hamburger bò mỹ phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Hamburger Bò Mỹ Phô Mai #82 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(114, 'SP-85074C', 'Trà Bí Đao Hạt Chia #83', 32000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà bí đao hạt chia thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Bí Đao Hạt Chia #83 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(115, 'SP-022A90', 'Sinh Tố Đu Đủ Sữa Dừa #84', 78000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố đu đủ sữa dừa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Đu Đủ Sữa Dừa #84 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27');
INSERT INTO `products` (`id`, `sku`, `name`, `price`, `image`, `status`, `store_owner_address`, `short_description`, `description`, `created_at`, `updated_at`) VALUES
(116, 'SP-16A68A', 'Trà Bí Đao Hạt Chia #85', 76000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà bí đao hạt chia thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Bí Đao Hạt Chia #85 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(117, 'SP-9EBB48', 'Trà Nhài Thạch Vải #86', 80000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà nhài thạch vải thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Nhài Thạch Vải #86 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(118, 'SP-DD45D2', 'Cà Phê Muối Kem Béo #87', 81000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cà phê muối kem béo thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cà Phê Muối Kem Béo #87 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(119, 'SP-0AFDDC', 'Latte Caramel Muối #88', 41000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món latte caramel muối thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Latte Caramel Muối #88 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(120, 'SP-7B2099', 'Cookie Hạt Dẻ Sữa #89', 74000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cookie hạt dẻ sữa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cookie Hạt Dẻ Sữa #89 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(121, 'SP-AE20D4', 'Cookie Hạt Dẻ Sữa #90', 40000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món cookie hạt dẻ sữa thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Cookie Hạt Dẻ Sữa #90 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(122, 'SP-1A1D5C', 'Sinh Tố Dưa Gang Thanh Mát #91', 77000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dưa gang thanh mát thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dưa Gang Thanh Mát #91 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(123, 'SP-521DBF', 'Sinh Tố Thập Cẩm Đặc Biệt #92', 30000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố thập cẩm đặc biệt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Thập Cẩm Đặc Biệt #92 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(124, 'SP-4D1BA4', 'Muffin Việt Quất Mỹ #93', 36000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món muffin việt quất mỹ thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Muffin Việt Quất Mỹ #93 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(125, 'SP-3049C9', 'Sinh Tố Dâu Tây Chuối #94', 59000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dâu tây chuối thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dâu Tây Chuối #94 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(126, 'SP-19869A', 'Trà Dâu Tằm Đà Lạt #95', 53000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món trà dâu tằm đà lạt thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Trà Dâu Tằm Đà Lạt #95 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(127, 'SP-3F2599', 'Khoai Tây Chiên Lắc Phô Mai #96', 26000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món khoai tây chiên lắc phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Khoai Tây Chiên Lắc Phô Mai #96 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(128, 'SP-9F501B', 'Flat White Đậm Đà #97', 57000.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món flat white đậm đà thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Flat White Đậm Đà #97 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(129, 'SP-55AE1F', 'Kimbap Hàn Quốc Cuộn Cá Hồi #98', 40000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món kimbap hàn quốc cuộn cá hồi thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Kimbap Hàn Quốc Cuộn Cá Hồi #98 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(130, 'SP-BBEEC5', 'Sinh Tố Dưa Gang Thanh Mát #99', 64000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món sinh tố dưa gang thanh mát thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Sinh Tố Dưa Gang Thanh Mát #99 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(131, 'SP-989599', 'Hamburger Bò Mỹ Phô Mai #100', 63000.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 1, NULL, 'Thưởng thức món hamburger bò mỹ phô mai thơm ngon đặc biệt được pha chế và chế biến từ nguyên liệu tươi sạch hảo hạng.', 'Sản phẩm Hamburger Bò Mỹ Phô Mai #100 là sự kết tinh từ nguồn nguyên liệu chọn lọc cao cấp. Trải qua quy trình chế biến khắt khe của đội ngũ pha chế/đầu bếp giàu kinh nghiệm để mang lại hương vị thơm ngon nồng nàn quyến rũ khó cưỡng.', '2026-05-29 17:17:27', '2026-05-29 17:17:27'),
(232, 'SP-323FDE', 'Món ăn test API 0x75ad18', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Mô tả ngắn test API', 'Mô tả đầy đủ test API', '2026-05-29 17:25:14', '2026-05-29 17:25:14'),
(233, 'SP-52B923', 'Món ăn test di chuyển (Đã cập nhật chủ sở hữu)', 12000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', NULL, NULL, '2026-05-29 17:27:01', '2026-05-29 17:29:20'),
(234, 'SP-58E72E', 'Tiramisu Smart Contract #1', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 1 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:50', '2026-05-29 17:29:50'),
(235, 'SP-317371', 'Juice DeFi #2', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 2 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:51', '2026-05-29 17:29:51'),
(236, 'SP-0BE7D9', 'Matcha Ethereum #3', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 3 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:51', '2026-05-29 17:29:51'),
(237, 'SP-749AA0', 'Juice Stellar #4', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 4 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:52', '2026-05-29 17:29:52'),
(238, 'SP-39736E', 'Trà đào DeFi #5', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 5 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:53', '2026-05-29 17:29:53'),
(239, 'SP-6A986E', 'Cappuccino Polkadot #6', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 6 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:53', '2026-05-29 17:29:53'),
(240, 'SP-73BBED', 'Tiramisu Dogecoin #7', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 7 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:54', '2026-05-29 17:29:54'),
(241, 'SP-589B9F', 'Trà đào NFT #8', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 8 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:54', '2026-05-29 17:29:54'),
(242, 'SP-EC699E', 'Cappuccino Cardano #9', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 9 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:55', '2026-05-29 17:29:55'),
(243, 'SP-8B41DD', 'Cappuccino Bitcoin #10', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 10 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:56', '2026-05-29 17:29:56'),
(244, 'SP-374A04', 'Matcha Bull Run #11', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 11 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:56', '2026-05-29 17:29:56'),
(245, 'SP-1FA1F3', 'Espresso Decentralized #12', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 12 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:57', '2026-05-29 17:29:57'),
(246, 'SP-688D50', 'Bánh ngọt Polkadot #13', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 13 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:29:58', '2026-05-29 17:29:58'),
(247, 'SP-90DE51', 'Latte Cardano #14', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 14 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:00', '2026-05-29 17:30:00'),
(248, 'SP-D31868', 'Juice Smart Contract #15', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 15 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:03', '2026-05-29 17:30:03'),
(249, 'SP-2C708C', 'Croissant HODL #16', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 16 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:04', '2026-05-29 17:30:04'),
(250, 'SP-FFF567', 'Cà phê Shiba Inu #17', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 17 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:05', '2026-05-29 17:30:05'),
(251, 'SP-EA71CF', 'Cà phê Polygon #18', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 18 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:05', '2026-05-29 17:30:05'),
(252, 'SP-81CEA4', 'Sinh tố Stellar #19', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 19 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:06', '2026-05-29 17:30:06'),
(253, 'SP-F25437', 'Macchiato Web3 #20', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 20 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:15', '2026-05-29 17:30:15'),
(254, 'SP-E323F7', 'Latte Avalanche #19', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 1 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:16', '2026-05-29 17:30:16'),
(255, 'SP-99AFB3', 'Tiramisu Polygon #21', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 3 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:17', '2026-05-29 17:30:17'),
(256, 'SP-4AC997', 'Espresso Avalanche #20', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 2 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:17', '2026-05-29 17:30:17'),
(257, 'SP-93551A', 'Bánh ngọt Polygon #22', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 4 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:18', '2026-05-29 17:30:18'),
(258, 'SP-DFCC8B', 'Macchiato Shiba Inu #23', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 5 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:18', '2026-05-29 17:30:18'),
(259, 'SP-C725FC', 'Sinh tố Ethereum #24', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 6 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:19', '2026-05-29 17:30:19'),
(260, 'SP-854E7C', 'Trà đào Polygon #25', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 7 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:19', '2026-05-29 17:30:19'),
(261, 'SP-73B935', 'Tiramisu Chainlink #26', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 8 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:20', '2026-05-29 17:30:20'),
(262, 'SP-8C0CDC', 'Juice Bitcoin #27', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 9 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:21', '2026-05-29 17:30:21'),
(263, 'SP-A2334D', 'Matcha Polygon #28', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 10 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:21', '2026-05-29 17:30:21'),
(264, 'SP-285981', 'Tiramisu Ripple #29', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 11 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:22', '2026-05-29 17:30:22'),
(265, 'SP-381553', 'Espresso Uniswap #30', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 12 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:23', '2026-05-29 17:30:23'),
(266, 'SP-92BF25', 'Bánh ngọt Bitcoin #31', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 13 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:23', '2026-05-29 17:30:23'),
(267, 'SP-5402D3', 'Juice Polkadot #32', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 14 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:24', '2026-05-29 17:30:24'),
(268, 'SP-E2A519', 'Macchiato Avalanche #33', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 15 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:24', '2026-05-29 17:30:24'),
(269, 'SP-B80EE7', 'Bánh ngọt Litecoin #34', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 16 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:25', '2026-05-29 17:30:25'),
(270, 'SP-04552A', 'Trà sữa Polygon #35', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 17 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:25', '2026-05-29 17:30:25'),
(271, 'SP-F719CA', 'Juice Solana #36', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 18 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:26', '2026-05-29 17:30:26'),
(272, 'SP-C72740', 'Cappuccino Cardano #37', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 19 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:27', '2026-05-29 17:30:27'),
(273, 'SP-43A5E6', 'Juice Polygon #38', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 20 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:27', '2026-05-29 17:30:27'),
(274, 'SP-7A21FC', 'Trà đào Uniswap #39', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 21 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:28', '2026-05-29 17:30:28'),
(275, 'SP-B0BEBE', 'Latte Ripple #40', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 22 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:28', '2026-05-29 17:30:28'),
(276, 'SP-C3C9FB', 'Espresso Ethereum #41', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 23 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:28', '2026-05-29 17:30:28'),
(277, 'SP-9DDC4B', 'Sinh tố Stellar #42', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 24 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:28', '2026-05-29 17:30:28'),
(278, 'SP-CC6DFF', 'Espresso Avalanche #43', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 25 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:29', '2026-05-29 17:30:29'),
(279, 'SP-2A611F', 'Juice Ethereum #44', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 26 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:29', '2026-05-29 17:30:29'),
(280, 'SP-13E855', 'Latte Uniswap #45', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 27 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:29', '2026-05-29 17:30:29'),
(281, 'SP-338C15', 'Sữa chua Litecoin #46', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 28 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:30', '2026-05-29 17:30:30'),
(282, 'SP-FC1E02', 'Espresso Stellar #47', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 29 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:30', '2026-05-29 17:30:30'),
(283, 'SP-94B80B', 'Espresso Bitcoin #48', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 30 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:30', '2026-05-29 17:30:30'),
(284, 'SP-EEC5D1', 'Macchiato Cardano #21', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 21 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:31', '2026-05-29 17:30:31'),
(285, 'SP-AE45FE', 'Latte Solana #49', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 31 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:39', '2026-05-29 17:30:39'),
(286, 'SP-41FA05', 'Cà phê Polkadot #50', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 32 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:39', '2026-05-29 17:30:39'),
(287, 'SP-B69284', 'Cà phê Stellar #51', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 33 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:39', '2026-05-29 17:30:39'),
(288, 'SP-9F26EF', 'Sữa chua Litecoin #52', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 34 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:40', '2026-05-29 17:30:40'),
(289, 'SP-0EAAF9', 'Latte Cosmos #53', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 35 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:40', '2026-05-29 17:30:40'),
(290, 'SP-26892A', 'Trà sữa Uniswap #54', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 36 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:40', '2026-05-29 17:30:40'),
(291, 'SP-133BDA', 'Sinh tố Cosmos #55', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 37 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:41', '2026-05-29 17:30:41'),
(292, 'SP-A9C151', 'Latte Litecoin #56', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 38 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:41', '2026-05-29 17:30:41'),
(293, 'SP-EF5E57', 'Sinh tố Shiba Inu #57', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 39 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:41', '2026-05-29 17:30:41'),
(294, 'SP-B8FDE2', 'Smoothie Dogecoin #58', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 40 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:42', '2026-05-29 17:30:42'),
(295, 'SP-30DB07', 'Macchiato Cosmos #59', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 41 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:42', '2026-05-29 17:30:42'),
(296, 'SP-CD7773', 'Espresso Cardano #60', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 42 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:42', '2026-05-29 17:30:42'),
(297, 'SP-170A43', 'Cà phê Dogecoin #61', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 43 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:42', '2026-05-29 17:30:42'),
(298, 'SP-559439', 'Smoothie Ethereum #62', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 44 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:43', '2026-05-29 17:30:43'),
(299, 'SP-1292C9', 'Macchiato Bitcoin #63', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 45 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:43', '2026-05-29 17:30:43'),
(300, 'SP-7C236B', 'Sinh tố Solana #64', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 46 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:43', '2026-05-29 17:30:43'),
(301, 'SP-9BDAFD', 'Trà đào Shiba Inu #65', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 47 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:44', '2026-05-29 17:30:44'),
(302, 'SP-9D6A1F', 'Trà đào Dogecoin #66', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 48 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:44', '2026-05-29 17:30:44'),
(303, 'SP-F90A9E', 'Cappuccino Solana #67', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 49 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:44', '2026-05-29 17:30:44'),
(304, 'SP-717A59', 'Trà đào Ripple #68', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 50 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:45', '2026-05-29 17:30:45'),
(305, 'SP-C1FB71', 'Cà phê Cosmos #69', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 51 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:45', '2026-05-29 17:30:45'),
(306, 'SP-4A821D', 'Trà đào Polygon #70', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 52 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:45', '2026-05-29 17:30:45'),
(307, 'SP-0C272E', 'Trà đào Ethereum #71', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 53 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:46', '2026-05-29 17:30:46'),
(308, 'SP-3BFC9C', 'Matcha Avalanche #72', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 54 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:46', '2026-05-29 17:30:46'),
(309, 'SP-0967D7', 'Bánh ngọt Avalanche #73', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 55 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:46', '2026-05-29 17:30:46'),
(310, 'SP-03223C', 'Trà sữa Chainlink #74', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 56 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:46', '2026-05-29 17:30:46'),
(311, 'SP-F8CEF7', 'Smoothie Solana #75', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 57 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:47', '2026-05-29 17:30:47'),
(312, 'SP-C92B59', 'Tiramisu Bitcoin #76', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 58 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:47', '2026-05-29 17:30:47'),
(313, 'SP-625EEA', 'Matcha Cardano #77', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 59 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:47', '2026-05-29 17:30:47'),
(314, 'SP-1DCA1E', 'Tiramisu Ethereum #78', 50000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 60 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:47', '2026-05-29 17:30:47'),
(315, 'SP-0EF5E5', 'Juice Avalanche #22', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 22 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:47', '2026-05-29 17:30:47'),
(316, 'SP-1CC2E6', 'Smoothie Stellar #23', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 23 cực kỳ thơm ngon và bổ dưỡng.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung với tốc độ cao và phí gas cực rẻ. Trải nghiệm ẩm thực Web3 đích thực!', '2026-05-29 17:30:52', '2026-05-29 17:30:52'),
(317, 'SP-442643', 'Tiramisu Shiba Inu #79', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 61 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:52', '2026-05-29 17:30:52'),
(318, 'SP-F8051E', 'Juice Litecoin #80', 30000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 62 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:53', '2026-05-29 17:30:53'),
(319, 'SP-71C703', 'Tiramisu Cosmos #81', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 63 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:53', '2026-05-29 17:30:53'),
(320, 'SP-60C37E', 'Espresso Cardano #82', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 64 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:53', '2026-05-29 17:30:53'),
(321, 'SP-2A2C34', 'Smoothie Avalanche #83', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 65 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:54', '2026-05-29 17:30:54'),
(322, 'SP-774338', 'Cà phê Dogecoin #84', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 66 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:54', '2026-05-29 17:30:54'),
(323, 'SP-586161', 'Juice Solana #85', 80000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 67 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:54', '2026-05-29 17:30:54'),
(324, 'SP-97616B', 'Smoothie Cosmos #86', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 68 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:55', '2026-05-29 17:30:55'),
(325, 'SP-619470', 'Tiramisu Dogecoin #87', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 69 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:55', '2026-05-29 17:30:55'),
(326, 'SP-9D9F99', 'Matcha Ripple #88', 20000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 70 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:55', '2026-05-29 17:30:55'),
(327, 'SP-DEB1D7', 'Juice Polygon #89', 60000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 71 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:55', '2026-05-29 17:30:55'),
(328, 'SP-021476', 'Matcha Bitcoin #90', 100000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 72 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:56', '2026-05-29 17:30:56'),
(329, 'SP-1F3267', 'Cappuccino Chainlink #91', 90000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 73 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:56', '2026-05-29 17:30:56'),
(330, 'SP-CC4A5E', 'Cà phê Shiba Inu #92', 70000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 74 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:56', '2026-05-29 17:30:56'),
(331, 'SP-44D407', 'Bánh ngọt Ethereum #93', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 75 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:57', '2026-05-29 17:30:57'),
(332, 'SP-3F7953', 'Espresso Avalanche #95', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 77 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:57', '2026-05-29 17:30:57'),
(333, 'SP-3C629D', 'Smoothie Cosmos #100', 40000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', 'Món ăn đặc sản blockchain thứ 82 cực kỳ thơm ngon.', 'Thành phần được chọn lọc kỹ lưỡng, giao dịch hoàn toàn trên mạng phi tập trung.', '2026-05-29 17:30:58', '2026-05-29 17:30:58'),
(334, 'SP-AD868C', 'Espresso Ethereum #1', 31000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #1', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:15', '2026-05-29 17:33:15'),
(335, 'SP-27EC58', 'Latte Solana #2', 32000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #2', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:15', '2026-05-29 17:33:15'),
(336, 'SP-EB8934', 'Cappuccino Cardano #3', 33000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #3', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:15', '2026-05-29 17:33:15'),
(337, 'SP-EFAC48', 'Macchiato Polkadot #4', 34000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #4', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:16', '2026-05-29 17:33:16'),
(338, 'SP-2058C2', 'Cà phê Bitcoin #5', 35000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #5', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:16', '2026-05-29 17:33:16'),
(339, 'SP-6040E6', 'Espresso Ethereum #6', 36000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #6', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:16', '2026-05-29 17:33:16'),
(340, 'SP-82712E', 'Latte Solana #7', 37000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #7', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:16', '2026-05-29 17:33:16'),
(341, 'SP-5442BE', 'Cappuccino Cardano #8', 38000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #8', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:17', '2026-05-29 17:33:17'),
(342, 'SP-3B475B', 'Macchiato Polkadot #9', 39000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #9', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:17', '2026-05-29 17:33:17'),
(343, 'SP-75AA9B', 'Cà phê Bitcoin #10', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #10', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:17', '2026-05-29 17:33:17'),
(344, 'SP-104C66', 'Espresso Ethereum #11', 41000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #11', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:17', '2026-05-29 17:33:17'),
(345, 'SP-05EE8E', 'Latte Solana #12', 42000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #12', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:18', '2026-05-29 17:33:18'),
(346, 'SP-C4B0CF', 'Cappuccino Cardano #13', 43000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #13', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:18', '2026-05-29 17:33:18'),
(347, 'SP-8842DC', 'Macchiato Polkadot #14', 44000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #14', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:18', '2026-05-29 17:33:18'),
(348, 'SP-AE245F', 'Cà phê Bitcoin #15', 45000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #15', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:19', '2026-05-29 17:33:19'),
(349, 'SP-545195', 'Espresso Ethereum #16', 46000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #16', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:19', '2026-05-29 17:33:19'),
(350, 'SP-64E0ED', 'Latte Solana #17', 47000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #17', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:20', '2026-05-29 17:33:20'),
(351, 'SP-C3ABDE', 'Cappuccino Cardano #18', 48000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #18', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:20', '2026-05-29 17:33:20'),
(352, 'SP-D980F5', 'Macchiato Polkadot #19', 49000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #19', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:20', '2026-05-29 17:33:20'),
(353, 'SP-23E20A', 'Cà phê Bitcoin #20', 50000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #20', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:21', '2026-05-29 17:33:21'),
(354, 'SP-47EB0D', 'Test speed #1', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Short description', 'Long description', '2026-05-29 17:33:26', '2026-05-29 17:33:26'),
(355, 'SP-793646', 'Test speed #2', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Short description', 'Long description', '2026-05-29 17:33:26', '2026-05-29 17:33:26'),
(356, 'SP-4601CA', 'Test speed #3', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Short description', 'Long description', '2026-05-29 17:33:32', '2026-05-29 17:33:32'),
(357, 'SP-604230', 'Test speed #4', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Short description', 'Long description', '2026-05-29 17:33:35', '2026-05-29 17:33:35'),
(358, 'SP-659291', 'Test speed #5', 40000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Short description', 'Long description', '2026-05-29 17:33:43', '2026-05-29 17:33:43'),
(359, 'SP-1C582F', 'Juice Uniswap #24', 47000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #24', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:43', '2026-05-29 17:33:43'),
(360, 'SP-DAE1D3', 'Trà sữa Avalanche #25', 47500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #25', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:46', '2026-05-29 17:33:46'),
(361, 'SP-6616C6', 'Trà đào Chainlink #26', 48000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #26', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:46', '2026-05-29 17:33:46'),
(362, 'SP-B233EB', 'Matcha Polygon #27', 48500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #27', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:46', '2026-05-29 17:33:46'),
(363, 'SP-DC1208', 'Smoothie Cosmos #28', 49000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #28', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:47', '2026-05-29 17:33:47'),
(364, 'SP-7EE429', 'Juice Uniswap #29', 49500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #29', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:47', '2026-05-29 17:33:47'),
(365, 'SP-B750F6', 'Trà sữa Avalanche #30', 50000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #30', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:47', '2026-05-29 17:33:47'),
(366, 'SP-7BCC4D', 'Trà đào Chainlink #31', 50500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #31', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:47', '2026-05-29 17:33:47'),
(367, 'SP-CEBABF', 'Matcha Polygon #32', 51000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #32', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:48', '2026-05-29 17:33:48'),
(368, 'SP-57A93A', 'Smoothie Cosmos #33', 51500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #33', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:48', '2026-05-29 17:33:48'),
(369, 'SP-79E7E3', 'Juice Uniswap #34', 52000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #34', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:48', '2026-05-29 17:33:48'),
(370, 'SP-6BDC44', 'Trà sữa Avalanche #35', 52500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #35', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:48', '2026-05-29 17:33:48'),
(371, 'SP-C4034F', 'Trà đào Chainlink #36', 53000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #36', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:49', '2026-05-29 17:33:49'),
(372, 'SP-1D955C', 'Matcha Polygon #37', 53500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #37', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:49', '2026-05-29 17:33:49'),
(373, 'SP-558E88', 'Smoothie Cosmos #38', 54000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #38', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:49', '2026-05-29 17:33:49'),
(374, 'SP-15048C', 'Juice Uniswap #39', 54500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #39', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:50', '2026-05-29 17:33:50'),
(375, 'SP-41423C', 'Trà sữa Avalanche #40', 55000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #40', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:50', '2026-05-29 17:33:50'),
(376, 'SP-94BDF0', 'Trà đào Chainlink #41', 55500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #41', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:50', '2026-05-29 17:33:50'),
(377, 'SP-99F61B', 'Matcha Polygon #42', 56000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #42', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:51', '2026-05-29 17:33:51'),
(378, 'SP-A35374', 'Smoothie Cosmos #43', 56500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #43', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:33:51', '2026-05-29 17:33:51'),
(379, 'SP-176C38', 'Sữa chua Shiba Inu #46', 49200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #46', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:02', '2026-05-29 17:34:02');
INSERT INTO `products` (`id`, `sku`, `name`, `price`, `image`, `status`, `store_owner_address`, `short_description`, `description`, `created_at`, `updated_at`) VALUES
(380, 'SP-19B263', 'Bánh ngọt Litecoin #47', 49400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #47', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:02', '2026-05-29 17:34:02'),
(381, 'SP-89AA7F', 'Croissant Ripple #48', 49600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #48', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:02', '2026-05-29 17:34:02'),
(382, 'SP-F35159', 'Tiramisu Stellar #49', 49800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #49', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:03', '2026-05-29 17:34:03'),
(383, 'SP-ECEDB8', 'Sinh tố Dogecoin #50', 50000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #50', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:03', '2026-05-29 17:34:03'),
(384, 'SP-4E4D83', 'Sữa chua Shiba Inu #51', 50200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #51', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:03', '2026-05-29 17:34:03'),
(385, 'SP-ED3EE6', 'Bánh ngọt Litecoin #52', 50400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #52', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:03', '2026-05-29 17:34:03'),
(386, 'SP-60C360', 'Croissant Ripple #53', 50600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #53', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:03', '2026-05-29 17:34:03'),
(387, 'SP-ADEE79', 'Tiramisu Stellar #54', 50800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #54', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:04', '2026-05-29 17:34:04'),
(388, 'SP-E1159E', 'Sinh tố Dogecoin #55', 51000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #55', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:04', '2026-05-29 17:34:04'),
(389, 'SP-212862', 'Sữa chua Shiba Inu #56', 51200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #56', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:04', '2026-05-29 17:34:04'),
(390, 'SP-7904A7', 'Bánh ngọt Litecoin #57', 51400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #57', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:04', '2026-05-29 17:34:04'),
(391, 'SP-7E8048', 'Croissant Ripple #58', 51600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #58', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:04', '2026-05-29 17:34:04'),
(392, 'SP-D0740A', 'Tiramisu Stellar #59', 51800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #59', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:05', '2026-05-29 17:34:05'),
(393, 'SP-603D4E', 'Sinh tố Dogecoin #60', 52000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #60', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:05', '2026-05-29 17:34:05'),
(394, 'SP-93594D', 'Sữa chua Shiba Inu #61', 52200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #61', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:05', '2026-05-29 17:34:05'),
(395, 'SP-79F072', 'Bánh ngọt Litecoin #62', 52400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #62', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:05', '2026-05-29 17:34:05'),
(396, 'SP-05DE86', 'Croissant Ripple #63', 52600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #63', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:05', '2026-05-29 17:34:05'),
(397, 'SP-5F331A', 'Tiramisu Stellar #64', 52800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #64', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:06', '2026-05-29 17:34:06'),
(398, 'SP-8D39A5', 'Sinh tố Dogecoin #65', 53000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #65', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:06', '2026-05-29 17:34:06'),
(399, 'SP-BA624A', 'Espresso Macchiato Smart Contract #66', 51600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #66', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:15', '2026-05-29 17:34:15'),
(400, 'SP-42F956', 'Latte Art Web3 #67', 51700.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #67', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:15', '2026-05-29 17:34:15'),
(401, 'SP-CDC949', 'Cappuccino Foam NFT #68', 51800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #68', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:16', '2026-05-29 17:34:16'),
(402, 'SP-7224FD', 'Matcha Latte DeFi #69', 51900.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #69', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:16', '2026-05-29 17:34:16'),
(403, 'SP-EDACB4', 'Cà phê sữa Decentralized #70', 52000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #70', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:16', '2026-05-29 17:34:16'),
(404, 'SP-D85258', 'Espresso Macchiato Smart Contract #71', 52100.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #71', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:17', '2026-05-29 17:34:17'),
(405, 'SP-E1D3AC', 'Latte Art Web3 #72', 52200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #72', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:17', '2026-05-29 17:34:17'),
(406, 'SP-19EE9C', 'Cappuccino Foam NFT #73', 52300.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #73', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:17', '2026-05-29 17:34:17'),
(407, 'SP-C25D06', 'Matcha Latte DeFi #74', 52400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #74', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:17', '2026-05-29 17:34:17'),
(408, 'SP-BB09C1', 'Cà phê sữa Decentralized #75', 52500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #75', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:18', '2026-05-29 17:34:18'),
(409, 'SP-852DDE', 'Espresso Macchiato Smart Contract #76', 52600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #76', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:18', '2026-05-29 17:34:18'),
(410, 'SP-8FD5F4', 'Latte Art Web3 #77', 52700.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #77', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:18', '2026-05-29 17:34:18'),
(411, 'SP-5E7AD2', 'Cappuccino Foam NFT #78', 52800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #78', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:18', '2026-05-29 17:34:18'),
(412, 'SP-2BDA7C', 'Matcha Latte DeFi #79', 52900.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #79', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:18', '2026-05-29 17:34:18'),
(413, 'SP-D3F688', 'Cà phê sữa Decentralized #80', 53000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #80', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:19', '2026-05-29 17:34:19'),
(414, 'SP-F0EB35', 'Espresso Macchiato Smart Contract #81', 53100.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #81', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:19', '2026-05-29 17:34:19'),
(415, 'SP-88F666', 'Latte Art Web3 #82', 53200.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #82', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:19', '2026-05-29 17:34:19'),
(416, 'SP-0F1EB2', 'Cappuccino Foam NFT #83', 53300.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #83', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:19', '2026-05-29 17:34:19'),
(417, 'SP-89ABBD', 'Matcha Latte DeFi #84', 53400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #84', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:19', '2026-05-29 17:34:19'),
(418, 'SP-76235D', 'Cà phê sữa Decentralized #85', 53500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #85', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:20', '2026-05-29 17:34:20'),
(419, 'SP-69D371', 'Sữa chua nếp cẩm Gas Fee #86', 54300.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #86', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:24', '2026-05-29 17:34:24'),
(420, 'SP-935534', 'Bánh kem Halving #87', 54350.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #87', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:25', '2026-05-29 17:34:25'),
(421, 'SP-7C7035', 'Croissant Bơ Bull Run #88', 54400.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #88', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:25', '2026-05-29 17:34:25'),
(422, 'SP-30ADDD', 'Tiramisu Trà Xanh HODL #89', 54450.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #89', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:25', '2026-05-29 17:34:25'),
(423, 'SP-138225', 'Sinh tố bơ Metaverse #90', 54500.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #90', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:25', '2026-05-29 17:34:25'),
(424, 'SP-8446C0', 'Sữa chua nếp cẩm Gas Fee #91', 54550.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #91', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:26', '2026-05-29 17:34:26'),
(425, 'SP-493D63', 'Bánh kem Halving #92', 54600.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #92', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:26', '2026-05-29 17:34:26'),
(426, 'SP-D473B6', 'Croissant Bơ Bull Run #93', 54650.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #93', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:26', '2026-05-29 17:34:26'),
(427, 'SP-DFF939', 'Tiramisu Trà Xanh HODL #94', 54700.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #94', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:27', '2026-05-29 17:34:27'),
(428, 'SP-FDF81B', 'Sinh tố bơ Metaverse #95', 54750.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #95', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:27', '2026-05-29 17:34:27'),
(429, 'SP-C0460E', 'Sữa chua nếp cẩm Gas Fee #96', 54800.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #96', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:27', '2026-05-29 17:34:27'),
(430, 'SP-11FCDC', 'Bánh kem Halving #97', 54850.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #97', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:28', '2026-05-29 17:34:28'),
(431, 'SP-5CDA02', 'Croissant Bơ Bull Run #98', 54900.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #98', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:28', '2026-05-29 17:34:28'),
(432, 'SP-DFE268', 'Tiramisu Trà Xanh HODL #99', 54950.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #99', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:28', '2026-05-29 17:34:28'),
(433, 'SP-409C17', 'Sinh tố bơ Metaverse #100', 55000.00, NULL, 1, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', 'Món ngon Web3 #100', 'Sản phẩm độc đáo tại Cafe Web3 POS.', '2026-05-29 17:34:28', '2026-05-29 17:34:28'),
(434, 'SP-C03ODJ', 'Cà Phê Cold Brew Nitro Premium', 45000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(435, 'SP-H0KFOA', 'Cà Phê Latte Hạt Dẻ Premium', 49000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(436, 'SP-MR0DLH', 'Caramel Macchiato Nóng Premium', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(437, 'SP-U2HVLQ', 'Cà Phê Cốt Dừa Đá Xay Premium', 42000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(438, 'SP-Q4LEUG', 'Flat White Thượng Hạng Premium', 45000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(439, 'SP-1DGO8K', 'Cà Phê Mocha Đá Premium', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(440, 'SP-Q6ZUUB', 'Trà Nhài Thạch Đác Dẻo Premium', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(441, 'SP-LLRFAV', 'Trà Ô Long Dưa Lưới Premium', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(442, 'SP-LZQBWD', 'Trà Sữa Ô Long Trân Châu Premium', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(443, 'SP-Z0ZZ2I', 'Trà Sữa Matcha Đậu Đỏ Premium', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(444, 'SP-5I41GI', 'Soda Việt Quất Xanh Premium', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(445, 'SP-7RGWXH', 'Soda Blue Ocean Premium', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(446, 'SP-IM6ARA', 'Chocolate Cookie Đá Xay Premium', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(447, 'SP-RTRLXG', 'Sinh Tố Việt Quất Dâu Tây Premium', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(448, 'SP-TQLVFK', 'Kem Gelato Vani Bourbon Premium', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(449, 'SP-UDXRIO', 'Kem Gelato Matcha Uji Premium', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(450, 'SP-ICGTYF', 'Kem Gelato Chocolate Bỉ Premium', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(451, 'SP-5SHVRR', 'Bánh Red Velvet Kiêu Kỳ Premium', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(452, 'SP-LC14OS', 'Bánh Cheesecake Chanh Dây Premium', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(453, 'SP-3NZANN', 'Bánh Croissant Trứng Muối Premium', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(454, 'SP-NN64EU', 'Mỳ Ý Sốt Kem Nấm Premium', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(455, 'SP-GTDHFR', 'Hamburger Bò Phô Mai Double Premium', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(456, 'SP-GBLIRE', 'Sandwich Club Tam Giác Premium', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(457, 'SP-OA6SUJ', 'Gà Rán Giòn Cay Giòn Rụm Premium', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(458, 'SP-TYVLLU', 'Cà Phê Cold Brew Nitro Signature', 45000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(459, 'SP-SYBUEZ', 'Cà Phê Latte Hạt Dẻ Signature', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(460, 'SP-63T6M0', 'Caramel Macchiato Nóng Signature', 49000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(461, 'SP-BFGWVX', 'Cà Phê Cốt Dừa Đá Xay Signature', 42000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(462, 'SP-5GX630', 'Flat White Thượng Hạng Signature', 45000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(463, 'SP-UYNXSA', 'Cà Phê Mocha Đá Signature', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(464, 'SP-YGXX0U', 'Trà Nhài Thạch Đác Dẻo Signature', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(465, 'SP-MGWWZX', 'Trà Ô Long Dưa Lưới Signature', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(466, 'SP-TCSCQP', 'Trà Sữa Ô Long Trân Châu Signature', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(467, 'SP-UNQW1O', 'Trà Sữa Matcha Đậu Đỏ Signature', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(468, 'SP-AABZOE', 'Soda Việt Quất Xanh Signature', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(469, 'SP-WOLXFV', 'Soda Blue Ocean Signature', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(470, 'SP-PJB1WU', 'Chocolate Cookie Đá Xay Signature', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(471, 'SP-KYKRHG', 'Sinh Tố Việt Quất Dâu Tây Signature', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(472, 'SP-2QZ3R9', 'Kem Gelato Vani Bourbon Signature', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(473, 'SP-JVPZXQ', 'Kem Gelato Matcha Uji Signature', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(474, 'SP-KIX39L', 'Kem Gelato Chocolate Bỉ Signature', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(475, 'SP-IUHOXX', 'Bánh Red Velvet Kiêu Kỳ Signature', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(476, 'SP-WGXWGK', 'Bánh Cheesecake Chanh Dây Signature', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(477, 'SP-NEWM2M', 'Bánh Croissant Trứng Muối Signature', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(478, 'SP-6DPLLX', 'Mỳ Ý Sốt Kem Nấm Signature', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(479, 'SP-ULJLPI', 'Hamburger Bò Phô Mai Double Signature', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(480, 'SP-U6UMSB', 'Sandwich Club Tam Giác Signature', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(481, 'SP-LAM80R', 'Gà Rán Giòn Cay Giòn Rụm Signature', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(482, 'SP-ZWBFDM', 'Cà Phê Cold Brew Nitro Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(483, 'SP-D7UA2X', 'Cà Phê Latte Hạt Dẻ Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(484, 'SP-GXLVK5', 'Caramel Macchiato Nóng Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(485, 'SP-W0CSJD', 'Cà Phê Cốt Dừa Đá Xay Đặc Biệt', 42000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(486, 'SP-IAVTGJ', 'Flat White Thượng Hạng Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(487, 'SP-VKDVLA', 'Cà Phê Mocha Đá Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(488, 'SP-ZRMCZB', 'Trà Nhài Thạch Đác Dẻo Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(489, 'SP-BUCMRX', 'Trà Ô Long Dưa Lưới Đặc Biệt', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(490, 'SP-KYFT0A', 'Trà Sữa Ô Long Trân Châu Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(491, 'SP-EXKIPO', 'Trà Sữa Matcha Đậu Đỏ Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(492, 'SP-UWMNUE', 'Soda Việt Quất Xanh Đặc Biệt', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(493, 'SP-OORLSX', 'Soda Blue Ocean Đặc Biệt', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(494, 'SP-UZWPXS', 'Chocolate Cookie Đá Xay Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(495, 'SP-LWLVWM', 'Sinh Tố Việt Quất Dâu Tây Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18');
INSERT INTO `products` (`id`, `sku`, `name`, `price`, `image`, `status`, `store_owner_address`, `short_description`, `description`, `created_at`, `updated_at`) VALUES
(496, 'SP-MOAM6S', 'Kem Gelato Vani Bourbon Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(497, 'SP-6D40CG', 'Kem Gelato Matcha Uji Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(498, 'SP-KDSECS', 'Kem Gelato Chocolate Bỉ Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(499, 'SP-CJRZRC', 'Bánh Red Velvet Kiêu Kỳ Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(500, 'SP-XNZ9HF', 'Bánh Cheesecake Chanh Dây Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(501, 'SP-NODFRF', 'Bánh Croissant Trứng Muối Đặc Biệt', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(502, 'SP-SVPJOY', 'Mỳ Ý Sốt Kem Nấm Đặc Biệt', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(503, 'SP-CUVFLG', 'Hamburger Bò Phô Mai Double Đặc Biệt', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(504, 'SP-NJOBRK', 'Sandwich Club Tam Giác Đặc Biệt', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(505, 'SP-OH4HWT', 'Gà Rán Giòn Cay Giòn Rụm Đặc Biệt', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(506, 'SP-NSZB8R', 'Cà Phê Cold Brew Nitro Classic', 45000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(507, 'SP-KL2MBG', 'Cà Phê Latte Hạt Dẻ Classic', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(508, 'SP-ZMQSGO', 'Caramel Macchiato Nóng Classic', 49000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(509, 'SP-MM41VG', 'Cà Phê Cốt Dừa Đá Xay Classic', 42000.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(510, 'SP-NWZGHL', 'Flat White Thượng Hạng Classic', 45000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn.', 'Tách espresso kép kết hợp cùng sữa tươi nóng có lớp bọt cực kỳ mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(511, 'SP-FL3QID', 'Cà Phê Mocha Đá Classic', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ.', 'Sự kết hợp giữa sốt chocolate đắng ngọt và espresso Robusta quyến rũ. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(512, 'SP-MODRE5', 'Trà Nhài Thạch Đác Dẻo Classic', 39000.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên.', 'Trà xanh nhài thanh mát quyện cùng hạt đác rim dẻo ngọt tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(513, 'SP-TLRIGB', 'Trà Ô Long Dưa Lưới Classic', 42000.00, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm.', 'Trà ô long thanh khiết thơm đậm đà kết hợp cùng dưa lưới tươi giòn ngọt lịm. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(514, 'SP-LW26VJ', 'Trà Sữa Ô Long Trân Châu Classic', 45000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn.', 'Trà sữa ô long nướng thơm lừng kết hợp cùng trân châu đen dai giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(515, 'SP-51KXLA', 'Trà Sữa Matcha Đậu Đỏ Classic', 49000.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi.', 'Trà sữa matcha Uji nguyên chất thơm mát phủ đậu đỏ ngọt bùi. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(516, 'SP-OC5WXA', 'Soda Việt Quất Xanh Classic', 35000.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái.', 'Soda sủi bọt mát lạnh quyện cùng si rô việt quất rừng chua ngọt sảng khoái. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(517, 'SP-MDN66C', 'Soda Blue Ocean Classic', 35000.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh.', 'Sự kết hợp tươi mát giữa si rô vỏ cam Curacao và chanh tươi mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(518, 'SP-TYNPJ4', 'Chocolate Cookie Đá Xay Classic', 49000.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy.', 'Bánh quy oreo xay mịn cùng chocolate đậm đà và phủ kem whipping béo ngậy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(519, 'SP-1XRS8E', 'Sinh Tố Việt Quất Dâu Tây Classic', 45000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa.', 'Sinh tố kết hợp hai loại quả mọng tươi ngon dồi dào chất chống oxy hóa. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(520, 'SP-WSG8SW', 'Kem Gelato Vani Bourbon Classic', 39000.00, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon.', 'Kem Ý dẻo mịn thượng hạng thơm lừng hương vani tự nhiên từ vùng Bourbon. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(521, 'SP-LDKOLI', 'Kem Gelato Matcha Uji Classic', 39000.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn.', 'Vị đắng thanh đậm đà từ bột matcha Nhật Bản quyện cùng kem sữa dẻo mịn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(522, 'SP-ROYQKJ', 'Kem Gelato Chocolate Bỉ Classic', 39000.00, 'https://images.unsplash.com/photo-1501443769991-63b01a27b72c?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà.', 'Sử dụng chocolate đen 70% nhập khẩu từ Bỉ cho vị đắng ngọt đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(523, 'SP-YNPY3K', 'Bánh Red Velvet Kiêu Kỳ Classic', 45000.00, 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu.', 'Cốt bánh đỏ nhung xốp mịn xen kẽ lớp kem cheese béo ngậy chua dịu. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(524, 'SP-RP4Z2T', 'Bánh Cheesecake Chanh Dây Classic', 45000.00, 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát.', 'Bánh phô mai nướng béo ngậy phủ sốt chanh leo chua thanh tươi mát. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(525, 'SP-ZL3LVB', 'Bánh Croissant Trứng Muối Classic', 39000.00, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo.', 'Bánh sừng bò ngàn lớp giòn tan chứa nhân sốt trứng muối tan chảy bùi béo. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(526, 'SP-OA6TS1', 'Mỳ Ý Sốt Kem Nấm Classic', 69000.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói.', 'Mỳ Ý dai ngon hòa cùng nước sốt kem béo ngậy, nấm tươi và thịt xông khói. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(527, 'SP-BLLK4I', 'Hamburger Bò Phô Mai Double Classic', 79000.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy.', 'Hai lớp bò Úc áp chảo mọng nước kết hợp cùng phô mai cheddar tan chảy. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(528, 'SP-QELHPX', 'Sandwich Club Tam Giác Classic', 45000.00, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn.', 'Sandwich nhiều tầng nhân thịt nguội, trứng ốp la, phô mai và xà lách giòn. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(529, 'SP-ILAKTM', 'Gà Rán Giòn Cay Giòn Rụm Classic', 49000.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà.', 'Miếng đùi gà tẩm ướp thảo mộc chiên xù vàng ươm giòn tan đậm đà. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(530, 'SP-RQQOAZ', 'Cà Phê Cold Brew Nitro Royal', 45000.00, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên.', 'Cold brew được sục khí nitơ tạo lớp bọt mịn dày xốp và hương vị ngọt dịu tự nhiên. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(531, 'SP-ZZYUNM', 'Cà Phê Latte Hạt Dẻ Royal', 49000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp.', 'Espresso thơm nhẹ kết hợp cùng sữa tươi nóng và hương hạt dẻ ấm áp. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(532, 'SP-JSBQUW', 'Caramel Macchiato Nóng Royal', 49000.00, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt.', 'Vị ngọt béo từ caramel hòa quyện với lớp espresso đậm đà và sữa tươi đánh bọt. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(533, 'SP-XE275I', 'Cà Phê Cốt Dừa Đá Xay Royal', 42000.00, 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=500&auto=format&fit=crop&q=60', 1, '0x75ad18ef47eda21baff837cac0f1563d0c355555', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh.', 'Cà phê Robusta đắng đậm kết hợp hoàn hảo cùng nước cốt dừa dẻo thơm mát lạnh. Đây là món ăn đặc sắc được chuẩn bị bởi đội ngũ pha chế/đầu bếp giàu kinh nghiệm của quán, sử dụng các nguyên liệu nhập khẩu tươi ngon nhất để mang lại hương vị chuẩn gu đẳng cấp cho khách hàng thưởng thức.', '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(534, 'SP-64022E', 'Cà Phê Latte Hạt Dẻ Royal', 49000.00, NULL, 1, '0xcd410fc84cec418253d9582717315e3186f9196a', NULL, 'Cà phê latte hạt dẻ royal thơm ngon', '2026-05-30 05:10:11', '2026-05-30 05:10:11');

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
(47, 434, 'Size M', 45000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(48, 434, 'Size L', 51000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(49, 437, 'Size M', 42000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(50, 437, 'Size L', 51000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(51, 440, 'Size M', 39000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(52, 440, 'Size L', 45000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(53, 443, 'Size M', 49000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(54, 443, 'Size L', 58000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(55, 446, 'Size M', 49000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(56, 446, 'Size L', 55000.00, 1, '2026-05-29 17:37:17', '2026-05-29 17:37:17'),
(57, 458, 'Size M', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(58, 458, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(59, 461, 'Size M', 42000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(60, 461, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(61, 464, 'Size M', 39000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(62, 464, 'Size L', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(63, 467, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(64, 467, 'Size L', 58000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(65, 470, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(66, 470, 'Size L', 55000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(67, 482, 'Size M', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(68, 482, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(69, 485, 'Size M', 42000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(70, 485, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(71, 488, 'Size M', 39000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(72, 488, 'Size L', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(73, 491, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(74, 491, 'Size L', 58000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(75, 494, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(76, 494, 'Size L', 55000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(77, 506, 'Size M', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(78, 506, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(79, 509, 'Size M', 42000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(80, 509, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(81, 512, 'Size M', 39000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(82, 512, 'Size L', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(83, 515, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(84, 515, 'Size L', 58000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(85, 518, 'Size M', 49000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(86, 518, 'Size L', 55000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(87, 530, 'Size M', 45000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(88, 530, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(89, 533, 'Size M', 42000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18'),
(90, 533, 'Size L', 51000.00, 1, '2026-05-29 17:37:18', '2026-05-29 17:37:18');

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

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0kBMVsa76ofxwQO1ZxT1gXLjFDycRS0ib2wyRACr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ5ZHNKaVlkdzlQZklhTHJydEI3SmxucThLUzJ4dG1hRHRTZTFvOVJSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1780100536),
('7F2HYg2qhlbtKxma5uDsg1kjvIPvvXEVxZTcP7iS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJHdzg2a1BqT1dpTnNxTFc3eXYwZGxFdEdrU3JpTHB6M28wWGlkc05CIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1779818062),
('Cfs3nJtJPH4sqgTrjPh7wRHe2CJGLtotoMv2A5og', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI5RnNnaEVQUXY1TXN1N2g1V3NKWHdPZ29heDdvMWxuc0V6YzlLSjFtIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1780101071),
('HKjw3zUIUGXuxSEKh5UqghNgL0ttAtc5lVbG2Tgp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJLc3huN2l6TnBjTlI0ZjFJcHpFUnBmMExMSDhxdEZ5V01JTUlmaW14IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1780072578);

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
(1, 'store_name', 'Blockchain Cafe & Bistro', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(3, 'rpc_url', 'https://ethereum-sepolia.publicnode.com', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(4, 'chain_id', '11155111', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(5, 'explorer_url', 'https://sepolia.etherscan.io', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(6, 'primary_color', '#7c3aed', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(7, 'secondary_color', '#c084fc', NULL, '2026-05-25 10:15:19', '2026-05-25 10:15:19'),
(8, 'store_name', 'Blockchain Cafe & Bistro', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(10, 'rpc_url', 'https://bnb-testnet.api.onfinality.io/public', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(11, 'chain_id', '97', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(12, 'explorer_url', 'https://testnet.bscscan.com', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(13, 'primary_color', '#7c3aed', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(14, 'secondary_color', '#c084fc', NULL, '2026-05-25 10:15:20', '2026-05-25 10:15:20'),
(15, 'store_name', NULL, '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-25 15:03:17'),
(16, 'primary_color', '#ff0000', '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-25 15:03:17'),
(17, 'secondary_color', '#c084fc', '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-25 14:57:55'),
(19, 'rpc_url', 'https://sepolia-rollup.arbitrum.io/rpc', '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-26 01:55:10'),
(20, 'chain_id', '421614', '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-26 01:55:10'),
(21, 'explorer_url', 'https://sepolia.arbiscan.io/', '0xc0f810364e0eacebbd9e02187fd6504df4599999', '2026-05-25 10:25:51', '2026-05-26 01:55:10'),
(22, 'store_name', 'Cafe Web3 POS 010', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 15:27:27'),
(23, 'primary_color', '#0ed100', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 15:27:30'),
(24, 'secondary_color', '#c084fc', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 14:53:12'),
(26, 'rpc_url', 'https://bnb-testnet.api.onfinality.io/public', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 10:27:54'),
(27, 'chain_id', '97', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 10:27:54'),
(28, 'explorer_url', 'https://testnet.bscscan.com', '0x42863a74164440f3384ca82394e891bdb9888888', '2026-05-25 10:27:48', '2026-05-25 10:27:54'),
(29, 'store_name', 'Cafe Web3 POS', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 10:42:07'),
(30, 'primary_color', '#ff00d0', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 15:22:00'),
(31, 'secondary_color', '#c084fc', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 14:50:55'),
(33, 'rpc_url', 'https://bnb-testnet.api.onfinality.io/public', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 10:43:39'),
(34, 'chain_id', '97', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 10:43:39'),
(35, 'explorer_url', 'https://testnet.bscscan.com', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:42:07', '2026-05-25 10:43:39'),
(36, 'store_name', 'Cafe Ví A', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:08', '2026-05-25 15:02:47'),
(38, 'rpc_url', '', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(39, 'chain_id', '', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(40, 'explorer_url', '', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(41, 'primary_color', '#7c3aed', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(42, 'secondary_color', '#c084fc', '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(43, 'store_name', 'Cafe Ví B', '0x1111111111111111111111111111111111111111', '2026-05-25 15:02:47', '2026-05-25 15:02:47'),
(44, 'store_name', 'Cafe Web3 POS', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(45, 'primary_color', '#7c3aed', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(46, 'secondary_color', '#c084fc', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(48, 'rpc_url', '', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(49, 'chain_id', '', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(50, 'explorer_url', '', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-25 18:21:48', '2026-05-25 18:21:48'),
(51, 'store_name', 'Cafe Web3 POS', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:18:01'),
(52, 'primary_color', '#7c3aed', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:18:01'),
(53, 'secondary_color', '#c084fc', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:18:01'),
(55, 'rpc_url', 'https://sepolia-rollup.arbitrum.io/rpc', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:53:07'),
(56, 'chain_id', '421614', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:53:07'),
(57, 'explorer_url', 'https://sepolia.arbiscan.io/', '0x5c8750859c211197e2998cb936ac7635b7e77777', '2026-05-26 01:18:01', '2026-05-26 01:53:07'),
(58, 'store_name', 'Cafe Web3 POS', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(59, 'primary_color', '#7c3aed', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(60, 'secondary_color', '#c084fc', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(62, 'rpc_url', '', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(63, 'chain_id', '', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(64, 'explorer_url', '', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:58', '2026-05-26 10:54:58'),
(65, 'store_name', 'Cafe Web3 POS', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(66, 'primary_color', '#7c3aed', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(67, 'secondary_color', '#c084fc', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(69, 'rpc_url', '', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(70, 'chain_id', '', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(71, 'explorer_url', '', '0xb387dc77fa4ba48901836f802166e6c7105bf04a', '2026-05-26 19:35:57', '2026-05-26 19:35:57'),
(72, 'explorer_api_key', '94CWX8UC3A5UI54EA2B9MAHW2VXRGB3G82', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-27 04:20:54', '2026-05-27 04:20:54'),
(73, 'finance_contract_address', '0xb1316c354cfa7108f7895e8d706f05c5afccc645', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-27 18:01:49', '2026-05-29 00:45:53'),
(74, 'contract_address', '0xf549256179d11dbfb631b993089d0a6983efab60', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 00:45:53', '2026-05-29 00:45:53'),
(75, 'default_print_size', '80mm', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-29 01:31:03', '2026-05-29 01:39:51'),
(76, 'finance_contract_address', '', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-29 08:58:54', '2026-05-29 08:58:54'),
(77, 'finance_contract_address', '', '0x1ad11e0e96797a14336bf474676eb0a332055555', '2026-05-29 10:27:55', '2026-05-29 10:27:55'),
(78, 'store_name', 'Cafe Web3 POS', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(79, 'primary_color', '#7c3aed', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(80, 'secondary_color', '#c084fc', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(81, 'contract_address', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(82, 'finance_contract_address', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(83, 'rpc_url', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(84, 'chain_id', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(85, 'explorer_url', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(86, 'explorer_api_key', '', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(87, 'default_print_size', '80mm', '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', '2026-05-29 17:32:27', '2026-05-29 17:32:27'),
(88, 'store_name', 'Cafe Web3 POS', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(89, 'primary_color', '#7c3aed', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(90, 'secondary_color', '#c084fc', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(91, 'contract_address', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(92, 'finance_contract_address', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(93, 'rpc_url', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(94, 'chain_id', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(95, 'explorer_url', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(96, 'explorer_api_key', '', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(97, 'default_print_size', '80mm', '0x3adac804a22fae38352f7defaf17b8298933aced', '2026-05-30 00:42:25', '2026-05-30 00:42:25'),
(98, 'store_name', 'Cafe Web3 POS', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(99, 'primary_color', '#7c3aed', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(100, 'secondary_color', '#c084fc', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(101, 'contract_address', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(102, 'finance_contract_address', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(103, 'rpc_url', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(104, 'chain_id', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(105, 'explorer_url', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(106, 'explorer_api_key', '', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35'),
(107, 'default_print_size', '80mm', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '2026-05-30 04:50:35', '2026-05-30 04:50:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint UNSIGNED NOT NULL,
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
(1, 'TC-871C38', 'thu', 100000.00, 'Bán hàng', 'khách A trả thêm tiền', '2026-05-29', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x7f082b2b234eb9c6c5d281c216b582697c32091b5b9827dd50b8a9dbdc46263b', 'success', '97', 'fc2309e1cc63f621ffc3000d76fc96138d5e2487b8af682b2ea373c516f0fab8', '2026-05-29 00:54:42', '2026-05-29 00:55:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint UNSIGNED DEFAULT NULL,
  `wallet_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` int NOT NULL DEFAULT '0',
  `min_order_amount` int NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `tx_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_owner_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, '0xc0f810364e0eacebbd9e02187fd6504df4599999', NULL, '2026-05-25 10:25:22', '2026-05-25 10:25:22'),
(2, '0x42863a74164440f3384ca82394e891bdb9888888', NULL, '2026-05-25 10:27:39', '2026-05-25 10:27:39'),
(3, '0x75ad18ef47eda21baff837cac0f1563d0c355555', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 10:41:41', '2026-05-25 15:24:09'),
(4, '0xc0f8fbbf6c5432168a2bf6213eb981665a369999', NULL, '2026-05-25 15:02:21', '2026-05-25 15:02:21'),
(5, '0x535b7a99caf6f73697e69becb437b6ba4b788888', '0x75ad18ef47eda21baff837cac0f1563d0c355555', '2026-05-25 15:24:51', '2026-05-25 15:24:51'),
(6, '0x1ad11e0e96797a14336bf474676eb0a332055555', NULL, '2026-05-25 18:21:46', '2026-05-25 18:21:46'),
(7, '0x5c8750859c211197e2998cb936ac7635b7e77777', NULL, '2026-05-26 01:17:59', '2026-05-26 01:17:59'),
(8, '0xcd410fc84cec418253d9582717315e3186f9196a', '0xcd410fc84cec418253d9582717315e3186f9196a', '2026-05-26 10:54:55', '2026-05-26 19:41:33'),
(9, '0x6ae4d11feb2912b962246cb08e1e76bb4ce50389', NULL, '2026-05-26 19:35:50', '2026-05-26 19:35:50'),
(10, '0xb387dc77fa4ba48901836f802166e6c7105bf04a', NULL, '2026-05-26 19:35:56', '2026-05-26 19:35:56'),
(11, '0x0f7cdc71f7a382186da0ecc239d7743cb1c783dc', NULL, '2026-05-29 17:32:25', '2026-05-29 17:32:25'),
(12, '0x3adac804a22fae38352f7defaf17b8298933aced', NULL, '2026-05-30 00:42:19', '2026-05-30 00:42:19'),
(13, '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', NULL, '2026-05-30 04:50:32', '2026-05-30 04:50:32');

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
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`),
  ADD KEY `order_items_product_variant_id_foreign` (`product_variant_id`);

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
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vouchers_code_unique` (`code`),
  ADD KEY `vouchers_customer_id_foreign` (`customer_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `areas`
--
ALTER TABLE `areas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1107;

--
-- AUTO_INCREMENT cho bảng `customer_groups`
--
ALTER TABLE `customer_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `dining_tables`
--
ALTER TABLE `dining_tables`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `inventory_records`
--
ALTER TABLE `inventory_records`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `inventory_record_items`
--
ALTER TABLE `inventory_record_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=535;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT cho bảng `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

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
