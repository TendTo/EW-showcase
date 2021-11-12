# Energy Web DApp showcase

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://tendto.github.io/EW-showcase/)
![CI/CD](https://github.com/TendTo/EW-showcase/workflows/Production/badge.svg)
[![codecov](https://codecov.io/gh/TendTo/EW-showcase/branch/master/graph/badge.svg?token=WYZ1RF09ZN)](https://codecov.io/gh/TendTo/EW-showcase)

## Project structure 📁
```py
.
├── app                     # Showcase DApp front-end (React)
├── contract                # Smart contract to deploy to the Energy Web Testnet - Volta (Truffle)
├── docs                    # Documentation files and report of the project (LateX)
├── node                    # Configuration for a client node on the Energy Web Testnet - Volta (openehtereum)
├── .gitattribute           # .gitattribute file
├── .gitignore              # .gitignore file
├── LICENSE                 # Licence of the project
└── README.md               # This file
```

## Brief description 📝
Sample DApp meant to showcase the Energy Web's chain capabilities.

## Docs (in italian) 📚
- [Ew summary](./docs/EW_summary.pdf)
- [Ew blockchain](./docs/EW_blockchain.pdf)
- [Tesi](./docs/Tesi.pdf)

## APP: Quickstart local 💻

### System requirements
- [node 16.2.0](https://nodejs.org/)
- _OPTIONAL_ [MetaMask](https://metamask.io/)

### Steps
- In the _app_ directory, first run
    - `npm install`
    - `npx patch-package`
- If any change is made on the abis stored in the _src/asset/json_ folder, you may want to run `npm run typechain` to update the type files. WARNING: doing so may remove some facilities I added manually
- If you want to test the app for yourself you will need the [MetaMask browser extension](https://metamask.io/) connected to the [Volta test-net](https://energyweb.atlassian.net/wiki/spaces/EWF/pages/703201459/Volta+Connecting+to+Remote+RPC+and+Metamask). Make sure to have some [Volta token](https://voltafaucet.energyweb.org/) available.

### Available scripts
#### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

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

#### `npm test`
Launches the test runner that executes all the tests in the _test_ folder.  
They are tailored to test the **Marketplace** contract.

#### `npm run develop`
Opens an interactive console that also spawns a development blockchain

#### `npm run console`
Opens an interactive console that connects to the provided network (the first if not specified)

## Contracts currently deployed on the [Volta blockchain](https://volta-explorer.energyweb.org/) 📜
- Energy Web's [Identity Manager](https://volta-explorer.energyweb.org/address/0x84d0c7284A869213CB047595d34d6044d9a7E14A/transactions)
- [Marketplace](https://volta-explorer.energyweb.org/address/0x37dfeF9b9c56A81927Dfa73994E2fb23c3dd4b37/transactions)

## Resources 📖
- [Energy Web](https://www.energyweb.org/)
- [Switchboard](https://switchboard.energyweb.org/)
- [Energy Web Wiki](https://energyweb.atlassian.net/wiki/home)
- [Energy Web paper](https://energyweb.org/reports/the-energy-web-chain/)

## Made with 🔧
- [react](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [web3](https://github.com/ChainSafe/web3.js)
- [typechain](https://github.com/dethcrypto/TypeChain)
- [Darkly bootstrap theme](https://bootswatch.com/darkly/)
- [truffle](https://www.trufflesuite.com/truffle)
- [Openzeppelin contracts](https://openzeppelin.com/contracts/)
- [Volta explorer API](https://volta-explorer.energyweb.org/api-docs)
- [SVGBackgrounds](https://www.svgbackgrounds.com/)
- [PlantUML](https://plantuml.com/)
- [template-tesi-latex](https://github.com/UNICT-DMI/template-tesi-latex)
- [ethers](https://github.com/ethers-io/ethers.js/#readme)
