// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// IERC20 public usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);


contract Lending is ReentrancyGuard {
    IERC20 public usdt;
    uint public rate;
    address payable public owner;
    mapping (address => uint) borrowers;
    

    event Borrow(address indexed borrower, uint amount);
    event Repay(address indexed borrower, uint amount);

    constructor(uint _rate, IERC20 _usdt) payable {
        require(
            _rate > 0,
            "Rate should be greater than 0"
        );

        rate = _rate;
        usdt = _usdt;
        owner = payable(msg.sender);
    }

    function borrow(uint amount) public nonReentrant {
        require(borrowers[msg.sender] == 0, "You have already borrowed");
        require(usdt.balanceOf(address(this)) >= amount, "Sorry, we don't have enough funds to lend you");
        usdt.transfer(msg.sender, amount);
        borrowers[msg.sender] = amount;
        emit Borrow(msg.sender, amount);
    }

    function repay() public nonReentrant {
        uint borrowedAmount = borrowers[msg.sender];
        require(borrowedAmount > 0, "You haven't borrowed");

        uint repayAmount = borrowedAmount * (100 + rate) / 100;
        require(usdt.balanceOf(msg.sender) >= repayAmount, "You do not have enough USDT to repay");

        usdt.transferFrom(msg.sender, address(this), repayAmount);
        delete borrowers[msg.sender];
        emit Repay(msg.sender, repayAmount);
    }

    function withdraw(uint amount) public nonReentrant {
        require(msg.sender == owner, "You aren't the owner");
        require(usdt.balanceOf(address(this)) > amount, "Not enough funds");
        usdt.transfer(msg.sender, amount);
    }

    function deposit(uint amount) public nonReentrant {
        require(usdt.balanceOf(msg.sender) >= amount, "You do not have enough USDT");
        usdt.transferFrom(msg.sender, address(this), amount);
    }

}