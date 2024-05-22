// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { OFTAdapter } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTAdapter.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ZeroOFTAdapter is OFTAdapter {
    constructor(
        address _token, // a deployed, already existing ERC20 token address
        address _layerZeroEndpoint // local endpoint address
    ) OFTAdapter(_token, _layerZeroEndpoint, msg.sender) Ownable(msg.sender) {}

    function recall(address _token) external onlyOwner {
        IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
    }
}
