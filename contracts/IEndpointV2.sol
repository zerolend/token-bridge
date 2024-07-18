// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

interface IEndpointV2 {
    function delegates(address) external view returns (address);
}
