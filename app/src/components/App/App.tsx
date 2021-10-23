import { Signer } from 'ethers';
import React, { Suspense, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
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
  const [signer, setSigner] = useState<Signer>();
  const [account, setAccount] = useState<string>("");
  const [chain, setChain] = useState<string>("");

  const loggedIn = signer !== undefined && account.length > 0 && allowedChain.includes(chain);

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
                <ENS signer={signer}></ENS>
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
                <Marketplace signer={signer} account={account}/>
              </Route>
              <Route path="/" component={Home} />
            </Switch>
            :
            <Login chain={chain} setAccount={setAccount} setSigner={setSigner} setChain={setChain}></Login>
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
