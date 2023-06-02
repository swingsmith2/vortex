const Web3Utils = require("web3-utils")
let data = 0x64E52
hexdata = Web3Utils.toHex(data)
console.log(hexdata)
bytedata = Web3Utils.hexToBytes(hexdata)
console.log(bytedata)
console.log(bytedata.length)

let code = [56]
code = code.concat([0x5F + bytedata.length], bytedata)
console.log(code)

console.log(Web3Utils.toHex(0x5f+32))