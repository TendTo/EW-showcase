// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint256 public taskCount;

    struct Task {
        uint256 id;
        string text;
        bool done;
    }

    mapping(uint256 => Task) public tasks;

    event TaskAdded(uint256 id, string text, bool done);

    constructor() public {
        taskCount = 0;
        addTask("Initial task");
    }

    function addTask(string memory _text) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _text, false);
        emit TaskAdded(taskCount, _text, false);
    }
}
