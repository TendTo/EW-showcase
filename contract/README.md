## CONTRACT: Quickstart local 💻

### System requirements
- [node 16.2.0](https://nodejs.org/)
- _OPTIONAL_ [ganache](https://www.trufflesuite.com/ganache)
- _OPTIONAL_ [MetaMask](https://metamask.io/)

### Setup steps
- In the _app_ directory, first run
    - `npm install`
- Make sure to edit the _truffle-config.js_ file to best fit your needs. 
    - If you plan on using ganache, edit the **networks/development** configuration to point to your ganache server
    - You can also use another network, but you may need to create a _.secret_ file containing the passphrase of your wallet and use the MetaMask provider
    - It is possible to connect using an [Infura](https://infura.io/) node
    - Check [here](https://www.trufflesuite.com/docs/truffle/reference/configuration) for more information about the  _truffle-config.js_ configuration
- With any command you can change the network you are using by providing the `--network <network_name>` flag

### Available scripts
#### `npm run compile`
Compiles all contracts and stores their json representation in the _build_ folder.

#### `npm run migrate`
Runs the migration scripts in the _migrations_ folder, with the purpose of deploying the contracts on the blockchain.
You can add `-- --network <network-name>` to select which 

#### `npm test`
Launches the test runner that executes all the tests in the _test_ folder.  
They are tailored to test the **Marketplace** contract.

#### `npm run develop`
Opens an interactive console that also spawns a development blockchain

#### `npm run console`
Opens an interactive console that connects to the provided network (the first if not specified)