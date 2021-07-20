import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

function AppNav() {
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
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNav;
