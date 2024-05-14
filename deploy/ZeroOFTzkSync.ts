// import * as hre from "hardhat";
// import { deployContract } from "./utils";

// // as well as verify it on Block Explorer if possible for the network
// export default async function () {
//   const { getNamedAccounts, deployments } = hre

//     const { deploy } = deployments
//     const { deployer } = await getNamedAccounts()

//     console.log(`Network: ${hre.network.name}`)
//     console.log(`Deployer: ${deployer}`)

//   const contractArtifactName = "ZeroOFT";
//   const constructorArguments = ["TEST", "TEST", "0xd07C30aF3Ff30D96BDc9c6044958230Eb797DDBF", deployer];
//   await deployContract(contractArtifactName, constructorArguments);
// }