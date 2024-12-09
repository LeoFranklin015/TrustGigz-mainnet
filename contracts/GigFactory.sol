// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./GigContract.sol";

contract GigFactory {
    event GigCreated(uint256 gigId ,address indexed GigContract, address indexed client , string description , uint256 budget , uint256 deadline);
    uint256 public gigId;

    constructor(){
        gigId = 0;
    }

    function createGig(
        string calldata description,
        uint256 budget,
        uint256 deadline
    ) external payable returns (address) {
        require(msg.value == budget, "Incorrect deposit amount"); // Ensure full deposit is provided
        GigContract newGig = new GigContract{value: msg.value}(msg.sender,gigId, description, budget, deadline);
        emit GigCreated(gigId,address(newGig), msg.sender,description,budget,deadline);
        gigId++;
        return address(newGig);
    }
}
