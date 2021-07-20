const todoList = artifacts.require('./TodoList.sol');

contract('TodoList', function (accounts) {

    before(async function () {
        this.todoList = await todoList.deployed();
    });

    it('deploy successfully', async function () {
        assert.notEqual(this.todoList.address, undefined);
        assert.notEqual(this.todoList.address, "");
        assert.notEqual(this.todoList.address, null);
        assert.notEqual(this.todoList.address, 0x0);
    });

    it('initial state is as expected', async function () {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(taskCount);

        assert.equal(taskCount.toNumber(), 1);
        assert.equal(task[0], taskCount.toNumber());
        assert.equal(task[1], "Initial task");
        assert.equal(task[2], false);
    });

    it('addTask successfully', async function () {
        const taskCountBefore = await this.todoList.taskCount();

        assert.equal(taskCountBefore.toNumber(), 1);

        const result = await this.todoList.addTask("Test task");
        const event = result.logs[0].args;
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(taskCount);
    
        assert.equal(taskCount.toNumber(), 2);
        assert.equal(task[0], taskCount.toNumber());
        assert.equal(task[1], "Test task");
        assert.equal(task[2], false);

        assert.equal(event.id.toNumber(), taskCount.toNumber());
        assert.equal(event.text, "Test task");
        assert.equal(event.done, false);
    });
})