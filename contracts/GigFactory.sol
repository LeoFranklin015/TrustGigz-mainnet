// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./GigContract.sol";

contract GigFactory {
    event GigCreated(address indexed GigContract, address indexed client, uint256 timestamp);

    function createGig(
        string calldata description,
        uint256 budget,
        uint256 deadline
    ) external payable returns (address) {
        require(msg.value == budget, "Incorrect deposit amount"); // Ensure full deposit is provided

        GigContract newGig = new GigContract{value: msg.value}(msg.sender, description, budget, deadline);
        emit GigCreated(address(newGig), msg.sender, block.timestamp);
        return address(newGig);
    }
}
