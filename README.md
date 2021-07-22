# Energy Web DApp showcase

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://tendto.github.io/EW-showcase/)
![CI/CD](https://github.com/TendTo/EW-showcase/workflows/Production/badge.svg)

## Project structure 📁
```py
.
├── app                     # DApp front-end (React)
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

## Quickstart local 💻

### System requirements
- [node 16.2.0](https://nodejs.org/)

### Available Scripts
In the _app_ directory, you can run:

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

## Resources 📖
- [Energy Web](https://www.energyweb.org/)
- [Switchboard](https://switchboard.energyweb.org/)
- [Energy Web Wiki](https://energyweb.atlassian.net/wiki/home)
- [Energy Web paper](https://energyweb.org/reports/the-energy-web-chain/)

## Made with 🔧
- [react](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [Darkly bootstrap theme](https://bootswatch.com/darkly/)
- [truffle](https://www.trufflesuite.com/truffle)
- [Volta explorer API](https://volta-explorer.energyweb.org/api-docs)