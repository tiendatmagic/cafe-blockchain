const path = require('path');
const fs = require('fs');
const solc = require('solc');

try {
    console.log('Đang đọc file smart contract CafeWeb3Finance.sol...');
    const contractPath = path.resolve(__dirname, '..', '..', 'contracts', 'CafeWeb3Finance.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    console.log('Đang chuẩn bị input cho compiler Solidity...');
    const input = {
        language: 'Solidity',
        sources: {
            'CafeWeb3Finance.sol': {
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

    const contract = output.contracts['CafeWeb3Finance.sol']['CafeWeb3Finance'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    console.log('Compile thành công!');
    
    // Ghi ABI ra file contract-abi.ts (chúng ta sẽ append hoặc tạo file mới)
    // Tốt nhất là ghi ra các file riêng biệt: finance-contract-abi.ts và finance-contract-bytecode.ts
    const abiPath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'finance-contract-abi.ts');
    const bytecodePath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'finance-contract-bytecode.ts');

    fs.writeFileSync(abiPath, `export const CAFE_WEB3_FINANCE_ABI = ${JSON.stringify(abi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(bytecodePath, `export const CAFE_WEB3_FINANCE_BYTECODE = '0x${bytecode}';\n`, 'utf8');

    console.log(`Đã ghi ABI thành công ra: ${abiPath}`);
    console.log(`Đã ghi Bytecode thành công ra: ${bytecodePath}`);
    process.exit(0);
} catch (error) {
    console.error('Lỗi khi compile contract:', error.message);
    process.exit(1);
}
