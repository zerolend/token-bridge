import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const blastSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.BLAST_V2_TESTNET,
    contractName: 'ZeroOFT',
}

const blastContract: OmniPointHardhat = {
    eid: EndpointId.BLAST_V2_MAINNET,
    contractName: 'ZeroOFT',
}

const lineaSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.ZKCONSENSYS_V2_TESTNET,
    contractName: 'ZeroOFTAdapter',
}

const lineaContract: OmniPointHardhat = {
    eid: EndpointId.ZKCONSENSYS_V2_MAINNET,
    contractName: 'ZeroOFTAdapter',
}

const ethContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'ZeroOFT',
}

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'ZeroOFT',
}

const zkSyncContract: OmniPointHardhat = {
    eid: EndpointId.ZKSYNC_V2_MAINNET,
    contractName: 'ZeroOFT',
}

const mantaContract: OmniPointHardhat = {
    eid: EndpointId.MANTA_V2_MAINNET,
    contractName: 'ZeroOFT',
}

const xlayerContract: OmniPointHardhat = {
    eid: EndpointId.XLAYER_V2_MAINNET,
    contractName: 'ZeroOFT',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: blastContract,
        },
        {
            contract: lineaContract,
        },
        {
            contract: ethContract,
        },
        {
            contract: zkSyncContract,
        },
        {
            contract: mantaContract,
        },
        {
            contract: xlayerContract,
        },
    ],
    connections: [
        {
            from: lineaContract,
            to: blastContract,
        },
        {
            from: lineaContract,
            to: ethContract,
        },
        {
            from: lineaContract,
            to: zkSyncContract,
        },
        {
            from: lineaContract,
            to: mantaContract,
        },
        {
            from: lineaContract,
            to: xlayerContract,
        },


        {
            from: blastContract,
            to: lineaContract,
        },
        {
            from: blastContract,
            to: ethContract,
        },
        {
            from: blastContract,
            to: zkSyncContract,
        },
        {
            from: blastContract,
            to: mantaContract,
        },
        {
            from: blastContract,
            to: xlayerContract,
        },


        {
            from: ethContract,
            to: lineaContract,
        },
        {
            from: ethContract,
            to: blastContract,
        },
        {
            from: ethContract,
            to: zkSyncContract,
        },
        {
            from: ethContract,
            to: mantaContract,
        },
        {
            from: ethContract,
            to: xlayerContract,
        },


        {
            from: zkSyncContract,
            to: lineaContract,
        },
        {
            from: zkSyncContract,
            to: blastContract,
        },
        {
            from: zkSyncContract,
            to: ethContract,
        },
        {
            from: zkSyncContract,
            to: mantaContract,
        },
        {
            from: zkSyncContract,
            to: xlayerContract,
        },


        {
            from: mantaContract,
            to: lineaContract,
        },
        {
            from: mantaContract,
            to: blastContract,
        },
        {
            from: mantaContract,
            to: ethContract,
        },
        {
            from: mantaContract,
            to: zkSyncContract,
        },
        {
            from: mantaContract,
            to: xlayerContract,
        },


        {
            from: xlayerContract,
            to: lineaContract,
        },
        {
            from: xlayerContract,
            to: blastContract,
        },
        {
            from: xlayerContract,
            to: ethContract,
        },
        {
            from: xlayerContract,
            to: zkSyncContract,
        },
        {
            from: xlayerContract,
            to: mantaContract,
        },
    ],
}

export default config
