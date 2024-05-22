import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract, ContractFactory } from 'ethers'
import { deployments, ethers } from 'hardhat'

describe('ZeroOFT Test', function () {
    // Constant representing a mock Endpoint ID for testing purposes
    const eidBlast = 30243
    const eidLinea = 30183
    const eidETH = 30101
    const eidZK = 30165
    const eidManta = 30217
    const eidXLayer = 30274

    // Declaration of variables to be used in the test suite
    let zeroOFTBlast: Contract
    let zeroOFTLinea: Contract
    let zeroOFTETH: Contract
    let zeroOFTzkSync: Contract
    let zeroOFTManta: Contract
    let zeroOFTXLayer: Contract

    let EndpointV2Mock: ContractFactory
    let ownerA: SignerWithAddress
    let endpointOwner: SignerWithAddress
    let zeroLineaAdapter: Contract
    let zeroLinea: Contract

    // Before hook for setup that runs once before all tests in the block
    before(async function () {
        // ZeroLineaToken = await ethers.getContractAt('MintableERC20', '0x3511257bdaee658918e832cacd0f9e11c3127590')
        zeroOFTBlast = await ethers.getContractAt('ZeroOFT', '0xBBAA35539FCc9E03BdF7A2Ffe4bdc77E2b0eB559')
        zeroOFTLinea = await ethers.getContractAt('ZeroOFTAdapter', '0x357f93E17FdabEcd3fEFc488a2d27dff8065d00f')
        zeroOFTETH = await ethers.getContractAt('ZeroOFT', '0xC4d70105AF3904a90649323ef34C8b58FC19634f')
        zeroOFTzkSync = await ethers.getContractAt('ZeroOFT', '0x22FB836c1CdDA685Ce0911e266f6E21965Ca31a8')
        zeroOFTManta = await ethers.getContractAt('ZeroOFT', '0x39655DD658a1bB9CD090c793f83d2e355D97D94E')
        zeroOFTXLayer = await ethers.getContractAt('ZeroOFT', '0x39655DD658a1bB9CD090c793f83d2e355D97D94E')

        // Fetching the first three signers (accounts) from Hardhat's local Ethereum network
        const signers = await ethers.getSigners()
        ownerA = signers.at(0)!
        // const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2')
        // EndpointV2Mock = new ContractFactory(EndpointV2MockArtifact.abi, EndpointV2MockArtifact.bytecode, endpointOwner)
    })

    // beforeEach hook for setup that runs before each test in the block
    beforeEach(async function () {
        // await ZeroOFTBlast.setPeer(eidLinea, ethers.utils.zeroPad(ZeroOFTLinea.address, 32))
        // await ZeroOFTBlast.setPeer(eidLinea, ethers.utils.zeroPad(ZeroOFTLinea.address, 32))
        // await ZeroOFTXLayer.setPeer(eidETH, ethers.utils.zeroPad(ZeroOFTETH.address, 32))
        // await ZeroOFTXLayer.setPeer(eidXLayer, ethers.utils.zeroPad(ZeroOFTXLayer.address, 32))
        // await ZeroOFTXLayer.setPeer(eidManta, ethers.utils.zeroPad(ZeroOFTManta.address, 32))
        // const uint8Array = ethers.utils.zeroPad("0x76e49D3313014732C5e9A0E4Fb3472F8C2e82cD6", 32)
        // let hexString = Array.from(uint8Array)
        //     .map(byte => byte.toString(16).padStart(2, '0'))
        //     .join('');
        // // Ensure the string is padded to 64 characters
        // hexString = hexString.padEnd(64, '0');
        // console.log(hexString)
    })

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {
        const confirmations = 10 // Arbitrary; Varies per remote chain
        const optionalDVNThreshold = 0

        // Linea
        // const requiredDVNs: string[] = ['0x7fe673201724925B5c477d4E1A4Bd3E954688cF5'];
        // const optionalDVNs: string[] = [];

        // Blast
        const requiredDVNs: string[] = ['0x70BF42C69173d6e33b834f59630DAC592C70b369']
        const optionalDVNs: string[] = []

        // ETH
        // const requiredDVNs: string[] = ['0x380275805876Ff19055EA900CDb2B46a94ecF20D'];
        // const optionalDVNs: string[] = [];

        // zkSync
        // const requiredDVNs: string[] = ['0x1253E268Bc04bB43CB96D2F7Ee858b8A1433Cf6D'];
        // const optionalDVNs: string[] = [];

        // Manta
        // const requiredDVNs: string[] = ['0x31F748a368a893Bdb5aBB67ec95F232507601A73'];
        // const optionalDVNs: string[] = [];

        // XLayer
        // const requiredDVNs: string[] = ['0xDd7B5E1dB4AaFd5C8EC3b764eFB8ed265Aa5445B'];
        // const optionalDVNs: string[] = [];

        const requiredDVNCount = requiredDVNs.length
        const optionalDVNCount = optionalDVNs.length
        const configTypeUln = 2 // As defined for CONFIG_TYPE_ULN

        const ulnConfigStructType =
            'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)'

        // const ulnConfigData = {
        //     confirmations: 0,
        //     requiredDVNCount: 0,
        //     optionalDVNCount: 0,
        //     optionalDVNThreshold: 0,
        //     requiredDVNs: [],
        //     optionalDVNs: [],
        // };
        const ulnConfigData = {
            confirmations,
            requiredDVNCount,
            optionalDVNCount,
            optionalDVNThreshold,
            requiredDVNs,
            optionalDVNs,
        }

        const ulnConfigEncoded = ethers.utils.defaultAbiCoder.encode([ulnConfigStructType], [ulnConfigData])

        const setConfigParamUlnA = {
            eid: eidBlast, // Replace with your remote chain's endpoint ID (source or destination)
            configType: configTypeUln,
            config: ulnConfigEncoded,
        }
        const setConfigParamUlnB = {
            eid: eidLinea, // Replace with your remote chain's endpoint ID (source or destination)
            configType: configTypeUln,
            config: ulnConfigEncoded,
        }
        // const setConfigParamUlnC = {
        //     eid: eidETH, // Replace with your remote chain's endpoint ID (source or destination)
        //     configType: configTypeUln,
        //     config: ulnConfigEncoded,
        // };
        // const setConfigParamUlnD = {
        //     eid: eidZK, // Replace with your remote chain's endpoint ID (source or destination)
        //     configType: configTypeUln,
        //     config: ulnConfigEncoded,
        // };
        // const setConfigParamUlnE = {
        //     eid: eidManta, // Replace with your remote chain's endpoint ID (source or destination)
        //     configType: configTypeUln,
        //     config: ulnConfigEncoded,
        // };
        // const setConfigParamUlnF = {
        //     eid: eidXLayer, // Replace with your remote chain's endpoint ID (source or destination)
        //     configType: configTypeUln,
        //     config: ulnConfigEncoded,
        // };

        // const messageLibAddresses = ['0x32042142dd551b4ebe17b6fed53131dd4b4eea06', '0xE22ED54177CE1148C557de74E4873619e6c6b205']; //Linea
        const messageLibAddresses = [
            '0xc1b621b18187f74c8f6d52a6f709dd2780c09821',
            '0x377530cda84dfb2673bf4d145dcf0c4d7fdcb5b6',
        ] //Blast
        // const messageLibAddresses = ['0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1', '0xc02Ab410f0734EFa3F14628780e6e695156024C2']; // ETH
        // const messageLibAddresses = ['0x07fD0e370B49919cA8dA0CE842B8177263c0E12c', '0x04830f6deCF08Dec9eD6C3fCAD215245B78A59e1']; //ZK
        // const messageLibAddresses = ['0xd1654c656455e40e2905e96b6b91088ac2b362a2', '0xC1EC25A9e8a8DE5Aa346f635B33e5B74c4c081aF']; //Manta
        // const messageLibAddresses = ['0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043', '0x2367325334447C5E1E0f1b3a6fB947b262F58312']; //XLayer

        // let endpointContract = await ethers.getContractAt('EndpointV2', "0x1a44076050125825900e736c501f859c50fe728c")
        // 0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF

        let tx
        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2')

        const endpointContract: any = await ethers.getContractAtFromArtifact(
            EndpointV2MockArtifact,
            '0x1a44076050125825900e736c501f859c50fE728c'
        )

        for (const libAddress of messageLibAddresses) {
            tx = await endpointContract.setConfig('0xBBAA35539FCc9E03BdF7A2Ffe4bdc77E2b0eB559', libAddress, [
                setConfigParamUlnA, // blast
                setConfigParamUlnB, // linea
                // setConfigParamUlnC, // ETH
                // setConfigParamUlnD, // zkSync
                // setConfigParamUlnE, // Manta
                // setConfigParamUlnF, // XLayer
            ])

            await tx.wait()
        }
        console.log('Done')
    })
})
