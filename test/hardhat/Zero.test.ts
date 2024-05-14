import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract, ContractFactory } from 'ethers'
import { deployments, ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

describe('ZeroOFT Test', function () {
    // Constant representing a mock Endpoint ID for testing purposes
    const eidA = 30243
    const eidB = 30183
    // Declaration of variables to be used in the test suite
    let ZeroOFT: ContractFactory
    let ZeroLineaToken: ContractFactory
    let ZeroOFTAdapter: ContractFactory
    let EndpointV2Mock: ContractFactory
    let ownerA: SignerWithAddress
    let ownerB: SignerWithAddress
    let endpointOwner: SignerWithAddress
    let zeroOFTBlast: Contract
    let zeroLineaAdapter: Contract
    let zeroLinea: Contract
    let mockEndpointV2Blast: Contract
    let mockEndpointV2Linea: Contract

    // Before hook for setup that runs once before all tests in the block
    before(async function () {
        // Contract factory for our tested contract
        //
        // We are using a derived contract that exposes a mint() function for testing purposes
        ZeroLineaToken = await ethers.getContractFactory('MintableERC20')
        ZeroOFT = await ethers.getContractFactory('ZeroOFT')
        ZeroOFTAdapter = await ethers.getContractFactory('ZeroOFTAdapter')

        // Fetching the first three signers (accounts) from Hardhat's local Ethereum network
        const signers = await ethers.getSigners()

        ownerA = signers.at(0)!
        ownerB = signers.at(1)!
        endpointOwner = signers.at(2)!

        // The EndpointV2Mock contract comes from @layerzerolabs/test-devtools-evm-hardhat package
        // and its artifacts are connected as external artifacts to this project
        //
        // Unfortunately, hardhat itself does not yet provide a way of connecting external artifacts,
        // so we rely on hardhat-deploy to create a ContractFactory for EndpointV2Mock
        //
        // See https://github.com/NomicFoundation/hardhat/issues/1040
        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock')
        EndpointV2Mock = new ContractFactory(EndpointV2MockArtifact.abi, EndpointV2MockArtifact.bytecode, endpointOwner)
    })

    // beforeEach hook for setup that runs before each test in the block
    beforeEach(async function () {
        // Deploying a mock LZEndpoint with the given Endpoint ID
        mockEndpointV2Blast = await EndpointV2Mock.deploy(eidA)
        mockEndpointV2Linea = await EndpointV2Mock.deploy(eidB)

        // Deploying two instances of MyOFT contract with different identifiers and linking them to the mock LZEndpoint
        zeroLinea = await ZeroLineaToken.connect(ownerB).deploy('Zerolend', 'ZERO');
        zeroLineaAdapter = await ZeroOFTAdapter.deploy(zeroLinea.address, mockEndpointV2Linea.address, ownerB.address)
        zeroOFTBlast = await ZeroOFT.deploy('ZeroBlast', 'ZEROB', mockEndpointV2Blast.address, ownerA.address)

        // Setting destination endpoints in the LZEndpoint mock for each MyOFT instance
        await mockEndpointV2Blast.setDestLzEndpoint(zeroLineaAdapter.address, mockEndpointV2Linea.address)
        await mockEndpointV2Linea.setDestLzEndpoint(zeroOFTBlast.address, mockEndpointV2Blast.address)

        // Setting each MyOFT instance as a peer of the other in the mock LZEndpoint
        await zeroOFTBlast.connect(ownerA).setPeer(eidB, ethers.utils.zeroPad(zeroLineaAdapter.address, 32))
        await zeroLineaAdapter.connect(ownerB).setPeer(eidA, ethers.utils.zeroPad(zeroOFTBlast.address, 32))

        // console.log(ethers.utils.zeroPad("0x76e49d3313014732c5e9a0e4fb3472f8c2e82cd6", 32))
        // const uint8Array = ethers.utils.zeroPad("0x76e49d3313014732c5e9a0e4fb3472f8c2e82cd6", 32)
        // let hexString = Array.from(uint8Array)
        //     .map(byte => byte.toString(16).padStart(2, '0'))
        //     .join('');
        
        // // Ensure the string is padded to 64 characters
        // hexString = hexString.padEnd(64, '0');
        // console.log(hexString)
    })

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {
        // // Minting an initial amount of tokens to ownerA's address in the myOFTA contract
        // const initialAmount = ethers.utils.parseEther('100')

        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('1000')

        // Defining extra message execution options for the send operation
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()

        const sendParam = [
            eidA,
            ethers.utils.zeroPad(ownerA.address, 32),
            tokensToSend,
            tokensToSend,
            options,
            '0x',
            '0x',
        ]

        // Fetching the native fee for the token send operation
        const [nativeFee] = await zeroLineaAdapter.quoteSend(sendParam, false)
console.log("Fee: ", nativeFee.toString());
        const result = await zeroLinea.allowance(ownerB.address, zeroLineaAdapter.address);
        
        if(result.toString() == "0") {
            await zeroLinea.approve(zeroLineaAdapter.address, ethers.constants.MaxUint256);
            console.log(`approved\n`);
        }

        // Executing the send operation from myOFTA contract
        await zeroLineaAdapter.connect(ownerB).send(sendParam, [nativeFee, 0], ownerB.address, { value: nativeFee })

        // Fetching the final token balances of ownerA and ownerB
        const finalBalanceA = await zeroOFTBlast.balanceOf(ownerA.address)
        const finalBalanceB = await zeroLinea.balanceOf(ownerB.address)

        // Asserting that the final balances are as expected after the send operation
        expect(finalBalanceA).eql(tokensToSend)


        // Transfer token from Blast to Linea
        const tokensToSend1 = ethers.utils.parseEther('100')
        const sendParam1 = [
            eidB,
            ethers.utils.zeroPad(ownerB.address, 32),
            tokensToSend1,
            tokensToSend1,
            options,
            '0x',
            '0x',
        ];

        await zeroOFTBlast.connect(ownerA).send(sendParam1, [nativeFee, 0], ownerA.address, {value: nativeFee})

        const finalBalanceA1 = await zeroOFTBlast.balanceOf(ownerA.address)
        const finalBalanceB1 = await zeroLinea.balanceOf(ownerB.address)
        expect(finalBalanceA1.eq(tokensToSend.sub(tokensToSend1))).to.be.true;
        console.log(finalBalanceA1)
        console.log(finalBalanceB1)
    })
})
