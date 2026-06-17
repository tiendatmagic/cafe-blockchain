// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title CafeToken
 * @dev Hợp đồng token ERC-20 tích điểm tiện ích nội bộ cho Cafe Blockchain.
 */
contract CafeToken {
    string public constant name = "Cafe Loyalty Point";
    string public constant symbol = "CAFE";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Quản lý quyền sở hữu (Multi-owner tương tự POS/Voucher contract)
    mapping(address => bool) public isOwner;
    address[] public owners;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "CafeToken: caller is not an owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);
        emit OwnerAdded(msg.sender);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "CafeToken: transfer to the zero address");
        require(balanceOf[msg.sender] >= value, "CafeToken: insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0), "CafeToken: approve to the zero address");
        
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0), "CafeToken: transfer from the zero address");
        require(to != address(0), "CafeToken: transfer to the zero address");
        require(balanceOf[from] >= value, "CafeToken: insufficient balance");
        require(allowance[from][msg.sender] >= value, "CafeToken: allowance exceeded");

        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 value) public onlyOwner returns (bool) {
        require(to != address(0), "CafeToken: mint to the zero address");
        
        totalSupply += value;
        balanceOf[to] += value;
        
        emit Transfer(address(0), to, value);
        return true;
    }

    function burn(uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "CafeToken: burn amount exceeds balance");
        
        totalSupply -= value;
        balanceOf[msg.sender] -= value;
        
        emit Transfer(msg.sender, address(0), value);
        return true;
    }

    // Các hàm quản trị chủ quán/nhân viên POS
    function addOwners(address[] memory _newOwners) public onlyOwner {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "CafeToken: invalid owner address");
            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
                emit OwnerAdded(newOwner);
            }
        }
    }

    function removeOwners(address[] memory _ownersToRemove) public onlyOwner {
        require(_ownersToRemove.length < owners.length, "CafeToken: cannot remove all owners");
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            require(ownerToRemove != msg.sender, "CafeToken: cannot remove self");
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
