import React, { Suspense, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { appContextData, AppContextProvider } from '../../context/appContext';
import { allowedChains } from '../../types/constants';
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
  const [logged, setLogged] = useState(false);
  const login = (newContext: appContextData) => {
    setLogged(newContext.signer !== undefined
      && newContext.address !== ""
      && allowedChains.includes(newContext.chainName));
  }
  return (
    <Suspense fallback={
      <Container fluid className="text-center">
        <Spinner animation="grow"></Spinner>
      </Container>}
    >
      <Router>
        <AppContextProvider>
          <header>
            <AppNav />
          </header>
          <main role="main" className="container-fluid">
            {logged ?
              <Switch>
                <Route path="/ens" exact>
                  <ENS />
                </Route>
                <Route path="/did" exact>
                  <DID />
                </Route>
                <Route path="/references" exact>
                  <References />
                </Route>
                <Route path="/iam" exact>
                  <IAM />
                </Route>
                <Route path="/marketplace" exact>
                  <Marketplace />
                </Route>
                <Route path="/" component={Home} />
              </Switch>
              :
              <Login login={login} />
            }
          </main>
        </AppContextProvider>
        <footer>
          <AppFooter></AppFooter>
        </footer>
      </Router>
    </Suspense >
  );
}

export default App;
