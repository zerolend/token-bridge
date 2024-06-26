// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import '@layerzerolabs/toolbox-hardhat'
import '@nomiclabs/hardhat-ethers'
import '@typechain/hardhat'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import '@nomicfoundation/hardhat-verify'
import { config } from 'dotenv'
import { HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

config()

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

export default {
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        mainnet: {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: 'https://ethereum-rpc.publicnode.com',
            accounts,
        },
        blast: {
            eid: EndpointId.BLAST_V2_MAINNET,
            url: 'https://blast.blockpi.network/v1/rpc/public',
            accounts,
        },
        linea: {
            eid: EndpointId.ZKCONSENSYS_V2_MAINNET,
            url: 'https://rpc.linea.build',
            accounts,
        },
        zkSync: {
            eid: EndpointId.ZKSYNC_V2_MAINNET,
            url: 'https://mainnet.era.zksync.io',
            accounts,
            zksync: true,
        },
        manta: {
            eid: EndpointId.MANTA_V2_MAINNET,
            url: 'https://pacific-rpc.manta.network/http',
            accounts,
        },
        xlayer: {
            eid: EndpointId.XLAYER_V2_MAINNET,
            url: 'https://rpc.xlayer.tech',
            accounts,
        },
    },
    namedAccounts: {
        deployer: {
            default: 3, // wallet address of index[0], of the mnemonic in .env
        },
    },
    // etherscan: {
    //     apiKey: {
    //         manta: process.env.ETHERSCAN_API_KEY || '',
    //     },
    // },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
    etherscan: {
        apiKey: {
            blast: process.env.BLASTSCAN_KEY || '',
            linea: process.env.LINEASCAN_KEY || '',
            xLayer: process.env.XLAYER_KEY || '',
            mainnet: process.env.ETHERSCAN_KEY || '',
            manta: 'test',
            era: process.env.ZKSYNC_KEY || '',
        },
        customChains: [
            {
                network: 'manta',
                chainId: 169,
                urls: {
                    apiURL: 'https://pacific-explorer.manta.network/api',
                    browserURL: 'https://pacific-explorer.manta.network',
                },
            },
            {
                network: 'linea',
                chainId: 59144,
                urls: {
                    apiURL: 'https://api.lineascan.build/api',
                    browserURL: 'https://lineascan.build',
                },
            },
            {
                network: 'blast',
                chainId: 81457,
                urls: {
                    apiURL: 'https://api.blastscan.io/api',
                    browserURL: 'https://blastscan.io',
                },
            },
            {
                network: 'xLayer',
                chainId: 196,
                urls: {
                    apiURL: 'https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER',
                    browserURL: 'https://www.oklink.com/xlayer', //or https://www.oklink.com/xlayer for mainnet
                },
            },
        ],
    },
    // zksolc: {
    //     version: 'latest',
    //     settings: {
    //         // find all available options in the official documentation
    //         // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
    //     },
    // },
}
