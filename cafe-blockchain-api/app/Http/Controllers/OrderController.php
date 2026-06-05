<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $query = Order::where('store_owner_address', $storeOwner)->with(['customer', 'items.product', 'items.variant'])->orderBy('id', 'desc');
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('blockchain_status') && $request->blockchain_status != 'all') {
            $query->where('blockchain_status', $request->blockchain_status);
        }

        $orders = $query->get();
        return response()->json($orders);
    }

    /**
     * Lấy chi tiết đơn hàng
     */
    public function show(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $order = Order::where('store_owner_address', $storeOwner)->with(['customer', 'items.product', 'items.variant'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Tạo đơn hàng mới (POS)
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'order_code' => 'nullable|string|max:50|unique:orders,order_code',
            'table_number' => 'nullable|string|max:50',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto',
            'voucher_nft_token_id' => 'nullable|integer',
            'voucher_nft_signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $itemsData = [];

            // Tính tổng tiền và lấy chi tiết món
            foreach ($validated['items'] as $item) {
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                $price = $product->price;
                $variantId = $item['product_variant_id'] ?? null;

                if ($variantId) {
                    // Truy vấn variant từ DB để xác thực xem có đúng thuộc sản phẩm này không
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if ($variant) {
                        $price = $variant->price;
                    } else {
                        throw new \Exception("Biến thể sản phẩm không hợp lệ cho món: " . $product->name);
                    }
                }

                $quantity = $item['quantity'];
                $subTotal = $price * $quantity;
                $totalAmount += $subTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'note' => $item['note'] ?? null,
                ];
            }

            // Áp dụng voucher nếu có
            $discountAmount = 0;
            $voucherNftTokenId = $validated['voucher_nft_token_id'] ?? null;
            $voucherNftSignature = $validated['voucher_nft_signature'] ?? null;

            if ($voucherNftTokenId !== null && !empty($voucherNftSignature)) {
                // Sử dụng Voucher dạng NFT (EIP-712 & Relayer)
                $orderCode = $validated['order_code'] ?? null;
                if (empty($orderCode)) {
                    $orderCode = 'HD-' . strtoupper(bin2hex(random_bytes(3)));
                    $validated['order_code'] = $orderCode;
                }

                // Kiểm tra khách hàng có liên kết ví EVM hay không
                $customer = null;
                if (!empty($validated['customer_id'])) {
                    $customer = \App\Models\Customer::find($validated['customer_id']);
                }

                if (!$customer || empty($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher chỉ áp dụng cho khách hàng có liên kết ví EVM!");
                }

                // Truy vấn thông tin voucher directly on-chain
                $relayerGet = \App\Services\BlockchainRelayerService::getVoucher($storeOwner, (int)$voucherNftTokenId);
                if (!$relayerGet['success']) {
                    throw new \Exception("Không thể xác thực NFT Voucher từ Blockchain: " . ($relayerGet['error'] ?? 'Lỗi không xác định'));
                }

                if ($relayerGet['isUsed']) {
                    throw new \Exception("NFT Voucher này đã được sử dụng hoặc đã bị tiêu hủy trên chuỗi!");
                }

                // Kiểm tra chủ sở hữu NFT có khớp với ví của khách hàng không
                if (strtolower($relayerGet['owner']) !== strtolower($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher này không thuộc sở hữu của khách hàng được chọn!");
                }

                // Kiểm tra xem đơn hàng có đạt giá trị tối thiểu để áp dụng voucher không
                $blockchainMinOrder = (int)$relayerGet['minOrderAmount'];
                if ($totalAmount < $blockchainMinOrder) {
                    throw new \Exception("Đơn hàng chưa đạt giá trị tối thiểu " . number_format($blockchainMinOrder) . "đ để áp dụng NFT Voucher!");
                }

                // Thực hiện gọi Relayer để tiêu hủy (burn) NFT Voucher trên chuỗi bằng chữ ký số của khách hàng
                $relayerResult = \App\Services\BlockchainRelayerService::useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $orderCode,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Không thể quy đổi NFT Voucher trên Blockchain: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
                }

                // Tiêu hủy thành công, ghi nhận discount
                $discountAmount = (int)$relayerGet['discountAmount'];

                // Xóa chữ ký và đơn hàng tạm thời sau khi quy đổi thành công
                DB::table('voucher_signatures')->where('order_code', $orderCode)->delete();
            }

            $finalTotalAmount = max(0, $totalAmount - $discountAmount);

            // Tạo đơn hàng
            $order = Order::create([
                'order_code' => $validated['order_code'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'customer_id' => $validated['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $validated['payment_method'],
                'status' => 'pending', // Mặc định là đang chờ xác nhận
                'tx_hash' => $relayerResult['txHash'] ?? null,
                'blockchain_status' => 'none',
                'store_owner_address' => $storeOwner,
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ], 201);


        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật đơn hàng (Thêm/Bớt món cho đơn hàng đang chờ)
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        // Ràng buộc bảo mật: chỉ cho phép sửa đơn hàng ở trạng thái pending và chưa đồng bộ blockchain
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Chỉ có thể chỉnh sửa đơn hàng đang ở trạng thái chờ (pending)!'
            ], 400);
        }

        if ($order->blockchain_status !== 'none') {
            return response()->json([
                'message' => 'Không thể chỉnh sửa đơn hàng đã được đồng bộ lên Blockchain!'
            ], 400);
        }

        $validated = $request->validate([
            'table_number' => 'nullable|string|max:50',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto',
            'voucher_nft_token_id' => 'nullable|integer',
            'voucher_nft_signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $itemsData = [];

            // Tính tổng tiền và lấy chi tiết món
            foreach ($validated['items'] as $item) {
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                $price = $product->price;
                $variantId = $item['product_variant_id'] ?? null;

                if ($variantId) {
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if ($variant) {
                        $price = $variant->price;
                    } else {
                        throw new \Exception("Biến thể sản phẩm không hợp lệ cho món: " . $product->name);
                    }
                }

                $quantity = $item['quantity'];
                $subTotal = $price * $quantity;
                $totalAmount += $subTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'note' => $item['note'] ?? null,
                ];
            }

            // Áp dụng voucher nếu có
            $discountAmount = 0;
            $voucherNftTokenId = $validated['voucher_nft_token_id'] ?? null;
            $voucherNftSignature = $validated['voucher_nft_signature'] ?? null;

            if ($order->voucher_nft_token_id !== null) {
                // Đơn hàng đã áp dụng voucher từ trước
                if ($voucherNftTokenId !== null && (int)$voucherNftTokenId !== (int)$order->voucher_nft_token_id) {
                    throw new \Exception("Không thể thay đổi NFT Voucher đã được áp dụng và tiêu hủy cho đơn hàng này!");
                }
                // Giữ nguyên mức giảm giá cũ
                $discountAmount = $order->discount_amount;
                $voucherNftTokenId = $order->voucher_nft_token_id;
            } elseif ($voucherNftTokenId !== null && !empty($voucherNftSignature)) {
                // Áp dụng voucher mới
                $customer = null;
                if (!empty($validated['customer_id'])) {
                    $customer = \App\Models\Customer::find($validated['customer_id']);
                }

                if (!$customer || empty($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher chỉ áp dụng cho khách hàng có liên kết ví EVM!");
                }

                // Truy vấn thông tin voucher directly on-chain
                $relayerGet = \App\Services\BlockchainRelayerService::getVoucher($storeOwner, (int)$voucherNftTokenId);
                if (!$relayerGet['success']) {
                    throw new \Exception("Không thể xác thực NFT Voucher từ Blockchain: " . ($relayerGet['error'] ?? 'Lỗi không xác định'));
                }

                if ($relayerGet['isUsed']) {
                    throw new \Exception("NFT Voucher này đã được sử dụng hoặc đã bị tiêu hủy trên chuỗi!");
                }

                if (strtolower($relayerGet['owner']) !== strtolower($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher này không thuộc sở hữu của khách hàng được chọn!");
                }

                $blockchainMinOrder = (int)$relayerGet['minOrderAmount'];
                if ($totalAmount < $blockchainMinOrder) {
                    throw new \Exception("Đơn hàng chưa đạt giá trị tối thiểu " . number_format($blockchainMinOrder) . "đ để áp dụng NFT Voucher!");
                }

                $relayerResult = \App\Services\BlockchainRelayerService::useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $order->order_code,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Không thể quy đổi NFT Voucher trên Blockchain: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
                }

                $discountAmount = (int)$relayerGet['discountAmount'];

                // Xóa chữ ký và đơn hàng tạm thời sau khi quy đổi thành công
                DB::table('voucher_signatures')->where('order_code', $order->order_code)->delete();
            }

            $finalTotalAmount = max(0, $totalAmount - $discountAmount);

            // Cập nhật thông tin đơn hàng
            $order->update([
                'table_number' => $validated['table_number'] ?? null,
                'customer_id' => $validated['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $validated['payment_method'],
                'tx_hash' => isset($relayerResult['txHash']) ? $relayerResult['txHash'] : $order->tx_hash,
            ]);

            // Xóa toàn bộ chi tiết đơn hàng cũ và tạo mới
            $order->items()->delete();

            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi cập nhật đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng (completed / cancelled)
     */
    public function updateStatus(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:completed,cancelled,pending,preparing',
        ]);

        $order->status = $validated['status'];
        
        // Nếu chuyển sang hủy, chuyển luôn blockchain_status thành none
        if ($validated['status'] === 'cancelled') {
            $order->blockchain_status = 'none';
            $order->tx_hash = null;
        }

        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
        ]);
    }

    /**
     * Đồng bộ blockchain (lưu Tx Hash và cập nhật trạng thái blockchain)
     */
    public function syncBlockchain(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        // Xác thực chữ ký bảo mật HMAC chống can thiệp trực tiếp vào DB MySQL
        if ($order->status === 'completed') {
            $expectedHash = $order->generateVerificationHash();
            if (empty($order->verification_hash) || $order->verification_hash !== $expectedHash) {
                return response()->json([
                    'message' => 'Dữ liệu tài chính của đơn hàng đã bị can thiệp và sửa đổi trái phép! Từ chối đối soát và ghi chuỗi.'
                ], 400);
            }
        }

        $validated = $request->validate([
            'tx_hash' => 'required|string|max:255',
            'blockchain_status' => 'required|string|in:pending,success,failed',
            'chain_id' => 'nullable|string|max:50',
        ]);

        $txHash = $validated['tx_hash'];
        
        // Prevent reusing tx_hash
        if (Order::where('tx_hash', $txHash)->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'Transaction hash has already been used.'], 400);
        }

        // Only verify if setting to success
        if ($validated['blockchain_status'] === 'success') {
            $contractAddress = \App\Models\Setting::getForStore('contract_address', $storeOwner);
            $rpcUrl = \App\Models\Setting::getForStore('rpc_url', $storeOwner, 'https://ethereum-sepolia.publicnode.com');
            
            if (!empty($contractAddress)) {
                try {
                    // Xác thực giao dịch thật qua TxReceipt của Blockchain RPC
                    $payload = [
                        'jsonrpc' => '2.0',
                        'method' => 'eth_getTransactionReceipt',
                        'params' => [$txHash],
                        'id' => 1
                    ];

                    $response = \Illuminate\Support\Facades\Http::post($rpcUrl, $payload);
                    if ($response->successful()) {
                        $result = $response->json('result');
                        
                        // Check if tx exists, is successful, and was sent to our contract
                        if (!$result || 
                            !isset($result['status']) || 
                            hexdec($result['status']) !== 1 ||
                            strtolower($result['to']) !== strtolower($contractAddress)) {
                            return response()->json(['message' => 'Invalid or failed transaction on the blockchain.'], 400);
                        }
                    } else {
                        // RPC error, cannot verify
                        return response()->json(['message' => 'Could not verify transaction with the blockchain node.'], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Error verifying transaction: ' . $e->getMessage()], 500);
                }
            }
        }

        $order->tx_hash = $txHash;
        $order->blockchain_status = $validated['blockchain_status'];
        if (isset($validated['chain_id'])) {
            $order->chain_id = $validated['chain_id'];
        }
        $order->save();

        return response()->json([
            'message' => 'Blockchain sync updated successfully.',
            'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
        ]);
    }

    /**
     * Tặng lại Voucher NFT thủ công cho đơn hàng thành công & đã đồng bộ blockchain
     */
    public function mintVoucherManual(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $order = Order::where('store_owner_address', $storeOwner)->with('customer')->findOrFail($id);

        // 1. Kiểm tra các ràng buộc nghiệp vụ
        if ($order->status !== 'completed') {
            return response()->json(['message' => 'Chỉ có thể tặng voucher cho đơn hàng đã hoàn thành!'], 400);
        }

        if ($order->blockchain_status !== 'success') {
            return response()->json(['message' => 'Chỉ có thể tặng voucher cho đơn hàng đã đồng bộ blockchain thành công!'], 400);
        }

        if ($order->gift_voucher_nft_token_id !== null) {
            return response()->json(['message' => 'Đơn hàng này đã được tặng Voucher NFT rồi (Token ID: ' . $order->gift_voucher_nft_token_id . ').'], 400);
        }

        if (!$order->customer || empty($order->customer->wallet_address)) {
            return response()->json(['message' => 'Khách hàng của đơn hàng này không liên kết ví Web3!'], 400);
        }

        $minGiftAmount = (int)\App\Models\Setting::getForStore('voucher_gift_min_amount', $storeOwner, 100000);
        $originalTotal = $order->total_amount + $order->discount_amount;
        if ($originalTotal < $minGiftAmount) {
            return response()->json(['message' => 'Đơn hàng chưa đạt giá trị tối thiểu ' . number_format($minGiftAmount) . 'đ để được tặng voucher!'], 400);
        }

        $giftDiscount = (int)\App\Models\Setting::getForStore('voucher_discount_amount', $storeOwner, 5000);
        $useMinAmount = (int)\App\Models\Setting::getForStore('voucher_use_min_amount', $storeOwner, 100000);
        $customerWallet = $order->customer->wallet_address;

        // 2. Chống mint trùng: Gọi Relayer checkMinted on-chain trước
        $checkResult = \App\Services\BlockchainRelayerService::checkVoucherMinted(
            $storeOwner,
            $customerWallet,
            $order->order_code
        );

        if ($checkResult['success'] && $checkResult['exists']) {
            // Đã tồn tại voucher NFT on-chain cho đơn hàng này
            $order->gift_voucher_nft_token_id = (int)$checkResult['tokenId'];
            $order->verification_hash = $order->generateVerificationHash();
            $order->saveQuietly();

            return response()->json([
                'message' => 'Phát hiện Voucher NFT đã được đúc thành công trước đó trên Blockchain! Đã khôi phục liên kết dữ liệu.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        }

        // 3. Tiến hành đúc Voucher NFT mới
        $voucherCode = 'NFT-' . $giftDiscount . '-' . $useMinAmount . '-' . $order->order_code;
        $tokenUri = url("/api/vouchers/metadata/{$voucherCode}");

        $relayerResult = \App\Services\BlockchainRelayerService::mintVoucher(
            $storeOwner,
            $customerWallet,
            $tokenUri,
            $giftDiscount,
            $useMinAmount
        );

        if (!$relayerResult['success']) {
            return response()->json([
                'message' => 'Không thể đúc Voucher NFT qua Blockchain Relayer: ' . ($relayerResult['error'] ?? 'Lỗi không xác định')
            ], 500);
        }

        // 4. Lưu lại thông tin đúc thành công vào database
        $tokenId = isset($relayerResult['tokenId']) ? (int)$relayerResult['tokenId'] : null;
        if ($tokenId) {
            $order->gift_voucher_nft_token_id = $tokenId;
            $order->verification_hash = $order->generateVerificationHash();
            $order->saveQuietly();
        }

        return response()->json([
            'message' => 'Tặng và đúc thành công Voucher NFT cho khách hàng!',
            'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
        ]);
    }
}
