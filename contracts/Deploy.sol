// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ENS, ENSRegistry} from "./ENSRegistryWithFallback.sol";
import {TornadoCash_erc20, IVerifier as erc20_IVerifier} from "./TornadoCash_erc20.sol";
import {TornadoCash_Eth_01, IVerifier as eth_01_IVerifier} from "./TornadoCash_Eth_01.sol";
import {TORN, TornadoRouter} from "./TornadoRouter.sol";
import {ERC20Token} from "./USDT.sol";
import {Verifier} from "./Verifier.sol";

contract TornFactory {

    // Returns the address of the newly deployed contract
    function deploy(
        uint _salt
    ) public payable returns (address) {

        TORN.Recipient memory rec = TORN.Recipient({
        to : stringToBytes32("tornado.governance.eth"),
        amount : 10000000 * 10 ** 18
        });
        TORN.Recipient[] memory recs;
        recs[0] = rec;
        // 不在使用 assembly的新语法调用 create2 ,  仅仅传递 salt 就可以
        // 参考文档：https://learnblockchain.cn/docs/solidity/control-structures.html#create2
        return address(new TORN{salt: bytes32(_salt)}(stringToBytes32("tornado.governance.eth"), 1, recs));
    }

    // 1. 获取待部署合约字节码
    function getBytecode()
    public
    pure
    returns (bytes memory)
    {
        TORN.Recipient memory rec = TORN.Recipient({
        to : stringToBytes32("tornado.governance.eth"),
        amount : 10000000 * 10 ** 18
        });
        TORN.Recipient[] memory recs;
        recs[0] = rec;

        bytes memory bytecode = type(TORN).creationCode;
        return abi.encodePacked(bytecode, abi.encode(stringToBytes32("tornado.governance.eth"), 1, recs));
    }

    // 2. 计算待部署合约地址
    function getAddress(uint256 _salt)
    public
    view
    returns (address)
    {
        // Get a hash concatenating args passed to encodePacked
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this), // address of factory contract
                _salt, // a random salt
                keccak256(getBytecode()) // the wallet contract bytecode
            )
        );
        // Cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}

contract TornadoCash_Eth_01Factory {

    // Returns the address of the newly deployed contract
    function deploy(
        uint _salt
    ) public payable returns (address) {

        // 不在使用 assembly的新语法调用 create2 ,  仅仅传递 salt 就可以
        // 参考文档：https://learnblockchain.cn/docs/solidity/control-structures.html#create2
        return address(new TornadoCash_Eth_01{salt: bytes32(_salt)}(address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0),uint(10 ** 17), uint32(31), address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266), address(0x5FbDB2315678afecb367f032d93F642f64180aa3)));
    }

    // 1. 获取待部署合约字节码
    function getBytecode()
    public
    pure
    returns (bytes memory)
    {
        bytes memory bytecode = type(TORN).creationCode;
        return abi.encodePacked(bytecode, abi.encode(eth_01_IVerifier(address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)),uint(10 ** 17), uint32(31), address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266), address(0x5FbDB2315678afecb367f032d93F642f64180aa3)));
    }

    // 2. 计算待部署合约地址
    function getAddress(uint256 _salt)
    public
    view
    returns (address)
    {
        // Get a hash concatenating args passed to encodePacked
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this), // address of factory contract
                _salt, // a random salt
                keccak256(getBytecode()) // the wallet contract bytecode
            )
        );
        // Cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }
}

contract Deploy {
    constructor(){
    }

    function deploy_2(
        uint _salt
    ) public payable{
        // 不在使用 assembly的新语法调用 create2 ,  仅仅传递 salt 就可以
        // 参考文档：https://learnblockchain.cn/docs/solidity/control-structures.html#create2
        TornFactory tornFactory = new TornFactory{salt: bytes32(_salt)}();
        address torn  = tornFactory.deploy(_salt);

        TornadoCash_Eth_01Factory eth_01_factory = new TornadoCash_Eth_01Factory{salt: bytes32(_salt)}();
        address eth_01 = eth_01_factory.deploy(_salt);
    }
}
