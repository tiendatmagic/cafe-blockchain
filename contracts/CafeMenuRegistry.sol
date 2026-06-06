// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title CafeMenuRegistry
 * @dev Manages the menu items and pricing on-chain for the Cafe Web3 POS system.
 * Allows multi-owner management so multiple authorized addresses can update the menu.
 */
contract CafeMenuRegistry {
    struct Product {
        string sku;
        string name;
        uint256 price;
        string image;
        bool status;
    }

    // Array storing the products list
    Product[] private _products;

    // Last updated timestamp
    uint256 public lastUpdated;

    // Mapping to check owner permissions (managers / owners)
    mapping(address => bool) public isOwner;

    // Array storing the list of owners
    address[] public owners;

    // Events
    event MenuUpdated(address indexed updatedBy, uint256 timestamp, uint256 productCount);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    // Modifier to check ownership permission
    modifier onlyOwner() {
        require(isOwner[msg.sender], "CafeMenuRegistry: caller is not an owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    /**
     * @dev Updates the entire menu on-chain
     */
    function updateMenu(Product[] memory _newProducts) public onlyOwner {
        delete _products;
        for (uint256 i = 0; i < _newProducts.length; i++) {
            _products.push(_newProducts[i]);
        }
        lastUpdated = block.timestamp;
        emit MenuUpdated(msg.sender, block.timestamp, _newProducts.length);
    }

    /**
     * @dev Gets all products stored on-chain
     */
    function getAllProducts() public view returns (Product[] memory) {
        return _products;
    }

    /**
     * @dev Gets the total count of products
     */
    function getProductsCount() public view returns (uint256) {
        return _products.length;
    }

    /**
     * @dev Gets a specific product by index
     */
    function getProduct(uint256 _index) public view returns (
        string memory sku,
        string memory name,
        uint256 price,
        string memory image,
        bool status
    ) {
        require(_index < _products.length, "CafeMenuRegistry: index out of bounds");
        Product memory p = _products[_index];
        return (p.sku, p.name, p.price, p.image, p.status);
    }

    /**
     * @dev Adds multiple new owners
     */
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "CafeMenuRegistry: invalid owner address");
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
        require(_ownersToRemove.length < owners.length, "CafeMenuRegistry: cannot remove all owners");
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            require(ownerToRemove != msg.sender, "CafeMenuRegistry: cannot remove self");
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
     * @dev Gets the list of current owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
