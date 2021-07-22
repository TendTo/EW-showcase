import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import AppNav from '../AppNav/AppNav';
import ENS from '../ENS/ENS';
import Home from '../Home/Home';
import IAM from '../IAM/IAM';
import Login from '../Login/Login';
import './App.css';

function App() {
  const allowedChain = ["volta"];
  const [web3, setWeb3] = useState<Web3>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chain, setChain] = useState<string>("");

  const showMain = () => web3 !== undefined && accounts.length > 0 && allowedChain.includes(chain);

  console.log("APP");

  return (
    <>
      <Router>
        <AppNav accounts={accounts} chain={chain}></AppNav>
        <main className="container-fluid">
          {showMain() && (
            <Switch>
              <Route path="/ens" exact>
                <ENS web3={web3}></ENS>
              </Route>
              <Route path="/iam" exact>
                <IAM></IAM>
              </Route>
              <Route path="/" component={Home} />
            </Switch>)}
          {!showMain() && (
            <Login web3={web3} chain={chain} setAccounts={setAccounts} setWeb3={setWeb3} setChain={setChain}></Login>
          )}
        </main>
      </Router>
    </>
  );
}

export default App;
