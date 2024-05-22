// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OFT} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

contract ZeroOFT is OFT {
    constructor(
        address _lzEndpoint,
        address _delegate
    ) OFT("ZeroLend", "ZERO", _lzEndpoint, _delegate) Ownable(_delegate) {
        // nothing
    }
}
