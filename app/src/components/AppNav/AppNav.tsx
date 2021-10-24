import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import toast from '../Toast/Toast';
import './AppNav.css';
import { AppContext } from '../../context/appContext';

function AppNav() {
  const { address, chainName } = useContext(AppContext).state;
  const { t } = useTranslation();
  const shortAccount = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const onClickAccount = () => {
    navigator.clipboard.writeText(address);
    toast(t('NAV.ADDRESS_COPIED'));
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
      <Navbar.Brand href="#home">Energy Web Dapp showcase</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#ens">ENS</Nav.Link>
          <Nav.Link href="#did">DID</Nav.Link>
          <Nav.Link href="#iam">IAM</Nav.Link>
          <Nav.Link href="#marketplace">Marketplace</Nav.Link>
          <Nav.Link href="#references">{t('NAV.REFERENCES')}</Nav.Link>
        </Nav>
        <Nav className="connection-info">
          {address && <p className="account-info" onClick={onClickAccount}>{shortAccount}</p>}
          {chainName && (<p className="chain-info">{chainName}</p>)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNav;
