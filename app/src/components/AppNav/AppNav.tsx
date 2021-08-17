import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import toast from '../Toast/Toast';
import './AppNav.css'

type Props = {
  account: string;
  chain: string;
};

function AppNav({ account, chain }: Props) {
  const { t } = useTranslation();
  const shortAccount = `${account.slice(0, 6)}...${account.slice(-4)}`;

  const onClickAccount = () => {
    navigator.clipboard.writeText(account);
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
          <Nav.Link href="#references">{t('NAV.REFERENCES')}</Nav.Link>
        </Nav>
        <Nav className="connection-info">
          {account && <p className="account-info" onClick={onClickAccount}>{shortAccount}</p>}
          {chain && (<p className="chain-info">{chain}</p>)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNav;
