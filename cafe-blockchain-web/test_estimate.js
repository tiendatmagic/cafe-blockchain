const { JsonRpcProvider, Contract } = require('ethers');

const ABI = [
  "function updateMenu(tuple(string sku, string name, uint256 price, string image, bool status)[] memory _newProducts) public",
  "function isOwner(address) public view returns (bool)"
];

async function test() {
  const rpcUrl = 'https://bnb-testnet.api.onfinality.io/public';
  const provider = new JsonRpcProvider(rpcUrl);
  const address = '0x1f66772E86CC58fe55fc1DcDd84b58a1AA8FF523';
  const ownerAddress = '0x75AD18eF47eDa21BafF837CAc0F1563D0C355555';
  
  try {
    const contract = new Contract(address, ABI, provider);
    
    // Tạo 104 test sản phẩm không có image (chuỗi rỗng)
    const testProducts = [];
    for (let i = 0; i < 104; i++) {
      testProducts.push({
        sku: `SKU-${100000 + i}`,
        name: `Product Name ${i}`,
        price: BigInt(25000 + i * 100),
        image: "", // Không lưu hình ảnh để tiết kiệm gas
        status: true
      });
    }

    console.log(`Estimating gas for ${testProducts.length} products (WITHOUT images)...`);
    const gas = await contract.updateMenu.estimateGas(testProducts, {
      from: ownerAddress
    });
    console.log('Gas estimated successfully:', gas.toString());
  } catch (error) {
    console.error('Error during estimateGas:', error);
  }
}

test();
