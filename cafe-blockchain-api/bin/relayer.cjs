const fs = require('fs');
const path = require('path');

// Resolve ethers từ node_modules của Angular frontend để tránh cài đặt lại
const ethersPath = path.join(__dirname, '../../cafe-blockchain-web/node_modules/ethers');
let ethers;
try {
  ethers = require(ethersPath);
} catch (e) {
  console.error(JSON.stringify({
    success: false,
    error: 'Không thể tải thư viện ethers từ frontend. Vui lòng chạy npm install ở thư mục frontend trước.'
  }));
  process.exit(1);
}

const { JsonRpcProvider, Wallet, Contract } = ethers;

// Human-readable ABI của CafeVoucherNFT
const ABI = [
  "function mintVoucher(address to, string _tokenURI, uint256 discount, uint256 minOrder) public returns (uint256)",
  "function useVoucherWithSignature(uint256 tokenId, string orderCode, bytes signature) public",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

async function main() {
  // Nhận tham số JSON từ stdin hoặc argument đầu tiên
  let inputStr = process.argv[2];
  if (!inputStr) {
    console.error(JSON.stringify({ success: false, error: 'Thiếu tham số cấu hình.' }));
    process.exit(1);
  }

  let data;
  try {
    let decodedStr = inputStr;
    // Nếu không bắt đầu bằng dấu ngoặc nhọn, chứng tỏ đây là chuỗi Base64
    if (!inputStr.trim().startsWith('{')) {
      decodedStr = Buffer.from(inputStr, 'base64').toString('utf-8');
    }
    data = JSON.parse(decodedStr);
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: 'Tham số không phải là chuỗi JSON hoặc Base64 hợp lệ.' }));
    process.exit(1);
  }

  const { action, privateKey, rpcUrl, contractAddress } = data;

  if (!action || !privateKey || !rpcUrl || !contractAddress) {
    console.error(JSON.stringify({ success: false, error: 'Thiếu các thông tin bắt buộc (action, privateKey, rpcUrl, contractAddress).' }));
    process.exit(1);
  }

  try {
    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);
    const contract = new Contract(contractAddress, ABI, wallet);

    if (action === 'mint') {
      const { to, tokenUri, discountAmount, minOrderAmount } = data;
      if (!to || !tokenUri || discountAmount === undefined || minOrderAmount === undefined) {
        console.error(JSON.stringify({ success: false, error: 'Thiếu thông tin để mint (to, tokenUri, discountAmount, minOrderAmount).' }));
        process.exit(1);
      }

      // Gửi transaction mint
      const tx = await contract.mintVoucher(to, tokenUri, discountAmount, minOrderAmount);
      const receipt = await tx.wait();
      
      // Lấy tokenId từ Event Transfer (Transfer(address(0), to, tokenId))
      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'Transfer' && parsedLog.args[0] === '0x0000000000000000000000000000000000000000') {
            tokenId = parsedLog.args[2].toString();
            break;
          }
        } catch (e) {
          // Bỏ qua log không parse được
        }
      }

      console.log(JSON.stringify({
        success: true,
        action: 'mint',
        txHash: receipt.hash,
        tokenId: tokenId,
        to: to
      }));

    } else if (action === 'burn') {
      const { tokenId, orderCode, signature } = data;
      if (tokenId === undefined || !orderCode || !signature) {
        console.error(JSON.stringify({ success: false, error: 'Thiếu thông tin để burn (tokenId, orderCode, signature).' }));
        process.exit(1);
      }

      // Gửi transaction useVoucherWithSignature
      const tx = await contract.useVoucherWithSignature(tokenId, orderCode, signature);
      const receipt = await tx.wait();

      console.log(JSON.stringify({
        success: true,
        action: 'burn',
        txHash: receipt.hash,
        tokenId: tokenId,
        orderCode: orderCode
      }));

    } else if (action === 'getVoucher') {
      const { tokenId } = data;
      if (tokenId === undefined) {
        console.error(JSON.stringify({ success: false, error: 'Thiếu tokenId để getVoucher.' }));
        process.exit(1);
      }

      const owner = await contract.ownerOf(tokenId);
      const info = await contract.vouchers(tokenId);
      const tokenUri = await contract.tokenURI(tokenId);

      console.log(JSON.stringify({
        success: true,
        action: 'getVoucher',
        tokenId: tokenId,
        owner: owner,
        discountAmount: info.discountAmount.toString(),
        minOrderAmount: info.minOrderAmount.toString(),
        isUsed: info.isUsed,
        tokenUri: tokenUri
      }));

    } else if (action === 'checkMinted') {
      const { to, orderCode } = data;
      if (!to || !orderCode) {
        console.error(JSON.stringify({ success: false, error: 'Thiếu thông tin check (to, orderCode).' }));
        process.exit(1);
      }

      const balance = await contract.balanceOf(to);
      const targetCount = Number(balance);

      if (targetCount === 0) {
        console.log(JSON.stringify({
          success: true,
          action: 'checkMinted',
          exists: false
        }));
        process.exit(0);
      }

      // Quét Transfer event giật lùi để tìm tokenId (chia chunk 99k block tránh giới hạn RPC)
      let foundTokenId = null;
      let tokensChecked = [];
      const filter = contract.filters.Transfer(null, to);
      const currentBlock = await provider.getBlockNumber();
      const maxScanBlocks = 1000000;
      const scanStart = Math.max(0, currentBlock - maxScanBlocks);
      const chunkSize = 99000;

      let endBlock = currentBlock;
      while (endBlock > scanStart && tokensChecked.length < targetCount) {
        let startBlock = Math.max(scanStart, endBlock - chunkSize);
        try {
          const events = await contract.queryFilter(filter, startBlock, endBlock);
          // Duyệt từ mới nhất về cũ nhất
          for (let i = events.length - 1; i >= 0; i--) {
            const event = events[i];
            const tokenId = event.args[2].toString();
            if (!tokensChecked.includes(tokenId)) {
              tokensChecked.push(tokenId);
              try {
                const tokenUri = await contract.tokenURI(tokenId);
                if (tokenUri.includes(orderCode)) {
                  foundTokenId = tokenId;
                  break;
                }
              } catch (e) {
                // Bỏ qua nếu token đã bị burn hoặc lỗi đọc
              }
            }
          }
          if (foundTokenId !== null) {
            break;
          }
        } catch (err) {
          // Bỏ qua lỗi chunk này hoặc giảm bớt chunk size
        }
        endBlock = startBlock - 1;
      }

      console.log(JSON.stringify({
        success: true,
        action: 'checkMinted',
        exists: foundTokenId !== null,
        tokenId: foundTokenId
      }));

    } else {
      console.error(JSON.stringify({ success: false, error: `Action '${action}' không được hỗ trợ.` }));
      process.exit(1);
    }
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: error.reason || error.message || 'Lỗi không xác định khi tương tác blockchain.'
    }));
    process.exit(1);
  }
}

main();
