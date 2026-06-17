// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

interface ICafeToken {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ICafeVoucherNFT {
    function mintVoucher(address to, string calldata tokenURI, uint256 discount, uint256 minOrder) external returns (uint256);
}

/**
 * @title VoucherShop
 * @dev Hợp đồng cho phép khách hàng đổi điểm CafeToken lấy NFT Voucher giảm giá từ cửa hàng.
 */
contract VoucherShop {
    address public cafeTokenAddress;
    address public voucherNFTAddress;

    struct VoucherType {
        uint256 id;
        uint256 discountAmount;
        uint256 minOrderAmount;
        uint256 priceInCafeToken;
        string tokenURI;
        bool isActive;
    }

    mapping(uint256 => VoucherType) public voucherTypes;
    uint256[] public voucherTypeIds;

    mapping(address => bool) public isOwner;
    address[] public owners;

    event VoucherTypeAdded(uint256 indexed id, uint256 discountAmount, uint256 minOrderAmount, uint256 priceInCafeToken, string tokenURI);
    event VoucherTypeUpdated(uint256 indexed id, bool isActive, uint256 priceInCafeToken);
    event VoucherPurchased(address indexed buyer, uint256 indexed voucherTypeId, uint256 indexed tokenId, uint256 pricePaid);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "VoucherShop: caller is not an owner");
        _;
    }

    constructor(address _cafeToken, address _voucherNFT) {
        cafeTokenAddress = _cafeToken;
        voucherNFTAddress = _voucherNFT;
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Thiết lập một cấu hình voucher mới đổi bằng điểm
     */
    function addVoucherType(
        uint256 _id,
        uint256 _discountAmount,
        uint256 _minOrderAmount,
        uint256 _priceInCafeToken,
        string calldata _tokenURI
    ) public onlyOwner {
        require(voucherTypes[_id].id == 0, "VoucherShop: voucher type ID already exists");
        
        voucherTypes[_id] = VoucherType({
            id: _id,
            discountAmount: _discountAmount,
            minOrderAmount: _minOrderAmount,
            priceInCafeToken: _priceInCafeToken,
            tokenURI: _tokenURI,
            isActive: true
        });

        voucherTypeIds.push(_id);

        emit VoucherTypeAdded(_id, _discountAmount, _minOrderAmount, _priceInCafeToken, _tokenURI);
    }

    /**
     * @dev Cập nhật hoặc vô hiệu hóa một loại voucher đổi bằng điểm
     */
    function updateVoucherType(
        uint256 _id,
        bool _isActive,
        uint256 _priceInCafeToken
    ) public onlyOwner {
        require(voucherTypes[_id].id != 0, "VoucherShop: voucher type does not exist");
        
        voucherTypes[_id].isActive = _isActive;
        voucherTypes[_id].priceInCafeToken = _priceInCafeToken;

        emit VoucherTypeUpdated(_id, _isActive, _priceInCafeToken);
    }

    /**
     * @dev Khách hàng mua Voucher NFT bằng cách đốt CafeToken điểm tích lũy
     */
    function buyVoucher(uint256 _voucherTypeId) public returns (uint256) {
        VoucherType memory vType = voucherTypes[_voucherTypeId];
        require(vType.id != 0, "VoucherShop: voucher type does not exist");
        require(vType.isActive, "VoucherShop: voucher type is currently disabled");

        // Gửi token của khách hàng vào địa chỉ chết (Burn)
        address burnAddress = address(0x000000000000000000000000000000000000dEaD);
        require(
            ICafeToken(cafeTokenAddress).transferFrom(msg.sender, burnAddress, vType.priceInCafeToken),
            "VoucherShop: failed to transfer and burn token"
        );

        // Mint Voucher NFT chuyển trực tiếp cho khách hàng
        uint256 tokenId = ICafeVoucherNFT(voucherNFTAddress).mintVoucher(
            msg.sender,
            vType.tokenURI,
            vType.discountAmount,
            vType.minOrderAmount
        );

        emit VoucherPurchased(msg.sender, _voucherTypeId, tokenId, vType.priceInCafeToken);

        return tokenId;
    }

    /**
     * @dev Lấy danh sách các loại voucher đổi bằng điểm hiện có
     */
    function getVoucherTypes() public view returns (VoucherType[] memory) {
        uint256 count = voucherTypeIds.length;
        VoucherType[] memory list = new VoucherType[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = voucherTypes[voucherTypeIds[i]];
        }
        return list;
    }

    // Quản trị multi-owner
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "VoucherShop: invalid owner address");
            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(_ownersToRemove.length < owners.length, "VoucherShop: cannot remove all owners");
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            require(ownerToRemove != msg.sender, "VoucherShop: cannot remove self");
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
