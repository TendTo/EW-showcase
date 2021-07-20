import detectEthereumProvider from '@metamask/detect-provider';
import React, { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import { provider } from 'web3-core';
import AppNav from '../AppNav/AppNav';
import ENS from '../ENS/ENS';
import Home from '../Home/Home';
import IAM from '../IAM/IAM';
import Login from '../Login/Login';
import './App.css';

function App() {
  const [web3, setWeb3] = useState<Web3>();

  useEffect(() => {
    detectEthereumProvider()
      .then((provider) => {
        if (provider !== null)
          setWeb3(new Web3(provider as provider));
      })
      .catch(console.error);
  }, [])

  return (
    <>
      <Router>
        <AppNav></AppNav>
        <main className="container-fluid">
          {web3 !== null && (
            <Switch>
              <Route path="/ens" exact>
                <ENS web3={web3}></ENS>
              </Route>
              <Route path="/iam" exact>
                <IAM></IAM>
              </Route>
              <Route path="/" component={Home} />
            </Switch>)}
          {web3 === null && (
            <Login></Login>
          )}
        </main>
      </Router>
    </>
  );
}

export default App;
