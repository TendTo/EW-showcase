import { render, screen } from '@testing-library/react';
import ENS from './ENS';
import Web3 from 'web3';

test('renders ENS component', () => {
  const web3 = new Web3("http://localhost:8545");
  render(<ENS web3={web3} />);
  const linkElement = screen.getByText(/ENS.TITLE/i);
  expect(linkElement).toBeInTheDocument();
});
