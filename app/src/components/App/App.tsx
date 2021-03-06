import React, { Suspense, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import AppFooter from '../AppFooter/AppFooter';
import AppNav from '../AppNav/AppNav';
import DID from '../DID/DID';
import ENS from '../ENS/ENS';
import Home from '../Home/Home';
import IAM from '../IAM/IAM';
import Login from '../Login/Login';
import Marketplace from '../Marketplace/Marketplace';
import References from '../References/References';
import './App.css';

function App() {
  const allowedChain = ["volta"];
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>("");
  const [chain, setChain] = useState<string>("");

  const loggedIn = web3 !== undefined && account.length > 0 && allowedChain.includes(chain);

  return (
    <Suspense fallback={
      <Container fluid className="text-center">
        <Spinner animation="grow"></Spinner>
      </Container>}
    >
      <Router>
        <header>
          <AppNav account={account} chain={chain}></AppNav>
        </header>
        <main role="main" className="container-fluid">
          {loggedIn ?
            <Switch>
              <Route path="/ens" exact>
                <ENS web3={web3}></ENS>
              </Route>
              <Route path="/did" exact>
                <DID account={account}></DID>
              </Route>
              <Route path="/references" exact>
                <References />
              </Route>
              <Route path="/iam" exact>
                <IAM account={account}/>
              </Route>
              <Route path="/marketplace" exact>
                <Marketplace web3={web3 as Web3} account={account}/>
              </Route>
              <Route path="/" component={Home} />
            </Switch>
            :
            <Login web3={web3} chain={chain} setAccount={setAccount} setWeb3={setWeb3} setChain={setChain}></Login>
          }
        </main>
        <footer>
          <AppFooter></AppFooter>
        </footer>
      </Router>
    </Suspense>
  );
}

export default App;
