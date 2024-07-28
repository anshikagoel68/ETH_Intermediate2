// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        // Deposit initial balance if provided during deployment
        if (initBalance > 0) {
            balance += initBalance;
        }
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    // Deposit function updated to handle Ether transactions
    function deposit() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        
        // Update balance with received Ether
        balance += msg.value;

        // Ensure balance updated correctly
        assert(balance == _previousBalance + msg.value);

        // Emit event with the deposited amount
        emit Deposit(msg.value);
    }

    // Custom error for insufficient balance during withdrawal
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        // Check for sufficient balance
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Transfer the amount to the owner
        owner.transfer(_withdrawAmount);

        // Ensure balance updated correctly
        assert(balance == (_previousBalance - _withdrawAmount));

        // Emit event with the withdrawn amount
        emit Withdraw(_withdrawAmount);
    }
}

