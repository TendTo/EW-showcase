import { render, screen } from '@testing-library/react';
import React, { useRef } from 'react';
import Web3 from 'web3';
import AppNav from './AppNav';

test('renders AppNav react link', () => {
  render(<AppNav account={"testAccount"} chain={"testChain"}/>);
  const linkElement = screen.getByText(/Energy Web Dapp showcase/i);
  expect(linkElement).toBeInTheDocument();
});
