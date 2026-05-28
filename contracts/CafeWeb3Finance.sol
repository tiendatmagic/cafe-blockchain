// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title CafeWeb3Finance
 * @dev Manages financial income and expense transaction proofs for the Cafe Web3 system.
 * Allows recording financial transaction proofs on-chain by authorized manager/cashier wallets.
 */
contract CafeWeb3Finance {
    struct Transaction {
        uint256 txId;
        uint8 txType;
        uint256 amount;
        string category;
        string description;
        uint256 timestamp;
        address recordedBy;
    }

    // Mapping from txId to detailed Transaction information
    mapping(uint256 => Transaction) private _transactions;

    // Array storing all recorded txIds
    uint256[] private _txIds;

    // Mapping to check owner permissions (cashiers / managers / owner)
    mapping(address => bool) public isOwner;

    // Array storing the list of owners for easy retrieval and display
    address[] public owners;

    // Events
    event TransactionRecorded(
        uint256 indexed txId,
        uint8 txType,
        uint256 amount,
        string category,
        string description,
        uint256 timestamp,
        address indexed recordedBy
    );

    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    // Modifier to check ownership permission
    modifier onlyOwner() {
        require(isOwner[msg.sender], "CafeWeb3Finance: caller is not an owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Records a financial transaction on-chain
     */
    function recordTransaction(
        uint256 _txId,
        uint8 _txType,
        uint256 _amount,
        string memory _category,
        string memory _description
    ) public onlyOwner {
        require(
            _transactions[_txId].txId == 0,
            "CafeWeb3Finance: transaction already exists on blockchain"
        );
        require(
            _txType == 0 || _txType == 1,
            "CafeWeb3Finance: invalid transaction type"
        );

        Transaction memory newTx = Transaction({
            txId: _txId,
            txType: _txType,
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        _transactions[_txId] = newTx;
        _txIds.push(_txId);

        emit TransactionRecorded(
            _txId,
            _txType,
            _amount,
            _category,
            _description,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @dev Adds multiple new owners
     */
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(
                newOwner != address(0),
                "CafeWeb3Finance: invalid owner address"
            );

            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    /**
     * @dev Removes multiple existing owners
     */
    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(
            _ownersToRemove.length < owners.length,
            "CafeWeb3Finance: cannot remove all owners"
        );

        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];

            // Do not allow self-removal to prevent accidental loss of admin rights
            require(
                ownerToRemove != msg.sender,
                "CafeWeb3Finance: cannot remove self"
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
     * @dev Queries detailed transaction information by txId
     */
    function getTransaction(
        uint256 _txId
    )
        public
        view
        returns (
            uint256 txId,
            uint8 txType,
            uint256 amount,
            string memory category,
            string memory description,
            uint256 timestamp,
            address recordedBy
        )
    {
        Transaction memory t = _transactions[_txId];
        require(t.txId != 0, "CafeWeb3Finance: transaction does not exist");
        return (
            t.txId,
            t.txType,
            t.amount,
            t.category,
            t.description,
            t.timestamp,
            t.recordedBy
        );
    }

    /**
     * @dev Gets the total count of recorded transactions
     */
    function getTransactionsCount() public view returns (uint256) {
        return _txIds.length;
    }

    /**
     * @dev Gets the list of all transaction IDs
     */
    function getAllTransactionIds() public view returns (uint256[] memory) {
        return _txIds;
    }

    /**
     * @dev Gets the list of all current owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
