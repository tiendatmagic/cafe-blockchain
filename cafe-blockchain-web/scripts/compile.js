const path = require('path');
const fs = require('fs');
const solc = require('solc');

try {
    console.log('----------------------------------------------------');
    console.log('BẮT ĐẦU BIÊN DỊCH SMART CONTRACTS');
    console.log('----------------------------------------------------');

    // 1. Đọc files
    console.log('Đang đọc CafeWeb3POS.sol...');
    const posPath = path.resolve(__dirname, '..', '..', 'contracts', 'CafeWeb3POS.sol');
    const posSource = fs.readFileSync(posPath, 'utf8');

    console.log('Đang đọc CafeWeb3Finance.sol...');
    const financePath = path.resolve(__dirname, '..', '..', 'contracts', 'CafeWeb3Finance.sol');
    const financeSource = fs.readFileSync(financePath, 'utf8');

    // 2. Thiết lập input cho solc
    const input = {
        language: 'Solidity',
        sources: {
            'CafeWeb3POS.sol': {
                content: posSource
            },
            'CafeWeb3Finance.sol': {
                content: financeSource
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

    // 3. Trích xuất POS
    const posContract = output.contracts['CafeWeb3POS.sol']['CafeWeb3POS'];
    const posAbi = posContract.abi;
    const posBytecode = posContract.evm.bytecode.object;

    // 4. Trích xuất Finance
    const financeContract = output.contracts['CafeWeb3Finance.sol']['CafeWeb3Finance'];
    const financeAbi = financeContract.abi;
    const financeBytecode = financeContract.evm.bytecode.object;

    console.log('Compile thành công cả 2 contracts!');

    // 5. Ghi ABI/Bytecode cho POS
    const posAbiPath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'contract-abi.ts');
    const posBytecodePath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'contract-bytecode.ts');
    
    fs.writeFileSync(posAbiPath, `export const CAFE_WEB3_POS_ABI = ${JSON.stringify(posAbi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(posBytecodePath, `export const CAFE_WEB3_POS_BYTECODE = '0x${posBytecode}';\n`, 'utf8');
    console.log(`-> Đã ghi POS ABI: ${posAbiPath}`);
    console.log(`-> Đã ghi POS Bytecode: ${posBytecodePath}`);

    // 6. Ghi ABI/Bytecode cho Finance
    const finAbiPath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'finance-contract-abi.ts');
    const finBytecodePath = path.resolve(__dirname, '..', 'src', 'app', 'services', 'finance-contract-bytecode.ts');

    fs.writeFileSync(finAbiPath, `export const CAFE_WEB3_FINANCE_ABI = ${JSON.stringify(financeAbi, null, 2)};\n`, 'utf8');
    fs.writeFileSync(finBytecodePath, `export const CAFE_WEB3_FINANCE_BYTECODE = '0x${financeBytecode}';\n`, 'utf8');
    console.log(`-> Đã ghi FINANCE ABI: ${finAbiPath}`);
    console.log(`-> Đã ghi FINANCE Bytecode: ${finBytecodePath}`);

    console.log('----------------------------------------------------');
    console.log('HOÀN THÀNH BIÊN DỊCH SMART CONTRACTS THÀNH CÔNG');
    console.log('----------------------------------------------------');
    process.exit(0);
} catch (error) {
    console.error('Lỗi compile contract:', error.message);
    process.exit(1);
}
