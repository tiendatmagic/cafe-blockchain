// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CafeWeb3POS
 * @dev Quản lý hóa đơn bán hàng cho hệ thống Cafe Web3 POS tích hợp Blockchain EVM.
 * Cho phép ghi nhận bằng chứng hóa đơn (bill order) lên Blockchain bởi các ví thu ngân được ủy quyền.
 */
contract CafeWeb3POS {
    
    struct Order {
        uint256 orderId;
        string tableNumber;
        uint256 totalAmount;
        string paymentMethod;
        string itemsSummary;
        uint256 timestamp;
        address recordedBy;
    }

    // Mapping từ orderId sang thông tin Order chi tiết
    mapping(uint256 => Order) private _orders;
    
    // Mảng lưu trữ tất cả các orderId đã được ghi nhận
    uint256[] private _orderIds;
    
    // Mapping kiểm tra quyền Owner (ví thu ngân / quản lý)
    mapping(address => bool) public isOwner;
    
    // Mảng lưu danh sách các Owners để tiện hiển thị
    address[] public owners;

    // Events
    event OrderRecorded(
        uint256 indexed orderId,
        string tableNumber,
        uint256 totalAmount,
        string paymentMethod,
        string itemsSummary,
        uint256 timestamp,
        address indexed recordedBy
    );
    
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    // Modifier kiểm tra quyền sở hữu
    modifier onlyOwner() {
        require(isOwner[msg.sender], "CafeWeb3POS: ban khong phai la owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Ghi nhận hóa đơn bán hàng lên Blockchain
     */
    function recordOrder(
        uint256 _orderId,
        string memory _tableNumber,
        uint256 _totalAmount,
        string memory _paymentMethod,
        string memory _itemsSummary
    ) public onlyOwner {
        require(_orders[_orderId].orderId == 0, "CafeWeb3POS: don hang da ton tai tren blockchain");
        
        Order memory newOrder = Order({
            orderId: _orderId,
            tableNumber: _tableNumber,
            totalAmount: _totalAmount,
            paymentMethod: _paymentMethod,
            itemsSummary: _itemsSummary,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        _orders[_orderId] = newOrder;
        _orderIds.push(_orderId);

        emit OrderRecorded(
            _orderId,
            _tableNumber,
            _totalAmount,
            _paymentMethod,
            _itemsSummary,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @dev Thêm nhiều Owner (ví thu ngân) mới
     */
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "CafeWeb3POS: dia chi vi khong hop le");
            
            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    /**
     * @dev Xóa nhiều Owner (ví thu ngân) hiện tại
     */
    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(_ownersToRemove.length < owners.length, "CafeWeb3POS: khong the xoa tat ca owners");
        
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            
            // Không cho phép tự xóa chính mình để tránh mất quyền quản trị vô ý
            require(ownerToRemove != msg.sender, "CafeWeb3POS: khong the tu xoa chinh minh");
            
            if (isOwner[ownerToRemove]) {
                isOwner[ownerToRemove] = false;
                emit OwnerRemoved(ownerToRemove);
                
                // Cập nhật lại mảng owners
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

    /**
     * @dev Truy vấn chi tiết đơn hàng theo orderId
     */
    function getOrder(uint256 _orderId) public view returns (
        uint256 orderId,
        string memory tableNumber,
        uint256 totalAmount,
        string memory paymentMethod,
        string memory itemsSummary,
        uint256 timestamp,
        address recordedBy
    ) {
        Order memory o = _orders[_orderId];
        require(o.orderId != 0, "CafeWeb3POS: don hang khong ton tai");
        return (
            o.orderId,
            o.tableNumber,
            o.totalAmount,
            o.paymentMethod,
            o.itemsSummary,
            o.timestamp,
            o.recordedBy
        );
    }

    /**
     * @dev Lấy tổng số lượng đơn hàng đã ghi nhận
     */
    function getOrdersCount() public view returns (uint256) {
        return _orderIds.length;
    }

    /**
     * @dev Lấy danh sách tất cả các ID đơn hàng
     */
    function getAllOrderIds() public view returns (uint256[] memory) {
        return _orderIds;
    }

    /**
     * @dev Lấy danh sách tất cả các Owners hiện tại
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
