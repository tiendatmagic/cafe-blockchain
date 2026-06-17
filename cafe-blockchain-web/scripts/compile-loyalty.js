const path = require('path');
const fs = require('fs');
const solc = require('solc');

try {
    console.log('----------------------------------------------------');
    console.log('BẮT ĐẦU BIÊN DỊCH LOYALTY SMART CONTRACTS');
    console.log('----------------------------------------------------');

    // 1. Đọc files
    console.log('Đang đọc CafeToken.sol...');
    const tokenPath = path.resolve(__dirname, '..', '..', 'contracts', 'CafeToken.sol');
    const tokenSource = fs.readFileSync(tokenPath, 'utf8');

    console.log('Đang đọc VoucherShop.sol...');
    const shopPath = path.resolve(__dirname, '..', '..', 'contracts', 'VoucherShop.sol');
    const shopSource = fs.readFileSync(shopPath, 'utf8');

    console.log('Đang đọc VoucherMarketplace.sol...');
    const marketplacePath = path.resolve(__dirname, '..', '..', 'contracts', 'VoucherMarketplace.sol');
    const marketplaceSource = fs.readFileSync(marketplacePath, 'utf8');

    // 2. Thiết lập input cho solc
    const input = {
        language: 'Solidity',
        sources: {
            'CafeToken.sol': {
                content: tokenSource
            },
            'VoucherShop.sol': {
                content: shopSource
            },
            'VoucherMarketplace.sol': {
                content: marketplaceSource
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode.object']
                }
            }
        }
    };

    console.log('Đang compile bằng solc...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        let hasError = false;
        output.errors.forEach(err => {
            console.log(err.formattedMessage);
            if (err.severity === 'error') {
                hasError = true;
            }
        });
        if (hasError) {
            throw new Error('Lỗi compile contract!');
        }
    }

    // 3. Trích xuất CafeToken
    const tokenContract = output.contracts['CafeToken.sol']['CafeToken'];
    const tokenAbi = tokenContract.abi;
    const tokenBytecode = tokenContract.evm.bytecode.object;

    // 4. Trích xuất VoucherShop
    const shopContract = output.contracts['VoucherShop.sol']['VoucherShop'];
    const shopAbi = shopContract.abi;
    const shopBytecode = shopContract.evm.bytecode.object;

    // 5. Trích xuất VoucherMarketplace
    const marketplaceContract = output.contracts['VoucherMarketplace.sol']['VoucherMarketplace'];
    const marketplaceAbi = marketplaceContract.abi;
    const marketplaceBytecode = marketplaceContract.evm.bytecode.object;

    console.log('Compile thành công cả 3 contracts!');

    // Thư mục đích
    const destDir = path.resolve(__dirname, '..', 'src', 'app', 'core', 'services');

    // 6. Ghi ABI/Bytecode cho CafeToken
    const tokenAbiPath = path.resolve(destDir, 'cafe-token-abi.ts');
    const tokenBytecodePath = path.resolve(destDir, 'cafe-token-bytecode.ts');
    
    fs.writeFileSync(tokenAbiPath, `export const CAFE_TOKEN_ABI = ${JSON.stringify(tokenAbi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(tokenBytecodePath, `export const CAFE_TOKEN_BYTECODE = '0x${tokenBytecode}';\n`, 'utf8');
    console.log(`-> Đã ghi CafeToken ABI: ${tokenAbiPath}`);
    console.log(`-> Đã ghi CafeToken Bytecode: ${tokenBytecodePath}`);

    // 7. Ghi ABI/Bytecode cho VoucherShop
    const shopAbiPath = path.resolve(destDir, 'voucher-shop-abi.ts');
    const shopBytecodePath = path.resolve(destDir, 'voucher-shop-bytecode.ts');

    fs.writeFileSync(shopAbiPath, `export const VOUCHER_SHOP_ABI = ${JSON.stringify(shopAbi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(shopBytecodePath, `export const VOUCHER_SHOP_BYTECODE = '0x${shopBytecode}';\n`, 'utf8');
    console.log(`-> Đã ghi VoucherShop ABI: ${shopAbiPath}`);
    console.log(`-> Đã ghi VoucherShop Bytecode: ${shopBytecodePath}`);

    // 8. Ghi ABI/Bytecode cho VoucherMarketplace
    const marketplaceAbiPath = path.resolve(destDir, 'voucher-marketplace-abi.ts');
    const marketplaceBytecodePath = path.resolve(destDir, 'voucher-marketplace-bytecode.ts');

    fs.writeFileSync(marketplaceAbiPath, `export const VOUCHER_MARKETPLACE_ABI = ${JSON.stringify(marketplaceAbi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(marketplaceBytecodePath, `export const VOUCHER_MARKETPLACE_BYTECODE = '0x${marketplaceBytecode}';\n`, 'utf8');
    console.log(`-> Đã ghi VoucherMarketplace ABI: ${marketplaceAbiPath}`);
    console.log(`-> Đã ghi VoucherMarketplace Bytecode: ${marketplaceBytecodePath}`);

    console.log('----------------------------------------------------');
    console.log('HOÀN THÀNH BIÊN DỊCH LOYALTY SMART CONTRACTS THÀNH CÔNG');
    console.log('----------------------------------------------------');
    process.exit(0);
} catch (error) {
    console.error('Lỗi compile contract:', error.message);
    process.exit(1);
}
