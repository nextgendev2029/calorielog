// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CalorieLog {

    // Struct to store each calorie entry
    struct Entry {
        uint256 calories;
        uint256 timestamp;
    }

    // Mapping: each user → list of their entries
    mapping(address => Entry[]) private logs;

    // Add a calorie entry
    function addEntry(uint256 _calories) public {
        logs[msg.sender].push(
            Entry({
                calories: _calories,
                timestamp: block.timestamp
            })
        );
    }

    // Get total calories consumed by the sender
    function getTotalCalories() public view returns (uint256 total) {
        Entry[] memory userEntries = logs[msg.sender];
        for (uint256 i = 0; i < userEntries.length; i++) {
            total += userEntries[i].calories;
        }
    }

    // Get number of entries by the sender
    function getEntryCount() public view returns (uint256) {
        return logs[msg.sender].length;
    }

    // Get a specific entry by index
    function getEntry(uint256 index) public view returns (uint256 calories, uint256 timestamp) {
        require(index < logs[msg.sender].length, "Invalid index");
        Entry memory e = logs[msg.sender][index];
        return (e.calories, e.timestamp);
    }
}