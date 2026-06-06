// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract CafeVoucherNFT {
    // Token Name and Symbol
    string public constant name = "Cafe Web3 Voucher";
    string public constant symbol = "CFV";

    // Mapping to check owner permissions
    mapping(address => bool) public isOwner;

    // Array storing the list of owners
    address[] public owners;

    uint256 private _nextTokenId = 1;

    // Voucher information structure
    struct VoucherInfo {
        uint256 discountAmount;
        uint256 minOrderAmount;
        bool isUsed;
    }

    // ERC-721 standard mappings
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;

    // Enumerable mappings to support ERC721Enumerable functionality without external dependencies
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Mappings for approval
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Store detailed voucher information
    mapping(uint256 => VoucherInfo) public vouchers;

    // EIP-712 Domain Separator and Type Hash
    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant USE_VOUCHER_TYPEHASH =
        keccak256("UseVoucher(uint256 tokenId,string orderCode)");

    // ERC-721 standard events
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    event VoucherMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 discountAmount,
        uint256 minOrderAmount
    );

    event VoucherUsed(
        uint256 indexed tokenId,
        string orderCode,
        address indexed usedBy
    );

    modifier onlyOwners() {
        require(isOwner[msg.sender], "Caller is not an owner");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        owners.push(msg.sender);

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("CafeVoucher")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Zero address query");
        return _balances[_owner];
    }

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) public view returns (uint256) {
        require(index < balanceOf(owner), "Owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getTokensOfOwner(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = _ownedTokens[owner][i];
        }
        return tokenIds;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token query for nonexistent token");
        return tokenOwner;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(
            _owners[tokenId] != address(0),
            "URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    // Standard ERC-721 Approval logic
    function approve(address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(to != tokenOwner, "Approval to current owner");
        require(
            msg.sender == tokenOwner ||
                isApprovedForAll(tokenOwner, msg.sender),
            "Not approved or owner"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(
            _owners[tokenId] != address(0),
            "Approved query for nonexistent token"
        );
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "Approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(
        address tokenOwner,
        address operator
    ) public view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view returns (bool) {
        address tokenOwner = ownerOf(tokenId);
        return (spender == tokenOwner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(tokenOwner, spender));
    }

    // Standard ERC-721 Transfer logic
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Transfer caller is not owner nor approved"
        );
        require(ownerOf(tokenId) == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to the zero address");

        // Clear approval
        delete _tokenApprovals[tokenId];

        // Update enumerable tracking for 'from'
        uint256 lastTokenIndexFrom = _balances[from] - 1;
        uint256 tokenIndexFrom = _ownedTokensIndex[tokenId];

        if (tokenIndexFrom != lastTokenIndexFrom) {
            uint256 lastTokenIdFrom = _ownedTokens[from][lastTokenIndexFrom];

            _ownedTokens[from][tokenIndexFrom] = lastTokenIdFrom;
            _ownedTokensIndex[lastTokenIdFrom] = tokenIndexFrom;
        }
        delete _ownedTokens[from][lastTokenIndexFrom];

        // Update enumerable tracking for 'to'
        uint256 lengthTo = _balances[to];
        _ownedTokens[to][lengthTo] = tokenId;
        _ownedTokensIndex[tokenId] = lengthTo;

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public {
        transferFrom(from, to, tokenId);
        require(
            _checkOnERC721Received(from, to, tokenId, data),
            "Transfer to non ERC721Receiver implementer"
        );
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.code.length > 0) {
            try
                IERC721Receiver(to).onERC721Received(
                    msg.sender,
                    from,
                    tokenId,
                    data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("Transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    // Mint a new voucher for a customer (Only Owner/POS can call)
    function mintVoucher(
        address to,
        string memory _tokenURI,
        uint256 discount,
        uint256 minOrder
    ) public onlyOwners returns (uint256) {
        require(to != address(0), "Mint to zero address");

        uint256 tokenId = _nextTokenId++;

        // Update enumerable tracking
        uint256 length = _balances[to];
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;

        _balances[to] += 1;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = _tokenURI;

        vouchers[tokenId] = VoucherInfo(discount, minOrder, false);

        emit Transfer(address(0), to, tokenId);
        emit VoucherMinted(to, tokenId, _tokenURI, discount, minOrder);

        return tokenId;
    }

    // Redeem and burn a voucher using the customer's signature (Called by a relayer)
    function useVoucherWithSignature(
        uint256 tokenId,
        string memory orderCode,
        bytes memory signature
    ) public {
        address tokenOwner = ownerOf(tokenId);
        require(!vouchers[tokenId].isUsed, "Voucher already used");

        // Create EIP-712 struct hash
        bytes32 structHash = keccak256(
            abi.encode(
                USE_VOUCHER_TYPEHASH,
                tokenId,
                keccak256(bytes(orderCode))
            )
        );

        // Create EIP-712 digest
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );

        // Recover signer address from signature
        address signer = recoverSigner(digest, signature);
        require(signer == tokenOwner, "Invalid signature");

        // Mark voucher as used and burn it
        vouchers[tokenId].isUsed = true;

        // Update enumerable tracking (remove token from owner)
        uint256 lastTokenIndex = _balances[tokenOwner] - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[tokenOwner][lastTokenIndex];

            _ownedTokens[tokenOwner][tokenIndex] = lastTokenId;
            _ownedTokensIndex[lastTokenId] = tokenIndex;
        }
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[tokenOwner][lastTokenIndex];

        _balances[tokenOwner] -= 1;
        delete _owners[tokenId];
        delete _tokenURIs[tokenId];
        delete _tokenApprovals[tokenId]; // Xóa approval khi burn

        emit Transfer(tokenOwner, address(0), tokenId);
        emit VoucherUsed(tokenId, orderCode, tokenOwner);
    }

    // Recover signer address from signature (Similar to ECDSA.recover)
    function recoverSigner(
        bytes32 digest,
        bytes memory signature
    ) public pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        return ecrecover(digest, v, r, s);
    }

    // Add multiple new owners
    function addOwners(address[] memory _newOwners) public onlyOwners {
        for (uint256 i = 0; i < _newOwners.length; i++) {
            address newOwner = _newOwners[i];
            require(newOwner != address(0), "CafeVoucherNFT: invalid owner address");
            if (!isOwner[newOwner]) {
                isOwner[newOwner] = true;
                owners.push(newOwner);
            }
        }
    }

    // Remove multiple existing owners
    function removeOwners(address[] memory _ownersToRemove) public onlyOwners {
        require(_ownersToRemove.length < owners.length, "CafeVoucherNFT: cannot remove all owners");
        for (uint256 i = 0; i < _ownersToRemove.length; i++) {
            address ownerToRemove = _ownersToRemove[i];
            require(ownerToRemove != msg.sender, "CafeVoucherNFT: cannot remove self");
            if (isOwner[ownerToRemove]) {
                isOwner[ownerToRemove] = false;

                // Reconstruct owners array
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

    // Get the list of current owners
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
