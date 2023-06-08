// require('dotenv').config()

module.exports = {
    deployments: {
        netId1: {
            eth: {
                instanceAddress: {
                    0.1: '0xAe120F0df055428E45b264E7794A18c54a2a3fAF',
                    1: '0x193521C8934bCF3473453AF4321911E7A89E0E12',
                    10: '0x9Fcca440F19c62CDF7f973eB6DDF218B15d4C71D',
                    100: '0x01E21d7B8c39dc4C764c19b308Bd8b14B1ba139E',
                },
                symbol: 'ETH',
                decimals: 18,
            },
            dai: {
                instanceAddress: {
                    100: '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
                    1000: '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
                    10000: '0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A',
                    100000: undefined,
                },
                tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                symbol: 'DAI',
                decimals: 18,
            },
            cdai: {
                instanceAddress: {
                    5000: '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
                    50000: '0xBA214C1c1928a32Bffe790263E38B4Af9bFCD659',
                    500000: '0xb1C8094B234DcE6e03f10a5b673c1d8C69739A00',
                    5000000: undefined,
                },
                tokenAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
                symbol: 'cDAI',
                decimals: 8,
            },
            usdc: {
                instanceAddress: {
                    100: '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
                    1000: '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
                    10000: '0xD691F27f38B395864Ea86CfC7253969B409c362d',
                    100000: undefined,
                },
                tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                symbol: 'USDC',
                decimals: 6,
            },
            cusdc: {
                instanceAddress: {
                    5000: '0xaEaaC358560e11f52454D997AAFF2c5731B6f8a6',
                    50000: '0x1356c899D8C9467C7f71C195612F8A395aBf2f0a',
                    500000: '0xA60C772958a3eD56c1F15dD055bA37AC8e523a0D',
                    5000000: undefined,
                },
                tokenAddress: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
                symbol: 'cUSDC',
                decimals: 8,
            },
            usdt: {
                instanceAddress: {
                    100: '0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c',
                    1000: '0x1343248Cbd4e291C6979e70a138f4c774e902561',
                    10000: '0x22a9B82A6c3D2BFB68F324B2e8367f346Dd6f32a',
                    100000: '0x547382C0D1b23f707918D3c83A77317B71Aa8470',
                },
                tokenAddress: '0xcC4c41415fc68B2fBf70102742A83cDe435e0Ca7',
                symbol: 'USDT',
                decimals: 6,
            },
        },
        netId31337: {
            eth: {
                instanceAddress: {
                    0.1: '0x04C89607413713Ec9775E14b954286519d836FEf',
                    1: '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
                    10: '0x21dF544947ba3E8b3c32561399E88B52Dc8b2823',
                    100: '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2',
                },
                symbol: 'ETH',
                decimals: 18,
            },
            dai: {
                instanceAddress: {
                    100: '0xdf2d3cC5F361CF95b3f62c4bB66deFe3FDE47e3D',
                    1000: '0xD96291dFa35d180a71964D0894a1Ae54247C4ccD',
                    10000: '0xb192794f72EA45e33C3DF6fe212B9c18f6F45AE3',
                    100000: undefined,
                },
                tokenAddress: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
                symbol: 'DAI',
                decimals: 18,
            },
            cdai: {
                instanceAddress: {
                    5000: '0x6Fc9386ABAf83147b3a89C36D422c625F44121C8',
                    50000: '0x7182EA067e0f050997444FCb065985Fd677C16b6',
                    500000: '0xC22ceFd90fbd1FdEeE554AE6Cc671179BC3b10Ae',
                    5000000: undefined,
                },
                tokenAddress: '0xe7bc397DBd069fC7d0109C0636d06888bb50668c',
                symbol: 'cDAI',
                decimals: 8,
            },
            usdc: {
                instanceAddress: {
                    100: '0x137E2B6d185018e7f09f6cf175a970e7fC73826C',
                    1000: '0xcC7f1633A5068E86E3830e692e3e3f8f520525Af',
                    10000: '0x28C8f149a0ab8A9bdB006B8F984fFFCCE52ef5EF',
                    100000: undefined,
                },
                tokenAddress: '0x75B0622Cec14130172EaE9Cf166B92E5C112FaFF',
                symbol: 'USDC',
                decimals: 6,
            },
            cusdc: {
                instanceAddress: {
                    5000: '0xc0648F28ABA385c8a1421Bbf1B59e3c474F89cB0',
                    50000: '0x0C53853379c6b1A7B74E0A324AcbDD5Eabd4981D',
                    500000: '0xf84016A0E03917cBe700D318EB1b7a53e6e3dEe1',
                    5000000: undefined,
                },
                tokenAddress: '0xcfC9bB230F00bFFDB560fCe2428b4E05F3442E35',
                symbol: 'cUSDC',
                decimals: 8,
            },
            usdt: {
                instanceAddress: {
                    100: '0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43',
                    1000: '0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD',
                    10000: '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02',
                    100000: '0x36b58F5C1969B7b6591D752ea6F5486D069010AB',
                },
                tokenAddress: '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90',
                symbol: 'USDT',
                decimals: 6,
            },
        },
    },
}
