// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("USDT", "mUSDT") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}