import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'ZeroOFT'

const deploy: DeployFunction = async (hre) => {
    console.log('Deploy')
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   fuji: {
    //     ...
    //     eid: EndpointId.AVALANCHE_V2_TESTNET
    //   }
    // }
    // const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            // 'TEST', // name
            // 'TEST', // symbol
            '0x1a44076050125825900e736c501f859c50fE728c', // LayerZero's EndpointV2 address
            // deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
    // Blast: 0x39655DD658a1bB9CD090c793f83d2e355D97D94E
    // Linea: 0x39655DD658a1bB9CD090c793f83d2e355D97D94E
    // ETH: 0xC4d70105AF3904a90649323ef34C8b58FC19634f
    // zkSync: 0x7a77B4003DC499c82D4A7A7e8fF340cA8308f9eb
    // Manta: 0x39655DD658a1bB9CD090c793f83d2e355D97D94E
    // XLayer: 0x39655DD658a1bB9CD090c793f83d2e355D97D94E
}

deploy.tags = [contractName]

export default deploy
