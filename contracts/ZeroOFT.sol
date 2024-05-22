// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ZeroOFT is OFT, ERC20Permit {
    mapping(address => bool) public blacklist;
    mapping(address => bool) public permitWhitelist;
    bool public enablePermitWhitelist;

    constructor(
        address _lzEndpoint
    ) OFT("ZeroLend", "ZERO", _lzEndpoint, msg.sender) Ownable(msg.sender) ERC20Permit("ZeroLend") {
        // nothing
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override {
        if (enablePermitWhitelist) require(permitWhitelist[spender], "!whitelist permit");
        super.permit(owner, spender, value, deadline, v, r, s);
    }

    function toggleWhitelist(address who, bool what) external onlyOwner {
        permitWhitelist[who] = what;
    }

    function toggleBlacklist(address who, bool what) external onlyOwner {
        blacklist[who] = what;
    }

    function toggleWhitelistPermit(bool what) external onlyOwner {
        enablePermitWhitelist = what;
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        require(!blacklist[from], "blacklisted");
        require(!blacklist[to], "blacklisted");
        super._update(from, to, value);
    }
}
