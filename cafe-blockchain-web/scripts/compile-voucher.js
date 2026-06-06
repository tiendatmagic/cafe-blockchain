const path = require('path');
const fs = require('fs');
const solc = require('solc');

try {
    console.log('Đang đọc file smart contract CafeVoucherNFT.sol...');
    const contractPath = path.resolve(__dirname, '..', '..', 'contracts', 'CafeVoucherNFT.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    console.log('Đang chuẩn bị input cho compiler Solidity...');
    const input = {
        language: 'Solidity',
        sources: {
            'CafeVoucherNFT.sol': {
                content: source
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

    console.log('Đang tiến hành compile bằng solc...');
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

    const contract = output.contracts['CafeVoucherNFT.sol']['CafeVoucherNFT'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    console.log('Compile thành công!');
    
    const abiPath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'voucher-contract-abi.ts');
    const bytecodePath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'voucher-contract-bytecode.ts');

    fs.writeFileSync(abiPath, `export const CAFE_VOUCHER_NFT_ABI = ${JSON.stringify(abi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(bytecodePath, `export const CAFE_VOUCHER_NFT_BYTECODE = '0x${bytecode}';\n`, 'utf8');

    console.log(`Đã ghi ABI thành công ra: ${abiPath}`);
    console.log(`Đã ghi Bytecode thành công ra: ${bytecodePath}`);
    process.exit(0);
} catch (error) {
    console.error('Lỗi khi compile contract:', error.message);
    process.exit(1);
}
