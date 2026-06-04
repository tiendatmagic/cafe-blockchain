// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

contract CafeVoucherNFT {
    // Token Name and Symbol
    string public constant name = "Cafe Web3 Voucher";
    string public constant symbol = "CFV";

    // Cafe owner's wallet address (System Administrator)
    address public owner;

    uint256 private _nextTokenId;

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

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;

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

    // Mint a new voucher for a customer (Only Owner/POS can call)
    function mintVoucher(
        address to,
        string memory _tokenURI,
        uint256 discount,
        uint256 minOrder
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "Mint to zero address");

        uint256 tokenId = _nextTokenId++;

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

        _balances[tokenOwner] -= 1;
        delete _owners[tokenId];
        delete _tokenURIs[tokenId];

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

    // Transfer contract ownership to a new administrator wallet
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        owner = newOwner;
    }
}
