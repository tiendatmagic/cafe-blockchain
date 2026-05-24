// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title CafeWeb3POS
 * @dev Manages billing records for the Cafe Web3 POS system integrated with EVM Blockchain.
 * Allows recording order billing proofs on-chain by authorized cashier wallets.
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

    // Mapping from orderId to detailed Order information
    mapping(uint256 => Order) private _orders;

    // Array storing all recorded orderIds
    uint256[] private _orderIds;

    // Mapping to check owner permissions (cashiers / managers)
    mapping(address => bool) public isOwner;

    // Array storing the list of owners for easy retrieval and display
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

    // Modifier to check ownership permission
    modifier onlyOwner() {
        require(isOwner[msg.sender], "CafeWeb3POS: caller is not an owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Records a sales order on-chain
     */
    function recordOrder(
        uint256 _orderId,
        string memory _tableNumber,
        uint256 _totalAmount,
        string memory _paymentMethod,
        string memory _itemsSummary
    ) public onlyOwner {
        require(
            _orders[_orderId].orderId == 0,
            "CafeWeb3POS: order already exists on blockchain"
        );

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
     * @dev Adds multiple new owners (cashier wallets)
     */
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(
                newOwner != address(0),
                "CafeWeb3POS: invalid owner address"
            );

            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    /**
     * @dev Removes multiple existing owners (cashier wallets)
     */
    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(
            _ownersToRemove.length < owners.length,
            "CafeWeb3POS: cannot remove all owners"
        );

        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];

            // Do not allow self-removal to prevent accidental loss of admin rights
            require(
                ownerToRemove != msg.sender,
                "CafeWeb3POS: cannot remove self"
            );

            if (isOwner[ownerToRemove]) {
                isOwner[ownerToRemove] = false;
                emit OwnerRemoved(ownerToRemove);

                // Reconstruct the owners array
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
     * @dev Queries detailed order information by orderId
     */
    function getOrder(
        uint256 _orderId
    )
        public
        view
        returns (
            uint256 orderId,
            string memory tableNumber,
            uint256 totalAmount,
            string memory paymentMethod,
            string memory itemsSummary,
            uint256 timestamp,
            address recordedBy
        )
    {
        Order memory o = _orders[_orderId];
        require(o.orderId != 0, "CafeWeb3POS: order does not exist");
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
     * @dev Gets the total count of recorded orders
     */
    function getOrdersCount() public view returns (uint256) {
        return _orderIds.length;
    }

    /**
     * @dev Gets the list of all order IDs
     */
    function getAllOrderIds() public view returns (uint256[] memory) {
        return _orderIds;
    }

    /**
     * @dev Gets the list of all current owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
