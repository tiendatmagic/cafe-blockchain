// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

interface ICafeToken {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ICafeVoucherNFT {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title VoucherMarketplace
 * @dev Hợp đồng sàn giao dịch NFT Voucher nội bộ giữa các khách hàng thanh toán bằng điểm tích lũy CafeToken.
 */
contract VoucherMarketplace {
    address public cafeTokenAddress;
    address public voucherNFTAddress;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

    // Mapping từ tokenId đến thông tin Listing
    mapping(uint256 => Listing) public listings;
    uint256[] public listedTokenIds;

    // Phí giao dịch (ví dụ: 1% = 100 trong hệ cơ số 10000)
    uint256 public feePercent = 100; // 1%
    address public feeRecipient;

    mapping(address => bool) public isOwner;
    address[] public owners;

    event VoucherListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event VoucherListingCancelled(uint256 indexed tokenId, address indexed seller);
    event VoucherSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 fee);
    event FeeUpdated(uint256 newFeePercent);
    event FeeRecipientUpdated(address newRecipient);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "VoucherMarketplace: caller is not an owner");
        _;
    }

    constructor(address _cafeToken, address _voucherNFT, address _feeRecipient) {
        cafeTokenAddress = _cafeToken;
        voucherNFTAddress = _voucherNFT;
        feeRecipient = _feeRecipient;
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Người sở hữu NFT ký gửi và treo bán Voucher NFT lên chợ với giá quy định bằng CafeToken
     */
    function listVoucher(uint256 _tokenId, uint256 _price) public {
        require(_price > 0, "VoucherMarketplace: price must be greater than zero");
        
        // Kiểm tra xem người gọi có phải chủ sở hữu NFT không
        address tokenOwner = ICafeVoucherNFT(voucherNFTAddress).ownerOf(_tokenId);
        require(tokenOwner == msg.sender, "VoucherMarketplace: caller is not token owner");

        // Chuyển NFT Voucher từ người bán vào contract (người bán phải approve trước)
        ICafeVoucherNFT(voucherNFTAddress).transferFrom(msg.sender, address(this), _tokenId);

        // Tạo listing mới hoặc cập nhật listing cũ
        if (listings[_tokenId].tokenId == 0) {
            listedTokenIds.push(_tokenId);
        }

        listings[_tokenId] = Listing({
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            isActive: true
        });

        emit VoucherListed(_tokenId, msg.sender, _price);
    }

    /**
     * @dev Hủy listing treo bán và nhận lại NFT Voucher
     */
    function cancelListing(uint256 _tokenId) public {
        Listing memory listing = listings[_tokenId];
        require(listing.isActive, "VoucherMarketplace: listing is not active");
        require(listing.seller == msg.sender, "VoucherMarketplace: caller is not the seller");

        // Hủy listing
        listings[_tokenId].isActive = false;

        // Trả NFT lại cho người bán
        ICafeVoucherNFT(voucherNFTAddress).transferFrom(address(this), msg.sender, _tokenId);

        emit VoucherListingCancelled(_tokenId, msg.sender);
    }

    /**
     * @dev Người mua thanh toán token $CAFE để mua NFT Voucher, tiền chuyển sang người bán (trừ phí)
     */
    function buyVoucher(uint256 _tokenId) public {
        Listing memory listing = listings[_tokenId];
        require(listing.isActive, "VoucherMarketplace: listing is not active");
        require(listing.seller != msg.sender, "VoucherMarketplace: seller cannot buy their own voucher");

        // Đánh dấu đã bán để tránh reentrancy
        listings[_tokenId].isActive = false;

        // Tính toán phí giao dịch và số tiền người bán nhận được
        uint256 fee = (listing.price * feePercent) / 10000;
        uint256 sellerAmount = listing.price - fee;

        // 1. Chuyển tiền token $CAFE từ người mua sang người bán
        require(
            ICafeToken(cafeTokenAddress).transferFrom(msg.sender, listing.seller, sellerAmount),
            "VoucherMarketplace: failed to transfer token to seller"
        );

        // 2. Chuyển phí giao dịch về ví quỹ quán (nếu có)
        if (fee > 0) {
            require(
                ICafeToken(cafeTokenAddress).transferFrom(msg.sender, feeRecipient, fee),
                "VoucherMarketplace: failed to transfer transaction fee"
            );
        }

        // 3. Chuyển giao NFT Voucher từ contract cho người mua
        ICafeVoucherNFT(voucherNFTAddress).transferFrom(address(this), msg.sender, _tokenId);

        emit VoucherSold(_tokenId, listing.seller, msg.sender, listing.price, fee);
    }

    /**
     * @dev Lấy danh sách các voucher đang được treo bán
     */
    function getActiveListings() public view returns (Listing[] memory) {
        uint256 total = listedTokenIds.length;
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < total; i++) {
            if (listings[listedTokenIds[i]].isActive) {
                activeCount++;
            }
        }

        Listing[] memory list = new Listing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < total; i++) {
            if (listings[listedTokenIds[i]].isActive) {
                list[index] = listings[listedTokenIds[i]];
                index++;
            }
        }
        return list;
    }

    // Quản trị phí sàn & nhận phí
    function updateFee(uint256 _feePercent) public onlyOwner {
        require(_feePercent <= 1000, "VoucherMarketplace: fee percent cannot exceed 10%"); // Max 10%
        feePercent = _feePercent;
        emit FeeUpdated(_feePercent);
    }

    function updateFeeRecipient(address _feeRecipient) public onlyOwner {
        require(_feeRecipient != address(0), "VoucherMarketplace: invalid recipient address");
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    // Quản trị multi-owner
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "VoucherMarketplace: invalid owner address");
            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(_ownersToRemove.length < owners.length, "VoucherMarketplace: cannot remove all owners");
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            require(ownerToRemove != msg.sender, "VoucherMarketplace: cannot remove self");
            if (isOwner[ownerToRemove]) {
                isOwner[ownerToRemove] = false;
                emit OwnerRemoved(ownerToRemove);
                for (uint256 j = 0; j < owners.length; j++) {
                    if (owners[j] == ownerToRemove) {
                        owners[j] = owners[owners.length - 1];
                        owners.pop();
                        break;
                    }
                }
            }
        }
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
