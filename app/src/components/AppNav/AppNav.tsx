import React, { MouseEventHandler } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import toast from '../Toast/Toast';
import './AppNav.css'

type Props = {
  accounts: string[];
  chain: string;
};

function AppNav({ accounts, chain }: Props) {
  const getAccount = () => {
    if (accounts.length === 0)
      return "";
    const account = accounts[0];
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }
  const onClickAccount = () => {
    navigator.clipboard.writeText(accounts[0]);
    toast("Address copied to clipboard");
  }
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Energy Web Dapp showcase</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#ens">ENS</Nav.Link>
          <Nav.Link href="#did">DID</Nav.Link>
          <Nav.Link href="#iam">IAM</Nav.Link>
        </Nav>
        <Nav className="connection-info">
          {accounts.length > 0 && (<p className="account-info text-muted" onClick={onClickAccount}>{getAccount()}</p>)}
          {chain && (<p className="chain-info text-info">{chain}</p>)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNav;
