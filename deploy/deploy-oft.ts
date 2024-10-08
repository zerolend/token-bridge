import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployContract } from "../scripts/utils";
import { config } from "../tasks/config";
import assert from "assert";

async function main(hre: HardhatRuntimeEnvironment) {
  assert(hre.network.name !== "linea");
  const contract = await deployContract(
    hre,
    "LayerZeroCustomOFT",
    ["ZeroLend", "ZERO", config[hre.network.name].libraries.endpoint],
    "ZeroTokenOFT"
  );

  const zai = await hre.ethers.getContractAt(
    "LayerZeroCustomOFT",
    contract.address
  );

  if (!(await hre.deployments.getOrNull("ZeroToken"))) {
    await hre.deployments.save("ZeroToken", {
      abi: zai.interface.format(true),
      address: contract.address,
    });
  }
}

main.tags = ["ZeroTokenOFT"];
export default main;
