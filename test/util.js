const Web3 = require('web3')
const assert = require('assert')
const config = require('./config')
const Tx = require('ethereumjs-tx').Transaction
// 连接到以太坊节点
const web3 = new Web3(new Web3.providers.HttpProvider(config.eth.rpcHost))

// 加载智能合约ABI和地址
const contractABI = config.contract.ABI;
const contractAddress = config.contract.address;

// 创建智能合约实例
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// 设置账户私钥和合约地址
const privateKey = Buffer.from(config.account.privateKey, 'hex')

// 构造交易对象
const txData = contractInstance.methods.deposit(param1, param2).encodeABI();
nonce = await web3.eth.getTransactionCount(config.account.address)
const gasPrice = await web3.eth.getGasPrice();

const txObject = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(500000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
        to: contractAddress,
        data: txData,
        }

// 签名交易并发送到以太坊网络，第二个参数是可选参数
const tx = new Tx(txObject, { chain: 'mainnet', hardfork: 'petersburg' });
tx.sign(privateKey);
const serializedTx = tx.serialize();
web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);

//  let signed = await web3.eth.accounts.signTransaction(tx, ownerPrivateKey);
//     // console.log('signed', signed);
//     //为了提高速度，改为异步执行，并且会sleep 500ms
// console.log("发送开始transactionHash:"+signed.transactionHash+"，nonce:"+nonce);
// await utils.sleep(0.1);
// web3.eth.sendSignedTransaction(signed.rawTransaction);
// return signed.transactionHash
//测试git

// 测试智能合约方法
describe('MyContract', () => {
  it('should return the correct value', async () => {
    const result = await contractInstance.methods.myMethod().call();
    assert.equal(result, 'expected value');
  });
});