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
        string transactionCode;
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

    // Mapping from transactionCode hash to txId
    mapping(bytes32 => uint256) private _txCodeToId;

    // Mapping from recorder address to their recorded txIds
    mapping(address => uint256[]) private _userTxIds;

    // Mapping to check owner permissions (cashiers / managers / owner)
    mapping(address => bool) public isOwner;

    // Array storing the list of owners for easy retrieval and display
    address[] public owners;

    // Events
    event TransactionRecorded(
        uint256 indexed txId,
        string transactionCode,
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
        string memory _transactionCode,
        uint8 _txType,
        uint256 _amount,
        string memory _category,
        string memory _description
    ) public onlyOwner {
        require(
            _transactions[_txId].txId == 0,
            "CafeWeb3Finance: transaction already exists on blockchain"
        );

        bytes32 codeHash = keccak256(abi.encodePacked(_toLowerCase(_transactionCode)));
        require(
            _txCodeToId[codeHash] == 0,
            "CafeWeb3Finance: transaction code already exists on blockchain"
        );

        require(
            _txType == 0 || _txType == 1,
            "CafeWeb3Finance: invalid transaction type"
        );

        Transaction memory newTx = Transaction({
            txId: _txId,
            transactionCode: _transactionCode,
            txType: _txType,
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        _transactions[_txId] = newTx;
        _txIds.push(_txId);
        _txCodeToId[codeHash] = _txId;
        _userTxIds[msg.sender].push(_txId);

        emit TransactionRecorded(
            _txId,
            _transactionCode,
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
            string memory transactionCode,
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
            t.transactionCode,
            t.txType,
            t.amount,
            t.category,
            t.description,
            t.timestamp,
            t.recordedBy
        );
    }

    /**
     * @dev Queries detailed transaction information by transactionCode
     */
    function getTransactionByCode(
        string memory _transactionCode
    )
        public
        view
        returns (
            uint256 txId,
            string memory transactionCode,
            uint8 txType,
            uint256 amount,
            string memory category,
            string memory description,
            uint256 timestamp,
            address recordedBy
        )
    {
        bytes32 codeHash = keccak256(abi.encodePacked(_toLowerCase(_transactionCode)));
        uint256 tid = _txCodeToId[codeHash];
        require(tid != 0, "CafeWeb3Finance: transaction code does not exist");
        return getTransaction(tid);
    }

    /**
     * @dev Gets the transaction ID by transactionCode
     */
    function getTransactionIdByCode(
        string memory _transactionCode
    ) public view returns (uint256) {
        bytes32 codeHash = keccak256(abi.encodePacked(_toLowerCase(_transactionCode)));
        return _txCodeToId[codeHash];
    }

    /**
     * @dev Gets the total count of recorded transactions
     */
    function getTransactionsCount() public view returns (uint256) {
        return _txIds.length;
    }

    /**
     * @dev Gets the total count of recorded transactions by a specific address
     */
    function getUserTransactionsCount(
        address _user
    ) public view returns (uint256) {
        return _userTxIds[_user].length;
    }

    /**
     * @dev Gets the list of all transaction IDs
     */
    function getAllTransactionIds() public view returns (uint256[] memory) {
        return _txIds;
    }

    /**
     * @dev Gets the list of transaction IDs recorded by a specific address
     */
    function getUserTransactionIds(
        address _user
    ) public view returns (uint256[] memory) {
        return _userTxIds[_user];
    }

    /**
     * @dev Gets the list of all current owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Gets paginated list of all transactions (newest first)
     * _page: 1-indexed page number
     * _limit: number of items per page
     */
    function getTransactionsPaginated(
        uint256 _page,
        uint256 _limit
    ) public view returns (Transaction[] memory txList, uint256 total) {
        require(_page > 0, "CafeWeb3Finance: page must be greater than 0");
        require(_limit > 0, "CafeWeb3Finance: limit must be greater than 0");

        total = _txIds.length;
        if (total == 0) {
            return (new Transaction[](0), 0);
        }

        uint256 startIndex = (_page - 1) * _limit;
        if (startIndex >= total) {
            return (new Transaction[](0), total);
        }

        uint256 endIndex = startIndex + _limit;
        if (endIndex > total) {
            endIndex = total;
        }

        uint256 resultSize = endIndex - startIndex;
        txList = new Transaction[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            uint256 index = total - 1 - (startIndex + i);
            txList[i] = _transactions[_txIds[index]];
        }

        return (txList, total);
    }

    /**
     * @dev Gets paginated list of transactions filtered by a specific address (newest first)
     * _page: 1-indexed page number
     * _limit: number of items per page
     */
    function getUserTransactionsPaginated(
        address _user,
        uint256 _page,
        uint256 _limit
    ) public view returns (Transaction[] memory txList, uint256 total) {
        require(_page > 0, "CafeWeb3Finance: page must be greater than 0");
        require(_limit > 0, "CafeWeb3Finance: limit must be greater than 0");

        uint256[] memory userIds = _userTxIds[_user];
        total = userIds.length;
        if (total == 0) {
            return (new Transaction[](0), 0);
        }

        uint256 startIndex = (_page - 1) * _limit;
        if (startIndex >= total) {
            return (new Transaction[](0), total);
        }

        uint256 endIndex = startIndex + _limit;
        if (endIndex > total) {
            endIndex = total;
        }

        uint256 resultSize = endIndex - startIndex;
        txList = new Transaction[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            uint256 index = total - 1 - (startIndex + i);
            txList[i] = _transactions[userIds[index]];
        }

        return (txList, total);
    }

    /**
     * @dev Converts a string to lowercase
     */
    function _toLowerCase(string memory _str) internal pure returns (string memory) {
        bytes memory bStr = bytes(_str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}
