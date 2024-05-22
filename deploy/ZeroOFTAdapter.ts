import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'ZeroOFTAdapter'

const deploy: DeployFunction = async (hre) => {
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
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: ['0x78354f8dccb269a615a7e0a24f9b0718fdc3c7a7', endpointV2Deployment.address],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
    // 0x39655DD658a1bB9CD090c793f83d2e355D97D94E
    // Linea Adapter: 0x357f93E17FdabEcd3fEFc488a2d27dff8065d00f
    // Blast Adapter: 0xBBAA35539FCc9E03BdF7A2Ffe4bdc77E2b0eB559
    // Testnet
}

deploy.tags = [contractName]

export default deploy
