/**

  Script to setup OFTs for the Zai and Maha tokens on the various networks.

  npx hardhat setup-oft --token zai --network arbitrum
  npx hardhat setup-oft --token zai --network base
  npx hardhat setup-oft --token zai --network blast
  npx hardhat setup-oft --token zai --network bsc
  npx hardhat setup-oft --token zai --network linea
  npx hardhat setup-oft --token zai --network optimism
  npx hardhat setup-oft --token zai --network xlayer
  npx hardhat setup-oft --token zai --network mainnet
  npx hardhat setup-oft --token zai --network scroll

 */
import _ from "underscore";
import { config, IL0Config, IL0ConfigKey } from "./config";
import { EnforcedOptionParamStruct } from "../types/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { task } from "hardhat/config";
import { waitForTx } from "../scripts/utils";

const _fetchAndSortDVNS = (
  conf: IL0Config,
  dvns: string[] = [],
  remoteDvns: string[] = [],
  limit: number = 5000
) => {
  const commonDVNs = _.intersection(dvns, remoteDvns);
  return _.first(commonDVNs.map((dvn) => conf.dvns[dvn]).sort(), limit);
};

const _fetchOptionalDVNs = (conf: IL0Config) => {
  const dvns = Object.keys(conf.dvns);
  return _.difference(dvns, conf.requiredDVNs);
};

task(`setup-oft`, `Sets up the OFT with the right DVNs`)
  .addParam("token", "either zai or maha")
  .setAction(async ({ token }, hre) => {
    const c = config[hre.network.name];
    if (!c) throw new Error("cannot find connection");

    const contractNameToken = token === "zai" ? "ZaiStablecoin" : "MAHA";
    const contractName = `${contractNameToken}${c.contract}`;

    const remoteConnections = Object.keys(config).filter(
      (c) => c !== hre.network.name
    ) as IL0ConfigKey[];

    const ulnConfigStructType =
      "tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)";
    const configTypeExecutorStruct =
      "tuple(uint32 maxMessageSize, address executorAddress)";

    const encoder = hre.ethers.AbiCoder.defaultAbiCoder();

    const oftD = await hre.deployments.get(contractName);
    const oft = await hre.ethers.getContractAt("OFT", oftD.address);
    const endpoint = await hre.ethers.getContractAt(
      "IL0EndpointV2",
      await oft.endpoint()
    );

    const execConfigData = {
      maxMessageSize: 10000,
      executorAddress: c.libraries.executor,
    };

    const options = Options.newOptions()
      .addExecutorLzReceiveOption(200000, 0)
      .toHex()
      .toString();

    // taken from https://docs.layerzero.network/v2/developers/evm/protocol-gas-settings/default-config#setting-send-config
    for (let index = 0; index < remoteConnections.length; index++) {
      const remoteNetwork = remoteConnections[index];
      const r = config[remoteNetwork];

      console.log(
        "setting up DVN routes from",
        hre.network.name,
        "to remote network",
        remoteNetwork
      );

      const requiredDVNs = _fetchAndSortDVNS(c, c.requiredDVNs, r.requiredDVNs);
      const optionalDVNs = _fetchAndSortDVNS(
        c,
        _fetchOptionalDVNs(c),
        _fetchOptionalDVNs(r),
        5
      );

      if (requiredDVNs.length === 0 && optionalDVNs.length === 0) {
        console.log("no DVNs to set up for remote network", remoteNetwork);
        continue;
      } else {
        // console.log("using requiredDVNs:", requiredDVNs);
        // console.log("using optionalDVNs:", optionalDVNs);
      }

      const ulnConfigDataSend = {
        confirmations: c.confirmations,
        requiredDVNCount: requiredDVNs.length,
        optionalDVNCount: optionalDVNs.length,
        optionalDVNThreshold: Math.min(
          c.optionalDVNThreshold,
          optionalDVNs.length
        ),
        requiredDVNs: requiredDVNs,
        optionalDVNs: optionalDVNs,
      };

      const ulnConfigDataRecv = {
        confirmations: r.confirmations,
        requiredDVNCount: requiredDVNs.length,
        optionalDVNCount: optionalDVNs.length,
        optionalDVNThreshold: r.optionalDVNThreshold,
        requiredDVNs: requiredDVNs,
        optionalDVNs: optionalDVNs,
      };

      const setConfigParamUlnSend = {
        eid: r.eid,
        configType: 2,
        config: encoder.encode([ulnConfigStructType], [ulnConfigDataSend]),
      };

      const setConfigParamUlnRecv = {
        eid: r.eid,
        configType: 2,
        config: encoder.encode([ulnConfigStructType], [ulnConfigDataRecv]),
      };

      const setConfigParamExecutor = {
        eid: r.eid,
        configType: 1,
        config: encoder.encode([configTypeExecutorStruct], [execConfigData]),
      };

      const currentUlnSend = await endpoint.getConfig(
        oft.target,
        c.libraries.sendLib302,
        r.eid,
        2
      );

      const currentUlnRecv = await endpoint.getConfig(
        oft.target,
        c.libraries.receiveLib302,
        r.eid,
        2
      );

      // setup the send config
      if (currentUlnSend != setConfigParamUlnSend.config)
        await waitForTx(
          await endpoint.setConfig(oft.target, c.libraries.sendLib302, [
            setConfigParamUlnSend,
            setConfigParamExecutor,
          ]),
          2
        );

      // setup the receive config
      if (currentUlnRecv != setConfigParamUlnRecv.config)
        await waitForTx(
          await endpoint.setConfig(oft.target, c.libraries.receiveLib302, [
            setConfigParamUlnRecv,
          ])
        );

      // set enforced options
      const setOptions = await oft.enforcedOptions(r.eid, 1);
      if (setOptions !== options) {
        console.log("setting enforced options");
        const enforcedOptions: EnforcedOptionParamStruct[] =
          remoteConnections.map((r) => ({
            eid: config[r].eid,
            msgType: 1,
            options,
          }));
        await waitForTx(await oft.setEnforcedOptions(enforcedOptions));
      }
    }
  });